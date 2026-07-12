import React from "react";
import Card from "../common/Card";
import { Wind as WindIcon, ArrowUp } from "lucide-react";
import { getWindDirectionName } from "../../utils/weatherHelpers";
import { motion } from "framer-motion";

export default function Wind({ weatherData }) {
  if (!weatherData) return null;

  const current = weatherData.current || {};
  const speed = current.windspeed || 0;
  const direction = current.winddirection || 0;
  const dirName = getWindDirectionName(direction);

  // Derived gust estimates
  const gust = Math.round(speed * 1.35 * 10) / 10;

  return (
    <Card
      title="Wind Conditions"
      subtitle="Speed, gust measurements, and directions"
      className="col-span-12 md:col-span-6 lg:col-span-4"
    >
      <div className="flex items-center justify-between gap-6 py-2">
        {/* Statistics Text */}
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wind Speed</span>
            <span className="text-3xl font-black text-slate-100 block tracking-tight">
              {speed} <span className="text-sm font-medium text-slate-400">m/s</span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wind Gusts</span>
            <span className="text-lg font-bold text-slate-350 block">
              {gust} <span className="text-xs font-medium text-slate-500">m/s</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Blowing from <span className="text-indigo-400 font-bold">{dirName}</span> ({direction}°)
          </div>
        </div>

        {/* Visual Animated Compass */}
        <div className="relative h-28 w-28 shrink-0 flex items-center justify-center bg-slate-900/50 rounded-full border border-slate-800 shadow-inner">
          {/* Compass labels */}
          <span className="absolute top-1 text-[9px] font-bold text-slate-500">N</span>
          <span className="absolute right-1.5 text-[9px] font-bold text-slate-500">E</span>
          <span className="absolute bottom-1 text-[9px] font-bold text-slate-500">S</span>
          <span className="absolute left-1.5 text-[9px] font-bold text-slate-500">W</span>

          {/* Compass dial markings */}
          <div className="absolute inset-2 border border-dashed border-slate-800/40 rounded-full" />

          {/* Rotating Compass Arrow Needle */}
          <motion.div
            className="h-full w-full absolute flex items-center justify-center pointer-events-none"
            initial={{ rotate: 0 }}
            animate={{ rotate: direction }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            {/* The Arrow */}
            <div className="h-10 w-2 flex flex-col items-center relative">
              <ArrowUp className="h-5 w-5 text-indigo-400 absolute -top-2.5" />
              <div className="h-6 w-0.5 bg-indigo-500/60 rounded" />
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 border border-slate-950 absolute top-[18px]" />
            </div>
          </motion.div>
          
          <WindIcon className="h-5 w-5 text-slate-600/70" />
        </div>
      </div>
    </Card>
  );
}
