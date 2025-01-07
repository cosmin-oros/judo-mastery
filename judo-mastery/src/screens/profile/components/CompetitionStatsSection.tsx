import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { CompetitionStatsProps } from "@/src/types/types";
import { colors } from "@/src/theme/colors";

const CompetitionStatsSection: React.FC<CompetitionStatsProps> = ({ userData }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("profile.competition-stats")}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={30} color={colors["amber-500"]} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData.goldMedals || 0}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={30} color={colors["slate-500"]} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData.silverMedals || 0}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={30} color={colors["orange-600"]} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData.bronzeMedals || 0}
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
    padding: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
  },

});

export default CompetitionStatsSection;
