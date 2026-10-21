import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nathan Tutors collects, uses and protects personal data under the Kenya Data Protection Act 2019.",
  alternates: { canonical: "/legal/privacy-policy" },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "What we collect",
    list: [
      "Account details: your name, email address, phone number and password hash. Passwords are never stored in plain text.",
      "Booking details: the student name, class or year, subject, lesson time, topic and contact details provided at checkout.",
      "Tutor application details: qualifications, teaching experience, languages and the CV you upload.",
      "Payment references from M-Pesa or your bank. We do not store card numbers or M-Pesa PINs.",
      "Technical data: pages visited, device type and referral source, collected through Vercel Analytics in aggregate form.",
    ],
  },
  {
    heading: "Why we use it",
    paragraphs: [
      "We use your data to create and confirm bookings, match students with the right tutor, send lesson reminders and receipts, pay tutors, review tutor applications and answer support requests.",
      "We also use aggregated data to understand which subjects and pages are most useful so we can improve the service.",
    ],
  },
  {
    heading: "Legal basis",
    paragraphs: [
      "We process personal data under the Kenya Data Protection Act 2019 on the basis of contract performance for bookings and payments, legitimate interest for service improvement and fraud prevention, and consent for optional communications such as the newsletter.",
    ],
  },
  {
    heading: "Who we share it with",
    list: [
      "Your tutor, who needs the lesson details, the student name and the topic to prepare.",
      "Vercel, which hosts the site and stores booking records in its managed storage.",
      "Email providers that deliver confirmations and reminders.",
      "Google reCAPTCHA, which processes interaction signals to keep the forms free of automated submissions.",
      "Payment providers and mobile money operators, only to confirm and reconcile payment.",
    ],
  },
  {
    heading: "Children's data",
    paragraphs: [
      "Most of our students are minors. A parent or guardian must create the account and provide consent for a child to take lessons. We collect only the child's first name, class or year and the subjects they study.",
      "Tutors are not permitted to contact a student outside the platform. Progress notes are visible to the student and the account holder.",
    ],
  },
  {
    heading: "How long we keep data",
    paragraphs: [
      "Booking and payment records are kept for seven years to meet Kenyan tax and accounting requirements. Tutor applications that are not successful are deleted after twelve months. Marketing consent records are kept until you withdraw consent.",
    ],
  },
  {
    heading: "Your rights",
    list: [
      "Ask for a copy of the personal data we hold about you.",
      "Correct information that is wrong or out of date.",
      "Ask us to delete data that is no longer needed for a legal or contractual reason.",
      "Object to marketing messages at any time using the unsubscribe link or a WhatsApp message.",
      "Complain to the Office of the Data Protection Commissioner if you are unhappy with our response.",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "Data moves over HTTPS. Access to booking records is limited to the account holder, the assigned tutor and a small group of staff who need it for support or accounting. We review access regularly and remove accounts that are no longer active.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "Email hello@nathan-tutors.co.ke or WhatsApp +254 112 272 061. We aim to respond to privacy requests within 14 days. This policy is governed by the laws of Kenya.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      intro="This policy explains what personal data Nathan Tutors collects, why we need it and the choices you have. It applies to students, parents and tutors."
      updated="12 January 2026"
      sections={SECTIONS}
    />
  );
}
