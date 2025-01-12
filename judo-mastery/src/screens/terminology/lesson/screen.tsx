import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { updateUserLessonProgress } from "@/src/firestoreService/lessonsService";
import { getLessonFromFirestore } from "@/src/firestoreService/lessonsService";
import { useLocalSearchParams } from "expo-router";
import * as Progress from "react-native-progress";
import { showAlert } from "@/src/utils/showAlert";
import { replaceRoute } from "@/src/utils/replaceRoute";

interface LessonType {
  id: string;
  title: Record<string, string>;
  xp: number;
  terminology: {
    id: string;
    original: string;
    translated: Record<string, string>;
    description: Record<string, string>;
  }[];
}

const LessonScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch the lesson data when the component mounts
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;

      try {
        const lessonData = await getLessonFromFirestore(lessonId);

        // Type assertion ensures the fetched data matches LessonType
        setLesson(lessonData as LessonType);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        showAlert(t("lesson.error-fetching"));
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

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

  if (!lesson) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          {t("lesson.error-missing-data")}
        </Text>
      </SafeAreaView>
    );
  }

  const terms = lesson.terminology || [];

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
        () => replaceRoute("/lessons")
      );
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      showAlert(t("lesson.finished-error"), t("lesson.try-again"));
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentTermIndex + 1) / terms.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
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
          {t("lesson.progress", { current: currentTermIndex + 1, total: terms.length })}
        </Text>
      </View>

      {/* Current Term */}
      <View style={styles.termContainer}>
        <Text style={[styles.termOriginal, { color: theme.colors.text }]}>
          {terms[currentTermIndex].original}
        </Text>
        <Text style={[styles.termTranslated, { color: theme.colors.text }]}>
          {terms[currentTermIndex].translated[t("language")] || terms[currentTermIndex].translated.en}
        </Text>
        <Text style={[styles.termDescription, { color: theme.colors.text }]}>
          {terms[currentTermIndex].description[t("language")] || terms[currentTermIndex].description.en}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "#ff4d4f",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#6200ea",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  termContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  termOriginal: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  termTranslated: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 10,
    color: "#555",
  },
  termDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    color: "#777",
  },
  navigationContainer: {
    padding: 20,
    alignItems: "center",
  },
  nextButton: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#6200ea",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  finishButton: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#4caf50",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

export default LessonScreen;
