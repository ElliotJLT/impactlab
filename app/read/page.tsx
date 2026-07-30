"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { loadArchive, type Archive } from "@/lib/fragments";

// Read — the wake screen. POSTs the whole archive to /api/dream (docs/API.md) and
// renders the structured dream: the reading (stated vs revealed), up to three
// collisions, and the rare eureka. Hard rule from DESIGN.md: the user's words are
// quoted verbatim and foregrounded; the dream's `extension` is always visibly the
// machine's guess — muted, italic, labelled. Never blur that line.

type Dream = {
  reading: {
    stated: { note_ids: string[] };
    revealed: { theme: string; note_ids: string[] };
  };
  collisions: {
    note_ids: string[];
    span_days: number;
    connection: string;
    question: string;
    extension: string | null;
  }[];
  eureka: {
    note_ids: string[];
    why_now: string;
    question: string;
    extension: string | null;
  } | null;
};

export default function ReadPage() {
  const [state, setState] = useState<"dreaming" | "awake" | "error">("dreaming");
  const [dream, setDream] = useState<Dream | null>(null);
  const [archive, setArchive] = useState<Archive | null>(null);

  useEffect(() => {
    const a = loadArchive();
    setArchive(a);
    // Full archive every call — the API is stateless; order and timestamps carry
    // signal (docs/API.md). cycle_at is stamped server-side.
    fetch("/api/dream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: a.user, notes: a.notes }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("dream failed");
        setDream((await res.json()) as Dream);
        setState("awake");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] w-full px-[var(--s-4)] pin-top pb-[var(--s-7)] [&>*]:w-full [&>*]:max-w-[560px] [&>*]:mx-auto">
      <header className="pt-[var(--s-5)] pb-[var(--s-4)] relative text-center">
        <Link
          href="/week"
          aria-label="Back"
          className="absolute left-0 top-[var(--s-4)] inline-flex items-center justify-center w-[var(--tap)] h-[var(--tap)] rounded-[var(--r-full)] text-muted text-[22px] [@media(hover:hover)]:hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span aria-hidden>←</span>
        </Link>
        <h1 className="text-[clamp(26px,5.5vw,36px)] font-[family-name:var(--font-serif)] leading-[1.15] px-[var(--s-7)]">
          {state === "dreaming" ? "Sleeping on it…" : "While you were away"}
        </h1>
      </header>

      {state === "dreaming" && <Dreaming />}

      {state === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-[var(--s-3)] text-center">
          <p className="text-danger text-[16px]">The night was dreamless. Try again.</p>
          <button
            onClick={() => location.reload()}
            className="text-accent underline underline-offset-4 min-h-[var(--tap-min)]"
          >
            Sleep on it again
          </button>
        </div>
      )}

      {state === "awake" && dream && archive && <Wake dream={dream} archive={archive} />}
    </main>
  );
}

// The one sanctioned ambient motion (DESIGN.md): covers the 10–20s API call in
// place of a spinner. Reduced-motion users get the same words, still.
function Dreaming() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-[var(--s-4)] text-center">
      <div className="flex gap-[var(--s-3)]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-accent opacity-30 [@media(prefers-reduced-motion:no-preference)]:animate-[dream-drift_2.8s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.9}s` }}
          />
        ))}
      </div>
      <p className="text-[19px] text-muted" role="status">
        Colliding what you dropped in — weeks apart.
      </p>
      <p className="text-[13px] text-muted max-w-[260px]">
        It only works with what’s already yours. Nothing gets written for you.
      </p>
    </div>
  );
}

function Wake({ dream, archive }: { dream: Dream; archive: Archive }) {
  const noteById = useMemo(
    () => new Map(archive.notes.map((n) => [n.id, n])),
    [archive]
  );
  const quote = (id: string) => noteById.get(id)?.text ?? null;

  return (
    <div className="flex flex-col gap-[var(--s-4)]">
      {/* The reading — the two-line frame, the "oh" at a glance. */}
      <Card>
        <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-muted">
          You say it’s about
        </p>
        <p className="text-[19px] mb-[var(--s-1)]">{archive.user.stated_priority}</p>
        <p className="text-[13px] text-muted mb-[var(--s-4)]">
          {dream.reading.stated.note_ids.length} notes serving it
        </p>
        <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-accent">
          You keep returning to
        </p>
        <p className="font-[family-name:var(--font-serif)] text-[24px] leading-[1.25]">
          {dream.reading.revealed.theme}
        </p>
        <p className="text-[13px] text-muted mt-[var(--s-1)]">
          {dream.reading.revealed.note_ids.length} notes — never announced, always there
        </p>
      </Card>

      {/* Collisions — notes weeks apart sharing an itch, quoted verbatim. */}
      {dream.collisions.map((c, i) => (
        <Card key={i}>
          <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-muted mb-[var(--s-3)]">
            Collision · {c.span_days} days apart
          </p>
          <ul className="flex flex-col gap-[var(--s-2)] mb-[var(--s-3)]">
            {c.note_ids.map((id) => {
              const text = quote(id);
              return text ? (
                <li
                  key={id}
                  className="font-[family-name:var(--font-mono)] text-[14px] leading-[1.5] border-l-2 border-[var(--accent)] pl-[var(--s-3)]"
                >
                  {text}
                </li>
              ) : null;
            })}
          </ul>
          <p className="text-[16px] leading-[1.55] mb-[var(--s-3)]">{c.connection}</p>
          <p className="text-[16px] italic">{c.question}</p>
          <Extension text={c.extension} />
        </Card>
      ))}

      {/* The eureka — rare, earns the Display face. The null case is calm and
          intentional, never a failure state. */}
      {dream.eureka ? (
        <Card className="[box-shadow:var(--glow)]">
          <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-accent mb-[var(--s-3)]">
            Eureka — why tonight
          </p>
          <p className="font-[family-name:var(--font-serif)] text-[32px] leading-[1.15] mb-[var(--s-3)]">
            {dream.eureka.why_now}
          </p>
          <ul className="flex flex-col gap-[var(--s-2)] mb-[var(--s-3)]">
            {dream.eureka.note_ids.map((id) => {
              const text = quote(id);
              return text ? (
                <li
                  key={id}
                  className="font-[family-name:var(--font-mono)] text-[14px] leading-[1.5] border-l-2 border-[var(--accent)] pl-[var(--s-3)]"
                >
                  {text}
                </li>
              ) : null;
            })}
          </ul>
          <p className="text-[16px] italic">{dream.eureka.question}</p>
          <Extension text={dream.eureka.extension} />
        </Card>
      ) : (
        <Card>
          <p className="text-[19px] font-[family-name:var(--font-serif)]">Nothing new tonight.</p>
          <p className="text-[14px] text-muted mt-[var(--s-1)]">
            Most nights there isn’t. The dream works on the day’s residue — keep dropping
            things in.
          </p>
        </Card>
      )}

      <p className="text-[13px] text-muted text-center pt-[var(--s-2)]">
        Your words are quoted exactly. Anything the dream wondered is marked as its guess.
      </p>
    </div>
  );
}

// The dream's one-step guess — always visibly the machine wondering, never dressed
// as the user's words (docs/API.md hard rule).
function Extension({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="mt-[var(--s-3)] border-t border-[var(--border)] pt-[var(--s-3)]">
      <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-muted mb-[var(--s-1)]">
        The dream’s guess
      </p>
      <p className="text-[14px] leading-[1.5] text-muted italic">{text}</p>
    </div>
  );
}
