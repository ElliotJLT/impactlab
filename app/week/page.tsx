"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { BottomBar } from "@/components/BottomBar";
import { loadArchive, noteTimeLabel, type Note } from "@/lib/fragments";

// Week — the raw material, timestamped. Deliberately plain: calm, low-contrast
// history (DESIGN.md). The meaning is one tap away, on /read.
export default function WeekPage() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(loadArchive().notes);
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
      </header>

      <div className="flex-1 flex flex-col gap-[var(--s-3)] pb-[120px] w-full max-w-[560px] mx-auto">
        {notes.map((n) => (
          <Card key={n.id} className="!p-[var(--s-4)]">
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-muted mb-[var(--s-1)]">
              {noteTimeLabel(n.at)}
            </p>
            <p className="text-[16px]">{n.text}</p>
          </Card>
        ))}
      </div>

      <BottomBar>
        <Link href="/read" className="block">
          <Button className="w-full">Sleep on it</Button>
        </Link>
      </BottomBar>
    </main>
  );
}
