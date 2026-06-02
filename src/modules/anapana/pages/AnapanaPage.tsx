import React from "react";
import { AnalogClock, MarkerPopup, SupportLove } from "../components";

const AnapanaPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 items-center">
      <div className="w-full flex flex-col md:flex-row justify-center md:gap-48 items-center">
        <AnalogClock />
        <MarkerPopup />
      </div>
      <SupportLove />
    </div>
  );
};

export default AnapanaPage;
