// src/atoms/index.ts
import { IMarker, IUser } from "./models";
import { AtomService } from "./services";
import { StorageKeys } from "./constants";
import { ThemeVariants, type ThemeVariant } from "./design/constants";

class Atoms {
  // ===== THEME =====
  themeAtom = AtomService.getAtom<ThemeVariant>(
    StorageKeys.THEME,
    ThemeVariants.DAY,
  );

  // ===== LOCALE =====
  localeAtom = AtomService.getAtom<string>(StorageKeys.LOCALE, "en");

  // ===== AUTH =====
  tokenAtom = AtomService.getAtom<string | null>(StorageKeys.TOKEN, null);
  currentUserAtom = AtomService.getAtom<IUser | null>(StorageKeys.USER, null);

  // ===== ANAPANA MODULE =====
  markersAtom = AtomService.getAtom<IMarker[]>(StorageKeys.MARKERS, []);
  startTimeAtom = AtomService.getAtom<string>(
    StorageKeys.START_TIME,
    "00:00:00",
  );
  endTimeAtom = AtomService.getAtom<string>(StorageKeys.END_TIME, "00:00:00");
}

export default new Atoms();
