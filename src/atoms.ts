// src/atoms/index.ts
import { IMarker, IUser } from "./models";
import { AtomService } from "./services";
import { StorageKeys } from "./constants";

// src/atoms/index.ts
class Atoms {
  // ===== THEME =====
  themeAtom = AtomService.getAtom<"day" | "night">(StorageKeys.THEME, "day");

  // ===== LOCALE =====
  localeAtom = AtomService.getAtom<string>(StorageKeys.LOCALE, "en");

  // ===== AUTH =====
  tokenAtom = AtomService.getAtom<string | null>(StorageKeys.TOKEN, null);
  currentUserAtom = AtomService.getAtom<IUser | null>("user", null);

  // ===== ANAPANA MODULE =====
  markersAtom = AtomService.getAtom<IMarker[]>("markers", []);
  startTimeAtom = AtomService.getAtom<string>("startTime", "00:00:00");
  endTimeAtom = AtomService.getAtom<string>("endTime", "00:00:00");
}

export default new Atoms();
