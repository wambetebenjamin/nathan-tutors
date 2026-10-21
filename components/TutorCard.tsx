"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, GraduationCap, MapPin } from "lucide-react";
import { EDUCATION_LABELS, formatKes } from "@/lib/data";
import type { Tutor } from "@/lib/types";
import { StarRating } from "./StarRating";

export function TutorCard({ tutor, compact = false }: { tutor: Tutor; compact?: boolean }) {
  const subjects = tutor.subjects.slice(0, 2).join(", ");

  return (
    <motion.article
      className="nt-tutor-card h-100"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Link
        href={`/tutors/${tutor.username}`}
        className="nt-tutor-photo"
        aria-label={`View ${tutor.fullName} profile`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tutor.photo} alt={`${tutor.fullName}, ${subjects} tutor`} loading="lazy" />
        {tutor.verified ? (
          <span className="nt-photo-badge nt-badge nt-badge-black">
            <BadgeCheck size={12} aria-hidden="true" style={{ marginRight: 4 }} />
            Verified
          </span>
        ) : null}
      </Link>

      <div className="nt-tutor-body">
        <h3 className="nt-tutor-name">
          <Link href={`/tutors/${tutor.username}`}>{tutor.fullName}</Link>
        </h3>
        <p className="nt-tutor-subject">{subjects}</p>

        <div className="nt-tutor-facts">
          <span>
            <GraduationCap size={14} aria-hidden="true" />
            {EDUCATION_LABELS[tutor.educationLevel]}
          </span>
          <span>
            <MapPin size={14} aria-hidden="true" />
            Nairobi, Kenya
          </span>
        </div>

        {!compact ? (
          <p className="nt-small nt-muted" style={{ marginBottom: 12 }}>
            {tutor.sessionsCompleted.toLocaleString("en-KE")} sessions completed
            <span className="nt-divider-dot">|</span>
            {tutor.languages.join(", ")}
          </p>
        ) : null}

        <StarRating rating={tutor.rating} count={tutor.reviewCount} />

        <div className="nt-tutor-foot">
          <div className="nt-rate">
            {formatKes(tutor.rate)}
            <small>per hour</small>
          </div>
          <Link
            href={`/booking?tutor=${tutor.username}&type=intro`}
            className="btn btn-primary"
            aria-label={`Book a free intro session with ${tutor.fullName}`}
          >
            Book Intro
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
