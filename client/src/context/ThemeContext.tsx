"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "shoppilot-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Helper to update DOM class and attribute
  const applyThemeToDOM = (resolved: ResolvedTheme) => {
    const root = document.documentElement;
    if (resolved === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  };

  // Helper to determine resolved theme from mode
  const getResolvedTheme = (t: Theme): ResolvedTheme => {
    if (t === "dark") return "dark";
    if (t === "light") return "light";
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };

  // Mount effect to load stored theme
  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
      const initialTheme = savedTheme && ["light", "dark", "system"].includes(savedTheme)
        ? savedTheme
        : "system";

      setThemeState(initialTheme);
      const res = getResolvedTheme(initialTheme);
      setResolvedTheme(res);
      applyThemeToDOM(res);
    } catch {
      // Fallback if localStorage unavailable
      const res = getResolvedTheme("system");
      setResolvedTheme(res);
      applyThemeToDOM(res);
    }
  }, []);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const res = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(res);
        applyThemeToDOM(res);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.error("Failed to save theme to localStorage", e);
    }
    const res = getResolvedTheme(newTheme);
    setResolvedTheme(res);
    applyThemeToDOM(res);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
