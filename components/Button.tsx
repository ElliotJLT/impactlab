"use client";

import type { ButtonHTMLAttributes } from "react";

// DESIGN.md Button: tap-height, pill radius, accent, :active scale, hover guarded.
export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--r-full)] px-[var(--s-5)] " +
    "text-[17px] font-medium min-h-[56px] transition-transform active:scale-[0.97] " +
    "disabled:opacity-50 disabled:pointer-events-none " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] " +
    "[@media(hover:hover)]:hover:brightness-95";
  // Primary is lit from the top by --accent-grad; both ends are AA-verified against
  // --accent-on, so don't swap the fill for a lighter one without recomputing.
  const variants = {
    primary: "cta-grad text-accent-on [box-shadow:0_8px_28px_-12px_var(--accent)]",
    ghost: "bg-transparent text-accent border border-[var(--border)]",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
