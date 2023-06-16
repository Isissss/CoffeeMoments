 
import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';
import {  useColorScheme } from "nativewind";
import { useContext, useEffect } from 'react';
import { themeContext } from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
    const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
    const language = useContext(themeContext);

    useEffect(() => {
        const storeTheme = async () => {
            try {
                await AsyncStorage.setItem('theme', colorScheme)
            } catch (e) {
                // saving error
            }
        }
        storeTheme();
    }, [colorScheme]);
    
        
    return (
        <Pressable
        onPress={toggleColorScheme}
        className="flex-1 items-center justify-center dark:bg-slate-800"
      >
        <Text
          selectable={false}
          className="dark:text-white"
        >
          {`Try clicking me! ${colorScheme === "dark" ? "🌙" : "🌞"}`}
        </Text>
      </Pressable>
    );
}
 
