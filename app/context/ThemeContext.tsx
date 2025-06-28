"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  chatBackground: string;
  setChatBackground: (bg: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useState("#0084ff");
  const [chatBackground, setChatBackground] = useState("default");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("messenger-theme");
    if (saved) {
      const theme = JSON.parse(saved);
      setPrimaryColor(theme.primaryColor || "#0084ff");
      setChatBackground(theme.chatBackground || "default");
      setIsDarkMode(theme.isDarkMode || false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "messenger-theme",
      JSON.stringify({
        primaryColor,
        chatBackground,
        isDarkMode,
      })
    );

    document.documentElement.style.setProperty("--primary-color", primaryColor);
  }, [primaryColor, chatBackground, isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        chatBackground,
        setChatBackground,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
