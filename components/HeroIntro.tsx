"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function HeroIntro() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".nt-hero-anim", {
        y: 26,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.13,
        delay: 0.35,
      });
    }, scope);

    return () => context.revert();
  }, []);

  return (
    <div ref={scope} className="col-lg-9 text-center">
      <span className="nt-hero-anim nt-hero-trust d-inline-block mb-3">
        Verified Kenyan tutors. Primary to university.
      </span>
      <h1 className="nt-hero-anim">
        The <strong>right tutor</strong>.
        <br />
        Real <strong>results</strong>.
      </h1>
      <p className="nt-hero-anim nt-hero-lede">
        Book one-on-one online sessions with verified Kenyan tutors, from KCPE
        and KCSE revision to university units. Start with a free 15 minute intro.
      </p>
      <div className="nt-hero-anim nt-hero-actions">
        <Link href="/tutors" className="btn btn-primary">
          Find a Tutor
        </Link>
        <Link href="/become-a-tutor" className="btn btn-ghost">
          Become a Tutor
        </Link>
      </div>
      <p className="nt-hero-anim nt-hero-trust mb-0">
        Free intro session <span className="nt-divider-dot">|</span> Pay with M-Pesa{" "}
        <span className="nt-divider-dot">|</span> Lessons by video call
      </p>
    </div>
  );
}
