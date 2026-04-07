"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 1000 * 60 * 5,
            retry: 2,
            refetchOnMount: "always",
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  useEffect(() => {
    // 🔥 Handle pages restored from bfcache / back-forward navigation
    const handleNavigation = () => {
      const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      if (navEntries.length > 0 && navEntries[0].type === "back_forward") {
        // Reload the page safely to avoid frozen JS / blank screen
        window.location.reload();
      }
    };

    // Some browsers may not report navigation type immediately
    window.addEventListener("pageshow", handleNavigation);
    return () => window.removeEventListener("pageshow", handleNavigation);
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}