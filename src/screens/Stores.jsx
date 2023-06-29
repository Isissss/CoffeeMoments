import { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import StoreItem from "../components/StoreItem";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../AppContext";
import { View } from "react-native";
import { Text } from "react-native";
import { t } from "../I18n";

export default function Stores({ navigation }) {
  const { colorScheme, data } = useAppContext();
  const [stores, setStores] = useState([]);
  const { language } = useAppContext();

  const [favorites, setFavorites] = useState([]);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [filter, setFilter] = useState("all"); // ["all", "favorites"]
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    // get favorites from storage
    AsyncStorage.getItem("favorites").then((favorites) => {
      if (favorites !== null) {
        setFavorites(JSON.parse(favorites));
      }
    });
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="mx-2">
        <DropDownPicker
          open={open}
          // onOpen={() => setOpen2(false)}
          value={filter}
          zIndex={5000}
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
      </View>
      <Text className="text-black dark:text-white mx-2 my-4 text-2xl font-bold">
        {t("stores.browseText", language)}
      </Text>

      <FlatList
        ref={scrollRef}
        data={
          filter == "all"
            ? data
            : data.filter((store) => favorites.includes(store.id))
        }
        renderItem={({ item }) => (
          <StoreItem store={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
      >
        <Text>dd</Text>
      </FlatList>
    </SafeAreaView>
  );
}
