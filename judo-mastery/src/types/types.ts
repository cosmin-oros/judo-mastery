import { lightTheme } from "../theme/themes";

export type UserType = {
  uid: string; // Unique user ID
  email: string | null; // Email address (optional)
  birthDate?: string; // Birth date (optional)
  firstName?: string; // User's first name (optional)
  name?: string; // User's last name (optional)
  idToken?: string; // Firebase ID token (optional)
  achievements?: string[]; // Array of achievement IDs (optional)
  belt?: "white" | "blue" | "black" | "brown"; // User's belt rank (optional, add other belt ranks as needed)
  daily_tasks?: string[]; // Array of task IDs (optional)
  icon?: number; // Icon identifier (optional)
  level?: number; // User's level (optional)
  statistics?: {
    tasks_completed: number; // Number of tasks completed (optional)
    techniques_learned: number; // Number of techniques learned (optional)
    xp: number; // User's experience points (optional)
  };
  // Additional fields specific to the judo athlete
  experience?: string; // User's experience in judo (optional)
  trainingFrequency?: number; // How many times per week they train (optional)
  goals?: string; // User's goals in judo (optional)
  trainingFocus?: string; // Areas they focus on during training (optional)
  favoriteTechniques?: string; // Favorite judo techniques (optional)
  competitionsParticipated?: string; // Number of competitions participated in (optional)
  ippons?: string; // Number of ippons scored (optional)
  wazaAris?: string; // Number of waza-aris scored (optional)
  yukos?: string; // Number of yukos scored (optional)
  goldMedals?: string; // Number of gold medals won (optional)
  silverMedals?: string; // Number of silver medals won (optional)
  bronzeMedals?: string; // Number of bronze medals won (optional)
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

export interface TopBarProps {
  title: string;
}
