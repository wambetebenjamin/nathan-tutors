export interface RecaptchaResult {
  success: boolean;
  score: number;
  requiresV2: boolean;
  mode: "verified" | "disabled" | "failed";
}

/**
 * Server side reCAPTCHA v3 verification.
 * The secret key never reaches the browser. When the key is not configured
 * (local preview), verification is skipped so the flows remain testable.
 */
export async function verifyRecaptcha(
  token: string | undefined,
  action: string,
  remoteIp?: string,
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return { success: true, score: 1, requiresV2: false, mode: "disabled" };
  }

  if (!token) {
    return { success: false, score: 0, requiresV2: true, mode: "failed" };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      ...(remoteIp ? { remoteip: remoteIp } : {}),
    });

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, score: 0, requiresV2: true, mode: "failed" };
    }

    const data = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
    };

    const score = typeof data.score === "number" ? data.score : 0;
    const actionMatches = !data.action || data.action === action;
    const passed = Boolean(data.success) && actionMatches && score >= 0.5;

    return {
      success: passed,
      score,
      requiresV2: !passed,
      mode: passed ? "verified" : "failed",
    };
  } catch {
    return { success: false, score: 0, requiresV2: true, mode: "failed" };
  }
}

export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded) return undefined;
  return forwarded.split(",")[0]?.trim();
}
