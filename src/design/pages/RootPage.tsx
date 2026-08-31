import React from "react";
import { LayoutPage } from "./LayoutPage";
import { AnapanaPage } from "../../modules/anapana/pages";
import { LandingPage } from "../../modules/landing/pages";

export const RootPage: React.FC = () => {
  const subdomain = window.location.hostname.split(".")[0];
  switch (subdomain) {
    case "anapana":
      return (
        <LayoutPage>
          <AnapanaPage />
        </LayoutPage>
      );
    default:
      return <LandingPage />;
  }
};
