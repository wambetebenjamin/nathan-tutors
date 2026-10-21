"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "nathan_tutors_consent";

interface Preferences {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const DEFAULT_PREFERENCES: Preferences = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setVisible(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<Preferences>;
      setPreferences({
        necessary: true,
        functional: parsed.functional ?? true,
        analytics: parsed.analytics ?? false,
        marketing: parsed.marketing ?? false,
        updatedAt: parsed.updatedAt ?? "",
      });
    } catch {
      setVisible(true);
    }
  }, []);

  const save = useCallback((next: Preferences) => {
    const value: Preferences = {
      ...next,
      necessary: true,
      updatedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // storage may be unavailable in private mode, the banner still closes
    }
    setPreferences(value);
    setVisible(false);
    setShowModal(false);
  }, []);

  useEffect(() => {
    const openSettings = () => {
      setVisible(true);
      setShowModal(true);
    };
    window.addEventListener("nt:open-cookie-settings", openSettings);
    return () => window.removeEventListener("nt:open-cookie-settings", openSettings);
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal]);

  return (
    <>
      {visible ? (
        <div
          className="nt-cookie"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="container">
            <div className="row align-items-center" style={{ gap: 16 }}>
              <div className="col-lg-7">
                <h2>We use cookies to improve your tutoring experience</h2>
                <p>
                  Necessary cookies keep booking and sign in working. With your
                  permission we also use functional and analytics cookies to
                  improve the site. Read our{" "}
                  <Link href="/legal/cookie-policy">cookie policy</Link> for details
                  under the Kenya Data Protection Act 2019.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="nt-cookie-actions">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => setShowModal(true)}
                  >
                    Manage preferences
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      save({
                        necessary: true,
                        functional: true,
                        analytics: true,
                        marketing: true,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                  >
                    Accept all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showModal ? (
        <div className="nt-overlay" role="presentation" onMouseDown={() => setShowModal(false)}>
          <div
            className="nt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 id="cookie-preferences-title" className="mb-1">
                  Cookie preferences
                </h2>
                <p className="nt-muted mb-0" style={{ fontSize: 13 }}>
                  You can change these choices at any time from the cookie policy page.
                </p>
              </div>
              <button
                type="button"
                className="nt-nav-toggle"
                onClick={() => setShowModal(false)}
                aria-label="Close cookie preferences"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="nt-pref">
              <div>
                <h3>Necessary</h3>
                <p>Required for booking, sessions and security. These cannot be switched off.</p>
              </div>
              <label className="nt-switch">
                <input type="checkbox" checked disabled aria-label="Necessary cookies are always on" />
                <span />
              </label>
            </div>

            <div className="nt-pref">
              <div>
                <h3>Functional</h3>
                <p>Remembers your preferred student level, last subject and tutor shortlist.</p>
              </div>
              <label className="nt-switch">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(event) =>
                    setPreferences({ ...preferences, functional: event.target.checked })
                  }
                  aria-label="Functional cookies"
                />
                <span />
              </label>
            </div>

            <div className="nt-pref">
              <div>
                <h3>Analytics</h3>
                <p>Helps us understand which subjects and pages students use most.</p>
              </div>
              <label className="nt-switch">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(event) =>
                    setPreferences({ ...preferences, analytics: event.target.checked })
                  }
                  aria-label="Analytics cookies"
                />
                <span />
              </label>
            </div>

            <div className="nt-pref">
              <div>
                <h3>Marketing</h3>
                <p>Lets us measure outreach for tutoring offers. Off by default.</p>
              </div>
              <label className="nt-switch">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(event) =>
                    setPreferences({ ...preferences, marketing: event.target.checked })
                  }
                  aria-label="Marketing cookies"
                />
                <span />
              </label>
            </div>

            <div className="d-flex flex-wrap justify-content-end mt-4" style={{ gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() =>
                  save({
                    necessary: true,
                    functional: false,
                    analytics: false,
                    marketing: false,
                    updatedAt: new Date().toISOString(),
                  })
                }
              >
                Reject optional
              </button>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => save(preferences)}
              >
                Save choices
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  save({
                    necessary: true,
                    functional: true,
                    analytics: true,
                    marketing: true,
                    updatedAt: new Date().toISOString(),
                  })
                }
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
