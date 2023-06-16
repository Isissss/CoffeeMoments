import { Text, View, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { twJoin } from 'tailwind-merge';


export default function StoreItem ({store, navigation})  {
    const [favorite, setFavorite] = useState(false);

    const addToFavorites = (title) => {
        Alert.alert(
            "Add to favorites",
            "Are you sure you want to add " + title + " to your favorites?",
            [
                {
                    text: "Cancel",
                    onPress: () =>  {
                        console.log("Cancel Pressed"); 
                    },
                    style: "cancel"
                },
                {
                text: "OK",
                onPress: () => {
                    console.log("OK Pressed");
                    setFavorite(!favorite);
                }
    
                }
            ]
        );
    }

   return <View  className="p-4 bg-gray-200 m-3 rounded-b-md border-b-2 border-b-stone-800">
    <Pressable onPress={() => navigation.navigate('Store', { 
        store: store
    })}>
      <Text className={twJoin('font-bold', favorite ? 'bg-red-300' : 'bg-emerald-200')}>{store?.title}</Text>
    </Pressable>
    <Pressable onPress={() => addToFavorites(store?.title)} className="bg-red-300" > 
   <Text> {favorite ? 'Remove from favorites' : 'Add to favorites'}</Text>
    </Pressable>
    </View>
};