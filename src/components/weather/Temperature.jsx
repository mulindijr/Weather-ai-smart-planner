import React from "react";
import Card from "../common/Card";
import Toggle from "../common/Toggle";
import { useWeatherSettings } from "../../context/WeatherSettingsContext";
import { Thermometer, ChevronsUp, ChevronsDown, Activity } from "lucide-react";

export default function Temperature({ weatherData }) {
  const { settings, setSettings } = useWeatherSettings();

  if (!weatherData) return null;

  const current = weatherData.current || {};
  const daily = weatherData.daily?.[0] || {};
  const temp = current.temperature || 0;
  const max = daily.temp_max || 0;
  const min = daily.temp_min || 0;

  const isFahrenheit = settings.units === "imperial";

  const handleUnitChange = (checked) => {
    setSettings((prev) => ({
      ...prev,
      units: checked ? "imperial" : "metric",
    }));
  };

  const getOppositeUnitValue = (celsiusVal) => {
    if (isFahrenheit) {
      // Current is F, convert Celsius to C
      return `${Math.round(celsiusVal)}°C`;
    } else {
      // Current is C, convert Celsius to F
      return `${Math.round((celsiusVal * 9) / 5 + 32)}°F`;
    }
  };

  return (
    <Card
      title="Temperature Analytics"
      subtitle="Unit toggling, thermal statistics, and ranges"
      headerAction={
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Fahrenheit</span>
          <Toggle
            checked={isFahrenheit}
            onChange={handleUnitChange}
          />
        </div>
      }
      className="col-span-12 md:col-span-6 lg:col-span-4"
    >
      <div className="space-y-4">
        {/* Core numbers */}
        <div className="flex justify-between items-center py-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Thermometer className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Equivalent Value</span>
              <span className="text-sm font-semibold text-slate-350 block">
                {getOppositeUnitValue(isFahrenheit ? (temp - 32) * 5 / 9 : temp)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
              <Activity className="h-3 w-3" />
              <span>Stable</span>
            </span>
          </div>
        </div>

        {/* Max / Min Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 shrink-0">
              <ChevronsUp className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block leading-none">Max Today</span>
              <span className="text-sm font-bold text-slate-200 mt-1 block leading-none">
                {Math.round(max)}°{isFahrenheit ? "F" : "C"}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-sky-500/10 text-sky-400 shrink-0">
              <ChevronsDown className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block leading-none">Min Today</span>
              <span className="text-sm font-bold text-slate-200 mt-1 block leading-none">
                {Math.round(min)}°{isFahrenheit ? "F" : "C"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
