import { BackHandler, Button, StatusBar  } from "react-native";
import Counter from "./Counter";
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from "./Map";
import { MaterialIcons } from '@expo/vector-icons';
import Settings from "./Settings";
import Stores from "./Stores";
import Store from "./Store";
import { createContext, useState , useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export const themeContext = createContext('light');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function Home() { 
 
  return (
  
    <Tab.Navigator>
         <Tab.Screen name="Stores" component={Stores} options={{
         tabBarIcon: ({ color }) => (
          <MaterialIcons name="house" color={color} size={26} />
        ),
      }}  />
      <Tab.Screen name="Map" component={Map} options={{
         tabBarIcon: ({ color }) => (
          <MaterialIcons name="map" color={color} size={26} />
        ), 
      }}  
      />
           <Tab.Screen name="Feed" component={Counter} options={{
         tabBarIcon: ({ color }) => (
          <MaterialIcons name="favorite-outline" color={color} size={26} />
        ), 
      }} 
      />
      <Tab.Screen name="Settings" component={Settings} options={{
         tabBarIcon: ({ color }) => (
          <MaterialIcons name="settings" color={color} size={26} />
        ),
      }} />
    </Tab.Navigator>
    
  );
}
 
 

export default function App() {
  const [theme, setTheme] = useState('hello');
  const { setColorScheme, colorScheme, } = useColorScheme();

  useEffect(() => {
    (async () => {
      try { 
        const value = await AsyncStorage.getItem('theme');
        console.log(value);
        if (value !== null) {
          setColorScheme(value);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('theme',  colorScheme);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [colorScheme]);

  return (
    <>
     <themeContext.Provider value={{ theme, setTheme }}>
      <NavigationContainer theme={colorScheme == 'dark' ? DarkTheme : DefaultTheme} >
        <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
            name="Store"
            component={Store}  
            options={({ route }) => ({ title: route.params.store.title })}


         
            />
            {/* <Stack.Screen
            name="MapStack"
            component={Map}
            options={{ 
              headerTitle: 'Map'
            }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
      </themeContext.Provider>
      <StatusBar barStyle={ colorScheme === 'dark' ? 'light-content' : 'dark-content'} /> 
    </>
  );
}
