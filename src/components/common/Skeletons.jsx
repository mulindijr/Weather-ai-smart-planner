import React from "react";

export function SkeletonBase({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-800/60 rounded-md ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={`glass-card p-5 rounded-xl space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <SkeletonBase className="h-5 w-1/3" />
        <SkeletonBase className="h-4 w-12" />
      </div>
      <div className="space-y-2">
        <SkeletonBase className="h-8 w-2/3" />
        <SkeletonBase className="h-4 w-1/2" />
      </div>
      <div className="pt-2">
        <SkeletonBase className="h-10 w-full" />
      </div>
    </div>
  );
}

export function HeroSkeleton({ className = "" }) {
  return (
    <div className={`glass-card p-6 rounded-xl space-y-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2.5 w-1/2">
          <SkeletonBase className="h-8 w-3/4" />
          <SkeletonBase className="h-4 w-1/2" />
        </div>
        <SkeletonBase className="h-16 w-16 rounded-full" />
      </div>
      <div className="flex items-baseline gap-2">
        <SkeletonBase className="h-16 w-32" />
        <SkeletonBase className="h-6 w-12" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/40">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1">
            <SkeletonBase className="h-3 w-12" />
            <SkeletonBase className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton({ className = "" }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card p-4 rounded-xl space-y-3">
          <SkeletonBase className="h-4 w-1/3" />
          <SkeletonBase className="h-7 w-2/3" />
          <SkeletonBase className="h-3.5 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function HourlySkeleton({ className = "" }) {
  return (
    <div className={`glass-card p-5 rounded-xl space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <SkeletonBase className="h-5 w-1/4" />
        <SkeletonBase className="h-4 w-16" />
      </div>
      <div className="flex gap-4 overflow-x-hidden pt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex-1 py-3 px-2 flex flex-col items-center gap-2 border border-slate-800/30 rounded-lg min-w-[70px]">
            <SkeletonBase className="h-3 w-10" />
            <SkeletonBase className="h-8 w-8 rounded-full" />
            <SkeletonBase className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DailySkeleton({ className = "" }) {
  return (
    <div className={`glass-card p-5 rounded-xl space-y-4 ${className}`}>
      <SkeletonBase className="h-5 w-1/3 mb-2" />
      <div className="space-y-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-850 last:border-0">
            <SkeletonBase className="h-4 w-16" />
            <SkeletonBase className="h-6 w-8 rounded-full" />
            <SkeletonBase className="h-4 w-1/4" />
            <SkeletonBase className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
