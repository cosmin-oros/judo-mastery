import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importing translation files
import translationEN from "../locales/en.json";
import translationRO from "../locales/ro.json";
import translationES from "../locales/es.json";
import translationDE from "../locales/de.json";
import translationFR from "../locales/fr.json";
import translationJA from "../locales/ja.json";

const resources = {
  "ro": { translation: translationRO },
  "en": { translation: translationEN },
  "es": { translation: translationES },
  "de": { translation: translationDE },
  "fr": { translation: translationFR },
  "ja": { translation: translationJA },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = "en";
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
