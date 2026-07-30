"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { loadFragments, PRACTICE } from "@/lib/fragments";
import type { WeeklyRead } from "@/lib/prompt";

// Read — the payoff. Calls the weekly-read API and renders the buried thread against the
// stated subject. This is the screen the whole app exists to reach.
export default function ReadPage() {
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [report, setReport] = useState<WeeklyRead | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fragments = loadFragments();
    fetch("/api/weekly-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ practice: PRACTICE, fragments }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong.");
        setReport(data as WeeklyRead);
        setState("done");
      })
      .catch((e) => {
        setError(e.message);
        setState("error");
      });
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] w-full px-[var(--s-4)] pin-top pb-[var(--s-7)] [&>*]:w-full [&>*]:max-w-[560px] [&>*]:mx-auto">
      <header className="pt-[var(--s-5)] pb-[var(--s-4)] relative text-center">
        <Link href="/week" className="absolute left-0 top-[var(--s-5)] text-[13px] text-muted underline underline-offset-4">
          ← week
        </Link>
        <h1 className="text-[clamp(26px,5.5vw,36px)] font-[family-name:var(--font-serif)] leading-[1.15] px-[var(--s-7)]">This week, you kept circling…</h1>
      </header>

      {state === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-[var(--s-3)] text-center">
          <div className="[@media(prefers-reduced-motion:no-preference)]:animate-pulse text-[19px] text-muted">
            Reading your week…
          </div>
          <p className="text-[13px] text-muted max-w-[240px]">
            Looking for the thread you keep returning to — not the one you meant to.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-[var(--s-3)] text-center">
          <p className="text-danger text-[16px]">{error}</p>
          <Link href="/read" className="text-accent underline underline-offset-4">
            Try again
          </Link>
        </div>
      )}

      {state === "done" && report && <Report report={report} />}
    </main>
  );
}

function Report({ report }: { report: WeeklyRead }) {
  const buried = report.threads.find((t) => t.kind === "buried") ?? report.threads[0];
  const stated = report.threads.find((t) => t.kind === "stated");

  return (
    <div className="flex flex-col gap-[var(--s-4)]">
      {/* The two-line frame — the whole "oh" at a glance. */}
      <Card>
        <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-muted">
          You say it’s about
        </p>
        <p className="text-[19px] mb-[var(--s-4)]">{report.stated_subject}</p>
        <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-accent">
          You keep returning to
        </p>
        <p className="font-[family-name:var(--font-serif)] text-[24px] leading-[1.2]">
          {report.buried_thread}
        </p>
      </Card>

      {/* The reflection, in the person's own words. */}
      <Card>
        <p className="text-[16px] leading-[1.55]">{report.primary_reflection}</p>
      </Card>

      {/* Evidence: the buried thread's guises, then the stated subject for contrast. */}
      {buried && (
        <section>
          <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-muted mb-[var(--s-2)]">
            What you keep returning to — {buried.recurrence}× this week
          </p>
          <ul className="flex flex-col gap-[var(--s-2)]">
            {buried.guises.map((g, i) => (
              <li
                key={i}
                className="font-[family-name:var(--font-mono)] text-[14px] leading-[1.5] border-l-2 border-[var(--accent)] pl-[var(--s-3)]"
              >
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      {stated && (
        <section>
          <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-muted mb-[var(--s-2)]">
            What you meant it to be about — {stated.recurrence}×
          </p>
          <ul className="flex flex-col gap-[var(--s-2)]">
            {stated.guises.map((g, i) => (
              <li
                key={i}
                className="font-[family-name:var(--font-mono)] text-[14px] leading-[1.5] border-l-2 border-[var(--border)] pl-[var(--s-3)] text-muted"
              >
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[13px] text-muted text-center pt-[var(--s-2)]">
        Nocturne didn’t suggest anything. It only showed you what you already said.
      </p>
    </div>
  );
}
