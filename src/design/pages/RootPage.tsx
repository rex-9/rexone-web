import React from "react";
import { PageLayout } from "./PageLayout";
import { AnapanaPage } from "../../modules/anapana/pages";
import { LandingPage } from ".";

export const RootPage: React.FC = () => {
  return (
    <PageLayout>
      {(() => {
        const subdomain = window.location.hostname.split(".")[0];
        switch (subdomain) {
          case "anapana":
            return <AnapanaPage />;
          default:
            return <LandingPage />;
        }
      })()}
    </PageLayout>
  );
};
