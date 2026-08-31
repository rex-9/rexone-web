import { useEffect } from "react";
import AppConfig from "../AppConfig";

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title
      ? `${AppConfig.APP_NAME} | ${title}`
      : AppConfig.APP_NAME;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
