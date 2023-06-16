 
import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';

 

export default function Store({ route, navigation}) {
    const { store } = route.params;

    
    return (
        <View  className="p-4 bg-violet-300">
            <Text>Stores {store.title} </Text>

            <Pressable onPress={() => navigation.navigate('MapStack', { store: store})}> 
            <Text  className="p-4 bg-violet-300">Go to map</Text>
            </Pressable>
        </View>
    );
}
 
