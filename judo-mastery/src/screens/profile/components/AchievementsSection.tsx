import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { AchievementsSectionProps } from "@/src/types/types";
import { useTranslation } from "react-i18next";
// import { getAchievementDataFromFirestore } from "@/src/firestoreService/achievementsService";

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ userData }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // if (userData.achievements?.length) {
        //   const achievementData = await Promise.all(
        //     userData.achievements.map((id) => getAchievementDataFromFirestore(id))
        //   );
        //   setAchievements(achievementData);
        // }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userData]);

  if (loading) {
    return <ActivityIndicator size="small" color={theme.colors.primary} />;
  }

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t("profile.achievements")}
      </Text>
      {achievements.length === 0 ? (
        <Text style={[styles.noAchievements, { color: theme.colors.text }]}>
          {t("profile.no-achievements")}
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {achievements.map((achievement, index) => (
            <View key={index} style={[styles.achievementCard, { backgroundColor: theme.colors.card }]}>
              <Ionicons name={achievement.icon} size={30} color={theme.colors.primary} />
              <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
                {achievement.title}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
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
  achievementCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
  },
  noAchievements: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: '5%'
  },
});

export default AchievementsSection;
