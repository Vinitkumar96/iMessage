import { useEffect, useLayoutEffect, useState } from "react";
import { DEFAULT_THEME_PRESET_ID } from "../data/herouiThemePresets";
import {
  applyThemePresetToDocument,
  isValidThemePreset,
  ThemeContext,
} from "./theme";

// os preference for dark or light
function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// previous selected theme -> dark or light
function readStoredTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") return theme;

  return null;
}

// previouse selected preset
function readStoredThemePreset() {
  const themePreset = localStorage.getItem("theme-preset");
  if (themePreset && isValidThemePreset(themePreset)) return themePreset;

  return DEFAULT_THEME_PRESET_ID;
}

// apply to html class = dark for tailwind :dark
// data-theme attribute not preset
function applyDomTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute(
    "data-theme",
    theme === "dark" ? "dark" : "light",
  );
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => readStoredTheme() ?? getSystemTheme(),
  );
  const [themePreset, setThemePresetState] = useState(readStoredThemePreset);

  // this applies light/dark mode and dark/light preset
  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  // this applies the theme preset, like sky, spotify, etc.
  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  // this stores the theme and theme preset in local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-preset", themePreset);
  }, [theme, themePreset]);

  // ###########
  const setTheme = (next) => setThemeState(next); // for dark and light mode

  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark")); // for dark and light mode
  };
  // ###########

 const setThemePreset = (presetId) => {
  if (isValidThemePreset(presetId)) {
    setThemePresetState(presetId)
  } else {
    setThemePresetState(DEFAULT_THEME_PRESET_ID)
  }
}

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, themePreset, setThemePreset }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
