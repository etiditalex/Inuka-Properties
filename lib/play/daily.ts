import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/service";
import {
  FALLBACK_LETTER_SETS,
  FALLBACK_OFFER,
  FALLBACK_QUESTIONS,
  FALLBACK_WORDS,
  dateSeed,
  nairobiDate,
  pickIndex,
  plotReference,
  type PlayLetterSet,
  type PlayOffer,
  type PlayQuestion,
  type PlayWord,
} from "@/lib/play/catalog";
import { lettersForGrid, miniSudokuPuzzle, sameGrid } from "@/lib/play/sudoku";

export type PlayGame = "sudoku" | "word" | "quiz";

export type PublicPlay = {
  date: string;
  dayLabel: string;
  offer: PlayOffer & { unlocked: boolean };
  plots: { id: PlayGame; code: string; title: string; detail: string; cleared: boolean }[];
  sudoku: { letters: string[]; label: string; puzzle: string[][] };
  word: { length: number; tries: number; hint: string };
  quiz: { id: string; prompt: string; choices: string[] }[];
};

const VISITOR_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function cleanVisitorId(value: unknown): string | null {
  const id = typeof value === "string" ? value.trim() : "";
  return VISITOR_RE.test(id) ? id : null;
}

async function loadLists(supabase: SupabaseClient | null) {
  if (!supabase) {
    return {
      words: FALLBACK_WORDS,
      letters: FALLBACK_LETTER_SETS,
      questions: FALLBACK_QUESTIONS,
      offer: FALLBACK_OFFER,
    };
  }

  const [wordsRes, lettersRes, questionsRes, offerRes] = await Promise.all([
    supabase.from("play_words").select("word, hint").eq("active", true),
    supabase.from("play_letter_sets").select("letters, label").eq("active", true),
    supabase.from("play_quiz_questions").select("id, prompt, choices, correct_index").eq("active", true).order("sort_order"),
    supabase.from("play_offers").select("title, price, summary, path").eq("active", true).limit(1).maybeSingle(),
  ]);

  const words = (wordsRes.data || [])
    .map((row) => ({ word: String(row.word || "").toUpperCase(), hint: String(row.hint || "") }))
    .filter((row) => row.word.length === 5);
  const letters = (lettersRes.data || [])
    .map((row) => ({ letters: String(row.letters || "").toUpperCase(), label: String(row.label || row.letters || "") }))
    .filter((row) => new Set(row.letters).size === 6 && row.letters.length === 6);
  const questions = (questionsRes.data || [])
    .map((row) => ({
      id: String(row.id),
      prompt: String(row.prompt || ""),
      choices: Array.isArray(row.choices) ? row.choices.map(String) : [],
      correctIndex: Number(row.correct_index),
    }))
    .filter((row) => row.prompt && row.choices.length >= 2 && row.correctIndex >= 0 && row.correctIndex < row.choices.length);
  const offer = offerRes.data
    ? {
        title: String(offerRes.data.title),
        price: String(offerRes.data.price),
        summary: String(offerRes.data.summary),
        path: String(offerRes.data.path),
      }
    : FALLBACK_OFFER;

  return {
    words: words.length ? words : FALLBACK_WORDS,
    letters: letters.length ? letters : FALLBACK_LETTER_SETS,
    questions: questions.length >= 5 ? questions : FALLBACK_QUESTIONS,
    offer,
  };
}

function dayQuestions(questions: PlayQuestion[], seed: number): PlayQuestion[] {
  const pool = questions.slice();
  const rand = mulberryFrom(seed ^ 0x51f);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5);
}

function mulberryFrom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export async function getPlayDay(visitorId?: string | null, now = new Date()) {
  const date = nairobiDate(now);
  const seed = dateSeed(date);
  const supabase = createServiceClient();
  const lists = await loadLists(supabase);
  const word = lists.words[pickIndex(lists.words.length, seed, 1)];
  const letterSet: PlayLetterSet = lists.letters[pickIndex(lists.letters.length, seed, 2)];
  const questions = dayQuestions(lists.questions, seed);
  const { puzzle, solution } = miniSudokuPuzzle(seed);
  const puzzleLetters = lettersForGrid(puzzle, letterSet.letters);
  const solutionLetters = lettersForGrid(solution, letterSet.letters);

  const cleared = new Set<PlayGame>();
  if (supabase && visitorId) {
    const { data } = await supabase
      .from("play_completions")
      .select("game")
      .eq("visitor_id", visitorId)
      .eq("play_date", date);
    for (const row of data || []) {
      if (row.game === "sudoku" || row.game === "word" || row.game === "quiz") cleared.add(row.game);
    }
  }

  const publicPlay: PublicPlay = {
    date,
    dayLabel: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Nairobi",
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(now),
    offer: { ...lists.offer, unlocked: cleared.size > 0 },
    plots: [
      {
        id: "sudoku",
        code: plotReference(date, "A"),
        title: "Mini Sudoku",
        detail: `${letterSet.label} letters · Easy`,
        cleared: cleared.has("sudoku"),
      },
      {
        id: "word",
        code: plotReference(date, "B"),
        title: "Word of the day",
        detail: "Guess the 5-letter word · 6 tries",
        cleared: cleared.has("word"),
      },
      {
        id: "quiz",
        code: plotReference(date, "C"),
        title: "Coast quiz",
        detail: "Kenya, land and Inuka · 5 questions",
        cleared: cleared.has("quiz"),
      },
    ],
    sudoku: { letters: letterSet.letters.split(""), label: letterSet.label, puzzle: puzzleLetters },
    word: { length: 5, tries: 6, hint: word.hint },
    quiz: questions.map(({ id, prompt, choices }) => ({ id, prompt, choices })),
  };

  return { date, publicPlay, word, questions, solutionLetters, supabase };
}

export async function markCleared(
  supabase: SupabaseClient | null,
  visitorId: string,
  date: string,
  game: PlayGame
) {
  if (!supabase) return;
  await supabase.from("play_completions").upsert(
    { visitor_id: visitorId, play_date: date, game },
    { onConflict: "visitor_id,play_date,game" }
  );
}

export function scoreWord(guess: string, answer: string): ("correct" | "present" | "absent")[] {
  const result: ("correct" | "present" | "absent")[] = Array(answer.length).fill("absent");
  const remaining: Record<string, number> = {};
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) result[i] = "correct";
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < answer.length; i++) {
    if (result[i] === "correct") continue;
    if (remaining[guess[i]]) {
      result[i] = "present";
      remaining[guess[i]] -= 1;
    }
  }
  return result;
}

export function gradeSudoku(submitted: unknown, solution: string[][]): boolean {
  if (!Array.isArray(submitted) || submitted.length !== solution.length) return false;
  const grid = submitted.map((row) =>
    Array.isArray(row) ? row.map((cell) => String(cell || "").trim().toUpperCase()) : []
  );
  return sameGrid(grid, solution);
}

export function gradeQuiz(answers: unknown, questions: PlayQuestion[]): boolean {
  if (!Array.isArray(answers) || answers.length !== questions.length) return false;
  const correct = answers.filter((answer, index) => Number(answer) === questions[index].correctIndex).length;
  return correct >= 4;
}
