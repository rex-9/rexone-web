import React from "react";
import { LandingPage } from "../../modules/landing/pages";
import { AnapanaRoute } from "../../modules/anapana/pages";

export const RootPage: React.FC = () => {
  const isAnapanaSubdomain =
    typeof window !== "undefined" &&
    window.location.hostname.split(".")[0].toLowerCase() === "anapana";

  if (isAnapanaSubdomain) {
    return <AnapanaRoute />;
  }

  return <LandingPage />;
};

export default RootPage;
