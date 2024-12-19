import { signOut } from "firebase/auth";
import { auth } from "../provider/auth/firebase";
import { replaceRoute } from "@/src/utils/replaceRoute";
import { showAlert } from "@/src/utils/showAlert";
import { t } from "i18next";

export const handleSessionExpired = async () => {
  try {
    await signOut(auth);
    replaceRoute("/login");
    showAlert(t("auth.sessionExpired.title"), t("auth.sessionExpired.message"));
  } catch (error) {
    console.error("Error handling session expiration:", error);
  }
};
