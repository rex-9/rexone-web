import React from "react";
import { PageLayout } from "./PageLayout";
import { AnapanaPage } from "../../modules/anapana/pages";
import { LandingPage } from "../../modules/landing/pages";

export const RootPage: React.FC = () => {
  const subdomain = window.location.hostname.split(".")[0];
  switch (subdomain) {
    case "anapana":
      return (
        <PageLayout>
          <AnapanaPage />
        </PageLayout>
      );
    default:
      return <LandingPage />;
  }
};
