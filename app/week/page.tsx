"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { BottomBar } from "@/components/BottomBar";
import { loadFragments } from "@/lib/fragments";
import type { Fragment } from "@/lib/prompt";

// Week — the raw material, timestamped. Deliberately plain: this screen just shows what's
// been caught. The meaning is one tap away, on /read.
export default function WeekPage() {
  const [fragments, setFragments] = useState<Fragment[]>([]);

  useEffect(() => {
    setFragments(loadFragments());
  }, []);

  return (
    <main className="flex flex-col min-h-[100dvh] w-full px-[var(--s-4)] pin-top">
      <header className="w-full max-w-[560px] mx-auto pt-[var(--s-5)] pb-[var(--s-4)] relative text-center">
        <Link href="/" className="absolute left-0 top-[var(--s-5)] text-[13px] text-muted underline underline-offset-4">
          ← capture
        </Link>
        <h1 className="text-[clamp(28px,6vw,40px)] font-[family-name:var(--font-serif)] leading-[1.1]">Your week</h1>
      </header>

      <div className="flex-1 flex flex-col gap-[var(--s-3)] pb-[120px] w-full max-w-[560px] mx-auto">
        {fragments.map((f, i) => (
          <Card key={i} className="!p-[var(--s-4)]">
            <p className="text-[13px] font-medium tracking-[0.02em] uppercase text-muted mb-[var(--s-1)]">
              {f.ts}
            </p>
            <p className="text-[16px]">{f.text}</p>
          </Card>
        ))}
      </div>

      <BottomBar>
        <Link href="/read" className="block">
          <Button className="w-full">Read my week</Button>
        </Link>
      </BottomBar>
    </main>
  );
}
