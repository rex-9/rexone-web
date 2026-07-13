// src/atoms/index.ts
import AtomService from "./services/atom.service";
import { IMarker, IUser } from "./models";

// src/atoms/index.ts
class Atoms {
  private atomService = new AtomService();

  // ===== THEME =====
  themeAtom = this.atomService.getAtom<"day" | "night">("theme", "day");

  // ===== LOCALE =====
  localeAtom = this.atomService.getAtom<string>("locale", "en");

  // ===== AUTH =====
  tokenAtom = this.atomService.getAtom<string | null>("token", null);
  currentUserAtom = this.atomService.getAtom<IUser | null>("user", null);

  // ===== ANAPANA MODULE =====
  markersAtom = this.atomService.getAtom<IMarker[]>("markers", []);
  startTimeAtom = this.atomService.getAtom<string>("startTime", "00:00:00");
  endTimeAtom = this.atomService.getAtom<string>("endTime", "00:00:00");
}

export default new Atoms();
