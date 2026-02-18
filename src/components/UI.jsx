// src/components/UI.jsx
import React from "react";

export function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/80 backdrop-blur border border-black/5 shadow-soft",
        "p-5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.99]";
  const styles = {
    primary:
      "bg-brand-tangerine text-white hover:opacity-95 shadow-soft",
    secondary:
      "bg-white text-brand-ink border border-black/10 hover:bg-black/5",
    ghost: "bg-transparent text-brand-ink hover:bg-black/5",
  };

  return (
    <button
      className={[base, styles[variant], className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ tone = "default", className = "", children }) {
  const tones = {
    default: "bg-black/5 text-brand-ink",
    success: "bg-emerald-500/15 text-emerald-700",
    warn: "bg-amber-500/15 text-amber-800",
    pink: "bg-brand-baby text-brand-ink",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm",
        "outline-none focus:ring-2 focus:ring-brand-sun/60 focus:border-brand-sun",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function Divider({ className = "" }) {
  return <div className={["h-px w-full bg-black/10", className].join(" ")} />;
}
