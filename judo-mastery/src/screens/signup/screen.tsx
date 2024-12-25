import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import CustomInput from "../login/components/CustomInput";
import FormButton from "../login/components/FormButton";
import FormLink from "../login/components/FormLink";
import { useTheme } from "@/src/theme/ThemeProvider";

const SignUpScreen: React.FC = () => {
  const { t } = useTranslation();
  const { signupWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", confirmPassword: "" });
  const { theme } = useTheme();

  const handleSignUp = async () => {
    const errors = { email: "", password: "", confirmPassword: "" };

    if (!email.includes("@")) errors.email = t("auth.errors.invalid-email-message");
    if (password.length < 6) errors.password = t("auth.errors.wrong-password-message");
    if (password !== confirmPassword) errors.confirmPassword = t("auth.errors.invalid-credential-message");

    setError(errors);

    if (!errors.email && !errors.password && !errors.confirmPassword) {
      try {
        await signupWithEmailAndPassword(email, password);
      } catch {
        setError({ ...errors, email: t("auth.errors.user-not-found-message") });
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.bold.fontFamily, fontWeight: theme.fonts.bold.fontWeight }]}>{t("signup.title")}</Text>
      <View style={styles.inputContainer}>
        <CustomInput
          value={email}
          placeholder={t("signup.email-placeholder")}
          error={error.email}
          onChangeText={setEmail}
        />
        <CustomInput
          value={password}
          placeholder={t("signup.password-placeholder")}
          error={error.password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <CustomInput
          value={confirmPassword}
          placeholder={t("signup.confirm-password-placeholder")}
          error={error.confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
        />
      </View>
      <FormButton label={t("signup.sign-up-button")} onPress={handleSignUp} />
      <FormLink text={t("auth.already-have-account")} onPress={() => replaceRoute("/login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
});

export default SignUpScreen;
