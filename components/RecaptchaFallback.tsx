"use client";

import { useEffect, useRef, useState } from "react";
import { loadRecaptchaV2, recaptchaSiteKey } from "@/lib/recaptcha-client";

/**
 * Visible reCAPTCHA v2 fallback. It only appears when the server reports a v3
 * score below 0.5, and it is rendered explicitly so no widget loads up front.
 */
export function RecaptchaFallback({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const siteKey = recaptchaSiteKey();

    if (!siteKey) return;

    loadRecaptchaV2()
      .then(() => {
        if (cancelled || !container.current || !window.grecaptcha) return;
        window.grecaptcha.render(container.current, {
          sitekey: siteKey,
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(""),
        });
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-3">
      <p className="nt-small nt-muted mb-2">
        One quick check before we continue:
      </p>
      {error || !recaptchaSiteKey() ? (
        <p className="nt-error mb-0">
          The verification widget could not load. Please message us on WhatsApp and we
          will complete your booking for you.
        </p>
      ) : (
        <div ref={container} />
      )}
    </div>
  );
}
