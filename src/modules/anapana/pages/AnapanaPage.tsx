import React from "react";
import { AnalogClock, MarkerPopup, SupportLove } from "../components";
import { useDocumentTitle, useTranslate } from "../../../hooks";
import { AppLocales } from "../../../locales";

export const AnapanaPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(t(AppLocales.Anapana.TimerTitle));

  return (
    <div className="flex flex-col gap-4 p-4 items-center">
      <div className="w-full flex flex-col md:flex-row justify-center md:gap-12 items-center">
        <AnalogClock />
        <MarkerPopup />
      </div>
      <SupportLove />
    </div>
  );
};

export default AnapanaPage;
