import WazaListScreen from "@/src/screens/techniques/wazaList/screen";
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
      <WazaListScreen/>
    </SafeAreaView>
  );
}
