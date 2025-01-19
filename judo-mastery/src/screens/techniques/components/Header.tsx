import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { ProfileHeaderProps } from "@/src/types/types";
import { useTranslation } from "react-i18next";

const Header: React.FC<ProfileHeaderProps> = ({ title }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        {t(title)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    marginBottom: "3%",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Header;
