import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme, themeStorageKey } from "./themeContext";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "day";
    return window.localStorage.getItem(themeStorageKey) === "night"
      ? "night"
      : "day";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === "day" ? "night" : "day"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
