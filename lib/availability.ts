import { WEEKDAYS } from "./data";
import type { Tutor, Weekday } from "./types";

export interface DayAvailability {
  date: string;
  weekday: Weekday;
  slots: { time: string; available: boolean }[];
}

export interface WeekAvailability {
  weekStart: string;
  weekEnd: string;
  days: DayAvailability[];
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function weekStartFor(input?: string): Date {
  const base = input ? new Date(`${input}T00:00:00.000Z`) : new Date();
  const safe = Number.isNaN(base.getTime()) ? new Date() : base;
  const day = safe.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(safe);
  monday.setUTCDate(safe.getUTCDate() + offset);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 100000;
  }
  return h;
}

export function isSlotOpen(
  tutor: Tutor,
  date: string,
  weekday: Weekday,
  time: string,
): boolean {
  const slots = tutor.availability[weekday];
  if (!slots || !slots.includes(time)) return false;
  // A deterministic minority of slots are already booked so the calendar
  // behaves like a real one while staying stable across requests.
  return hash(`${tutor.username}:${date}:${time}`) % 7 !== 0;
}

export function buildWeek(tutor: Tutor, weekStart?: string): WeekAvailability {
  const start = weekStartFor(weekStart);
  const days: DayAvailability[] = WEEKDAYS.map((weekday, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const iso = toIsoDate(date);
    const slots = (tutor.availability[weekday] ?? []).map((time) => ({
      time,
      available: isSlotOpen(tutor, iso, weekday, time),
    }));
    return { date: iso, weekday, slots };
  });

  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return { weekStart: toIsoDate(start), weekEnd: toIsoDate(end), days };
}

export function findSlot(
  tutor: Tutor,
  date: string,
): { weekday: Weekday; slots: string[] } | null {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const index = parsed.getUTCDay();
  const weekday = WEEKDAYS[index === 0 ? 6 : index - 1];
  const slots = tutor.availability[weekday] ?? [];
  return { weekday, slots };
}

export function formatLongDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
