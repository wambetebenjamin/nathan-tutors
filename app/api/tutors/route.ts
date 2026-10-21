import { NextResponse } from "next/server";
import { TUTORS } from "@/lib/data";
import type { Tutor } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const subject = searchParams.get("subject");
  const level = searchParams.get("level");
  const language = searchParams.get("language");
  const availability = searchParams.get("availability");
  const minPrice = Number(searchParams.get("minPrice") ?? searchParams.get("minRate") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? searchParams.get("maxRate") ?? 100000);
  const minRating = Number(searchParams.get("rating") ?? searchParams.get("minRating") ?? 0);
  const education = searchParams.get("education");
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const filtered = TUTORS.filter((tutor: Tutor) => {
    if (subject && !tutor.subjects.some((item) => item.toLowerCase() === subject.toLowerCase())) {
      return false;
    }
    if (level && !tutor.levels.includes(level as Tutor["levels"][number])) return false;
    if (language && !tutor.languages.some((item) => item.toLowerCase() === language.toLowerCase())) {
      return false;
    }
    if (availability && !(tutor.availability[availability as keyof Tutor["availability"]] ?? []).length) {
      return false;
    }
    if (education && tutor.educationLevel !== education) return false;
    if (tutor.rate < minPrice || tutor.rate > maxPrice) return false;
    if (tutor.rating < minRating) return false;
    if (query) {
      const haystack = `${tutor.fullName} ${tutor.subjects.join(" ")} ${tutor.headline}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return NextResponse.json(
    {
      count: filtered.length,
      filters: { subject, level, language, availability, minPrice, maxPrice, minRating, education, query },
      tutors: filtered,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
