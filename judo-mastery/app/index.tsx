import { View, Image } from "react-native";
import { Stack } from "expo-router";
import React from "react";

export default function Index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{ resizeMode: "contain", flex: 1 }}
        />
      </View>
    </>
  );
}
