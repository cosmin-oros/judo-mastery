import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet } from "react-native";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: colors.primary,
        // tabBarInactiveTintColor: colors["gray-400"],
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={23} color={color} />,
        }}
      />
      {/* add more */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: { fontSize: 12, fontWeight: "600" },
});
