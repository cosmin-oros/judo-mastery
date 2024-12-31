import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { AchievementsSectionProps } from "@/src/types/types";
import { useTranslation } from "react-i18next";
import { colors } from "@/src/theme/colors";

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ userData }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("profile.achievements")}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={[styles.medalCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={30} color={theme.colors.primary} />
          <Text style={[styles.medalCount, { color: theme.colors.text }]}>
            {userData.goldMedals}
          </Text>
        </View>
        <View style={[styles.medalCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={30} color={colors["slate-500"]} />
          <Text style={[styles.medalCount, { color: theme.colors.text }]}>
            {userData.silverMedals}
          </Text>
        </View>
        <View style={[styles.medalCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={30} color={colors["amber-500"]} />
          <Text style={[styles.medalCount, { color: theme.colors.text }]}>
            {userData.bronzeMedals}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  medalCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  medalCount: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
  },
});

export default AchievementsSection;
