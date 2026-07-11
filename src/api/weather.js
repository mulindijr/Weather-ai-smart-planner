import api from "../services/api";

// Shared helper to remove null/undefined params
const buildParams = (params = {}) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  );
};

// Auto-detect location based on IP address
export const getWeatherGeo = async ({
  ip = "auto",
  lat,
  lon,
  days = 7,
  ai = true,
  units = "metric",
  lang = "en",
} = {}) => {
  const { data, headers } = await api.get("/weather-geo", {
    params: buildParams({
      ip,
      lat,
      lon,
      days,
      ai,
      units,
      lang,
    }),
  });

  return {
    data,
    headers,
  };
};

// Current Weather
export const getCurrentWeather = async ({
  lat,
  lon,
  ai = true,
  units = "metric",
  lang = "en",
} = {}) => {
  const { data } = await api.get("/current", {
    params: buildParams({
      lat,
      lon,
      ai,
      units,
      lang,
    }),
  });

  return data;
};

// Forecast
export const getForecast = async ({
  lat,
  lon,
  days = 7,
  ai = true,
  units = "metric",
  lang = "en",
} = {}) => {
  const { data } = await api.get("/forecast", {
    params: buildParams({
      lat,
      lon,
      days,
      ai,
      units,
      lang,
    }),
  });

  return data;
};

// Weather Endpoint
export const getWeather = async ({
  lat,
  lon,
  days = 7,
  ai = true,
  units = "metric",
  lang = "en",
} = {}) => {
  const { data } = await api.get("/weather", {
    params: buildParams({
      lat,
      lon,
      days,
      ai,
      units,
      lang,
    }),
  });

  return data;
};
