import React from "react";
import { Stack } from "expo-router";
import TopBar from "@/src/screens/profile/components/Topbar";

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{}}>
        <Stack.Screen
          name="index"
          options={{
            header: () => <TopBar title="Profile"/>,
          }}
        />
      </Stack>
    </>
  );
}
