import React, { useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors } from "@/src/theme/colors";

const screenWidth = Dimensions.get("window").width;

interface CategoryCardProps {
  item: any;
  onPress: (categoryId: string, title: string) => void;
  theme: any;
}

const CategoryCard: React.FC<CategoryCardProps> = React.memo(
  ({ item, onPress, theme }) => {
    // Create animated scale value only once per instance
    const scaleValue = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              shadowColor: theme.colors.border,
              width: screenWidth * 0.95, // Card now takes 95% of the screen width
              borderColor: colors.primary,
            },
          ]}
          activeOpacity={0.9}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => onPress(item.id, item.title.en)}
        >
          <View
            style={[
              styles.emojiContainer,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={[styles.emoji, { color: theme.colors.background }]}>
              {item.emoji}
            </Text>
          </View>
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.title,
                theme.fonts.bold,
                { color: theme.colors.text },
              ]}
            >
              {item.title.en}
            </Text>
            <Text
              style={[
                styles.original,
                theme.fonts.regular,
                { color: theme.colors.placeholder },
              ]}
            >
              {item.original}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    marginVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    // iOS shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    // Android elevation
    elevation: 8,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 24,
  },
  emoji: {
    fontSize: 42,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
  },
  original: {
    fontSize: 18,
    marginTop: 6,
    fontStyle: "italic",
  },
});

export default CategoryCard;
