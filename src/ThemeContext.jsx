import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeContextProvider({ children }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("");
  const [connected, setConnected] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      // get theme from storage
      const savedTheme = await AsyncStorage.getItem("theme");

      // if it exists, set theme
      if (savedTheme !== null && savedTheme !== "system") {
        setTheme(savedTheme);
      } else {
        // otherwise, set theme to system
        setTheme("system");
      }

      const savedLanguage = await AsyncStorage.getItem("language");

      if (savedLanguage !== null) {
        setLanguage(savedLanguage);
      } else {
        setLanguage(language.getLocales()[0].languageCode || "en");
      }

      // get data from storage
      const networkInfo = await NetInfo.fetch();
      console.log(networkInfo);
      if (1 + 1 === 2) {
        const response = await fetch(
          "https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json"
        );
        const json = await response.json();
        setData(json.hotspots);

        await AsyncStorage.setItem("data", JSON.stringify(json.hotspots));
      } else {
        const savedData = await AsyncStorage.getItem("data");
        if (savedData !== null) {
          setData(JSON.parse(savedData));
        } else {
          Alert.alert(
            "No internet connection",
            "Please connect to the internet to use this app",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
        }
      }
    })();

    // Subscribe
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    // Unsubscribe
    return unsubscribe();
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

  useEffect(() => {
    if (!language) return;
    (async () => {
      console.log("setting language to", language);
      try {
        await AsyncStorage.setItem("language", language);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [language]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colorScheme,
        language,
        setLanguage,
        connected,
        data,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
