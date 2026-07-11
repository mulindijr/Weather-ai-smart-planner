import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_AI_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_WEATHER_AI_API_KEY}`,
  },
});

export default api;
