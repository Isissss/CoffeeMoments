import { useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	ImageBackground,
	Modal,
	Pressable,
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
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import MomentCard from "../components/MomentCard";

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

	useEffect(() => {
		// duplicate 5 fake moments
		const fakeMoments = [...Array(5)].map((_, i) => {
			return { ...moments[store.id], id: i };
		});

		setCurrentMoments(fakeMoments);
	}, []);

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
		if (!authenticated) {
			const result = await authenticateUser();

			if (!result) {
				return Alert.alert("Authentication failed");
			}
		}

		setModalVisible(true);
	};

	return (
		<View className="relative flex-1 ">
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
			{/* <Animated.Image
        className="object-cover w-full h-64"
        source={require("./assets/starb.jpg")}
        sharedTransitionTag={`photo-${store.id}`}
      /> */}
			<ImageBackground
				sharedTransitionTag={store.id}
				className="object-cover w-full h-64"
				source={require("../../assets/starb.jpg")}
			>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.8)"]}
					className="h-64 "
				></LinearGradient>
			</ImageBackground>

			<View className="absolute top-52 p-6 bg-neutral-100 dark:bg-[#232323] h-full w-full rounded-t-[30px]">
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
						{store.description}
					</Text>

					<Pressable onPress={onMapPress} className="flex-row">
						<View className="rounded-md flex-row justify-center items-center bg-[#f1cba9] border-[#e8b990] dark:border-[#91735a] border-2 dark:bg-[#603813] p-3">
							<Ionicons
								name="map"
								size={20}
								color={colorScheme === "dark" ? "white" : "black"}
							/>
							<Text className=" text-black dark:text-white">
								{t("goToMap", language)}
							</Text>
						</View>
					</Pressable>

					<Text className="text-xl  mt-10 font-bold text-black dark:text-white">
						Your Coffee Moments:
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
							<Text className="text-center rounded-md  text-black dark:text-white px-4 mt-3">
								Unlock to view moments
							</Text>
						</Pressable>
					) : (
						<>
							<Pressable onPress={() => handleMomentPress()}>
								<Text className="text-center rounded-md  text-black dark:text-white px-4 mt-3">
									Add a moment
								</Text>
							</Pressable>
							<FlatList
								data={currentMoments}
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => (
									<MomentCard moment={item} navigation={navigation} />
								)}
							/>
						</>
					)}
				</Animated.View>
			</View>
		</View>
	);
}
