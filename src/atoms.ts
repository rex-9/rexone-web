import AtomStorageService from "./services/atomStorage.service";
import { IMarker, IUser } from "./models";

class Atoms {
  private atomStorageService = new AtomStorageService();

  // Define atoms here
  // Theme: "auto" | "day" | "night"
  themeAtom = this.atomStorageService.getAtom<string>("theme", "auto");
  tokenAtom = this.atomStorageService.getAtom<string | null>("token", null);
  currentUserAtom = this.atomStorageService.getAtom<IUser | null>("user", null);

  // ANAPANA MODULE
  markersAtom = this.atomStorageService.getAtom<IMarker[]>("markers", []);
  startTimeAtom = this.atomStorageService.getAtom<string>(
    "startTime",
    "00:00:00",
  );
  endTimeAtom = this.atomStorageService.getAtom<string>("endTime", "00:00:00");
}

export default new Atoms();
