import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { updateUserLessonProgress } from "@/src/firestoreService/lessonsService";
import { useLocalSearchParams } from "expo-router";
import * as Progress from "react-native-progress";
import { showAlert } from "@/src/utils/showAlert";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { LessonType, TermType } from "@/src/types/types";
import { useLessons } from "@/src/provider/global/LessonsProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const LessonScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { lessonData, lessonId } = useLocalSearchParams<{
    lessonData?: string;
    lessonId?: string;
  }>();
  const { lessons } = useLessons();

  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [terms, setTerms] = useState<TermType[]>([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Animation for fade-in effect
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loadLesson = () => {
      let foundLesson: LessonType | null = null;

      // If lessonData is passed in the params, parse it
      if (lessonData) {
        try {
          const parsed = JSON.parse(lessonData);
          if (parsed && typeof parsed === "object") {
            foundLesson = parsed as LessonType;
          }
        } catch (error) {
          console.error("Error parsing lessonData:", error);
        }
      }
      // Otherwise, find the lesson in the provider by lessonId
      else if (lessonId) {
        foundLesson = lessons.find((l) => l.id === lessonId) || null;
      }

      if (foundLesson) {
        setLesson(foundLesson);
        // We already have the actual term objects in foundLesson.terms
        setTerms(foundLesson.terms);
      } else {
        console.error("Lesson not found in provider.");
      }
      setLoading(false);
      fadeIn();
    };

    loadLesson();
  }, [lessonData, lessonId, lessons]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
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

  if (!lesson || terms.length === 0) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          {t("lesson.error-missing-data")}
        </Text>
      </SafeAreaView>
    );
  }

  const handleNextTerm = () => {
    if (currentTermIndex < terms.length - 1) {
      setCurrentTermIndex(currentTermIndex + 1);
    }
  };

  const handleFinishLesson = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      await updateUserLessonProgress(user.uid, lesson.id, lesson.xp);
      showAlert(
        t("lesson.finished-success"),
        t("lesson.congratulations"),
        () => replaceRoute("/(tabs)/terminology")
      );
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      showAlert(t("lesson.finished-error"), t("lesson.try-again"));
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentTermIndex + 1) / terms.length;
  const currentTerm = terms[currentTermIndex];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {lesson.title[t("language")] || lesson.title.en}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            color={theme.colors.primary}
            unfilledColor={theme.colors.card}
            borderWidth={0}
            height={10}
          />
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            {t("lesson.progress", {
              current: currentTermIndex + 1,
              total: terms.length,
            })}
          </Text>
        </View>

        {/* Current Term */}
        <View style={styles.termContainer}>
          <Text style={styles.termIcon}>{currentTerm.icon || "❓"}</Text>
          <Text style={[styles.termOriginal, { color: theme.colors.text }]}>
            {currentTerm.original}
          </Text>
          <Text style={[styles.termTranslated, { color: theme.colors.primary }]}>
            {currentTerm.translated[t("language")] || currentTerm.translated.en}
          </Text>
          <Text style={[styles.termDescription, { color: theme.colors.text }]}>
            {currentTerm.description[t("language")] || currentTerm.description.en}
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentTermIndex < terms.length - 1 ? (
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNextTerm}
            >
              <Text style={[styles.buttonText, { color: theme.colors.background }]}>
                {t("lesson.next-term")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.finishButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleFinishLesson}
            >
              <Text style={[styles.buttonText, { color: theme.colors.background }]}>
                {t("lesson.finish")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { fontSize: 16, textAlign: "center" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // centers the title horizontally
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 0,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    // "flex: 1" is optional if you need more space for the title
  },
  progressContainer: { marginVertical: 20 },
  progressText: { marginTop: 10, fontSize: 14, textAlign: "center" },
  termContainer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  termIcon: { fontSize: 48, marginBottom: 10 },
  termOriginal: { fontSize: 26, fontWeight: "700", marginBottom: 10 },
  termTranslated: { fontSize: 22, fontWeight: "600", marginBottom: 10 },
  termDescription: { fontSize: 16, lineHeight: 22, textAlign: "center" },
  navigationContainer: { marginTop: 20, alignItems: "center" },
  nextButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  finishButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "700" },
});

export default LessonScreen;
