import React from "react";
import { AlertCircle, FileQuestion, RefreshCw } from "lucide-react";
import Button from "./Button";

export function ErrorState({
  title = "An error occurred",
  message = "Failed to fetch data. Please try again later.",
  onRetry,
  icon: Icon = AlertCircle,
  className = "",
  ...props
}) {
  return (
    <div
      className={`glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center max-w-md mx-auto ${className}`}
      {...props}
    >
      <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 glow-rose">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          icon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Retry request
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "No data available",
  message = "We couldn't find any data to display here.",
  action,
  icon: Icon = FileQuestion,
  className = "",
  ...props
}) {
  return (
    <div
      className={`glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center max-w-md mx-auto ${className}`}
      {...props}
    >
      <div className="h-12 w-12 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
        {message}
      </p>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
