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
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { saveUserDataToFirestore } from "@/src/firestoreService/userDataService";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { colors } from "@/src/theme/colors";
import EditHeader from "../components/EditHeader";
import AvatarPicker from "../components/AvatarPicker";
import BeltModal, { BeltOption, BeltType } from "../components/BeltModal";
import DropDownPicker from "react-native-dropdown-picker";

/** Return the correct image source for an avatar ID */
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

/** Belt options with no purple */
const beltOptions: BeltOption[] = [
  { value: "white" },
  { value: "yellow" },
  { value: "orange" },
  { value: "green" },
  { value: "blue" },
  { value: "brown" },
  { value: "black" },
  { value: "red-and-white" },
  { value: "red" },
];

/**
 * Return a style object for the preview circle in the main screen.
 * For "red-and-white", we do a half red, half white approach. 
 * Otherwise, fill the circle with the appropriate color.
 */
function getBeltPreviewStyle(belt: BeltType) {
  switch (belt) {
    case "white":
      return { backgroundColor: "#FFFFFF" };
    case "yellow":
      return { backgroundColor: "#FFD700" };
    case "orange":
      return { backgroundColor: "#FFA500" };
    case "green":
      return { backgroundColor: "#008000" };
    case "blue":
      return { backgroundColor: "#0000FF" };
    case "brown":
      return { backgroundColor: "#8B4513" };
    case "black":
      return { backgroundColor: "#000000" };
    case "red":
      return { backgroundColor: "#FF0000" };
    case "red-and-white":
      // We'll return a 'special' style to handle half/half in the UI
      return {};
    default:
      return { backgroundColor: "#CCC" };
  }
}

const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [experience, setExperience] = useState("");
  const [beltRank, setBeltRank] = useState<BeltType>("white");
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

  // Avatar
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);

  // Belt modal
  const [beltModalVisible, setBeltModalVisible] = useState(false);

  // DropDownPicker for training focus
  const [openTrainingFocus, setOpenTrainingFocus] = useState(false);

  /** Pre-populate fields from Firestore user data */
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
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
      !firstName ||
      !lastName ||
      experience === undefined ||
      experience === null ||
      competitionsParticipated === undefined ||
      competitionsParticipated === null ||
      trainingFrequency === undefined ||
      trainingFrequency === null ||
      !goals ||
      !favoriteTechniques
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
        name: lastName,
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
        nestedScrollEnabled
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

        {/* First Name */}
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

        {/* Last Name */}
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

        {/* Experience */}
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

        {/* Competitions Participated */}
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

        {/* Ippons */}
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

        {/* Waza Aris */}
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

        {/* Yukos */}
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

        {/* Gold Medals */}
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

        {/* Silver Medals */}
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

        {/* Bronze Medals */}
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

        {/* Belt Rank (2-column color swatch modal) */}
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t("extra-user-data.beltRank")}
        </Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.card, alignItems: "center" },
          ]}
          onPress={() => setBeltModalVisible(true)}
        >
          <Ionicons name="medal-outline" size={24} color={theme.colors.primary} />
          {/* If beltRank is red-and-white, do a half circle. Otherwise fill the circle. */}
          {beltRank === "red-and-white" ? (
            <View style={styles.redWhitePreview}>
              <View style={[styles.redWhiteHalfPreview, styles.leftHalf]} />
              <View style={[styles.redWhiteHalfPreview, styles.rightHalf]} />
            </View>
          ) : (
            <View
              style={[
                styles.beltSwatchPreview,
                getBeltPreviewStyle(beltRank),
              ]}
            />
          )}
        </TouchableOpacity>

        {/* Training Frequency */}
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

        {/* Goals */}
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

        {/* Training Focus (DropDownPicker) */}
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
            zIndex: 2000,
          }}
          textStyle={{
            color: theme.colors.text,
          }}
        />

        {/* Favorite Techniques */}
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

        {/* Save Button */}
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
          <Ionicons name="checkmark-done-outline" size={24} color={theme.colors.background} />
          <Text style={[styles.saveButtonText, { color: theme.colors.background, marginLeft: 8 }]}>
            {t("extra-user-data.save")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Avatar Picker */}
      <AvatarPicker
        visible={avatarPickerVisible}
        selectedAvatar={selectedAvatar}
        onClose={() => setAvatarPickerVisible(false)}
        onSelect={(avatarId) => {
          setSelectedAvatar(avatarId);
          setAvatarPickerVisible(false);
        }}
      />

      {/* Belt Modal */}
      <BeltModal
        visible={beltModalVisible}
        beltOptions={beltOptions}
        onSelect={(belt: BeltType) => setBeltRank(belt)}
        onClose={() => setBeltModalVisible(false)}
      />
    </View>
  );
};

export default EditProfileScreen;

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
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderRadius: 12,
    borderColor: "#ccc",
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
  saveButton: {
    paddingVertical: 15,
    borderRadius: 18,
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },

  // Belt preview in the main screen
  beltSwatchPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    backgroundColor: "#CCC", // fallback
  },
  redWhitePreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    overflow: "hidden",
    position: "relative",
  },
  redWhiteHalfPreview: {
    position: "absolute",
    width: "50%",
    height: "100%",
  },
  leftHalf: {
    left: 0,
    backgroundColor: "#FF0000",
  },
  rightHalf: {
    right: 0,
    backgroundColor: "#FFFFFF",
  },
});
