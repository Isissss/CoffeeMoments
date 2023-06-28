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
import * as Haptics from "expo-haptics";

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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    <View
      className={twJoin(
        "h-14 w-14 rounded-full bg-neutral-100 shadow",
        classes
      )}
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
        className="py-2 active:bg-gray-300 w-14 h-14 rounded-full flex align-middle justify-center"
      >
        <Animated.Text style={[animatedStyle]} className="text-center">
          {favorite ? (
            <FontAwesome name="heart" size={24} color={"red"} />
          ) : (
            <FontAwesome name="heart-o" size={24} />
          )}
        </Animated.Text>
      </Pressable>
    </View>
  );
}
