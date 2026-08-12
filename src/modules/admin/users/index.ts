// admin/index.ts
import UserController from "./user.controller";
import UserService from "./user.service";
export * from "./types";

export const Admin = {
  UserController,
  UserService,
};
