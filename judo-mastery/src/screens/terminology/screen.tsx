import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import { fetchLessonsFromFirestore } from "@/src/firestoreService/lessonsService";
import { LessonType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import Header from "./components/Header";
import { router } from "expo-router";

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
    console.log(lesson)
    if(lesson.id) {
      router.push({
        pathname: "/(tabs)/terminology/lesson",
        params: {
          lessonData: JSON.stringify(lesson),
          lessonId: lesson.id, // Ensure the lessonId is included as fallback
        },
      });
    }
    
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

  const renderLessonCard = (lesson: LessonType, isCompleted: boolean) => (
    <TouchableOpacity
      key={lesson.id}
      style={styles.lessonCard}
      onPress={() => handleLessonPress(lesson)}
      disabled={isCompleted}
    >
      <LinearGradient
        colors={
          isCompleted
            ? [theme.colors.primary, theme.colors.primary]
            : [theme.colors.card, theme.colors.card]
        }
        style={styles.gradient}
      >
        <Ionicons
          name={isCompleted ? "checkmark-circle" : "book"}
          size={36}
          color={isCompleted ? theme.colors.background : theme.colors.text}
          style={styles.lessonIcon}
        />
        <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
          {lesson.title[i18n.language] || lesson.title.en}
        </Text>
        <Text style={[styles.lessonXP, { color: theme.colors.text }]}>
          {t("terminology.xp", { xp: lesson.xp })}
        </Text>
        {isCompleted && (
          <Text style={[styles.completedText, { color: theme.colors.background }]}>
            {t("terminology.completed")}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={t("terminology.title")} />
      <ScrollView contentContainerStyle={styles.content}>
        {Object.keys(groupedLessons).map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
              {t(`terminology.${category.toLowerCase()}`)}
            </Text>
            <FlatList
              data={groupedLessons[category]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isCompleted = userData?.lessons_completed?.includes(item.id);
                return renderLessonCard(item, isCompleted);
              }}
              contentContainerStyle={styles.lessonRow}
            />
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
  lessonRow: {
    paddingLeft: 10,
  },
  lessonCard: {
    width: 160,
    height: 220,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  lessonIcon: {
    marginBottom: 10,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  lessonXP: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFF",
  },
  completedText: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },
});

export default TerminologyScreen;
