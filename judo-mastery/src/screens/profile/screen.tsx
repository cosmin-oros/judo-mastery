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

// Define UserStatistics interface
interface UserStatistics {
  xp: number;
  tasks_completed: number;
  techniques_learned: number;
}

// Define UserData interface
interface UserData {
  uid: string;
  firstName?: string;
  name?: string;
  level: number;
  beltRank: keyof typeof BELT_COLORS;
  goldMedals: string;
  silverMedals: string;
  bronzeMedals: string;
  statistics: UserStatistics;
}

const BELT_COLORS = {
  white: "#FFFFFF",
  yellow: "#F7DC6F",
  orange: "#F39C12",
  green: "#28B463",
  blue: "#2980B9",
  brown: "#A0522D",
  black: "#000000",
};

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const data = await getUserDataFromFirestore(user.uid);
          setUserData(data as UserData); // Type assertion to match UserData
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
    const totalXP = 500; // Example threshold for level up
    return (currentXP / totalXP) * 100;
    // ! gonna modify the logic later
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{t("profile.no-data")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>{t("profile.title")}</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.card }]}>
          <Ionicons
            name="person-circle-outline"
            size={100}
            color={theme.colors.placeholder}
          />
          <Text style={styles.username}>
            {userData.firstName || t("profile.default-first-name")}{" "}
            {userData.name || t("profile.default-last-name")}
          </Text>
          <View style={styles.beltContainer}>
            <View
              style={[
                styles.belt,
                { backgroundColor: BELT_COLORS[userData.beltRank] },
              ]}
            >
              <Text
                style={[
                  styles.beltText,
                  { color: theme.colors.primary, fontFamily: "Hiragino Mincho ProN" }, // Example Japanese font
                ]}
              >
                柔道
              </Text>
            </View>
          </View>
          <Text style={styles.levelText}>
            {t("profile.level")}: {userData.level}
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${calculateXPProgress()}%`, backgroundColor: theme.colors.primary },
              ]}
            />
          </View>
          <Text style={styles.xpText}>{userData.statistics.xp} / 500 XP</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    marginBottom: '3%'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
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
    margin: '2%',
  },
  belt: {
    width: '50%',
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
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 10,
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
    color: "#777",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default ProfileScreen;
