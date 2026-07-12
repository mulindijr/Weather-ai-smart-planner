import React from "react";
import { 
  Sun, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudDrizzle, 
  CloudSnow, 
  CloudLightning, 
  CloudFog,
  Moon,
  CloudMoon
} from "lucide-react";

/**
 * Maps WMO code to human-readable condition text and Tailwind background styles.
 */
export const getWeatherCondition = (code) => {
  const codeInt = Number(code);
  
  if (codeInt === 0) {
    return {
      text: "Clear Sky",
      iconName: "Sun",
      gradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
      accent: "text-amber-400",
      themeColor: "amber",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20"
    };
  }
  if ([1, 2].includes(codeInt)) {
    return {
      text: "Partly Cloudy",
      iconName: "CloudSun",
      gradient: "from-sky-500/10 via-indigo-500/5 to-transparent",
      accent: "text-sky-400",
      themeColor: "sky",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900"
    };
  }
  if (codeInt === 3) {
    return {
      text: "Overcast",
      iconName: "Cloud",
      gradient: "from-slate-500/10 via-slate-650/5 to-transparent",
      accent: "text-slate-400",
      themeColor: "neutral",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900"
    };
  }
  if ([45, 48].includes(codeInt)) {
    return {
      text: "Foggy",
      iconName: "CloudFog",
      gradient: "from-zinc-550/10 via-transparent to-transparent",
      accent: "text-zinc-400",
      themeColor: "neutral",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900"
    };
  }
  if ([51, 53, 55, 56, 57].includes(codeInt)) {
    return {
      text: "Drizzle",
      iconName: "CloudDrizzle",
      gradient: "from-teal-500/10 via-teal-500/5 to-transparent",
      accent: "text-teal-400",
      themeColor: "teal",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/15"
    };
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codeInt)) {
    return {
      text: "Rainy",
      iconName: "CloudRain",
      gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
      accent: "text-blue-400",
      themeColor: "blue",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20"
    };
  }
  if ([71, 73, 75, 77, 85, 86].includes(codeInt)) {
    return {
      text: "Snowy",
      iconName: "CloudSnow",
      gradient: "from-sky-100/10 via-indigo-100/5 to-transparent",
      accent: "text-sky-200",
      themeColor: "indigo",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/10"
    };
  }
  if ([95, 96, 99].includes(codeInt)) {
    return {
      text: "Thunderstorm",
      iconName: "CloudLightning",
      gradient: "from-indigo-600/15 via-rose-600/5 to-transparent",
      accent: "text-indigo-400",
      themeColor: "indigo",
      bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30"
    };
  }

  return {
    text: "Unknown Condition",
    iconName: "Cloud",
    gradient: "from-slate-500/10 to-transparent",
    accent: "text-slate-400",
    themeColor: "neutral",
    bgImage: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900"
  };
};

/**
 * Returns the matching Lucide Icon component for the WMO code.
 */
export const getWeatherIcon = (code, size = 24, className = "", isDay = true) => {
  const { iconName } = getWeatherCondition(code);
  
  const iconProps = { size, className };
  
  switch (iconName) {
    case "Sun":
      if (!isDay) {
        return <Moon {...iconProps} className={`${className} text-indigo-200 fill-indigo-200/10`} />;
      }
      return <Sun {...iconProps} className={`${className} text-amber-400 fill-amber-400/10`} />;
    case "CloudSun":
      if (!isDay) {
        return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
      }
      return <CloudSun {...iconProps} className={`${className} text-sky-400`} />;
    case "Cloud":
      return <Cloud {...iconProps} className={`${className} text-slate-400`} />;
    case "CloudFog":
      return <CloudFog {...iconProps} className={`${className} text-slate-500`} />;
    case "CloudDrizzle":
      return <CloudDrizzle {...iconProps} className={`${className} text-teal-400`} />;
    case "CloudRain":
      return <CloudRain {...iconProps} className={`${className} text-blue-400`} />;
    case "CloudSnow":
      return <CloudSnow {...iconProps} className={`${className} text-indigo-200`} />;
    case "CloudLightning":
      return <CloudLightning {...iconProps} className={`${className} text-violet-400`} />;
    default:
      return <Cloud {...iconProps} />;
  }
};

/**
 * Formats date into readable strings e.g. "Tomorrow" or "Mon, Jul 12".
 */
export const formatWeatherDate = (dateStr) => {
  if (!dateStr) return "";
  
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats time from ISO format to local hour string (e.g. "11:00 PM" or "23:00").
 */
export const formatWeatherTime = (timeStr, format24h = false) => {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  
  if (format24h) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true
  });
};

/**
 * Maps wind direction degrees to compass directions.
 */
export const getWindDirectionName = (deg) => {
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
};
