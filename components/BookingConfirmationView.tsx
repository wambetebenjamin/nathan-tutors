"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  Video,
} from "lucide-react";
import { formatLongDate } from "@/lib/availability";
import { calendarLink } from "@/lib/booking-ref";
import { formatKes, STUDENT_LEVEL_LABELS, whatsappHref } from "@/lib/data";
import type { BookingRecord, StudentLevel } from "@/lib/types";

const STORAGE_PREFIX = "nt_booking_";

function parseTimeToUtc(date: string, time: string, offsetHours = 3): Date {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  const base = new Date(`${date}T00:00:00.000Z`);
  if (!match) return base;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate(),
      hours - offsetHours,
      minutes,
    ),
  );
}

function toCalendarStamp(value: Date): string {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function BookingConfirmationView({
  reference,
  initial,
}: {
  reference: string;
  initial: BookingRecord | null;
}) {
  const [booking, setBooking] = useState<BookingRecord | null>(initial);
  const [qr, setQr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (booking) return;
    try {
      const raw = window.sessionStorage.getItem(`${STORAGE_PREFIX}${reference}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      setBooking({
        reference,
        tutorUsername: String(parsed.tutorUsername ?? ""),
        tutorName: String(parsed.tutorName ?? ""),
        subject: String(parsed.subject ?? ""),
        studentLevel: (parsed.studentLevel as StudentLevel) ?? "secondary",
        date: String(parsed.date ?? ""),
        time: String(parsed.time ?? ""),
        sessionType: (parsed.sessionType as BookingRecord["sessionType"]) ?? "full",
        bundleSize: parsed.bundleSize as number | undefined,
        amount: Number(parsed.amount ?? 0),
        paymentStatus: "pending",
        studentName: String(parsed.studentName ?? ""),
        schoolYear: String(parsed.schoolYear ?? ""),
        topic: String(parsed.topic ?? ""),
        contactName: String(parsed.contactName ?? ""),
        contactEmail: String(parsed.contactEmail ?? ""),
        contactPhone: String(parsed.contactPhone ?? ""),
        role: "student",
        videoLink: `https://meet.nathan-tutors.co.ke/${reference.toLowerCase()}`,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // nothing stored in this browser
    }
  }, [booking, reference]);

  useEffect(() => {
    if (!booking) return;
    let cancelled = false;
    import("qrcode")
      .then((mod) =>
        mod.toDataURL(booking.videoLink, {
          width: 264,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
        }),
      )
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => setQr(null));
    return () => {
      cancelled = true;
    };
  }, [booking]);

  const calendar = useMemo(() => {
    if (!booking) return "";
    const start = parseTimeToUtc(booking.date, booking.time);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return calendarLink({
      title: `${booking.subject} lesson with ${booking.tutorName}`,
      start: toCalendarStamp(start),
      end: toCalendarStamp(end),
      details: `Nathan Tutors booking ${booking.reference}. Video call: ${booking.videoLink}. Topic: ${booking.topic}`,
      location: booking.videoLink,
    });
  }, [booking]);

  const downloadPdf = async () => {
    if (!booking) return;
    setDownloading(true);
    setMessage("");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 56;
      let y = 64;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Nathan Tutors", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(99, 99, 99);
      doc.text("The right tutor. Real results.", margin, y + 16);
      doc.setTextColor(0, 0, 0);

      y += 54;
      doc.setDrawColor(7, 121, 228);
      doc.setLineWidth(3);
      doc.line(margin, y, 539, y);

      y += 34;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Session summary", margin, y);

      y += 28;
      const rows: [string, string][] = [
        ["Booking reference", booking.reference],
        ["Tutor", booking.tutorName],
        ["Subject", booking.subject],
        ["Student level", STUDENT_LEVEL_LABELS[booking.studentLevel]],
        ["Date", formatLongDate(booking.date)],
        ["Time", `${booking.time} EAT`],
        [
          "Session type",
          booking.sessionType === "intro"
            ? "Free 15 minute intro"
            : booking.sessionType === "bundle"
              ? `${booking.bundleSize ?? 5} session bundle`
              : "Full session (60 minutes)",
        ],
        ["Amount", booking.amount === 0 ? "Free" : formatKes(booking.amount)],
        ["Student", `${booking.studentName} (${booking.schoolYear})`],
        ["Topic", booking.topic],
        ["Contact", `${booking.contactName}, ${booking.contactPhone} ${booking.contactEmail}`],
        ["Video call", booking.videoLink],
      ];

      doc.setFontSize(11);
      rows.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(99, 99, 99);
        doc.text(label, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(value, 330) as string[];
        lines.forEach((line, index) => {
          doc.text(line, margin + 150, y + index * 15);
        });
        y += Math.max(24, lines.length * 15 + 12);
        if (y > 720) {
          doc.addPage();
          y = 64;
        }
      });

      y += 20;
      doc.setFontSize(10);
      doc.setTextColor(99, 99, 99);
      doc.text(
        "Join the video call 5 minutes early. For help, WhatsApp +254 112 272 061.",
        margin,
        y,
      );
      doc.text("Nathan Tutors, Nairobi, Kenya.", margin, y + 16);

      doc.save(`nathan-tutors-${booking.reference}.pdf`);
      setMessage("Session summary downloaded.");
    } catch {
      setMessage("We could not create the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!booking) {
    return (
      <section className="site-section">
        <div className="container">
          <div className="nt-empty">
            <h3>We could not find that booking in this browser</h3>
            <p>
              Sign in to open it from your sessions, or message us on WhatsApp with the
              reference {reference} and we will resend the confirmation.
            </p>
            <Link href="/my-sessions" className="btn btn-primary mr-2 mb-2">
              Go to my sessions
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-dark mb-2"
            >
              Message us
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="site-section-sm" style={{ paddingTop: 40 }}>
      <div className="container">
        <motion.div
          className="row justify-content-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="col-lg-9">
            <div className="nt-card nt-card-pad text-center mb-4">
              <span className="nt-confirm-check">
                <Check size={38} aria-hidden="true" />
              </span>
              <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8 }}>
                Your session is booked
              </h1>
              <p className="nt-muted mb-2">
                A confirmation with the video call link has been sent to{" "}
                <strong style={{ color: "#000" }}>{booking.contactEmail}</strong>.
              </p>
              <p className="nt-ref mb-1">{booking.reference}</p>
              <p className="nt-small nt-muted mb-0">Keep this reference for any queries.</p>
            </div>

            <div className="row">
              <div className="col-lg-7 mb-4">
                <div className="nt-card nt-card-pad h-100">
                  <span className="nt-mono-label">Session details</span>
                  <ul className="nt-fact-list mt-2 mb-0">
                    <li>
                      <span>Tutor</span>
                      <span>{booking.tutorName}</span>
                    </li>
                    <li>
                      <span>Subject</span>
                      <span>{booking.subject}</span>
                    </li>
                    <li>
                      <span>Student level</span>
                      <span>{STUDENT_LEVEL_LABELS[booking.studentLevel]}</span>
                    </li>
                    <li>
                      <span>Date</span>
                      <span>{formatLongDate(booking.date)}</span>
                    </li>
                    <li>
                      <span>Time</span>
                      <span>{booking.time} EAT</span>
                    </li>
                    <li>
                      <span>Type</span>
                      <span>
                        {booking.sessionType === "intro"
                          ? "Free 15 minute intro"
                          : booking.sessionType === "bundle"
                            ? `${booking.bundleSize ?? 5} session bundle`
                            : "Full session, 60 minutes"}
                      </span>
                    </li>
                    <li>
                      <span>Amount</span>
                      <span>{booking.amount === 0 ? "Free" : formatKes(booking.amount)}</span>
                    </li>
                    <li>
                      <span>Student</span>
                      <span>
                        {booking.studentName}, {booking.schoolYear}
                      </span>
                    </li>
                    <li>
                      <span>Topic</span>
                      <span>{booking.topic}</span>
                    </li>
                  </ul>

                  <div className="mt-4">
                    <span className="nt-mono-label d-block mb-2">Video call link</span>
                    <div className="nt-video-link">
                      <Video size={14} aria-hidden="true" style={{ marginRight: 6 }} />
                      {booking.videoLink}
                    </div>
                    <p className="nt-small nt-muted mt-2 mb-0">
                      This is a placeholder meeting link. The live link is sent by email
                      before the session.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 mb-4">
                <div className="nt-card nt-card-pad h-100 d-flex flex-column">
                  <span className="nt-mono-label">Join from your phone</span>
                  <p className="nt-small nt-muted mt-2">
                    Scan the code at the start of the lesson to open the call.
                  </p>
                  <div className="d-flex justify-content-center mb-3">
                    {qr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qr} alt="QR code for the video call link" className="nt-qr" />
                    ) : (
                      <div className="nt-qr d-flex align-items-center justify-content-center">
                        <span className="nt-spinner" />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-block mb-2"
                    onClick={downloadPdf}
                    disabled={downloading}
                  >
                    <Download size={15} aria-hidden="true" style={{ marginRight: 6 }} />
                    {downloading ? "Preparing PDF" : "Download session summary (PDF)"}
                  </button>
                  <a href={calendar} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-block mb-2">
                    <CalendarPlus size={15} aria-hidden="true" style={{ marginRight: 6 }} />
                    Add to Google Calendar
                  </a>
                  <a href={booking.videoLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-block mb-2">
                    <ExternalLink size={15} aria-hidden="true" style={{ marginRight: 6 }} />
                    Open video call link
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nt-link-quiet d-inline-flex align-items-center mt-2"
                    style={{ gap: 6 }}
                  >
                    <MessageCircle size={14} aria-hidden="true" />
                    Need to change something?
                  </a>
                  {message ? <p className="nt-small nt-muted mt-3 mb-0">{message}</p> : null}
                </div>
              </div>
            </div>

            <div className="nt-card nt-card-pad">
              <div className="row align-items-center">
                <div className="col-md-8 mb-3 mb-md-0">
                  <h2 style={{ fontSize: 18, fontWeight: 700 }} className="mb-1">
                    What happens next
                  </h2>
                  <p className="nt-small nt-muted mb-0">
                    Your tutor receives the booking immediately. Ten minutes before the
                    lesson you will get a reminder with the same video call link. After
                    the session, the tutor writes a progress note you can read under My
                    Sessions.
                  </p>
                </div>
                <div className="col-md-4 text-md-right">
                  <Link href="/my-sessions" className="btn btn-primary mb-2 w-100">
                    My sessions
                  </Link>
                  <Link href="/tutors" className="btn btn-outline-dark w-100">
                    Book another tutor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
