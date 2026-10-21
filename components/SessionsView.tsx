"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Download,
  MessageCircle,
  Star,
  Video,
} from "lucide-react";
import { formatLongDate } from "@/lib/availability";
import { formatKes, STUDENT_LEVEL_LABELS, whatsappHref } from "@/lib/data";
import type { AppSession } from "@/lib/session";
import type { BookingRecord, ProgressNote } from "@/lib/types";

type Tab = "upcoming" | "past" | "notes";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function SessionsView({
  session,
  bookings,
  notes,
}: {
  session: AppSession;
  bookings: BookingRecord[];
  notes: ProgressNote[];
}) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [reviewFor, setReviewFor] = useState<BookingRecord | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reviewMessage, setReviewMessage] = useState("");
  const [receiptMessage, setReceiptMessage] = useState("");

  const today = todayIso();
  const upcoming = useMemo(
    () =>
      bookings
        .filter((booking) => booking.date >= today)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [bookings, today],
  );
  const past = useMemo(
    () =>
      bookings
        .filter((booking) => booking.date < today)
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)),
    [bookings, today],
  );

  const childName = upcoming[0]?.studentName ?? past[0]?.studentName ?? session.name;

  const downloadReceipt = async (booking: BookingRecord) => {
    setReceiptMessage("");
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
      doc.text("The right tutor. Real results. Nairobi, Kenya.", margin, y + 16);
      doc.setTextColor(0, 0, 0);

      y += 52;
      doc.setDrawColor(7, 121, 228);
      doc.setLineWidth(3);
      doc.line(margin, y, 539, y);

      y += 34;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Session receipt", margin, y);

      const rows: [string, string][] = [
        ["Receipt number", `RCPT-${booking.reference}`],
        ["Booking reference", booking.reference],
        ["Tutor", booking.tutorName],
        ["Student", `${booking.studentName} (${booking.schoolYear})`],
        ["Subject", booking.subject],
        ["Level", STUDENT_LEVEL_LABELS[booking.studentLevel]],
        ["Session date", formatLongDate(booking.date)],
        ["Session time", `${booking.time} EAT`],
        ["Sessions", booking.sessionType === "bundle" ? String(booking.bundleSize ?? 5) : "1"],
        ["Amount paid", booking.amount === 0 ? "KES 0 (free intro)" : formatKes(booking.amount)],
        ["Payment method", booking.amount === 0 ? "Not applicable" : "M-Pesa"],
        ["Status", booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "free" ? "Free" : "Pending"],
        ["Issued on", new Date().toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })],
      ];

      y += 26;
      doc.setFontSize(11);
      rows.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(99, 99, 99);
        doc.text(label, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(value, 330) as string[];
        lines.forEach((line, index) => doc.text(line, margin + 160, y + index * 15));
        y += Math.max(24, lines.length * 15 + 8);
      });

      y += 20;
      doc.setFontSize(9);
      doc.setTextColor(99, 99, 99);
      doc.text("This receipt is issued by Nathan Tutors for tutoring services rendered.", margin, y);
      doc.text("Questions: WhatsApp +254 112 272 061 or hello@nathan-tutors.co.ke", margin, y + 14);

      doc.save(`nathan-tutors-receipt-${booking.reference}.pdf`);
      setReceiptMessage("Receipt downloaded.");
    } catch {
      setReceiptMessage("We could not create the receipt. Please try again.");
    }
  };

  const submitReview = async () => {
    if (!reviewFor) return;
    setReviewStatus("sending");
    setReviewMessage("");
    try {
      const response = await fetch("/api/booking/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorUsername: reviewFor.tutorUsername,
          bookingRef: reviewFor.reference,
          rating,
          comment,
        }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setReviewStatus("error");
        setReviewMessage(data.error ?? "We could not save your review.");
        return;
      }
      setReviewStatus("done");
      setReviewMessage(data.message ?? "Thank you for the review.");
      setComment("");
      setReviewFor(null);
    } catch {
      setReviewStatus("error");
      setReviewMessage("Network error. Please try again.");
    }
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-lg-8">
          <span className="nt-eyebrow">{session.role === "parent" ? "Parent account" : "Student account"}</span>
          <h1 style={{ fontSize: 32, fontWeight: 900 }}>My sessions</h1>
          <p className="nt-muted mb-0">
            {session.role === "parent"
              ? `Managing lessons for ${childName}. Progress notes from tutors appear below.`
              : `Welcome back, ${session.name.split(" ")[0]}. Your lessons and notes are all here.`}
          </p>
        </div>
        <div className="col-lg-4 text-lg-right mt-3 mt-lg-0">
          <Link href="/booking" className="btn btn-primary">
            Book a new session
          </Link>
        </div>
      </div>

      <div className="nt-tabs" role="tablist">
        <button
          type="button"
          className={`nt-tab${tab === "upcoming" ? " is-active" : ""}`}
          onClick={() => setTab("upcoming")}
          role="tab"
          aria-selected={tab === "upcoming"}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          type="button"
          className={`nt-tab${tab === "past" ? " is-active" : ""}`}
          onClick={() => setTab("past")}
          role="tab"
          aria-selected={tab === "past"}
        >
          Past sessions ({past.length})
        </button>
        <button
          type="button"
          className={`nt-tab${tab === "notes" ? " is-active" : ""}`}
          onClick={() => setTab("notes")}
          role="tab"
          aria-selected={tab === "notes"}
        >
          Progress notes ({notes.length})
        </button>
      </div>

      {reviewMessage ? (
        <p className={`nt-small ${reviewStatus === "error" ? "nt-error" : "nt-muted"}`}>{reviewMessage}</p>
      ) : null}
      {receiptMessage ? <p className="nt-small nt-muted">{receiptMessage}</p> : null}

      {tab === "upcoming" ? (
        upcoming.length === 0 ? (
          <div className="nt-empty">
            <h3>No upcoming sessions</h3>
            <p>Book a free intro with a tutor and your next lesson will appear here.</p>
            <Link href="/tutors" className="btn btn-primary">
              Find a tutor
            </Link>
          </div>
        ) : (
          <div className="row">
            {upcoming.map((booking, index) => (
              <div className="col-lg-6 mb-4" key={booking.reference}>
                <motion.div
                  className="nt-session-row"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <div className="nt-session-date">
                    <div className="nt-day">
                      {new Date(`${booking.date}T00:00:00.000Z`).getUTCDate()}
                    </div>
                    <div className="nt-month">
                      {new Date(`${booking.date}T00:00:00.000Z`).toLocaleDateString("en-KE", {
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </div>
                  </div>
                  <div className="nt-session-main">
                    <h3>{booking.subject}</h3>
                    <p>
                      with {booking.tutorName}
                      <span className="nt-divider-dot">|</span>
                      {booking.time} EAT
                    </p>
                    <span className="nt-badge mt-2">
                      {booking.sessionType === "intro" ? "Free intro, 15 min" : "60 minute lesson"}
                    </span>
                  </div>
                  <div className="nt-session-actions">
                    <a
                      href={booking.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <Video size={14} aria-hidden="true" style={{ marginRight: 5 }} />
                      Join session
                    </a>
                    <Link href={`/tutors/${booking.tutorUsername}`} className="btn btn-outline-dark">
                      Tutor profile
                    </Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )
      ) : null}

      {tab === "past" ? (
        past.length === 0 ? (
          <div className="nt-empty">
            <h3>No past sessions yet</h3>
            <p>Once a lesson is complete it appears here with a downloadable receipt.</p>
          </div>
        ) : (
          <div className="nt-card nt-card-pad">
            <div className="table-responsive">
              <table className="nt-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Tutor</th>
                    <th>Subject</th>
                    <th>Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((booking) => (
                    <tr key={booking.reference}>
                      <td>
                        <strong>{formatLongDate(booking.date)}</strong>
                        <span className="d-block nt-small nt-muted">{booking.time} EAT</span>
                      </td>
                      <td>{booking.tutorName}</td>
                      <td>
                        {booking.subject}
                        <span className="d-block nt-small nt-muted">{booking.reference}</span>
                      </td>
                      <td>{booking.amount === 0 ? "Free" : formatKes(booking.amount)}</td>
                      <td>
                        <div className="d-flex flex-wrap" style={{ gap: 6 }}>
                          <button
                            type="button"
                            className="btn btn-outline-dark"
                            style={{ fontSize: 11, padding: "8px 10px", textTransform: "uppercase", letterSpacing: "0.06rem" }}
                            onClick={() => downloadReceipt(booking)}
                          >
                            <Download size={13} aria-hidden="true" style={{ marginRight: 4 }} />
                            Receipt
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ fontSize: 11, padding: "8px 10px", textTransform: "uppercase", letterSpacing: "0.06rem" }}
                            onClick={() => {
                              setReviewFor(booking);
                              setRating(5);
                              setComment("");
                              setReviewStatus("idle");
                            }}
                          >
                            <Star size={13} aria-hidden="true" style={{ marginRight: 4 }} />
                            Rate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reviewFor ? (
              <motion.div
                className="nt-card nt-card-pad mt-4"
                style={{ boxShadow: "none", border: "1px solid #e9ecef" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                  Rate {reviewFor.tutorName}
                </h3>
                <p className="nt-small nt-muted">
                  Session on {formatLongDate(reviewFor.date)}. Reviews help other students
                  choose well.
                </p>
                <div className="nt-star-input mb-3" role="radiogroup" aria-label="Rating out of 5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value <= rating ? "is-on" : ""}
                      onClick={() => setRating(value)}
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    >
                      <Star size={24} fill="currentColor" aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <div className="nt-field">
                  <label htmlFor="review-comment">Your review</label>
                  <textarea
                    id="review-comment"
                    className="form-control"
                    rows={4}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="What went well? What should other students know?"
                  />
                </div>
                <div className="d-flex" style={{ gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitReview}
                    disabled={reviewStatus === "sending" || comment.trim().length < 5}
                  >
                    {reviewStatus === "sending" ? "Saving" : "Submit review"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setReviewFor(null)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : null}
          </div>
        )
      ) : null}

      {tab === "notes" ? (
        notes.length === 0 ? (
          <div className="nt-empty">
            <h3>No progress notes yet</h3>
            <p>
              After each session your tutor writes a short note. Those notes appear here
              and are shared with the parent on the account.
            </p>
          </div>
        ) : (
          <div className="row">
            {notes.map((note) => (
              <div className="col-lg-6 mb-4" key={note.id}>
                <div className="nt-card nt-card-pad h-100">
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-2" style={{ gap: 8 }}>
                    <span className="nt-badge nt-badge-primary">{note.studentName}</span>
                    <time dateTime={note.createdAt} className="nt-small nt-muted">
                      {new Date(note.createdAt).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <p style={{ fontSize: 14, color: "#353535" }} className="mb-2">
                    {note.note}
                  </p>
                  <span className="nt-small nt-muted">
                    <CalendarDays size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                    Session {note.sessionId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : null}

      <div className="nt-card nt-card-pad mt-4">
        <div className="row align-items-center">
          <div className="col-md-8 mb-3 mb-md-0">
            <h2 style={{ fontSize: 18, fontWeight: 700 }} className="mb-1">
              Need help with a booking?
            </h2>
            <p className="nt-small nt-muted mb-0">
              Message us on WhatsApp with your reference and we will reschedule or follow
              up with the tutor.
            </p>
          </div>
          <div className="col-md-4 text-md-right">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <MessageCircle size={15} aria-hidden="true" style={{ marginRight: 6 }} />
              WhatsApp support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
