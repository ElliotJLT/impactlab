"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MicButton } from "@/components/MicButton";
import { BottomBar } from "@/components/BottomBar";
import { Button } from "@/components/Button";
import { appendNote, loadArchive, visitPrompt, FIRST_INVITATION } from "@/lib/fragments";

// Capture — the daily home screen. One job: get a half-thought spoken out loud, at
// length. Layout and copy follow docs/ENTRY-UX.md: invitation above the box, worked
// example BELOW it (permission, not instruction), mic as the primary action in the
// bottom third. The transcript stays hidden until Done — no live mirror.
export default function CapturePage() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const [prompt, setPrompt] = useState(FIRST_INVITATION);
  const [justSaved, setJustSaved] = useState(false);
  const [listening, setListening] = useState(false);

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
    setTimeout(() => setJustSaved(false), 1600);
  }

  return (
    <main className="flex flex-col min-h-[100dvh] w-full px-[var(--s-4)] pin-top">
      <header className="w-full max-w-[560px] mx-auto pt-[var(--s-5)] pb-[var(--s-4)] text-center">
        <p className="font-[family-name:var(--font-serif)] text-[19px] text-muted">Muse</p>
        <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(32px,8vw,44px)] leading-[1.15] mt-[var(--s-3)]">
          {prompt}
        </h1>
        <p className="text-muted text-[16px] mt-[var(--s-2)] max-w-[32ch] mx-auto">
          Doesn’t have to make sense. Half a thought is the whole point.
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-start gap-[var(--s-4)] pb-[240px] w-full max-w-[560px] mx-auto">
        {/* Hidden while listening — ENTRY-UX.md: the transcript appears after Done,
            editable, never streamed while speaking. */}
        {!listening && (
          <>
            <label htmlFor="fragment" className="sr-only">
              Your fragment
            </label>
            <textarea
              id="fragment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Or type it, if you’d rather."
              className="w-full min-h-[120px] text-[16px] rounded-[var(--r-md)] border border-[var(--border)] bg-surface-raised p-[var(--s-4)] resize-none focus:outline-none focus:[box-shadow:var(--glow)]"
            />
            {justSaved && (
              <p className="text-[13px] text-accent font-medium" role="status">
                Caught. It’ll be here when you come back.
              </p>
            )}
            <div className="flex flex-col gap-[var(--s-1)]">
              <Link
                href="/week"
                className="text-[13px] text-muted underline underline-offset-4 self-start"
              >
                {count} fragment{count === 1 ? "" : "s"} this week →
              </Link>
              <p className="text-[13px] text-muted">
                The more you drop in, the more it can show you at the week’s end.
              </p>
            </div>

            {/* The worked example — below the box so it reads as permission, not
                instruction. Deliberately incoherent; that's the register we want. */}
            <aside className="mt-[var(--s-3)] border-t border-[var(--border)] pt-[var(--s-4)] flex flex-col gap-[var(--s-2)]">
              <p className="text-[13px] text-muted italic">Someone dropped this in yesterday:</p>
              <p className="font-[family-name:var(--font-mono)] text-[14px] leading-[1.5] text-muted">
                “the empty chair at the diner... dunno, it just stuck with me. and the way my
                dad went quiet when the news came on. not connected, probably.”
              </p>
              <p className="text-[13px] text-muted italic">↳ That’s it. That’s a good one.</p>
            </aside>
          </>
        )}
      </div>

      <BottomBar>
        <div className="flex flex-col gap-[var(--s-3)]">
          <MicButton
            onTranscript={(t) => setText((prev) => (prev ? prev + " " + t : t))}
            onRecordingChange={setListening}
          />
          {!listening && text.trim() && (
            <Button onClick={save}>Save fragment</Button>
          )}
        </div>
      </BottomBar>
    </main>
  );
}
