"use client";

import { useEffect, useRef, useState } from "react";

// Voice-in via the browser Web Speech API (no key, no cost). Recording state signalled by
// colour AND label AND pulse (never colour alone — DESIGN.md). Reduced-motion users get no pulse.

type SpeechRecognitionEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionErrorEvent = { error: string };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
};

// A universally recognisable microphone glyph (capsule + stand + base).
export function MicIcon({ className = "w-[22px] h-[22px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  return (
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition ||
    null
  );
}

function messageFor(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone blocked. Click the lock icon in the address bar → allow the mic, then try again.";
    case "no-speech":
      return "Didn’t catch anything — try speaking a little louder.";
    case "audio-capture":
      return "No microphone found. Check it’s connected.";
    case "network":
      return "Network hiccup reaching the speech service. Try again.";
    case "aborted":
      return "";
    default:
      return `Voice input error (${code}). Type below instead.`;
  }
}

export function MicButton({
  onTranscript,
  onRecordingChange,
  compact = false,
}: {
  onTranscript: (text: string) => void;
  onRecordingChange?: (recording: boolean) => void;
  compact?: boolean;
}) {
  const [recording, setRecordingState] = useState(false);
  const [supported, setSupported] = useState(true);
  const [notice, setNotice] = useState("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  function setRecording(value: boolean) {
    setRecordingState(value);
    onRecordingChange?.(value);
  }

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  async function start() {
    setNotice("");
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }

    // Ask for mic permission up front — clear prompt, clear failure — then release the
    // stream (SpeechRecognition opens its own).
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setNotice("Microphone blocked. Click the lock icon in the address bar → allow the mic, then try again.");
      return;
    }

    const rec = new Ctor();
    rec.lang = "en-GB";
    rec.interimResults = false; // final results only — no half-formed guesses streamed in
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (text) onTranscript(text);
      else setNotice("Didn’t catch that — try again.");
    };
    rec.onerror = (e) => {
      const msg = messageFor(e.error);
      if (msg) setNotice(msg);
      setRecording(false);
    };
    rec.onend = () => setRecording(false);

    recRef.current = rec;
    try {
      rec.start();
      setRecording(true);
    } catch {
      setNotice("Couldn’t start listening. Try again.");
      setRecording(false);
    }
  }

  function toggle() {
    if (recording) {
      recRef.current?.stop();
      return;
    }
    void start();
  }

  if (!supported) {
    if (compact) return null; // typing still works; don't clutter the composer
    return (
      <p className="text-[13px] text-muted text-center">
        Voice input isn’t available in this browser — type below instead.
      </p>
    );
  }

  // Compact recording: a small stop button in the composer (the page shows the "Listening…"
  // overlay, so this instance only needs to offer the stop action). Stays mounted throughout.
  if (recording && compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed
        aria-label="Stop recording"
        className="inline-flex items-center justify-center rounded-[var(--r-full)] w-[var(--tap)] h-[var(--tap)] bg-danger text-white transition-transform active:scale-[0.94] [@media(prefers-reduced-motion:no-preference)]:animate-pulse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <span aria-hidden className="text-[16px] leading-none">◼</span>
      </button>
    );
  }

  // Full recording: the standalone calm state (used where there's no composer overlay).
  if (recording) {
    return (
      <div className="flex flex-col gap-[var(--s-3)] w-full">
        <p className="text-[18px] text-muted text-center italic" role="status">
          Listening… take your time. Ramble.
        </p>
        <button
          type="button"
          onClick={toggle}
          aria-pressed
          aria-label="Stop recording"
          className="flex items-center justify-center gap-[var(--s-2)] w-full min-h-[var(--tap)] rounded-[var(--r-full)] font-medium bg-danger text-white transition-transform active:scale-[0.97] [@media(prefers-reduced-motion:no-preference)]:animate-pulse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span aria-hidden>◼</span>
          Done
        </button>
      </div>
    );
  }

  // Compact idle: an icon-only mic that lives inside the composer box.
  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label="Speak your fragment"
        title="Speak"
        className="inline-flex items-center justify-center rounded-[var(--r-full)] w-[var(--tap)] h-[var(--tap)] text-muted transition-colors active:scale-[0.94] [@media(hover:hover)]:hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <MicIcon />
      </button>
    );
  }

  // Full idle button (used where there's no composer, if ever).
  return (
    <div className="flex flex-col gap-[var(--s-2)]">
      <button
        type="button"
        onClick={toggle}
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
        aria-label="Start recording"
        className="flex items-center justify-center gap-[var(--s-2)] w-full min-h-[var(--tap)] rounded-[var(--r-full)] font-medium bg-accent text-accent-on transition-transform active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <span aria-hidden>●</span>
        Just say it out loud
      </button>
      {notice && (
        <p className="text-[13px] text-danger text-center" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
