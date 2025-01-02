import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { UserType } from "@/src/types/types";

interface ProfileInfoSectionProps {
  user: UserType | null;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ user }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.row}>
        <Ionicons name="person-circle-outline" size={60} color={theme.colors.primary} />
        <View style={styles.info}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            {t("home.greeting")}, {user?.firstName || t("profile.defaultFirstName")}!
          </Text>
          <Text style={[styles.welcome, { color: theme.colors.placeholder }]}>
            {t("home.welcomeBack")}
          </Text>
        </View>
      </View>
      <View style={styles.beltContainer}>
        <View
          style={[
            styles.belt,
            { backgroundColor: theme.colors.secondary },
          ]}
        >
          <Text style={[styles.beltText, { color: theme.colors.primary }]}>柔道</Text>
        </View>
        <Text style={[styles.levelText, { color: theme.colors.text }]}>
          {t("profile.level")}: {user?.level || 1}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  info: {
    marginLeft: 15,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
  },
  welcome: {
    fontSize: 14,
  },
  beltContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  belt: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  beltText: {
    fontSize: 14,
    fontWeight: "600",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileInfoSection;
