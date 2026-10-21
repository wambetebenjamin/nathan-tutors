import { NextResponse } from "next/server";
import { z } from "zod";
import { getTutor } from "@/lib/data";
import { getSession } from "@/lib/session";
import { storeAppend } from "@/lib/store";

export const dynamic = "force-dynamic";

const schema = z.object({
  tutorUsername: z.string().min(1),
  bookingRef: z.string().min(3).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1200),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in to leave a review", requiresAuth: true },
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
      { error: "Please check the review", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const tutor = getTutor(parsed.data.tutorUsername);
  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }

  const review = {
    id: `rv-${Date.now()}`,
    tutorUsername: tutor.username,
    bookingRef: parsed.data.bookingRef ?? null,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    author: session.name,
    authorEmail: session.email,
    createdAt: new Date().toISOString(),
  };

  await storeAppend(`nt:reviews:${tutor.username}`, review);

  return NextResponse.json({ review, message: "Thank you, your review has been saved." }, { status: 201 });
}
