import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/session";
import { storeGet, storeSet } from "@/lib/store";
import { TUTORS, WEEKDAYS } from "@/lib/data";

export const dynamic = "force-dynamic";

const schema = z.object({
  availability: z.record(z.array(z.string().min(3).max(12))),
});

export async function GET() {
  const session = await requireRole(["tutor"]);
  if (!session) {
    return NextResponse.json({ error: "Tutor sign in required" }, { status: 401 });
  }

  const tutor = TUTORS.find(
    (item) => `${item.username.replace("-", ".")}@nathan-tutors.co.ke` === session.email,
  );

  const saved = await storeGet<Record<string, string[]>>(`nt:availability:${session.email}`);

  return NextResponse.json({
    availability: saved ?? tutor?.availability ?? {},
    weekdays: WEEKDAYS,
  });
}

export async function POST(request: Request) {
  const session = await requireRole(["tutor"]);
  if (!session) {
    return NextResponse.json({ error: "Tutor sign in required" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid availability payload" }, { status: 422 });
  }

  const clean: Record<string, string[]> = {};
  for (const day of WEEKDAYS) {
    const slots = parsed.data.availability[day] ?? [];
    clean[day] = Array.from(new Set(slots)).sort((a, b) => {
      const toMinutes = (value: string) => {
        const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!match) return 0;
        let hours = Number(match[1]);
        const minutes = Number(match[2]);
        const meridiem = match[3]?.toUpperCase();
        if (meridiem === "PM" && hours < 12) hours += 12;
        if (meridiem === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return toMinutes(a) - toMinutes(b);
    });
  }

  await storeSet(`nt:availability:${session.email}`, clean);

  return NextResponse.json({
    availability: clean,
    message: "Weekly availability saved. Students now see these slots.",
  });
}
