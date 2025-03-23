import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";

// Save user data to Firestore
export const saveUserDataToFirestore = async (userData: any) => {
  if (!userData?.uid) {
    throw new Error("User data does not contain uid.");
  }

  try {
    const userRef = doc(firestore, "users", userData.uid); // Specify the path where the data is to be stored
    await setDoc(userRef, userData, { merge: true }); // Use merge to update only the provided fields
  } catch (error) {
    console.error("Error saving user data to Firestore: ", error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserDataFromFirestore = async (uid: string) => {
  const userRef = doc(firestore, "users", uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};

// Update the user's push token in Firestore
export const updateUserPushToken = async (uid: string, pushToken: string) => {
  try {
    const userRef = doc(firestore, "users", uid);
    await setDoc(userRef, { push_token: pushToken }, { merge: true });
    console.log(`Updated push token for user ${uid}`);
  } catch (error) {
    console.error("Error updating push token: ", error);
    throw error;
  }
};
