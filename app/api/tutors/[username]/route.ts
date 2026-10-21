import { NextResponse } from "next/server";
import { getTutor } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const tutor = getTutor(username);
  if (!tutor) {
    return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  }
  return NextResponse.json({ tutor });
}
