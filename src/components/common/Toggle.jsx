import React from "react";
import { motion } from "framer-motion";

export default function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  ...props
}) {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      onClick={handleToggle}
      {...props}
    >
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-indigo-500 border border-slate-700/50 ${
          checked ? "bg-indigo-600" : "bg-slate-800"
        }`}
      >
        <motion.div
          className="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors">
          {label}
        </span>
      )}
    </div>
  );
}
