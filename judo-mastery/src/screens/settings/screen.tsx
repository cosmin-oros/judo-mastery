import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";

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
  };

  const handleNavigation = (route: string) => {
    // Replace this with your navigation logic
    console.log(`Navigate to ${route}`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t("settings.title")}
        </Text>

        {/* Dark Mode */}
        <View style={styles.optionContainer}>
          <MaterialIcons name="brightness-6" size={24} color={theme.colors.primary} />
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
          <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
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
        {[
          { label: t("settings.language"), route: "Language" },
          { label: t("settings.rateApp"), route: "RateApp" },
          { label: t("settings.privacyPolicy"), route: "PrivacyPolicy" },
          { label: t("settings.shareApp"), route: "ShareApp" },
          { label: t("settings.feedback"), route: "Feedback" },
          { label: t("settings.helpCenter"), route: "HelpCenter" },
          { label: t("settings.resetAccount"), route: "ResetAccount" },
          { label: t("settings.logout"), route: "Logout" },
        ].map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => handleNavigation(option.route)}
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.colors.primary}
              style={styles.iconRight}
            />
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {option.label}
            </Text>
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
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
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
