import React from "react";
import Option from "./Option";
import { SettingsNavigationOptionsProps } from "@/src/types/types";

const NavigationOptions: React.FC<SettingsNavigationOptionsProps> = ({ options, onNavigate }) => {
  return (
    <>
      {options.map((option, index) => (
        <Option
          key={index}
          icon={option.icon}
          label={option.label}
          onPress={() => onNavigate(option.route)}
        />
      ))}
    </>
  );
};

export default NavigationOptions;
