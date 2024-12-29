import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const BELT_COLORS: Record<string, string> = {
  white: "#FFFFFF",
  yellow: "#F7DC6F",
  orange: "#F39C12",
  green: "#28B463",
  blue: "#2980B9",
  purple: "#8E44AD",
  brown: "#A0522D",
  black: "#000000",
};

interface UserStatistics {
  xp: number;
  tasks_completed: number;
  techniques_learned: number;
}

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  level: number;
  beltRank: string;
  goals: string;
  competitionsParticipated: string;
  ippons: string;
  wazaAris: string;
  yukos: string;
  goldMedals: string;
  silverMedals: string;
  bronzeMedals: string;
  statistics: UserStatistics;
}

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const data = await getUserDataFromFirestore(user.uid);
        if (data) {
          setUserData(data as UserData);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const calculateXPProgress = (): number => {
    if (!userData?.statistics?.xp) return 0;
    const currentXP = userData.statistics.xp || 0;
    const totalXP = 500; // Example max XP for level
    return (currentXP / totalXP) * 100;
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Topbar */}
      <View style={[styles.topBar, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.topBarTitle}>{t("profile.title")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.card }]}>
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-circle-outline"
              size={100}
              color={theme.colors.placeholder}
              style={styles.avatar}
            />
            <View
              style={[
                styles.beltWrap,
                { borderColor: BELT_COLORS[userData.beltRank] || "#ccc" },
              ]}
            />
          </View>
          <Text style={styles.username}>
            {userData.firstName || t("profile.default-first-name")}{" "}
            {userData.lastName || t("profile.default-last-name")}
          </Text>
          <Text style={styles.levelText}>{t("profile.level")}: {userData.level}</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${calculateXPProgress()}%`, backgroundColor: theme.colors.primary },
              ]}
            />
          </View>
          <Text style={styles.xpText}>
            {userData.statistics.xp} / 500 XP
          </Text>
        </View>

        {/* Achievements Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("profile.achievements")}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={[styles.medalCard, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="medal-outline" size={30} color="gold" />
            <Text style={styles.medalCount}>{userData.goldMedals}</Text>
          </View>
          <View style={[styles.medalCard, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="medal-outline" size={30} color="#C0C0C0" />
            <Text style={styles.medalCount}>{userData.silverMedals}</Text>
          </View>
          <View style={[styles.medalCard, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="medal-outline" size={30} color="#CD7F32" />
            <Text style={styles.medalCount}>{userData.bronzeMedals}</Text>
          </View>
        </ScrollView>

        {/* Statistics Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("profile.statistics")}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="checkmark-done-outline" size={30} color={theme.colors.primary} />
            <Text style={styles.statValue}>{userData.statistics.tasks_completed}</Text>
            <Text style={styles.statLabel}>{t("profile.tasks-completed")}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <MaterialIcons name="school" size={30} color={theme.colors.primary} />
            <Text style={styles.statValue}>{userData.statistics.techniques_learned}</Text>
            <Text style={styles.statLabel}>{t("profile.techniques-learned")}</Text>
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
  topBar: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
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
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    zIndex: 1,
  },
  beltWrap: {
    position: "absolute",
    top: 90,
    left: 10,
    right: 10,
    height: 10,
    borderWidth: 5,
    borderRadius: 20,
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
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 10,
    elevation: 2,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  xpText: {
    fontSize: 14,
    color: "#777",
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
    elevation: 5,
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
    elevation: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#777",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
