import { NextResponse } from "next/server";
import { z } from "zod";
import { mailShell, paragraph, sendMail } from "@/lib/mailer";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { storeAppend } from "@/lib/store";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(9).max(20),
  role: z.enum(["student", "parent", "tutor"]),
  studentName: z.string().max(120).optional(),
  schoolYear: z.string().max(60).optional(),
  recaptchaToken: z.string().optional(),
  v2Token: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your details", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (parsed.data.role === "parent" && !parsed.data.studentName) {
    return NextResponse.json(
      { error: "Add the name of the child you are managing" },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(
    parsed.data.v2Token || parsed.data.recaptchaToken,
    "signup",
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

  await storeAppend("nt:registrations", {
    ...parsed.data,
    recaptchaToken: undefined,
    v2Token: undefined,
    createdAt: new Date().toISOString(),
  });

  await sendMail({
    to: parsed.data.email,
    subject: "Welcome to Nathan Tutors",
    text: `Hi ${parsed.data.name}, your Nathan Tutors account is ready. Browse tutors at /tutors and book a free intro session.`,
    html: mailShell(
      "Welcome to Nathan Tutors",
      [
        paragraph(`Hi ${parsed.data.name},`),
        paragraph(
          "Your account is ready. Browse verified tutors, read reviews and book a free 15 minute intro session before you pay for anything.",
        ),
        paragraph("If you need help choosing a tutor, reply to this email or message us on WhatsApp at +254 112 272 061."),
      ].join(""),
    ),
  });

  return NextResponse.json(
    {
      message: "Account created. Sign in to manage your sessions.",
      role: parsed.data.role,
      email: parsed.data.email,
    },
    { status: 201 },
  );
}
