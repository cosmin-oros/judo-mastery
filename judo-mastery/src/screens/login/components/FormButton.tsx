import { useTheme } from "@/src/theme/ThemeProvider";
import { FormButtonProps } from "@/src/types/types";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const FormButton: React.FC<FormButtonProps> = ({ label, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: theme.colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%"
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormButton;
