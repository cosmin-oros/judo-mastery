import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { fetchTechniqueDetails } from "@/src/firestoreService/techniquesService";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

const TechniqueDetailsScreen: React.FC = () => {
  const [technique, setTechnique] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { categoryId, wazaId, techniqueId } = useLocalSearchParams();
  const { t } = useTranslation();

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

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  if (!technique) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Error loading technique details.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={technique.title.en} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{technique.title.en}</Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {technique.description.en}
        </Text>
        {technique.videoUrl && (
          <YoutubePlayer height={200} videoId={technique.videoUrl.split("v=")[1]} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { marginTop: 10, fontSize: 16, textAlign: "center" },
});

export default TechniqueDetailsScreen;
