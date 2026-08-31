// src/design/components/settings/LanguageDropdown.tsx
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../form/Dropdown";
import atoms from "../../../atoms";

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useAtom(atoms.localeAtom);

  const languageOptions = [
    { value: "en", label: "🇺🇸 English" },
    { value: "my", label: "🇲🇲 မြန်မာ" },
  ];

  const handleLanguageChange = (value: string) => {
    setLocale(value);
    i18n.changeLanguage(value);
  };

  return (
    <Dropdown
      options={languageOptions}
      value={locale}
      onValueChange={handleLanguageChange}
      className="min-w-36"
    />
  );
};
