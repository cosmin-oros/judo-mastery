import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import Header from "./components/Header";
import Option from "./components/Option";
import NavigationOptions from "./components/NavigationOptions";
import { SettingsNavigationOption } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Notification logic goes here
  };

  const navigationOptions: SettingsNavigationOption[] = [
    { label: t("settings.language"), icon: "globe-outline" as keyof typeof Ionicons.glyphMap, route: "/language" },
    { label: t("settings.rateApp"), icon: "star-outline" as keyof typeof Ionicons.glyphMap, route: "/rate-app" },
    { label: t("settings.privacyPolicy"), icon: "document-text-outline" as keyof typeof Ionicons.glyphMap, route: "/privacy-policy" },
    { label: t("settings.shareApp"), icon: "share-outline" as keyof typeof Ionicons.glyphMap, route: "/share-app" },
    { label: t("settings.feedback"), icon: "chatbubble-outline" as keyof typeof Ionicons.glyphMap, route: "/feedback" },
    { label: t("settings.helpCenter"), icon: "help-circle-outline" as keyof typeof Ionicons.glyphMap, route: "/help-center" },
    { label: t("settings.resetAccount"), icon: "refresh-outline" as keyof typeof Ionicons.glyphMap, route: "/reset-account" },
    { label: t("settings.logout"), icon: "log-out-outline" as keyof typeof Ionicons.glyphMap, route: "/logout" },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Header title={t("settings.title")} />

      <ScrollView contentContainerStyle={styles.container}>
        <Option
          icon="moon"
          label={t("settings.darkMode")}
          isSwitch
          switchValue={isDarkMode}
          onSwitchToggle={toggleDarkMode}
        />
        <Option
          icon="notifications-outline"
          label={t("settings.notifications")}
          isSwitch
          switchValue={notificationsEnabled}
          onSwitchToggle={toggleNotifications}
        />
        <NavigationOptions options={navigationOptions} onNavigate={replaceRoute} />

        <Text style={[styles.versionText, { color: theme.colors.text }]}>
          {t("settings.appVersion", { version: "1.0.0" })}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  versionText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
});

export default SettingsScreen;
