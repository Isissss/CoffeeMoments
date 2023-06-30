import { Pressable, StatusBar, Text } from "react-native";
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Store from "./src/screens/Store";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import AppContextProvider from "./src/AppContext";
import NewMoment from "./src/components/NewMoment";
import TabNavigation from "./src/TabNavigation";

const Stack = createNativeStackNavigator();

export default function App() {
	const { colorScheme } = useColorScheme();

	return (
		<>
			<AppContextProvider>
				<NavigationContainer
					theme={colorScheme == "dark" ? DarkTheme : DefaultTheme}
				>
					<Stack.Navigator>
						<Stack.Screen
							name="TabNavigation"
							component={TabNavigation}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Store"
							component={Store}
							options={({ navigation, route }) => ({
								title: route.params.store.title,
								animation: "slide_from_bottom",
								headerLeft: () => (
									<Pressable
										className="text-black"
										onPress={() => navigation.navigate("Stores")}
									>
										<Text>
											<Ionicons
												name="arrow-back"
												size={24}
												color={colorScheme == "dark" ? "white" : "black"}
											/>
										</Text>
									</Pressable>
								),
							})}
						/>

						<Stack.Screen name="New Moment" component={NewMoment} />
					</Stack.Navigator>
				</NavigationContainer>
			</AppContextProvider>
			<StatusBar
				barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
			/>
		</>
	);
}
