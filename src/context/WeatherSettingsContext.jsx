import { createContext, useContext, useState, useEffect } from "react";

const WeatherSettingsContext = createContext();

const SETTINGS_KEY = "weather_ai_settings";
const LOCATION_KEY = "weather_ai_location";

const defaultSettings = {
  lat: null,
  lon: null,
  ai: true,
  units: "metric",
  lang: "en",
  days: 7,
};

const defaultLocation = {
  city: "",
  region: "",
  country: "",
};

export function WeatherSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage:", e);
    }
    return defaultSettings;
  });

  const [location, setLocation] = useState(() => {
    try {
      const savedLocation = localStorage.getItem(LOCATION_KEY);
      if (savedLocation) {
        return JSON.parse(savedLocation);
      }
    } catch (e) {
      console.error("Failed to load location from localStorage:", e);
    }
    return defaultLocation;
  });

  // Sync settings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings to localStorage:", e);
    }
  }, [settings]);

  // Sync location to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    } catch (e) {
      console.error("Failed to save location to localStorage:", e);
    }
  }, [location]);

  return (
    <WeatherSettingsContext.Provider
      value={{
        settings,
        setSettings,
        location,
        setLocation,
      }}
    >
      {children}
    </WeatherSettingsContext.Provider>
  );
}

export function useWeatherSettings() {
  return useContext(WeatherSettingsContext);
}

