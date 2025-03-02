import React from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";

/** The belt types we support (no purple). */
export type BeltType =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "brown"
  | "black"
  | "red"
  | "red-and-white";

export interface BeltOption {
  value: BeltType;
}

/** The number of columns in the grid. */
const NUM_COLUMNS = 2;

/** 
 * Utility to render the belt circle for each belt. 
 * For standard colors, we fill the entire circle. 
 * For "red-and-white", we do a half/half approach.
 */
const BeltCircle: React.FC<{ belt: BeltType }> = ({ belt }) => {
  if (belt === "red-and-white") {
    return (
      <View style={styles.redWhiteContainer}>
        <View style={[styles.redWhiteHalf, styles.leftHalf]} />
        <View style={[styles.redWhiteHalf, styles.rightHalf]} />
      </View>
    );
  }

  let circleColor = "#ccc"; // fallback
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

  return <View style={[styles.circle, { backgroundColor: circleColor }]} />;
};

interface BeltModalProps {
  visible: boolean;
  beltOptions: BeltOption[];
  onSelect: (belt: BeltType) => void;
  onClose: () => void;
}

const BeltModal: React.FC<BeltModalProps> = ({
  visible,
  beltOptions,
  onSelect,
  onClose,
}) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
          <FlatList
            data={beltOptions}
            keyExtractor={(item) => item.value}
            numColumns={NUM_COLUMNS}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <BeltCircle belt={item.value} />
              </TouchableOpacity>
            )}
          />

          {/* Minimal close handle at the bottom */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View
              style={[
                styles.closeButtonInner,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BeltModal;

const ITEM_SIZE = Dimensions.get("window").width / (NUM_COLUMNS * 2);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  circle: {
    width: ITEM_SIZE * 0.8,
    height: ITEM_SIZE * 0.8,
    borderRadius: (ITEM_SIZE * 0.8) / 2,
  },
  // For the red-and-white belt
  redWhiteContainer: {
    width: ITEM_SIZE * 0.8,
    height: ITEM_SIZE * 0.8,
    borderRadius: (ITEM_SIZE * 0.8) / 2,
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
  closeButton: {
    alignSelf: "center",
    marginTop: 15,
  },
  closeButtonInner: {
    width: 40,
    height: 6,
    borderRadius: 3,
  },
});
