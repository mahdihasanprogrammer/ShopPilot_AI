"use client";

import { useTheme } from "@/context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl border border-border bg-card/60 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center gap-2 h-9 rounded-xl border border-border bg-card px-2.5 text-body hover:text-heading hover:bg-bg-secondary hover:border-border-hover transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        showLabel ? "w-auto px-3" : "w-9"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <FiSun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100 hover:rotate-45" />
        ) : (
          <FiMoon className="h-4 w-4 text-indigo-500 transition-transform duration-300 rotate-0 scale-100 hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
