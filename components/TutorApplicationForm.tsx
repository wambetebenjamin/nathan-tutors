"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Check, FileUp, Loader2 } from "lucide-react";
import { SUBJECTS, STUDENT_LEVEL_LABELS } from "@/lib/data";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { RecaptchaFallback } from "./RecaptchaFallback";

const LEVELS = ["primary", "secondary", "university"] as const;
const LANGUAGES = ["English", "Kiswahili", "French", "Somali", "Kikuyu", "Luo"];

export function TutorApplicationForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    university: "",
    experienceYears: "2",
    rate: "1200",
    philosophy: "",
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>(["secondary"]);
  const [languages, setLanguages] = useState<string[]>(["English", "Kiswahili"]);
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIssues([]);
    setNeedsV2(false);

    if (subjects.length === 0) {
      setError("Choose at least one subject you can teach.");
      return;
    }
    if (levels.length === 0) {
      setError("Choose the levels you teach.");
      return;
    }
    if (languages.length === 0) {
      setError("Choose at least one teaching language.");
      return;
    }
    if (form.philosophy.trim().length < 40) {
      setError("Tell us about your teaching approach in at least 40 characters.");
      return;
    }
    if (!cv) {
      setError("Please attach your CV as a PDF or Word document.");
      return;
    }
    if (cv.size > 5 * 1024 * 1024) {
      setError("Your CV must be 5 MB or smaller.");
      return;
    }

    setStatus("sending");
    const token = await getRecaptchaToken("tutor_application");

    const body = new FormData();
    body.append("fullName", form.fullName.trim());
    body.append("email", form.email.trim());
    body.append("phone", form.phone.trim());
    body.append("qualification", form.qualification.trim());
    body.append("university", form.university.trim());
    body.append("experienceYears", form.experienceYears);
    body.append("rate", form.rate);
    body.append("philosophy", form.philosophy.trim());
    subjects.forEach((item) => body.append("subjects", item));
    levels.forEach((item) => body.append("levels", item));
    languages.forEach((item) => body.append("languages", item));
    body.append("recaptchaToken", token ?? "");
    if (v2Token) body.append("v2Token", v2Token);
    body.append("cv", cv);

    try {
      const response = await fetch("/api/tutor/apply", { method: "POST", body });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
        requiresV2?: boolean;
        issues?: { fieldErrors?: Record<string, string[]> };
      };
      if (!response.ok) {
        if (payload.requiresV2) setNeedsV2(true);
        setError(payload.error ?? "We could not send your application.");
        const fieldErrors = payload.issues?.fieldErrors;
        if (fieldErrors) {
          setIssues(
            Object.entries(fieldErrors).flatMap(([field, messages]) =>
              (messages ?? []).map((message) => `${field}: ${message}`),
            ),
          );
        }
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        className="nt-card nt-card-pad text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <span className="nt-confirm-check">
          <Check size={38} aria-hidden="true" />
        </span>
        <h2 style={{ fontSize: 26, fontWeight: 900 }}>Application received</h2>
        <p className="nt-muted">
          Thank you {form.fullName.split(" ")[0]}. Our academic team reviews applications
          within three working days. We will contact you on WhatsApp or email to arrange a
          short interview and a subject check.
        </p>
        <Link href="/tutors" className="btn btn-primary">
          Browse the tutor directory
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="nt-flow-card">
      {error ? (
        <div className="d-flex align-items-start mb-3" style={{ gap: 8, color: "#b02a37" }}>
          <AlertCircle size={17} aria-hidden="true" style={{ marginTop: 2 }} />
          <div>
            <p className="mb-1" style={{ fontSize: 14, fontWeight: 700 }}>
              {error}
            </p>
            {issues.length > 0 ? (
              <ul className="nt-small mb-0" style={{ paddingLeft: 16 }}>
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <span className="nt-mono-label d-block mb-3">Step 1 of 4: About you</span>
      <div className="row">
        <div className="col-md-6">
          <div className="nt-field">
            <label htmlFor="app-name">Full name</label>
            <input
              id="app-name"
              className="form-control"
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="nt-field">
            <label htmlFor="app-phone">Phone number</label>
            <input
              id="app-phone"
              type="tel"
              className="form-control"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="0712 345 678"
              required
            />
          </div>
        </div>
      </div>
      <div className="nt-field">
        <label htmlFor="app-email">Email address</label>
        <input
          id="app-email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
      </div>

      <hr className="nt-rule" />
      <span className="nt-mono-label d-block mb-3">Step 2 of 4: What you teach</span>

      <div className="nt-field">
        <label>Subjects</label>
        <div className="row">
          {SUBJECTS.map((subject) => (
            <div className="col-md-6" key={subject.slug}>
              <label className="nt-check d-flex">
                <input
                  type="checkbox"
                  checked={subjects.includes(subject.name)}
                  onChange={() => setSubjects((current) => toggle(current, subject.name))}
                />
                <span style={{ fontSize: 13 }}>{subject.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="nt-field">
            <label>Levels</label>
            {LEVELS.map((level) => (
              <label className="nt-check d-flex" key={level}>
                <input
                  type="checkbox"
                  checked={levels.includes(level)}
                  onChange={() => setLevels((current) => toggle(current, level))}
                />
                <span style={{ fontSize: 13 }}>{STUDENT_LEVEL_LABELS[level]}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="nt-field">
            <label>Teaching languages</label>
            {LANGUAGES.map((language) => (
              <label className="nt-check d-flex" key={language}>
                <input
                  type="checkbox"
                  checked={languages.includes(language)}
                  onChange={() => setLanguages((current) => toggle(current, language))}
                />
                <span style={{ fontSize: 13 }}>{language}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <hr className="nt-rule" />
      <span className="nt-mono-label d-block mb-3">Step 3 of 4: Qualifications</span>

      <div className="row">
        <div className="col-md-6">
          <div className="nt-field">
            <label htmlFor="app-qualification">Highest qualification</label>
            <input
              id="app-qualification"
              className="form-control"
              value={form.qualification}
              onChange={(event) => setForm({ ...form, qualification: event.target.value })}
              placeholder="e.g. BEd Mathematics, First Class"
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="nt-field">
            <label htmlFor="app-university">Institution</label>
            <input
              id="app-university"
              className="form-control"
              value={form.university}
              onChange={(event) => setForm({ ...form, university: event.target.value })}
              placeholder="e.g. University of Nairobi"
              required
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="nt-field">
            <label htmlFor="app-experience">Years of teaching experience</label>
            <input
              id="app-experience"
              type="number"
              min={0}
              max={60}
              className="form-control"
              value={form.experienceYears}
              onChange={(event) => setForm({ ...form, experienceYears: event.target.value })}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="nt-field">
            <label htmlFor="app-rate">Proposed hourly rate (KES)</label>
            <input
              id="app-rate"
              type="number"
              min={300}
              max={20000}
              step={50}
              className="form-control"
              value={form.rate}
              onChange={(event) => setForm({ ...form, rate: event.target.value })}
              required
            />
            <p className="nt-small nt-muted mt-1 mb-0">
              Most Nathan Tutors charge between KES 800 and KES 2,200 per hour.
            </p>
          </div>
        </div>
      </div>

      <div className="nt-field">
        <label htmlFor="app-philosophy">How do you teach?</label>
        <textarea
          id="app-philosophy"
          className="form-control"
          rows={5}
          value={form.philosophy}
          onChange={(event) => setForm({ ...form, philosophy: event.target.value })}
          placeholder="Describe how you diagnose gaps, plan lessons and keep a student motivated. A real example helps."
          required
        />
        <p className="nt-small nt-muted mt-1 mb-0">
          {form.philosophy.trim().length} of 40 characters minimum.
        </p>
      </div>

      <hr className="nt-rule" />
      <span className="nt-mono-label d-block mb-3">Step 4 of 4: Your CV</span>

      <div className="nt-field">
        <label htmlFor="app-cv">Attach your CV</label>
        <label className={`nt-upload${cv ? " has-file" : ""}`} htmlFor="app-cv">
          <FileUp size={22} aria-hidden="true" style={{ color: "#0779e4" }} />
          <span>
            <strong style={{ display: "block", fontSize: 14 }}>
              {cv ? cv.name : "Choose a PDF or Word document"}
            </strong>
            <span className="nt-small nt-muted">
              {cv
                ? `${(cv.size / 1024 / 1024).toFixed(2)} MB selected, click to replace`
                : "Maximum 5 MB. PDF, DOC or DOCX."}
            </span>
          </span>
        </label>
        <input
          id="app-cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="nt-sr-only"
          onChange={(event) => setCv(event.target.files?.[0] ?? null)}
        />
      </div>

      {needsV2 ? <RecaptchaFallback onToken={setV2Token} /> : null}

      <button type="submit" className="btn btn-primary btn-block mt-3" disabled={status === "sending"} style={{ padding: "15px 20px" }}>
        {status === "sending" ? (
          <Loader2 size={16} className="nt-spin" aria-hidden="true" />
        ) : null}
        {status === "sending" ? " Sending application" : "Send application"}
      </button>
      <p className="nt-small nt-muted mt-3 mb-0">
        We review every application within three working days. This form is protected by
        reCAPTCHA and your details are handled under our{" "}
        <Link href="/legal/privacy-policy">privacy policy</Link>.
      </p>
    </form>
  );
}
