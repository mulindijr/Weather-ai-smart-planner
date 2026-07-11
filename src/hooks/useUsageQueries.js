import { useQuery } from "@tanstack/react-query";
import { getUsage } from "../api/usage";

// API Usage
export const useUsage = () => {
  return useQuery({
    queryKey: ["usage"],
    queryFn: getUsage,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
