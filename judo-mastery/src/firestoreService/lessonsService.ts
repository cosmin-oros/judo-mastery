import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";
import { LessonType } from "../types/types";

// Function to calculate the level based on XP
const calculateLevel = (xp: number): { level: number; nextLevelXP: number } => {
  const levelCaps = Array.from({ length: 20 }, (_, i) => 500 + 600 * i); // XP thresholds for levels 2-20
  let level = 1;

  for (let i = 0; i < levelCaps.length; i++) {
    if (xp < levelCaps[i]) {
      return { level, nextLevelXP: levelCaps[i] };
    }
    level++;
  }

  return { level: 20, nextLevelXP: 0 }; // Max level is 20
};

// Function to update user's progress
export const updateUserLessonProgress = async (
  uid: string,
  lessonId: string,
  xpEarned: number
) => {
  const userRef = doc(firestore, "users", uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User not found.");
  }

  const userData = userDoc.data();
  const currentXP = userData.xp || 0;
  const lessonsCompleted = userData.lessons_completed || [];

  // Calculate new XP and level
  const newXP = currentXP + xpEarned;
  const { level: newLevel, nextLevelXP } = calculateLevel(newXP);

  // Check if the lesson has already been completed
  if (lessonsCompleted.includes(lessonId)) {
    console.warn("Lesson already completed. No XP added.");
    return;
  }

  // Update Firestore with new XP, level, and completed lessons
  await setDoc(
    userRef,
    {
      xp: newXP,
      level: newLevel,
      lessons_completed: [...lessonsCompleted, lessonId],
    },
    { merge: true }
  );

  console.log(
    `Updated user progress: XP=${newXP}, Level=${newLevel}, NextLevelXP=${nextLevelXP}`
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

export const getLessonFromFirestore = async (
  lessonId: string
): Promise<LessonType> => {
  const lessonRef = doc(firestore, "lessons", lessonId);
  const lessonDoc = await getDoc(lessonRef);

  if (!lessonDoc.exists()) {
    throw new Error("Lesson not found");
  }

  const data = lessonDoc.data();
  return {
    id: lessonDoc.id,
    title: data.title || { en: "Untitled" }, // Provide default values
    xp: data.xp || 0,
    terminology: data.terminology || [],
  } as LessonType;
};

interface TermType {
  id: string;
  original: string;
  translated: Record<string, string>;
  description: Record<string, string>;
  icon: string;
}

// Fetch a single term from Firestore by its ID
export const getTermFromFirestore = async (
  termId: string
): Promise<TermType> => {
  const termRef = doc(firestore, "terminology", termId);
  const termDoc = await getDoc(termRef);

  if (!termDoc.exists()) {
    throw new Error(`Term with ID ${termId} not found.`);
  }

  const data = termDoc.data();
  return {
    id: termDoc.id,
    original: data.original || "Unknown Term",
    translated: data.translated || {},
    description: data.description || {},
    icon: data.icon || "", // Default to an empty string if no icon is provided
  } as TermType;
};
