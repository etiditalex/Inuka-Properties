import { NextResponse } from "next/server";
import { cleanVisitorId, getPlayDay, markCleared, scoreWord } from "@/lib/play/daily";
import { limitIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limited = limitIp(request, "play-word", 40, 10 * 60 * 1000);
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const visitorId = cleanVisitorId(body?.visitorId);
  const guess = String(body?.guess || "").trim().toUpperCase();
  if (!visitorId) return NextResponse.json({ error: "A visitor id is required." }, { status: 400 });
  if (!/^[A-Z]{5}$/.test(guess)) {
    return NextResponse.json({ error: "Enter a 5-letter word." }, { status: 400 });
  }

  const day = await getPlayDay(visitorId);
  const answer = day.word.word;
  const marks = scoreWord(guess, answer);
  const solved = guess === answer;
  if (solved) await markCleared(day.supabase, visitorId, day.date, "word");

  return NextResponse.json({
    solved,
    marks,
    answer: solved ? answer : undefined,
    offer: solved ? { ...day.publicPlay.offer, unlocked: true } : undefined,
  });
}
