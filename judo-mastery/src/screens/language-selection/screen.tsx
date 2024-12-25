import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";

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
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const handleLanguageSelection = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    // Save language preference if required
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.bold.fontFamily, fontWeight: theme.fonts.bold.fontWeight }]}>
        {t("languageSelection.title")}
      </Text>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: item.code === selectedLanguage ? theme.colors.primary : theme.colors.card },
            ]}
            onPress={() => handleLanguageSelection(item.code)}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text
              style={[
                styles.languageName,
                { color: item.code === selectedLanguage ? theme.colors.background : theme.colors.text },
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
  },
  title: {
    fontSize: 26,
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
    borderRadius: 18,  
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, 
  },
  flag: {
    fontSize: 32,
    marginRight: 15,
  },
  languageName: {
    fontSize: 20,  
    fontWeight: "600",
  },
});

export default LanguageSelectionScreen;
