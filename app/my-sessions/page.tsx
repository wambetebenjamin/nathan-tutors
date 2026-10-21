import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SessionsView } from "@/components/SessionsView";
import { DEMO_BOOKINGS, DEMO_PROGRESS_NOTES } from "@/lib/data";
import { getSession } from "@/lib/session";
import { storeGet } from "@/lib/store";
import type { BookingRecord, ProgressNote } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Sessions",
  description: "Your upcoming lessons, past sessions, receipts and tutor progress notes.",
  robots: { index: false, follow: false },
};

export default async function MySessionsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin?next=/my-sessions");
  }

  const stored =
    (await storeGet<BookingRecord[]>(`nt:bookings:${session.email.toLowerCase()}`)) ?? [];

  const demo = DEMO_BOOKINGS.filter(
    (booking) =>
      booking.contactEmail.toLowerCase() === session.email.toLowerCase() ||
      booking.studentName.toLowerCase() === session.name.toLowerCase(),
  );

  const seen = new Set<string>();
  const bookings = [...stored, ...demo].filter((booking) => {
    if (seen.has(booking.reference)) return false;
    seen.add(booking.reference);
    return true;
  });

  const studentNames = Array.from(new Set(bookings.map((booking) => booking.studentName)));

  const noteLists = await Promise.all(
    studentNames.map(
      async (name) => (await storeGet<ProgressNote[]>(`nt:notes:${name}`)) ?? [],
    ),
  );

  const demoNotes = DEMO_PROGRESS_NOTES.filter((note) =>
    studentNames.some((name) => name.toLowerCase() === note.studentName.toLowerCase()),
  );

  const seenNotes = new Set<string>();
  const notes = [...noteLists.flat(), ...demoNotes]
    .filter((note) => {
      if (seenNotes.has(note.id)) return false;
      seenNotes.add(note.id);
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <section className="site-section-sm" style={{ paddingTop: 40 }}>
      <div className="container">
        <SessionsView session={session} bookings={bookings} notes={notes} />
      </div>
    </section>
  );
}
