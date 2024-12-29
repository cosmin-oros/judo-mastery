import React from "react";
import { Stack } from "expo-router";
import TopBar from "@/src/screens/profile/components/Topbar";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const { t } = useTranslation();
    
  return (
    <>
      <Stack screenOptions={{}}>
        <Stack.Screen
          name="index"
          options={{
            header: () => <TopBar title={t('profile.title')}/>,
          }}
        />
      </Stack>
    </>
  );
}
