import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { languages } from "@/src/utils/constants";
import { router } from "expo-router";
import { replaceRoute } from "@/src/utils/replaceRoute";

const SettingsLanguageSelectionScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const handleLanguageSelection = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
  };

  const handleBack = () => {
    replaceRoute('/settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t("settings.language")}
        </Text>
      </View>

      {/* Language Selection */}
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor:
                  item.code === selectedLanguage
                    ? theme.colors.primary
                    : theme.colors.card,
              },
            ]}
            onPress={() => handleLanguageSelection(item.code)}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text
              style={[
                styles.languageName,
                {
                  color: theme.colors.text
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  flag: {
    fontSize: 30,
    marginRight: 10,
  },
  languageName: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default SettingsLanguageSelectionScreen;
