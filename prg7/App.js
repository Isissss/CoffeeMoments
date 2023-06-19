import { StatusBar } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Store from "./Store";
import { useState, useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "./I18n";
import Home from "./Home";
import ThemeContextProvider from "./ThemeContext";
import NetInfo from "@react-native-community/netinfo";

const Stack = createNativeStackNavigator();

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });

    // Unsubscribe
    unsubscribe();
  }, []);

  const getMarkers = () => {
    fetch("https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json")
      .then((response) => response.json())
      .then((json) => {
        setStores(json.hotspots);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getMarkers();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("language");

        if (value !== null) {
          i18n.locale = value;
        } else {
          const locales = getLocales();

          const locale = locales[0].languageTag;

          i18n.locale = locale;

          await AsyncStorage.setItem("language", locale);
        }
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <ThemeContextProvider>
        <NavigationContainer
          theme={colorScheme == "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Store"
              component={Store}
              options={({ route }) => ({
                title: route.params.store.title,
                animation: "slide_from_bottom",
              })}
            />
            {/* <Stack.Screen
            name="MapStack"
            component={Map}
            options={{ 
              headerTitle: 'Map'
            }}
          /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeContextProvider>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
    </>
  );
}
