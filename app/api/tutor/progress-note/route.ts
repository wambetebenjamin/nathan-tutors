import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/session";
import { storeAppend } from "@/lib/store";
import type { ProgressNote } from "@/lib/types";

export const dynamic = "force-dynamic";

const schema = z.object({
  sessionId: z.string().min(1),
  studentName: z.string().min(2),
  note: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  const session = await requireRole(["tutor"]);
  if (!session) {
    return NextResponse.json(
      { error: "Tutor sign in required", requiresAuth: true },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please write a note of at least 10 characters", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const record: ProgressNote = {
    id: `pn-${Date.now()}`,
    sessionId: parsed.data.sessionId,
    studentName: parsed.data.studentName,
    tutorUsername: session.email.split("@")[0] ?? session.name,
    note: parsed.data.note,
    createdAt: new Date().toISOString(),
  };

  await storeAppend(`nt:notes:${parsed.data.studentName}`, record);
  await storeAppend(`nt:notes:tutor:${record.tutorUsername}`, record);

  return NextResponse.json(
    {
      note: record,
      message: "Progress note saved and shared with the student or parent.",
    },
    { status: 201 },
  );
}
