import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies and local storage keys Nathan Tutors uses, what each one does and how to change your choice.",
  alternates: { canonical: "/legal/cookie-policy" },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Our approach",
    paragraphs: [
      "We keep tracking to a minimum. The site works without marketing cookies, and nothing is placed before you choose in the consent banner. Your choice is remembered in your own browser using the local storage key nathan_tutors_consent.",
    ],
  },
  {
    heading: "Strictly necessary",
    list: [
      "next-auth.session-token: keeps you signed in to your account. Removed when you sign out or the session expires.",
      "nt_last_booking: an httpOnly cookie that lets you reopen your own booking confirmation without signing in. Expires after 24 hours.",
      "nathan_tutors_consent: stores your consent choice in local storage so we do not ask on every page.",
      "nt_bookings_cache: a short lived browser entry that helps the booking wizard remember your draft while you move between steps.",
    ],
  },
  {
    heading: "Functional",
    list: [
      "nt_voice_tour: remembers if you have already heard the voice tour so it does not start again.",
      "nt_preloader_seen: remembers that the intro animation has played during your current visit.",
    ],
  },
  {
    heading: "Analytics",
    paragraphs: [
      "If you accept analytics, Vercel Analytics and Speed Insights record aggregated page views and performance timings. They do not create advertising profiles and we do not sell data.",
    ],
  },
  {
    heading: "Third party services",
    paragraphs: [
      "Google reCAPTCHA loads only on forms that need protection and may set its own cookies to distinguish people from automated submissions. Its use is covered by Google's privacy policy and terms.",
      "Embedded video players, if used in a lesson page, may set their own cookies once you press play.",
    ],
  },
  {
    heading: "Changing your choice",
    paragraphs: [
      "Use the Cookie settings link in the footer to reopen the banner and choose again. Clearing site data in your browser also removes your previous choice, and the banner will reappear on your next visit.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      title="Cookie policy"
      intro="A short, plain explanation of the cookies and local storage keys this site uses, and how to change your consent choice."
      updated="12 January 2026"
      sections={SECTIONS}
    />
  );
}
