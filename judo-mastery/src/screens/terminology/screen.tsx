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
import { useLessons } from "@/src/provider/global/LessonsProvider";
import { Ionicons } from "@expo/vector-icons";
import Header from "./components/Header";
import { router } from "expo-router";
import { getUserDataFromFirestore } from "@/src/firestoreService/userDataService";
import { LessonType } from "@/src/types/types";

const TerminologyScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { lessons, loading } = useLessons();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.uid) {
        try {
          const data = await getUserDataFromFirestore(user.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };
    loadUserData();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {t("common.loading")}
        </Text>
      </SafeAreaView>
    );
  }

  // Group lessons by category
  const groupedLessons = lessons.reduce((acc, lesson) => {
    acc[lesson.category] = acc[lesson.category] || [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, LessonType[]>);

  const handleLessonPress = (lesson: LessonType) => {
    if (lesson.id) {
      router.push({
        pathname: "/(tabs)/terminology/lesson",
        params: {
          lessonData: JSON.stringify(lesson),
          lessonId: lesson.id,
        },
      });
    }
  };

  const renderLessonCard = (lesson: LessonType, isCompleted: boolean) => (
    <TouchableOpacity
      key={lesson.id}
      style={[
        styles.lessonCard,
        {
          // Use theme.colors.border for shadow color
          shadowColor: theme.colors.border,
        },
      ]}
      onPress={() => handleLessonPress(lesson)}
      disabled={isCompleted}
    >
      <LinearGradient
        // If completed, fill with primary; otherwise fill with card color
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

export default TerminologyScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16 },
  categorySection: { marginBottom: 30 },
  categoryTitle: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  lessonRow: { paddingLeft: 10 },
  lessonCard: {
    width: 160,
    height: 220,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
    // Use the theme's border color for shadows
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginVertical: 10,
  },
  gradient: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  lessonIcon: { marginBottom: 10 },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  lessonXP: { fontSize: 14, fontWeight: "500" },
  completedText: { fontSize: 14, fontWeight: "700", marginTop: 10 },
});
