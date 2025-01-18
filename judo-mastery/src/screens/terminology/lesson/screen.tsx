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
import { getLessonFromFirestore, getTermFromFirestore } from "@/src/firestoreService/lessonsService";
import { useLocalSearchParams } from "expo-router";
import * as Progress from "react-native-progress";
import { showAlert } from "@/src/utils/showAlert";
import { replaceRoute } from "@/src/utils/replaceRoute";

interface TermType {
  id: string;
  original: string;
  translated: Record<string, string>;
  description: Record<string, string>;
  icon: string;
}

interface LessonType {
  id: string;
  title: Record<string, string>;
  xp: number;
  terminology: string[]; // Array of term IDs
}

const LessonScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { lessonData, lessonId } = useLocalSearchParams<{
    lessonData?: string;
    lessonId?: string;
  }>();

  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [terms, setTerms] = useState<TermType[]>([]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonAndTerms = async () => {
      try {
        let fetchedLesson: LessonType | null = null;

        if (lessonData) {
          const parsedLesson = JSON.parse(lessonData);
          if (parsedLesson && typeof parsedLesson === "object") {
            fetchedLesson = parsedLesson as LessonType;
          } else {
            console.error("Invalid lessonData format:", lessonData);
          }
        } else if (lessonId) {
          fetchedLesson = await getLessonFromFirestore(lessonId);
        }

        if (fetchedLesson) {
          setLesson(fetchedLesson);

          // Fetch associated terms
          const termPromises = fetchedLesson.terminology.map((termId) => getTermFromFirestore(termId));
          const fetchedTerms = await Promise.all(termPromises);
          setTerms(fetchedTerms as TermType[]);
        } else {
          console.error("Lesson not found for the provided ID or data.");
        }
      } catch (error) {
        console.error("Error loading lesson or terms:", error);
        showAlert(t("lesson.error-fetching"));
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndTerms();
  }, [lessonData, lessonId]);

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
  const currentTerm = terms[currentTermIndex];

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
          {currentTerm.original}
        </Text>
        <Text style={[styles.termTranslated, { color: theme.colors.text }]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
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
  },
  termContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  termOriginal: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
  },
  termTranslated: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 10,
  },
  termDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
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
  },
  finishButton: {
    width: "80%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default LessonScreen;
