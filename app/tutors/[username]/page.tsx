import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Clock,
  GraduationCap,
  Languages,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { StarRating } from "@/components/StarRating";
import { buildWeek } from "@/lib/availability";
import {
  EDUCATION_LABELS,
  STUDENT_LEVEL_LABELS,
  TUTORS,
  formatKes,
  getTutor,
  whatsappHref,
} from "@/lib/data";

export function generateStaticParams() {
  return TUTORS.map((tutor) => ({ username: tutor.username }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const tutor = getTutor(username);
  if (!tutor) return { title: "Tutor not found" };
  return {
    title: `${tutor.fullName}, ${tutor.subjects[0]} tutor`,
    description: `Book ${tutor.fullName} for one-on-one online ${tutor.subjects.join(", ")} lessons. ${EDUCATION_LABELS[tutor.educationLevel]} qualified, rated ${tutor.rating} out of 5.`,
    alternates: { canonical: `/tutors/${tutor.username}` },
  };
}

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const tutor = getTutor(username);
  if (!tutor) notFound();

  const week = buildWeek(tutor);
  const openSlots = week.days.reduce(
    (total, day) => total + day.slots.filter((slot) => slot.available).length,
    0,
  );

  return (
    <>
      <section className="site-section-sm bg-light" style={{ paddingTop: 28 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-3">
            <Link href="/">Home</Link>
            <span className="nt-divider-dot">/</span>
            <Link href="/tutors">Tutors</Link>
            <span className="nt-divider-dot">/</span>
            <span>{tutor.fullName}</span>
          </nav>

          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="position-relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tutor.photo}
                  alt={`${tutor.fullName}, ${tutor.subjects[0]} tutor`}
                  className="nt-profile-photo"
                />
                {tutor.verified ? (
                  <span
                    className="nt-badge nt-badge-black"
                    style={{ position: "absolute", top: 14, left: 14 }}
                  >
                    <BadgeCheck size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                    Verified tutor
                  </span>
                ) : null}
              </div>

              <div className="nt-card nt-card-pad mt-3">
                <div className="d-flex justify-content-between align-items-baseline mb-3">
                  <div>
                    <div className="nt-rate">
                      {formatKes(tutor.rate)}
                      <small>per hour</small>
                    </div>
                  </div>
                  <StarRating rating={tutor.rating} count={tutor.reviewCount} />
                </div>

                <ul className="nt-fact-list mb-3">
                  <li>
                    <span>Qualification</span>
                    <span>{EDUCATION_LABELS[tutor.educationLevel]}</span>
                  </li>
                  <li>
                    <span>Experience</span>
                    <span>{tutor.yearsExperience} years</span>
                  </li>
                  <li>
                    <span>Sessions completed</span>
                    <span>{tutor.sessionsCompleted.toLocaleString("en-KE")}</span>
                  </li>
                  <li>
                    <span>Levels</span>
                    <span>{tutor.levels.map((level) => STUDENT_LEVEL_LABELS[level]).join(", ")}</span>
                  </li>
                  <li>
                    <span>Languages</span>
                    <span>{tutor.languages.join(", ")}</span>
                  </li>
                  <li>
                    <span>Open slots this week</span>
                    <span>{openSlots}</span>
                  </li>
                </ul>

                <Link
                  href={`/booking?tutor=${tutor.username}`}
                  className="btn btn-primary btn-block mb-2"
                  style={{ padding: "14px 18px" }}
                >
                  Book a Session
                </Link>
                <Link
                  href={`/booking?tutor=${tutor.username}&type=intro`}
                  className="btn btn-outline-dark btn-block"
                  style={{ padding: "14px 18px" }}
                >
                  Free 15 minute intro
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nt-link-quiet d-inline-flex align-items-center mt-3"
                  style={{ gap: 6 }}
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  Ask about this tutor on WhatsApp
                </a>
              </div>
            </div>

            <div className="col-lg-8 pl-lg-5">
              <span className="nt-eyebrow">{tutor.subjects[0]}</span>
              <h1 className="nt-profile-name">{tutor.fullName}</h1>
              <p className="nt-muted" style={{ fontSize: 17, maxWidth: 640 }}>
                {tutor.headline}
              </p>

              <div className="d-flex flex-wrap align-items-center mb-4" style={{ gap: 16 }}>
                <StarRating rating={tutor.rating} count={tutor.reviewCount} size={16} />
                <span className="nt-small nt-muted d-inline-flex align-items-center" style={{ gap: 6 }}>
                  <Users size={14} aria-hidden="true" />
                  {tutor.sessionsCompleted.toLocaleString("en-KE")} sessions completed
                </span>
                <span className="nt-small nt-muted d-inline-flex align-items-center" style={{ gap: 6 }}>
                  <Languages size={14} aria-hidden="true" />
                  {tutor.languages.join(", ")}
                </span>
              </div>

              <div className="mb-4">
                <h2 style={{ fontSize: 20, fontWeight: 700 }} className="mb-2">
                  Subjects taught
                </h2>
                <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                  {tutor.subjects.map((subject) => (
                    <span className="nt-badge nt-badge-primary" key={subject}>
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h2 style={{ fontSize: 20, fontWeight: 700 }} className="mb-2">
                  Teaching style
                </h2>
                <p className="mb-0" style={{ color: "#4d4d4d" }}>
                  {tutor.teachingStyle}
                </p>
              </div>

              <div className="mb-4">
                <h2 style={{ fontSize: 20, fontWeight: 700 }} className="mb-2">
                  Education and credentials
                </h2>
                <ul className="list-unstyled mb-0">
                  {tutor.credentials.map((credential) => (
                    <li
                      key={`${credential.qualification}-${credential.year}`}
                      className="d-flex mb-3"
                      style={{ gap: 12 }}
                    >
                      <GraduationCap
                        size={20}
                        aria-hidden="true"
                        style={{ color: "#0779e4", flex: "0 0 20px", marginTop: 3 }}
                      />
                      <div>
                        <strong style={{ display: "block", fontSize: 15, color: "#000" }}>
                          {credential.qualification}
                        </strong>
                        <span className="nt-small nt-muted">
                          {credential.institution}, {credential.year}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h2 style={{ fontSize: 20, fontWeight: 700 }} className="mb-2">
                  Bundle pricing
                </h2>
                <p className="nt-small nt-muted mb-3">
                  Pay per session, or save with a bundle. Bundles are valid for 90 days
                  and can be shared between siblings on the same subject.
                </p>
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="nt-bundle">
                      <div>
                        <h4>Single session</h4>
                        <p className="nt-small nt-muted mb-3">Pay as you learn</p>
                      </div>
                      <div>
                        <div className="nt-bundle-price">
                          {formatKes(tutor.rate)}
                          <small> / session</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  {tutor.bundles.map((bundle) => (
                    <div className="col-md-4 mb-3 mb-md-0" key={bundle.size}>
                      <div className="nt-bundle">
                        <div>
                          <h4>{bundle.size} session bundle</h4>
                          <p className="nt-small nt-muted mb-3">
                            Save {formatKes(bundle.saving)}
                          </p>
                        </div>
                        <div>
                          <div className="nt-bundle-price">
                            {formatKes(bundle.price)}
                          </div>
                          <span className="nt-small nt-muted">
                            {formatKes(bundle.perSession)} per session
                          </span>
                          <Link
                            href={`/booking?tutor=${tutor.username}&bundle=${bundle.size}`}
                            className="btn btn-outline-dark btn-block mt-3"
                            style={{ fontSize: 11, letterSpacing: "0.08rem", textTransform: "uppercase", padding: "10px 12px" }}
                          >
                            Choose bundle
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="nt-card nt-card-pad mt-5">
                <AvailabilityCalendar
                  username={tutor.username}
                  tutorName={tutor.fullName}
                  rate={tutor.rate}
                  initial={week}
                />
              </div>

              <div className="mt-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: 10 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 0 }}>
                    Student reviews
                  </h2>
                  <span className="nt-small nt-muted d-inline-flex align-items-center" style={{ gap: 6 }}>
                    <Star size={14} aria-hidden="true" style={{ color: "#ffc107" }} />
                    {tutor.rating.toFixed(1)} average from {tutor.reviewCount} reviews
                  </span>
                </div>

                {tutor.reviews.map((review) => (
                  <div className="nt-card nt-card-pad mb-3" key={review.id} style={{ boxShadow: "none", border: "1px solid #e9ecef" }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-2" style={{ gap: 8 }}>
                      <strong style={{ fontSize: 15 }}>{review.author}</strong>
                      <StarRating rating={review.rating} showValue={false} />
                    </div>
                    <p className="nt-small nt-muted mb-2">
                      {STUDENT_LEVEL_LABELS[review.level]} student
                      <span className="nt-divider-dot">|</span>
                      <Clock size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                      {new Date(`${review.date}T00:00:00.000Z`).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </p>
                    <p className="mb-0" style={{ color: "#4d4d4d", fontSize: 14 }}>
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              <div className="nt-card nt-card-pad mt-4 bg-primary" style={{ color: "#fff" }}>
                <div className="d-flex flex-wrap align-items-center justify-content-between" style={{ gap: 14 }}>
                  <div>
                    <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }} className="mb-1">
                      Ready to start with {tutor.fullName.split(" ")[0]}?
                    </h2>
                    <p className="mb-0" style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                      Book a free 15 minute intro, or go straight to a paid session.
                    </p>
                  </div>
                  <Link
                    href={`/booking?tutor=${tutor.username}`}
                    className="btn btn-white"
                    style={{ background: "#fff", color: "#0779e4", padding: "13px 22px", fontWeight: 700 }}
                  >
                    Book a Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
