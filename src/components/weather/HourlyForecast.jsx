import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import Card from "../common/Card";
import { formatWeatherTime, getWeatherIcon } from "../../utils/weatherHelpers";
import { CloudRain, Clock } from "lucide-react";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";

export default function HourlyForecast({ weatherData }) {
  const { settings } = useWeatherSettings();
  
  if (!weatherData || !weatherData.hourly) return null;

  // Take the first 24 hours for the hourly forecast display
  const hourlyData = weatherData.hourly.slice(0, 24);

  // Map data for Recharts
  const chartData = hourlyData.map((hour) => {
    return {
      time: formatWeatherTime(hour.time),
      temp: Math.round(hour.temp),
      precipitation: Math.round((hour.precipitation || 0) * 100) / 100, // keep 2 decimal places max
      code: hour.weathercode,
    };
  });

  const unit = settings.units === "imperial" ? "°F" : "°C";

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs text-slate-400 font-semibold mb-1.5">{data.time}</p>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>Temp: {data.temp}{unit}</span>
            </p>
            {data.precipitation > 0 && (
              <p className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <CloudRain className="h-3 w-3" />
                <span>Precip: {data.precipitation} mm</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title="Hourly Forecast" 
      subtitle="Temperature and precipitation trends over the next 24 hours"
      headerAction={
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md">
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span>24-Hour Timeline</span>
        </div>
      }
      className="col-span-12"
    >
      <div className="space-y-6">
        {/* Recharts Area Chart */}
        <div className="h-60 w-full bg-slate-950/20 rounded-xl p-3 border border-slate-900/40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#tempGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="precipitation" 
                stroke="#38bdf8" 
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#precipGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontally Scrollable Hour Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {hourlyData.map((hour, idx) => {
            const tempVal = Math.round(hour.temp);
            const timeVal = formatWeatherTime(hour.time);
            const hourDate = new Date(hour.time);
            const hourNum = hourDate.getHours();
            const isDay = hourNum >= 6 && hourNum < 18;
            const icon = getWeatherIcon(hour.weathercode, 20, "", isDay);
            const hasRain = hour.precipitation > 0;
            const isNow = idx === 0;

            return (
              <div
                key={hour.time}
                className={`flex flex-col items-center justify-between py-3 px-3.5 rounded-lg border text-center transition-all duration-300 min-w-[75px] ${
                  isNow
                    ? "bg-indigo-650/15 border-indigo-500/30 shadow-md shadow-indigo-600/5"
                    : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700/60"
                }`}
              >
                <span className={`text-[10px] font-semibold tracking-wider block ${
                  isNow ? "text-indigo-400 font-bold" : "text-slate-400"
                }`}>
                  {isNow ? "NOW" : timeVal}
                </span>

                <div className="my-2.5 shrink-0">
                  {icon}
                </div>

                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-100 block">
                    {tempVal}°
                  </span>
                  {hasRain ? (
                    <span className="text-[9px] text-sky-400 font-bold flex items-center justify-center gap-0.5">
                      <CloudRain className="h-2 w-2" />
                      <span>{Math.round(hour.precipitation * 10) / 10}m</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-600 font-medium block">
                      --
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
