"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 1. Mark data as stale immediately. 
            // This ensures TanStack always checks the server on mount.
            staleTime: 5000, 
            gcTime: 1000 * 60 * 5, // Keep in memory for 5 mins
            retry: 1,
            // 2. This is key for "Back" navigation:
            refetchOnMount: true, 
            refetchOnWindowFocus: true,
          },
        },
      })
  );


  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {

        queryClient.invalidateQueries();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}