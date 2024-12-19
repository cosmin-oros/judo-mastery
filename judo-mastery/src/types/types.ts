import { lightTheme } from "../theme/themes";

export type UserType = {
  uid: string;
  email: string | null;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  idToken?: string;
  // more
};

export type AuthContextType = {
  user: UserType | null;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
};

type ThemeType = typeof lightTheme;
export type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};
