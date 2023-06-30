import { useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	ImageBackground,
	Modal,
	Pressable,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
	FadeInDown,
	useFrameCallback,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "../I18n";
import FavoriteButton from "../components/FavoriteButton";
import { useAppContext } from "../AppContext";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import NewMoment from "../components/NewMoment";
import MomentCard from "../components/MomentCard";
import { twJoin } from "tailwind-merge";

export default function Store({ route, navigation }) {
	const { store } = route.params;
	const {
		colorScheme,
		language,
		connected,
		authenticated,
		setAuthenticated,
		moments,
	} = useAppContext();
	const [modalVisible, setModalVisible] = useState(false);
	const [currentMoments, setCurrentMoments] = useState([]);

	const onMapPress = () => {
		if (connected) {
			navigation.navigate("Map", { store });
		} else {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			Alert.alert(
				t("noInternet.title", language),
				t("noInternet.message", language)
			);
		}
	};

	useEffect(() => {
		setCurrentMoments(moments[store.id] || []);
	}, [moments]);

	const authenticateUser = async () => {
		// check if hardware is available
		const compatible = await LocalAuthentication.hasHardwareAsync();
		if (!compatible) {
			Alert.alert("Hardware not compatible");
			return;
		}

		// check credentials
		const status = await LocalAuthentication.authenticateAsync();
		setAuthenticated(status.success);

		return status.success;
	};

	const handleMomentPress = async () => {
		// check if user is authenticated, if not, authenticate
		if (!authenticated) {
			const result = await authenticateUser();

			if (!result) {
				return Alert.alert("Authentication failed");
			}
		}
	};

	const addMoment = () => {
		setModalVisible(true);
	};

	return (
		<ScrollView className="relative flex-1 bg-neutral-100   dark:bg-[#232323]">
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<NewMoment
					navigation={navigation}
					store={store}
					close={() => setModalVisible(false)}
				/>
			</Modal>

			<ImageBackground
				sharedTransitionTag={store.id}
				className="object-cover w-full h-64"
				source={
					store.image ? { uri: store.image } : require("../../assets/starb.jpg")
				}
			>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.8)"]}
					className="h-64 "
				></LinearGradient>
			</ImageBackground>

			<View className="-top-6 p-6 rounded-t-[30px]  bg-neutral-100   dark:bg-[#232323]">
				<FavoriteButton id={store.id} classes="-top-5 z-30 right-10 absolute" />
				<Animated.Text
					entering={FadeInDown.duration(400).delay(150)}
					className="text-2xl tracking-tight font-bold text-black dark:text-white"
				>
					{store.title}
				</Animated.Text>
				<Animated.View entering={FadeInDown.duration(400).delay(250)}>
					<Text className="text-gray-500 dark:text-gray-400">
						<Ionicons
							name="location"
							size={18}
							color={colorScheme == "dark" ? "darkgray" : "gray"}
						/>
						{store.address}
					</Text>

					<Text className="text-black dark:text-white my-5 ">
						{store.description[language] || store.description["en"]}
					</Text>

					<Pressable onPress={onMapPress} className="flex-row">
						<View
							className={twJoin(
								"rounded-md flex-row justify-center items-centeractive:opacity-80 p-2",
								connected ? " bg-[#603813] " : "bg-gray-400"
							)}
						>
							<Ionicons name="map" size={20} color={"white"} />
							<Text className="text-white ml-2">{t("goToMap", language)}</Text>
						</View>
					</Pressable>

					<Text className="text-xl  mt-10 font-bold text-black dark:text-white">
						{t("moments.title", language)} ({currentMoments.length}):
					</Text>
					{!authenticated ? (
						<Pressable
							onPress={() => handleMomentPress()}
							className="p-4 border-red-400 rounded-md mt-3 bg-red-500/30 border-2 justify-center flex-col items-center"
						>
							<Ionicons
								name="ios-lock-closed-sharp"
								size={24}
								color={colorScheme === "dark" ? "white" : "black"}
							/>
							<Text className="text-center rounded-md text-black dark:text-white px-4 mt-3">
								{t("moments.unlock", language)}
							</Text>
						</Pressable>
					) : (
						<>
							<Pressable
								className="rounded-md my-2 text-center py-3 bg-[#CB9363] active:bg-[#85542a]"
								onPress={() => addMoment()}
							>
								<Text className="text-center text-white font-bold">
									{t("moments.addButton", language)}
								</Text>
							</Pressable>
							<FlatList
								data={currentMoments}
								horizontal={true}
								renderItem={({ item, index }) => (
									<MomentCard
										moment={item}
										store={store}
										navigation={navigation}
										index={index}
									/>
								)}
							/>
						</>
					)}
				</Animated.View>
			</View>
		</ScrollView>
	);
}
