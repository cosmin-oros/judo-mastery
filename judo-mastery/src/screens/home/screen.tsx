import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import { useLessons } from "@/src/provider/global/LessonsProvider";
import { useTechniques } from "@/src/provider/global/TechniquesProvider";
import { LessonType, TechniqueType, BELT_COLORS } from "@/src/types/types";
import { router } from "expo-router";

/** Get avatar image source based on the provided avatarId */
const getAvatarSource = (avatarId: string) => {
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
};

/** Next Lesson Card Component */
const NextLessonCard: React.FC<{
  lesson: LessonType;
  onPress: () => void;
  t: any;
  theme: any;
}> = ({ lesson, onPress, t, theme }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <Ionicons
        name="book-outline"
        size={36}
        color={theme.colors.primary}
        style={styles.cardIcon}
      />
      <View>
        <Text style={[styles.cardText, { color: theme.colors.text, fontSize: 18 }]}>
          {lesson.title?.en || "Untitled"}
        </Text>
        <Text
          style={[styles.cardDescription, { color: theme.colors.placeholder, fontSize: 16 }]}
        >
          {t("home.xpWorth", { xp: lesson.xp })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/** Belt Indicator Component – simple colored bar with smaller width */
const BeltIndicator: React.FC<{ beltColor: string; theme: any }> = ({ beltColor, theme }) => {
  return (
    <View style={[styles.beltIndicator, { backgroundColor: beltColor }]} />
  );
};

/** HomeScreen Component */
const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const { lessons, loading: lessonsLoading, refreshLessons } = useLessons();
  const { categories, loading: techniquesLoading, refresh: refreshTechniques } = useTechniques();

  const [refreshing, setRefreshing] = useState(false);
  const [randomTechnique, setRandomTechnique] = useState<TechniqueType | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonType | null>(null);
  const [dailyQuote, setDailyQuote] = useState<string>("");

  // Pick a random technique for "Technique of the Day"
  useEffect(() => {
    if (!techniquesLoading && categories.length > 0) {
      const allTechniques: TechniqueType[] = [];
      categories.forEach((cat) => {
        cat.wazas.forEach((waza) => {
          waza.techniques.forEach((tech) => allTechniques.push(tech));
        });
      });
      if (allTechniques.length > 0) {
        const randomIndex = Math.floor(Math.random() * allTechniques.length);
        setRandomTechnique(allTechniques[randomIndex]);
      }
    }
  }, [categories, techniquesLoading]);

  // Determine the next lesson
  useEffect(() => {
    if (!lessonsLoading && lessons.length > 0) {
      const completedLessons = user?.lessons_completed || [];
      const incomplete = lessons.filter((l) => !completedLessons.includes(l.id));
      setNextLesson(incomplete.length > 0 ? incomplete[0] : lessons[0]);
    }
  }, [lessons, lessonsLoading, user]);

  // Fetch daily quote
  const fetchDailyQuote = async () => {
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      const data = await response.json();
      if (data && data[0] && data[0].q && data[0].a) {
        setDailyQuote(`${data[0].q} — ${data[0].a}`);
      }
    } catch (error) {
      console.error("Error fetching daily quote:", error);
      setDailyQuote(t("home.defaultQuote"));
    }
  };

  useEffect(() => {
    fetchDailyQuote();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (user?.uid) {
        const userDataFromFirestore = await getUserDataFromFirestore(user.uid);
        if (userDataFromFirestore) {
          updateUser({
            ...userDataFromFirestore,
            uid: user.uid,
            email: userDataFromFirestore.email || null,
          });
        }
      }
      await Promise.all([refreshLessons(), refreshTechniques()]);

      if (categories.length > 0) {
        const allTechniques: TechniqueType[] = [];
        categories.forEach((cat) => {
          cat.wazas.forEach((waza) => {
            waza.techniques.forEach((tech) => allTechniques.push(tech));
          });
        });
        if (allTechniques.length > 0) {
          const randomIndex = Math.floor(Math.random() * allTechniques.length);
          setRandomTechnique(allTechniques[randomIndex]);
        }
      }
      fetchDailyQuote();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  }, [user, updateUser, refreshLessons, refreshTechniques, categories, t]);

  if (techniquesLoading || lessonsLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>{t("common.loading")}</Text>
      </View>
    );
  }

  const goToLesson = (lesson: LessonType) => {
    router.push({
      pathname: "/(tabs)/terminology/lesson",
      params: {
        lessonData: JSON.stringify(lesson),
        lessonId: lesson.id,
      },
    });
  };

  const beltColor = user?.beltRank ? BELT_COLORS[user.beltRank] : theme.colors.placeholder;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with profile and belt integration */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          {user?.profilePhoto ? (
            <Image
              source={getAvatarSource(user.profilePhoto)}
              style={[
                styles.avatar,
                { borderWidth: 4, borderColor: beltColor }, // belt border around avatar
              ]}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={60} color={theme.colors.primary} />
          )}
          <View style={styles.infoText}>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>{t("home.greeting")}</Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {user?.firstName || t("profile.defaultFirstName")}
            </Text>
            <Text style={[styles.level, { color: theme.colors.placeholder }]}>
              {t("profile.level")}: {user?.level || 1}
            </Text>
            {/* Simple belt indicator as a colored bar with reduced width */}
            <BeltIndicator beltColor={beltColor} theme={theme} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings-outline" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {/* Next Lesson Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("home.nextLesson")}</Text>
          {nextLesson ? (
            <NextLessonCard
              lesson={nextLesson}
              onPress={() => goToLesson(nextLesson)}
              t={t}
              theme={theme}
            />
          ) : (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Ionicons
                name="checkmark-circle"
                size={36}
                color={theme.colors.primary}
                style={styles.cardIcon}
              />
              <Text style={[styles.cardText, { color: theme.colors.text }]}>{t("home.noNextLesson")}</Text>
            </View>
          )}
        </View>

        {/* Technique of the Day Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("home.techniqueOfTheDay")}</Text>
          {randomTechnique ? (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Text style={styles.cardIcon}>🥋</Text>
              <View>
                <Text style={[styles.cardText, { color: theme.colors.text, fontSize: 18 }]}>
                  {randomTechnique.title.en}
                </Text>
                <Text style={[styles.cardDescription, { color: theme.colors.placeholder, fontSize: 16 }]}>
                  {randomTechnique.original}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.cardText, { color: theme.colors.text }]}>{t("home.noTechniquesFound")}</Text>
            </View>
          )}
        </View>

        {/* Daily Quote Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("home.dailyQuote")}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={36}
              color={theme.colors.primary}
              style={styles.cardIcon}
            />
            <Text style={[styles.quoteText, { color: theme.colors.text }]}>{dailyQuote}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 18 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: "8%",
    paddingBottom: "8%",
  },
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  infoText: { marginLeft: 12 }, // removed flex: 1 here
  greeting: { fontSize: 16 },
  name: { fontSize: 22, fontWeight: "700" },
  level: { fontSize: 16 },
  settingsIcon: { padding: 10 },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 22, fontWeight: "600", marginBottom: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: { fontSize: 36, marginRight: 15 },
  cardText: { fontSize: 18, fontWeight: "600" },
  cardDescription: { fontSize: 16, marginTop: 4 },
  quoteText: { flex: 1, fontSize: 16, fontStyle: "italic", marginLeft: 10 },
  beltIndicator: {
    height: 6,
    width: "40%",
    borderRadius: 3,
    marginTop: 8,
  },
});
