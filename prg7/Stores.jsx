import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import StoreItem from "./StoreItem";
import { useScrollToTop } from "@react-navigation/native";

export default function Stores({ navigation }) {
  const [stores, setStores] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // listen to tab touch event
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // check if current screen is focused, if not return
      if (!navigation.isFocused()) return;

      // scroll to top
      scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    return unsubscribe;
  }, [navigation]);

  const getMarkers = () => {
    fetch("https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json")
      .then((response) => response.json())
      .then((json) => {
        setStores(json.hotspots);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getMarkers();
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        ref={scrollRef}
        data={stores}
        renderItem={({ item }) => (
          <StoreItem store={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.title}
      />
      <Text>Stores</Text>
    </SafeAreaView>
  );
}
