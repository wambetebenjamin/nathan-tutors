import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, verifyRecaptcha } from "@/lib/recaptcha";

export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().optional(),
  action: z.string().default("submit"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A token is required" }, { status: 422 });
  }

  const result = await verifyRecaptcha(
    parsed.data.token,
    parsed.data.action,
    clientIp(request.headers),
  );

  return NextResponse.json({
    success: result.success,
    score: result.score,
    requiresV2: result.requiresV2,
    mode: result.mode,
  });
}
