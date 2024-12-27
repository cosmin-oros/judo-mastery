import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { FormLinkProps } from "@/src/types/types";

const FormLink: React.FC<FormLinkProps> = ({ text, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.link, { color: theme.colors.primary }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    marginTop: 20,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default FormLink;
