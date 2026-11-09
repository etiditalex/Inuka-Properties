import { NextResponse } from "next/server";
import { cleanVisitorId, getPlayDay, gradeQuiz, markCleared } from "@/lib/play/daily";
import { limitIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limited = limitIp(request, "play-quiz", 40, 10 * 60 * 1000);
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const visitorId = cleanVisitorId(body?.visitorId);
  if (!visitorId) return NextResponse.json({ error: "A visitor id is required." }, { status: 400 });

  const day = await getPlayDay(visitorId);
  const solved = gradeQuiz(body?.answers, day.questions);
  if (!solved) {
    return NextResponse.json({ solved: false, error: "Get at least 4 of 5 correct to clear this plot." });
  }

  await markCleared(day.supabase, visitorId, day.date, "quiz");
  return NextResponse.json({ solved: true, offer: { ...day.publicPlay.offer, unlocked: true } });
}
