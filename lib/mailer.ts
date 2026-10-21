import nodemailer, { type Transporter } from "nodemailer";

export interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface MailResult {
  delivered: boolean;
  mode: "smtp" | "disabled";
  message: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: { user, pass },
    });
  }

  return transporter;
}

export async function sendMail(payload: MailPayload): Promise<MailResult> {
  const mailer = getTransporter();
  const from = process.env.SMTP_FROM ?? "Nathan Tutors <hello@nathan-tutors.co.ke>";

  if (!mailer) {
    // Preview mode: log the message instead of failing the request.
    console.info(`[nathan-tutors] mail skipped (no SMTP configured): ${payload.subject} -> ${payload.to}`);
    return {
      delivered: false,
      mode: "disabled",
      message: "SMTP is not configured in this environment.",
    };
  }

  try {
    await mailer.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html ?? undefined,
      replyTo: payload.replyTo,
    });
    return { delivered: true, mode: "smtp", message: "Sent" };
  } catch (error) {
    console.error("[nathan-tutors] mail failed", error);
    return {
      delivered: false,
      mode: "smtp",
      message: error instanceof Error ? error.message : "Mail delivery failed",
    };
  }
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;font-family:Raleway,Arial,sans-serif;font-size:15px;line-height:1.7;color:#364d59">${text}</p>`;
}

export function mailShell(title: string, body: string): string {
  return `<div style="background:#f8f9fa;padding:28px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:4px;padding:30px;border-top:4px solid #0779e4">
    <p style="font-family:Raleway,Arial,sans-serif;font-size:20px;font-weight:900;margin:0 0 6px;color:#000">Nathan Tutors</p>
    <p style="font-family:Raleway,Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#636363;margin:0 0 22px">The right tutor. Real results.</p>
    <h1 style="font-family:Raleway,Arial,sans-serif;font-size:22px;color:#000;margin:0 0 18px">${title}</h1>
    ${body}
    <p style="font-family:Raleway,Arial,sans-serif;font-size:12px;color:#939393;margin:26px 0 0">WhatsApp +254 112 272 061 | hello@nathan-tutors.co.ke</p>
  </div>
</div>`;
}
