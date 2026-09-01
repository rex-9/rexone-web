import React, { useState } from "react";
import { Asset, Button, TextLink } from "../../../design/components";
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
        className="p-8 !px-8 min-w-10 min-h-10 flex items-center justify-center"
      >
        <span className="w-5 h-5 flex items-center justify-center">
          {!showSnackbar ? <iconsLib.heart /> : <iconsLib.error />}
        </span>
      </Button>
      {showSnackbar && (
        <div className="fixed bottom-1/3 bg-base-200 p-8 rounded-lg shadow-lg flex items-center gap-4">
          <div className="w-64 flex flex-col justify-center items-center gap-4">
            <div>{t(AppLocales.Anapana.WelcomeDonations)}</div>
            <TextLink
              href="https://buymeacoffee.com/rex9"
              external
              className="hover:no-underline"
            >
              <Asset
                className="h-12"
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
              />
            </TextLink>
          </div>
        </div>
      )}
    </>
  );
};
