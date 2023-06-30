import { Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSequence,
} from "react-native-reanimated";
import { twJoin } from "tailwind-merge";
import * as Haptics from "expo-haptics";
import { useAppContext } from "../AppContext";

export default function FavoriteButton({ id, classes }) {
	const [favorite, setFavorite] = useState(false);
	const { favorites, setFavorites } = useAppContext();

	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
		};
	});

	useEffect(() => {
		if (favorites?.includes(id)) {
			setFavorite(true);
		} else {
			setFavorite(false);
		}
	}, [favorites]);

	const removeFavorite = () => {
		setFavorites((prev) => prev.filter((item) => item !== id));
		setFavorite(false);
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const storeFavorite = async () => {
		setFavorites((prev) => [...prev, id]);
		setFavorite(true);
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const toggleFavorite = async () => {
		if (favorite) {
			removeFavorite();
		} else {
			storeFavorite();

			scale.value = withSequence(
				withTiming(0.5, { duration: 0 }),
				withTiming(1.25, { duration: 300 }),
				withTiming(1, { duration: 200 })
			);
		}
	};

	return (
		<View
			className={twJoin(
				"h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-700 shadow-sm",
				classes
			)}
		>
			<Pressable
				onPress={() => {
					toggleFavorite();
				}}
				className="py-2 w-14 h-14 rounded-full flex align-middle justify-center"
			>
				<Animated.Text style={[animatedStyle]} className="text-center">
					{favorite ? (
						<FontAwesome name="heart" size={24} color={"red"} />
					) : (
						<FontAwesome name="heart-o" size={24} />
					)}
				</Animated.Text>
			</Pressable>
		</View>
	);
}
