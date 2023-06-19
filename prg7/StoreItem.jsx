import { Text, View, Pressable } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import FavoriteButton from "./FavoriteButton";

export default function StoreItem({ store, navigation }) {
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
        {/* <Animated.Image
          style={{ width: "100%", height: 200, borderRadius: 10 }}
          source={require("./assets/starb.jpg")}
          sharedTransitionTag={`photo-${store.id}`}
        /> */}
        <View className="px-4 my-3 space-y-2">
          <Text className="text-black "> {store.title} </Text>
          <Text className="text-black "> {store.description} </Text>
          <FavoriteButton id={store.id} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
