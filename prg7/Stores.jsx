 
import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import StoreItem  from './StoreItem';


  
export default function Stores({ navigation }) {
    const [stores, setStores] = useState([]);

    const getMarkers =  () => {
        fetch('https://stud.hosted.hr.nl/1036029/PRG7/hotspots.json').then((response) => response.json()).then((json) => { setStores(json); console.log(json); }).catch((error) => console.error(error));
      }

      useEffect(() => {
        getMarkers();
        }, []);

    return (
        <SafeAreaView>
        <FlatList
        data={stores}
        renderItem={({item}) => <StoreItem store={item} navigation={navigation} />}
        keyExtractor={item => item.title}
        />
        <Text>Stores</Text>
        </SafeAreaView>
    );
}
 
