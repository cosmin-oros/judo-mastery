import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/src/theme/colors";

interface FormLinkProps {
  text: string;
  onPress: () => void;
}

const FormLink: React.FC<FormLinkProps> = ({ text, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.link, { color: colors.primary }]}>{text}</Text>
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
