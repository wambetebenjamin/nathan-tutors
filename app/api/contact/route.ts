import { NextResponse } from "next/server";
import { z } from "zod";
import { mailShell, paragraph, sendMail } from "@/lib/mailer";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { storeAppend } from "@/lib/store";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(9).max(20).optional().or(z.literal("")),
  topic: z.string().min(2).max(120),
  message: z.string().min(10).max(2000),
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
      { error: "Please check your message", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const captcha = await verifyRecaptcha(
    parsed.data.v2Token || parsed.data.recaptchaToken,
    "contact",
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

  await storeAppend("nt:contact", { ...parsed.data, createdAt: new Date().toISOString() });

  const adminEmail = process.env.SMTP_FROM?.match(/<(.+)>/)?.[1] ?? "admin@nathan-tutors.co.ke";

  const mail = await sendMail({
    to: adminEmail,
    subject: `Contact form: ${parsed.data.topic}`,
    text: `${parsed.data.name} (${parsed.data.email}) wrote: ${parsed.data.message}`,
    html: mailShell(
      "New message from the website",
      [
        paragraph(`<strong>${parsed.data.name}</strong> (${parsed.data.email}${parsed.data.phone ? `, ${parsed.data.phone}` : ""})`),
        paragraph(`<strong>Topic:</strong> ${parsed.data.topic}`),
        paragraph(parsed.data.message),
      ].join(""),
    ),
    replyTo: parsed.data.email,
  });

  return NextResponse.json({
    message: "Thank you, your message has reached our team. We reply within one working day.",
    delivered: mail.delivered,
  });
}
