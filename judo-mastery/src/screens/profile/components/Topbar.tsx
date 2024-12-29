import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TopBarProps } from "@/src/types/types";

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <View style={styles.topBar}>
      <Ionicons name="arrow-back" size={24} color="black" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 3,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default TopBar;
