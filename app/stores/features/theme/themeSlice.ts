// store/features/themeSlice.ts
import { createSlice } from "@reduxjs/toolkit";

// Function to get initial theme from localStorage
const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme === "dark" || savedTheme === "light") {
      console.log("📦 Loaded theme from localStorage:", savedTheme);
      return savedTheme;
    }
  }
  // Default to light if nothing in localStorage
  console.log("📦 No saved theme, defaulting to light");
  return "light";
};

const initialState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      // Toggle between light and dark
      state.mode = state.mode === "light" ? "dark" : "light";
      // Save to localStorage immediately
      localStorage.setItem("theme", state.mode);
      console.log("💾 Saved theme to localStorage:", state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
