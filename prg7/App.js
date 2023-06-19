import { StatusBar } from "react-native";
import Counter from "./Counter";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Store from "./Store";
import { createContext, useState, useEffect, useContext } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "./I18n";
import Home from "./Home";
import ThemeContextProvider from "./ThemeContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(true);

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
