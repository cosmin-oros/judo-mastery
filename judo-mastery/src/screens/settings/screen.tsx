import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import Header from "./components/Header";
import Option from "./components/Option";
import NavigationOptions from "./components/NavigationOptions";
import { SettingsNavigationOption } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { darkTheme } from "@/src/theme/themes";
import { showAlert } from "@/src/utils/showAlert";
import { useAuth } from "@/src/provider/auth/AuthProvider";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === darkTheme);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // 1) Pull in the user object and the deleteAccount function
  const { user, logout, deleteAccount } = useAuth();

  useEffect(() => {
    // Check initial notification permissions on mount
    const checkNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        setNotificationsEnabled(false);
      }
    };
    checkNotificationPermissions();
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  // Toggle Notifications
  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("settings.notifications"), t("settings.enableNotificationPermission"));
        return;
      }
      setNotificationsEnabled(true);
      Alert.alert(t("settings.notifications"), t("settings.notificationsEnabled"));
    } else {
      setNotificationsEnabled(false);
      Alert.alert(t("settings.notifications"), t("settings.notificationsDisabled"));
    }
  };

  // Privacy Policy
  const handlePrivacyPolicy = () => {
    const privacyUrl = "https://www.freeprivacypolicy.com/live/c6286749-afcf-4df3-bc12-f99b25d7e46e";
    Linking.openURL(privacyUrl).catch(() => {
      showAlert("Privacy Policy", "Unable to open the privacy policy link.");
    });
  };

  // Feedback
  const handleFeedback = () => {
    showAlert(t("settings.feedbackTitle"), t("settings.feedbackMessage"));
  };

  // Reset Account
  const handleResetAccount = () => {
    if (!user?.uid) {
      showAlert(t("settings.errorTitle"), t("settings.userNotAuthenticated"));
      return;
    }

    Alert.alert(
      t("settings.resetAccountTitle"),
      t("settings.resetAccountMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.ok"),
          onPress: async () => {
            try {
              // Call deleteAccount from AuthProvider
              await deleteAccount();
              showAlert(
                t("settings.resetAccountSuccessTitle"),
                t("settings.resetAccountSuccessMessage")
              );
              // Optionally, you can also navigate or logout here
              // e.g., await logout();
            } catch (error) {
              console.error("Error resetting account:", error);
              showAlert(
                t("settings.resetAccountErrorTitle"),
                t("settings.resetAccountErrorMessage")
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Logout
  const handleLogout = () => {
    Alert.alert(
      t("settings.logoutTitle"),
      t("settings.logoutMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.ok"),
          onPress: async () => {
            try {
              await logout();
              showAlert(t("settings.logoutSuccessTitle"), t("settings.logoutSuccessMessage"));
            } catch (error) {
              console.error("Logout error:", error);
              showAlert(t("settings.logoutErrorTitle"), t("settings.logoutErrorMessage"));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Navigation Options
  const navigationOptions: SettingsNavigationOption[] = [
    {
      label: t("settings.language"),
      icon: "globe-outline" as keyof typeof Ionicons.glyphMap,
      route: "/settings/settings-language-selection",
    },
    {
      label: t("settings.privacyPolicy"),
      icon: "document-text-outline" as keyof typeof Ionicons.glyphMap,
      action: handlePrivacyPolicy,
    },
    {
      label: t("settings.feedback"),
      icon: "chatbubble-outline" as keyof typeof Ionicons.glyphMap,
      action: handleFeedback,
    },
    {
      label: t("settings.resetAccount"),
      icon: "refresh-outline" as keyof typeof Ionicons.glyphMap,
      action: handleResetAccount,
    },
    {
      label: t("settings.logout"),
      icon: "log-out-outline" as keyof typeof Ionicons.glyphMap,
      action: handleLogout,
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Header title={t("settings.title")} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Dark Mode Toggle */}
        <Option
          icon="moon"
          label={t("settings.darkMode")}
          isSwitch
          switchValue={isDarkMode}
          onSwitchToggle={toggleDarkMode}
        />

        {/* Notifications Toggle */}
        <Option
          icon="notifications-outline"
          label={t("settings.notifications")}
          isSwitch
          switchValue={notificationsEnabled}
          onSwitchToggle={toggleNotifications}
        />

        {/* Navigation Options */}
        <NavigationOptions options={navigationOptions} onNavigate={replaceRoute} />

        {/* Version Label */}
        <Text style={[styles.versionText, { color: theme.colors.text }]}>
          {t("settings.appVersion", { version: "1.0.0" })}
        </Text>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

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
