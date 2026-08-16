import { useTranslation } from "react-i18next";
import i18n from "./i18n";

/** Reactive translator for React components. */
export const useTranslate = () => useTranslation().t;

/** Translator for services and other code outside React components. */
export const translate = i18n.t.bind(i18n);
