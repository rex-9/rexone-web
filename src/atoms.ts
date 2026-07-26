// src/atoms/index.ts
import AtomService from "./services/atom.service";
import { IMarker, IUser } from "./models";

// src/atoms/index.ts
class Atoms {
  private AtomService = new AtomService();

  // ===== THEME =====
  themeAtom = this.AtomService.getAtom<"day" | "night">("theme", "day");

  // ===== LOCALE =====
  localeAtom = this.AtomService.getAtom<string>("locale", "en");

  // ===== AUTH =====
  tokenAtom = this.AtomService.getAtom<string | null>("token", null);
  currentUserAtom = this.AtomService.getAtom<IUser | null>("user", null);

  // ===== ANAPANA MODULE =====
  markersAtom = this.AtomService.getAtom<IMarker[]>("markers", []);
  startTimeAtom = this.AtomService.getAtom<string>("startTime", "00:00:00");
  endTimeAtom = this.AtomService.getAtom<string>("endTime", "00:00:00");
}

export default new Atoms();
