import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Wallet, Users } from "lucide-react";
import { TutorApplicationForm } from "@/components/TutorApplicationForm";
import { STATS, formatKes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Become a Tutor",
  description:
    "Teach online with Nathan Tutors. Earn between KES 800 and KES 2,200 per hour, set your own availability and get paid every Friday.",
  alternates: { canonical: "/become-a-tutor" },
};

const BENEFITS = [
  {
    icon: Wallet,
    title: "Fair, transparent pay",
    body: "Set your own hourly rate. We show the platform fee up front and pay out every Friday to M-Pesa.",
  },
  {
    icon: Clock,
    title: "You choose the hours",
    body: "Open the slots that fit around your studies or job. Close them any week you need a break.",
  },
  {
    icon: Users,
    title: "Students matched to your subjects",
    body: "We only send you enquiries in the subjects and levels you actually teach.",
  },
  {
    icon: Check,
    title: "Verified, professional profile",
    body: "We check your ID, certificates and subject knowledge before your profile goes live.",
  },
];

const STEPS = [
  {
    title: "Apply online",
    body: "Send your details and CV. The form takes about six minutes.",
  },
  {
    title: "Short interview and subject check",
    body: "A 20 minute video call with our academic lead, plus a short task in your main subject.",
  },
  {
    title: "Profile build",
    body: "We help you write your teaching style, credentials and intro video script.",
  },
  {
    title: "Start teaching",
    body: "Accept your first free intro session and grow from there. Most tutors fill three to five slots in their first month.",
  },
];

export default function BecomeATutorPage() {
  return (
    <>
      <section className="site-section-cover overlay inner-page" style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-9 text-center">
              <h1>
                Teach with <strong>Nathan Tutors</strong>
              </h1>
              <p className="mb-0">
                Join a vetted team of Kenyan tutors and teach from wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section-sm" style={{ paddingTop: 34 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-3">
            <Link href="/">Home</Link>
            <span className="nt-divider-dot">/</span>
            <span>Become a tutor</span>
          </nav>

          <div className="row mb-4">
            <div className="col-lg-4 mb-4">
              <div className="nt-card nt-card-pad h-100">
                <span className="nt-eyebrow">Why tutors stay</span>
                <h2 style={{ fontSize: 24, fontWeight: 900 }}>
                  Built for serious teaching, not content farming
                </h2>
                <p className="nt-small nt-muted">
                  Nathan Tutors is a small Kenyan team. Every tutor is interviewed, every
                  lesson is one-on-one, and every parent can read a progress note after
                  each session.
                </p>

                <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                  <span className="nt-badge nt-badge-primary">
                    {formatKes(800)} to {formatKes(2200)} per hour
                  </span>
                  <span className="nt-badge">Weekly payouts</span>
                  <span className="nt-badge">Remote friendly</span>
                </div>

                <ul className="nt-tick-list mt-3 mb-3">
                  {BENEFITS.map((item) => (
                    <li key={item.title}>
                      <Check size={14} aria-hidden="true" />
                      <span>
                        <strong>{item.title}.</strong> {item.body}
                      </span>
                    </li>
                  ))}
                </ul>

                <a href="#apply" className="btn btn-primary btn-block">
                  Start your application
                </a>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="row">
                {STEPS.map((step, index) => (
                  <div className="col-md-6 mb-4" key={step.title}>
                    <div className="nt-card nt-card-pad h-100">
                      <span className="nt-step-number">{String(index + 1).padStart(2, "0")}</span>
                      <h3 style={{ fontSize: 17, fontWeight: 700 }} className="mt-2 mb-1">
                        {step.title}
                      </h3>
                      <p className="nt-small nt-muted mb-0">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="nt-card nt-card-pad">
                <div className="row text-center">
                  {STATS.slice(0, 3).map((stat) => (
                    <div className="col-4" key={stat.label}>
                      <div className="nt-stat-value" style={{ fontSize: 26 }}>
                        {stat.value}
                      </div>
                      <div className="nt-small nt-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="apply" className="row">
            <div className="col-lg-8">
              <span className="nt-eyebrow">Application form</span>
              <h2 style={{ fontSize: 28, fontWeight: 900 }} className="mb-3">
                Tell us about your teaching
              </h2>
              <TutorApplicationForm />
            </div>
            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="nt-card nt-card-pad mb-4">
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>What we look for</h3>
                <ul className="nt-tick-list mb-0">
                  <li>
                    <Check size={14} aria-hidden="true" />
                    <span>A degree or diploma in your subject, or a teaching qualification.</span>
                  </li>
                  <li>
                    <Check size={14} aria-hidden="true" />
                    <span>At least two years of teaching, tutoring or TA experience.</span>
                  </li>
                  <li>
                    <Check size={14} aria-hidden="true" />
                    <span>A reliable laptop, webcam and connection for video lessons.</span>
                  </li>
                  <li>
                    <Check size={14} aria-hidden="true" />
                    <span>Clear written and spoken English, and Kiswahili if teaching primary.</span>
                  </li>
                </ul>
              </div>

              <div className="nt-note">
                <strong style={{ display: "block", marginBottom: 4 }}>Need to ask first?</strong>
                WhatsApp us on +254 112 272 061 and ask for the tutor team. We answer
                between 8am and 7pm East Africa Time.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
