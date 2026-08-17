"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({ children }) {
  // Create queryClient inside component to avoid SSR singleton issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (v5 renamed from cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html lang="en">
      <head>
        <title>HelixMed AI | Next-Gen Clinical Research Suite</title>
        <meta
          name="description"
          content="HelixMed AI — Next-generation clinical research platform for trial optimization, AI-powered risk prediction, and precision patient care."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#0f172a] text-slate-100 min-h-screen">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
