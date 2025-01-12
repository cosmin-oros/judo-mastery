import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { fetchLessonsFromFirestore, getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import { LessonType } from "@/src/types/types";
import Header from "./components/Header"; 

const TerminologyScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const lessonsData = await fetchLessonsFromFirestore();
        setLessons(lessonsData);

        if (user?.uid) {
          const userData = await getUserDataFromFirestore(user.uid);
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [user]);

  const handleLessonPress = (lesson: LessonType) => {
    console.log("Navigate to lesson:", lesson.id);
    // Implement navigation to lesson details
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

  const groupedLessons = lessons.reduce((acc, lesson) => {
    acc[lesson.category] = acc[lesson.category] || [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, LessonType[]>);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={t("terminology.title")} />
      <ScrollView contentContainerStyle={styles.content}>
        {Object.keys(groupedLessons).map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
              {t(`terminology.${category.toLowerCase()}`)}
            </Text>
            <View style={styles.lessonContainer}>
              {groupedLessons[category].map((lesson) => {
                const isCompleted = userData?.lessons_completed?.includes(lesson.id);
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonCard,
                      {
                        backgroundColor: isCompleted
                          ? theme.colors.primary
                          : theme.colors.card,
                        shadowColor: theme.colors.placeholder,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                      },
                    ]}
                    onPress={() => handleLessonPress(lesson)}
                    disabled={isCompleted}
                  >
                    <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
                      {lesson.title[i18n.language] || lesson.title.en}
                    </Text>
                    <Text style={[styles.lessonXP, { color: theme.colors.text }]}>
                      {t("terminology.xp", { xp: lesson.xp })}
                    </Text>
                    {isCompleted && (
                      <Text style={[styles.completedText, { color: theme.colors.primary }]}>
                        {t("terminology.completed")}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
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
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },
  lessonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  lessonCard: {
    flex: 1,
    minWidth: "48%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 160,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  lessonXP: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },
  completedText: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 5,
  },
});

export default TerminologyScreen;
