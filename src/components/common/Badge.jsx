import React from "react";

export default function Badge({
  children,
  variant = "primary",
  dot = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
    success: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    error: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    info: "bg-sky-500/10 text-sky-300 border border-sky-500/20",
    neutral: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
  };

  const dots = {
    primary: "bg-indigo-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-rose-400",
    info: "bg-sky-400",
    neutral: "bg-slate-400",
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentDot = dots[variant] || dots.primary;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${currentVariant} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentDot}`} />
      )}
      {children}
    </span>
  );
}
