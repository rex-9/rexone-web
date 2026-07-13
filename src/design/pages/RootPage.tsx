import React from "react";
import { LayoutPage } from "./LayoutPage";
import { AnapanaPage } from "../../modules/anapana/pages";
import { LandingPage } from ".";

export const RootPage: React.FC = () => {
  return (
    <LayoutPage>
      {(() => {
        const subdomain = window.location.hostname.split(".")[0];
        switch (subdomain) {
          case "anapana":
            return <AnapanaPage />;
          default:
            return <LandingPage />;
        }
      })()}
    </LayoutPage>
  );
};
