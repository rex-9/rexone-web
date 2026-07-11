import React from "react";
import { useTranslation } from "react-i18next";
import { DropdownPicker } from "../";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageOptions = [
    { value: "en", label: "🇺🇸 English" },
    { value: "es", label: "🇪🇸 Español" },
    // Add more languages as needed
  ];

  return (
    <DropdownPicker
      options={languageOptions}
      value={i18n.language}
      onChange={changeLanguage}
    />
  );
};

export default LanguageSwitcher;
