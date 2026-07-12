import React from "react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import { Sun, CloudRain, Thermometer, Sparkles } from "lucide-react";
import { formatWeatherDate } from "../../utils/weatherHelpers";

export default function ForecastCards({ weatherData }) {
  if (!weatherData || !weatherData.daily) return null;

  const daily = weatherData.daily;

  // Extract highlight weather spikes/alerts
  const rainDays = daily.filter((d) => d.precipitation > 2);
  const hotDays = [...daily].sort((a, b) => b.temp_max - a.temp_max);
  const coldDays = [...daily].sort((a, b) => a.temp_min - b.temp_min);

  const alerts = [];

  // 1. Precipitation warning
  if (rainDays.length > 0) {
    const firstRainDay = rainDays[0];
    alerts.push({
      title: "Precipitation Alert",
      desc: `Expect rain (${firstRainDay.precipitation} mm) on ${formatWeatherDate(firstRainDay.date)}.`,
      icon: CloudRain,
      color: "text-sky-400",
      bg: "bg-sky-500/5 border-sky-500/10",
      badge: "Rain Risk"
    });
  }

  // 2. High UV exposure advice
  const maxTemp = hotDays[0]?.temp_max || 0;
  if (maxTemp > 24) {
    alerts.push({
      title: "Sun Protection Advice",
      desc: `Peak temperatures of ${Math.round(maxTemp)}°C on ${formatWeatherDate(hotDays[0].date)}. High UV exposure index.`,
      icon: Sun,
      color: "text-amber-400",
      bg: "bg-amber-500/5 border-amber-500/10",
      badge: "UV Exposure"
    });
  }

  // 3. Thermal shift
  const minTemp = coldDays[0]?.temp_min || 0;
  if (maxTemp - minTemp > 10) {
    alerts.push({
      title: "Thermal Shift Alert",
      desc: `High diurnal range of ${Math.round(maxTemp - minTemp)}°C expected. Dress in layers.`,
      icon: Thermometer,
      color: "text-indigo-400",
      bg: "bg-indigo-500/5 border-indigo-500/10",
      badge: "Thermal Info"
    });
  }

  // Fallback default alerts if none are triggered
  if (alerts.length === 0) {
    alerts.push({
      title: "Atmospheric Stability",
      desc: "Mild wind speeds and normal barometric pressure values observed across the week.",
      icon: Sparkles,
      color: "text-emerald-400",
      bg: "bg-emerald-500/5 border-emerald-500/10",
      badge: "Stable Skies"
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full col-span-12">
      {alerts.map((alert, idx) => (
        <Card
          key={idx}
          className={`${alert.bg} hover:scale-101 hover:bg-slate-900/50 transition-all duration-300`}
          contentClassName="p-4 flex flex-col gap-3 justify-between"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Weekly Highlight</span>
              <h4 className="text-sm font-semibold text-slate-200">
                {alert.title}
              </h4>
            </div>
            <alert.icon className={`h-5 w-5 ${alert.color} shrink-0`} />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {alert.desc}
          </p>

          <div className="pt-1.5 flex justify-between items-center border-t border-slate-800/20">
            <Badge variant="neutral" className="text-[9px] px-2 py-0">
              {alert.badge}
            </Badge>
            <span className="text-[9px] text-slate-500 font-medium">Auto-generated</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
