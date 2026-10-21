"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CreditCard,
  Info,
  User,
  Video,
} from "lucide-react";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { RecaptchaFallback } from "./RecaptchaFallback";
import type { WeekAvailability } from "@/lib/availability";
import {
  STUDENT_LEVEL_LABELS,
  formatKes,
} from "@/lib/data";
import type { StudentLevel } from "@/lib/types";

interface FlowTutor {
  username: string;
  fullName: string;
  photo: string;
  subjects: string[];
  levels: StudentLevel[];
  rate: number;
  rating: number;
  reviewCount: number;
  bundles: { size: number; price: number; perSession: number }[];
}

interface BookingFlowProps {
  tutors: FlowTutor[];
  initialTutor?: string;
  initialType?: "intro" | "full" | "bundle";
  initialDate?: string;
  initialTime?: string;
  initialBundle?: number;
}

const STEPS = [
  "Tutor",
  "Subject and level",
  "Date and time",
  "Session type",
  "Student details",
  "Contact and payment",
];

const FALLBACK_WEEK: WeekAvailability = {
  weekStart: "",
  weekEnd: "",
  days: [],
};

export function BookingFlow({
  tutors,
  initialTutor,
  initialType,
  initialDate,
  initialTime,
  initialBundle,
}: BookingFlowProps) {
  const router = useRouter();
  const preselected = tutors.find((tutor) => tutor.username === initialTutor);

  const [step, setStep] = useState(0);
  const [tutorUsername, setTutorUsername] = useState(preselected?.username ?? "");
  const [subject, setSubject] = useState(preselected?.subjects[0] ?? "");
  const [level, setLevel] = useState<StudentLevel>(preselected?.levels[0] ?? "secondary");
  const [date, setDate] = useState(initialDate ?? "");
  const [time, setTime] = useState(initialTime ?? "");
  const [sessionType, setSessionType] = useState<"intro" | "full" | "bundle">(
    initialType ?? "intro",
  );
  const [bundleSize, setBundleSize] = useState<number>(initialBundle ?? 5);
  const [student, setStudent] = useState({ name: "", schoolYear: "", topic: "" });
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student" as "student" | "parent",
  });
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [week, setWeek] = useState<WeekAvailability>(FALLBACK_WEEK);
  const [weekLoading, setWeekLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");
  const [attempted, setAttempted] = useState(false);

  const tutor = tutors.find((item) => item.username === tutorUsername);

  const loadWeek = useCallback(
    async (username: string, weekStart?: string) => {
      if (!username) return;
      setWeekLoading(true);
      try {
        const params = new URLSearchParams({ username });
        if (weekStart) params.set("week", weekStart);
        const response = await fetch(`/api/tutors/availability?${params.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("availability failed");
        setWeek((await response.json()) as WeekAvailability);
      } catch {
        setWeek(FALLBACK_WEEK);
      } finally {
        setWeekLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (tutorUsername) void loadWeek(tutorUsername);
  }, [tutorUsername, loadWeek]);

  useEffect(() => {
    if (!preselected) return;
    setSubject((current) => current || preselected.subjects[0]);
  }, [preselected]);

  const selectedBundle = tutor?.bundles.find((item) => item.size === bundleSize);
  const amount = useMemo(() => {
    if (!tutor) return 0;
    if (sessionType === "intro") return 0;
    if (sessionType === "bundle") return selectedBundle?.price ?? tutor.rate * bundleSize;
    return tutor.rate;
  }, [bundleSize, selectedBundle, sessionType, tutor]);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(tutorUsername);
    if (step === 1) return Boolean(subject) && Boolean(level);
    if (step === 2) return Boolean(date) && Boolean(time);
    if (step === 3) return Boolean(sessionType);
    if (step === 4) {
      return student.name.trim().length >= 2 && student.schoolYear.trim().length > 0 && student.topic.trim().length >= 3;
    }
    if (step === 5) {
      return (
        contact.name.trim().length >= 2 &&
        /.+@.+\..+/.test(contact.email) &&
        contact.phone.trim().length >= 9 &&
        (sessionType === "intro" || mpesaPhone.trim().length >= 9)
      );
    }
    return false;
  }, [contact, mpesaPhone, sessionType, step, student, subject, date, time, tutorUsername]);

  const next = () => {
    setAttempted(false);
    setError("");
    if (!canContinue) {
      setAttempted(true);
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const back = () => {
    setAttempted(false);
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const submit = async () => {
    if (!tutor) return;
    setAttempted(true);
    setError("");
    if (!canContinue) return;
    setStatus("sending");

    const token = await getRecaptchaToken("booking");

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorUsername: tutor.username,
          subject,
          studentLevel: level,
          date,
          time,
          sessionType,
          bundleSize: sessionType === "bundle" ? bundleSize : undefined,
          studentName: student.name.trim(),
          schoolYear: student.schoolYear.trim(),
          topic: student.topic.trim(),
          contactName: contact.name.trim(),
          contactEmail: contact.email.trim(),
          contactPhone: contact.phone.trim(),
          mpesaPhone: sessionType === "intro" ? undefined : mpesaPhone.trim(),
          role: contact.role,
          recaptchaToken: token,
          v2Token: v2Token || undefined,
        }),
      });

      const data = (await response.json()) as {
        reference?: string;
        error?: string;
        requiresV2?: boolean;
      };

      if (!response.ok || !data.reference) {
        if (data.requiresV2) setNeedsV2(true);
        setError(data.error ?? "We could not create the booking. Please try again.");
        setStatus("error");
        return;
      }

      try {
        window.sessionStorage.setItem(
          `nt_booking_${data.reference}`,
          JSON.stringify({
            reference: data.reference,
            tutorName: tutor.fullName,
            tutorPhoto: tutor.photo,
            tutorUsername: tutor.username,
            subject,
            studentLevel: level,
            date,
            time,
            sessionType,
            bundleSize: sessionType === "bundle" ? bundleSize : undefined,
            amount,
            studentName: student.name.trim(),
            schoolYear: student.schoolYear.trim(),
            topic: student.topic.trim(),
            contactName: contact.name.trim(),
            contactEmail: contact.email.trim(),
            contactPhone: contact.phone.trim(),
          }),
        );
      } catch {
        // sessionStorage is optional, the server lookup still works
      }

      router.push(`/booking-confirmation?ref=${encodeURIComponent(data.reference)}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const subjectOptions = tutor?.subjects ?? [];

  return (
    <div className="row">
      <div className="col-lg-8 mb-4">
        <div className="nt-flow-card">
          <div className="nt-steps" aria-label="Booking progress">
            {STEPS.map((label, index) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center" }}>
                <span
                  className={`nt-steps-item${index === step ? " is-active" : ""}${
                    index < step ? " is-done" : ""
                  }`}
                  aria-current={index === step ? "step" : undefined}
                >
                  <span className="nt-steps-dot">{index < step ? <Check size={12} aria-hidden="true" /> : index + 1}</span>
                  <span className="d-none d-md-inline">{label}</span>
                </span>
                {index < STEPS.length - 1 ? <span className="nt-steps-sep" aria-hidden="true" /> : null}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {step === 0 ? (
                <section aria-labelledby="step-tutor">
                  <h2 id="step-tutor" style={{ fontSize: 24, fontWeight: 700 }}>
                    Who would you like to learn with?
                  </h2>
                  <p className="nt-muted mb-4">
                    Choose a tutor. You can compare profiles and reviews before you decide.
                  </p>
                  <div className="row">
                    {tutors.map((item) => (
                      <div className="col-md-6 mb-3" key={item.username}>
                        <button
                          type="button"
                          className={`nt-choice${tutorUsername === item.username ? " is-selected" : ""}`}
                          onClick={() => {
                            setTutorUsername(item.username);
                            setSubject(item.subjects[0]);
                            setLevel(item.levels[0]);
                            setDate("");
                            setTime("");
                          }}
                          aria-pressed={tutorUsername === item.username}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.photo} alt="" className="nt-choice-thumb" />
                          <span>
                            <span className="nt-choice-title d-block">{item.fullName}</span>
                            <span className="nt-choice-meta d-block">
                              {item.subjects.slice(0, 2).join(", ")}
                            </span>
                            <span className="nt-choice-meta d-block">
                              {formatKes(item.rate)} per hour | rated {item.rating.toFixed(1)}
                            </span>
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {step === 1 ? (
                <section aria-labelledby="step-subject">
                  <h2 id="step-subject" style={{ fontSize: 24, fontWeight: 700 }}>
                    Subject and student level
                  </h2>
                  <p className="nt-muted mb-4">
                    {tutor?.fullName} teaches {tutor?.subjects.join(", ")}.
                  </p>

                  <div className="nt-field">
                    <label htmlFor="booking-subject">Subject</label>
                    <select
                      id="booking-subject"
                      className="form-control"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                    >
                      <option value="">Choose a subject</option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="nt-field">
                    <label htmlFor="booking-level">Student level</label>
                    <select
                      id="booking-level"
                      className="form-control"
                      value={level}
                      onChange={(event) => setLevel(event.target.value as StudentLevel)}
                    >
                      {Object.entries(STUDENT_LEVEL_LABELS).map(([value, label]) => (
                        <option key={value} value={value} disabled={!tutor?.levels.includes(value as StudentLevel)}>
                          {label}
                          {tutor && !tutor.levels.includes(value as StudentLevel) ? " (not offered)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="nt-note">
                    Not sure about the level? Choose the closest option. Your tutor will
                    confirm it during the free intro session.
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section aria-labelledby="step-time">
                  <h2 id="step-time" style={{ fontSize: 24, fontWeight: 700 }}>
                    Choose a date and time
                  </h2>
                  <p className="nt-muted mb-3">
                    All times are East Africa Time. Availability refreshes each week.
                  </p>

                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-3" style={{ gap: 8 }}>
                    <span className="nt-small nt-muted">
                      {weekLoading ? "Loading availability..." : `Week of ${week.weekStart || "this week"}`}
                    </span>
                    <div className="d-flex" style={{ gap: 6 }}>
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        style={{ padding: "6px 10px" }}
                        disabled={weekLoading || !week.weekStart}
                        onClick={() => {
                          const start = new Date(`${week.weekStart}T00:00:00.000Z`);
                          start.setUTCDate(start.getUTCDate() - 7);
                          void loadWeek(tutorUsername, start.toISOString().slice(0, 10));
                        }}
                      >
                        <ArrowLeft size={14} aria-hidden="true" />
                        <span className="d-none d-sm-inline ml-1">Previous</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        style={{ padding: "6px 10px" }}
                        disabled={weekLoading}
                        onClick={() => {
                          const start = new Date(`${week.weekStart}T00:00:00.000Z`);
                          start.setUTCDate(start.getUTCDate() + 7);
                          void loadWeek(tutorUsername, start.toISOString().slice(0, 10));
                        }}
                      >
                        <span className="d-none d-sm-inline mr-1">Next</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="nt-week mb-3">
                    {week.days.map((day) => (
                      <div className="nt-week-day" key={day.date}>
                        <h4>
                          {day.weekday.slice(0, 3)}
                          <br />
                          <span style={{ fontWeight: 400, letterSpacing: 0 }}>
                            {new Date(`${day.date}T00:00:00.000Z`).getUTCDate()}
                          </span>
                        </h4>
                        <div className="nt-slots">
                          {day.slots.length === 0 ? (
                            <span className="nt-small nt-muted text-center" style={{ fontSize: 11 }}>
                              No slots
                            </span>
                          ) : (
                            day.slots.map((slot) => (
                              <button
                                key={`${day.date}-${slot.time}`}
                                type="button"
                                className={`nt-slot${
                                  date === day.date && time === slot.time ? " is-selected" : ""
                                }`}
                                disabled={!slot.available}
                                onClick={() => {
                                  setDate(day.date);
                                  setTime(slot.time);
                                }}
                                aria-pressed={date === day.date && time === slot.time}
                              >
                                {slot.time}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {date && time ? (
                    <div className="nt-note">
                      <CalendarDays size={14} aria-hidden="true" style={{ marginRight: 6 }} />
                      Selected: {date} at {time} EAT
                    </div>
                  ) : (
                    <div className="nt-note">Pick a highlighted slot to continue.</div>
                  )}
                </section>
              ) : null}

              {step === 3 ? (
                <section aria-labelledby="step-type">
                  <h2 id="step-type" style={{ fontSize: 24, fontWeight: 700 }}>
                    Session type
                  </h2>
                  <p className="nt-muted mb-4">
                    Start with a free intro, or book a full lesson straight away.
                  </p>

                  <div className="mb-3">
                    <button
                      type="button"
                      className={`nt-choice${sessionType === "intro" ? " is-selected" : ""}`}
                      onClick={() => setSessionType("intro")}
                      aria-pressed={sessionType === "intro"}
                    >
                      <span className="nt-badge nt-badge-success">Free</span>
                      <span>
                        <span className="nt-choice-title d-block">15 minute intro session</span>
                        <span className="nt-choice-meta d-block">
                          Meet your tutor, discuss goals and agree on a plan. No payment needed.
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="mb-3">
                    <button
                      type="button"
                      className={`nt-choice${sessionType === "full" ? " is-selected" : ""}`}
                      onClick={() => setSessionType("full")}
                      aria-pressed={sessionType === "full"}
                    >
                      <span className="nt-badge nt-badge-primary">Paid</span>
                      <span>
                        <span className="nt-choice-title d-block">
                          Full session (60 minutes) | {formatKes(tutor?.rate ?? 0)}
                        </span>
                        <span className="nt-choice-meta d-block">
                          One-on-one lesson by video call, with a progress note afterwards.
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="mb-3">
                    <button
                      type="button"
                      className={`nt-choice${sessionType === "bundle" ? " is-selected" : ""}`}
                      onClick={() => setSessionType("bundle")}
                      aria-pressed={sessionType === "bundle"}
                    >
                      <span className="nt-badge nt-badge-warning">Save</span>
                      <span>
                        <span className="nt-choice-title d-block">Session bundle</span>
                        <span className="nt-choice-meta d-block">
                          Buy several lessons at a lower rate per session.
                        </span>
                      </span>
                    </button>
                  </div>

                  {sessionType === "bundle" ? (
                    <div className="row">
                      {(tutor?.bundles ?? []).map((bundle) => (
                        <div className="col-md-6 mb-3" key={bundle.size}>
                          <button
                            type="button"
                            className={`nt-choice${bundleSize === bundle.size ? " is-selected" : ""}`}
                            onClick={() => setBundleSize(bundle.size)}
                            aria-pressed={bundleSize === bundle.size}
                          >
                            <span>
                              <span className="nt-choice-title d-block">
                                {bundle.size} sessions | {formatKes(bundle.price)}
                              </span>
                              <span className="nt-choice-meta d-block">
                                {formatKes(bundle.perSession)} per session
                              </span>
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}

              {step === 4 ? (
                <section aria-labelledby="step-student">
                  <h2 id="step-student" style={{ fontSize: 24, fontWeight: 700 }}>
                    Student details
                  </h2>
                  <p className="nt-muted mb-4">
                    This helps your tutor prepare for the first lesson.
                  </p>

                  <div className="nt-field">
                    <label htmlFor="student-name">Student full name</label>
                    <input
                      id="student-name"
                      className="form-control"
                      value={student.name}
                      onChange={(event) => setStudent({ ...student, name: event.target.value })}
                      placeholder="e.g. Achieng Otieno"
                    />
                    {attempted && student.name.trim().length < 2 ? (
                      <p className="nt-error">Enter the student name.</p>
                    ) : null}
                  </div>

                  <div className="nt-field">
                    <label htmlFor="student-year">School year or level</label>
                    <input
                      id="student-year"
                      className="form-control"
                      value={student.schoolYear}
                      onChange={(event) => setStudent({ ...student, schoolYear: event.target.value })}
                      placeholder="e.g. Form 4, Standard 7, Year 2 university"
                    />
                    {attempted && !student.schoolYear ? (
                      <p className="nt-error">Tell us the class or year of study.</p>
                    ) : null}
                  </div>

                  <div className="nt-field">
                    <label htmlFor="student-topic">Specific topic to cover</label>
                    <textarea
                      id="student-topic"
                      className="form-control"
                      rows={4}
                      value={student.topic}
                      onChange={(event) => setStudent({ ...student, topic: event.target.value })}
                      placeholder="e.g. Differentiation, question 4 of the 2024 KCSE paper"
                    />
                    {attempted && student.topic.trim().length < 3 ? (
                      <p className="nt-error">Add the topic you want to focus on.</p>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {step === 5 ? (
                <section aria-labelledby="step-contact">
                  <h2 id="step-contact" style={{ fontSize: 24, fontWeight: 700 }}>
                    Contact and payment
                  </h2>
                  <p className="nt-muted mb-4">
                    We send the booking confirmation and video call link to this email.
                  </p>

                  <div className="nt-field">
                    <label htmlFor="contact-role">I am booking as</label>
                    <select
                      id="contact-role"
                      className="form-control"
                      value={contact.role}
                      onChange={(event) =>
                        setContact({ ...contact, role: event.target.value as "student" | "parent" })
                      }
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent or guardian</option>
                    </select>
                  </div>

                  <div className="nt-field">
                    <label htmlFor="contact-name">
                      {contact.role === "parent" ? "Your full name" : "Full name"}
                    </label>
                    <input
                      id="contact-name"
                      className="form-control"
                      value={contact.name}
                      onChange={(event) => setContact({ ...contact, name: event.target.value })}
                      placeholder="e.g. Agnes Wambui"
                    />
                    {attempted && contact.name.trim().length < 2 ? (
                      <p className="nt-error">Enter a contact name.</p>
                    ) : null}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="nt-field">
                        <label htmlFor="contact-email">Email address</label>
                        <input
                          id="contact-email"
                          type="email"
                          className="form-control"
                          value={contact.email}
                          onChange={(event) => setContact({ ...contact, email: event.target.value })}
                          placeholder="you@example.com"
                        />
                        {attempted && !/.+@.+\..+/.test(contact.email) ? (
                          <p className="nt-error">Enter a valid email address.</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="nt-field">
                        <label htmlFor="contact-phone">Phone number</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          className="form-control"
                          value={contact.phone}
                          onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                          placeholder="0712 345 678"
                        />
                        {attempted && contact.phone.trim().length < 9 ? (
                          <p className="nt-error">Enter a phone number we can reach you on.</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {sessionType === "intro" ? (
                    <div className="nt-note">
                      <Info size={14} aria-hidden="true" style={{ marginRight: 6 }} />
                      This is a free 15 minute intro session. No payment is taken.
                    </div>
                  ) : (
                    <div className="border-top pt-3 mt-3">
                      <h3 style={{ fontSize: 17, fontWeight: 700 }} className="mb-2">
                        Pay with M-Pesa
                      </h3>
                      <p className="nt-small nt-muted">
                        We send an M-Pesa payment request to this number after you confirm.
                        Enter the PIN on your phone to complete payment of {formatKes(amount)}.
                      </p>
                      <div className="nt-field">
                        <label htmlFor="mpesa-phone">M-Pesa phone number</label>
                        <input
                          id="mpesa-phone"
                          type="tel"
                          className="form-control"
                          value={mpesaPhone}
                          onChange={(event) => setMpesaPhone(event.target.value)}
                          placeholder="0712 345 678"
                        />
                        {attempted && mpesaPhone.trim().length < 9 ? (
                          <p className="nt-error">Enter the M-Pesa number to charge.</p>
                        ) : null}
                      </div>
                      <p className="nt-small nt-muted mb-0 d-inline-flex align-items-center" style={{ gap: 6 }}>
                        <CreditCard size={14} aria-hidden="true" />
                        Paybill 4098765, account NT-MPESA. You can also pay after the intro.
                      </p>
                    </div>
                  )}

                  {needsV2 ? (
                    <RecaptchaFallback onToken={setV2Token} />
                  ) : (
                    <p className="nt-small nt-muted mt-3 mb-0">
                      This form is protected by reCAPTCHA. Google&apos;s privacy and terms apply.
                    </p>
                  )}

                  {error ? <p className="nt-error mt-3">{error}</p> : null}
                </section>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 pt-3 border-top" style={{ gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={back}
              disabled={step === 0 || status === "sending"}
              style={{ padding: "12px 20px" }}
            >
              <ArrowLeft size={15} aria-hidden="true" style={{ marginRight: 6 }} />
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={next}
                style={{ padding: "12px 24px" }}
              >
                Continue
                <ArrowRight size={15} aria-hidden="true" style={{ marginLeft: 6 }} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={submit}
                disabled={status === "sending"}
                style={{ padding: "12px 24px" }}
              >
                {status === "sending" ? (
                  <>
                    <span className="nt-spinner" style={{ borderTopColor: "#fff", marginRight: 8 }} />
                    Confirming
                  </>
                ) : (
                  <>
                    Confirm booking
                    <Check size={15} aria-hidden="true" style={{ marginLeft: 6 }} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="nt-card nt-card-pad nt-summary">
          <span className="nt-mono-label">Your booking</span>
          {tutor ? (
            <div className="nt-tutor-mini mt-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tutor.photo} alt="" />
              <div>
                <strong>{tutor.fullName}</strong>
                <span>
                  {tutor.rating.toFixed(1)} rating, {tutor.reviewCount} reviews
                </span>
              </div>
            </div>
          ) : (
            <p className="nt-small nt-muted mt-3">Choose a tutor to begin.</p>
          )}

          <div className="nt-summary-row">
            <span>Subject</span>
            <span>{subject || "Not selected"}</span>
          </div>
          <div className="nt-summary-row">
            <span>Level</span>
            <span>{level ? STUDENT_LEVEL_LABELS[level] : "Not selected"}</span>
          </div>
          <div className="nt-summary-row">
            <span>Date</span>
            <span>{date || "Not selected"}</span>
          </div>
          <div className="nt-summary-row">
            <span>Time</span>
            <span>{time || "Not selected"}</span>
          </div>
          <div className="nt-summary-row">
            <span>Session</span>
            <span>
              {sessionType === "intro"
                ? "Free intro"
                : sessionType === "bundle"
                  ? `${bundleSize} session bundle`
                  : "Full session"}
            </span>
          </div>

          <div className="nt-summary-total">
            <span className="nt-mono-label">Total</span>
            <span className="nt-total">{amount === 0 ? "Free" : formatKes(amount)}</span>
          </div>

          <div className="nt-note mt-3" style={{ fontSize: 12 }}>
            <Video size={13} aria-hidden="true" style={{ marginRight: 6 }} />
            A secure video call link is included in your confirmation email.
          </div>

          <p className="nt-small nt-muted mt-3 mb-0">
            <User size={13} aria-hidden="true" style={{ marginRight: 6 }} />
            No account needed to book. You can create one afterwards to track sessions.
          </p>

          <p className="nt-small nt-muted mt-3 mb-0">
            Prefer to talk first?{" "}
            <Link href="/tutors" className="btn-link-arrow">
              Compare all tutors
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
