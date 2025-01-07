import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { OtherStatsProps } from "@/src/types/types";

const OtherStatsSection: React.FC<OtherStatsProps> = ({ userData }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("profile.other-stats")}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="sports-kabaddi" size={30} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData.ippons || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            {t("profile.ippons")}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="sports-kabaddi" size={30} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData.wazaAris || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            {t("profile.waza-aris")}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="sports-kabaddi" size={30} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData.yukos || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            {t("profile.yukos")}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="trophy-outline" size={30} color={theme.colors.primary} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {userData.competitionsParticipated || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            {t("profile.competitions-participated")}
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
  statLabel: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default OtherStatsSection;
