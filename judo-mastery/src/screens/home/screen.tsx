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

/** Local helper to get avatar image by ID */
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

/** Some random Judo quotes. Add or replace as you like. */
const judoQuotes = [
  "Judo is the way to the most effective use of both physical and spiritual strength. – Jigoro Kano",
  "The aim of judo is to utilize mental and physical strength most effectively. – Jigoro Kano",
  "Judo teaches us to look for the best possible course of action, whatever the individual circumstances. – Jigoro Kano",
  "In judo, one should first learn through practice and then seek an intellectual understanding of what has been learned. – Jigoro Kano",
  "Don’t fear the man who has practiced 10,000 throws once, but the man who has practiced one throw 10,000 times. – Variation of Bruce Lee’s quote"
];

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  // Lessons and Techniques from context providers
  const { lessons, loading: lessonsLoading, refreshLessons } = useLessons();
  const { categories, loading: techniquesLoading, refresh: refreshTechniques } = useTechniques();

  const [refreshing, setRefreshing] = useState(false);
  const [randomTechnique, setRandomTechnique] = useState<TechniqueType | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonType | null>(null);
  const [dailyQuote, setDailyQuote] = useState<string>("");

  /**
   * Once techniques are loaded, pick a random one for "Technique of the Day"
   */
  useEffect(() => {
    if (!techniquesLoading && categories.length > 0) {
      const allTechniques: TechniqueType[] = [];
      categories.forEach((cat) => {
        cat.wazas.forEach((waza) => {
          waza.techniques.forEach((tech) => {
            allTechniques.push(tech);
          });
        });
      });

      if (allTechniques.length > 0) {
        const randomIndex = Math.floor(Math.random() * allTechniques.length);
        setRandomTechnique(allTechniques[randomIndex]);
      }
    }
  }, [categories, techniquesLoading]);

  /**
   * Once lessons are loaded, pick the first incomplete lesson as "Next Lesson"
   */
  useEffect(() => {
    if (!lessonsLoading && lessons.length > 0 && user?.lessons_completed) {
      const incomplete = lessons.filter(
        (l) => !user.lessons_completed?.includes(l.id)
      );
      setNextLesson(incomplete.length > 0 ? incomplete[0] : null);
    }
  }, [lessons, lessonsLoading, user]);

  /**
   * Pick a random daily judo quote
   */
  useEffect(() => {
    if (judoQuotes.length > 0) {
      const randIndex = Math.floor(Math.random() * judoQuotes.length);
      setDailyQuote(judoQuotes[randIndex]);
    }
  }, []);

  /**
   * Pull-to-refresh:
   *  - refresh user data
   *  - refresh lessons
   *  - refresh techniques
   */
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
      await refreshLessons();
      await refreshTechniques();

      // Re-randomize the technique and quote if you want a fresh pick on each refresh
      // Or keep them stable for the day if you prefer
      if (categories.length > 0) {
        const allTechniques: TechniqueType[] = [];
        categories.forEach((cat) => {
          cat.wazas.forEach((waza) => {
            waza.techniques.forEach((tech) => {
              allTechniques.push(tech);
            });
          });
        });
        if (allTechniques.length > 0) {
          const randomIndex = Math.floor(Math.random() * allTechniques.length);
          setRandomTechnique(allTechniques[randomIndex]);
        }
      }
      if (judoQuotes.length > 0) {
        const randIndex = Math.floor(Math.random() * judoQuotes.length);
        setDailyQuote(judoQuotes[randIndex]);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  }, [user, updateUser, refreshLessons, refreshTechniques, categories]);

  // If providers are still loading, show spinner
  if (techniquesLoading || lessonsLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {t("common.loading")}
        </Text>
      </View>
    );
  }

  /**
   * Helper to navigate to the next lesson using expo-router's push
   */
  const goToLesson = (lesson: LessonType) => {
    router.push({
      pathname: "/(tabs)/terminology/lesson",
      params: {
        lessonData: JSON.stringify(lesson),
        lessonId: lesson.id,
      },
    });
  };

  // Get belt color from user data
  const beltColor = user?.beltRank ? BELT_COLORS[user.beltRank] : theme.colors.placeholder;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          {user?.profilePhoto ? (
            <Image
              source={getAvatarSource(user.profilePhoto)}
              style={styles.avatar}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={50} color={theme.colors.primary} />
          )}
          <View style={styles.infoText}>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>
              {t("home.greeting")}
            </Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {user?.firstName || t("profile.defaultFirstName")}
            </Text>
            <Text style={[styles.level, { color: theme.colors.placeholder }]}>
              {t("profile.level")}: {user?.level || 1}
            </Text>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Belt Rank Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("home.yourBeltRank")}
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Ionicons
              name="ribbon-outline"
              size={30}
              color={theme.colors.primary}
              style={styles.cardIcon}
            />
            <View>
              <Text style={[styles.cardText, { color: theme.colors.text }]}>
                {user?.beltRank || t("profile.noBeltRank")}
              </Text>
              <View
                style={[
                  styles.beltStrip,
                  {
                    backgroundColor: beltColor,
                    borderColor: theme.colors.text,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Next Lesson Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("home.nextLesson")}
          </Text>
          {nextLesson ? (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.colors.card }]}
              onPress={() => goToLesson(nextLesson)}
            >
              <Ionicons
                name="book-outline"
                size={30}
                color={theme.colors.primary}
                style={styles.cardIcon}
              />
              <View>
                <Text style={[styles.cardText, { color: theme.colors.text }]}>
                  {nextLesson.title?.en || "Untitled"}
                </Text>
                <Text style={[styles.cardDescription, { color: theme.colors.placeholder }]}>
                  {t("home.xpWorth", { xp: nextLesson.xp })}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Ionicons
                name="checkmark-circle"
                size={30}
                color={theme.colors.primary}
                style={styles.cardIcon}
              />
              <Text style={[styles.cardText, { color: theme.colors.text }]}>
                {t("home.noNextLesson")}
              </Text>
            </View>
          )}
        </View>

        {/* Technique of the Day Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("home.techniqueOfTheDay")}
          </Text>
          {randomTechnique ? (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Text style={styles.cardIcon}>🥋</Text>
              <View>
                <Text style={[styles.cardText, { color: theme.colors.text }]}>
                  {randomTechnique.title.en}
                </Text>
                <Text style={[styles.cardDescription, { color: theme.colors.placeholder }]}>
                  {randomTechnique.original}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.cardText, { color: theme.colors.text }]}>
                {t("home.noTechniquesFound")}
              </Text>
            </View>
          )}
        </View>

        {/* Daily Judo Quote Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("home.dailyJudoQuote")}
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={30}
              color={theme.colors.primary}
              style={styles.cardIcon}
            />
            <Text style={[styles.quoteText, { color: theme.colors.text }]}>
              {dailyQuote}
            </Text>
          </View>
        </View>

        {/* You could add more sections here, e.g. 'Local Dojos', 'Upcoming Tournaments', etc. */}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: "5%",
    paddingBottom: "5%",
    backgroundColor: "transparent",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoText: {
    marginLeft: 10,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "600",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  level: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingsIcon: {
    padding: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  beltStrip: {
    width: 80,
    height: 8,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 4,
  },
  quoteText: {
    flex: 1,
    fontSize: 14,
    fontStyle: "italic",
  },
});
