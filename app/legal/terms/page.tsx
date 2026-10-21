import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use Nathan Tutors to book online lessons with a Kenyan tutor.",
  alternates: { canonical: "/legal/terms" },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "Nathan Tutors is an online tutoring marketplace operated in Nairobi, Kenya. We connect students and parents with independent, vetted tutors who teach one-on-one over video.",
      "In these terms, Nathan Tutors means the platform and its team. Tutor means the independent educator you book. You means the student, parent or guardian using the platform.",
    ],
  },
  {
    heading: "Your account",
    paragraphs: [
      "You need an account to book and manage lessons. You agree to give accurate details, keep your password private and tell us straight away if you think someone else has used your account.",
      "A parent or guardian must create the account and supervise bookings for any student under 18. Tutors must keep their qualifications and availability up to date.",
    ],
  },
  {
    heading: "Bookings and confirmation",
    paragraphs: [
      "A booking is confirmed when you receive a reference in the format NT-YYYY-#### and the session appears under My sessions. Free intro sessions last 15 minutes. Full lessons last 60 minutes unless the tutor states otherwise.",
      "Every confirmed booking includes a video call link. Join a few minutes early and use a quiet, well lit space where possible.",
    ],
  },
  {
    heading: "Prices, bundles and payment",
    paragraphs: [
      "Tutor rates are displayed per hour in Kenya Shillings. The amount due is shown before you confirm a booking. Five and ten session bundles are priced by the tutor and expire twelve months after purchase.",
      "Payments are collected by M-Pesa or by an agreed invoice for school and corporate accounts. We do not store your M-Pesa PIN or full mobile wallet credentials.",
      "If a payment fails, the slot is released and your reference becomes invalid. Message us and we will help you rebook.",
    ],
  },
  {
    heading: "Cancellations and rescheduling",
    paragraphs: [
      "You may reschedule or cancel at no cost up to 12 hours before a lesson. Tell your tutor through the platform or WhatsApp so the slot can be reopened.",
      "Cancellations inside 12 hours, and lessons missed without notice, may be charged in full at the tutor's discretion. If a tutor cancels, you receive a full refund or a free replacement lesson.",
      "Technical failures on our side are always refunded in full.",
    ],
  },
  {
    heading: "Student conduct and academic honesty",
    list: [
      "You may not record a lesson without the tutor's written agreement.",
      "You may not ask a tutor to sit an examination, complete assessed coursework or impersonate a student.",
      "You may not share tutor contact details, lesson links or paid material outside the platform.",
      "Abusive, discriminatory or threatening behaviour ends the session and may close the account.",
    ],
  },
  {
    heading: "Tutor obligations",
    paragraphs: [
      "Tutors are independent contractors, not employees of Nathan Tutors. They set their own rates and availability, deliver the lessons they accept and write a short progress note after each session.",
      "Tutors must hold the qualifications they claim, keep student information confidential and maintain professional boundaries. We may suspend a tutor profile while a safeguarding or quality concern is reviewed.",
    ],
  },
  {
    heading: "Refunds",
    paragraphs: [
      "Request a refund within 7 days of a lesson if the lesson did not take place or was materially different from what was booked. We review the booking record, the tutor's note and any messages, then respond within 5 working days.",
      "Refunds are sent to the original M-Pesa number. Bundle refunds are prorated for unused sessions.",
    ],
  },
  {
    heading: "Our responsibility",
    paragraphs: [
      "We work hard to verify tutors and keep the platform available, but we do not guarantee a particular grade, examination result or admission outcome. Progress depends on the student's work between sessions.",
      "To the extent permitted by Kenyan law, our liability for any claim connected with a lesson is limited to the amount you paid for that lesson.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms as the service develops. The last updated date at the top of this page always shows the current version. If a change materially affects paid bookings, we will tell you by email before it applies.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of service"
      intro="These terms explain how bookings, payments, cancellations and conduct work on Nathan Tutors. Please read them before you book a lesson."
      updated="12 January 2026"
      sections={SECTIONS}
    />
  );
}
