// AvatarPicker.tsx
import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { colors } from "@/src/theme/colors";

type AvatarType = {
  id: string;
  source: any; // Ideally use ImageSourcePropType, but this works for now
};

type AvatarPickerProps = {
  visible: boolean;
  selectedAvatar: string;
  onClose: () => void;
  onSelect: (avatarId: string) => void;
};

const avatars: AvatarType[] = [
  { id: "1", source: require("../../../../assets/images/avatar1.jpg") },
  { id: "2", source: require("../../../../assets/images/avatar2.jpg") },
  { id: "3", source: require("../../../../assets/images/avatar3.jpg") },
  { id: "4", source: require("../../../../assets/images/avatar4.jpg") },
  { id: "5", source: require("../../../../assets/images/avatar5.jpg") },
];

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  visible,
  selectedAvatar,
  onClose,
  onSelect,
}) => {
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: AvatarType }) => (
    <TouchableOpacity
      style={[
        styles.avatarContainer,
        selectedAvatar === item.id && {
          borderColor: colors.primary,
          borderWidth: 3,
        },
      ]}
      onPress={() => onSelect(item.id)}
    >
      <Image source={item.source} style={styles.avatarImage} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
          <FlatList
            data={avatars}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.avatarList}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
  },
  avatarList: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 40, // half of width/height for a circle
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default AvatarPicker;
