import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "@/src/theme/colors";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

const LanguageSelectionScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const handleLanguageSelection = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode); // Change language globally
    // ! Navigate to the next screen or save language in storage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("languageSelection.title")}</Text>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.code === selectedLanguage && styles.selectedCard,
            ]}
            onPress={() => handleLanguageSelection(item.code)}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text
              style={[
                styles.languageName,
                item.code === selectedLanguage && styles.selectedText,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: colors.primary
  },
  flag: {
    fontSize: 32,
    marginRight: 15,
  },
  languageName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  selectedText: {
    color: colors.white
  },
});

export default LanguageSelectionScreen;
