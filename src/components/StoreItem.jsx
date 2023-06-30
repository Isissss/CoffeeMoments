import { Text, View, Pressable, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import FavoriteButton from "./FavoriteButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAppContext } from "../AppContext";

export default function StoreItem({ shouldAnimate, store, navigation, index }) {
	const { colorScheme } = useAppContext();

	if (!store) {
		return <Text>Store not found</Text>;
	}

	return (
		<Animated.View
			entering={
				!shouldAnimate ? null : FadeInUp.duration(700).delay(index * 100)
			}
			className="mx-3"
		>
			<TouchableOpacity
				className="bg-white dark:bg-[#2d3038] rounded-lg py-2 my-2"
				onPress={() =>
					navigation.navigate("Store", {
						store: store,
					})
				}
			>
				<View className="px-4 my-3 space-y-2 flex-row">
					<Text className="flex-1 text-black dark:text-white">
						{store.title}
					</Text>
					<FontAwesome5
						name="chevron-right"
						size={12}
						color={colorScheme == "dark" ? "white" : "black"}
					/>
				</View>
				<View>
					<FavoriteButton id={store.id} />
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
}
