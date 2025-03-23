import React from "react";
import { SafeAreaView } from "react-native";
import LeaderboardScreen from "@/src/screens/leaderboard/screen";

const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LeaderboardScreen />
    </SafeAreaView>
  );
};

export default Index;
