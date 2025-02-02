export interface UserStatistics {
  xp: number; // User's experience points
  tasks_completed: number; // Tasks completed by the user
  techniques_learned: number; // Techniques learned by the user
}

// User Type
export type UserType = {
  uid: string; // Unique user ID
  email?: string | null; // Email address (optional)
  birthDate?: string; // Birth date (optional)
  firstName?: string; // User's first name (optional)
  name?: string; // User's full name or last name (optional)
  idToken?: string; // Firebase ID token (optional)
  achievements?: string[]; // Array of achievement IDs (optional)
  beltRank?: keyof typeof BELT_COLORS; // User's belt rank
  daily_tasks?: string[]; // Array of task IDs (optional)
  icon?: number; // Icon identifier (optional)
  level?: number; // User's level
  xp?: number; // User's xp
  statistics?: UserStatistics; // User's statistics
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
  goldMedals?: string; // Number of gold medals won
  silverMedals?: string; // Number of silver medals won
  bronzeMedals?: string; // Number of bronze medals won
  lessons_completed?: string[]; // Array of completed lesson IDs (optional)
  techniques_completed?: string[]; // Array of completed technique IDs (optional)
};

// Auth Context Type
export type AuthContextType = {
  user: UserType | null; // Currently logged-in user
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signupWithEmailAndPassword: (
    email: string,
    password: string,
    additionalData?: Partial<UserType>
  ) => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
};

// Belt Colors Enum
export const BELT_COLORS = {
  white: "#FFFFFF",
  yellow: "#F7DC6F",
  orange: "#F39C12",
  green: "#28B463",
  blue: "#2980B9",
  brown: "#A0522D",
  black: "#000000",
};

// Theme Type
import { lightTheme } from "@/src/theme/themes";
import { Ionicons } from "@expo/vector-icons";
type ThemeType = typeof lightTheme;

// Theme Context Type
export type ThemeContextType = {
  theme: ThemeType; // Current theme (light/dark)
  toggleTheme: () => void; // Toggle between themes
};

// Form Link Props
export interface FormLinkProps {
  text: string; // Link text
  onPress: () => void; // Callback for link press
}

// Form Button Props
export interface FormButtonProps {
  label: string; // Button label
  onPress: () => void; // Callback for button press
}

// Top Bar Props
export interface TopBarProps {
  title: string; // Top bar title
}

export interface AchievementsSectionProps {
  userData: UserType;
}

export interface ProfileHeaderProps {
  title: string;
}

export interface ProfileSectionProps {
  userData: UserType;
}

export interface StatisticsSectionProps {
  userData: UserType;
}

export interface SettingsHeaderProps {
  title: string;
}

export interface SettingsOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchToggle?: () => void;
  onPress?: () => void;
}

export interface SettingsNavigationOption {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: () => void;
}

export interface SettingsNavigationOptionsProps {
  options: SettingsNavigationOption[];
  onNavigate: (route: string) => void;
}

export type CompetitionStatsProps = {
  userData: {
    goldMedals?: string; // Number of gold medals
    silverMedals?: string; // Number of silver medals
    bronzeMedals?: string; // Number of bronze medals
  };
};

export type OtherStatsProps = {
  userData: {
    ippons?: string; // Number of ippons scored
    wazaAris?: string; // Number of waza-aris scored
    yukos?: string; // Number of yukos scored
    competitionsParticipated?: string; // Number of competitions participated
  };
};

export interface LessonType {
  id: string;
  title: Record<string, string>;
  xp: number;
  category: string;
  terminology: string[];
}

export interface TermType {
  id: string;
  original: string;
  translated: Record<string, string>;
  description: Record<string, string>;
  icon: string;
}

export interface TechniqueType {
  id: string;
  original: string;
  title: Record<string, string>;
  description: Record<string, string>;
  emoji: string;
  videoUrl: string;
  xp: number;
}

export interface WazaType {
  id: string;
  original: string;
  title: Record<string, string>;
  emoji: string;
}

export interface TechniqueCategoryType {
  id: string;
  original: string;
  title: Record<string, string>;
  emoji: string;
}
