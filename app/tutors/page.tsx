import type { Metadata } from "next";
import Link from "next/link";
import { TUTORS, subjectCounts } from "@/lib/data";
import { TutorDirectory, type DirectoryFilters } from "@/components/TutorDirectory";

export const metadata: Metadata = {
  title: "Find a Tutor",
  description:
    "Browse verified Kenyan tutors by subject, level, price, availability and language. Book a free 15 minute intro session with any tutor.",
  alternates: { canonical: "/tutors" },
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const counts = subjectCounts(TUTORS);

  const initial: Partial<DirectoryFilters> = {
    subject: first(params.subject),
    level: first(params.level),
    education: first(params.education),
    language: first(params.language),
    availability: first(params.availability),
    query: first(params.q),
    sort: first(params.sort) || "rating",
    minRate: Number(first(params.minRate)) || 500,
    maxRate: Number(first(params.maxRate)) || 2500,
  };

  return (
    <>
      <section className="site-section-cover overlay inner-page" style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-9 text-center">
              <h1>
                Find <strong>the right tutor</strong>
              </h1>
              <p className="mb-0">
                Verified Kenyan tutors for primary, secondary and university students.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section-sm" style={{ paddingTop: 34 }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-2">
                <Link href="/">Home</Link>
                <span className="nt-divider-dot">/</span>
                <span>Tutors</span>
              </nav>
              <div className="heading nt-heading">
                <span className="caption">{TUTORS.length} verified tutors</span>
                <h2>Tutor directory</h2>
              </div>
            </div>
          </div>

          <TutorDirectory tutors={TUTORS} initial={initial} />

          <div className="row mt-5">
            <div className="col-lg-10 mx-auto">
              <div className="nt-card nt-card-pad">
                <h2 style={{ fontSize: 20, fontWeight: 700 }} className="mb-3">
                  Browse by subject
                </h2>
                <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                  {counts.map((subject) => (
                    <Link
                      key={subject.slug}
                      href={`/tutors?subject=${encodeURIComponent(subject.name)}`}
                      className="nt-badge"
                      style={{ textDecoration: "none" }}
                    >
                      {subject.name} ({subject.tutors})
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
