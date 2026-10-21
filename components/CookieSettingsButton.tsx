"use client";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="nt-footer-link"
      onClick={() => window.dispatchEvent(new Event("nt:open-cookie-settings"))}
    >
      Cookie settings
    </button>
  );
}
