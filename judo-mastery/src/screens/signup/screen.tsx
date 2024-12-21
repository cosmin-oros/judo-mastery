import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import CustomInput from "../login/components/CustomInput";
import FormButton from "../login/components/FormButton";
import FormLink from "../login/components/FormLink";

const SignUpScreen: React.FC = () => {
  const { t } = useTranslation();
  const { signupWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", confirmPassword: "" });

  const handleSignUp = async () => {
    const errors = { email: "", password: "", confirmPassword: "" };

    if (!email.includes("@")) errors.email = t("auth.errors.invalid-email-message");
    if (password.length < 6) errors.password = t("auth.errors.wrong-password-message");
    if (password !== confirmPassword) errors.confirmPassword = t("auth.errors.invalid-credential-message");

    setError(errors);

    if (!errors.email && !errors.password && !errors.confirmPassword) {
      try {
        await signupWithEmailAndPassword(email, password);
        replaceRoute("/login");
      } catch {
        setError({ ...errors, email: t("auth.errors.user-not-found-message") });
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomInput
        value={email}
        placeholder={t("auth.errors.invalid-email-title")}
        error={error.email}
        onChangeText={setEmail}
      />
      <CustomInput
        value={password}
        placeholder={t("auth.errors.wrong-password-title")}
        error={error.password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <CustomInput
        value={confirmPassword}
        placeholder={t("auth.errors.invalid-credential-title")}
        error={error.confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      <FormButton label={t("common.sign-up")} onPress={handleSignUp} />
      <FormLink text={t("common.login")} onPress={() => replaceRoute("/login")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});

export default SignUpScreen;
