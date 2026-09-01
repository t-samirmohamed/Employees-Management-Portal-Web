"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes injects an inline <script> to set the theme before hydration
// (avoids a flash of the wrong theme). React 19 warns whenever a component
// renders a <script> without src/async, even though this one works fine
// since it's part of the SSR'd HTML. Known upstream issue, no fix shipped:
// https://github.com/pacocoursey/next-themes/issues/387
if (typeof window !== "undefined") {
  const nativeConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    nativeConsoleError(...args);
  };
}

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
