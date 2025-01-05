import EditProfileScreen from "@/src/screens/profile/edit-profile/screen";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Screen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["bottom", "left", "right"]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <EditProfileScreen/>
    </SafeAreaView>
  );
}
