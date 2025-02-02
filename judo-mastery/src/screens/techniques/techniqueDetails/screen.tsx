import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { fetchTechniqueDetails, updateUserTechniqueProgress } from "@/src/firestoreService/techniquesService";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { showAlert } from "@/src/utils/showAlert";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";

const TechniqueDetailsScreen: React.FC = () => {
  const [technique, setTechnique] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { categoryId, wazaId, techniqueId } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  // Load technique details when the screen mounts.
  useEffect(() => {
    const loadTechniqueDetails = async () => {
      try {
        const data = await fetchTechniqueDetails(
          categoryId as string,
          wazaId as string,
          techniqueId as string
        );
        setTechnique(data);
      } catch (error) {
        console.error("Error fetching technique details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTechniqueDetails();
  }, [categoryId, wazaId, techniqueId]);

  // Check if the user has already completed the technique.
  useEffect(() => {
    const loadUserTechniqueProgress = async () => {
      if (user?.uid && technique) {
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          if (userData?.techniques_completed?.includes(technique.id)) {
            setTechnique((prev: any) => ({ ...prev, studied: true }));
          }
        } catch (error) {
          console.error("Error loading user technique progress:", error);
        }
      }
    };
    loadUserTechniqueProgress();
  }, [user, technique]);

  // Extract YouTube video ID from the videoUrl.
  let videoId = "";
  if (technique?.videoUrl) {
    const urlParts = technique.videoUrl.split("v=");
    if (urlParts.length > 1) {
      videoId = urlParts[1].split("&")[0];
    }
  }

  // Handler for finishing the technique.
  const handleFinishTechnique = async () => {
    if (!user?.uid || !technique) return;
    setLoading(true);
    try {
      // Update user progress (marks technique as completed and awards XP)
      await updateUserTechniqueProgress(user.uid, technique.id, technique.xp);
      // Update local state so that the finish button is hidden and a checkmark is shown.
      setTechnique({ ...technique, studied: true });
      showAlert(
        t("technique.finished-success"),
        t("technique.congratulations"),
        () => replaceRoute("/(tabs)/techniques")
      );
    } catch (error) {
      console.error("Error updating technique progress:", error);
      showAlert(t("technique.finished-error"), t("technique.try-again"));
    } finally {
      setLoading(false);
    }
  };

  // Single Back button handler.
  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>{t("common.loading")}</Text>
      </SafeAreaView>
    );
  }

  if (!technique) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>{t("technique.error-loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header showing the technique title */}
      <Header title={technique.title.en} />

      {/* Back button below header */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              shadowColor: theme.colors.border,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.techTitle, theme.fonts.bold, { color: theme.colors.text }]}>
              {technique.title.en}
            </Text>
            {/* If the technique is studied, show a checkmark */}
            {technique.studied && (
              <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
            )}
          </View>
          <Text style={[styles.techOriginal, theme.fonts.regular, { color: theme.colors.placeholder }]}>
            {technique.original}
          </Text>
          <Text style={[styles.techDescription, theme.fonts.regular, { color: theme.colors.text }]}>
            {technique.description.en}
          </Text>
          {videoId !== "" && (
            <View style={styles.videoContainer}>
              <YoutubePlayer height={200} videoId={videoId} />
            </View>
          )}
          <Text style={[styles.xpText, theme.fonts.medium, { color: theme.colors.text }]}>
            {t("techniques.xp")} {technique.xp}
          </Text>
        </View>

        {/* Only display the Finish button if the technique is not yet studied */}
        {!technique.studied && (
          <TouchableOpacity
            style={[styles.finishButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleFinishTechnique}
          >
            <Text style={[styles.finishButtonText, { color: theme.colors.background }]}>
              {t("lesson.finish")}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { marginTop: 10, fontSize: 16, textAlign: "center" },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  techTitle: { fontSize: 28, marginBottom: 10, textAlign: "center", flex: 1 },
  techOriginal: { fontSize: 20, fontStyle: "italic", marginBottom: 10, textAlign: "center" },
  techDescription: { fontSize: 16, marginBottom: 20, lineHeight: 22, textAlign: "justify" },
  videoContainer: { marginVertical: 20 },
  xpText: { fontSize: 18, textAlign: "right", marginTop: 10 },
  finishButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  finishButtonText: { fontSize: 18, fontWeight: "700" },
});

export default TechniqueDetailsScreen;
