import React from "react";
import { PageLayout } from "../../../design/pages";
import { useTranslate } from "../../../hooks";
import { AppLocales } from "../../../locales";
import { AnapanaPage } from "./AnapanaPage";

export const AnapanaRoute: React.FC = () => {
  const t = useTranslate();

  return (
    <PageLayout
      headerLeading={
        <span className="text-body-m font-semibold text-base-content">
          {t(AppLocales.Anapana.TimerTitle)}
        </span>
      }
    >
      <AnapanaPage />
    </PageLayout>
  );
};

export default AnapanaRoute;
