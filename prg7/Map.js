import { useState, useEffect, useRef, createRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useColorScheme } from "nativewind";
import { Button } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Map({ route, navigation }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // subscribe to unfocus event

    const unsubscribe = navigation.addListener("blur", () => {
      navigation.setParams({ store: null });
      navigation.setOptions({ headerLeft: null });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!route.params?.store) return;

    mapRef.current.animateToRegion(
      {
        latitude: route.params.store.latitude,
        longitude: route.params.store.longitude,
        latitudeDelta: 0.0002,
        longitudeDelta: 0.0021,
      },
      1000
    );

    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          className="ml-5"
          onPress={() =>
            navigation.navigate("Store", { store: route.params.store })
          }
        >
          <Text>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colorScheme == "dark" ? "white" : "black"}
            />
          </Text>
        </Pressable>
      ),
    });
  }, [route.params?.store]);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { colorScheme } = useColorScheme();
  const [region, setRegion] = useState({
    latitude: 51.92442,
    longitude: 4.477733,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0321,
  });

  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.log(status);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    getMarkers();
  }, []);

  useEffect(() => {
    // listen to tab touch event
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // check if current screen is focused, if not return
      if (!navigation.isFocused()) return;

      // scroll to top
      mapRef.current.animateToRegion(
        {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0321,
        },
        1000
      );
    });

    return unsubscribe;
  }, [navigation]);

  const getMarkers = () => {
    fetch("https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json")
      .then((response) => response.json())
      .then((json) => {
        setMarkers(json.hotspots);
      })
      .catch((error) => console.error(error));
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log(text);
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        showsCompass={true}
        initialRegion={region}
        userInterfaceStyle={colorScheme}
        showsUserLocation={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
