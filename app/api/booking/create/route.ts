import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createBookingReference, videoLinkFor } from "@/lib/booking-ref";
import { formatLongDate, isSlotOpen, findSlot } from "@/lib/availability";
import { findSubjectCategory } from "@/lib/subjects";
import { getTutor, formatKes } from "@/lib/data";
import { sendMail, mailShell, paragraph } from "@/lib/mailer";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";
import { storeAppend, storeSet } from "@/lib/store";
import type { BookingRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const schema = z.object({
  tutorUsername: z.string().min(1),
  subject: z.string().min(1),
  studentLevel: z.enum(["primary", "secondary", "university"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format"),
  time: z.string().min(3),
  sessionType: z.enum(["intro", "full", "bundle"]).default("full"),
  bundleSize: z.number().int().min(1).max(20).optional(),
  studentName: z.string().min(2),
  schoolYear: z.string().min(1),
  topic: z.string().min(3).max(600),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(9).max(20),
  mpesaPhone: z.string().min(9).max(20).optional(),
  role: z.enum(["student", "parent", "tutor"]).default("student"),
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
      { error: "Please check the booking details", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const tutor = getTutor(data.tutorUsername);
  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }

  if (!tutor.subjects.includes(data.subject)) {
    return NextResponse.json(
      { error: `${tutor.fullName} does not teach ${data.subject}` },
      { status: 422 },
    );
  }

  const slot = findSlot(tutor, data.date);
  if (!slot || !slot.slots.includes(data.time)) {
    return NextResponse.json({ error: "That time is not in the tutor's timetable" }, { status: 422 });
  }

  if (!isSlotOpen(tutor, data.date, slot.weekday, data.time)) {
    return NextResponse.json({ error: "That slot has already been booked" }, { status: 409 });
  }

  const captcha = await verifyRecaptcha(
    data.v2Token ?? data.recaptchaToken,
    "booking",
    clientIp(request.headers),
  );
  if (!captcha.success) {
    return NextResponse.json(
      {
        error: "We could not verify that you are human. Please complete the checkbox.",
        requiresV2: captcha.requiresV2,
        score: captcha.score,
      },
      { status: 403 },
    );
  }

  const reference = createBookingReference();
  const videoLink = videoLinkFor(reference);

  let amount = 0;
  if (data.sessionType === "full") amount = tutor.rate;
  if (data.sessionType === "bundle") {
    const bundle = tutor.bundles.find((item) => item.size === (data.bundleSize ?? 5));
    amount = bundle?.price ?? tutor.rate * (data.bundleSize ?? 5);
  }

  const record: BookingRecord = {
    reference,
    tutorUsername: tutor.username,
    tutorName: tutor.fullName,
    subject: data.subject,
    studentLevel: data.studentLevel,
    date: data.date,
    time: data.time,
    sessionType: data.sessionType,
    bundleSize: data.bundleSize,
    amount,
    paymentStatus: amount === 0 ? "free" : "pending",
    studentName: data.studentName,
    schoolYear: data.schoolYear,
    topic: data.topic,
    contactName: data.contactName,
    contactEmail: data.contactEmail.toLowerCase(),
    contactPhone: data.contactPhone,
    paymentPhone: data.mpesaPhone,
    role: data.role,
    videoLink,
    createdAt: new Date().toISOString(),
  };

  await storeSet(`nt:booking:${reference}`, record);
  await storeAppend(`nt:bookings:${record.contactEmail}`, record);

  const tutorEmail = `${tutor.username.replace("-", ".")}@nathan-tutors.co.ke`;
  const readableDate = formatLongDate(data.date);
  const category = findSubjectCategory(data.subject);

  const shared = [
    paragraph(`<strong>Reference:</strong> ${reference}`),
    paragraph(`<strong>Tutor:</strong> ${tutor.fullName} (${tutor.subjects.join(", ")})`),
    paragraph(`<strong>Subject:</strong> ${data.subject}${category ? ` (${category.name})` : ""}`),
    paragraph(`<strong>Date and time:</strong> ${readableDate} at ${data.time} EAT`),
    paragraph(
      `<strong>Session type:</strong> ${
        data.sessionType === "intro"
          ? "Free 15 minute intro session"
          : data.sessionType === "bundle"
            ? `${data.bundleSize ?? 5} session bundle`
            : "Full session (60 minutes)"
      }`,
    ),
    paragraph(`<strong>Amount:</strong> ${amount === 0 ? "Free" : formatKes(amount)}`),
    paragraph(`<strong>Student:</strong> ${data.studentName} (${data.schoolYear})`),
    paragraph(`<strong>Topic:</strong> ${data.topic}`),
    paragraph(
      `<strong>Video call link:</strong> <a href="${videoLink}" style="color:#0779e4">${videoLink}</a>`,
    ),
    paragraph("The link opens 10 minutes before the session. Please test your camera and microphone beforehand."),
  ].join("");

  const studentMail = await sendMail({
    to: record.contactEmail,
    subject: `Booking confirmed ${reference} with ${tutor.fullName}`,
    text: [
      `Your Nathan Tutors booking is confirmed. Reference ${reference}.`,
      `Tutor: ${tutor.fullName}`,
      `Subject: ${data.subject}`,
      `Date: ${readableDate} at ${data.time} EAT`,
      `Amount: ${amount === 0 ? "Free" : formatKes(amount)}`,
      `Video call: ${videoLink}`,
    ].join("\n"),
    html: mailShell("Your session is booked", shared),
  });

  const tutorMail = await sendMail({
    to: tutorEmail,
    subject: `New booking ${reference} from ${data.studentName}`,
    text: [
      `New booking ${reference}.`,
      `Student: ${data.studentName} (${data.schoolYear})`,
      `Subject: ${data.subject}`,
      `Date: ${readableDate} at ${data.time} EAT`,
      `Topic: ${data.topic}`,
      `Contact: ${data.contactName}, ${data.contactPhone}, ${record.contactEmail}`,
      `Video call: ${videoLink}`,
    ].join("\n"),
    html: mailShell("New session on your calendar", shared),
    replyTo: record.contactEmail,
  });

  const cookieStore = await cookies();
  cookieStore.set("nt_last_booking", reference, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json(
    {
      reference,
      videoLink,
      amount,
      paymentStatus: record.paymentStatus,
      summary: {
        tutorName: tutor.fullName,
        tutorUsername: tutor.username,
        tutorPhoto: tutor.photo,
        subject: data.subject,
        date: data.date,
        time: data.time,
        sessionType: data.sessionType,
        studentName: data.studentName,
        schoolYear: data.schoolYear,
        topic: data.topic,
        contactEmail: record.contactEmail,
        contactName: data.contactName,
      },
      mail: {
        student: studentMail.delivered,
        tutor: tutorMail.delivered,
      },
    },
    { status: 201 },
  );
}
