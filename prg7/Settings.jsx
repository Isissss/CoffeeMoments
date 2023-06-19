import { Pressable, Text, Switch, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useContext, useEffect, useState } from "react";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import i18n, { t } from "./I18n";
import { useTheme } from "./ThemeContext";
export default function Settings({ navigation }) {
  // console params
  const bestColor = colorScheme == "dark" ? "white" : "gray";
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(i18n.locale);
  const { theme, setTheme, colorScheme } = useTheme();
  const [items, setItems] = useState(
    i18n.availableLocales.map((locale) => {
      return { label: locale.languageString, value: locale.code };
    })
  );

  useEffect(() => {
    i18n.locale = value;

    // update all bar labels to new language
    navigation.setParams({
      tabBarLabel: t("settings.title"),
    });

    // also update own label + title
    navigation.setOptions({
      title: t("settings.title"),
      tabBarLabel: t("settings.title"),
    });

    (async () => {
      try {
        await AsyncStorage.setItem("language", value);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [value]);

  return (
    <View className="p-3">
      <Text className="text-black dark:text-white mb-2">
        {t("settings.languagePicker")}:
      </Text>
      <DropDownPicker
        open={open}
        zIndex={3000}
        zIndexInverse={1000}
        // onOpen={() => setOpen2(false)}
        value={value}
        style={{ backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff" }}
        textStyle={{
          color: colorScheme == "dark" ? "#fff" : "#000",
        }}
        dropDownContainerStyle={{
          backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
        }}
        dropDownStyle={{
          backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
        }}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        theme={colorScheme == "dark" ? "DARK" : "LIGHT"}
      />

      <Text className="text-black dark:text-neutral-100 mt-10 mb-3">
        {t("settings.themePicker")}:
      </Text>

      <View className="flex-col items-center justify-between">
        <Pressable
          className="p-5 bg-white border-gray-400 dark:border-[#484E58] dark:bg-[#161A22] border border-b-0 rounded-t-lg  flex flex-row"
          onPress={() => setTheme("light")}
        >
          <Text className="flex-1 text-neutral-800 dark:text-neutral-200">
            <Ionicons name="ios-sunny" size={16} /> Light
          </Text>
          {theme == "light" ? (
            <FontAwesome5 name="dot-circle" size={18} color={bestColor} />
          ) : (
            <FontAwesome5 name="circle" size={18} color={bestColor} />
          )}
        </Pressable>
        <Pressable
          className="p-5  bg-white border-gray-400 dark:border-[#484E58] dark:bg-[#161A22] border border-b-0 flex flex-row"
          onPress={() => setTheme("dark")}
        >
          <Text className="flex-1 text-neutral-800 dark:text-neutral-200">
            <Ionicons name="ios-moon" size={16} /> Dark
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
            <MaterialCommunityIcons name="circle-half-full" size={16} />
            System
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
