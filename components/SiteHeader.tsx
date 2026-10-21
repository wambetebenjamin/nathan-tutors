"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/tutors", label: "Find a Tutor" },
  { href: "/become-a-tutor", label: "Become a Tutor" },
  { href: "/my-sessions", label: "My Sessions" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="nt-header site-navbar-target" role="banner">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="site-logo">
            <Link href="/" aria-label="Nathan Tutors home">
              <strong>
                Nathan<span className="nt-logo-dot">.</span>Tutors
              </strong>
            </Link>
          </div>

          <nav className="d-none d-lg-block" aria-label="Main navigation">
            <ul className="site-menu list-unstyled mb-0">
              {LINKS.map((link) => (
                <li key={link.href} className={isActive(link.href) ? "active" : ""}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/auth/signin" className="nt-link-quiet">
                  Sign in
                </Link>
              </li>
            </ul>
          </nav>

          <div className="nt-header-actions">
            <Link href="/tutors" className="btn btn-primary d-none d-sm-inline-block">
              Book a tutor
            </Link>
            <button
              type="button"
              className="nt-nav-toggle d-lg-none"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={26} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="nt-mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="nt-menu-head">
            <span className="site-logo">
              <strong>
                Nathan<span className="nt-logo-dot">.</span>Tutors
              </strong>
            </span>
            <button
              type="button"
              className="nt-nav-toggle"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={26} aria-hidden="true" />
            </button>
          </div>
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/booking">Book a session</Link>
            </li>
            <li>
              <Link href="/auth/signin">Sign in</Link>
            </li>
            <li>
              <Link href="/auth/signup">Create an account</Link>
            </li>
          </ul>
          <Link href="/tutors" className="btn btn-primary btn-block mt-4">
            Find a tutor
          </Link>
        </div>
      ) : null}
    </header>
  );
}
