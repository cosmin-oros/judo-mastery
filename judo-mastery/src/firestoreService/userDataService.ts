import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../provider/auth/firebase";

// Save user data to Firestore
export const saveUserDataToFirestore = async (userData: any) => {
  const userRef = doc(firestore, "users", userData.uid);
  await setDoc(userRef, userData);
};

// Get user data from Firestore
export const getUserDataFromFirestore = async (uid: string) => {
  const userRef = doc(firestore, "users", uid);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data() : null;
};
