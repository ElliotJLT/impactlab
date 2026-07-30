import type { Fragment } from "./prompt";

// Demo persona: Maya, documentary filmmaker. NOT a database — seed data + localStorage.
// The buried thread (her father's silence) recurs in different words, never named as the
// subject; the stated subject (the town) and craft logistics are also present so the
// buried thread stands out against them. See docs/scope-DRAFT-samantha.md.
export const PRACTICE = "documentary film";

export const SEED_FRAGMENTS: Fragment[] = [
  { ts: "Mon 08:14", text: "Establishing shot idea — the empty parking lot where the shift used to line up. Nobody there now. Just gulls." },
  { ts: "Mon 21:03", text: "Dad never once said the word 'redundant'. Fifteen years and he called it 'the change'." },
  { ts: "Tue 12:47", text: "Interview the union rep about the closure timeline. Need the actual dates the lines shut down." },
  { ts: "Tue 19:22", text: "The chair at the head of the table. He'd sit there after his shift and just... not talk. Mum filled the silence." },
  { ts: "Wed 07:58", text: "B-roll: the river behind the plant, the rusted loading doors. Town-decline montage material." },
  { ts: "Wed 22:41", text: "Remembered tonight — the way he'd go quiet the second the local news came on. Like he was bracing." },
  { ts: "Thu 13:15", text: "Get the archive footage of the factory's opening day, 1974. Council might have it." },
  { ts: "Thu 20:09", text: "It wasn't the money that broke him. It was that nobody asked him how he was. He just went smaller." },
  { ts: "Fri 09:30", text: "Structure thought: open on the town thriving, close on the boarded windows. The arc of a place." },
  { ts: "Fri 23:12", text: "I keep coming back to his hands on the kitchen table. Not doing anything. That's the shot I actually want." },
  { ts: "Sat 16:44", text: "Need a stat on how many jobs went when the plant closed. Roughly 800?" },
  { ts: "Sun 21:50", text: "Maybe the film isn't as much about the town as I keep telling people it is. But about the town, obviously." },
];

const STORAGE_KEY = "nocturne.fragments.v1";

// Read fragments from localStorage, falling back to the seed set on first run.
export function loadFragments(): Fragment[] {
  if (typeof window === "undefined") return SEED_FRAGMENTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FRAGMENTS));
      return SEED_FRAGMENTS;
    }
    return JSON.parse(raw) as Fragment[];
  } catch {
    return SEED_FRAGMENTS;
  }
}

export function appendFragment(text: string): Fragment[] {
  const fragments = loadFragments();
  const ts = nowLabel();
  const next = [...fragments, { ts, text: text.trim() }];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function resetFragments(): Fragment[] {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FRAGMENTS));
  }
  return SEED_FRAGMENTS;
}

// "Sun 21:50"-style label to match the seed set's format.
function nowLabel(): string {
  const d = new Date();
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${hh}:${mm}`;
}
