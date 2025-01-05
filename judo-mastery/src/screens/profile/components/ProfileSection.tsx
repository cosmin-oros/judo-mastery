import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BELT_COLORS, ProfileSectionProps } from "@/src/types/types";
import { useTranslation } from "react-i18next";

const ProfileSection: React.FC<ProfileSectionProps> = ({ userData }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const calculateXPProgress = (): number => {
    if (!userData?.statistics?.xp) return 0;
    const currentXP = userData.statistics?.xp || 0;
    const totalXP = 500;
    return (currentXP / totalXP) * 100;
  };

  return (
    <View style={[styles.profileSection, { backgroundColor: theme.colors.card }]}>
      <Ionicons name="person-circle-outline" size={100} color={theme.colors.placeholder} />
      <Text style={[styles.username, { color: theme.colors.text }]}>
        {userData?.firstName || t("profile.default-first-name")}{" "}
        {userData?.name || t("profile.default-last-name")}
      </Text>
      <View style={styles.beltContainer}>
        <View
          style={[
            styles.belt,
            {
              backgroundColor: BELT_COLORS[userData?.beltRank || "white"] || theme.colors.secondary,
              borderColor: theme.colors.text, 
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.beltText, { color: theme.colors.primary }]}>柔道</Text>
        </View>
      </View>
      <Text style={[styles.levelText, { color: theme.colors.text }]}>
        {t("profile.level")}: {userData?.level || 1}
      </Text>
      <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.border }]}>
        <View
          style={[
            styles.progressBar,
            { width: `${calculateXPProgress()}%`, backgroundColor: theme.colors.primary },
          ]}
        />
      </View>
      <Text style={[styles.xpText, { color: theme.colors.text }]}>
        {userData?.statistics?.xp || 0} / 500 XP
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  beltContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: "2%",
  },
  belt: {
    width: "50%",
    height: 25,
    borderRadius: 5,
  },
  beltText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    writingDirection: "rtl",
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: "500",
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  xpText: {
    fontSize: 14,
  },
});

export default ProfileSection;
