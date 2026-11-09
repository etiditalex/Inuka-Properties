"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getVisitorId } from "@/lib/properties/engagementClient";
import type { PublicPlay } from "@/lib/play/daily";

type GameId = "sudoku" | "word" | "quiz";
type Mark = "correct" | "present" | "absent";

type WordRow = { guess: string; marks: Mark[] };

const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function PlayExperience() {
  const [play, setPlay] = useState<PublicPlay | null>(null);
  const [active, setActive] = useState<GameId>("sudoku");
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [sudokuMessage, setSudokuMessage] = useState("");
  const [wordRows, setWordRows] = useState<WordRow[]>([]);
  const [draft, setDraft] = useState("");
  const [wordMessage, setWordMessage] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizMessage, setQuizMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const visitorId = getVisitorId();
    fetch(`/api/play/today?visitorId=${visitorId}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: PublicPlay) => {
        setPlay(data);
        setGrid(data.sudoku.puzzle.map((row) => row.slice()));
        setAnswers(data.quiz.map(() => -1));
        try {
          const saved = localStorage.getItem(`iapl-play-word-${data.date}`);
          if (saved) setWordRows(JSON.parse(saved));
        } catch {
          localStorage.removeItem(`iapl-play-word-${data.date}`);
        }
      })
      .catch(() => setLoadError("The games could not load. Refresh and try again."));
  }, []);

  const given = useMemo(() => play?.sudoku.puzzle || [], [play]);

  const fillLetter = (letter: string) => {
    if (!selected || !play) return;
    const [row, col] = selected;
    if (given[row]?.[col]) return;
    setGrid((current) => current.map((cells, rowIndex) => cells.map((cell, colIndex) => (
      rowIndex === row && colIndex === col ? letter : cell
    ))));
  };

  const submitSudoku = async () => {
    if (!play) return;
    setBusy(true);
    setSudokuMessage("");
    try {
      const response = await fetch("/api/play/sudoku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId(), grid }),
      });
      const data = await response.json();
      if (!data.solved) {
        setSudokuMessage(data.error || "Keep going.");
        return;
      }
      setSudokuMessage("Plot A is cleared.");
      setPlay((current) => current && markCleared(current, "sudoku"));
    } finally {
      setBusy(false);
    }
  };

  const submitWord = async () => {
    if (!play || draft.length !== 5) return;
    setBusy(true);
    setWordMessage("");
    try {
      const response = await fetch("/api/play/word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId(), guess: draft }),
      });
      const data = await response.json();
      if (!response.ok) {
        setWordMessage(data.error || "Try another word.");
        return;
      }
      const next = [...wordRows, { guess: draft, marks: data.marks as Mark[] }];
      setWordRows(next);
      localStorage.setItem(`iapl-play-word-${play.date}`, JSON.stringify(next));
      setDraft("");
      if (data.solved) {
        setWordMessage("Plot B is cleared.");
        setPlay((current) => current && markCleared(current, "word"));
      } else if (next.length >= 6) {
        setWordMessage("The six tries are used. Come back tomorrow for a new word.");
      }
    } finally {
      setBusy(false);
    }
  };

  const submitQuiz = async () => {
    if (!play) return;
    setBusy(true);
    setQuizMessage("");
    try {
      const response = await fetch("/api/play/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId(), answers }),
      });
      const data = await response.json();
      if (!data.solved) {
        setQuizMessage(data.error || "Try the questions again.");
        return;
      }
      setQuizMessage("Plot C is cleared.");
      setPlay((current) => current && markCleared(current, "quiz"));
    } finally {
      setBusy(false);
    }
  };

  if (!play) {
    return (
      <p className="px-4 pb-20 pt-28 text-center font-montserrat text-dark-600">
        {loadError || "Loading today's games…"}
      </p>
    );
  }

  return (
    <div className="bg-dark-50 pb-20 pt-24 md:pt-28">
      <div className="mx-auto w-full max-w-5xl px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 font-montserrat">
          Coastal Break · {play.dayLabel}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-dark-900 font-montserrat md:text-4xl">Take a break and play.</h1>
        <p className="mt-3 max-w-2xl text-dark-600 font-montserrat">
          New games every day. Clear any plot to unlock the {play.offer.title} offer.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {play.plots.map((plot) => (
            <button
              key={plot.id}
              type="button"
              onClick={() => setActive(plot.id)}
              className={`rounded-2xl border p-4 text-left font-montserrat shadow-sm ${
                active === plot.id ? "border-primary-600 bg-white" : "border-transparent bg-white/80"
              }`}
            >
              <span className="text-xs font-bold uppercase text-primary-700">
                Plot {plot.id === "sudoku" ? "A" : plot.id === "word" ? "B" : "C"} · {plot.code}
              </span>
              <span className="mt-1 block text-base font-semibold text-dark-900">{plot.title}</span>
              <span className="mt-1 block text-sm text-dark-600">{plot.detail}</span>
              {plot.cleared ? <span className="mt-3 inline-block rounded-full bg-primary-100 px-2 py-1 text-xs font-bold text-primary-800">Cleared</span> : null}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-4 shadow-lg md:p-6">
          {active === "sudoku" ? (
            <SudokuPanel
              play={play}
              grid={grid}
              selected={selected}
              message={sudokuMessage}
              busy={busy}
              onSelect={setSelected}
              onLetter={fillLetter}
              onClear={() => fillLetter("")}
              onSubmit={submitSudoku}
            />
          ) : null}
          {active === "word" ? (
            <WordPanel
              play={play}
              rows={wordRows}
              draft={draft}
              message={wordMessage}
              busy={busy}
              onDraft={setDraft}
              onSubmit={submitWord}
            />
          ) : null}
          {active === "quiz" ? (
            <QuizPanel
              play={play}
              answers={answers}
              message={quizMessage}
              busy={busy}
              onAnswer={(index, choice) => setAnswers((current) => current.map((value, item) => item === index ? choice : value))}
              onSubmit={submitQuiz}
            />
          ) : null}
        </div>

        <OfferCard offer={play.offer} />
      </div>
    </div>
  );
}

function markCleared(play: PublicPlay, game: GameId): PublicPlay {
  return {
    ...play,
    offer: { ...play.offer, unlocked: true },
    plots: play.plots.map((plot) => plot.id === game ? { ...plot, cleared: true } : plot),
  };
}

function SudokuPanel({
  play, grid, selected, message, busy, onSelect, onLetter, onClear, onSubmit,
}: {
  play: PublicPlay;
  grid: string[][];
  selected: [number, number] | null;
  message: string;
  busy: boolean;
  onSelect: (cell: [number, number]) => void;
  onLetter: (letter: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-dark-900 font-montserrat">Plot A · {play.sudoku.label} letters</h2>
      <p className="mt-1 text-sm text-dark-600 font-montserrat">Each letter once in every row, column and 2×3 box.</p>
      <div className="mt-5 inline-grid grid-cols-6 overflow-hidden rounded-xl border-2 border-primary-800">
        {grid.map((row, rowIndex) => row.map((cell, colIndex) => {
          const locked = Boolean(play.sudoku.puzzle[rowIndex]?.[colIndex]);
          const chosen = selected?.[0] === rowIndex && selected?.[1] === colIndex;
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              onClick={() => onSelect([rowIndex, colIndex])}
              className={`h-11 w-11 border text-sm font-bold font-montserrat sm:h-12 sm:w-12 ${
                locked ? "bg-primary-50 text-primary-900" : "bg-white text-dark-900"
              } ${chosen ? "ring-2 ring-inset ring-primary-600" : ""} ${
                colIndex % 3 === 2 ? "border-r-primary-800" : "border-r-primary-100"
              } ${rowIndex % 2 === 1 ? "border-b-primary-800" : "border-b-primary-100"}`}
            >
              {cell}
            </button>
          );
        }))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {play.sudoku.letters.map((letter) => (
          <button key={letter} type="button" onClick={() => onLetter(letter)} className="h-10 w-10 rounded-lg bg-primary-700 text-sm font-bold text-white font-montserrat">
            {letter}
          </button>
        ))}
        <button type="button" onClick={onClear} className="rounded-lg border border-dark-200 px-3 text-sm font-semibold font-montserrat">Clear</button>
        <button type="button" disabled={busy} onClick={onSubmit} className="rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white font-montserrat disabled:opacity-60">Check plot</button>
      </div>
      {message ? <p className="mt-3 text-sm font-semibold text-primary-800 font-montserrat">{message}</p> : null}
    </div>
  );
}

function WordPanel({
  play, rows, draft, message, busy, onDraft, onSubmit,
}: {
  play: PublicPlay;
  rows: WordRow[];
  draft: string;
  message: string;
  busy: boolean;
  onDraft: (value: string) => void;
  onSubmit: () => void;
}) {
  const done = rows.length >= play.word.tries || rows.some((row) => row.marks.every((mark) => mark === "correct"));
  return (
    <div>
      <h2 className="text-xl font-bold text-dark-900 font-montserrat">Plot B · Word of the day</h2>
      <p className="mt-1 text-sm text-dark-600 font-montserrat">{play.word.hint}</p>
      <div className="mt-5 space-y-2">
        {Array.from({ length: play.word.tries }, (_, index) => {
          const row = rows[index];
          const letters = row?.guess.split("") || (index === rows.length ? draft.padEnd(5).split("").slice(0, 5) : Array(5).fill(""));
          return (
            <div key={index} className="flex gap-2">
              {letters.map((letter, letterIndex) => (
                <span
                  key={letterIndex}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border text-lg font-bold font-montserrat ${markClass(row?.marks[letterIndex])}`}
                >
                  {letter.trim()}
                </span>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex max-w-lg flex-wrap gap-1">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            disabled={done}
            onClick={() => onDraft(draft.length < 5 ? draft + key : draft)}
            className="h-9 min-w-8 rounded-md bg-dark-100 px-2 text-sm font-bold font-montserrat"
          >
            {key}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => onDraft(draft.slice(0, -1))} className="rounded-lg border px-3 py-2 text-sm font-semibold font-montserrat">Delete</button>
        <button type="button" disabled={busy || done || draft.length !== 5} onClick={onSubmit} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white font-montserrat disabled:opacity-60">Guess</button>
      </div>
      {message ? <p className="mt-3 text-sm font-semibold text-primary-800 font-montserrat">{message}</p> : null}
    </div>
  );
}

function markClass(mark?: Mark) {
  if (mark === "correct") return "border-primary-700 bg-primary-700 text-white";
  if (mark === "present") return "border-secondary-400 bg-secondary-300 text-dark-900";
  if (mark === "absent") return "border-dark-300 bg-dark-200 text-dark-700";
  return "border-dark-200 bg-white text-dark-900";
}

function QuizPanel({
  play, answers, message, busy, onAnswer, onSubmit,
}: {
  play: PublicPlay;
  answers: number[];
  message: string;
  busy: boolean;
  onAnswer: (index: number, choice: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-dark-900 font-montserrat">Plot C · Coast quiz</h2>
      <div className="mt-5 space-y-5">
        {play.quiz.map((question, index) => (
          <fieldset key={question.id}>
            <legend className="text-sm font-semibold text-dark-900 font-montserrat">{index + 1}. {question.prompt}</legend>
            <div className="mt-2 grid gap-2">
              {question.choices.map((choice, choiceIndex) => (
                <label key={choice} className="flex cursor-pointer items-center gap-2 rounded-xl border border-dark-100 px-3 py-2 text-sm font-montserrat hover:bg-primary-50">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[index] === choiceIndex}
                    onChange={() => onAnswer(index, choiceIndex)}
                  />
                  {choice}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <button type="button" disabled={busy} onClick={onSubmit} className="mt-5 rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white font-montserrat disabled:opacity-60">
        Submit quiz
      </button>
      {message ? <p className="mt-3 text-sm font-semibold text-primary-800 font-montserrat">{message}</p> : null}
    </div>
  );
}

function OfferCard({ offer }: { offer: PublicPlay["offer"] }) {
  return (
    <div className={`mt-6 rounded-3xl p-6 font-montserrat ${offer.unlocked ? "bg-primary-700 text-white" : "bg-white text-dark-900"}`}>
      <p className="text-xs font-bold uppercase tracking-wide">{offer.unlocked ? "Offer unlocked" : "Locked until you clear a plot"}</p>
      <h2 className="mt-2 text-2xl font-bold">{offer.title}</h2>
      <p className="mt-1 text-lg font-semibold">{offer.price}</p>
      <p className={`mt-2 text-sm leading-relaxed ${offer.unlocked ? "text-primary-50" : "text-dark-600"}`}>{offer.summary}</p>
      {offer.unlocked ? (
        <Link href={offer.path} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-800">
          View the listing
        </Link>
      ) : (
        <p className="mt-4 text-sm">Finish the Sudoku, the word, or the quiz.</p>
      )}
    </div>
  );
}
