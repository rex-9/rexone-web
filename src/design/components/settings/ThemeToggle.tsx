// src/design/components/settings/ThemeToggle.tsx

import { FC } from "react";
import { useAtom } from "jotai";
import { Button } from "../button";
import { ButtonVariants, ComponentSizes, ThemeVariants } from "../../constants";
import atoms from "../../../atoms";
import { iconsLib } from "../../../assets";

export const ThemeToggle: FC = () => {
  const [theme, setTheme] = useAtom(atoms.themeAtom);
  const resolvedTheme =
    theme === ThemeVariants.NIGHT ? ThemeVariants.NIGHT : ThemeVariants.DAY;

  const toggleTheme = () => {
    const newTheme =
      resolvedTheme === ThemeVariants.DAY
        ? ThemeVariants.NIGHT
        : ThemeVariants.DAY;
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <Button
      variant={ButtonVariants.GLASS}
      size={ComponentSizes.SM}
      onClick={toggleTheme}
      className="h-9 w-9 p-0 flex items-center justify-center rounded-lg"
      title={
        resolvedTheme === ThemeVariants.NIGHT
          ? "Switch to day mode"
          : "Switch to night mode"
      }
      aria-label={
        resolvedTheme === ThemeVariants.NIGHT
          ? "Switch to day mode"
          : "Switch to night mode"
      }
    >
      <span className="w-4 h-4 flex items-center justify-center text-base-content/75">
        {resolvedTheme === ThemeVariants.NIGHT ? (
          <iconsLib.sun />
        ) : (
          <iconsLib.moon />
        )}
      </span>
    </Button>
  );
};

export default ThemeToggle;
