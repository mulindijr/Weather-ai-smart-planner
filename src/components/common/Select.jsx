import React from "react";
import { ChevronDown } from "lucide-react";

export default function Select({
  value,
  onChange,
  options = [],
  label,
  disabled = false,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none bg-slate-900/60 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 cursor-pointer outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 pr-10 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
