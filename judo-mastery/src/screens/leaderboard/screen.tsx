import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { fetchTopUsersByLevelAndXP } from "@/src/firestoreService/userDataService";
import { UserType } from "@/src/types/types";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

// Helper to get user’s avatar (similar to your getAvatarSource function)
function getAvatarSource(avatarId?: string) {
  switch (avatarId) {
    case "1":
      return require("../../../assets/images/avatar1.jpg");
    case "2":
      return require("../../../assets/images/avatar2.jpg");
    case "3":
      return require("../../../assets/images/avatar3.jpg");
    case "4":
      return require("../../../assets/images/avatar4.jpg");
    case "5":
      return require("../../../assets/images/avatar5.jpg");
    default:
      return require("../../../assets/images/avatar1.jpg");
  }
}

// Optional belt color style
function getBeltColor(beltRank?: string) {
  switch (beltRank) {
    case "white":
      return "#ffffff";
    case "yellow":
      return "#FFD700";
    case "orange":
      return "#FFA500";
    case "green":
      return "#008000";
    case "blue":
      return "#0000FF";
    case "brown":
      return "#8B4513";
    case "black":
      return "#000000";
    case "red":
      return "#FF0000";
    case "red-and-white":
      // half red, half white can be done with a custom style
      return "red-and-white";
    default:
      return "#ccc";
  }
}

const LeaderboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [topUsers, setTopUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const users = await fetchTopUsersByLevelAndXP();
      setTopUsers(users);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboardData();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: UserType; index: number }) => {
    // For "red-and-white" belt, you can do a custom style or fallback
    const beltStyle =
      getBeltColor(item.beltRank) === "red-and-white"
        ? styles.redWhiteBelt
        : [{ backgroundColor: getBeltColor(item.beltRank) }, styles.beltCircle];

    return (
      <View style={[styles.row, { backgroundColor: theme.colors.card }]}>
        {/* Rank # on the left */}
        <Text style={[styles.rank, { color: theme.colors.text }]}>
          {index + 1}
        </Text>
        {/* Avatar */}
        <Image
          source={getAvatarSource(item.profilePhoto)}
          style={styles.avatar}
        />
        {/* Name & Belt */}
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {item.firstName || item.name || "Anonymous"}
          </Text>
          {/* Belt circle */}
          {getBeltColor(item.beltRank) === "red-and-white" ? (
            <View style={styles.redWhiteBelt} />
          ) : (
            <View style={beltStyle} />
          )}
        </View>
        {/* Level & XP */}
        <View style={styles.stats}>
          <Text style={[styles.level, { color: theme.colors.text }]}>
            {t("leaderboard.level")}: {item.level || 1}
          </Text>
          <Text style={[styles.xp, { color: theme.colors.text }]}>
            {t("leaderboard.xp")}: {item.xp || 0}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text }}>{t("common.loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t("leaderboard.title")}
      </Text>
      <FlatList
        data={topUsers}
        keyExtractor={(item) => item.uid || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      />
    </SafeAreaView>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 4,
  },
  rank: {
    fontSize: 20,
    width: 30,
    textAlign: "center",
    fontWeight: "700",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  beltCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  redWhiteBelt: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "transparent",
    marginLeft: 2,
  },
  stats: {
    alignItems: "flex-end",
  },
  level: {
    fontSize: 16,
    fontWeight: "500",
  },
  xp: {
    fontSize: 14,
    fontWeight: "400",
  },
});
