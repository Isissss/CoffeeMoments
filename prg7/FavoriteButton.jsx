import { Text, Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { twJoin } from "tailwind-merge";

export default function FavoriteButton({ id, classes }) {
  const [favorite, setFavorite] = useState(false);

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    checkFavorite();
  }, []);

  const removeFavorite = async () => {
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

  const storeFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      if (favorites !== null) {
        // value previously stored
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify([...JSON.parse(favorites), id])
        );
        setFavorite(true);
      } else {
        await AsyncStorage.setItem("favorites", JSON.stringify([id]));
      }
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const checkFavorite = async () => {
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

  const toggleFavorite = async () => {
    if (favorite) {
      removeFavorite();
    } else {
      storeFavorite();
    }
  };

  return (
    <Animated.View
      style={[animatedStyle]}
      className={twJoin("h-9 w-9", classes)}
    >
      <Pressable
        onPress={() => {
          rotation.value = withSequence(
            withTiming(-10, { duration: 100 }),
            withRepeat(withTiming(10, { duration: 150 }), 2, true),
            withTiming(0, { duration: 100 })
          );

          toggleFavorite();
        }}
        className="py-2 active:bg-gray-300 w-9 h-9 rounded-full bg-red-50 flex align-middle justify-center"
      >
        <Text className="text-center">
          {favorite ? (
            <FontAwesome name="heart" size={16} color={"red"} />
          ) : (
            <FontAwesome name="heart-o" size={16} />
          )}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
