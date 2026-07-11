import { createContext, useContext, useState } from "react";

const WeatherSettingsContext = createContext();

export function WeatherSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    ai: true,
    units: "metric",
    lang: "en",
    days: 7,
    lat: null,
    lon: null,
  });

  return (
    <WeatherSettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </WeatherSettingsContext.Provider>
  );
}

export function useWeatherSettings() {
  return useContext(WeatherSettingsContext);
}
