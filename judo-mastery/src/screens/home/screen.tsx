import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import ProfileInfoSection from "./components/ProfileInfoSection";

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const dailyTasks = [
    { id: 1, title: "Stretching Routine", completed: false },
    { id: 2, title: "10 Push-ups", completed: true },
  ];

  const events = [
    { id: 1, title: "Local Judo Competition", date: "2023-11-15" },
    { id: 2, title: "Training Session", date: "2023-11-20" },
  ];

  const techniqueOfTheDay = {
    title: "Seoi Nage",
    description: "A shoulder throw technique to efficiently take down an opponent.",
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => replaceRoute("/settings")}
        >
          <Ionicons name="settings-outline" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <ProfileInfoSection user={user} />

      {/* Daily Tasks Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("home.dailyTasks")}
        </Text>
        {dailyTasks.map((task) => (
          <View
            key={task.id}
            style={[
              styles.taskItem,
              { backgroundColor: task.completed ? theme.colors.primary : theme.colors.card },
            ]}
          >
            <Text
              style={[
                styles.taskText,
                { color: task.completed ? theme.colors.background : theme.colors.text },
              ]}
            >
              {task.title}
            </Text>
          </View>
        ))}
      </View>

      {/* Events Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("home.events")}
        </Text>
        {events.map((event) => (
          <View key={event.id} style={[styles.eventItem, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.eventTitle, { color: theme.colors.text }]}>{event.title}</Text>
            <Text style={[styles.eventDate, { color: theme.colors.placeholder }]}>
              {event.date}
            </Text>
          </View>
        ))}
      </View>

      {/* Technique of the Day Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("home.techniqueOfTheDay")}
        </Text>
        <View style={[styles.techniqueCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.techniqueTitle, { color: theme.colors.text }]}>
            {techniqueOfTheDay.title}
          </Text>
          <Text style={[styles.techniqueDescription, { color: theme.colors.placeholder }]}>
            {techniqueOfTheDay.description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  settingsIcon: {
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  taskItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  eventItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventDate: {
    fontSize: 14,
  },
  techniqueCard: {
    padding: 15,
    borderRadius: 10,
  },
  techniqueTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  techniqueDescription: {
    fontSize: 14,
  },
});

export default HomeScreen;
