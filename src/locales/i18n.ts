import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import es from "./es.json";
import my from "./my.json";
import { StorageKeys } from "../constants";

const CLIENT_LOCALES = ["en", "es", "my"] as const;

const getInitialLanguage = (): string => {
  if (typeof window === "undefined") return "en";

  try {
    const storedLocale: unknown = JSON.parse(
      window.localStorage.getItem(StorageKeys.LOCALE) ?? '"en"',
    );

    return typeof storedLocale === "string" &&
      CLIENT_LOCALES.some((locale) => locale === storedLocale)
      ? storedLocale
      : "en";
  } catch {
    return "en";
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
    my: {
      translation: my,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
