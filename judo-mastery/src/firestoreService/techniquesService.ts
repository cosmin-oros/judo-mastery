import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";
import { TechniqueCategoryType, WazaType, TechniqueType } from "../types/types";

// Fetch all technique categories (e.g., Nage Waza, Katame Waza)
export const fetchTechniqueCategories = async (): Promise<
  TechniqueCategoryType[]
> => {
  const categoriesSnapshot = await getDocs(collection(firestore, "techniques"));
  return categoriesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      original: data.original || "Unknown Category",
      title: data.title || {},
      emoji: data.emoji || "",
    } as TechniqueCategoryType;
  });
};

// Fetch all wazas for a specific technique category
export const fetchWazas = async (techniqueId: string): Promise<WazaType[]> => {
  const wazasSnapshot = await getDocs(
    collection(firestore, "techniques", techniqueId, "wazas")
  );
  return wazasSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      original: data.original || "Unknown Waza",
      title: data.title || {},
      emoji: data.emoji || "",
    } as WazaType;
  });
};

// Fetch all techniques for a specific waza
export const fetchTechniquesForWaza = async (
  techniqueId: string,
  wazaId: string
): Promise<TechniqueType[]> => {
  const techniquesSnapshot = await getDocs(
    collection(
      firestore,
      "techniques",
      techniqueId,
      "wazas",
      wazaId,
      "techniques"
    )
  );
  return techniquesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      original: data.original || "Unknown Technique",
      title: data.title || {},
      description: data.description || {},
      emoji: data.emoji || "",
      videoUrl: data.videoUrl || "",
      xp: data.xp || 0,
    } as TechniqueType;
  });
};

// Fetch a specific technique's details
export const fetchTechniqueDetails = async (
  techniqueId: string,
  wazaId: string,
  techniqueDocId: string
): Promise<TechniqueType> => {
  const techniqueRef = doc(
    firestore,
    "techniques",
    techniqueId,
    "wazas",
    wazaId,
    "techniques",
    techniqueDocId
  );
  const techniqueDoc = await getDoc(techniqueRef);

  if (!techniqueDoc.exists()) {
    throw new Error(`Technique with ID ${techniqueDocId} not found.`);
  }

  const data = techniqueDoc.data();
  return {
    id: techniqueDoc.id,
    original: data.original || "Unknown Technique",
    title: data.title || {},
    description: data.description || {},
    emoji: data.emoji || "",
    videoUrl: data.videoUrl || "",
    xp: data.xp || 0,
  } as TechniqueType;
};
