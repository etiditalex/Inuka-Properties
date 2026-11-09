import { NextResponse } from "next/server";
import { cleanVisitorId, getPlayDay, gradeSudoku, markCleared } from "@/lib/play/daily";
import { limitIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limited = limitIp(request, "play-sudoku", 40, 10 * 60 * 1000);
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const visitorId = cleanVisitorId(body?.visitorId);
  if (!visitorId) return NextResponse.json({ error: "A visitor id is required." }, { status: 400 });

  const day = await getPlayDay(visitorId);
  const solved = gradeSudoku(body?.grid, day.solutionLetters);
  if (!solved) return NextResponse.json({ solved: false, error: "A letter is still in the wrong cell." });

  await markCleared(day.supabase, visitorId, day.date, "sudoku");
  return NextResponse.json({ solved: true, offer: { ...day.publicPlay.offer, unlocked: true } });
}
