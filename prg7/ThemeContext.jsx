import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeContextProvider({ children }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    (async () => {
      try {
        // get theme from storage
        const value = await AsyncStorage.getItem("theme");

        // if it exists, set theme
        if (value !== null && value !== "system") {
          setColorScheme(value);
          setTheme(value);
        } else {
          // otherwise, set theme to system
          setTheme("system");
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    setColorScheme(theme);

    (async () => {
      try {
        if (theme == "system") {
          await AsyncStorage.removeItem("theme");
        } else {
          await AsyncStorage.setItem("theme", theme);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
