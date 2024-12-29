import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";

const HomeScreen: React.FC = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Button title="profile" onPress={()=>replaceRoute('/(tabs)/profile')} />
      <Button title="Logout" onPress={logout} />
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
