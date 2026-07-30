"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { BottomBar } from "@/components/BottomBar";
import { loadArchive, noteTimeLabel, type Note } from "@/lib/fragments";

// Week — the raw material, timestamped. Calm, low-contrast history (DESIGN.md), newest
// first so the thing you just caught is the thing you see. The meaning is one tap away,
// on /read.
export default function WeekPage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes([...loadArchive().notes].reverse());
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] w-full px-[var(--s-4)] pin-top">
      <header className="w-full max-w-[560px] mx-auto pt-[var(--s-5)] pb-[var(--s-4)] relative text-center">
        <Link
          href="/"
          aria-label="Back"
          className="absolute left-0 top-[var(--s-4)] inline-flex items-center justify-center w-[var(--tap)] h-[var(--tap)] rounded-[var(--r-full)] text-muted text-[22px] [@media(hover:hover)]:hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span aria-hidden>←</span>
        </Link>
        <h1 className="text-[clamp(28px,6vw,40px)] font-[family-name:var(--font-serif)] leading-[1.1]">
          Everything you’ve caught
        </h1>
        {notes.length > 0 && (
          <p className="text-[13px] text-muted mt-[var(--s-2)]">
            {notes.length} fragments, newest first
          </p>
        )}
      </header>

      <div className="flex-1 flex flex-col gap-[var(--s-4)] pb-[150px] w-full max-w-[560px] mx-auto">
        {notes.map((n, i) => (
          <Card
            key={n.id}
            // Staggered drift-in — the week assembling itself. Capped so a long archive
            // doesn't leave the last cards waiting seconds to appear.
            style={{ animationDelay: `${Math.min(i, 7) * 55}ms` }}
            className="!p-[var(--s-5)] [@media(prefers-reduced-motion:no-preference)]:animate-[drift-in_560ms_cubic-bezier(0.22,1,0.36,1)_both]"
          >
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-muted mb-[var(--s-2)]">
              {noteTimeLabel(n.at)}
            </p>
            <p className="text-[16px] leading-[1.55]">{n.text}</p>
          </Card>
        ))}
      </div>

      <BottomBar>
        <Link href="/read" className="block">
          <Button className="w-full">Sleep on it</Button>
        </Link>
        <p className="text-[13px] text-muted text-center mt-[var(--s-2)]">
          Muse works on these overnight.
        </p>
      </BottomBar>
    </main>
  );
}
