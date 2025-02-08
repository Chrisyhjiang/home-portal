import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    border: string;
  };
}

const lightColors = {
  background: "#ffffff",
  text: "#2d3748",
  primary: "#3182ce",
  secondary: "#4a5568",
  accent: "#ed64a6",
  surface: "#f7fafc",
  border: "#e2e8f0",
};

const darkColors = {
  background: "#1a202c",
  text: "#f7fafc",
  primary: "#63b3ed",
  secondary: "#a0aec0",
  accent: "#f687b3",
  surface: "#2d3748",
  border: "#4a5568",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as Theme) || "dark";
  });

  const colors = theme === "light" ? lightColors : darkColors;

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
