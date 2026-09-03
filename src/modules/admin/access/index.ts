// src/modules/admin/accesses/index.ts

export * from "./types";
export * from "./constants";
export { default as AdminAccessService } from "./access.service";
export { default as AdminAccessController } from "./access.controller";
export { default as AdminAccessesService } from "./access.service";
export { default as AdminAccessesController } from "./access.controller";
export * from "./pages/AdminAccessesPage";
export * from "./pages/AdminAccessEditPage";
export * from "./components/AdminAccessGrantDialog";
