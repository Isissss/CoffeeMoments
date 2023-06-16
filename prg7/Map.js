import { useState, useEffect, useRef, createRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { useColorScheme } from 'nativewind';


 

export default function Map({ route, navigation}) {
  let store  = null;
   if (route.params?.store) { store = route.params.store; console.log(store); }
  
    const mapRef = createRef();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const { colorScheme  } = useColorScheme();
    const [initRegion, setInitRegion] = useState(
      {
        latitude: 51.9225,
        longitude: 4.47917,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    );

    const [markers, setMarkers] = useState([]);
  
    useEffect(() => {
      console.log(location);
    }, []);


    


    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          console.log(status);
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();

      
      getMarkers();

     
    }, []);

   
 


    const getMarkers =   () => {
      fetch('https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json').then((response) => response.json()).then((json) => { setMarkers(json.hotspots);  }).catch((error) => console.error(error));
    }
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
      console.log(text);
    }
    return (
        <View style={styles.container}>
        <MapView style={styles.map}
        ref={mapRef}
          initialRegion={initRegion}
          userInterfaceStyle={colorScheme}
          showsUserLocation={true}
           onMapReady={() => { 
            if (store) {
              mapRef.current.animateToRegion({
                latitude: store.latitude,
                longitude: store.longitude,
                latitudeDelta: 0.0012,
                longitudeDelta: 0.0021,
              }, 1000);
            }
           } }
        
          >
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
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
      width: '100%',
      height: '100%',
    },
});

