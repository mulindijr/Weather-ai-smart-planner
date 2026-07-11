import api from "../services/api";

export const getUsage = async () => {
  const { data } = await api.get("/usage");

  return data;
};