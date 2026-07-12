// src/design/components/settings/ThemeToggle.tsx

import { FC } from "react";
import { useAtom } from "jotai";
import { Button } from "../button";
import atoms from "../../../atoms";
import { iconsLib } from "../../../assets";

export const ThemeToggle: FC = () => {
  const [theme, setTheme] = useAtom(atoms.themeAtom);
  const resolvedTheme = theme === "night" ? "night" : "day";

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "day" ? "night" : "day";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <Button
      variant="tertiary"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 flex items-center justify-center rounded-full hover:bg-base-200 transition-colors"
    >
      <span className="w-5 h-5 flex items-center justify-center text-base-content/70">
        {resolvedTheme === "night" ? <iconsLib.sun /> : <iconsLib.moon />}
      </span>
    </Button>
  );
};

export default ThemeToggle;
