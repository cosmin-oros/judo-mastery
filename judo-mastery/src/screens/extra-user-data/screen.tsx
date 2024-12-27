import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 
import DropDownPicker from "react-native-dropdown-picker";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { saveUserDataToFirestore } from "@/src/firestoreService/userDataService";
import { replaceRoute } from "@/src/utils/replaceRoute";

const ExtraUserDataScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [experience, setExperience] = useState("");
  const [beltRank, setBeltRank] = useState("white");
  const [trainingFrequency, setTrainingFrequency] = useState("");
  const [goals, setGoals] = useState("");
  const [trainingFocus, setTrainingFocus] = useState("throws");
  const [favoriteTechniques, setFavoriteTechniques] = useState("");
  const [openBeltRank, setOpenBeltRank] = useState(false);
  const [openTrainingFocus, setOpenTrainingFocus] = useState(false);

  const validateInputs = () => {
    if (!experience || !trainingFrequency || !goals || !favoriteTechniques) {
      Alert.alert(
        t("extra-user-data.validationTitle"),
        t("extra-user-data.validationMessage")
      );
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateInputs()) return;

    if (user) {
      const updatedUserData = {
        ...user,
        birthDate: user.birthDate || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        experience,
        beltRank,
        trainingFrequency: Number(trainingFrequency),
        goals,
        trainingFocus,
        favoriteTechniques,
      };

      await saveUserDataToFirestore(updatedUserData); // Save to Firestore
      replaceRoute("/tabs/home");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t("extra-user-data.title")}
        </Text>

        {/* Experience */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="school" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            placeholder={t("extra-user-data.experiencePlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        {/* Belt Rank */}
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t("extra-user-data.beltRank")}
        </Text>
        <DropDownPicker
          open={openBeltRank}
          value={beltRank}
          items={[
            { label: t("extra-user-data.white"), value: "white" },
            { label: t("extra-user-data.yellow"), value: "yellow" },
            { label: t("extra-user-data.orange"), value: "orange" },
            { label: t("extra-user-data.green"), value: "green" },
            { label: t("extra-user-data.blue"), value: "blue" },
            { label: t("extra-user-data.purple"), value: "purple" },
            { label: t("extra-user-data.brown"), value: "brown" },
            { label: t("extra-user-data.black"), value: "black" },
            { label: t("extra-user-data.red-and-white"), value: "red-and-white" },
            { label: t("extra-user-data.red"), value: "red" },
          ]}
          setOpen={setOpenBeltRank}
          setValue={setBeltRank}
          style={[styles.picker, { backgroundColor: theme.colors.card }]}
          dropDownContainerStyle={{
            backgroundColor: theme.colors.card,
          }}
        />

        {/* Training Frequency */}
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="fitness-center"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={trainingFrequency}
            onChangeText={setTrainingFrequency}
            keyboardType="numeric"
            placeholder={t("extra-user-data.trainingFrequencyPlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        {/* Goals */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="flag" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={goals}
            onChangeText={setGoals}
            multiline
            placeholder={t("extra-user-data.goalsPlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

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
          dropDownContainerStyle={{
            backgroundColor: theme.colors.card,
          }}
        />

        {/* Favorite Techniques */}
        <View style={styles.inputContainer}>
          <MaterialIcons name="stars" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={favoriteTechniques}
            onChangeText={setFavoriteTechniques}
            placeholder={t("extra-user-data.favoriteTechniquesPlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSaveProfile}
        >
          <Text
            style={[styles.saveButtonText, { color: theme.colors.background }]}
          >
            {t("extra-user-data.save")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    marginLeft: 10,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderRadius: 12,
    borderColor: "#ccc",
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "white",
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ExtraUserDataScreen;
