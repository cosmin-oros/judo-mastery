import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { AuthContextType, UserType } from "../../types/types";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { showAlert } from "@/src/utils/showAlert";
import { useTranslation } from "react-i18next";
import { handleSessionExpired } from "@/src/utils/sessionExpired";
import {
  getUserDataFromFirestore,
  saveUserDataToFirestore,
} from "@/src/firestoreService/userDataService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { t } = useTranslation();

  // Function for signing up a new user
  const signupWithEmailAndPassword = async (
    email: string,
    password: string,
    additionalData: Partial<UserType> = {} // Extra data for the user
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential) {
        const firebaseUser = userCredential.user;
        const idToken = await getIdToken(firebaseUser); // Get the ID token

        // Construct the user data object to match UserType
        const userData: UserType = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null, // Provide null if email is missing
          idToken,
          ...additionalData, // Add any extra data passed during signup
        };

        await saveUserDataToFirestore(userData); // Save to Firestore
        setUser(userData); // Set the full user object
        replaceRoute("/language-selection"); 
      } else {
        console.log("Failed to sign up");
      }
    } catch (error: any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          showAlert(
            t("auth.errors.emailAlreadyInUseTitle"),
            t("auth.errors.emailAlreadyInUseMessage")
          );
          break;
        case "auth/weak-password":
          showAlert(
            t("auth.errors.weakPasswordTitle"),
            t("auth.errors.weakPasswordMessage")
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

  // Function to fetch user data
  const fetchUserData = async (uid: string, idToken: string) => {
    try {
      const userDataFromFirestore = await getUserDataFromFirestore(uid); // Fetch data from Firestore

      if (userDataFromFirestore) {
        // Construct the user data object to match UserType
        const userData: UserType = {
          ...userDataFromFirestore,
          uid,
          email: userDataFromFirestore.email || null, // Provide null if email is missing
          idToken, // Merge the ID token
        };

        setUser(userData); // Set the full user object
        replaceRoute("/(tabs)/home");
      } else {
        console.error("User data not found");
        setUser(null);
        replaceRoute("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      await handleSessionExpired();
    }
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential) {
        const firebaseUser = userCredential.user;
        const idToken = await getIdToken(firebaseUser);

        // Fetch user data from Firestore
        await fetchUserData(firebaseUser.uid, idToken);
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

        // Fetch user data from Firestore
        await fetchUserData(firebaseUser.uid, idToken);
      } else {
        setUser(null);
        await handleSessionExpired();
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithEmailAndPassword,
        signupWithEmailAndPassword,
        logout,
        getAuthToken,
      }}
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
