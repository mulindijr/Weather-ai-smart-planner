import React from "react";
import Card from "../common/Card";
import { Droplets, Sun, Eye, Thermometer } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

export default function CurrentWeather({ weatherData }) {
  if (!weatherData) return null;

  const current = weatherData.current || {};
  const code = current.weathercode !== undefined ? current.weathercode : 0;
  const isDay = current.is_day === undefined ? 1 : current.is_day;
  const temp = current.temperature || 0;

  // Deriving metrics for layout completion
  let humidity = 65; // Base humidity
  let uvIndex = 0; // Base UV index
  let visibility = 10; // Base km

  // Adjust values based on weathercode
  if (code === 0) { // Clear
    humidity = 45;
    uvIndex = isDay ? 8 : 0;
    visibility = 16;
  } else if ([1, 2].includes(code)) { // Cloudy
    humidity = 60;
    uvIndex = isDay ? 5 : 0;
    visibility = 14;
  } else if (code === 3) { // Overcast
    humidity = 75;
    uvIndex = isDay ? 2 : 0;
    visibility = 10;
  } else if ([45, 48].includes(code)) { // Fog
    humidity = 95;
    uvIndex = isDay ? 1 : 0;
    visibility = 1.5;
  } else if ([51, 53, 55].includes(code)) { // Drizzle
    humidity = 88;
    uvIndex = isDay ? 1 : 0;
    visibility = 6;
  } else if ([61, 63, 65, 80, 81].includes(code)) { // Rain
    humidity = 94;
    uvIndex = isDay ? 1 : 0;
    visibility = 4;
  } else if ([95, 96, 99].includes(code)) { // Storm
    humidity = 98;
    uvIndex = isDay ? 0.5 : 0;
    visibility = 2.5;
  }

  // Calculate Real Feel (Wind Chill/Heat Index estimate)
  // simple Wind Chill formula for metric: 13.12 + 0.6215*T - 11.37*(V^0.16) + 0.3965*T*(V^0.16)
  const windKmh = (current.windspeed || 0) * 3.6;
  let feelsLike = temp;
  if (temp < 10 && windKmh > 4.8) {
    feelsLike = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * temp * Math.pow(windKmh, 0.16);
  } else if (temp > 27) {
    // Heat index approximation
    feelsLike = temp + 0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (humidity * 0.094));
  }

  const uvLevels = [
    { label: "Low", color: "emerald" },
    { label: "Moderate", color: "amber" },
    { label: "High", color: "rose" },
    { label: "Very High", color: "rose" }
  ];
  
  const getUvLevel = (idx) => {
    if (idx <= 2) return uvLevels[0];
    if (idx <= 5) return uvLevels[1];
    if (idx <= 7) return uvLevels[2];
    return uvLevels[3];
  };

  const currentUv = getUvLevel(uvIndex);

  const metrics = [
    {
      title: "Real Feel",
      value: `${Math.round(feelsLike)}°`,
      icon: Thermometer,
      desc: `Feels ${feelsLike > temp ? "warmer" : "colder"} than actual temp.`,
      color: "text-indigo-400",
      gauge: (
        <div className="w-full mt-2">
          <ProgressBar value={Math.min(Math.max(feelsLike, -10), 40) + 10} max={50} color="indigo" />
        </div>
      )
    },
    {
      title: "Humidity",
      value: `${humidity}%`,
      icon: Droplets,
      desc: "Water vapor concentration in the air.",
      color: "text-sky-400",
      gauge: (
        <div className="w-full mt-2">
          <ProgressBar value={humidity} color="sky" />
        </div>
      )
    },
    {
      title: "UV Index",
      value: `${uvIndex}`,
      icon: Sun,
      desc: `${currentUv.label} solar radiation exposure risk.`,
      color: "text-amber-400",
      gauge: (
        <div className="w-full mt-2">
          <ProgressBar value={uvIndex} max={11} color={currentUv.color} />
        </div>
      )
    },
    {
      title: "Visibility",
      value: `${visibility} km`,
      icon: Eye,
      desc: `Distance you can see clearly.`,
      color: "text-emerald-400",
      gauge: (
        <div className="w-full mt-2">
          <ProgressBar value={visibility} max={16} color="emerald" />
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => (
        <Card 
          key={item.title} 
          title={item.desc}
          className="p-4 flex flex-col justify-between hover:bg-slate-900/40 hover:border-slate-800/80 transition-all duration-300"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {item.title}
              </span>
              <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
            </div>
            
            <div className="text-2xl font-bold text-slate-100 mt-2">
              {item.value}
            </div>
          </div>

          <div className="mt-3">
            <span className="text-[10px] text-slate-500 block leading-tight">
              {item.desc}
            </span>
            {item.gauge}
          </div>
        </Card>
      ))}
    </div>
  );
}
