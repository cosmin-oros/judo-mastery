import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/src/provider/auth/firebase";
import {
  TechniqueCategoryType,
  WazaType,
  TechniqueType,
} from "@/src/types/types";

/**
 * We’ll store data in nested structures:
 * categories[] -> wazas[] -> techniques[]
 * so we can easily retrieve them by IDs in the screens.
 */
interface WazaWithTechniques extends WazaType {
  techniques: TechniqueType[];
}

interface CategoryWithWazas extends TechniqueCategoryType {
  wazas: WazaWithTechniques[];
}

interface TechniquesContextType {
  categories: CategoryWithWazas[];
  loading: boolean;
  refresh: () => void;
}

const TechniquesContext = createContext<TechniquesContextType | undefined>(
  undefined
);

export const TechniquesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<CategoryWithWazas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTechniques();
  }, []);

  // Reload data from Firestore
  const refresh = () => loadTechniques();

  const loadTechniques = async () => {
    setLoading(true);
    try {
      // 1. Fetch all technique categories
      const categoriesSnapshot = await getDocs(collection(firestore, "techniques"));

      const allCategories: CategoryWithWazas[] = [];
      for (const catDoc of categoriesSnapshot.docs) {
        const catData = catDoc.data();

        // Build the category object
        const category: CategoryWithWazas = {
          id: catDoc.id,
          original: catData.original || "Unknown Category",
          title: catData.title || {},
          emoji: catData.emoji || "❓",
          wazas: [],
        };

        // 2. For each category, fetch wazas subcollection
        const wazasSnapshot = await getDocs(
          collection(firestore, "techniques", catDoc.id, "wazas")
        );

        for (const wazaDoc of wazasSnapshot.docs) {
          const wazaData = wazaDoc.data();

          // Build the waza object
          const waza: WazaWithTechniques = {
            id: wazaDoc.id,
            original: wazaData.original || "Unknown Waza",
            title: wazaData.title || {},
            emoji: wazaData.emoji || "❓",
            techniques: [],
          };

          // 3. For each waza, fetch the techniques subcollection
          const techniquesSnapshot = await getDocs(
            collection(
              firestore,
              "techniques",
              catDoc.id,
              "wazas",
              wazaDoc.id,
              "techniques"
            )
          );

          for (const techDoc of techniquesSnapshot.docs) {
            const techData = techDoc.data();
            waza.techniques.push({
              id: techDoc.id,
              original: techData.original || "Unknown Technique",
              title: techData.title || {},
              description: techData.description || {},
              emoji: techData.emoji || "",
              videoUrl: techData.videoUrl || "",
              xp: techData.xp || 0,
            });
          }

          category.wazas.push(waza);
        }

        allCategories.push(category);
      }

      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching technique data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TechniquesContext.Provider value={{ categories, loading, refresh }}>
      {children}
    </TechniquesContext.Provider>
  );
};

export const useTechniques = (): TechniquesContextType => {
  const context = useContext(TechniquesContext);
  if (!context) {
    throw new Error("useTechniques must be used within a TechniquesProvider");
  }
  return context;
};
