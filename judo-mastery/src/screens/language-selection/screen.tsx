import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { languages } from "@/src/utils/constants";
import { Ionicons } from "@expo/vector-icons"; // For modern icon

const LanguageSelectionScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const handleLanguageSelection = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
  };

  const handleNextStep = () => {
    replaceRoute('/extra-user-data');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => replaceRoute("/(tabs)/home")}
      >
        <Ionicons name="arrow-forward-circle" size={32} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.bold.fontFamily, fontWeight: theme.fonts.bold.fontWeight }]}>
        {t("language-selection.title")}
      </Text>

      {/* Language List */}
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: item.code === selectedLanguage ? theme.colors.primary : theme.colors.card,
              },
            ]}
            onPress={() => handleLanguageSelection(item.code)}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text
              style={[
                styles.languageName,
                {
                  color: theme.colors.text,
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Next Step Button */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleNextStep}
      >
        <Text style={[styles.nextButtonText, { color: theme.colors.background, fontFamily: theme.fonts.bold.fontFamily, fontWeight: theme.fonts.bold.fontWeight }]}>
          {t("language-selection.next-step")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: '5%', 
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    marginHorizontal: '1%',
    paddingBottom: 30, 
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 12, 
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
  nextButton: {
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: '5%'
  },
  nextButtonText: {
    fontSize: 18,
  },
});

export default LanguageSelectionScreen;
