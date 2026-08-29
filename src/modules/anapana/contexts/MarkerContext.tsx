import { useAtom } from "jotai/react";
import React, { createContext, useContext } from "react";
import { IMarker } from "../../../models";
import atoms from "../../../atoms";

interface IMarkerContextType {
  markers: IMarker[];
  addMarker: (marker: IMarker) => void;
  removeMarker: (index: number) => void;
  cleanMarkers: () => void;
}

const MarkerContext = createContext<IMarkerContextType | undefined>(undefined);

export const MarkerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [markers, setMarkers] = useAtom(atoms.markersAtom);
  const addMarker = (marker: IMarker) => {
    setMarkers([marker]);
  };

  const removeMarker = (index: number) => {
    const newMarkers = markers.filter((_, idx) => idx !== index);
    setMarkers(newMarkers);
  };

  const cleanMarkers = () => {
    setMarkers([]);
  };

  return (
    <MarkerContext.Provider
      value={{ markers, addMarker, removeMarker, cleanMarkers }}
    >
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarker = () => {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("useMarkerContext must be used within a MarkerProvider");
  }
  return context;
};
