import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { fetchTechniqueCategories } from "@/src/firestoreService/techniquesService";

const TechniquesScreen: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchTechniqueCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryPress = (categoryId: string, title: string) => {
    //nav
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCategoryPress(item.id, item.title.en)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title.en}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    marginBottom: 10,
  },
  emoji: { fontSize: 30, marginRight: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});

export default TechniquesScreen;