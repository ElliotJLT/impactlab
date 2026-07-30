import type { HTMLAttributes } from "react";

// DESIGN.md Bottom action bar: fixed to the edge, safe-area padded, holds the primary
// action. Carries the canvas colour with a gradient scrim above it, so content behind
// dissolves into the bar rather than hitting a hard rule.
export function BottomBar({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 pin-bottom bg-bg px-[var(--s-4)] pt-[var(--s-4)] ${className}`}
      {...props}
    >
      <div aria-hidden className="bar-scrim" />
      <div className="mx-auto w-full max-w-[560px]">{children}</div>
    </div>
  );
}
