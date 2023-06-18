import {
  Text,
  View,
  Pressable,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export default function StoreItem({ store, navigation }) {
  const [favorite, setFavorite] = useState(false);

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    checkFavorite(store.id);
  }, []);

  const removeFavorite = async (id) => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites !== null) {
        // value previously stored
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify([
            ...JSON.parse(favorites).filter((item) => item !== id),
          ])
        );
        setFavorite(false);
      }
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const storeFavorite = async (id) => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites !== null) {
        // value previously stored
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify([...JSON.parse(favorites), id])
        );
      } else {
        await AsyncStorage.setItem("favorites", JSON.stringify([id]));
      }
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const checkFavorite = async (id) => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites !== null) {
        // value previously stored
        if (JSON.parse(favorites).includes(id)) {
          setFavorite(true);
        }
      }
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const toggleFavorite = async (id) => {
    if (favorite) {
      setFavorite(false);
      removeFavorite(id);
    } else {
      setFavorite(true);
      storeFavorite(id);
    }
  };

  if (!store) {
    return <Text>Store not found</Text>;
  }

  return (
    <Animated.View entering={FadeInUp.duration(700).delay(store.id * 100)}>
      <Pressable
        className="bg-gray-200 m-3 rounded-b-md border-b-2 border-b-pink-600 space-y-3  active:bg-gray-300 relative"
        onPress={() =>
          navigation.navigate("Store", {
            store: store,
          })
        }
      >
        <ImageBackground
          // add gradient transparent to black
          className="object-cover w-full h-16"
          source={require("./assets/starb.jpg")}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            className="h-16 border-b-2 border-b-pink-600"
          ></LinearGradient>
            <Animated.View
            style={[animatedStyle]}
            className="w-12 h-12 absolute left-0"
          >
            <Pressable
              onPress={() => {
                rotation.value = withSequence(
                  withTiming(-10, { duration: 100 }),
                  withRepeat(withTiming(10, { duration: 150 }), 2, true),
                  withTiming(0, { duration: 100 })
                );

                toggleFavorite(store.id);
              }}
              className="py-2 active:bg-gray-300 w-12 h-12  rounded-full bg-red-50 flex align-middle justify-center"
            >
              <Text className="text-center">
                {favorite ? (
                  <FontAwesome name="heart" size={18} color={"red"} />
                ) : (
                  <FontAwesome name="heart-o" size={18} />
                )}
              </Text>
            </Pressable>
          </Animated.View>
        </ImageBackground>

        {/* <Animated.Image
          style={{ width: "100%", height: 200, borderRadius: 10 }}
          source={require("./assets/starb.jpg")}
          sharedTransitionTag={`photo-${store.id}`}
        /> */}
        <View className="px-4 my-3 space-y-2">
          <Text className="text-black "> {store.title} </Text>
          <Text className="text-black "> {store.description} </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
