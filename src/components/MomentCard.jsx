import React from "react";
import { Alert, Image, Text, View, Share } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { useAppContext } from "../AppContext";
import { Ionicons } from "@expo/vector-icons";
import { t } from "../I18n";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase";
function MomentCard({ moment, index, store }) {
	const { connected, colorScheme, setMoments, language } = useAppContext();
	// find best color for icons
	const bestColor = !connected
		? "gray"
		: colorScheme == "dark"
		? "white"
		: "black";

	const removeFavorite = () => {
		if (!connected) {
			sendConnectionAlert();
			return;
		}
		// send user confirmation to remove moment
		Alert.alert(
			t("moments.removeMoment.title", language),
			t("moments.removeMoment.message", language),
			[
				{
					text: t("moments.removeMoment.cancel", language),
					style: "cancel",
				},
				{
					text: t("moments.removeMoment.confirm", language),
					onPress: async () => {
						setMoments((moments) => {
							console.log(moments);
							const newMoments = moments[store.id].filter(
								(m) => m.id !== moment.id
							);

							return { ...moments, [store.id]: newMoments };
						});

						try {
							const imageRef = ref(storage, moment.imageRef);
							await deleteObject(imageRef);
						} catch (error) {
							console.log(error);
						}
					},
				},
			]
		);
	};

	const shareMoment = async () => {
		if (!connected) {
			sendConnectionAlert();
			return;
		}
		try {
			// share with socials
			await Share.share(
				{
					title: "CoffeeMoments",
					message: t(
						"share.message",

						language,

						{
							title: store.title,
							rating: moment.rating,
						}
					),
				},
				{
					dialogTitle: "CoffeeMoments",
					subject: "CoffeeMoments",
					tintColor: "red",
				}
			);
		} catch (error) {
			Alert.alert("Error", error.message);
		}
	};

	const sendConnectionAlert = () => {
		Alert.alert(
			t("noInternet.title", language),
			t("noInternet.message", language)
		);
	};
	return (
		<Animated.View
			className="w-40 mr-5 bg-neutral-300 dark:bg-neutral-600 p-2 rounded-sm"
			entering={FadeInLeft.duration(300).delay(index * 200 + 100)}
		>
			<View className="flex-row justify-end space-x-2 mb-1">
				<Ionicons
					name="share-social"
					size={18}
					color={bestColor}
					onPress={() => shareMoment()}
				/>
				<Ionicons
					name="trash"
					size={18}
					color={bestColor}
					onPress={removeFavorite}
				/>
			</View>
			<Image
				className="w-full h-40 image-cover mb-2"
				source={
					connected && moment.image
						? { uri: moment.image }
						: require("../../assets/coffee.webp")
				}
			/>
			<View className="flex-row justify-between mb-1">
				{[1, 2, 3, 4, 5].map((i) => (
					<Ionicons
						key={i}
						name={"star"}
						size={20}
						color={
							moment.rating >= i
								? "#EAB541"
								: colorScheme == "dark"
								? "white"
								: "black"
						}
					/>
				))}
			</View>
			<Text className="text-black dark:text-white">{moment.text}</Text>
		</Animated.View>
	);
}

export default MomentCard;
