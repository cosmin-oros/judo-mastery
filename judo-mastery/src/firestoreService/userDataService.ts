import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";
import { LessonType } from "../types/types";

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

// Update user's completed lessons and XP
export const updateUserLessonProgress = async (
  uid: string,
  lessonId: string,
  xp: number
) => {
  const userRef = doc(firestore, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User not found.");
  }

  const userData = userDoc.data();
  const lessonsCompleted = userData.lessons_completed || [];
  const currentXP = userData.xp || 0;

  await setDoc(
    userRef,
    {
      lessons_completed: [...lessonsCompleted, lessonId],
      xp: currentXP + xp,
    },
    { merge: true }
  );
};

// Fetch lessons from Firestore
export const fetchLessonsFromFirestore = async (): Promise<LessonType[]> => {
  const lessonsSnapshot = await getDocs(collection(firestore, "lessons"));
  return lessonsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || { en: "Untitled" }, // Provide default values if fields are missing
      xp: data.xp || 0,
      category: data.category || "uncategorized",
      terminology: data.terminology || [],
    } as LessonType;
  });
};
