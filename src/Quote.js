import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppContext } from "@react-navigation/native";
import * as Progress from "react-native-progress";

export default function Quote() {
  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getQuote = async () => {
    setIsLoading(true);
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    setQuote(data);
    console.log(data);
    setIsLoading(false);
  };

  return (
    <View style={[styles.container, styles.colors]}>
      <LinearGradient
        // Button Linear Gradient sunset
        colors={["#FFC371", "#FF5F6D"]}
        style={styles.background}
      />
      {isLoading && (
        <Progress.Circle
          size={150}
          indeterminate={true}
          borderWidth={7}
          endAngle={0.3}
          color="black"
        />
      )}
      {!isLoading && (
        <>
          <Text style={styles.quote}> {quote.content} </Text>
          <Text style={styles.author}> - {quote.author} </Text>
          <Pressable onPress={() => getQuote()} disabled={isLoading}>
            <Text style={styles.button}> Get New Quote </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },

  quote: {
    fontSize: 24,
    color: "black",
    marginTop: 30,
    textAlign: "center",
  },

  author: {
    marginBottom: 35,
    marginTop: 10,
    fontStyle: "italic",
  },

  button: {
    fontSize: 20,
    color: "white",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "black",
    overflow: "hidden",
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
