"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

function formatValue(value: number, decimals: number): string {
  return value.toLocaleString("en-KE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current) return;
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>("[data-stat-value]");
      nodes.forEach((node) => {
        const target = Number(node.dataset.value ?? "0");
        const decimals = Number(node.dataset.decimals ?? "0");
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            node.textContent = formatValue(counter.value, decimals);
          },
          onComplete: () => {
            node.textContent = formatValue(target, decimals);
          },
        });
      });
    }, scope);

    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="nt-stats" ref={scope} aria-label="Nathan Tutors in numbers">
      <div className="container">
        <div className="row">
          {stats.map((stat) => {
            const decimals = Number.isInteger(stat.value) ? 0 : 1;
            return (
              <div className="col-6 col-lg-3" key={stat.label}>
                <div className="nt-stat">
                  <div className="nt-stat-value">
                    <span
                      data-stat-value
                      data-value={stat.value}
                      data-decimals={decimals}
                    >
                      {formatValue(stat.value, decimals)}
                    </span>
                    {stat.suffix}
                  </div>
                  <p className="nt-stat-label">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
