// src/components/UI.jsx

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-pink-500 text-white hover:bg-pink-400",
    secondary: "bg-white/10 text-white hover:bg-white/15 border border-white/10",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur p-5 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-pink-500/40",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-white/10 text-white/80 border border-white/10",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Divider({ className = "" }) {
  return <div className={cn("h-px w-full bg-white/10", className)} />;
}
