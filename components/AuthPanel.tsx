"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AlertCircle, Check, GraduationCap, Loader2 } from "lucide-react";
import { DEMO_ACCOUNTS, STUDENT_LEVEL_LABELS, SUBJECTS } from "@/lib/data";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { RecaptchaFallback } from "./RecaptchaFallback";

type Mode = "signin" | "signup";
type Role = "student" | "parent" | "tutor";

const ROLE_COPY: Record<Role, { title: string; blurb: string }> = {
  student: {
    title: "Student",
    blurb: "Book lessons, join sessions and review your tutors.",
  },
  parent: {
    title: "Parent",
    blurb: "Manage your child's lessons, payments and progress notes.",
  },
  tutor: {
    title: "Tutor",
    blurb: "Accept bookings, track earnings and write progress notes.",
  },
};

export function AuthPanel({
  mode,
  googleEnabled,
  initialRole,
  next,
}: {
  mode: Mode;
  googleEnabled: boolean;
  initialRole?: Role;
  next?: string;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole ?? "student");
  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    studentName: "",
    schoolYear: "",
    subjects: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState("");

  const destination = (targetRole: Role) => {
    if (next) return next;
    if (targetRole === "tutor") return "/tutor/dashboard";
    return "/my-sessions";
  };

  const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: signin.email.trim(),
        password: signin.password,
        redirect: false,
      });
      if (!result || result.error) {
        setError(
          "Those details did not match an account. Use one of the demo accounts below or create a new account.",
        );
        return;
      }
      router.push(destination(role));
      router.refresh();
    } catch {
      setError("We could not sign you in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignin = async (email: string, password: string, demoRole: Role) => {
    setError("");
    setDemoLoading(email);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result || result.error) {
        setError("Demo sign in failed. Please try again.");
        return;
      }
      router.push(destination(demoRole));
      router.refresh();
    } catch {
      setError("Demo sign in failed. Please try again.");
    } finally {
      setDemoLoading(null);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setNeedsV2(false);

    if (signup.password.length < 8) {
      setError("Choose a password of at least 8 characters.");
      return;
    }
    if (role === "parent" && !signup.studentName.trim()) {
      setError("Add your child's name so we can link their sessions.");
      return;
    }
    if (role === "tutor" && signup.subjects.length === 0) {
      setError("Choose at least one subject you can teach.");
      return;
    }

    setLoading(true);
    const token = await getRecaptchaToken("signup");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signup.name.trim(),
          email: signup.email.trim(),
          phone: signup.phone.trim(),
          role,
          studentName: signup.studentName.trim() || undefined,
          schoolYear: signup.schoolYear.trim() || undefined,
          recaptchaToken: token,
          v2Token: v2Token || undefined,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        message?: string;
        requiresV2?: boolean;
      };
      if (!response.ok) {
        if (data.requiresV2) setNeedsV2(true);
        setError(data.error ?? "We could not create your account.");
        return;
      }
      setSuccess(
        role === "tutor"
          ? "Account created. Next, send us your CV and teaching details through the tutor application."
          : data.message ?? "Account created. You can sign in now.",
      );
      setSignin({ email: signup.email, password: signup.password });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-7 mb-4">
        <div className="nt-flow-card">
          {mode === "signup" ? (
            <div className="mb-3">
              <span className="nt-mono-label d-block mb-2">I am joining as</span>
              <div className="row">
                {(Object.keys(ROLE_COPY) as Role[]).map((item) => (
                  <div className="col-md-4 mb-2" key={item}>
                    <button
                      type="button"
                      className={`nt-choice${role === item ? " is-selected" : ""}`}
                      onClick={() => setRole(item)}
                      aria-pressed={role === item}
                      style={{ padding: 14 }}
                    >
                      <span>
                        <span className="nt-choice-title d-block" style={{ fontSize: 14 }}>
                          {ROLE_COPY[item].title}
                        </span>
                        <span className="nt-choice-meta d-block" style={{ fontSize: 12 }}>
                          {ROLE_COPY[item].blurb}
                        </span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <span className="nt-mono-label d-block mb-2">Sign in as</span>
              <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                {(Object.keys(ROLE_COPY) as Role[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`btn ${role === item ? "btn-primary" : "btn-outline-dark"}`}
                    style={{ fontSize: 11, letterSpacing: "0.08rem", textTransform: "uppercase", padding: "10px 16px" }}
                    onClick={() => setRole(item)}
                    aria-pressed={role === item}
                  >
                    {ROLE_COPY[item].title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error ? (
            <div className="d-flex align-items-start mb-3" style={{ gap: 8, color: "#b02a37" }}>
              <AlertCircle size={16} aria-hidden="true" style={{ marginTop: 2 }} />
              <p className="mb-0" style={{ fontSize: 14 }}>
                {error}
              </p>
            </div>
          ) : null}

          {success ? (
            <div className="nt-note mb-3" style={{ borderLeftColor: "#71bc42" }}>
              <p className="mb-2" style={{ fontWeight: 700 }}>
                <Check size={14} aria-hidden="true" style={{ marginRight: 6 }} />
                {success}
              </p>
              <Link href="/auth/signin" className="btn-link-arrow">
                Go to sign in
              </Link>
            </div>
          ) : null}

          {mode === "signin" ? (
            <form onSubmit={handleSignin} className="nt-form">
              <div className="nt-field">
                <label htmlFor="signin-email">Email address</label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  className="form-control"
                  value={signin.email}
                  onChange={(event) => setSignin({ ...signin, email: event.target.value })}
                  required
                />
              </div>
              <div className="nt-field">
                <label htmlFor="signin-password">Password</label>
                <input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  className="form-control"
                  value={signin.password}
                  onChange={(event) => setSignin({ ...signin, password: event.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: "14px 20px" }}>
                {loading ? <Loader2 size={16} className="nt-spin" aria-hidden="true" /> : null}
                {loading ? " Signing in" : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="nt-form">
              <div className="nt-field">
                <label htmlFor="signup-name">
                  {role === "parent" ? "Parent full name" : "Full name"}
                </label>
                <input
                  id="signup-name"
                  className="form-control"
                  value={signup.name}
                  onChange={(event) => setSignup({ ...signup, name: event.target.value })}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="nt-field">
                    <label htmlFor="signup-email">Email address</label>
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      className="form-control"
                      value={signup.email}
                      onChange={(event) => setSignup({ ...signup, email: event.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="nt-field">
                    <label htmlFor="signup-phone">Phone number</label>
                    <input
                      id="signup-phone"
                      type="tel"
                      className="form-control"
                      value={signup.phone}
                      onChange={(event) => setSignup({ ...signup, phone: event.target.value })}
                      placeholder="0712 345 678"
                      required
                    />
                  </div>
                </div>
              </div>

              {role === "parent" ? (
                <div className="row">
                  <div className="col-md-6">
                    <div className="nt-field">
                      <label htmlFor="signup-child">Child full name</label>
                      <input
                        id="signup-child"
                        className="form-control"
                        value={signup.studentName}
                        onChange={(event) => setSignup({ ...signup, studentName: event.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="nt-field">
                      <label htmlFor="signup-year">Child class or year</label>
                      <select
                        id="signup-year"
                        className="form-control"
                        value={signup.schoolYear}
                        onChange={(event) => setSignup({ ...signup, schoolYear: event.target.value })}
                      >
                        <option value="">Choose</option>
                        {Object.entries(STUDENT_LEVEL_LABELS).map(([value, label]) => (
                          <option key={value} value={label}>
                            {label}
                          </option>
                        ))}
                        <option value="Form 4">Form 4</option>
                        <option value="Standard 8">Standard 8</option>
                        <option value="Year 2 university">Year 2 university</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : null}

              {role === "student" ? (
                <div className="nt-field">
                  <label htmlFor="signup-level">Class or year of study</label>
                  <input
                    id="signup-level"
                    className="form-control"
                    value={signup.schoolYear}
                    onChange={(event) => setSignup({ ...signup, schoolYear: event.target.value })}
                    placeholder="e.g. Form 4, Standard 7, Year 1 university"
                  />
                </div>
              ) : null}

              {role === "tutor" ? (
                <div className="nt-field">
                  <label>Subjects you teach</label>
                  <div style={{ maxHeight: 168, overflowY: "auto", padding: "4px 2px" }}>
                    {SUBJECTS.map((subject) => (
                      <label className="nt-check d-flex" key={subject.slug} style={{ marginRight: 0 }}>
                        <input
                          type="checkbox"
                          checked={signup.subjects.includes(subject.name)}
                          onChange={(event) => {
                            setSignup((current) => ({
                              ...current,
                              subjects: event.target.checked
                                ? [...current.subjects, subject.name]
                                : current.subjects.filter((item) => item !== subject.name),
                            }));
                          }}
                        />
                        <span style={{ fontSize: 13 }}>{subject.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="nt-small nt-muted mb-0">
                    After sign up you will complete the tutor application and upload your CV.
                  </p>
                </div>
              ) : null}

              <div className="nt-field">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  className="form-control"
                  value={signup.password}
                  onChange={(event) => setSignup({ ...signup, password: event.target.value })}
                  minLength={8}
                  required
                />
                <p className="nt-small nt-muted mt-1 mb-0">At least 8 characters.</p>
              </div>

              {needsV2 ? <RecaptchaFallback onToken={setV2Token} /> : null}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: "14px 20px" }}>
                {loading ? "Creating account" : "Create account"}
              </button>
              <p className="nt-small nt-muted mt-3 mb-0">
                By creating an account you agree to our{" "}
                <Link href="/legal/terms">terms of service</Link> and{" "}
                <Link href="/legal/privacy-policy">privacy policy</Link>. This form is
                protected by reCAPTCHA.
              </p>
            </form>
          )}

          {googleEnabled ? (
            <>
              <div className="d-flex align-items-center my-3" style={{ gap: 12 }}>
                <span style={{ height: 1, background: "#e9ecef", flex: 1 }} />
                <span className="nt-small nt-muted">or</span>
                <span style={{ height: 1, background: "#e9ecef", flex: 1 }} />
              </div>
              <button
                type="button"
                className="btn btn-outline-dark btn-block"
                onClick={() => signIn("google", { redirectTo: destination(role) })}
                style={{ padding: "12px 20px" }}
              >
                Continue with Google
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="col-lg-5">
        <div className="nt-card nt-card-pad mb-4">
          <h2 style={{ fontSize: 19, fontWeight: 700 }} className="mb-2">
            Try a demo account
          </h2>
          <p className="nt-small nt-muted">
            These accounts are seeded for demonstration. No real student data is used.
          </p>
          <div className="d-flex flex-column" style={{ gap: 10 }}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                className="nt-choice"
                onClick={() => handleDemoSignin(account.email, account.password, account.role)}
                disabled={demoLoading !== null}
              >
                <GraduationCap size={22} aria-hidden="true" style={{ color: "#0779e4", marginTop: 2 }} />
                <span style={{ flex: 1 }}>
                  <span className="nt-choice-title d-block" style={{ fontSize: 15 }}>
                    {account.label} account
                  </span>
                  <span className="nt-choice-meta d-block">{account.email}</span>
                </span>
                <span className="nt-badge nt-badge-primary">
                  {demoLoading === account.email ? "Signing in" : "Open"}
                </span>
              </button>
            ))}
          </div>
          <p className="nt-small nt-muted mt-3 mb-0">
            Demo password: <strong>nathan2026</strong>
          </p>
        </div>

        <div className="nt-card nt-card-pad">
          <h2 style={{ fontSize: 17, fontWeight: 700 }} className="mb-2">
            {mode === "signin" ? "New to Nathan Tutors?" : "Already have an account?"}
          </h2>
          <p className="nt-small nt-muted">
            {mode === "signin"
              ? "Create a student, parent or tutor account to manage bookings in one place."
              : "Sign in to see your sessions, receipts and progress notes."}
          </p>
          <Link
            href={mode === "signin" ? "/auth/signup" : "/auth/signin"}
            className="btn btn-outline-dark btn-block"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </Link>
        </div>
      </div>
    </div>
  );
}
