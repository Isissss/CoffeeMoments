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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../AppContext";
import { db } from "../../firebase";
function NewMoment({ store, close }) {
	const [image, setImage] = useState(null);
	const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
	const [rating, onRatingChange] = useState(0);
	const [textInputValue, onTextInputValueChange] = useState("");
	const { moments, setMoments } = useAppContext();

	const handleImageUpload = () => {
		// Implement image upload logic here
		// You can use a library like Expo ImagePicker to handle image selection
	};
	useEffect(() => {
		if (Platform.OS !== "web") {
			requestPermission();
		}
	}, []);

	async function uploadImageAsync(uri) {
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
			const storageRef = ref(storage, `Images/image-${Date.now()} `);
			await uploadBytes(storageRef, blob);

			blob.close();

			return await getDownloadURL(storageRef);
		} catch (e) {
			console.log(e);

			Alert.alert("Error uploading image", "Please try again later");
		}
	}
	const pickImage = async () => {
		if (!status.granted) {
			return Alert.alert("Permission to access camera roll is required!");
		}
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
			// upload image to firebase
			// const url = await uploadImageAsync(result.assets[0].uri);
			// console.log(url);
		}
	};

	const onSubmit = async () => {
		// first upload image to firebase
		var url = "";

		if (image) {
			url = await uploadImageAsync(image);
		}

		// upload to firestore
		const docRef = await addDoc(collection(db, "moments"), {
			text: textInputValue,
			rating: rating,
			image: url,
			store: store.id,
			createdAt: Date.now(),
		});

		// add to local storage, check if there is a key for this store.id
		// if there is, add to the array, if not, create a new key
		// and add the array with the first element
		if (moments[store.id]) {
			setMoments({
				...moments,
				[store.id]: [
					...moments[store.id],
					{
						id: docRef.id,
						text: textInputValue,
						rating: rating,
						image: url,
						createdAt: Date.now(),
					},
				],
			});
		} else {
			setMoments({
				...moments,
				[store.id]: [
					{
						id: docRef.id,
						text: textInputValue,
						rating: rating,
						image: url,
						createdAt: Date.now(),
					},
				],
			});
		}
		close();
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "rgba(0,0,0,0.5)",
			}}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
					className="w-[90%]"
					style={{
						opacity: 1,
						backgroundColor: "white",
						padding: 24,
						borderRadius: 5,
					}}
				>
					<TouchableOpacity
						onPress={close}
						className="absolute top-0 right-0 p-2"
					>
						<Ionicons name="close" size={30} color="black" />
					</TouchableOpacity>
					<Text className="text-xl font-bold">Upload your coffee moment</Text>
					<TextInput
						returnKeyType="done"
						className="border border-gray-300 p-2 rounded-md mt-5 h-32"
						multiline={true}
						placeholder="Enter your review"
						value={textInputValue}
						blurOnSubmit={true}
						onChangeText={onTextInputValueChange}
					/>

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

					<TouchableOpacity
						onPress={handleImageUpload}
						style={{ marginTop: 20 }}
					>
						<Ionicons name="camera" size={30} color="black" />
					</TouchableOpacity>

					<Button title="Pick an image from camera roll" onPress={pickImage} />
					{image && (
						<Image
							source={{ uri: image }}
							style={{ width: 200, height: 200 }}
						/>
					)}
					<Pressable
						className="rounded-md mt-6 text-center py-4  bg-[#CB9363] active:bg-[#85542a] w-full"
						onPress={() => onSubmit()}
					>
						<Text className="text-center text-white font-bold">Submit</Text>
					</Pressable>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

export default NewMoment;
