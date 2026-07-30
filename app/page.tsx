"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MicButton, MicIcon } from "@/components/MicButton";
import { appendNote, loadArchive, visitPrompt, FIRST_INVITATION } from "@/lib/fragments";

// Capture — the daily home screen. One job: get a half-thought spoken out loud, at length.
// Copy follows docs/ENTRY-UX.md (invitation + hidden transcript). The input is a single
// Claude-style composer: textarea with the mic + send controls INSIDE the box. Enter sends,
// Shift+Enter adds a newline — so there's no separate Save button.
export default function CapturePage() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const [prompt, setPrompt] = useState(FIRST_INVITATION);
  const [justSaved, setJustSaved] = useState(false);
  const [listening, setListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCount(loadArchive().notes.length);
    setPrompt(visitPrompt());
  }, []);

  function save() {
    const value = text.trim();
    if (!value) return;
    const next = appendNote(value);
    setCount(next.notes.length);
    setText("");
    setJustSaved(true);
    // Outlast the rise-away animation, or it unmounts mid-flight.
    setTimeout(() => setJustSaved(false), 2000);
    textareaRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter (and IME composition) inserts a newline.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      save();
    }
  }

  return (
    <main className="flex flex-col min-h-[100dvh] w-full px-[var(--s-4)] pin-top">
      {/* Fragment count — prominent, top-right corner. */}
      <Link
        href="/week"
        className="absolute top-0 right-0 pin-top mt-[var(--s-4)] mr-[var(--s-4)] z-10 inline-flex items-center gap-[var(--s-2)] rounded-[var(--r-full)] border border-[var(--border)] bg-surface-raised px-[var(--s-5)] py-[var(--s-3)] text-[15px] font-medium min-h-[var(--tap)] [@media(hover:hover)]:hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <span className="text-accent font-semibold">{count}</span>
        <span className="text-muted">this week →</span>
      </Link>

      {/* Hero — Muse, big and clear, filling the upper page. */}
      <header className="w-full max-w-[620px] mx-auto pt-[var(--s-8)] pb-[var(--s-5)] text-center">
        <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(64px,20vw,140px)] leading-[0.95] tracking-[-0.02em]">
          Muse
        </h1>
        <p className="font-[family-name:var(--font-serif)] text-[clamp(22px,5vw,32px)] leading-[1.2] mt-[var(--s-5)] text-balance">
          {prompt}
        </p>
        <p className="text-muted text-[16px] mt-[var(--s-3)] max-w-[34ch] mx-auto">
          Doesn’t have to make sense. Half a thought is the whole point.
        </p>
      </header>

      {/* The composer — bottom third, thumb reach. One merged field. */}
      <div className="flex-1 flex flex-col justify-end pb-[var(--s-6)] w-full max-w-[620px] mx-auto">
        {justSaved && (
          <p
            className="text-[15px] text-accent font-medium text-center mb-[var(--s-3)] [@media(prefers-reduced-motion:no-preference)]:animate-[rise-away_1900ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
            role="status"
          >
            Caught. Sleep on it.
          </p>
        )}

        {/* The box stays mounted at all times — the mic must never be torn down mid-record.
            While listening, a calm overlay covers the box (no live transcript, per ENTRY-UX). */}
        <div className="flex flex-col gap-[var(--s-3)]">
          <div className="relative rounded-[var(--r-lg)] border border-[var(--border)] bg-surface-raised focus-within:[box-shadow:var(--glow)] transition-shadow">
            <label htmlFor="fragment" className="sr-only">
              Your fragment
            </label>
            <textarea
              ref={textareaRef}
              id="fragment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              rows={3}
              placeholder="Just say it out loud… or type it here."
              className="w-full min-h-[96px] max-h-[40dvh] text-[16px] leading-[1.5] bg-transparent px-[var(--s-4)] pt-[var(--s-4)] pb-[var(--s-8)] resize-none focus:outline-none"
            />
            {/* Controls INSIDE the box, bottom row — mic left, send right (Claude-style).
                z-20 keeps the mic/stop tappable above the listening overlay. */}
            <div className="absolute left-[var(--s-2)] right-[var(--s-2)] bottom-[var(--s-2)] z-20 flex items-center justify-between">
              <MicButton
                compact
                onTranscript={(t) => setText((prev) => (prev ? prev + " " + t : t))}
                onRecordingChange={setListening}
              />
              <button
                type="button"
                onClick={save}
                disabled={!text.trim()}
                aria-label="Send fragment"
                className="inline-flex items-center justify-center rounded-[var(--r-full)] bg-accent text-accent-on w-[var(--tap)] h-[var(--tap)] transition-transform active:scale-[0.94] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <span aria-hidden className="text-[20px] leading-none">↑</span>
              </button>
            </div>

            {/* Calm listening overlay — covers the box, hides the transcript. */}
            {listening && (
              <div className="absolute inset-0 z-10 rounded-[var(--r-lg)] bg-surface-raised flex flex-col items-center justify-center gap-[var(--s-2)] px-[var(--s-4)] pb-[var(--s-8)] text-center">
                <span className="text-accent [@media(prefers-reduced-motion:no-preference)]:animate-pulse">
                  <MicIcon className="w-[28px] h-[28px]" />
                </span>
                <p className="text-[18px] text-muted italic" role="status">
                  Listening… take your time. Ramble.
                </p>
              </div>
            )}
          </div>
          <p className="text-[13px] text-muted text-center">
            The more you drop in, the more it can show you at the week’s end.
          </p>
        </div>
      </div>
    </main>
  );
}
