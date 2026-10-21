"use client";

interface Grecaptcha {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
    },
  ) => number;
  reset: (id?: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    __ntRecaptchaV2Loaded?: () => void;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

export function hasRecaptcha(): boolean {
  return Boolean(SITE_KEY);
}

let v3Promise: Promise<void> | null = null;

export function loadRecaptchaV3(): Promise<void> {
  if (!SITE_KEY) return Promise.resolve();
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (v3Promise) return v3Promise;

  v3Promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-nt-recaptcha="v3"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("recaptcha failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.ntRecaptcha = "v3";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recaptcha failed"));
    document.head.appendChild(script);
  });

  return v3Promise;
}

export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  if (!SITE_KEY) return undefined;
  try {
    await loadRecaptchaV3();
    if (!window.grecaptcha) return undefined;
    await new Promise<void>((resolve) => {
      window.grecaptcha?.ready(() => resolve());
    });
    return await window.grecaptcha.execute(SITE_KEY, { action });
  } catch {
    return undefined;
  }
}

export function loadRecaptchaV2(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha?.render) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    window.__ntRecaptchaV2Loaded = () => resolve();
    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js?onload=__ntRecaptchaV2Loaded&render=explicit";
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("recaptcha v2 failed"));
    document.head.appendChild(script);
  });
}

export function recaptchaSiteKey(): string {
  return SITE_KEY;
}
