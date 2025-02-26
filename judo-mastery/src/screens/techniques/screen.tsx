import React, { useMemo } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import CategoryCard from "./components/CategoryCard";

// Import our new provider hook
import { useTechniques } from "@/src/provider/global/TechniquesProvider";

const TechniquesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  // Get categories + loading from context
  const { categories, loading } = useTechniques();

  const handleCategoryPress = (categoryId: string, title: string) => {
    router.push({
      pathname: "/(tabs)/techniques/wazaList",
      params: { categoryId, title },
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {t("common.loading")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title={t("techniques.title")} />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CategoryCard
            item={item}
            onPress={handleCategoryPress}
            theme={theme}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingVertical: 20,
    alignItems: "center",
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
});

export default TechniquesScreen;
