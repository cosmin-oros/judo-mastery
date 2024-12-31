import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme(); // Update the app theme
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Implement your notification logic
  };

  const handleNavigation = (route: string) => {
    replaceRoute(route); // Use the provided replaceRoute function
  };

  const navigationOptions: { label: string; icon: keyof typeof Ionicons.glyphMap; route: string }[] =
    [
      { label: t("settings.language"), icon: "globe-outline", route: "/language" },
      { label: t("settings.rateApp"), icon: "star-outline", route: "/rate-app" },
      { label: t("settings.privacyPolicy"), icon: "document-text-outline", route: "/privacy-policy" },
      { label: t("settings.shareApp"), icon: "share-outline", route: "/share-app" },
      { label: t("settings.feedback"), icon: "chatbubble-outline", route: "/feedback" },
      { label: t("settings.helpCenter"), icon: "help-circle-outline", route: "/help-center" },
      { label: t("settings.resetAccount"), icon: "refresh-outline", route: "/reset-account" },
      { label: t("settings.logout"), icon: "log-out-outline", route: "/logout" },
    ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Back Button and Title */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity onPress={() => replaceRoute("/(tabs)/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t("settings.title")}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Dark Mode */}
        <View style={styles.optionContainer}>
          <Feather name="moon" size={24} color={theme.colors.primary} />
          <Text style={[styles.optionText, { color: theme.colors.text }]}>
            {t("settings.darkMode")}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            thumbColor={isDarkMode ? theme.colors.primary : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: theme.colors.primary }}
          />
        </View>

        {/* Notifications */}
        <View style={styles.optionContainer}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.optionText, { color: theme.colors.text }]}>
            {t("settings.notifications")}
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={notificationsEnabled ? theme.colors.primary : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: theme.colors.primary }}
          />
        </View>

        {/* Navigation Options */}
        {navigationOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => handleNavigation(option.route)}
          >
            <Ionicons name={option.icon} size={24} color={theme.colors.primary} />
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {option.label}
            </Text>
            <AntDesign name="right" size={18} color={theme.colors.primary} style={styles.iconRight} />
          </TouchableOpacity>
        ))}

        {/* App Version */}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    elevation: 2,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 15,
  },
  iconRight: {
    marginLeft: "auto",
  },
  versionText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
});

export default SettingsScreen;
