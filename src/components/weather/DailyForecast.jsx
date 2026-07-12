import React from "react";
import Card from "../common/Card";
import { formatWeatherDate, getWeatherIcon } from "../../utils/weatherHelpers";
import { Calendar } from "lucide-react";

export default function DailyForecast({ weatherData }) {
  if (!weatherData || !weatherData.daily) return null;

  const dailyData = weatherData.daily;

  // Calculate global weekly min and max to normalize progress bars
  const allMins = dailyData.map((d) => d.temp_min);
  const allMaxs = dailyData.map((d) => d.temp_max);
  const minExtreme = Math.min(...allMins);
  const maxExtreme = Math.max(...allMaxs);
  const rangeExtreme = maxExtreme - minExtreme;

  const formatTemp = (val) => {
    return `${Math.round(val)}°`;
  };

  return (
    <Card
      title={`${dailyData.length}-Day Forecast`}
      subtitle={dailyData.length === 1 ? "Detailed daily temperature range and weather condition" : "Detailed daily temperature ranges and weather conditions"}
      headerAction={
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>{dailyData.length === 1 ? "Daily Outlook" : dailyData.length === 14 ? "Extended Outlook" : "Forecast Outlook"}</span>
        </div>
      }
      className="col-span-12 lg:col-span-6"
    >
      <div className="space-y-4">
        {dailyData.map((day, idx) => {
          const isToday = idx === 0;
          const dayName = formatWeatherDate(day.date);
          const icon = getWeatherIcon(day.weathercode, 22);
          const minVal = day.temp_min;
          const maxVal = day.temp_max;
          
          // Calculate percentage offsets for Apple-style temperature range bar
          const leftPercent = rangeExtreme > 0 ? ((minVal - minExtreme) / rangeExtreme) * 100 : 0;
          const widthPercent = rangeExtreme > 0 ? ((maxVal - minVal) / rangeExtreme) * 100 : 100;

          const hasRain = day.precipitation > 0;

          return (
            <div
              key={day.date}
              className={`flex items-center justify-between gap-4 py-3 border-b border-slate-850/30 last:border-0 last:pb-0 ${
                isToday ? "bg-indigo-650/5 -mx-3 px-3 rounded-lg border border-indigo-500/10" : ""
              }`}
            >
              {/* Day Name */}
              <div className="w-24 shrink-0">
                <span className={`text-sm font-semibold block ${
                  isToday ? "text-indigo-400 font-bold" : "text-slate-200"
                }`}>
                  {dayName}
                </span>
              </div>

              {/* Icon and Rain probability */}
              <div className="w-14 flex items-center gap-1.5 shrink-0 justify-center">
                <div className="shrink-0">{icon}</div>
                {hasRain ? (
                  <span className="text-[10px] font-bold text-sky-400 flex items-center shrink-0">
                    {Math.round(day.precipitation * 10) / 10}m
                  </span>
                ) : null}
              </div>

              {/* Minimum Temperature */}
              <div className="w-8 text-right shrink-0">
                <span className="text-xs font-semibold text-slate-400">
                  {formatTemp(minVal)}
                </span>
              </div>

              {/* Range Bar */}
              <div className="flex-1 min-w-[60px] h-2 bg-slate-800/80 rounded-full relative overflow-hidden border border-slate-700/25">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 absolute"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>

              {/* Maximum Temperature */}
              <div className="w-8 text-right shrink-0">
                <span className="text-sm font-bold text-slate-200">
                  {formatTemp(maxVal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
