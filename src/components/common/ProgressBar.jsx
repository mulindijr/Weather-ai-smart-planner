import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({
  value,
  max = 100,
  label,
  info,
  color = "indigo",
  size = "sm",
  className = "",
  ...props
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    sky: "bg-sky-400",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  };

  const sizes = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const currentColor = colors[color] || colors.indigo;
  const currentSize = sizes[size] || sizes.sm;

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Label and Info */}
      {(label || info) && (
        <div className="flex items-center justify-between gap-4 mb-1.5 text-xs text-slate-400 font-medium">
          {label && <span>{label}</span>}
          {info && <span className="text-slate-200">{info}</span>}
        </div>
      )}

      {/* Progress Track */}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/20 ${currentSize}`}>
        <motion.div
          className={`h-full rounded-full ${currentColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
