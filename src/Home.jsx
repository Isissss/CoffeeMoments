import Counter from "./Counter";
import Settings from "./screens/Settings";
import Stores from "./screens/Stores";
import Map from "./screens/Map";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { t } from "./I18n";
import { useAppContext } from "./AppContext";

import { Alert } from "react-native";

const Tab = createBottomTabNavigator();

export default function Home() {
  const { language, setLanguage, connected } = useAppContext();

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
          title: t("stores.title", language),
        }}
      />
      <Tab.Screen
        name="Map"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" color={color} size={26} />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            console.log("isConnected", connected);
            if (!connected) {
              e.preventDefault();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                t("noInternet.title", language),
                t("noInternet.message", language),
                [
                  {
                    text: "OK",
                  },
                ]
              );
            }
          },
        })}
      >
        {(props) => <Map {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Feed"
        component={Counter}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-outline" color={color} size={26} />
          ),
          title: t("feed", language),
          tabBarLabel: t("feed", language),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" color={color} size={26} />
          ),
          title: t("settings.title", language),
          tabBarLabel: t("settings.title", language),
        }}
      />
    </Tab.Navigator>
  );
}
