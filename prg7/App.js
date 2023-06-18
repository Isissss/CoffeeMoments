import { StatusBar } from "react-native";
import Counter from "./Counter";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "./Map";
import { MaterialIcons } from "@expo/vector-icons";
import Settings from "./Settings";
import Stores from "./Stores";
import Store from "./Store";
import { createContext, useState, useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales, getCalendars } from "expo-localization";
import i18n, { t } from "./I18n";

export const languageContext = createContext("");

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Home() {
  return (
    // receive dispatch from parent

    <Tab.Navigator>
      <Tab.Screen
        name="Stores"
        component={Stores}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="house" color={color} size={26} />
          ),
          title: t("stores"),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Counter}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-outline" color={color} size={26} />
          ),
          title: t("feed"),
          tabBarLabel: t("feed"),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" color={color} size={26} />
          ),
          title: t("settings"),
          tabBarLabel: t("settings"),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [theme, setTheme] = useState(i18n.locale);
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

  useEffect(() => {
    (async () => {
      try {
        // get theme from storage
        const value = await AsyncStorage.getItem("theme");
        // if it exists, set theme
        if (value !== null) {
          setColorScheme(value);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <languageContext.Provider value={{ theme, setTheme }}>
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
      </languageContext.Provider>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
    </>
  );
}
