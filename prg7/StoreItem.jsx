import { Text, View, Pressable } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import FavoriteButton from "./FavoriteButton";
import { FontAwesome5 } from "@expo/vector-icons";

export default function StoreItem({ shouldAnimate, store, navigation, index }) {
  if (!store) {
    return <Text>Store not found</Text>;
  }

  return (
    <Animated.View
      entering={
        !shouldAnimate ? null : FadeInUp.duration(700).delay(index * 100)
      }
    >
      <Pressable
        className="bg-gray-200 m-3 rounded-lg space-y-3 active:bg-gray-300 relative "
        onPress={() =>
          navigation.navigate("Store", {
            store: store,
          })
        }
      >
        {/* <Animated.Image
          style={{ width: "100%", height: 200, borderRadius: 10 }}
          source={require("./assets/starb.jpg")}
          sharedTransitionTag={`photo-${store.id}`}
        /> */}
        <View className="flex-col">
          <View className="px-4 my-3 space-y-2 flex-row">
            <Text className="flex-1"> {store.title} </Text>
            {/* <Text> {store.description} </Text> */}
            <FontAwesome5 name="chevron-right" size={12} />
          </View>
          <View>
            <FavoriteButton id={store.id} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
