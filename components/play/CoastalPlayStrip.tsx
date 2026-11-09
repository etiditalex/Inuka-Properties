import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PLOTS = [
  { code: "A", title: "Mini Sudoku", detail: "Easy letter grid" },
  { code: "B", title: "Word of the day", detail: "5 letters, 6 tries" },
  { code: "C", title: "Coast quiz", detail: "5 Inuka questions" },
];

export default function CoastalPlayStrip() {
  return (
    <section className="bg-white pb-6 pt-4 md:pb-10" aria-labelledby="coastal-break-heading">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white shadow-xl">
          <div className="grid items-center gap-8 p-6 md:p-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-200 font-montserrat">
                Coastal Break · 3 daily games
              </p>
              <h2 id="coastal-break-heading" className="mt-3 scroll-mt-28 text-3xl font-bold font-montserrat md:text-4xl">
                Take a break and play.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-50 font-montserrat md:text-lg">
                Clear a plot, then look at one. Finish a quick Sudoku, word game or quiz and unlock the Tulivu Haven offer.
              </p>
              <Link
                href="/play"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow hover:bg-primary-50 font-montserrat"
              >
                Play today&apos;s games
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl bg-white p-4 text-dark-900 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 font-montserrat">Plot C · sample</p>
              <p className="mt-2 text-sm font-semibold font-montserrat">Tulivu Haven plots are in…</p>
              <div className="mt-3 grid gap-2 text-sm font-montserrat">
                {["Nyali", "Kibao Kiche, Mariakani", "Diani"].map((choice, index) => (
                  <div key={choice} className="rounded-xl border border-primary-100 bg-primary-50 px-3 py-2">
                    <span className="mr-2 font-bold text-primary-700">{String.fromCharCode(65 + index)}</span>
                    {choice}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {PLOTS.map((plot) => (
                  <div key={plot.code} className="rounded-xl bg-dark-50 px-2 py-2 text-center">
                    <p className="text-[11px] font-bold uppercase text-primary-700 font-montserrat">Plot {plot.code}</p>
                    <p className="mt-1 text-xs font-semibold font-montserrat">{plot.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
