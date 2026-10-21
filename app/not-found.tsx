import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export const metadata = {
  title: "Page not found",
  description: "That page does not exist. Browse verified Kenyan tutors or head back home.",
};

const LINKS = [
  { href: "/tutors", label: "Browse all tutors" },
  { href: "/tutors?subject=mathematics", label: "Mathematics tutors" },
  { href: "/booking", label: "Book a session" },
  { href: "/become-a-tutor", label: "Become a tutor" },
];

export default function NotFound() {
  return (
    <section className="site-section">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-7">
            <div className="nt-code" aria-hidden="true">
              404
            </div>
            <span className="nt-eyebrow">Page not found</span>
            <h1 style={{ fontSize: 36, fontWeight: 900 }} className="mb-2">
              This lesson link has gone missing
            </h1>
            <p className="nt-muted mb-4">
              The page you asked for has moved or never existed. Try the tutor directory,
              or message us on WhatsApp and we will point you to the right place.
            </p>
            <div className="d-flex flex-wrap justify-content-center mb-4" style={{ gap: 10 }}>
              <Link href="/" className="btn btn-primary">
                Back to home
              </Link>
              <Link href="/tutors" className="btn btn-outline-dark">
                <Search size={15} aria-hidden="true" style={{ marginRight: 6 }} />
                Find a tutor
              </Link>
            </div>

            <div className="nt-card nt-card-pad text-left">
              <span className="nt-mono-label d-block mb-2">Popular pages</span>
              <ul className="nt-list mb-0">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="d-inline-flex align-items-center" style={{ gap: 6 }}>
                      <ArrowRight size={13} aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
