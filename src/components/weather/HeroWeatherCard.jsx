import React from "react";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";
import { getWeatherCondition, getWeatherIcon, formatWeatherDate } from "../../utils/weatherHelpers";
import Card from "../common/Card";
import { MapPin, Navigation, Wind as WindIcon } from "lucide-react";

export default function HeroWeatherCard({ weatherData }) {
  const { location, settings } = useWeatherSettings();
  
  if (!weatherData) return null;

  const current = weatherData.current || {};
  const daily = weatherData.daily?.[0] || {};
  const code = current.weathercode !== undefined ? current.weathercode : 0;
  const cond = getWeatherCondition(code);

  const formatTemp = (val) => {
    if (val === undefined || val === null) return "--";
    const unit = settings.units === "imperial" ? "°F" : "°C";
    return `${Math.round(val)}${unit}`;
  };

  const formattedDate = formatWeatherDate(current.time);

  return (
    <Card 
      className={`relative overflow-hidden border-indigo-500/10 ${cond.bgImage} shadow-2xl`}
      contentClassName="relative z-10 p-6 md:p-8"
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
        {/* Main Temperature and Location Info */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold tracking-wider text-xs uppercase bg-indigo-500/10 px-3 py-1 rounded-full w-fit border border-indigo-500/20">
            <Navigation className="h-3 w-3 animate-pulse" />
            <span>Live Forecast</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 flex items-center gap-2 tracking-tight">
              {location.city || "Current Location"}
            </h2>
            {location.region && (
              <p className="text-sm text-slate-400 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>{location.region}, {location.country}</span>
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-4 pt-2">
            <span className="text-6xl md:text-7xl font-black text-white tracking-tighter text-gradient">
              {formatTemp(current.temperature)}
            </span>
            <div className="space-y-1">
              <span className={`text-xl font-bold ${cond.accent} block`}>
                {cond.text}
              </span>
              <span className="text-xs text-slate-400 block font-medium">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Big Weather Icon and Daily High/Low Info */}
        <div className="md:col-span-5 flex flex-col items-center md:items-end justify-center md:border-l md:border-slate-800/40 md:pl-8">
          <div className="relative group mb-3">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              {getWeatherIcon(code, 96, "drop-shadow-[0_8px_16px_rgba(99,102,241,0.25)]", current.is_day === 1)}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 w-full mt-4 pt-4 border-t border-slate-800/40 text-center md:text-right">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">High</span>
              <span className="text-sm font-semibold text-slate-200 block mt-0.5">{formatTemp(daily.temp_max)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Low</span>
              <span className="text-sm font-semibold text-slate-200 block mt-0.5">{formatTemp(daily.temp_min)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Wind</span>
              <span className="text-sm font-semibold text-slate-200 block mt-0.5 flex items-center justify-center md:justify-end gap-1 mt-0.5">
                <WindIcon className="h-3 w-3 text-slate-400" />
                <span>{current.windspeed} m/s</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
