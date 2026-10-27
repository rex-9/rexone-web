import React from "react";
import { DevTestButtons } from "../../modules/log/components/DevTestButtons";

export const TestPage: React.FC = () => {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Diagnostics Lab
        </p>
        <h1 className="text-heading-l font-bold text-base-content">
          System diagnostics
        </h1>
        <p className="mt-2 text-base-content/70">
          Use this page for browser checks, client logging tests, and system diagnostics.
          Media streaming has graduated to the Asset Admin Portal.
        </p>
      </div>

      <DevTestButtons />
    </div>
  );
};

export default TestPage;
