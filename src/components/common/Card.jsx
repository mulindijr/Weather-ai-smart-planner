import React from "react";

export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  hoverable = false,
  glowColor = "none",
  className = "",
  contentClassName = "",
  ...props
}) {
  const glowClasses = {
    none: "",
    indigo: "glow-indigo border-indigo-500/20",
    blue: "glow-blue border-sky-500/20",
    emerald: "glow-emerald border-emerald-500/20",
  };

  const cardStyle = `glass-card rounded-xl overflow-hidden ${
    hoverable ? "glass-card-hover" : ""
  } ${glowClasses[glowColor] || ""} ${className}`;

  return (
    <div className={cardStyle} {...props}>
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-800/40 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="font-semibold text-slate-100 leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={`p-5 ${contentClassName}`}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-5 py-3.5 bg-slate-900/30 border-t border-slate-800/40 flex items-center justify-between gap-4">
          {footer}
        </div>
      )}
    </div>
  );
}
