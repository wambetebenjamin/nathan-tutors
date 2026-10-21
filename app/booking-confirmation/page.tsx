import type { Metadata } from "next";
import { cookies } from "next/headers";
import { BookingConfirmationView } from "@/components/BookingConfirmationView";
import { DEMO_BOOKINGS } from "@/lib/data";
import { getSession } from "@/lib/session";
import { storeGet } from "@/lib/store";
import type { BookingRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your Nathan Tutors session is confirmed. Download the summary or add the lesson to your calendar.",
  robots: { index: false, follow: false },
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const reference = first(params.ref).toUpperCase() || "NT-PENDING";

  const cookieStore = await cookies();
  const guestReference = cookieStore.get("nt_last_booking")?.value;
  const session = await getSession();

  let booking: BookingRecord | null = null;

  if (reference !== "NT-PENDING") {
    const stored = await storeGet<BookingRecord>(`nt:booking:${reference}`);
    const demo = DEMO_BOOKINGS.find((item) => item.reference === reference) ?? null;
    const candidate = stored ?? demo;

    if (candidate) {
      const isGuestReference = guestReference?.toUpperCase() === reference;
      const isOwner =
        session &&
        (candidate.contactEmail.toLowerCase() === session.email.toLowerCase() ||
          candidate.tutorUsername === session.email.split("@")[0] ||
          session.role === "tutor");
      booking = isGuestReference || isOwner ? candidate : null;
    }
  }

  return <BookingConfirmationView reference={reference} initial={booking} />;
}
