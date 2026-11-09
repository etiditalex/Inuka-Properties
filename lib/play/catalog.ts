export type PlayOffer = {
  title: string;
  price: string;
  summary: string;
  path: string;
};

export type PlayWord = { word: string; hint: string };
export type PlayLetterSet = { letters: string; label: string };
export type PlayQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

export const FALLBACK_OFFER: PlayOffer = {
  title: "Tulivu Haven",
  price: "KES 450,000",
  summary:
    "1/8-acre plots in Kibao Kiche, Mariakani, with water and electricity on site. Deposit KES 150,000, then the balance over about 12 months.",
  path: "/for-sale/14",
};

export const FALLBACK_WORDS: PlayWord[] = [
  { word: "PLOTS", hint: "What Inuka sells along the coast" },
  { word: "NYALI", hint: "Mombasa suburb where the Inuka office sits" },
  { word: "DIANI", hint: "A south-coast beach buyers ask about" },
  { word: "TITLE", hint: "The deed buyers want on their land" },
  { word: "BEACH", hint: "Coastal land beside the ocean" },
  { word: "SHORE", hint: "Where the sea meets a beach plot" },
  { word: "ACRES", hint: "How larger parcels are measured" },
  { word: "COAST", hint: "The region Inuka serves" },
  { word: "FENCE", hint: "A boundary around a gated project" },
  { word: "HAVEN", hint: "The second word in Tulivu Haven" },
];

export const FALLBACK_LETTER_SETS: PlayLetterSet[] = [
  { letters: "ISLAND", label: "Island" },
  { letters: "MARINE", label: "Marine" },
  { letters: "BEACON", label: "Beacon" },
  { letters: "GARDEN", label: "Garden" },
  { letters: "MARKET", label: "Market" },
  { letters: "BRIDGE", label: "Bridge" },
];

export const FALLBACK_QUESTIONS: PlayQuestion[] = [
  {
    id: "office",
    prompt: "Where is the Inuka Afrika Properties head office?",
    choices: ["Nyali, Mombasa", "Nairobi CBD", "Diani beach", "Nakuru town"],
    correctIndex: 0,
  },
  {
    id: "tulivu",
    prompt: "Tulivu Haven plots are in which area?",
    choices: ["Nyali", "Kibao Kiche, Mariakani", "Diani", "Nanyuki"],
    correctIndex: 1,
  },
  {
    id: "size",
    prompt: "What plot size does Tulivu Haven offer?",
    choices: ["1 acre", "5 acres", "1/8 acre", "50 x 100"],
    correctIndex: 2,
  },
  {
    id: "counties",
    prompt: "Which counties does Inuka highlight for coastal buyers?",
    choices: ["Mombasa, Kilifi and Kwale", "Nairobi only", "Nakuru only", "Kisumu only"],
    correctIndex: 0,
  },
  {
    id: "plan",
    prompt: "A common Inuka payment plan is:",
    choices: ["Cash only", "Deposit, then about 12 months", "30-year bank mortgage only", "Rent to own"],
    correctIndex: 1,
  },
  {
    id: "msabaha",
    prompt: "Msabaha Phase 8 is near which town?",
    choices: ["Malindi", "Thika", "Kitale", "Nyeri"],
    correctIndex: 0,
  },
  {
    id: "tezo",
    prompt: "Miliki Tezo na Inuka is in which town?",
    choices: ["Tezo", "Karen", "Juja", "Konza"],
    correctIndex: 0,
  },
  {
    id: "phone",
    prompt: "Which phone number is on the Inuka website?",
    choices: ["0711 082084", "020 123 456", "0111 000 000", "0790 300 300"],
    correctIndex: 0,
  },
];

export function nairobiDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(now);
}

export function dateSeed(date: string): number {
  let hash = 2166136261;
  for (let i = 0; i < date.length; i++) {
    hash ^= date.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickIndex(length: number, seed: number, salt: number): number {
  if (length <= 0) return 0;
  const rand = mulberry32((seed ^ Math.imul(salt, 0x9e3779b1)) >>> 0);
  return Math.floor(rand() * length);
}

export function plotReference(date: string, plot: "A" | "B" | "C"): string {
  const [, month, day] = date.split("-");
  return `L.R. ${day}/${month}/${plot}`;
}
