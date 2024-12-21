import { router } from "expo-router";
import { Platform } from "react-native";

export const replaceRoute = (href: string) => {
  if (Platform.OS === "ios") {
    setTimeout(() => {
      //@ts-expect-error
      router.replace(href);
    }, 1);
  } else {
    setImmediate(() => {
      //@ts-expect-error
      router.replace(href);
    });
  }
};
