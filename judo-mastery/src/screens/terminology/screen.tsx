import React from "react";
import { View, StyleSheet, } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useTranslation } from "react-i18next";

const TerminologyScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

export default TerminologyScreen;
