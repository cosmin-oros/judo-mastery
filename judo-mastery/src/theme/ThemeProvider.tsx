import React, { createContext, useContext, useEffect, useState } from "react";
import { lightTheme, darkTheme } from "./themes";
import { ThemeContextType } from "../types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load the theme preference from storage or match system preference
    const loadThemePreference = async () => {
      const storedPreference = await AsyncStorage.getItem("theme");
      if (storedPreference !== null) {
        setIsDarkMode(storedPreference === "dark");
      } else {
        const systemPreference = Appearance.getColorScheme();
        setIsDarkMode(systemPreference === "dark");
      }
    };
    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      AsyncStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
