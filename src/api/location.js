import api from "../services/api";

export const getIpLocation = async (ip = "auto") => {
  const { data } = await api.get("/ip-lookup", {
    params: {
      ip,
    },
  });

  return data;
};