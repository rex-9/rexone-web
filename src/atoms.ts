// src/atoms/index.ts
import { IMarker, IUser } from "./models";
import { AtomService } from "./services";

// src/atoms/index.ts
class Atoms {
  // ===== THEME =====
  themeAtom = AtomService.getAtom<"day" | "night">("theme", "day");

  // ===== LOCALE =====
  localeAtom = AtomService.getAtom<string>("locale", "en");

  // ===== AUTH =====
  tokenAtom = AtomService.getAtom<string | null>("token", null);
  currentUserAtom = AtomService.getAtom<IUser | null>("user", null);

  // ===== ANAPANA MODULE =====
  markersAtom = AtomService.getAtom<IMarker[]>("markers", []);
  startTimeAtom = AtomService.getAtom<string>("startTime", "00:00:00");
  endTimeAtom = AtomService.getAtom<string>("endTime", "00:00:00");
}

export default new Atoms();
