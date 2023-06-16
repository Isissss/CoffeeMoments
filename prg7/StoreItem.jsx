import { Text, View, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StoreItem({ store, navigation }) {
  const [favorite, setFavorite] = useState(false);

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
    <Pressable
      className="p-4 bg-gray-200 m-3 rounded-b-md border-b-2 border-b-pink-600 space-y-3 active:bg-gray-300"
      onPress={() =>
        navigation.navigate("Store", {
          store: store,
        })
      }
    >
      <Text className={twJoin("font-bold", favorite ?? "bg-emerald-300")}>
        {store.title}
      </Text>
      <Text>{store.description}</Text>

      <Pressable
        onPress={() => toggleFavorite(store.id)}
        className="py-2 active:bg-gray-300 "
      >
        <Text>
          {" "}
          {favorite ? (
            <FontAwesome name="heart" size={18} color={"red"} />
          ) : (
            <FontAwesome name="heart-o" size={18} />
          )}{" "}
        </Text>
      </Pressable>
    </Pressable>
  );
}
