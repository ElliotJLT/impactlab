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

export function MicButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [notice, setNotice] = useState("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);

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
    return (
      <p className="text-[13px] text-muted text-center">
        Voice input isn’t available in this browser — type below instead.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--s-2)]">
      <button
        type="button"
        onClick={toggle}
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
        aria-pressed={recording}
        aria-label={recording ? "Stop recording" : "Start recording"}
        className={
          "flex items-center justify-center gap-[var(--s-2)] w-full min-h-[var(--tap)] rounded-[var(--r-full)] " +
          "font-medium transition-transform active:scale-[0.97] " +
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] " +
          (recording
            ? "bg-danger text-white [@media(prefers-reduced-motion:no-preference)]:animate-pulse"
            : "bg-accent text-accent-on")
        }
      >
        <span aria-hidden>{recording ? "◼" : "●"}</span>
        {recording ? "Listening — tap to stop" : "Hold a thought — tap to speak"}
      </button>
      {notice && (
        <p className="text-[13px] text-danger text-center" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
