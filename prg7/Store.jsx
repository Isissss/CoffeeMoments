import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import {
  Alert,
  Button,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "./I18n";

export default function Store({ route, navigation }) {
  const { store } = route.params;
  const { colorScheme } = useColorScheme();
  console.log(store);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          className="ml-0 text-black"
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
    <>
      {/* <Animated.Image
        className="object-cover w-full h-64"
        source={require("./assets/starb.jpg")}
        sharedTransitionTag={`photo-${store.id}`}
      /> */}
      <ImageBackground
        sharedTransitionTag={store.id}
        className="object-cover w-full h-64"
        source={require("./assets/starb.jpg")}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          className="h-64 "
        ></LinearGradient>
      </ImageBackground>

      <View className="p-4">
        <Text className="text-2xl font-bold text-black dark:text-white">
          {store.title}
        </Text>

        <Text className="text-gray-500 dark:text-gray-400 mb-6">
          <Ionicons
            name="location"
            size={18}
            color={colorScheme == "dark" ? "darkgray" : "gray"}
          />
          {store.address}
        </Text>

        <Pressable onPress={() => navigation.navigate("Map", { store: store })}>
          <Text className="py-4 bg-violet-30 dark:bg-red-300">
            {t("goToMap")}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
