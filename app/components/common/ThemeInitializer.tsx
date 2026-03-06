// components/ThemeInitializer.tsx
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/stores/store";

export default function ThemeInitializer() {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    // Get the HTML element
    const html = document.documentElement;

    // Remove existing theme classes
    html.classList.remove("light", "dark");

    // Apply the new theme
    if (mode === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      html.classList.add(systemPrefersDark ? "dark" : "light");
      console.log(
        "System theme applied:",
        systemPrefersDark ? "dark" : "light",
      );
    } else {
      html.classList.add(mode);
      console.log("Theme applied:", mode);
    }
  }, [mode]);

  return null; // This component doesn't render anything
}
