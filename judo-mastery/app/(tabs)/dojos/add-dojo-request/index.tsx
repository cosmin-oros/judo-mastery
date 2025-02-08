import AddDojoRequest from "@/src/screens/dojos/add-dojo-request/screen";
import TechniqueListScreen from "@/src/screens/techniques/techniqueList/screen";
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
      <AddDojoRequest/>
    </SafeAreaView>
  );
}
