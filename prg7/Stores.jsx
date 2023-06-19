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
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./ThemeContext";

export default function Stores({ navigation }) {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [filter, setFilter] = useState("all"); // ["all", "favorites"]
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const { colorScheme } = useTheme();

  useEffect(() => {
    getMarkers();
  }, []);

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

  useEffect(() => {
    (async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites !== null) {
          // value previously stored
          setFavorites(JSON.parse(favorites));
        }
      } catch (e) {
        console.log(e);
        // saving error
      }
    })();

    if (filter == "all" || shouldAnimate == false) return;
    setShouldAnimate(false);
  }, [filter]);

  const getMarkers = () => {
    fetch("https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json")
      .then((response) => response.json())
      .then((json) => {
        setStores(json.hotspots);
        setFilteredStores(json.hotspots);
      })
      .catch((error) => console.error(error));
  };

  return (
    <SafeAreaView>
      <DropDownPicker
        open={open}
        // onOpen={() => setOpen2(false)}
        value={filter}
        style={{
          backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
          borderColor: colorScheme == "dark" ? "#484E58" : "#9ca3af",
        }}
        dropDownContainerStyle={{
          backgroundColor: colorScheme == "dark" ? "#161A22" : "#fff",
          borderColor: colorScheme == "dark" ? "#484E58" : "#9ca3af",
        }}
        items={[
          { label: "All", value: "all" },
          { label: "Favorites", value: "favorites" },
        ]}
        setOpen={setOpen}
        setValue={setFilter}
        theme={colorScheme == "dark" ? "DARK" : "LIGHT"}
      />
      <FlatList
        ref={scrollRef}
        data={
          filter == "all"
            ? stores
            : stores.filter((store) => favorites.includes(store.id))
        }
        renderItem={({ item, index }) => (
          <StoreItem
            store={item}
            navigation={navigation}
            shouldAnimate={shouldAnimate}
            index={index}
          />
        )}
        keyExtractor={(item) => item.title}
      />
    </SafeAreaView>
  );
}
