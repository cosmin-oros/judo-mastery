// LessonsProvider.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchLessonsWithTermsFromFirestore } from "@/src/firestoreService/lessonsService";
import { LessonType } from "@/src/types/types";

interface LessonsContextType {
  lessons: LessonType[];
  loading: boolean;
  refreshLessons: () => void;
}

const LessonsContext = createContext<LessonsContextType | undefined>(undefined);

export const LessonsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLessons = async () => {
    setLoading(true);
    try {
      // Now fetch lessons + terms in one go
      const lessonsData = await fetchLessonsWithTermsFromFirestore();
      setLessons(lessonsData);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const refreshLessons = () => loadLessons();

  return (
    <LessonsContext.Provider value={{ lessons, loading, refreshLessons }}>
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessons = () => {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error("useLessons must be used within a LessonsProvider");
  }
  return context;
};
