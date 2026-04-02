import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return null;
      return res.json();
    },
    // Don't keep refetching if the user is idle
    staleTime: 1000 * 60 * 5, 
    retry: false,
  });
};