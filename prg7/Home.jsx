import Counter from "./Counter";
import Settings from "./Settings";
import Stores from "./Stores";
import Map from "./Map";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { t } from "./I18n";

const Tab = createBottomTabNavigator();

export default function Home() {
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
          title: t("settings.title"),
          tabBarLabel: t("settings.title"),
        }}
      />
    </Tab.Navigator>
  );
}
