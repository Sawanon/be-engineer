// In Next.js, this file would be called: app/providers.jsx
"use client";
import {
   isServer,
   QueryClient,
   QueryClientProvider,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

import("dayjs/locale/th");
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function makeQueryClient() {
   return new QueryClient({
      defaultOptions: {
         queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
         },
      },
   });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
   if (isServer) {
      return makeQueryClient();
   } else {
      if (!browserQueryClient) browserQueryClient = makeQueryClient();
      return browserQueryClient;
   }
}

export default function Providers({ children }: { children: React.ReactNode }) {
   const queryClient = getQueryClient();
   return (
      <NextUIProvider>
         <NextThemesProvider attribute="class" defaultTheme="light">
            <SessionProvider>
               <QueryClientProvider client={queryClient}>
                  {children}
               </QueryClientProvider>
            </SessionProvider>
         </NextThemesProvider>
      </NextUIProvider>
   );
}
