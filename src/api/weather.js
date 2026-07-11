import api from "../services/api";

export const getWeatherGeo = async () => {
  const { data } = await api.get("/weather-geo", {
    params: {
      ip: "auto",
      days: 7,
      ai: true,
    },
  });

  return data;
};
