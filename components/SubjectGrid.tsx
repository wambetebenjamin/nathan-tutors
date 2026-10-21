"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SubjectCategory } from "@/lib/types";
import { SubjectIcon } from "./SubjectIcon";

export function SubjectGrid({ subjects }: { subjects: SubjectCategory[] }) {
  return (
    <div className="row align-items-stretch nt-subject-grid">
      {subjects.map((subject, index) => (
        <motion.div
          className="col-6 col-lg-3 col-xl-2 mb-3"
          key={subject.slug}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
        >
          <Link href={`/tutors?subject=${encodeURIComponent(subject.name)}`} className="course">
            <span className="wrap-icon">
              <SubjectIcon name={subject.icon} />
            </span>
            <h3>{subject.name}</h3>
            <p className="nt-count">
              {subject.tutors} {subject.tutors === 1 ? "tutor" : "tutors"} available
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
