import type { Metadata } from "next";
import Link from "next/link";
import { BookingFlow } from "@/components/BookingFlow";
import { TUTORS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book a free 15 minute intro session or a full one-on-one online lesson with a verified Kenyan tutor.",
  alternates: { canonical: "/booking" },
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tutor = first(params.tutor);
  const typeParam = first(params.type);
  const bundle = Number(first(params.bundle));

  const flowTutors = TUTORS.map((item) => ({
    username: item.username,
    fullName: item.fullName,
    photo: item.photo,
    subjects: item.subjects,
    levels: item.levels,
    rate: item.rate,
    rating: item.rating,
    reviewCount: item.reviewCount,
    bundles: item.bundles.map((b) => ({
      size: b.size,
      price: b.price,
      perSession: b.perSession,
    })),
  }));

  return (
    <>
      <section className="site-section-cover overlay inner-page" style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-9 text-center">
              <h1>
                Book a <strong>session</strong>
              </h1>
              <p className="mb-0">Six quick steps. Free intro available with every tutor.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section-sm" style={{ paddingTop: 34 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-3">
            <Link href="/">Home</Link>
            <span className="nt-divider-dot">/</span>
            <Link href="/tutors">Tutors</Link>
            <span className="nt-divider-dot">/</span>
            <span>Book a session</span>
          </nav>

          <BookingFlow
            tutors={flowTutors}
            initialTutor={tutor || undefined}
            initialType={
              typeParam === "intro" || typeParam === "bundle" || typeParam === "full"
                ? typeParam
                : bundle
                  ? "bundle"
                  : "intro"
            }
            initialDate={first(params.date) || undefined}
            initialTime={first(params.time) || undefined}
            initialBundle={Number.isFinite(bundle) && bundle > 0 ? bundle : undefined}
          />
        </div>
      </section>
    </>
  );
}
