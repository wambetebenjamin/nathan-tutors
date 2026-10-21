"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { WeekAvailability } from "@/lib/availability";
import { formatKes } from "@/lib/data";

const DAY_LABEL = (date: string) =>
  new Date(`${date}T00:00:00.000Z`).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

export function AvailabilityCalendar({
  username,
  tutorName,
  rate,
  initial,
}: {
  username: string;
  tutorName: string;
  rate: number;
  initial: WeekAvailability;
}) {
  const [week, setWeek] = useState<WeekAvailability>(initial);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setWeek(initial);
  }, [initial]);

  const load = useCallback(
    async (weekStart: string) => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `/api/tutors/availability?username=${encodeURIComponent(username)}&week=${weekStart}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Could not load availability");
        const data = (await response.json()) as WeekAvailability;
        setWeek(data);
        setSelected(null);
      } catch {
        setError("We could not refresh that week. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [username],
  );

  const shift = (direction: -1 | 1) => {
    const start = new Date(`${week.weekStart}T00:00:00.000Z`);
    start.setUTCDate(start.getUTCDate() + direction * 7);
    void load(start.toISOString().slice(0, 10));
  };

  const today = new Date().toISOString().slice(0, 10);
  const isThisWeek = week.weekStart <= today && today <= week.weekEnd;

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3" style={{ gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Weekly availability</h3>
          <p className="nt-small nt-muted mb-0">
            <CalendarDays size={13} aria-hidden="true" style={{ marginRight: 5 }} />
            Week of {DAY_LABEL(week.weekStart)} to {DAY_LABEL(week.weekEnd)}
            {isThisWeek ? " (this week)" : ""}
          </p>
        </div>
        <div className="d-flex" style={{ gap: 6 }}>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => shift(-1)}
            disabled={loading || isThisWeek}
            aria-label="Previous week"
            style={{ padding: "8px 12px" }}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => shift(1)}
            disabled={loading}
            aria-label="Next week"
            style={{ padding: "8px 12px" }}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {error ? <p className="nt-error mb-3">{error}</p> : null}

      <div className="nt-week" aria-busy={loading}>
        {week.days.map((day) => (
          <div className="nt-week-day" key={day.date}>
            <h4>
              {day.weekday.slice(0, 3)}
              <br />
              <span style={{ fontWeight: 400, letterSpacing: 0 }}>{DAY_LABEL(day.date)}</span>
            </h4>
            <div className="nt-slots">
              {day.slots.length === 0 ? (
                <span className="nt-small nt-muted text-center" style={{ fontSize: 11 }}>
                  No slots
                </span>
              ) : (
                day.slots.map((slot) => {
                  const isSelected =
                    selected?.date === day.date && selected?.time === slot.time;
                  return (
                    <button
                      key={`${day.date}-${slot.time}`}
                      type="button"
                      className={`nt-slot${isSelected ? " is-selected" : ""}`}
                      disabled={!slot.available}
                      onClick={() => setSelected({ date: day.date, time: slot.time })}
                      aria-pressed={isSelected}
                      aria-label={`${day.weekday} ${day.date} at ${slot.time}${slot.available ? "" : ", already booked"}`}
                    >
                      {slot.time}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="nt-note mt-3 d-flex flex-wrap align-items-center justify-content-between" style={{ gap: 10 }}>
        <span>
          {selected
            ? `Selected: ${DAY_LABEL(selected.date)} at ${selected.time}. Free 15 minute intro sessions are also available in this slot.`
            : "Pick a slot to continue. Times are shown in East Africa Time."}
        </span>
        {selected ? (
          <Link
            href={`/booking?tutor=${username}&date=${selected.date}&time=${encodeURIComponent(selected.time)}`}
            className="btn btn-primary"
            style={{ padding: "10px 18px", whiteSpace: "nowrap" }}
          >
            Book with {tutorName.split(" ")[0]}
          </Link>
        ) : (
          <span className="nt-small nt-muted">From {formatKes(rate)} per hour</span>
        )}
      </div>
    </div>
  );
}
