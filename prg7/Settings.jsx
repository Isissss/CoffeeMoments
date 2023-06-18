import { Pressable, Text, Switch, View } from "react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import i18n, { t } from "./I18n";

export default function Settings({ navigation }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value, setValue] = useState(i18n.locale);
  const [theme, setTheme] = useState(colorScheme);
  const [items, setItems] = useState(
    i18n.availableLocales.map((locale) => {
      return { label: locale.languageString, value: locale.code };
    })
  );

  useEffect(() => {
    i18n.locale = value;

    // update all bar labels to new language
    navigation.setParams({
      tabBarLabel: t("settings"),
    });

    // also update own label + title
    navigation.setOptions({
      title: t("settings"),
      tabBarLabel: t("settings"),
    });

    (async () => {
      try {
        await AsyncStorage.setItem("language", value);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [value]);

  useEffect(() => {
    setColorScheme(theme);

    (async () => {
      try {
        await AsyncStorage.setItem("theme", theme);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [theme]);

  return (
    <View className="px-3">
      {/* <Pressable
        onPress={() => toggleColorScheme()}
        className="h-48 items-center justify-center dark:bg-slate-800"
      >
        <Text selectable={false} className="dark:text-blue-300">
          {`${t("hello")} ${colorScheme == "dark" ? "🌙" : "🌞"}`}
        </Text>
      </Pressable> */}

      {/* <Picker
        selectedValue={selectedLanguage}
        themeVariant={colorScheme}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
      >
        {i18n.availableLocales.map((locale) => (
          <Picker.Item
            label={locale.languageString}
            value={locale.code}
            key={locale.code}
            color={colorScheme == "dark" ? "white" : "black"}
          />
        ))}
      </Picker> */}

      <Text className="text-black dark:text-white">{t("languagePicker")}</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        theme={colorScheme == "dark" ? "DARK" : "LIGHT"}
      />
      <DropDownPicker
        open={open2}
        value={theme}
        items={[
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
          { label: "System", value: "system" },
        ]}
        setOpen={setOpen2}
        setValue={setTheme}
        theme={colorScheme == "dark" ? "DARK" : "LIGHT"}
      />
    </View>
  );
}
