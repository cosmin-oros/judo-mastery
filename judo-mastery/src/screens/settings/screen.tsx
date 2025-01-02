import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import Header from "./components/Header";
import Option from "./components/Option";
import NavigationOptions from "./components/NavigationOptions";
import { SettingsNavigationOption, UserType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { darkTheme } from "@/src/theme/themes";
import { showAlert } from "@/src/utils/showAlert";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { saveUserDataToFirestore } from "@/src/firestoreService/userDataService";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === darkTheme);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check initial notification permissions on component mount
    const checkNotificationPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        setNotificationsEnabled(false);
      }
    };
    checkNotificationPermissions();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("settings.notifications"),
          t("settings.enableNotificationPermission"),
        );
        return;
      }
      // Enable notifications
      setNotificationsEnabled(true);
      Alert.alert(t("settings.notifications"), t("settings.notificationsEnabled"));
    } else {
      // Disable notifications
      setNotificationsEnabled(false);
      Alert.alert(t("settings.notifications"), t("settings.notificationsDisabled"));
    }
  };

  const handleRateApp = () => {
    // ! implement when the app will be on the market
    showAlert("Rate App", "Still in development");
  };

  const handlePrivacyPolicy = () => {
    // ! replace with actual one and use i18n
    Linking.openURL("https://your-privacy-policy-url.com").catch(() => {
      showAlert("Privacy Policy", "Unable to open the privacy policy.");
    });
  };

  const handleShareApp = () => {
    // ! implement when the app will be on the market
    showAlert("Share App", "Still in development");
  };

  const handleFeedback = () => {
    // ! implement when the app will be on the market
    showAlert("Feedback", "Still in development");
  };

  const handleHelpCenter = () => {
    // ! replace with actual one and use i18n
    Linking.openURL("https://your-help-center-url.com").catch(() => {
      showAlert("Help Center", "Unable to open the help center.");
    });
  };

  const handleResetAccount = () => {

    if (!user?.uid) {
      showAlert(t("settings.errorTitle"), t("settings.userNotAuthenticated"));
      return;
    }

    const defaultUserData: Partial<UserType> = {
      achievements: [],
      beltRank: "white",
      daily_tasks: [],
      icon: 1,
      level: 1,
      statistics: {
        tasks_completed: 0,
        techniques_learned: 0,
        xp: 0,
      },
      experience: "",
      trainingFrequency: 0,
      goals: "",
      trainingFocus: "",
      favoriteTechniques: "",
      competitionsParticipated: "",
      ippons: "0",
      wazaAris: "0",
      yukos: "0",
      goldMedals: "0",
      silverMedals: "0",
      bronzeMedals: "0",
    };

    showAlert(
      t("settings.resetAccountTitle"),
      t("settings.resetAccountMessage"),
      async () => {
        try {
          await saveUserDataToFirestore({ ...user, ...defaultUserData });
          showAlert(
            t("settings.resetAccountSuccessTitle"),
            t("settings.resetAccountSuccessMessage")
          );
        } catch (error) {
          console.error("Error resetting account:", error);
          showAlert(
            t("settings.resetAccountErrorTitle"),
            t("settings.resetAccountErrorMessage")
          );
        }
      }
    );
  };

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

  const navigationOptions: SettingsNavigationOption[] = [
    {
      label: t("settings.language"),
      icon: "globe-outline" as keyof typeof Ionicons.glyphMap,
      route: "/settings/settings-language-selection",
    },
    {
      label: t("settings.rateApp"),
      icon: "star-outline" as keyof typeof Ionicons.glyphMap,
      action: handleRateApp,
    },
    {
      label: t("settings.privacyPolicy"),
      icon: "document-text-outline" as keyof typeof Ionicons.glyphMap,
      action: handlePrivacyPolicy,
    },
    {
      label: t("settings.shareApp"),
      icon: "share-outline" as keyof typeof Ionicons.glyphMap,
      action: handleShareApp,
    },
    {
      label: t("settings.feedback"),
      icon: "chatbubble-outline" as keyof typeof Ionicons.glyphMap,
      action: handleFeedback,
    },
    {
      label: t("settings.helpCenter"),
      icon: "help-circle-outline" as keyof typeof Ionicons.glyphMap,
      action: handleHelpCenter,
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
