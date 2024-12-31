import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { replaceRoute } from "@/src/utils/replaceRoute";

const HomeScreen: React.FC = () => {

  return (
    <View style={styles.container}>
      <Button title="settings" onPress={()=>replaceRoute('/settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },
});

export default HomeScreen;
