import { useEffect } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "../I18n";
import FavoriteButton from "../components/FavoriteButton";
import { useTheme } from "../ThemeContext";

export default function Store({ route, navigation }) {
  const { store } = route.params;
  const { colorScheme, language, connected } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          className="text-black"
          onPress={() => navigation.navigate("Stores")}
        >
          <Text>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colorScheme == "dark" ? "white" : "black"}
            />
          </Text>
        </Pressable>
      ),
    });
  }, []);

  return (
    <View className="relative flex-1">
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

      <View className="absolute top-52 p-6 bg-neutral-100 dark:bg-neutral-900 h-full w-full rounded-t-[30]">
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
          <View className="flex-row space-x-1 my-5">
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star" size={24} color="gold" />
            <Ionicons name="star" size={24} color="gold" />
            <Text className="py-1 pl-1">5/5</Text>
          </View>
          <Text className="text-black dark:text-white">
            {store.description}
          </Text>
        </Animated.View>

        <Pressable
          disabled={!connected}
          onPress={() => navigation.navigate("Map", { store: store })}
          className="rounded-md mt-6 w-28 text-center py-4"
          style={{ backgroundColor: connected ? "#0B421A" : "#D1D5DB" }}
        >
          <Text className=" w-28 text-center rounded-md text-white">
            {t("goToMap", language)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
