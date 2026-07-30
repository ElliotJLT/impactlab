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
    "text-[16px] font-medium min-h-[var(--tap)] transition-transform active:scale-[0.97] " +
    "disabled:opacity-50 disabled:pointer-events-none " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] " +
    "[@media(hover:hover)]:hover:brightness-95";
  const variants = {
    primary: "bg-accent text-accent-on",
    ghost: "bg-transparent text-accent border border-[var(--border)]",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
