import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";
import { showAlert } from "@/src/utils/showAlert";
import { replaceRoute } from "@/src/utils/replaceRoute";

// Import your TechniquesProvider hook
import { useTechniques } from "@/src/provider/global/TechniquesProvider";
import { updateUserTechniqueProgress } from "@/src/firestoreService/techniquesService";

// Reuse your custom Header
import Header from "../components/Header";

const TechniqueDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  // Get IDs from route params
  const { categoryId, wazaId, techniqueId } = useLocalSearchParams<{
    categoryId: string;
    wazaId: string;
    techniqueId: string;
  }>();

  // Pull the entire technique data from the provider
  const { categories, loading: techniquesLoading } = useTechniques();

  // Local state to track if the user has studied this technique
  const [studied, setStudied] = useState(false);
  // Local state for showing a spinner while updating progress
  const [finishing, setFinishing] = useState(false);

  // Find the matching technique in your nested data
  const category = categories.find((c) => c.id === categoryId);
  const waza = category?.wazas.find((w) => w.id === wazaId);
  const technique = waza?.techniques.find((tech) => tech.id === techniqueId);

  // Once the technique is found, check if the user has completed it
  useEffect(() => {
    const checkUserTechniqueProgress = async () => {
      if (user?.uid && technique) {
        try {
          const userRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          // If userData has an array 'techniques_completed' and includes this technique ID
          if (userData?.techniques_completed?.includes(technique.id)) {
            setStudied(true);
          }
        } catch (error) {
          console.error("Error loading user technique progress:", error);
        }
      }
    };
    checkUserTechniqueProgress();
  }, [user, technique]);

  // If the TechniquesProvider is still loading, show a spinner
  if (techniquesLoading || finishing) {
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

  // If no technique is found (invalid ID, etc.)
  if (!technique) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          {t("technique.error-loading")}
        </Text>
      </SafeAreaView>
    );
  }

  // Extract YouTube video ID if present
  let videoId = "";
  if (technique.videoUrl && technique.videoUrl.includes("v=")) {
    const parts = technique.videoUrl.split("v=");
    if (parts[1]) {
      videoId = parts[1].split("&")[0];
    }
  }

  // Handler for awarding XP & marking technique as completed
  const handleFinishTechnique = async () => {
    if (!user?.uid) return;
    setFinishing(true);
    try {
      await updateUserTechniqueProgress(user.uid, technique.id, technique.xp);
      setStudied(true);
      showAlert(
        t("techniques.finished-success"),
        t("techniques.congratulations"),
        () => replaceRoute("/(tabs)/techniques")
      );
    } catch (error) {
      console.error("Error updating technique progress:", error);
      showAlert(t("techniques.finished-error"), t("techniques.try-again"));
    } finally {
      setFinishing(false);
    }
  };

  // Go back one screen
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header showing the technique's name */}
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
          {/* Title row + studied checkmark */}
          <View style={styles.headerRow}>
            <Text style={[styles.techTitle, { color: theme.colors.text }]}>
              {technique.title.en}
            </Text>
            {studied && (
              <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
            )}
          </View>

          <Text style={[styles.techOriginal, { color: theme.colors.placeholder }]}>
            {technique.original}
          </Text>
          <Text style={[styles.techDescription, { color: theme.colors.text }]}>
            {technique.description.en}
          </Text>

          {/* Video if we found a YouTube ID */}
          {videoId !== "" && (
            <View style={styles.videoContainer}>
              <YoutubePlayer height={200} videoId={videoId} />
            </View>
          )}

          <Text style={[styles.xpText, { color: theme.colors.text }]}>
            {t("techniques.xp")} {technique.xp}
          </Text>
        </View>

        {/* Finish button if not studied yet */}
        {!studied && (
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

export default TechniqueDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    marginBottom: 10,
  },
  techTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  techOriginal: {
    fontSize: 20,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
  techDescription: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
    textAlign: "justify",
  },
  videoContainer: { marginVertical: 20 },
  xpText: {
    fontSize: 18,
    textAlign: "right",
    marginTop: 10,
    fontWeight: "500",
  },
  finishButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  finishButtonText: { fontSize: 18, fontWeight: "700" },
});
