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
import NewMoment from "./components/NewMoment";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
	const { language, colorScheme, connected } = useAppContext();

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: colorScheme === "dark" ? "#FF2D55" : "#FF375F",
				tabBarInactiveTintColor: colorScheme === "dark" ? "white" : "black",
				tabBarActiveBackgroundColor:
					colorScheme === "dark" ? "#1E1E1E" : "#F2F2F2",
			}}
		>
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
					title: t("map", language),
					tabBarLabel: t("map", language),
					tabBarIcon: ({ color }) => (
						<MaterialIcons
							name="map"
							color={connected ? color : "gray"}
							size={26}
						/>
					),
				}}
				listeners={() => ({
					tabPress: (e) => {
						if (!connected) {
							// send error alert if not connected
							e.preventDefault();
							Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							Alert.alert(
								t("noInternet.title", language),
								t("noInternet.message", language)
							);
						}
					},
				})}
			>
				{(props) => <Map {...props} />}
			</Tab.Screen>
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
