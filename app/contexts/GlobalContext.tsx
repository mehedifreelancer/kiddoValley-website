// contexts/GlobalContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

// Only theme related types
interface GlobalContextType {
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;
}

// Create and export context
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

// Provider with ONLY theme
export function GlobalProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("themeMode") as "light" | "dark" | null;
    if (saved) {
      setThemeMode(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Update document when theme changes
  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  return (
    <GlobalContext.Provider
      value={{
        themeMode,
        setThemeMode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
