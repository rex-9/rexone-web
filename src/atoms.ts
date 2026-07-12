// src/atoms/index.ts
import AtomStorageService from "./services/atomStorage.service";
import { IMarker, IUser } from "./models";

// src/atoms/index.ts
class Atoms {
  private atomStorageService = new AtomStorageService();

  // ===== THEME =====
  themeAtom = this.atomStorageService.getAtom<"day" | "night">("theme", "day");

  // ===== LOCALE =====
  localeAtom = this.atomStorageService.getAtom<string>("locale", "en");

  // ===== AUTH =====
  tokenAtom = this.atomStorageService.getAtom<string | null>("token", null);
  currentUserAtom = this.atomStorageService.getAtom<IUser | null>("user", null);

  // ===== ANAPANA MODULE =====
  markersAtom = this.atomStorageService.getAtom<IMarker[]>("markers", []);
  startTimeAtom = this.atomStorageService.getAtom<string>(
    "startTime",
    "00:00:00",
  );
  endTimeAtom = this.atomStorageService.getAtom<string>("endTime", "00:00:00");
}

export default new Atoms();
