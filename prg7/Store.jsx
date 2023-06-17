import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function Store({ route, navigation }) {
  const { store } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          className="ml-0 text-black"
          onPress={() => navigation.navigate("Stores")}
        >
          <Text>Back</Text>
        </Pressable>
      ),
    });
  }, []);

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold text-black dark:text-white">
        {store.title}
      </Text>

      <Pressable onPress={() => navigation.navigate("Map", { store: store })}>
        <Text className="py-4 bg-violet-30 dark:bg-red-300">Go to map</Text>
      </Pressable>
    </View>
  );
}
