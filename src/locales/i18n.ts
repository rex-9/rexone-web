// src/locales/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getDefaultStore } from "jotai";
import en from "./en.json";
import my from "./my.json";
import atoms from "../atoms";

export const CLIENT_LOCALES = ["en", "my"] as const;
export type ClientLocale = (typeof CLIENT_LOCALES)[number];

const store = getDefaultStore();
const rawLocale = store.get(atoms.localeAtom);
const initialLanguage: ClientLocale = CLIENT_LOCALES.includes(
  rawLocale as ClientLocale,
)
  ? (rawLocale as ClientLocale)
  : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    my: {
      translation: my,
    },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Reactively synchronize i18n when Jotai localeAtom updates
store.sub(atoms.localeAtom, () => {
  const currentLocale = store.get(atoms.localeAtom);
  if (
    CLIENT_LOCALES.includes(currentLocale as ClientLocale) &&
    i18n.language !== currentLocale
  ) {
    i18n.changeLanguage(currentLocale);
  }
});

export default i18n;
