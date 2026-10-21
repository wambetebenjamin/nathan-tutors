import { NextResponse } from "next/server";
import { z } from "zod";
import { mailShell, paragraph, sendMail } from "@/lib/mailer";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { storeAppend } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_CV_BYTES = 5 * 1024 * 1024;
const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9).max(20),
  email: z.string().email(),
  subjects: z.array(z.string()).min(1, "Choose at least one subject"),
  levels: z.array(z.enum(["primary", "secondary", "university"])).min(1),
  qualification: z.string().min(2),
  university: z.string().min(2),
  experienceYears: z.coerce.number().min(0).max(60),
  rate: z.coerce.number().min(300).max(20000),
  languages: z.array(z.string()).min(1),
  philosophy: z.string().min(40).max(2000),
  recaptchaToken: z.string().optional(),
  v2Token: z.string().optional(),
});

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart form submission" }, { status: 400 });
  }

  const raw = {
    fullName: String(form.get("fullName") ?? ""),
    phone: String(form.get("phone") ?? ""),
    email: String(form.get("email") ?? ""),
    subjects: form.getAll("subjects").map(String).filter(Boolean),
    levels: form.getAll("levels").map(String),
    qualification: String(form.get("qualification") ?? ""),
    university: String(form.get("university") ?? ""),
    experienceYears: String(form.get("experienceYears") ?? ""),
    rate: String(form.get("rate") ?? ""),
    languages: form.getAll("languages").map(String).filter(Boolean),
    philosophy: String(form.get("philosophy") ?? ""),
    recaptchaToken: String(form.get("recaptchaToken") ?? ""),
    v2Token: String(form.get("v2Token") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the application details", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(
    raw.v2Token || raw.recaptchaToken,
    "tutor_application",
    clientIp(request.headers),
  );
  if (!captcha.success) {
    return NextResponse.json(
      {
        error: "We could not verify that you are human. Please complete the checkbox.",
        requiresV2: captcha.requiresV2,
      },
      { status: 403 },
    );
  }

  const cv = form.get("cv");
  let cvInfo: { name: string; size: number; type: string; url: string | null } | null = null;

  if (cv instanceof File && cv.size > 0) {
    if (cv.size > MAX_CV_BYTES) {
      return NextResponse.json({ error: "Your CV must be 5 MB or smaller" }, { status: 413 });
    }
    if (!ACCEPTED.includes(cv.type)) {
      return NextResponse.json({ error: "Upload your CV as a PDF or Word document" }, { status: 415 });
    }

    let url: string | null = null;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(
          `cvs/${Date.now()}-${cv.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
          cv,
          { access: "public", token: process.env.BLOB_READ_WRITE_TOKEN, addRandomSuffix: true },
        );
        url = blob.url;
      } catch (error) {
        console.error("[nathan-tutors] CV upload failed", error);
      }
    }

    cvInfo = { name: cv.name, size: cv.size, type: cv.type, url };
  } else {
    return NextResponse.json({ error: "Please attach your CV" }, { status: 422 });
  }

  const application = {
    id: `app-${Date.now()}`,
    ...parsed.data,
    recaptchaToken: undefined,
    v2Token: undefined,
    cv: cvInfo,
    submittedAt: new Date().toISOString(),
  };

  await storeAppend("nt:applications", application);

  const adminEmail = process.env.SMTP_FROM?.match(/<(.+)>/)?.[1] ?? "admin@nathan-tutors.co.ke";
  const summary = [
    paragraph(`<strong>Name:</strong> ${parsed.data.fullName}`),
    paragraph(`<strong>Email:</strong> ${parsed.data.email}`),
    paragraph(`<strong>Phone:</strong> ${parsed.data.phone}`),
    paragraph(`<strong>Subjects:</strong> ${parsed.data.subjects.join(", ")}`),
    paragraph(`<strong>Levels:</strong> ${parsed.data.levels.join(", ")}`),
    paragraph(`<strong>Qualification:</strong> ${parsed.data.qualification}, ${parsed.data.university}`),
    paragraph(`<strong>Experience:</strong> ${parsed.data.experienceYears} years`),
    paragraph(`<strong>Proposed rate:</strong> KES ${parsed.data.rate} per hour`),
    paragraph(`<strong>Languages:</strong> ${parsed.data.languages.join(", ")}`),
    paragraph(`<strong>Teaching philosophy:</strong> ${parsed.data.philosophy}`),
    paragraph(`<strong>CV:</strong> ${cvInfo.url ?? `${cvInfo.name} (stored locally, no Blob token configured)`}`),
  ].join("");

  const adminMail = await sendMail({
    to: adminEmail,
    subject: `Tutor application: ${parsed.data.fullName}`,
    text: `${parsed.data.fullName} applied to tutor ${parsed.data.subjects.join(", ")}.`,
    html: mailShell("New tutor application", summary),
    replyTo: parsed.data.email,
  });

  const applicantMail = await sendMail({
    to: parsed.data.email,
    subject: "We received your Nathan Tutors application",
    text: `Thank you ${parsed.data.fullName}. Our team reviews tutor applications within three working days.`,
    html: mailShell(
      "Application received",
      [
        paragraph(`Thank you, ${parsed.data.fullName}.`),
        paragraph(
          "Our academic team reviews every application within three working days. We will contact you on WhatsApp or email to schedule a short interview and a subject check.",
        ),
        paragraph(`Subjects applied for: ${parsed.data.subjects.join(", ")}`),
      ].join(""),
    ),
  });

  return NextResponse.json(
    {
      applicationId: application.id,
      message: "Application received. Our team reviews tutor applications within three working days.",
      mail: { admin: adminMail.delivered, applicant: applicantMail.delivered },
    },
    { status: 201 },
  );
}
