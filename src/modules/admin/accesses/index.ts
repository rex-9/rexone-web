// src/modules/admin/accesses/index.ts

export * from "./types";
export * from "./constants";
export { default as AdminAccessesService } from "./accesses.service";
export { default as AdminAccessesController } from "./accesses.controller";
export * from "./pages/AdminAccessesPage";
export * from "./components/AdminAccessGrantDialog";
export * from "./components/AdminAccessExtendDialog";
