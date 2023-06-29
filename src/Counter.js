import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";

export default function Counter({ navigation }) {
	const [count, setCount] = useState(0);
	const [authenticated, setAuthenticated] = useState(false);

	const lowerCount = () => {
		if (count - 1 <= 0) {
			Alert.alert("Count cannot be less than 0");
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			return;
		}
		setCount(count - 1);
	};

	useEffect(() => {
		console.log("Count is now: ", count);
	}, [count]);

	if (!authenticated) {
		return (
			<View>
				<Text>Not authenticated</Text>
			</View>
		);
	}

	return (
		<View
			className="bg-emerald-400
    
    "
		>
			<Text>Count le people</Text>
			<Text>{count}</Text>
			<View>
				<Button title="-1" onPress={() => lowerCount()} />
				<Button title="+1" onPress={() => setCount(count + 1)} />
			</View>
			<Button title="Go to Quote" onPress={() => navigation.navigate("Map")} />
		</View>
	);
}
