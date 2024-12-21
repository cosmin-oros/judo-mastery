import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

interface FormButtonProps {
  label: string;
  onPress: () => void;
}

const FormButton: React.FC<FormButtonProps> = ({ label, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: colors.text }]}>{label}</Text>
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
