"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[nathan-tutors] route error", error);
  }, [error]);

  return (
    <section className="site-section">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-7">
            <div className="nt-code" aria-hidden="true">
              500
            </div>
            <span className="nt-eyebrow">Something went wrong</span>
            <h1 style={{ fontSize: 34, fontWeight: 900 }} className="mb-2">
              We hit a problem loading this page
            </h1>
            <p className="nt-muted mb-4">
              Your booking data is safe. Try the page again, or head back to the tutor
              directory. If it keeps happening, message us on WhatsApp with the reference
              shown below.
            </p>
            {error.digest ? (
              <p className="nt-small nt-muted">
                Reference: <code className="nt-code-inline">{error.digest}</code>
              </p>
            ) : null}
            <div className="d-flex flex-wrap justify-content-center" style={{ gap: 10 }}>
              <button type="button" className="btn btn-primary" onClick={reset}>
                <RefreshCw size={15} aria-hidden="true" style={{ marginRight: 6 }} />
                Try again
              </button>
              <Link href="/" className="btn btn-outline-dark">
                Back to home
              </Link>
              <Link href="/tutors" className="btn btn-outline-dark">
                Find a tutor
              </Link>
            </div>

            <div className="nt-note mt-4 text-left">
              <AlertTriangle size={14} aria-hidden="true" style={{ marginRight: 6 }} />
              If you were part way through a booking, your reference is still valid. Open
              My sessions to pick it up again.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
