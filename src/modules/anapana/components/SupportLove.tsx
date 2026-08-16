import React, { useState } from "react";
import { Button } from "../../../design/components";
import { iconsLib } from "../../../assets";
import { AppLocales, useTranslate } from "../../../locales";

export const SupportLove: React.FC = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const t = useTranslate();
  return (
    <>
      <Button
        variant="tertiary"
        onClick={() => setShowSnackbar(!showSnackbar)}
        className="p-8 !px-8 min-w-[40px] min-h-[40px] flex items-center justify-center"
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {!showSnackbar ? <iconsLib.heart /> : <iconsLib.error />}
        </span>
      </Button>
      {showSnackbar && (
        <div className="fixed bottom-[40%] bg-base-200 p-8 rounded-lg shadow-lg flex items-center gap-4">
          <div className="w-64 flex flex-col justify-center items-center gap-4">
            <div>{t(AppLocales.Anapana.WelcomeDonations)}</div>
            <a
              href="https://buymeacoffee.com/rex9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="h-12"
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
