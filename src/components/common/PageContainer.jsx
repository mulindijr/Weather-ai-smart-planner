import React from "react";

export function PageContainer({
  children,
  title,
  description,
  headerAction,
  className = "",
  ...props
}) {
  return (
    <div
      className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 ${className}`}
      {...props}
    >
      {/* Page Header */}
      {(title || description || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/40 pb-5">
          <div className="space-y-1">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 leading-none text-gradient">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm text-slate-400">
                {description}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0 flex items-center gap-3">{headerAction}</div>}
        </div>
      )}

      {/* Page Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}

export function Section({
  children,
  title,
  subtitle,
  headerAction,
  className = "",
  ...props
}) {
  return (
    <section className={`space-y-4 ${className}`} {...props}>
      {/* Section Header */}
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-slate-200">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {/* Section Content */}
      <div className="w-full">{children}</div>
    </section>
  );
}
