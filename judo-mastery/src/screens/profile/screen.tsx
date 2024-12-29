import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ProgressBarAndroid,
} from "react-native";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import TopBar from "@/src/screens/profile/components/Topbar";

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
  const { user } = useAuth(); // Get authenticated user
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
    const totalXP = 500; // Example max XP for the current level
    return currentXP / totalXP;
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          {/* Profile Image and Name */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar} />
            <Text style={styles.username}>
              {userData.firstName || "First Name"} {userData.lastName || "Last Name"}
            </Text>
          </View>

          {/* Level and XP Progress Bar */}
          <Text style={styles.levelText}>Level {userData.level}</Text>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={calculateXPProgress()}
            color="#6200ea"
            style={styles.progressBar}
          />
          <Text style={styles.xpText}>
            {userData.statistics.xp} / 500 XP
          </Text>

          {/* Statistics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <Text style={styles.statsText}>
              Tasks Completed: {userData.statistics.tasks_completed}
            </Text>
            <Text style={styles.statsText}>
              Techniques Learned: {userData.statistics.techniques_learned}
            </Text>
          </View>

          {/* Medals Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medals</Text>
            <Text style={styles.statsText}>Gold Medals: {userData.goldMedals}</Text>
            <Text style={styles.statsText}>
              Silver Medals: {userData.silverMedals}
            </Text>
            <Text style={styles.statsText}>
              Bronze Medals: {userData.bronzeMedals}
            </Text>
          </View>

          {/* Daily Tasks Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Tasks</Text>
            <Text style={styles.statsText}>Goals: {userData.goals}</Text>
            <Text style={styles.statsText}>Belt Rank: {userData.beltRank}</Text>
            <Text style={styles.statsText}>
              Competitions Participated: {userData.competitionsParticipated}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
  progressBar: {
    width: "80%",
    height: 10,
    marginBottom: 10,
  },
  xpText: {
    fontSize: 16,
    color: "#777",
  },
  section: {
    marginVertical: 20,
    width: "100%",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
});

export default ProfileScreen;
