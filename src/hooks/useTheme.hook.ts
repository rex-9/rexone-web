// src/hooks/useTheme.ts
import { useEffect } from "react";
import { useAtom } from "jotai";
import atoms from "../atoms";

export const useTheme = () => {
  const [theme] = useAtom(atoms.themeAtom);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return theme;
};
