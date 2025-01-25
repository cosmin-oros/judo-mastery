import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { fetchTechniqueCategories } from "@/src/firestoreService/techniquesService";
import Header from "./components/Header";
import { useTranslation } from "react-i18next";

const TechniquesScreen: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchTechniqueCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryPress = (categoryId: string, title: string) => {
    router.push({
      pathname: "/(tabs)/techniques/wazaList",
      params: { categoryId, title },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Techniques" />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.card }]}
            onPress={() => handleCategoryPress(item.id, item.title.en)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.title.en}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  emoji: { fontSize: 30, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});

export default TechniquesScreen;
