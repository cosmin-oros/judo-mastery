import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
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
import { BELT_COLORS } from "@/src/types/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { t } = useTranslation();

  /**
   * Sign up a new user with email and password and save their details to Firestore
   */
  const signupWithEmailAndPassword = async (
    email: string,
    password: string,
    additionalData: Partial<UserType> = {}
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential) {
        const firebaseUser = userCredential.user;
        const idToken = await getIdToken(firebaseUser);

        const userData: UserType = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          idToken,
          achievements: [],
          beltRank: "white",
          daily_tasks: [],
          icon: 1,
          level: 1,
          name: additionalData.name || "",
          statistics: {
            tasks_completed: 0,
            techniques_learned: 0,
            xp: 0,
          },
          ...additionalData,
        };

        await saveUserDataToFirestore(userData);
        setUser(userData);
        replaceRoute("/language-selection");
      } else {
        console.error("Failed to sign up");
      }
    } catch (error: any) {
      handleError(error, "auth.errors");
      throw error;
    }
  };

  /**
   * Log in a user with email and password
   */
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential) {
        const firebaseUser = userCredential.user;
        const idToken = await getIdToken(firebaseUser);

        await fetchUserData(firebaseUser.uid, idToken);
      } else {
        console.error("Failed to log in");
      }
    } catch (error: any) {
      handleError(error, "auth.errors");
      throw error;
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      replaceRoute("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  /**
   * Fetch user data from Firestore and set it in the context
   */
  const fetchUserData = async (uid: string, idToken: string) => {
    try {
      const userDataFromFirestore = await getUserDataFromFirestore(uid);

      if (userDataFromFirestore) {
        const userData: UserType = {
          ...userDataFromFirestore,
          uid,
          email: userDataFromFirestore.email || null,
          idToken,
        };

        setUser(userData);
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

  /**
   * Get the ID token of the currently logged-in user
   */
  const getAuthToken = async (): Promise<string | null> => {
    if (auth.currentUser) {
      try {
        return await getIdToken(auth.currentUser);
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

  /**
   * Handle Firebase authentication state changes
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser);

        await fetchUserData(firebaseUser.uid, idToken);
      } else {
        setUser(null);
        await handleSessionExpired();
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Handle authentication errors and show alerts
   */
  const handleError = (error: any, errorKeyPrefix: string) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        showAlert(
          t(`${errorKeyPrefix}.emailAlreadyInUseTitle`),
          t(`${errorKeyPrefix}.emailAlreadyInUseMessage`)
        );
        break;
      case "auth/weak-password":
        showAlert(
          t(`${errorKeyPrefix}.weakPasswordTitle`),
          t(`${errorKeyPrefix}.weakPasswordMessage`)
        );
        break;
      case "auth/invalid-email":
        showAlert(
          t(`${errorKeyPrefix}.invalidEmailTitle`),
          t(`${errorKeyPrefix}.invalidEmailMessage`)
        );
        break;
      case "auth/user-not-found":
        showAlert(
          t(`${errorKeyPrefix}.userNotFoundTitle`),
          t(`${errorKeyPrefix}.userNotFoundMessage`)
        );
        break;
      case "auth/wrong-password":
        showAlert(
          t(`${errorKeyPrefix}.wrongPasswordTitle`),
          t(`${errorKeyPrefix}.wrongPasswordMessage`)
        );
        break;
      default:
        showAlert(
          t(`${errorKeyPrefix}.unknownErrorTitle`),
          t(`${errorKeyPrefix}.unknownErrorMessage`)
        );
        break;
    }
  };

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

/**
 * Custom hook for accessing the Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
