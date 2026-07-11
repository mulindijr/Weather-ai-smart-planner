import { useQuery } from "@tanstack/react-query";
import {
  getWeatherGeo,
  getCurrentWeather,
  getWeather,
  getForecast,
  getHourlyForecast,
  getDailyForecast,
  getForecast14,
  getInsights,
} from "../api/weather";

import { useWeatherSettings } from "../context/WeatherSettingsContext";

// Auto-detect location & initial weather
export const useWeatherGeo = () => {
  return useQuery({
    queryKey: ["weather-geo"],
    queryFn: getWeatherGeo,
  });
};

// Current Weather
export const useCurrentWeather = () => {
  const { settings } = useWeatherSettings();

  return useQuery({
    queryKey: ["current-weather", settings],
    queryFn: () => getCurrentWeather(settings),
    enabled: !!settings.lat && !!settings.lon,
  });
};

// Weather
export const useWeather = () => {
  const { settings } = useWeatherSettings();

  return useQuery({
    queryKey: ["weather", settings],
    queryFn: () => getWeather(settings),
    enabled: !!settings.lat && !!settings.lon,
  });
};

// Forecast
export const useForecast = () => {
  const { settings } = useWeatherSettings();

  return useQuery({
    queryKey: ["forecast", settings],
    queryFn: () => getForecast(settings),
    enabled: !!settings.lat && !!settings.lon,
  });
};

// Hourly Forecast
export const useHourlyForecast = (days = 1) => {
  const { settings } = useWeatherSettings();

  return useQuery({
    queryKey: ["hourly-forecast", settings, days],
    queryFn: () =>
      getHourlyForecast({
        ...settings,
        days,
      }),
    enabled: !!settings.lat && !!settings.lon,
  });
};

// Daily Forecast
export const useDailyForecast = (days = 7) => {
  const { settings } = useWeatherSettings();

  return useQuery({
    queryKey: ["daily-forecast", settings, days],
    queryFn: () =>
      getDailyForecast({
        ...settings,
        days,
      }),
    enabled: !!settings.lat && !!settings.lon,
  });
};

// 14-Day Forecast (Pro)
export const useForecast14 = (days = 14) => {
  const { settings } = useWeatherSettings();

  return useQuery({
    queryKey: ["forecast14", settings, days],
    queryFn: () =>
      getForecast14({
        ...settings,
        days,
      }),
    enabled: !!settings.lat && !!settings.lon,
  });
};

// AI Insights (Pro)
export const useInsights = (days = 7) => {
  const { settings } = useWeatherSettings();

  return useQuery({
    queryKey: ["insights", settings, days],
    queryFn: () =>
      getInsights({
        ...settings,
        days,
      }),
    enabled: !!settings.lat && !!settings.lon,
  });
};
