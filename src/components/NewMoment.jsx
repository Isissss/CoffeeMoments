import {
	Button,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Pressable,
	Alert,
	ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../AppContext";
import { db } from "../../firebase";
import { t } from "../I18n";
import * as Haptics from "expo-haptics";

function NewMoment({ store, close }) {
	const [image, setImage] = useState(null);
	const [rating, onRatingChange] = useState(0);
	const [textInputValue, onTextInputValueChange] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { moments, setMoments, connected, language, colorScheme } =
		useAppContext();

	async function uploadImageAsync(uri, fileName) {
		// Why are we using XMLHttpRequest? See:
		// https://github.com/expo/expo/issues/2402#issuecomment-443726662
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log(e);
				reject(new TypeError("Network request failed"));
			};
			xhr.responseType = "blob";
			xhr.open("GET", uri, true);
			xhr.send(null);
		});

		try {
			const storageRef = ref(storage, fileName);
			await uploadBytes(storageRef, blob);

			blob.close();

			return await getDownloadURL(storageRef);
		} catch (e) {
			console.log(e);

			Alert.alert("Error uploading image", "Please try again later");
		}
	}
	const pickImage = async () => {
		if (!connected) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			Alert.alert(
				t("noInternet.title", language),
				t("noInternet.message", language)
			);
			return;
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const onSubmit = async () => {
		setIsSubmitting(true);

		// check if all fields are filled
		if (!textInputValue || !rating) {
			Alert.alert("Error", "Please fill in all fields");
			setIsSubmitting(false);
			return;
		}

		// first upload image to firebase storage
		let url = "";
		const fileName = `Images/image-${Date.now()}`;

		if (image) {
			url = await uploadImageAsync(image, fileName);
			console.log(url);
		}

		// add to local storage, check if there is a key for this store.id
		// if there is, add to the array, if not, create a new key

		const id = Date.now();

		setMoments({
			...moments,
			[store.id]: [
				...moments[store.id],
				{
					id: id,
					text: textInputValue,
					rating: rating,
					image: url,
					imageRef: fileName,
					createdAt: Date.now(),
				},
			],
		});

		setIsSubmitting(false);
		close();
	};

	return (
		<View className="flex-1 justify-center items-center bg-black/50">
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className="w-[90%] opacity-100 bg-white dark:bg-neutral-800 p-4 rounded-md">
					<TouchableOpacity
						onPress={close}
						className="absolute top-0 right-0 p-2 z-10"
					>
						<Ionicons
							name="close"
							size={30}
							color={colorScheme === "dark" ? "white" : "black"}
						/>
					</TouchableOpacity>
					<Text className="text-xl font-bold text-black dark:text-white">
						{t("moments.addMoment.title", language)}
					</Text>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
					>
						<TextInput
							placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
							returnKeyType="done"
							className="border border-gray-300 text-black dark:text-white p-2 rounded-md mt-5 h-32"
							multiline={true}
							placeholder={t("moments.addMoment.placeholder", language)}
							value={textInputValue}
							blurOnSubmit={true}
							onChangeText={onTextInputValueChange}
						/>
					</KeyboardAvoidingView>
					<View style={{ flexDirection: "row", marginTop: 20 }}>
						{[1, 2, 3, 4, 5].map((value) => (
							<TouchableOpacity
								key={value}
								onPress={() => onRatingChange(value)}
								style={{ marginRight: 10 }}
							>
								<Ionicons
									name={rating >= value ? "star" : "star-outline"}
									size={30}
									color="gold"
								/>
							</TouchableOpacity>
						))}
					</View>

					<Button
						title={t("moments.addMoment.pickImage", language)}
						onPress={pickImage}
						color={connected ? "#CB9363" : "#c9c9c9"}
					/>
					{image && (
						<Image
							source={{ uri: image }}
							style={{ width: 200, height: 200 }}
						/>
					)}
					<Pressable
						className="rounded-md mt-6 text-center py-4  bg-[#CB9363] active:bg-[#85542a] w-full"
						onPress={() => onSubmit()}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<ActivityIndicator color="white" />
						) : (
							<Text className="text-center text-white font-bold">
								{" "}
								{t("moments.addMoment.submit", language)}
							</Text>
						)}
					</Pressable>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}

export default NewMoment;
