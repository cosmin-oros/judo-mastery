import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { UserType } from "@/src/types/types";
import Header from "./components/Header";
import AchievementsSection from "./components/AchievementsSection";
import ProfileSection from "./components/ProfileSection";
import StatisticsSection from "./components/StatisticsSection";
import { replaceRoute } from "@/src/utils/replaceRoute";

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
      <Header title={t("profile.title")} />
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileSection userData={userData} />
        <AchievementsSection userData={userData} />
        <StatisticsSection userData={userData} />
      </ScrollView>
      <View style={[styles.editButtonContainer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => replaceRoute("/(tabs)/profile/edit-profile")}
        >
          <Text style={[styles.editButtonText, { color: theme.colors.background }]}>
            {t("profile.editProfile")}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  editButtonContainer: {
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  editButton: {
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ProfileScreen;
