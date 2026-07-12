import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useWeatherGeo } from "../hooks/useWeatherQueries";
import { useWeatherSettings } from "../context/WeatherSettingsContext";

export default function InitializeWeather() {
  const { data, isSuccess } = useWeatherGeo();
  const { settings, setSettings, setLocation } = useWeatherSettings();
  const queryClient = useQueryClient();
  const initializedRef = useRef(false);

  // 1. Precise GPS Geolocation on load
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const gpsLat = position.coords.latitude;
        const gpsLon = position.coords.longitude;

        const updatedSettings = {
          ...settings,
          lat: gpsLat,
          lon: gpsLon,
        };

        setSettings(updatedSettings);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsLat}&lon=${gpsLon}&accept-language=en`
          );
          if (res.ok) {
            const addrData = await res.json();
            const address = addrData.address || {};
            const resolvedCity =
              address.city ||
              address.town ||
              address.village ||
              address.suburb ||
              address.municipality ||
              "Current Position";
            const resolvedRegion = address.state || address.region || address.county || "";
            const resolvedCountry = address.country_code
              ? address.country_code.toUpperCase()
              : address.country || "";

            setLocation({
              city: resolvedCity,
              region: resolvedRegion,
              country: resolvedCountry,
            });
          }
        } catch (err) {
          console.error("OSM Nominatim reverse geocode load error:", err);
        }
      },
      (error) => {
        console.log("GPS auto-detection skipped/denied on mount, using IP fallback:", error.message);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [settings, setSettings, setLocation]);

  // 2. IP Fallback detection (if settings coordinates are not yet set)
  useEffect(() => {
    if (!isSuccess || !data) return;

    // If GPS has already set coordinates, skip overwriting with IP location
    if (settings.lat !== null && settings.lon !== null) {
      return;
    }

    if (settings.lat === data.data.lat && settings.lon === data.data.lon) {
      return;
    }

    const updatedSettings = {
      ...settings,
      lat: data.data.lat,
      lon: data.data.lon,
    };

    setSettings(updatedSettings);

    queryClient.setQueryData(["current-weather", updatedSettings], data.data);

    if (data.data.daily) {
      queryClient.setQueryData(
        ["daily-forecast", updatedSettings, 7],
        data.data,
      );
    }

    if (data.data.hourly) {
      queryClient.setQueryData(
        ["hourly-forecast", updatedSettings, 1],
        data.data,
      );
    }

    setLocation({
      city: data.headers["x-city"] ?? "",
      region: data.headers["x-region"] ?? "",
      country: data.headers["x-country"] ?? "",
    });
  }, [data, isSuccess, settings, setSettings, setLocation, queryClient]);

  return null;
}

