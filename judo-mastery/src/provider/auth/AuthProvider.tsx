import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, firestore } from "./firebase";
import { AuthContextType, UserType } from "../../types/types";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { showAlert } from "@/src/utils/showAlert";
import { useTranslation } from "react-i18next";
import { handleSessionExpired } from "@/src/utils/sessionExpired";
import {
  getUserDataFromFirestore,
  saveUserDataToFirestore,
  updateUserPushToken,
} from "@/src/firestoreService/userDataService";
import { BELT_COLORS } from "@/src/types/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { doc, deleteDoc } from "firebase/firestore";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined study notifications
const STUDY_NOTIFICATIONS = [
  {
    title: "Judo Tip",
    body: "Review your techniques today to improve your form!",
  },
  {
    title: "Reminder",
    body: "Don't forget to complete your lesson for extra XP!",
  },
  {
    title: "Quick Drill",
    body: "Spend 10 minutes on terminology practice today!",
  },
  {
    title: "Stay Sharp",
    body: "A quick review of yesterday's lesson can boost your retention.",
  },
];

// Schedule two random notifications per day (between 9 AM and 9 PM)
const scheduleDailyNotifications = async () => {
  const now = new Date();
  const startHour = 9;
  const endHour = 21;

  const getRandomTimeForToday = () => {
    const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const minute = Math.floor(Math.random() * 60);
    const scheduledDate = new Date(now);
    scheduledDate.setHours(hour, minute, 0, 0);
    if (scheduledDate <= now) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }
    return scheduledDate;
  };

  const getTwoRandomNotifications = () => {
    const copy = [...STUDY_NOTIFICATIONS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 2);
  };

  const twoNotifications = getTwoRandomNotifications();

  for (const notification of twoNotifications) {
    const scheduledDate = getRandomTimeForToday();
    const secondsUntilTrigger = Math.floor(
      (scheduledDate.getTime() - now.getTime()) / 1000
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        sound: true,
      },
      // For time interval triggers, include type: "timeInterval"
      // @ts-ignore
      trigger: { seconds: secondsUntilTrigger, repeats: false, type: "timeInterval" },
    });

    console.log(
      `Scheduled "${notification.title}" in ${secondsUntilTrigger} seconds at ${scheduledDate}`
    );
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldShowAlert: true,
    shouldSetBadge: false,
  }),
});

// Register for push notifications and get the token
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notifications");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
  } else {
    alert("Must use a physical device for Push notifications");
  }
  
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { t } = useTranslation();

  // SIGN UP
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
          profilePhoto: "1",
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

  // LOG IN
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

  // LOG OUT
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      replaceRoute("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch user data from Firestore and navigate accordingly
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

  // Get the current user's ID token
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

  // Handle authentication errors and display alerts
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

  const updateUser = (newUser: UserType) => {
    setUser(newUser);
  };

  // Listen for auth state changes and register for push notifications if a user is signed in
  useEffect(() => {
    const registerNotificationsAndSchedule = async (firebaseUser: FirebaseUser) => {
      try {
        const idToken = await getIdToken(firebaseUser);
        await fetchUserData(firebaseUser.uid, idToken);

        // Register for push notifications and obtain token
        const token = await registerForPushNotificationsAsync();
        if (token && token.data) {
          // Update push token in Firestore if necessary
          if (!user?.push_token || user.push_token !== token.data) {
            await updateUserPushToken(firebaseUser.uid, token.data);
          }
        }

        // Schedule two random study reminders per day
        await scheduleDailyNotifications();
      } catch (error) {
        console.error("Error in notification registration/scheduling:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await registerNotificationsAndSchedule(firebaseUser);
      } else {
        setUser(null);
        await handleSessionExpired();
      }
    });

    // Optional: Listen for notification responses
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification pressed:", response);
        replaceRoute("/pushNotifications");
      }
    );

    return () => {
      unsubscribe();
      notificationResponseListener.remove();
    };
  }, []);

  const deleteAccount = async (): Promise<void> => {
    // Check for current user
    const currentFirebaseUser = auth.currentUser;
    if (!currentFirebaseUser || !user?.uid) {
      throw new Error("No user is currently authenticated.");
    }

    // A) Delete Firestore doc
    const userRef = doc(firestore, "users", user.uid);
    await deleteDoc(userRef);

    // B) Delete from Firebase Auth
    // This might require re-authentication if last sign-in was long ago
    await currentFirebaseUser.delete();

    // Clear local user state
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithEmailAndPassword,
        signupWithEmailAndPassword,
        logout,
        getAuthToken,
        updateUser,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
