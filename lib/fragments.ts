import seed from "@/data/archive.seed.json";

// The archive — the docs/API.md contract shape, POSTed verbatim to /api/dream.
// NOT a database: the committed seed plus any live notes, kept in localStorage.
// Seed persona: Sam, standup, stated hour about renting in London; buried
// workshop/hands thread. See data/archive.seed.json's _readme.
export type Note = { id: string; text: string; at: string };

export type ArchiveUser = {
  name: string;
  practice: string;
  stated_priority: string;
  idea_shape: string;
  dormant_project?: string;
};

export type Archive = { user: ArchiveUser; notes: Note[] };

const STORAGE_KEY = "nocturne.archive.v1";

const SEED: Archive = { user: seed.user, notes: seed.notes };

export function loadArchive(): Archive {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Archive;
  } catch {
    return SEED;
  }
}

// Live notes get id "live-N" and an ISO timestamp — docs/API.md. cycle_at is
// stamped server-side; a live note within 24h of it is what can trigger a eureka.
export function appendNote(text: string): Archive {
  const archive = loadArchive();
  const liveCount = archive.notes.filter((n) => n.id.startsWith("live-")).length;
  const note: Note = {
    id: `live-${liveCount + 1}`,
    text: text.trim(),
    at: new Date().toISOString(),
  };
  const next = { ...archive, notes: [...archive.notes, note] };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function resetArchive(): Archive {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
  }
  return SEED;
}

// "Wed 18 Jun, 08:42" — history rows.
export function noteTimeLabel(at: string): string {
  const d = new Date(at);
  const day = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day}, ${time}`;
}

// Entry prompts — docs/ENTRY-UX.md. One question, not a menu; observational,
// not productive. First visit gets the standing invitation; returns rotate.
export const FIRST_INVITATION = "What’s rattling around today?";

const RETURN_PROMPTS = [
  "What did you notice since yesterday?",
  "What’s still nagging at you from earlier?",
  "Overheard anything worth keeping?",
  "What keeps pulling your attention back?",
  "Anything you can’t quite explain yet?",
];

const VISITS_KEY = "nocturne.visits.v1";

export function visitPrompt(): string {
  if (typeof window === "undefined") return FIRST_INVITATION;
  try {
    const visits = Number(window.localStorage.getItem(VISITS_KEY) ?? "0");
    window.localStorage.setItem(VISITS_KEY, String(visits + 1));
    if (visits === 0) return FIRST_INVITATION;
    return RETURN_PROMPTS[(visits - 1) % RETURN_PROMPTS.length];
  } catch {
    return FIRST_INVITATION;
  }
}
