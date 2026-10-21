import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_BOOKINGS } from "@/lib/data";
import { getSession } from "@/lib/session";
import { storeGet } from "@/lib/store";
import type { BookingRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  const { ref } = await params;
  const cookieStore = await cookies();
  const guestReference = cookieStore.get("nt_last_booking")?.value;
  const session = await getSession();

  if (!session && guestReference?.toUpperCase() !== ref.toUpperCase()) {
    return NextResponse.json(
      { error: "Sign in to view this booking", requiresAuth: true },
      { status: 401 },
    );
  }

  const stored = await storeGet<BookingRecord>(`nt:booking:${ref.toUpperCase()}`);
  const demo = DEMO_BOOKINGS.find((booking) => booking.reference === ref.toUpperCase());
  const booking = stored ?? demo;

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (session) {
    const ownsBooking =
      booking.contactEmail.toLowerCase() === session.email.toLowerCase() ||
      booking.tutorUsername === session.email.split("@")[0] ||
      session.role === "tutor";

    if (!ownsBooking) {
      return NextResponse.json(
        { error: "This booking belongs to another account" },
        { status: 403 },
      );
    }
  }

  return NextResponse.json({ booking, viewer: session });
}
