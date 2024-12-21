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
    <View>
      <Animatable.View ref={shakeAnimation}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: error ? colors.notification : colors.border,
              color: colors.text,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.border}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
      </Animatable.View>
      {error && <Text style={[styles.errorText, { color: colors.notification }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 10,
  },
});

export default CustomInput;
