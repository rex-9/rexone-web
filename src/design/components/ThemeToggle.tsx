import { FC } from "react";
import { useAtom } from "jotai";
import { Button } from ".";
import atoms from "../../atoms";
import assets from "../../assets";

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
      className="w-10 h-10 flex items-center justify-center"
    >
      <span className="w-5 h-5 flex items-center justify-center">
        {resolvedTheme === "night" ? (
          <assets.icons.lib.sun />
        ) : (
          <assets.icons.lib.moon />
        )}
      </span>
    </Button>
  );
};

export default ThemeToggle;
