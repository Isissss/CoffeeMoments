import { useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView } from "react-native";
import StoreItem from "../components/StoreItem";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../AppContext";
import { View } from "react-native";
import { Text } from "react-native";
import { t } from "../I18n";
import { Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export default function Stores({ navigation }) {
	const { colorScheme, data, favorites, getData, connected } = useAppContext();
	const { language } = useAppContext();
	const [refreshing, setRefreshing] = useState(false);
	const [shouldAnimate, setShouldAnimate] = useState(true);
	const [filter, setFilter] = useState("all"); // ["all", "favorites"]
	const [open, setOpen] = useState(false);
	const scrollRef = useRef(null);

	useEffect(() => {
		// set animate to false when filter changes, not the first time
		if (shouldAnimate && filter === "all") return;
		setShouldAnimate(false);
	}, [filter]);

	useEffect(() => {
		// listen to tab touch event
		const unsubscribe = navigation.addListener("tabPress", (e) => {
			// check if current screen is focused, if not return
			if (!navigation.isFocused()) return;

			// scroll to top
			scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
		});

		return unsubscribe;
	}, [navigation]);

	const onRefresh = async () => {
		setRefreshing(true);
		await getData();
		setRefreshing(false);
	};

	return (
		<SafeAreaView className="flex-1">
			<View className="mx-2 z-10">
				<DropDownPicker
					open={open}
					// onOpen={() => setOpen2(false)}
					value={filter}
					style={{
						backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
						borderColor: colorScheme == "dark" ? "#484E58" : "#9ca3af",
					}}
					dropDownContainerStyle={{
						backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
						borderColor: colorScheme == "dark" ? "#484E58" : "#9ca3af",
					}}
					items={[
						{ label: t("dataFilter.all", language), value: "all" },
						{ label: t("dataFilter.favorites", language), value: "favorites" },
					]}
					setOpen={setOpen}
					setValue={setFilter}
					theme={colorScheme == "dark" ? "DARK" : "LIGHT"}
				/>
			</View>
			<Text className="text-black dark:text-white mx-2 my-4 text-2xl font-bold ">
				{t("stores.browseText", language)}
			</Text>

			<FlatList
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						enabled={false}
					/>
				}
				ref={scrollRef}
				data={
					filter == "all"
						? data
						: data.filter((store) => favorites.includes(store.id))
				}
				renderItem={({ item, index }) => (
					<StoreItem
						store={item}
						navigation={navigation}
						index={index}
						shouldAnimate={shouldAnimate}
					/>
				)}
				keyExtractor={(item) => item.id}
			>
				<Text>dd</Text>
			</FlatList>
		</SafeAreaView>
	);
}
