import React, { createContext, useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, getIdToken } from "firebase/auth";
import { auth } from "./firebase";
import { AuthContextType, UserType } from "../../types/types";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { showAlert } from "@/src/utils/showAlert";
import { useTranslation } from "react-i18next";
import { handleSessionExpired } from "@/src/utils/sessionExpired";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { t } = useTranslation();

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential) {
        const firebaseUser = userCredential.user;

        const idToken = await getIdToken(firebaseUser); // Get the ID token

        // ! here get the user data, techniques, terminology from firebase

        // if (userData) {
        //   setUser({ ...userData, idToken });
        //   replaceRoute("/(tabs)/tab1");
        // } else {
        //   setUser(null);
        //   replaceRoute("/login");
        // }

      } else {
        console.log("Failed to log in");
      }
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          showAlert(
            t("auth.errors.invalidEmailTitle"),
            t("auth.errors.invalidEmailMessage")
          );
          break;
        case "auth/user-not-found":
          showAlert(
            t("auth.errors.userNotFoundTitle"),
            t("auth.errors.userNotFoundMessage")
          );
          break;
        case "auth/wrong-password":
          showAlert(
            t("auth.errors.wrongPasswordTitle"),
            t("auth.errors.wrongPasswordMessage")
          );
          break;
        case "auth/invalid-credential":
          showAlert(
            t("auth.errors.invalidCredentialTitle"),
            t("auth.errors.invalidCredentialMessage")
          );
          break;
        case "auth/user-disabled":
          showAlert(
            t("auth.errors.userDisabledTitle"),
            t("auth.errors.userDisabledMessage")
          );
          break;
        case "auth/operation-not-allowed":
          showAlert(
            t("auth.errors.operationNotAllowedTitle"),
            t("auth.errors.operationNotAllowedMessage")
          );
          break;
        case "auth/too-many-requests":
          showAlert(
            t("auth.errors.tooManyRequestsTitle"),
            t("auth.errors.tooManyRequestsMessage")
          );
          break;
        case "auth/timeout":
          showAlert(
            t("auth.errors.timeoutTitle"),
            t("auth.errors.timeoutMessage")
          );
          break;
        default:
          showAlert(
            t("auth.errors.unknownErrorTitle"),
            t("auth.errors.unknownErrorMessage")
          );
          break;
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      replaceRoute("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (auth.currentUser) {
      try {
        return await getIdToken(auth.currentUser); // Retrieve token dynamically
      } catch (error) {
        console.error("Error retrieving ID token:", error);
        await handleSessionExpired(); 
        return null;
      }
    }
    console.log("No authenticated user found");
    await handleSessionExpired();
    return null;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser);
        
        // ! here get the user data, techniques, terminology from firebase

        // if (userData) {
        //   setUser({ ...userData, idToken });
        //   replaceRoute("/(tabs)/tab1");
        // } else {
        //   setUser(null);
        //   replaceRoute("/login");
        // }
      } else {
        setUser(null);
        await handleSessionExpired();
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loginWithEmailAndPassword, logout, getAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
