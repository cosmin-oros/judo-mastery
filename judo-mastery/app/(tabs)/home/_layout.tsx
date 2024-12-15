import React from "react";
import { Stack } from "expo-router";
import { Image } from "react-native";
import TopBar from "@/src/screens/components/Topbar";

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{}}>
        <Stack.Screen
          name="index"
          options={{
            header: () => <TopBar />,
          }}
        />
      </Stack>
    </>
  );
}
