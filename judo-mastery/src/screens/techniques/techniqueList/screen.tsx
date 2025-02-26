import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { fetchTechniquesForWaza } from "@/src/firestoreService/techniquesService";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme/colors";
import { useTechniques } from "@/src/provider/global/TechniquesProvider";

const screenWidth = Dimensions.get("window").width;

interface Technique {
  id: string;
  emoji: string;
  original: string;
  title: { [key: string]: string };
  description: { [key: string]: string };
  videoUrl: string;
  xp: number;
}

const TechniqueListScreen: React.FC = () => {
  const { categoryId, wazaId, wazaTitle } = useLocalSearchParams();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  // From context
  const { categories, loading } = useTechniques();

  // Find the relevant category & waza
  const category = categories.find((c) => c.id === categoryId);
  const waza = category?.wazas.find((w) => w.id === wazaId);
  const techniques = waza?.techniques || [];

  const handleBackPress = () => {
    router.back();
  };

  const handleTechniquePress = (techniqueId: string) => {
    router.push({
      pathname: "/(tabs)/techniques/techniqueDetails",
      params: { categoryId, wazaId, techniqueId },
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
      <Header title={wazaTitle as string} />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={techniques}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const scaleValue = new Animated.Value(1);

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
                    borderColor: theme.colors.primary,
                    shadowColor: theme.colors.border,
                    width: screenWidth * 0.95,
                  },
                ]}
                activeOpacity={0.9}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={() => handleTechniquePress(item.id)}
              >
                <View
                  style={[
                    styles.emojiContainer,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={[styles.emoji, { color: theme.colors.background }]}
                  >
                    {item.emoji}
                  </Text>
                </View>
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.title,
                      { color: theme.colors.text, fontWeight: "bold" },
                    ]}
                  >
                    {item.title.en}
                  </Text>
                  <Text
                    style={[
                      styles.original,
                      { color: theme.colors.placeholder },
                    ]}
                  >
                    {item.original}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "flex-start",
  },
  backButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 30,
    // Soft shadow for modern elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    marginVertical: 12,
    borderRadius: 20,
    borderWidth: 2, // Make the outline more visible
    // iOS shadow properties
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Android elevation
    elevation: 5,
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

export default TechniqueListScreen;
