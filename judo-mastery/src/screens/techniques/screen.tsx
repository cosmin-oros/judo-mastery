import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { fetchTechniqueCategories } from "@/src/firestoreService/techniquesService";
import Header from "./components/Header";
import { useTranslation } from "react-i18next";
import { colors } from "@/src/theme/colors";

const screenWidth = Dimensions.get("window").width;

interface CategoryCardProps {
  item: any;
  onPress: (categoryId: string, title: string) => void;
  theme: any;
}

const CategoryCard: React.FC<CategoryCardProps> = memo(({ item, onPress, theme }) => {
  // Use useRef so the animated value is only created once per card instance
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            shadowColor: theme.colors.border,
            width: screenWidth * 0.95, // Card now takes 95% of the screen width
            borderColor: colors.primary,
          },
        ]}
        activeOpacity={0.9}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => onPress(item.id, item.title.en)}
      >
        <View style={[styles.emojiContainer, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.emoji, { color: theme.colors.background }]}>{item.emoji}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.title, theme.fonts.bold, { color: theme.colors.text }]}>
            {item.title.en}
          </Text>
          <Text style={[styles.original, theme.fonts.regular, { color: theme.colors.placeholder }]}>
            {item.original}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const TechniquesScreen: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchTechniqueCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>{t("common.loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Techniques" />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CategoryCard item={item} onPress={handleCategoryPress} theme={theme} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 20,
    alignItems: "center", // Center the cards horizontally
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    marginVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    // Enhanced iOS shadow properties
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    // Enhanced Android elevation
    elevation: 8,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 24,
  },
  emoji: {
    fontSize: 42,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
  original: {
    fontSize: 18,
    marginTop: 6,
    fontStyle: "italic",
  },
});

export default TechniquesScreen;
