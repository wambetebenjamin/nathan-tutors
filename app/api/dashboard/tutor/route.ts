import { NextResponse } from "next/server";
import { DEMO_BOOKINGS, DEMO_PROGRESS_NOTES, TUTORS } from "@/lib/data";
import { requireRole } from "@/lib/session";
import { storeGet } from "@/lib/store";
import type { BookingRecord, ProgressNote } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireRole(["tutor"]);
  if (!session) {
    return NextResponse.json(
      { error: "Tutor sign in required", requiresAuth: true },
      { status: 401 },
    );
  }

  const tutor =
    TUTORS.find(
      (item) => `${item.username.replace("-", ".")}@nathan-tutors.co.ke` === session.email,
    ) ?? TUTORS.find((item) => item.fullName === session.name);

  if (!tutor) {
    return NextResponse.json({ error: "No tutor profile linked to this account" }, { status: 404 });
  }

  const stored = (await storeGet<BookingRecord[]>(`nt:bookings:${session.email}`)) ?? [];
  const bookings = [...stored, ...DEMO_BOOKINGS.filter((booking) => booking.tutorUsername === tutor.username)];

  const now = new Date();
  const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  const paid = bookings.filter((booking) => booking.paymentStatus === "paid");
  const earningsAllTime = paid.reduce((total, booking) => total + booking.amount, 0) + tutor.sessionsCompleted * tutor.rate;
  const earningsThisMonth =
    paid
      .filter((booking) => booking.date.startsWith(monthKey))
      .reduce((total, booking) => total + booking.amount, 0) + tutor.rate * 12;

  const upcoming = bookings
    .filter((booking) => new Date(`${booking.date}T00:00:00.000Z`) >= new Date(now.toISOString().slice(0, 10)))
    .sort((a, b) => a.date.localeCompare(b.date));

  const notes = (await storeGet<ProgressNote[]>(`nt:notes:tutor:${tutor.username}`)) ?? [];

  return NextResponse.json({
    tutor: {
      username: tutor.username,
      fullName: tutor.fullName,
      photo: tutor.photo,
      rate: tutor.rate,
      rating: tutor.rating,
    },
    earnings: {
      thisMonth: earningsThisMonth,
      allTime: earningsAllTime,
      currency: "KES",
      payoutSchedule: "Weekly, every Friday to M-Pesa",
    },
    sessionsCompleted: tutor.sessionsCompleted,
    upcoming,
    notes: [...notes, ...DEMO_PROGRESS_NOTES.filter((note) => note.tutorUsername === tutor.username)],
    availability: tutor.availability,
  });
}
