import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { light, dark } from "./tokens";

type ColorScheme = "light" | "dark";

interface ThemeState {
  colorScheme: ColorScheme;
  colors: typeof light;
  toggleTheme: () => void;
}

const THEME_KEY = "color_scheme";

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    systemScheme ?? "light"
  );

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "light" || stored === "dark") {
        setColorScheme(stored);
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setColorScheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const colors = colorScheme === "dark" ? dark : light;

  return (
    <ThemeContext.Provider value={{ colorScheme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
