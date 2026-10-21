"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { SUBJECTS, STUDENT_LEVEL_LABELS } from "@/lib/data";
import type { StudentLevel } from "@/lib/types";

export function TutorSearchBar() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState<StudentLevel | "">("");
  const [maxRate, setMaxRate] = useState("");

  return (
    <form
      className="d-flex flex-wrap align-items-end"
      style={{ gap: 12 }}
      onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (subject) params.set("subject", subject);
        if (level) params.set("level", level);
        if (maxRate) params.set("maxRate", maxRate);
        router.push(`/tutors${params.toString() ? `?${params.toString()}` : ""}`);
      }}
    >
      <div className="flex-grow-1" style={{ minWidth: 180 }}>
        <label htmlFor="home-subject">Subject</label>
        <select
          id="home-subject"
          className="form-control"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        >
          <option value="">All subjects</option>
          {SUBJECTS.map((item) => (
            <option key={item.slug} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow-1" style={{ minWidth: 160 }}>
        <label htmlFor="home-level">Student level</label>
        <select
          id="home-level"
          className="form-control"
          value={level}
          onChange={(event) => setLevel(event.target.value as StudentLevel | "")}
        >
          <option value="">Any level</option>
          {Object.entries(STUDENT_LEVEL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow-1" style={{ minWidth: 150 }}>
        <label htmlFor="home-rate">Budget per hour</label>
        <select
          id="home-rate"
          className="form-control"
          value={maxRate}
          onChange={(event) => setMaxRate(event.target.value)}
        >
          <option value="">Any rate</option>
          <option value="1000">Up to KES 1,000</option>
          <option value="1500">Up to KES 1,500</option>
          <option value="2000">Up to KES 2,000</option>
          <option value="3000">Up to KES 3,000</option>
        </select>
      </div>

      <div>
        <button type="submit" className="btn btn-primary d-inline-flex align-items-center" style={{ gap: 8, height: 48 }}>
          <Search size={16} aria-hidden="true" />
          <span className="text-uppercase" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1rem" }}>
            Search
          </span>
        </button>
      </div>
    </form>
  );
}
