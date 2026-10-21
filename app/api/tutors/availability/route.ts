import { NextResponse } from "next/server";
import { buildWeek, weekStartFor, toIsoDate } from "@/lib/availability";
import { getTutor } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const week = searchParams.get("week") ?? undefined;

  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const tutor = getTutor(username);
  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }

  if (week && Number.isNaN(new Date(`${week}T00:00:00.000Z`).getTime())) {
    return NextResponse.json({ error: "week must be an ISO date" }, { status: 400 });
  }

  const availability = buildWeek(tutor, week);
  const openSlots = availability.days.reduce(
    (total, day) => total + day.slots.filter((slot) => slot.available).length,
    0,
  );

  return NextResponse.json({
    username: tutor.username,
    tutorName: tutor.fullName,
    rate: tutor.rate,
    weekStart: availability.weekStart,
    weekEnd: availability.weekEnd,
    currentWeekStart: toIsoDate(weekStartFor()),
    openSlots,
    days: availability.days,
  });
}
