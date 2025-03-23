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
import AvatarPicker from "../profile/components/AvatarPicker";

/** The belt types we support (no purple). */
type BeltType =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "brown"
  | "black"
  | "red"
  | "red-and-white";

/** Belt option interface for the modal. */
interface BeltOption {
  value: BeltType;
}

/** Return the correct image source for an avatar ID */
const getAvatarSource = (avatarId: string) => {
  switch (avatarId) {
    case "1":
      return require("../../../assets/images/avatar1.jpg");
    case "2":
      return require("../../../assets/images/avatar2.jpg");
    case "3":
      return require("../../../assets/images/avatar3.jpg");
    case "4":
      return require("../../../assets/images/avatar4.jpg");
    case "5":
      return require("../../../assets/images/avatar5.jpg");
    default:
      return require("../../../assets/images/avatar1.jpg");
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
 * Return a style object for the belt preview circle.
 * For "red-and-white", we do a half red, half white approach. 
 * Otherwise, fill the circle with a color. 
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
      // We'll handle half/half separately in the UI.
      return {};
    default:
      return { backgroundColor: "#CCC" };
  }
}

/** BeltModal – a two-column color swatch picker. */
const BeltModal: React.FC<{
  visible: boolean;
  beltOptions: BeltOption[];
  onSelect: (belt: BeltType) => void;
  onClose: () => void;
}> = ({ visible, beltOptions, onSelect, onClose }) => {
  const { theme } = useTheme();

  /** Single belt circle item */
  const BeltCircle: React.FC<{ belt: BeltType }> = ({ belt }) => {
    if (belt === "red-and-white") {
      return (
        <View style={modalStyles.redWhiteContainer}>
          <View style={[modalStyles.redWhiteHalf, modalStyles.leftHalf]} />
          <View style={[modalStyles.redWhiteHalf, modalStyles.rightHalf]} />
        </View>
      );
    }
    let circleColor = "#ccc";
    switch (belt) {
      case "white":
        circleColor = "#FFFFFF";
        break;
      case "yellow":
        circleColor = "#FFD700";
        break;
      case "orange":
        circleColor = "#FFA500";
        break;
      case "green":
        circleColor = "#008000";
        break;
      case "blue":
        circleColor = "#0000FF";
        break;
      case "brown":
        circleColor = "#8B4513";
        break;
      case "black":
        circleColor = "#000000";
        break;
      case "red":
        circleColor = "#FF0000";
        break;
    }
    return <View style={[modalStyles.circle, { backgroundColor: circleColor }]} />;
  };

  if (!visible) return null;

  return (
    <View style={modalStyles.overlay}>
      <View style={[modalStyles.container, { backgroundColor: theme.colors.card }]}>
        <Text style={[modalStyles.modalTitle, { color: theme.colors.text }]}>
          Select Belt
        </Text>
        <View style={modalStyles.gridContainer}>
          {beltOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={modalStyles.gridItem}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <BeltCircle belt={option.value} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
          <Ionicons
            name="close-circle"
            size={30}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ExtraUserDataScreen: React.FC = () => {
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

  // Avatar selection
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);

  // Belt modal
  const [beltModalVisible, setBeltModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.name || "");
      setExperience(user.experience || "");
      setBeltRank((user.beltRank as BeltType) || "white");
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
  // If every field is optional, you may simply return true.
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
        replaceRoute("/(tabs)/home");
      } catch (error) {
        Alert.alert(
          t("extra-user-data.saveErrorTitle"),
          t("extra-user-data.saveErrorMessage")
        );
      }
    }
  };

  const skipProfile = () => {
    replaceRoute("/(tabs)/home");
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {/* Skip button */}
        <TouchableOpacity style={styles.skipButton} onPress={skipProfile}>
          <Ionicons name="arrow-forward-circle" size={32} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t("extra-user-data.title")}
        </Text>

        {/* Avatar Section */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => setAvatarPickerVisible(true)}
        >
          <Image source={getAvatarSource(selectedAvatar)} style={styles.avatarImageLarge} />
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

        {/* Competitions, ippons, wazaAris, yukos, medals... */}
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

        {/* Belt Rank with color swatch modal */}
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
          {/* If red-and-white, half/half. Otherwise, fill. */}
          {beltRank === "red-and-white" ? (
            <View style={styles.redWhitePreview}>
              <View style={[styles.redWhiteHalfPreview, styles.leftHalf]} />
              <View style={[styles.redWhiteHalfPreview, styles.rightHalf]} />
            </View>
          ) : (
            <View style={[styles.beltSwatchPreview, getBeltPreviewStyle(beltRank)]} />
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

        {/* Training Focus */}
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {t("extra-user-data.trainingFocus")}
        </Text>
        {/* If you wish to keep a text-based approach for trainingFocus, 
            you can keep or remove your original code here. 
            We omit it for brevity or you can re-add a simple text input. */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <MaterialIcons name="stars" size={24} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            value={trainingFocus}
            onChangeText={setTrainingFocus}
            placeholder={t("extra-user-data.trainingFocus")}
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

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
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveButtonContainer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSaveProfile}
        >
          <Text style={[styles.saveButtonText, { color: theme.colors.background }]}>
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

      {/* Belt Modal (two-column color swatch) */}
      <BeltModal
        visible={beltModalVisible}
        beltOptions={beltOptions}
        onSelect={(b) => setBeltRank(b)}
        onClose={() => setBeltModalVisible(false)}
      />
    </View>
  );
};

export default ExtraUserDataScreen;

/** Additional styling for the belt color approach */
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
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
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

  // Belt color preview in the main UI
  beltSwatchPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    backgroundColor: "#CCC",
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

/** BeltModal styling for the two-column color swatch layout. */
const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  gridItem: {
    margin: 10,
    alignItems: "center",
  },
  redWhiteContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
  },
  redWhiteHalf: {
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
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 15,
  },
});
