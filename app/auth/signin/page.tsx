import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel } from "@/components/AuthPanel";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Nathan Tutors to manage your lessons, payments and progress notes.",
  alternates: { canonical: "/auth/signin" },
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = first(params.next);
  const roleParam = first(params.role);
  const role = roleParam === "parent" || roleParam === "tutor" ? roleParam : "student";
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <>
      <section className="site-section-cover overlay inner-page" style={{ backgroundImage: "url('/images/hero_bg.jpg')" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-9 text-center">
              <h1>
                Welcome <strong>back</strong>
              </h1>
              <p className="mb-0">Sign in to manage your tutoring.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section-sm" style={{ paddingTop: 34 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" className="nt-small nt-muted mb-3">
            <Link href="/">Home</Link>
            <span className="nt-divider-dot">/</span>
            <span>Sign in</span>
          </nav>
          <AuthPanel mode="signin" googleEnabled={googleEnabled} initialRole={role} next={next || undefined} />
        </div>
      </section>
    </>
  );
}
