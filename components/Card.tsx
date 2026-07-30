import type { HTMLAttributes } from "react";

// DESIGN.md Card: surface, 1px border (over shadow), large radius, s-5 padding.
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-surface border border-[var(--border)] rounded-[var(--r-lg)] p-[var(--s-5)] ${className}`}
      {...props}
    />
  );
}
