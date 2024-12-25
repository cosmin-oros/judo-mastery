import { lightTheme } from "../theme/themes";

export type UserType = {
  uid: string;
  email: string | null;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  idToken?: string;
  achievements?: string[]; // Array of achievement IDs (optional)
  belt?: "white" | "blue" | "black"; // User's belt rank (optional)
  daily_tasks?: string[]; // Array of task IDs (optional)
  icon?: number; // Icon identifier (optional)
  level?: number; // User's level (optional)
  name?: string; // User's full name
  statistics?: {
    tasks_completed: number; // Number of tasks completed (optional)
    techniques_learned: number; // Number of techniques learned (optional)
    xp: number; // User's experience points (optional)
  };
  // Any other properties that may be needed can be added here as optional
};

export type AuthContextType = {
  user: UserType | null;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signupWithEmailAndPassword: (
    email: string,
    password: string,
    additionalData?: Partial<UserType>
  ) => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
};

type ThemeType = typeof lightTheme;
export type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export interface FormLinkProps {
  text: string;
  onPress: () => void;
}

export interface FormButtonProps {
  label: string;
  onPress: () => void;
}
