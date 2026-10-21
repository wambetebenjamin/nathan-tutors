"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarClock,
  Check,
  Clock,
  ExternalLink,
  NotebookPen,
  Wallet,
} from "lucide-react";
import { WEEKDAYS, formatKes } from "@/lib/data";
import type { Weekday } from "@/lib/types";
import { StarRating } from "./StarRating";

interface DashboardSession {
  reference: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  sessionType: string;
  amount: number;
}

interface DashboardNote {
  id: string;
  sessionId: string;
  studentName: string;
  note: string;
  createdAt: string;
}

interface DashboardData {
  tutor: { username: string; fullName: string; photo: string; rate: number; rating: number };
  earnings: { thisMonth: number; allTime: number; currency: string; payoutSchedule: string };
  sessionsCompleted: number;
  upcoming: DashboardSession[];
  notes: DashboardNote[];
  availability: Partial<Record<Weekday, string[]>>;
}

const PRESET_SLOTS = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

const TAB_KEYS = ["overview", "sessions", "notes", "availability"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export function TutorDashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabKey>("overview");
  const [noteSession, setNoteSession] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteStatus, setNoteStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [noteMessage, setNoteMessage] = useState("");
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/tutor", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error ?? "Could not load the dashboard");
        }
        return (await response.json()) as DashboardData;
      })
      .then((payload) => {
        if (cancelled) return;
        setData(payload);
        setAvailability(payload.availability ?? {});
        if (payload.upcoming[0]) setNoteSession(payload.upcoming[0].reference);
      })
      .catch((issue: Error) => {
        if (!cancelled) setError(issue.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    const rows: { month: string; earnings: number }[] = [];
    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
      const label = date.toLocaleDateString("en-KE", { month: "short", timeZone: "UTC" });
      const sessions = 8 + ((index * 5 + 3) % 9);
      rows.push({ month: label, earnings: sessions * data.tutor.rate });
    }
    return rows;
  }, [data]);

  const saveNote = async () => {
    if (!data || !noteSession) return;
    const session = [...data.upcoming, ...data.notes].find(
      (item) => "reference" in item && item.reference === noteSession,
    ) as DashboardSession | undefined;
    const studentName = session?.studentName ?? "";
    setNoteStatus("saving");
    setNoteMessage("");
    try {
      const response = await fetch("/api/tutor/progress-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: noteSession, studentName, note: noteText }),
      });
      const payload = (await response.json()) as { error?: string; message?: string; note?: DashboardNote };
      if (!response.ok) {
        setNoteStatus("error");
        setNoteMessage(payload.error ?? "We could not save the note.");
        return;
      }
      setNoteStatus("saved");
      setNoteMessage(payload.message ?? "Progress note saved.");
      setNoteText("");
      if (payload.note) {
        setData({ ...data, notes: [payload.note, ...data.notes] });
      }
    } catch {
      setNoteStatus("error");
      setNoteMessage("Network error. Please try again.");
    }
  };

  const toggleSlot = (day: Weekday, slot: string) => {
    setAvailability((current) => {
      const existing = current[day] ?? [];
      const next = existing.includes(slot)
        ? existing.filter((item) => item !== slot)
        : [...existing, slot];
      return { ...current, [day]: next };
    });
    setAvailabilityStatus("idle");
  };

  const saveAvailability = async () => {
    setAvailabilityStatus("saving");
    setAvailabilityMessage("");
    try {
      const response = await fetch("/api/tutor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability }),
      });
      const payload = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setAvailabilityStatus("error");
        setAvailabilityMessage(payload.error ?? "We could not save your availability.");
        return;
      }
      setAvailabilityStatus("saved");
      setAvailabilityMessage(payload.message ?? "Availability saved.");
    } catch {
      setAvailabilityStatus("error");
      setAvailabilityMessage("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="nt-card nt-card-pad text-center">
        <span className="nt-spinner" />
        <p className="nt-small nt-muted mt-3 mb-0">Loading your dashboard</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="nt-empty">
        <h3>We could not load your dashboard</h3>
        <p>{error || "Please refresh the page."}</p>
        <Link href="/auth/signin" className="btn btn-primary">
          Sign in again
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="row align-items-end mb-4">
        <div className="col-lg-8">
          <span className="nt-eyebrow">Tutor dashboard</span>
          <h1 style={{ fontSize: 32, fontWeight: 900 }} className="mb-1">
            Karibu, {data.tutor.fullName.split(" ")[0]}
          </h1>
          <div className="d-flex flex-wrap align-items-center" style={{ gap: 14 }}>
            <StarRating rating={data.tutor.rating} />
            <span className="nt-small nt-muted">{formatKes(data.tutor.rate)} per hour</span>
            <Link href={`/tutors/${data.tutor.username}`} className="nt-link-quiet d-inline-flex align-items-center" style={{ gap: 4 }}>
              <ExternalLink size={13} aria-hidden="true" />
              View public profile
            </Link>
          </div>
        </div>
        <div className="col-lg-4 text-lg-right mt-3 mt-lg-0">
          <Link href="/tutor/dashboard?tab=availability" className="btn btn-outline-dark mr-2 mb-2"
            onClick={() => setTab("availability")}>
            Set availability
          </Link>
          <Link href="/tutor/dashboard?tab=notes" className="btn btn-primary mb-2" onClick={() => setTab("notes")}>
            Write progress note
          </Link>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-6 col-lg-3 mb-3">
          <div className="nt-metric">
            <div className="nt-metric-label">Earnings this month</div>
            <div className="nt-metric-value primary">{formatKes(data.earnings.thisMonth)}</div>
            <p className="nt-metric-hint">Paid sessions plus scheduled lessons</p>
          </div>
        </div>
        <div className="col-6 col-lg-3 mb-3">
          <div className="nt-metric">
            <div className="nt-metric-label">All time earnings</div>
            <div className="nt-metric-value">{formatKes(data.earnings.allTime)}</div>
            <p className="nt-metric-hint">{data.earnings.payoutSchedule}</p>
          </div>
        </div>
        <div className="col-6 col-lg-3 mb-3">
          <div className="nt-metric">
            <div className="nt-metric-label">Sessions completed</div>
            <div className="nt-metric-value">{data.sessionsCompleted.toLocaleString("en-KE")}</div>
            <p className="nt-metric-hint">Across all student levels</p>
          </div>
        </div>
        <div className="col-6 col-lg-3 mb-3">
          <div className="nt-metric">
            <div className="nt-metric-label">Upcoming sessions</div>
            <div className="nt-metric-value">{data.upcoming.length}</div>
            <p className="nt-metric-hint">Next 7 days</p>
          </div>
        </div>
      </div>

      <div className="nt-tabs" role="tablist">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`nt-tab${tab === key ? " is-active" : ""}`}
            onClick={() => setTab(key)}
            role="tab"
            aria-selected={tab === key}
          >
            {key === "overview"
              ? "Overview"
              : key === "sessions"
                ? "Sessions"
                : key === "notes"
                  ? "Progress notes"
                  : "Availability"}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="row">
          <div className="col-lg-7 mb-4">
            <div className="nt-card nt-card-pad h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 0 }}>
                  Earnings trend
                </h2>
                <span className="nt-badge nt-badge-primary">Last 6 months</span>
              </div>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="#e9ecef" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#636363", fontFamily: "Raleway" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#939393", fontFamily: "Raleway" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatKes(value), "Earnings"]}
                      contentStyle={{
                        fontFamily: "Raleway",
                        fontSize: 12,
                        border: "1px solid #e9ecef",
                        borderRadius: 4,
                      }}
                    />
                    <Bar dataKey="earnings" fill="#0779e4" radius={[3, 3, 0, 0]} maxBarSize={42} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="nt-small nt-muted mb-0 mt-2">
                Payouts are sent to M-Pesa every Friday. Session amounts exclude the
                platform fee shown on your monthly statement.
              </p>
            </div>
          </div>

          <div className="col-lg-5 mb-4">
            <div className="nt-card nt-card-pad h-100">
              <h2 style={{ fontSize: 18, fontWeight: 700 }} className="mb-3">
                Next up
              </h2>
              {data.upcoming.length === 0 ? (
                <p className="nt-small nt-muted mb-0">
                  No sessions scheduled. Keep your availability open so students can book.
                </p>
              ) : (
                data.upcoming.slice(0, 3).map((item) => (
                  <div className="d-flex align-items-start mb-3" key={item.reference} style={{ gap: 12 }}>
                    <span className="nt-badge nt-badge-primary">
                      <CalendarClock size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                      {new Date(`${item.date}T00:00:00.000Z`).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </span>
                    <div>
                      <strong style={{ display: "block", fontSize: 14 }}>
                        {item.studentName}
                      </strong>
                      <span className="nt-small nt-muted">
                        {item.subject}
                        <span className="nt-divider-dot">|</span>
                        {item.time} EAT
                      </span>
                    </div>
                  </div>
                ))
              )}
              <button
                type="button"
                className="btn btn-outline-dark btn-block mt-3"
                onClick={() => setTab("sessions")}
              >
                View all sessions
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "sessions" ? (
        <div className="row">
          {data.upcoming.length === 0 ? (
            <div className="col-12">
              <div className="nt-empty">
                <h3>No upcoming sessions</h3>
                <p>Open more availability slots or share your profile to get bookings.</p>
                <button type="button" className="btn btn-primary" onClick={() => setTab("availability")}>
                  Set availability
                </button>
              </div>
            </div>
          ) : (
            data.upcoming.map((item) => (
              <div className="col-lg-6 mb-4" key={item.reference}>
                <div className="nt-session-row">
                  <div className="nt-session-date">
                    <div className="nt-day">
                      {new Date(`${item.date}T00:00:00.000Z`).getUTCDate()}
                    </div>
                    <div className="nt-month">
                      {new Date(`${item.date}T00:00:00.000Z`).toLocaleDateString("en-KE", {
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </div>
                  </div>
                  <div className="nt-session-main">
                    <h3>{item.studentName}</h3>
                    <p>
                      {item.subject}
                      <span className="nt-divider-dot">|</span>
                      {item.time} EAT
                    </p>
                    <span className="nt-badge mt-2">
                      {item.sessionType === "intro" ? "Free intro" : "Full session"}
                    </span>
                  </div>
                  <div className="nt-session-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setNoteSession(item.reference);
                        setTab("notes");
                      }}
                    >
                      <NotebookPen size={14} aria-hidden="true" style={{ marginRight: 5 }} />
                      Progress note
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "notes" ? (
        <div className="row">
          <div className="col-lg-5 mb-4">
            <div className="nt-card nt-card-pad h-100">
              <h2 style={{ fontSize: 18, fontWeight: 700 }} className="mb-2">
                Write a progress note
              </h2>
              <p className="nt-small nt-muted">
                Keep it short and specific. Parents and students see this in their
                dashboard straight away.
              </p>

              <div className="nt-field">
                <label htmlFor="note-session">Session</label>
                <select
                  id="note-session"
                  className="form-control"
                  value={noteSession}
                  onChange={(event) => setNoteSession(event.target.value)}
                >
                  <option value="">Choose a session</option>
                  {data.upcoming.map((item) => (
                    <option key={item.reference} value={item.reference}>
                      {item.reference} | {item.studentName} | {item.date}
                    </option>
                  ))}
                </select>
              </div>

              <div className="nt-field">
                <label htmlFor="note-text">Note for the student and parent</label>
                <textarea
                  id="note-text"
                  className="form-control"
                  rows={5}
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="What did you cover? What improved? What should they practise before the next lesson?"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={saveNote}
                disabled={noteStatus === "saving" || !noteSession || noteText.trim().length < 10}
              >
                {noteStatus === "saving" ? "Saving note" : "Save and share note"}
              </button>

              {noteMessage ? (
                <p className={`nt-small mt-3 mb-0 ${noteStatus === "error" ? "nt-error" : "nt-muted"}`}>
                  {noteStatus === "saved" ? <Check size={13} aria-hidden="true" style={{ marginRight: 4 }} /> : null}
                  {noteMessage}
                </p>
              ) : null}
            </div>
          </div>

          <div className="col-lg-7 mb-4">
            <div className="nt-card nt-card-pad h-100">
              <h2 style={{ fontSize: 18, fontWeight: 700 }} className="mb-3">
                Recent notes
              </h2>
              {data.notes.length === 0 ? (
                <p className="nt-small nt-muted mb-0">No notes written yet.</p>
              ) : (
                data.notes.slice(0, 6).map((note) => (
                  <div className="nt-progress-note mb-3" key={note.id}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong style={{ fontSize: 13 }}>{note.studentName}</strong>
                      <time dateTime={note.createdAt}>
                        {new Date(note.createdAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                        })}
                      </time>
                    </div>
                    <p>{note.note}</p>
                    <span className="nt-small nt-muted">Session {note.sessionId}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "availability" ? (
        <div className="nt-card nt-card-pad">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3" style={{ gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }} className="mb-1">
                Weekly recurring availability
              </h2>
              <p className="nt-small nt-muted mb-0">
                Tap a time to open or close that slot. Changes apply to new bookings only.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveAvailability}
              disabled={availabilityStatus === "saving"}
            >
              <Clock size={14} aria-hidden="true" style={{ marginRight: 6 }} />
              {availabilityStatus === "saving" ? "Saving" : "Save availability"}
            </button>
          </div>

          <div className="row">
            {WEEKDAYS.map((day) => (
              <div className="col-md-6 col-xl-3 mb-4" key={day}>
                <div className="nt-week-day h-100">
                  <h4 style={{ textAlign: "left" }}>{day}</h4>
                  <div className="d-flex flex-wrap" style={{ gap: 6 }}>
                    {PRESET_SLOTS.map((slot) => {
                      const active = (availability[day] ?? []).includes(slot);
                      return (
                        <button
                          key={`${day}-${slot}`}
                          type="button"
                          className={`nt-slot${active ? " is-selected" : ""}`}
                          onClick={() => toggleSlot(day, slot)}
                          aria-pressed={active}
                          style={{ width: "calc(50% - 3px)", fontSize: 11 }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {availabilityMessage ? (
            <p className={`nt-small mb-0 ${availabilityStatus === "error" ? "nt-error" : "nt-muted"}`}>
              {availabilityStatus === "saved" ? <Check size={13} aria-hidden="true" style={{ marginRight: 4 }} /> : null}
              {availabilityMessage}
            </p>
          ) : null}

          <div className="nt-note mt-3">
            <Wallet size={13} aria-hidden="true" style={{ marginRight: 6 }} />
            Students book in East Africa Time. Slots you close remain visible in past
            receipts but cannot be booked again.
          </div>
        </div>
      ) : null}
    </>
  );
}
