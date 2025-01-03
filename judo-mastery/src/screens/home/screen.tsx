import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();

  const dailyTasks = [
    { id: 1, title: t("home.tasks.stretchingRoutine"), completed: false, icon: "🧘" },
    { id: 2, title: t("home.tasks.pushups"), completed: true, icon: "💪" },
  ];

  const events = [
    { id: 1, title: t("home.events.localCompetition"), date: "2023-11-15", icon: "🏆" },
    { id: 2, title: t("home.events.trainingSession"), date: "2023-11-20", icon: "🥋" },
  ];

  const techniqueOfTheDay = {
    title: t("home.technique.title"),
    description: t("home.technique.description"),
    icon: "🎯",
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Ionicons name="person-circle-outline" size={50} color={theme.colors.primary} />
          <View style={styles.infoText}>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>
              {t("home.greeting")}
            </Text>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {user?.firstName || t("profile.defaultFirstName")}
            </Text>
            <Text style={[styles.level, { color: theme.colors.placeholder }]}>
              {t("profile.level")}: {user?.level || 1}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => replaceRoute("/settings")}
        >
          <Ionicons name="settings-outline" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Daily Tasks Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("home.dailyTasks")}
          </Text>
          {dailyTasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.card,
                { backgroundColor: task.completed ? theme.colors.primary : theme.colors.card },
              ]}
            >
              <Text style={styles.cardIcon}>{task.icon}</Text>
              <Text
                style={[
                  styles.cardText,
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
            {t("home.eventsTitle")}
          </Text>
          {events.map((event) => (
            <View
              key={event.id}
              style={[styles.card, { backgroundColor: theme.colors.card }]}
            >
              <Text style={styles.cardIcon}>{event.icon}</Text>
              <View>
                <Text style={[styles.cardText, { color: theme.colors.text }]}>
                  {event.title}
                </Text>
                <Text style={[styles.cardDate, { color: theme.colors.placeholder }]}>
                  {event.date}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Technique of the Day Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("home.techniqueOfTheDay")}
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={styles.cardIcon}>{techniqueOfTheDay.icon}</Text>
            <View>
              <Text style={[styles.cardText, { color: theme.colors.text }]}>
                {techniqueOfTheDay.title}
              </Text>
              <Text style={[styles.cardDescription, { color: theme.colors.placeholder }]}>
                {techniqueOfTheDay.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: "5%",
    paddingBottom: "5%",
    backgroundColor: "transparent",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 10,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "600",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  level: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingsIcon: {
    padding: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDate: {
    fontSize: 14,
    marginTop: 5,
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default HomeScreen;
