"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[nathan-tutors] global error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Raleway, Arial, sans-serif",
          background: "#f8f9fa",
          color: "#364d59",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              maxWidth: 560,
              background: "#ffffff",
              borderRadius: 4,
              padding: "48px 36px",
              textAlign: "center",
              boxShadow: "0 6px 30px rgba(0, 0, 0, 0.07)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.2rem",
                textTransform: "uppercase",
                color: "#0779e4",
                fontWeight: 700,
                margin: "0 0 12px",
              }}
            >
              Nathan Tutors
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 12px", color: "#000" }}>
              The site could not load
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" }}>
              Something interrupted the page before it finished loading. Please reload.
              If you were booking a lesson, your reference remains valid and our team can
              resend the confirmation.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                background: "#0779e4",
                color: "#ffffff",
                border: 0,
                borderRadius: 4,
                padding: "14px 26px",
                fontSize: 12,
                letterSpacing: "0.1rem",
                textTransform: "uppercase",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Reload the page
            </button>
            <p style={{ fontSize: 13, color: "#636363", margin: "24px 0 0" }}>
              WhatsApp +254 112 272 061 or email hello@nathan-tutors.co.ke
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
