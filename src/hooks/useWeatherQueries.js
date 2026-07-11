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

// Auto-detect location & initial weather
export const useWeatherGeo = (options = {}) => {
  return useQuery({
    queryKey: ["weather-geo", options],
    queryFn: () => getWeatherGeo(options),
  });
};

// Current Weather
export const useCurrentWeather = (options = {}) => {
  return useQuery({
    queryKey: ["current-weather", options],
    queryFn: () => getCurrentWeather(options),
    enabled: !!options.lat && !!options.lon,
  });
};

// Weather
export const useWeather = (options = {}) => {
  return useQuery({
    queryKey: ["weather", options],
    queryFn: () => getWeather(options),
    enabled: !!options.lat && !!options.lon,
  });
};

// Forecast
export const useForecast = (options = {}) => {
  return useQuery({
    queryKey: ["forecast", options],
    queryFn: () => getForecast(options),
    enabled: !!options.lat && !!options.lon,
  });
};

// Hourly Forecast
export const useHourlyForecast = (options = {}) => {
  return useQuery({
    queryKey: ["hourly-forecast", options],
    queryFn: () => getHourlyForecast(options),
    enabled: !!options.lat && !!options.lon,
  });
};

// Daily Forecast
export const useDailyForecast = (options = {}) => {
  return useQuery({
    queryKey: ["daily-forecast", options],
    queryFn: () => getDailyForecast(options),
    enabled: !!options.lat && !!options.lon,
  });
};

// 14-Day Forecast (Pro)
export const useForecast14 = (options = {}) => {
  return useQuery({
    queryKey: ["forecast14", options],
    queryFn: () => getForecast14(options),
    enabled: !!options.lat && !!options.lon,
  });
};

// AI Insights (Pro)
export const useInsights = (options = {}) => {
  return useQuery({
    queryKey: ["insights", options],
    queryFn: () => getInsights(options),
    enabled: !!options.lat && !!options.lon,
  });
};
