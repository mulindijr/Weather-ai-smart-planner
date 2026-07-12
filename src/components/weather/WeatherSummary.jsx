import React from "react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { Lock, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { useInsights } from "../../hooks/useWeatherQueries";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";

export default function WeatherSummary() {
  const { settings } = useWeatherSettings();
  const { data: insights, isLoading } = useInsights(settings.days || 7);

  // If the query is loading, show loading layout
  if (isLoading) {
    return (
      <Card
        title="AI Weather Assistant"
        subtitle="Analyzing patterns and planning recommendations"
        className="col-span-12 lg:col-span-4 border-indigo-500/10"
      >
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
      </Card>
    );
  }

  // If insights exist, render them
  if (insights && insights.summary) {
    return (
      <Card
        title="AI Weather Assistant"
        subtitle="Personalized observations & smart activity tips"
        headerAction={
          <Badge variant="primary" dot>
            AI Active
          </Badge>
        }
        className="col-span-12 lg:col-span-4 border-indigo-500/25 glow-indigo"
      >
        <div className="space-y-4">
          <div className="flex gap-3 items-start bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg text-indigo-300 text-xs">
            <Sparkles className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {insights.summary}
            </p>
          </div>
          
          {insights.recommendations && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Smart Suggestions</span>
              <ul className="space-y-1.5">
                {insights.recommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-slate-350 flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Fallback / 403 Forbidden / null: Render Pro Feature Lock
  const proFeatures = [
    "Smart travel planning recommendations",
    "Outdoor activities feasibility score index",
    "Thermal dress & gear advisor based on forecasts",
    "Precipitation & wind impact radar warning alarms",
  ];

  return (
    <Card
      title="AI Smart Travel Planner"
      subtitle="Unlock automated itinerary and activity scheduling"
      headerAction={
        <Badge variant="warning" className="flex items-center gap-0.5 font-bold">
          <Lock className="h-2.5 w-2.5" />
          <span>PRO LOCK</span>
        </Badge>
      }
      className="col-span-12 lg:col-span-4 border-slate-800/40 relative overflow-hidden"
    >
      {/* Decorative subtle visual lock overlay */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="h-11 w-11 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 shadow-md shadow-amber-500/5">
          <Lock className="h-5 w-5" />
        </div>

        <h4 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-1.5 justify-center">
          Upgrade to Pro Plan <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400/15" />
        </h4>
        <p className="text-[11px] text-slate-400 max-w-xs mb-4 leading-normal">
          AI insights, optimal attire suggestions and custom multi-day itinerary planners require a Pro account.
        </p>

        <Button
          variant="primary"
          size="sm"
          className="bg-indigo-650 hover:bg-indigo-600 text-xs font-semibold py-1.5 shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>Upgrade Account</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Mock container elements behind overlay for depth effect */}
      <div className="space-y-4 opacity-15 select-none pointer-events-none filter blur-[1px]">
        <div className="h-10 bg-slate-800 rounded w-full" />
        <div className="space-y-2">
          {proFeatures.map((feat, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="h-3.5 w-3.5 rounded-full bg-slate-700 shrink-0" />
              <div className="h-3.5 bg-slate-800 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
