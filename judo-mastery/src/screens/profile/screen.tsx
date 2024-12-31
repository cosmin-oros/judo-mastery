import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { BELT_COLORS, UserType } from "@/src/types/types";

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const data = await getUserDataFromFirestore(user.uid);
          setUserData(data as UserType);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const calculateXPProgress = (): number => {
    if (!userData?.statistics?.xp) return 0;
    const currentXP = userData.statistics.xp;
    const totalXP = 500;
    return (currentXP / totalXP) * 100;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {t("common.loading")}
        </Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.errorText, { color: theme.colors.notification }]}>
          {t("profile.no-data")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {t("profile.title")}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="person-circle-outline" size={100} color={theme.colors.placeholder} />
          <Text style={[styles.username, { color: theme.colors.text }]}>
            {userData.firstName || t("profile.default-first-name")}{" "}
            {userData.name || t("profile.default-last-name")}
          </Text>
          <View style={styles.beltContainer}>
            <View
              style={[
                styles.belt,
                { backgroundColor: BELT_COLORS[userData.beltRank] || theme.colors.secondary },
              ]}
            >
              <Text style={[styles.beltText, { color: theme.colors.primary }]}>
                柔道
              </Text>
            </View>
          </View>
          <Text style={[styles.levelText, { color: theme.colors.text }]}>
            {t("profile.level")}: {userData.level}
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
            {userData.statistics.xp} / 500 XP
          </Text>
        </View>

        {/* Achievements Section */}
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

        {/* Statistics Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("profile.statistics")}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="checkmark-done-outline" size={30} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {userData.statistics.tasks_completed}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              {t("profile.tasks-completed")}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <MaterialIcons name="school" size={30} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {userData.statistics.techniques_learned}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              {t("profile.techniques-learned")}
            </Text>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    marginBottom: "3%",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
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
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProfileScreen;
