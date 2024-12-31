import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { StatisticsSectionProps } from "@/src/types/types";
import { useTranslation } from "react-i18next";

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ userData }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("profile.statistics")}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="checkmark-done-outline" size={30} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData?.statistics?.tasks_completed || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            {t("profile.tasks-completed")}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="school" size={30} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData?.statistics?.techniques_learned || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            {t("profile.techniques-learned")}
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
  statCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
  },
});

export default StatisticsSection;
