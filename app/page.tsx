import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CalendarCheck, CreditCard, MessageCircle, Video } from "lucide-react";
import { HeroIntro } from "@/components/HeroIntro";
import { TutorSearchBar } from "@/components/TutorSearchBar";
import { SubjectGrid } from "@/components/SubjectGrid";
import { TutorCard } from "@/components/TutorCard";
import { StatStrip } from "@/components/StatStrip";
import { Testimonials } from "@/components/Testimonials";
import {
  FEATURED_TUTORS,
  HOW_IT_WORKS,
  SITE,
  STATS,
  TUTORS,
  whatsappHref,
  subjectCounts,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Nathan Tutors | The right tutor. Real results.",
  description:
    "Book one-on-one online tutoring with verified Kenyan tutors for primary, secondary and university students. Free 15 minute intro session, then pay per session or buy a bundle.",
  alternates: { canonical: "/" },
};

const STEP_ICONS = [CalendarCheck, BadgeCheck, Video, CreditCard];

export default function HomePage() {
  const subjects = subjectCounts(TUTORS);

  return (
    <>
      <section
        className="site-section-cover overlay nt-hero"
        style={{ backgroundImage: "url('/images/hero-online-tutoring.jpg')" }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <HeroIntro />
          </div>
        </div>
      </section>

      <div className="site-section bg-light pb-0">
        <div className="container">
          <div className="row align-items-stretch overlap">
            <div className="col-lg-12">
              <div className="box nt-card-pad">
                <div className="d-flex flex-wrap align-items-end justify-content-between mb-3" style={{ gap: 10 }}>
                  <div>
                    <span className="nt-eyebrow">Find your match</span>
                    <h2 className="mb-0" style={{ fontSize: 24, fontWeight: 700 }}>
                      Which subject do you need help with?
                    </h2>
                  </div>
                  <Link href="/tutors" className="btn-link-arrow d-inline-flex align-items-center" style={{ gap: 6 }}>
                    Browse all tutors <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <TutorSearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="site-section" aria-labelledby="subjects-title">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-8">
              <div className="heading nt-heading">
                <span className="caption">Subject categories</span>
                <h2 id="subjects-title">Choose a subject</h2>
                <p>
                  Ten subject areas, from Standard 1 reading to final year university
                  units. Every tutor is verified before they can accept a booking.
                </p>
              </div>
            </div>
          </div>
          <SubjectGrid subjects={subjects} />
        </div>
      </section>

      <section className="site-section bg-light" aria-labelledby="how-title">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="heading nt-heading">
                <span className="caption">How it works</span>
                <h2 id="how-title">Four steps to your first lesson</h2>
                <p>
                  No agents, no long phone calls. Choose a tutor, meet them for free,
                  then book the lessons that fit your timetable.
                </p>
              </div>
              <ul className="ul-check primary mt-4 mb-0">
                <li>Free 15 minute intro session with every tutor</li>
                <li>Pay per session with M-Pesa, or save with a bundle</li>
                <li>Progress notes after each lesson, shared with parents</li>
              </ul>
            </div>
            <div className="col-lg-5 ml-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/how-it-works-session.jpg"
                alt="Tutor explaining a mathematics topic to students"
                className="img-fluid rounded"
                style={{ boxShadow: "0 15px 30px 0 rgba(0,0,0,0.1)" }}
              />
            </div>
          </div>

          <div className="row">
            {HOW_IT_WORKS.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? CalendarCheck;
              return (
                <div className="col-md-6 col-lg-3 mb-4 mb-lg-0" key={step.title}>
                  <div className="nt-step">
                    <span className="nt-step-number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                      <Icon size={18} aria-hidden="true" style={{ color: "#0779e4", marginTop: 10 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="site-section" aria-labelledby="tutors-title">
        <div className="container">
          <div className="row align-items-end mb-4">
            <div className="col-lg-8">
              <div className="heading nt-heading">
                <span className="caption">Featured tutors</span>
                <h2 id="tutors-title">Meet a few of our tutors</h2>
                <p>
                  Degree qualified, background checked and rated by the students they
                  teach. Every profile shows real session history.
                </p>
              </div>
            </div>
            <div className="col-lg-4 text-lg-right mt-3 mt-lg-0">
              <Link href="/tutors" className="btn btn-outline-dark">
                View all {TUTORS.length} tutors
              </Link>
            </div>
          </div>

          <div className="row">
            {FEATURED_TUTORS.map((tutor) => (
              <div className="col-md-6 col-lg-3 mb-4" key={tutor.username}>
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatStrip stats={STATS} />

      <section className="site-section bg-primary py-5 cta" aria-labelledby="parents-title">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <span className="d-inline-block mb-2" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2rem", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
                For parents
              </span>
              <h2 id="parents-title" className="text-white mb-3">
                Booking for your child?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.85)", maxWidth: 620 }}>
                Create a parent account, add your child, and manage every lesson from
                one dashboard. You choose the tutor, approve the timetable and pay
                with M-Pesa. After each session your child&apos;s tutor writes a short
                progress note covering what was covered, what improved and what to
                practise next.
              </p>
              <ul className="ul-check white mb-0">
                <li>One account for all your children and subjects</li>
                <li>Progress notes after every session, saved in your dashboard</li>
                <li>Free intro session before you commit to a paid lesson</li>
              </ul>
            </div>
            <div className="col-lg-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/parent-child-session.jpg"
                alt="A parent helping a child with homework at a desk"
                className="img-fluid rounded mb-4"
                width={900}
                height={600}
                loading="lazy"
                style={{ boxShadow: "0 15px 30px 0 rgba(0,0,0,0.15)" }}
              />
              <div className="bg-white p-4 p-lg-5" style={{ borderRadius: 4 }}>
                <h3 className="mb-2" style={{ fontSize: 20, fontWeight: 700 }}>
                  Talk to a real person
                </h3>
                <p className="nt-muted mb-4" style={{ fontSize: 14 }}>
                  Not sure which level or subject to start with? Message us on
                  WhatsApp and we will suggest three tutors for your child.{" "}
                  {SITE.supportHours}.
                </p>
                <div className="d-flex flex-column" style={{ gap: 10 }}>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-block d-inline-flex align-items-center justify-content-center"
                    style={{ gap: 8 }}
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                  <Link href="/tutors" className="btn btn-outline-dark btn-block">
                    Browse tutors myself
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section bg-light" aria-labelledby="testimonials-title">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 text-center mb-5">
              <div className="heading nt-heading">
                <span className="caption">Testimonials</span>
                <h2 id="testimonials-title">What students and parents say</h2>
              </div>
            </div>
          </div>
          <Testimonials />
        </div>
      </section>

      <section className="site-section" aria-labelledby="closing-title">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="heading nt-heading mb-3">
                <span className="caption">Start today</span>
                <h2 id="closing-title">Better grades start with the right tutor</h2>
                <p>
                  Browse verified tutors, book a free intro session, and attend your
                  first lesson by video call from anywhere in Kenya.
                </p>
              </div>
            </div>
            <div className="col-lg-5 text-lg-right">
              <Link href="/tutors" className="btn btn-primary mr-2 mb-2" style={{ padding: "14px 28px" }}>
                Find a Tutor
              </Link>
              <Link href="/become-a-tutor" className="btn btn-outline-dark mb-2" style={{ padding: "14px 28px" }}>
                Become a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
