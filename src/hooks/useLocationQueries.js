import { useQuery } from "@tanstack/react-query";
import { getIpLocation } from "../api/location";

// IP Location
export const useIpLocation = (ip = "auto") => {
  return useQuery({
    queryKey: ["ip-location", ip],
    queryFn: () => getIpLocation(ip),
  });
};