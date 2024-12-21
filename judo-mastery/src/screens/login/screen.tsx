import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/provider/auth/AuthProvider";
import { replaceRoute } from "@/src/utils/replaceRoute";
import CustomInput from "./components/CustomInput";
import FormButton from "./components/FormButton";
import FormLink from "./components/FormLink";

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { loginWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const errors = { email: "", password: "" };

    if (!email.includes("@")) errors.email = t("auth.errors.invalid-email-message");
    if (password.length < 6) errors.password = t("auth.errors.wrong-password-message");

    setError(errors);

    if (!errors.email && !errors.password) {
      try {
        await loginWithEmailAndPassword(email, password);
        replaceRoute("/(tabs)/home");
      } catch {
        setError({ ...errors, password: t("auth.errors.unknown-error-message") });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>{t("common.login")}</Text>
      <View style={styles.inputContainer}>
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
      </View>
      <FormButton label={t("common.login")} onPress={handleLogin} />
      <FormLink text={t("auth.dont-have-account")} onPress={() => replaceRoute("/signup")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
});

export default LoginScreen;
