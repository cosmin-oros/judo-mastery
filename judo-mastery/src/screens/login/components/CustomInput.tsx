import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { useTheme } from "@react-navigation/native";

interface CustomInputProps {
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string;
  onChangeText: (text: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  placeholder,
  secureTextEntry = false,
  error,
  onChangeText,
}) => {
  const { colors } = useTheme();
  const shakeAnimation = useRef(null);

  useEffect(() => {
    if (error) {
      (shakeAnimation.current as any)?.shake?.();
    }
  }, [error]);

  return (
    <View style={styles.inputWrapper}>
      <Animatable.View ref={shakeAnimation}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: error ? "#ff4d4d" : colors.border,
              color: colors.text,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor="#ccc"
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
      </Animatable.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#ff4d4d",
    marginTop: 5,
  },
});

export default CustomInput;
