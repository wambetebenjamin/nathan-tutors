"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setHidden(true), 1300);
    const removeTimer = window.setTimeout(() => setRemoved(true), 1900);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      className={`nt-preloader${hidden ? " is-hidden" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Nathan Tutors"
    >
      <div className="nt-preloader-brand">
        Nathan<span>.</span>Tutors
      </div>

      <svg
        width="230"
        height="58"
        viewBox="0 0 230 58"
        fill="none"
        aria-hidden="true"
      >
        <g className="nt-pencil">
          <path d="M4 47 L7 34 L19 22 L28 31 L16 43 Z" fill="#0779e4" />
          <path d="M19 22 L24 17 L33 26 L28 31 Z" fill="#000" />
          <path d="M24 17 L28 13 L37 22 L33 26 Z" fill="#f8f9fa" stroke="#000" strokeWidth="1" />
          <path d="M7 34 L16 43 L4 47 Z" fill="#364d59" />
        </g>
        <path
          className="nt-pencil-line"
          d="M40 47 H214"
          stroke="#0779e4"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <div className="nt-preloader-bar">
        <span className="nt-preloader-fill" />
      </div>
      <span className="nt-preloader-caption">Finding your tutor</span>
    </div>
  );
}
