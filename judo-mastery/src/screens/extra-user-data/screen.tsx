import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { saveUserDataToFirestore } from "@/src/firestoreService/userDataService";
import DropDownPicker from 'react-native-dropdown-picker';
import { replaceRoute } from "@/src/utils/replaceRoute";

const ExtraUserDataScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [experience, setExperience] = useState<string>("");
  const [beltRank, setBeltRank] = useState<string>("white");
  const [trainingFrequency, setTrainingFrequency] = useState<number>(0);
  const [goals, setGoals] = useState<string>("");
  const [trainingFocus, setTrainingFocus] = useState<string>("throws");
  const [favoriteTechniques, setFavoriteTechniques] = useState<string>("");
  const [openBeltRank, setOpenBeltRank] = useState(false);
  const [openTrainingFocus, setOpenTrainingFocus] = useState(false);

  const handleSaveProfile = async () => {
    if (!experience || !trainingFrequency || !goals || !favoriteTechniques) {
      return; // Add validation to ensure fields are filled
    }

    if (user) {
      const updatedUserData = {
        ...user,
        birthDate: user.birthDate || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        experience,
        beltRank,
        trainingFrequency,
        goals,
        trainingFocus,
        favoriteTechniques,
      };

      await saveUserDataToFirestore(updatedUserData); // Save to Firestore
      replaceRoute('/tabs/home')
      console.log("Profile saved successfully!");
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t("extra-user-data.title")}
      </Text>

      {/* Experience */}
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t("extra-user-data.experience")}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        value={experience}
        onChangeText={setExperience}
        keyboardType="numeric"
        placeholder={t("extra-user-data.experiencePlaceholder")}
      />

      {/* Belt Rank */}
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t("extra-user-data.beltRank")}
      </Text>
      <DropDownPicker
        open={openBeltRank}
        value={beltRank}
        items={[
          { label: t("extra-user-data.white"), value: "white" },
          { label: t("extra-user-data.blue"), value: "blue" },
          { label: t("extra-user-data.black"), value: "black" },
        ]}
        setOpen={setOpenBeltRank}
        setValue={setBeltRank}
        style={[styles.picker, { backgroundColor: theme.colors.card }]}
      />

      {/* Training Frequency */}
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t("extra-user-data.trainingFrequency")}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        value={String(trainingFrequency)}
        onChangeText={(text) => setTrainingFrequency(Number(text))}
        keyboardType="numeric"
        placeholder={t("extra-user-data.trainingFrequencyPlaceholder")}
      />

      {/* Goals */}
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t("extra-user-data.goals")}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        value={goals}
        onChangeText={setGoals}
        multiline
        placeholder={t("extra-user-data.goalsPlaceholder")}
      />

      {/* Training Focus */}
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t("extra-user-data.trainingFocus")}
      </Text>
      <DropDownPicker
        open={openTrainingFocus}
        value={trainingFocus}
        items={[
          { label: t("extra-user-data.throws"), value: "throws" },
          { label: t("extra-user-data.grappling"), value: "grappling" },
          { label: t("extra-user-data.groundwork"), value: "groundwork" },
        ]}
        setOpen={setOpenTrainingFocus}
        setValue={setTrainingFocus}
        style={[styles.picker, { backgroundColor: theme.colors.card }]}
      />

      {/* Favorite Techniques */}
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t("extra-user-data.favoriteTechniques")}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        value={favoriteTechniques}
        onChangeText={setFavoriteTechniques}
        placeholder={t("extra-user-data.favoriteTechniquesPlaceholder")}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSaveProfile}
      >
        <Text style={[styles.saveButtonText, { color: theme.colors.background }]}>
          {t("extra-user-data.save")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingLeft: 10,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderRadius: 12,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ExtraUserDataScreen;
