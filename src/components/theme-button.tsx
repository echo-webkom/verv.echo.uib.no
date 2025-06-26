"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const toggle = () => {
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button className="relative flex size-7 items-center" onClick={toggle}>
      <Sun className="absolute size-7 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 dark:opacity-0" />
      <Moon className="absolute size-7 scale-0 rotate-90 opacity-0 transition-all dark:scale-100 dark:rotate-0 dark:opacity-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
