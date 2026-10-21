"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  EDUCATION_LABELS,
  EDUCATION_ORDER,
  SUBJECTS,
  STUDENT_LEVEL_LABELS,
  WEEKDAYS,
  formatKes,
} from "@/lib/data";
import type { EducationLevel, StudentLevel, Tutor, Weekday } from "@/lib/types";
import { TutorCard } from "./TutorCard";

export interface DirectoryFilters {
  subject: string;
  education: string;
  level: string;
  minRate: number;
  maxRate: number;
  availability: string;
  language: string;
  query: string;
  sort: string;
}

export const DEFAULT_FILTERS: DirectoryFilters = {
  subject: "",
  education: "",
  level: "",
  minRate: 500,
  maxRate: 2500,
  availability: "",
  language: "",
  query: "",
  sort: "rating",
};

function toFilters(initial?: Partial<DirectoryFilters>): DirectoryFilters {
  return {
    ...DEFAULT_FILTERS,
    ...initial,
    minRate: Number(initial?.minRate ?? DEFAULT_FILTERS.minRate),
    maxRate: Number(initial?.maxRate ?? DEFAULT_FILTERS.maxRate),
  };
}

export function TutorDirectory({
  tutors,
  initial,
}: {
  tutors: Tutor[];
  initial?: Partial<DirectoryFilters>;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<DirectoryFilters>(toFilters(initial));
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setFilters(toFilters(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const update = (patch: Partial<DirectoryFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };
      if (next.minRate > next.maxRate) {
        if ("minRate" in patch) next.maxRate = next.minRate;
        else next.minRate = next.maxRate;
      }
      const params = new URLSearchParams();
      if (next.subject) params.set("subject", next.subject);
      if (next.level) params.set("level", next.level);
      if (next.education) params.set("education", next.education);
      if (next.language) params.set("language", next.language);
      if (next.availability) params.set("availability", next.availability);
      if (next.minRate !== DEFAULT_FILTERS.minRate) params.set("minRate", String(next.minRate));
      if (next.maxRate !== DEFAULT_FILTERS.maxRate) params.set("maxRate", String(next.maxRate));
      if (next.query) params.set("q", next.query);
      if (next.sort !== DEFAULT_FILTERS.sort) params.set("sort", next.sort);
      router.replace(`/tutors${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
      return next;
    });
  };

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const list = tutors.filter((tutor) => {
      if (filters.subject && !tutor.subjects.includes(filters.subject)) return false;
      if (filters.education && tutor.educationLevel !== filters.education) return false;
      if (filters.level && !tutor.levels.includes(filters.level as StudentLevel)) return false;
      if (tutor.rate < filters.minRate || tutor.rate > filters.maxRate) return false;
      if (filters.availability) {
        const slots = tutor.availability[filters.availability as Weekday];
        if (!slots || slots.length === 0) return false;
      }
      if (filters.language && !tutor.languages.includes(filters.language as "English" | "Kiswahili")) {
        return false;
      }
      if (query) {
        const haystack = `${tutor.fullName} ${tutor.subjects.join(" ")} ${tutor.headline}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (filters.sort === "price-low") return a.rate - b.rate;
      if (filters.sort === "price-high") return b.rate - a.rate;
      if (filters.sort === "sessions") return b.sessionsCompleted - a.sessionsCompleted;
      return b.rating - a.rating;
    });
  }, [filters, tutors]);

  const activeCount = [
    filters.subject,
    filters.education,
    filters.level,
    filters.availability,
    filters.language,
    filters.query,
    filters.minRate !== DEFAULT_FILTERS.minRate ? "min" : "",
    filters.maxRate !== DEFAULT_FILTERS.maxRate ? "max" : "",
  ].filter(Boolean).length;

  return (
    <div className="row">
      <div className="col-lg-3 mb-4">
        <button
          type="button"
          className="btn btn-outline-dark btn-block d-lg-none mb-3 d-inline-flex align-items-center justify-content-center"
          onClick={() => setShowFilters((value) => !value)}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal size={16} aria-hidden="true" style={{ marginRight: 8 }} />
          {showFilters ? "Hide filters" : "Show filters"}
        </button>

        <div className={`nt-filter-bar ${showFilters ? "" : "d-none d-lg-block"}`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="nt-mono-label">Filters</span>
            {activeCount > 0 ? (
              <button
                type="button"
                className="nt-clear"
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  router.replace("/tutors", { scroll: false });
                }}
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="filter-query">Search</label>
            <div style={{ position: "relative" }}>
              <Search
                size={15}
                aria-hidden="true"
                style={{ position: "absolute", left: 12, top: 17, color: "#939393" }}
              />
              <input
                id="filter-query"
                type="search"
                className="form-control"
                placeholder="Name or subject"
                style={{ paddingLeft: 34 }}
                value={filters.query}
                onChange={(event) => update({ query: event.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="filter-subject">Subject</label>
            <select
              id="filter-subject"
              className="form-control"
              value={filters.subject}
              onChange={(event) => update({ subject: event.target.value })}
            >
              <option value="">All subjects</option>
              {SUBJECTS.map((subject) => (
                <option key={subject.slug} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="filter-level">Student level</label>
            <select
              id="filter-level"
              className="form-control"
              value={filters.level}
              onChange={(event) => update({ level: event.target.value })}
            >
              <option value="">Any level</option>
              {Object.entries(STUDENT_LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="filter-education">Tutor education</label>
            <select
              id="filter-education"
              className="form-control"
              value={filters.education}
              onChange={(event) => update({ education: event.target.value })}
            >
              <option value="">Any qualification</option>
              {EDUCATION_ORDER.map((level) => (
                <option key={level} value={level}>
                  {EDUCATION_LABELS[level as EducationLevel]}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="filter-language">Language</label>
            <select
              id="filter-language"
              className="form-control"
              value={filters.language}
              onChange={(event) => update({ language: event.target.value })}
            >
              <option value="">Any language</option>
              <option value="English">English</option>
              <option value="Kiswahili">Kiswahili</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="filter-day">Available on</label>
            <select
              id="filter-day"
              className="form-control"
              value={filters.availability}
              onChange={(event) => update({ availability: event.target.value })}
            >
              <option value="">Any day</option>
              {WEEKDAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label htmlFor="filter-min">Price range per hour</label>
            <div className="nt-range-wrap">
              <input
                id="filter-min"
                type="range"
                min={500}
                max={2500}
                step={50}
                value={filters.minRate}
                onChange={(event) => update({ minRate: Number(event.target.value) })}
                aria-label="Minimum rate"
              />
            </div>
            <div className="nt-range-wrap">
              <input
                id="filter-max"
                type="range"
                min={500}
                max={2500}
                step={50}
                value={filters.maxRate}
                onChange={(event) => update({ maxRate: Number(event.target.value) })}
                aria-label="Maximum rate"
              />
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span className="nt-range-value">{formatKes(filters.minRate)}</span>
              <span className="nt-range-value">{formatKes(filters.maxRate)}</span>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="filter-sort">Sort by</label>
            <select
              id="filter-sort"
              className="form-control"
              value={filters.sort}
              onChange={(event) => update({ sort: event.target.value })}
            >
              <option value="rating">Highest rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="sessions">Most sessions</option>
            </select>
          </div>
        </div>
      </div>

      <div className="col-lg-9">
        <div className="nt-filter-meta">
          <p className="mb-0 nt-muted">
            <strong style={{ color: "#000" }}>{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "tutor" : "tutors"} match your filters
          </p>
          <span className="nt-small nt-muted">All tutors are verified before their first booking</span>
        </div>

        {filtered.length === 0 ? (
          <div className="nt-empty">
            <h3>No tutors match those filters yet</h3>
            <p>
              Try widening your price range or choosing a different day. You can also
              message us and we will find a tutor for you.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setFilters(DEFAULT_FILTERS);
                router.replace("/tutors", { scroll: false });
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="row">
            {filtered.map((tutor) => (
              <div className="col-md-6 col-xl-4 mb-4" key={tutor.username}>
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
