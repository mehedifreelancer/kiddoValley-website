// app/providers/ThemeProvider.tsx
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const html = document.documentElement;
    
    // Simply: if dark mode, add dark class; if light, remove it
    if (mode === "dark") {
      html.classList.add("dark");
      console.log("🌙 Dark mode applied");
    } else {
      html.classList.remove("dark");
      console.log("☀️ Light mode applied");
    }
  }, [mode]);

  return <>{children}</>;
}