import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { saveUserDataToFirestore } from "@/src/firestoreService/userDataService";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { colors } from "@/src/theme/colors";
import AvatarPicker from "../profile/components/AvatarPicker";

const ExtraUserDataScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [experience, setExperience] = useState("");
  const [beltRank, setBeltRank] = useState("white");
  const [trainingFrequency, setTrainingFrequency] = useState("");
  const [goals, setGoals] = useState("");
  const [trainingFocus, setTrainingFocus] = useState("throws");
  const [favoriteTechniques, setFavoriteTechniques] = useState("");

  // Competition Section
  const [competitionsParticipated, setCompetitionsParticipated] = useState("");
  const [ippons, setIppons] = useState("");
  const [wazaAris, setWazaAris] = useState("");
  const [yukos, setYukos] = useState("");
  const [goldMedals, setGoldMedals] = useState("");
  const [silverMedals, setSilverMedals] = useState("");
  const [bronzeMedals, setBronzeMedals] = useState("");

  const [openBeltRank, setOpenBeltRank] = useState(false);
  const [openTrainingFocus, setOpenTrainingFocus] = useState(false);

  // Avatar selection state
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);

  const validateInputs = () => {
    if (
      firstName === undefined ||
      lastName === undefined ||
      experience === undefined ||
      experience === null ||
      competitionsParticipated === undefined ||
      competitionsParticipated === null ||
      trainingFrequency === undefined ||
      trainingFrequency === null ||
      goals === undefined ||
      goals === null ||
      favoriteTechniques === undefined ||
      favoriteTechniques === null
    ) {
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
        firstName: firstName,
        lastName: lastName,
        experience,
        beltRank,
        trainingFrequency: Number(trainingFrequency),
        goals,
        trainingFocus,
        favoriteTechniques,
        competitionsParticipated,
        ippons,
        wazaAris,
        yukos,
        goldMedals,
        silverMedals,
        bronzeMedals,
        profilePhoto: selectedAvatar, // Save the selected avatar identifier
      };

      try {
        await saveUserDataToFirestore(updatedUserData); // Save to Firestore
        Alert.alert(
          t("extra-user-data.saveSuccessTitle"),
          t("extra-user-data.saveSuccessMessage")
        );
        replaceRoute("/(tabs)/home");
      } catch (error) {
        Alert.alert(
          t("extra-user-data.saveErrorTitle"),
          t("extra-user-data.saveErrorMessage")
        );
      }
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
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => replaceRoute("/(tabs)/home")}
        >
          <Ionicons
            name="arrow-forward-circle"
            size={32}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t("extra-user-data.title")}
        </Text>

        {/* Avatar Section */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => setAvatarPickerVisible(true)}
        >
          <Image
            source={
              selectedAvatar === "1"
                ? require("../../../assets/images/avatar1.jpg")
                : selectedAvatar === "2"
                ? require("../../../assets/images/avatar2.jpg")
                : selectedAvatar === "3"
                ? require("../../../assets/images/avatar3.jpg")
                : selectedAvatar === "4"
                ? require("../../../assets/images/avatar4.jpg")
                : require("../../../assets/images/avatar5.jpg")
            }
            style={styles.avatarImageLarge}
          />
          <View style={styles.editIconOverlay}>
            <Ionicons
              name="create-outline"
              size={24}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>

        {/* Input Fields */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t("extra-user-data.firstNamePlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t("extra-user-data.lastNamePlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        {/* Competition Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t("extra-user-data.competitionSection")}
        </Text>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <MaterialIcons
            name="school"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            placeholder={t("extra-user-data.experiencePlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <AntDesign
            name="Trophy"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={competitionsParticipated}
            onChangeText={setCompetitionsParticipated}
            keyboardType="numeric"
            placeholder={t("extra-user-data.competitionsParticipated")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <MaterialIcons
            name="sports-kabaddi"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={ippons}
            onChangeText={setIppons}
            keyboardType="numeric"
            placeholder={t("extra-user-data.ippons")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <MaterialIcons
            name="sports-kabaddi"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={wazaAris}
            onChangeText={setWazaAris}
            keyboardType="numeric"
            placeholder={t("extra-user-data.wazaAris")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <MaterialIcons
            name="sports-kabaddi"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={yukos}
            onChangeText={setYukos}
            keyboardType="numeric"
            placeholder={t("extra-user-data.yukos")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Ionicons
            name="medal-outline"
            size={24}
            color={colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={goldMedals}
            onChangeText={setGoldMedals}
            keyboardType="numeric"
            placeholder={t("extra-user-data.goldMedals")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Ionicons
            name="medal-outline"
            size={24}
            color={colors["slate-500"]}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={silverMedals}
            onChangeText={setSilverMedals}
            keyboardType="numeric"
            placeholder={t("extra-user-data.silverMedals")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Ionicons
            name="medal-outline"
            size={24}
            color={colors["amber-500"]}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={bronzeMedals}
            onChangeText={setBronzeMedals}
            keyboardType="numeric"
            placeholder={t("extra-user-data.bronzeMedals")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

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
          textStyle={{
            color: theme.colors.text,
          }}
        />
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
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

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <MaterialIcons
            name="flag"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={goals}
            onChangeText={setGoals}
            multiline
            placeholder={t("extra-user-data.goalsPlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

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
          textStyle={{
            color: theme.colors.text,
          }}
        />
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <MaterialIcons
            name="stars"
            size={24}
            color={theme.colors.primary}
          />
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
      <View
        style={[
          styles.saveButtonContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
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

      {/* Avatar Picker Modal */}
      <AvatarPicker
        visible={avatarPickerVisible}
        selectedAvatar={selectedAvatar}
        onClose={() => setAvatarPickerVisible(false)}
        onSelect={(avatarId) => {
          setSelectedAvatar(avatarId);
          setAvatarPickerVisible(false);
        }}
      />
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
    paddingTop: "2%",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginVertical: 10,
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
  skipButton: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 10,
  },
  avatarWrapper: {
    alignSelf: "center",
    marginVertical: 20,
  },
  avatarImageLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editIconOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    padding: 2,
  },
});

export default ExtraUserDataScreen;
