// src/modules/log/log.service.ts
import AppRoutes from "../../AppRoutes";
import { api } from "../../services";
import { ILogPayload, ILogResponse } from "./types";

class LogService {
  async createLog(payload: ILogPayload): Promise<void> {
    try {
      await api.post<ILogResponse>(AppRoutes.server.protected.CLIENT_LOGS, {
        log: payload,
      });
    } catch {
      // Silently fail – never break the app
    }
  }
}

export default new LogService();
