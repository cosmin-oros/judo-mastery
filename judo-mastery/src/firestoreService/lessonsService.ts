import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";
import { LessonType } from "../types/types";

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

export const getLessonFromFirestore = async (lessonId: string) => {
  const lessonRef = doc(firestore, "lessons", lessonId);
  const lessonDoc = await getDoc(lessonRef);
  if (!lessonDoc.exists()) {
    throw new Error("Lesson not found");
  }
  return { id: lessonDoc.id, ...lessonDoc.data() };
};
