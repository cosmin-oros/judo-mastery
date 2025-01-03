import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SettingsOptionProps } from "@/src/types/types";

const Option: React.FC<SettingsOptionProps> = ({ icon, label, isSwitch, switchValue, onSwitchToggle, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.optionContainer}>
      <Ionicons name={icon} size={24} color={theme.colors.primary} />
      <Text style={[styles.optionText, { color: theme.colors.text }]}>{label}</Text>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchToggle}
          thumbColor={switchValue ? theme.colors.primary : "#f4f3f4"}
          trackColor={{ false: "#ccc", true: theme.colors.primary }}
        />
      ) : (
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 15,
  },
});

export default Option;
