import { Pressable, StatusBar, Text } from "react-native";
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Store from "./src/screens/Store";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import Home from "./src/Home";
import AppContextProvider from "./src/AppContext";
import NewMoment from "./src/components/NewMoment";

const Stack = createNativeStackNavigator();

export default function App() {
	const { colorScheme } = useColorScheme();
	const [stores, setStores] = useState([]);

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

	return (
		<>
			<AppContextProvider>
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

						{/* <Stack.Screen
            name="MapStack" 
            component={Map}
            options={{ 
              headerTitle: 'Map'
            }}
          /> */}
					</Stack.Navigator>
				</NavigationContainer>
			</AppContextProvider>
			<StatusBar
				barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
			/>
		</>
	);
}
