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