import i18n from "./i18n";

export const API_LOCALES = ["en", "my"] as const;

export type ApiLocale = (typeof API_LOCALES)[number];

const DEFAULT_API_LOCALE: ApiLocale = "en";

export const resolveApiLocale = (language?: string): ApiLocale => {
  const locale = language
    ?.trim()
    .toLowerCase()
    .split(/[-_]/, 1)[0];

  return API_LOCALES.find((supportedLocale) => supportedLocale === locale) ??
    DEFAULT_API_LOCALE;
};

export const getApiLocale = (): ApiLocale =>
  resolveApiLocale(i18n.resolvedLanguage ?? i18n.language);
