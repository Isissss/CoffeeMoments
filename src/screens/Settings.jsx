import { Pressable, Text, Switch, View, Image } from "react-native";
import { useColorScheme } from "nativewind";
import { useContext, useEffect, useState } from "react";

import {
	FontAwesome5,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import i18n, { t } from "../I18n";
import { useAppContext } from "../AppContext";

export default function Settings({ navigation }) {
	// console params
	const bestColor = colorScheme == "dark" ? "white" : "gray";
	const [open, setOpen] = useState(false);
	const { theme, setTheme, colorScheme, language, setLanguage } =
		useAppContext();

	const items = i18n.availableLocales.map((locale) => {
		return { label: locale.languageString, value: locale.code };
	});

	return (
		<View className="p-3 flex-1">
			<Image
				source={require("../../assets/beans.png")}
				className="absolute bottom-0 right-0  opacity-70 w-1/2 h-1/2"
			/>
			<Text className="text-black dark:text-white mb-2">
				{t("settings.languagePicker", language)}:
			</Text>
			<DropDownPicker
				open={open}
				zIndex={3000}
				modalAnimationType="fade"
				listMode="MODAL"
				zIndexInverse={1000}
				// onOpen={() => setOpen2(false)}
				value={language}
				style={{
					backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
					borderColor: colorScheme == "dark" ? "#484E58" : "#9ca3af",
				}}
				dropDownContainerStyle={{
					backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
					borderColor: colorScheme == "dark" ? "#484E58" : "#9ca3af",
				}}
				items={items}
				setOpen={setOpen}
				setValue={setLanguage}
				theme={colorScheme == "dark" ? "DARK" : "LIGHT"}
			/>

			<Text className="text-black dark:text-neutral-100 mt-10 mb-3">
				{t("settings.themePicker", language)}:
			</Text>

			<View className="flex-col items-center justify-between">
				<Pressable
					className="p-5 bg-white border-gray-400 dark:border-[#484E58] dark:bg-[#161A22] border border-b-0 rounded-t-lg  flex flex-row"
					onPress={() => setTheme("light")}
				>
					<Text className="flex-1 text-neutral-800 dark:text-neutral-200">
						<Ionicons name="ios-sunny" size={16} />{" "}
						{t("settings.lightMode", language)}
					</Text>
					{theme == "light" ? (
						<FontAwesome5 name="dot-circle" size={18} color={bestColor} />
					) : (
						<FontAwesome5 name="circle" size={18} color={bestColor} />
					)}
				</Pressable>
				<Pressable
					className="p-5 bg-white border-gray-400 dark:border-[#484E58] dark:bg-[#161A22] border border-b-0 flex flex-row"
					onPress={() => setTheme("dark")}
				>
					<Text className="flex-1 text-neutral-800 dark:text-neutral-200">
						<Ionicons name="ios-moon" size={16} />{" "}
						{t("settings.darkMode", language)}
					</Text>
					{theme == "dark" ? (
						<FontAwesome5 name="dot-circle" size={18} color={bestColor} />
					) : (
						<FontAwesome5 name="circle" size={18} color={bestColor} />
					)}
				</Pressable>
				<Pressable
					className="p-5  bg-white border-gray-400 dark:border-[#484E58] dark:bg-[#161A22] border rounded-b-lg flex flex-row"
					onPress={() => setTheme("system")}
				>
					<Text className="flex-1 text-neutral-800 dark:text-neutral-200">
						<MaterialCommunityIcons name="circle-half-full" size={16} />{" "}
						{t("settings.system", language)}
					</Text>
					{theme == "system" ? (
						<FontAwesome5 name="dot-circle" size={18} color={bestColor} />
					) : (
						<FontAwesome5 name="circle" size={18} color={bestColor} />
					)}
				</Pressable>
			</View>
		</View>
	);
}
