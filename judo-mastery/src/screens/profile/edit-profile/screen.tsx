import React, { useState, useEffect } from "react";
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
import EditHeader from "../components/EditHeader";
import AvatarPicker from "../components/AvatarPicker";

// Helper function to return the correct image source for an avatar ID
const getAvatarSource = (avatarId: string) => {
  switch (avatarId) {
    case "1":
      return require("../../../../assets/images/avatar1.jpg");
    case "2":
      return require("../../../../assets/images/avatar2.jpg");
    case "3":
      return require("../../../../assets/images/avatar3.jpg");
    case "4":
      return require("../../../../assets/images/avatar4.jpg");
    case "5":
      return require("../../../../assets/images/avatar5.jpg");
    default:
      return require("../../../../assets/images/avatar1.jpg");
  }
};

const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  // Destructure updateUser from useAuth so we can update the context immediately
  const { user, updateUser } = useAuth();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [experience, setExperience] = useState("");
  // Update beltRank state type to the union expected by UserType
  const [beltRank, setBeltRank] = useState<"white" | "yellow" | "orange" | "green" | "blue" | "brown" | "black">("white");
  const [trainingFrequency, setTrainingFrequency] = useState("");
  const [goals, setGoals] = useState("");
  const [trainingFocus, setTrainingFocus] = useState("throws");
  const [favoriteTechniques, setFavoriteTechniques] = useState("");

  // Competition Section state
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

  // Pre-populate fields (including avatar) from Firestore user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      // Assuming that user.name contains the last name
      setLastName(user.name || "");
      setExperience(user.experience || "");
      setBeltRank(user.beltRank || "white");
      setTrainingFrequency(user.trainingFrequency ? String(user.trainingFrequency) : "");
      setGoals(user.goals || "");
      setTrainingFocus(user.trainingFocus || "throws");
      setFavoriteTechniques(user.favoriteTechniques || "");
      setCompetitionsParticipated(user.competitionsParticipated || "");
      setIppons(user.ippons || "");
      setWazaAris(user.wazaAris || "");
      setYukos(user.yukos || "");
      setGoldMedals(user.goldMedals || "");
      setSilverMedals(user.silverMedals || "");
      setBronzeMedals(user.bronzeMedals || "");
      setSelectedAvatar(user.profilePhoto || "1");
    }
  }, [user]);

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
        firstName,
        lastName,
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
        profilePhoto: selectedAvatar,
      };

      try {
        await saveUserDataToFirestore(updatedUserData);
        // Immediately update the Auth context with the new user data
        updateUser(updatedUserData);
        Alert.alert(
          t("extra-user-data.saveSuccessTitle"),
          t("extra-user-data.saveSuccessMessage")
        );
        replaceRoute("/(tabs)/profile");
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
      <EditHeader title={t("profile.editTitle")} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {/* Avatar Section */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => setAvatarPickerVisible(true)}
        >
          <Image
            source={getAvatarSource(selectedAvatar)}
            style={styles.avatarImageLarge}
          />
          <View style={styles.editIconOverlay}>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Input Fields */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t("extra-user-data.firstNamePlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
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

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
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

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <AntDesign name="Trophy" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={competitionsParticipated}
            onChangeText={setCompetitionsParticipated}
            keyboardType="numeric"
            placeholder={t("extra-user-data.competitionsParticipated")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="sports-kabaddi" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={ippons}
            onChangeText={setIppons}
            keyboardType="numeric"
            placeholder={t("extra-user-data.ippons")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="sports-kabaddi" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={wazaAris}
            onChangeText={setWazaAris}
            keyboardType="numeric"
            placeholder={t("extra-user-data.wazaAris")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="sports-kabaddi" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={yukos}
            onChangeText={setYukos}
            keyboardType="numeric"
            placeholder={t("extra-user-data.yukos")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={24} color={colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={goldMedals}
            onChangeText={setGoldMedals}
            keyboardType="numeric"
            placeholder={t("extra-user-data.goldMedals")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={24} color={colors["slate-500"]} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={silverMedals}
            onChangeText={setSilverMedals}
            keyboardType="numeric"
            placeholder={t("extra-user-data.silverMedals")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="medal-outline" size={24} color={colors["amber-500"]} />
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
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="fitness-center" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={trainingFrequency}
            onChangeText={setTrainingFrequency}
            keyboardType="numeric"
            placeholder={t("extra-user-data.trainingFrequencyPlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
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
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="stars" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={favoriteTechniques}
            onChangeText={setFavoriteTechniques}
            placeholder={t("extra-user-data.favoriteTechniquesPlaceholder")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: theme.colors.primary,
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
          onPress={handleSaveProfile}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={24}
            color={theme.colors.background}
          />
          <Text
            style={[
              styles.saveButtonText,
              { color: theme.colors.background, marginLeft: 8 },
            ]}
          >
            {t("extra-user-data.save")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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

export default EditProfileScreen;
