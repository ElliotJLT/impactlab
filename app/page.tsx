"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MicButton } from "@/components/MicButton";
import { BottomBar } from "@/components/BottomBar";
import { Button } from "@/components/Button";
import { appendFragment, loadFragments } from "@/lib/fragments";

// Capture — the daily home screen. One job: catch a half-thought. (DESIGN.md: one primary
// action per screen, primary action in the bottom third for thumb reach.)
export default function CapturePage() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setCount(loadFragments().length);
  }, []);

  function save() {
    const value = text.trim();
    if (!value) return;
    const next = appendFragment(value);
    setCount(next.length);
    setText("");
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1600);
  }

  return (
    <main className="flex flex-col min-h-[100dvh] w-full px-[var(--s-4)] pin-top">
      <header className="w-full max-w-[900px] mx-auto pt-[var(--s-6)] pb-[var(--s-5)] text-center">
        <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(56px,16vw,120px)] leading-[0.95] tracking-[-0.02em]">
          Nocturne
        </h1>
        <p className="text-muted text-[clamp(16px,2.5vw,20px)] mt-[var(--s-3)] max-w-[36ch] mx-auto">
          Catch it before it goes. No tidying, no tagging.
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-start gap-[var(--s-3)] pb-[220px] w-full max-w-[560px] mx-auto">
        <label htmlFor="fragment" className="sr-only">
          Your fragment
        </label>
        <textarea
          id="fragment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="A line you overheard. An image. The thing you keep not saying."
          className="w-full min-h-[120px] text-[16px] rounded-[var(--r-md)] border border-[var(--border)] bg-surface p-[var(--s-4)] resize-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent)]"
        />
        {justSaved && (
          <p className="text-[13px] text-accent font-medium" role="status">
            Caught. It’ll be here when you come back.
          </p>
        )}
        <Link
          href="/week"
          className="text-[13px] text-muted underline underline-offset-4 self-start"
        >
          {count} fragment{count === 1 ? "" : "s"} this week →
        </Link>
      </div>

      <BottomBar>
        <div className="flex flex-col gap-[var(--s-3)]">
          <MicButton onTranscript={(t) => setText((prev) => (prev ? prev + " " + t : t))} />
          <Button onClick={save} disabled={!text.trim()}>
            Save fragment
          </Button>
        </div>
      </BottomBar>
    </main>
  );
}
