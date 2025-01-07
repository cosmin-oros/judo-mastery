import { Stack, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

const Layout = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.primary,
            height: 70,
            paddingBottom: 10,
            paddingTop: 5,
            borderTopWidth: 1,
            borderTopColor: theme.colors.text,
          },
          tabBarActiveTintColor: theme.colors.text, 
          tabBarInactiveTintColor: theme.colors.placeholder,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
          tabBarIconStyle: {
            marginBottom: -2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: t("home.title"),
            tabBarLabel: t("home.title"),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size || 25} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("profile.title"),
            tabBarLabel: t("profile.title"),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size || 25} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});

export default Layout;
