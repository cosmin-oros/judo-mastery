import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BELT_COLORS, ProfileSectionProps } from "@/src/types/types";
import { useTranslation } from "react-i18next";
import { replaceRoute } from "@/src/utils/replaceRoute";

// Function to calculate the current level and XP progress
const calculateXPDetails = (xp: number): { level: number; currentXP: number; nextLevelXP: number; progress: number } => {
  const levelCaps = Array.from({ length: 20 }, (_, i) => 500 + 600 * i); // XP thresholds for levels 2-20
  let level = 1;

  for (let i = 0; i < levelCaps.length; i++) {
    if (xp < levelCaps[i]) {
      const previousLevelXP = i === 0 ? 0 : levelCaps[i - 1];
      const progress = ((xp - previousLevelXP) / (levelCaps[i] - previousLevelXP)) * 100;
      return { level, currentXP: xp - previousLevelXP, nextLevelXP: levelCaps[i] - previousLevelXP, progress };
    }
    level++;
  }

  // If XP exceeds all levels, cap it at level 20
  return { level: 20, currentXP: 0, nextLevelXP: 0, progress: 100 };
};

const ProfileSection: React.FC<ProfileSectionProps> = ({ userData }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const userXP = userData?.xp || 0;
  const { level, currentXP, nextLevelXP, progress } = calculateXPDetails(userXP);

  return (
    <View style={[styles.profileSection, { backgroundColor: theme.colors.card }]}>
      <TouchableOpacity
        style={styles.editIconContainer}
        onPress={() => replaceRoute("/(tabs)/profile/edit-profile")}
      >
        <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
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
        {t("profile.level")}: {level}
      </Text>
      <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.border }]}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%`, backgroundColor: theme.colors.primary },
          ]}
        />
      </View>
      <Text style={[styles.xpText, { color: theme.colors.text }]}>
        {currentXP} / {nextLevelXP} XP
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
  editIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
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
