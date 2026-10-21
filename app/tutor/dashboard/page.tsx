import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TutorDashboardView } from "@/components/TutorDashboardView";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Tutor Dashboard",
  description: "Manage your sessions, earnings, availability and progress notes.",
  robots: { index: false, follow: false },
};

export default async function TutorDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin?role=tutor&next=/tutor/dashboard");
  }

  if (session.role !== "tutor") {
    return (
      <section className="site-section-sm" style={{ paddingTop: 40 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-3">
            <Link href="/">Home</Link>
            <span className="nt-divider-dot">/</span>
            <span>Tutor dashboard</span>
          </nav>
          <div className="nt-card nt-card-pad text-center" style={{ maxWidth: 620, margin: "0 auto" }}>
            <h1 style={{ fontSize: 26, fontWeight: 900 }}>This dashboard is for tutors</h1>
            <p className="nt-muted">
              You are signed in as {session.email}. Apply to tutor with us and we will
              open your tutor workspace after the interview.
            </p>
            <Link href="/become-a-tutor" className="btn btn-primary mr-2 mb-2">
              Apply to tutor
            </Link>
            <Link href="/my-sessions" className="btn btn-outline-dark mb-2">
              My sessions
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="site-section-sm" style={{ paddingTop: 34 }}>
      <div className="container">
        <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-3">
          <Link href="/">Home</Link>
          <span className="nt-divider-dot">/</span>
          <span>Tutor dashboard</span>
        </nav>
        <TutorDashboardView />
      </div>
    </section>
  );
}
