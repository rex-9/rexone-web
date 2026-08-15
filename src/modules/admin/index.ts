import { ChatController, ChatService } from "./chat";
import { NotificationController, NotificationService } from "./notifications";
import { RoleController, RoleService } from "./roles";
import UserController from "./users/user.controller";
import UserService from "./users/user.service";

export * from "./chat";
export * from "./notifications";
export * from "./roles";
export * from "./users";

export const Admin = {
  ChatController,
  ChatService,
  NotificationController,
  NotificationService,
  RoleController,
  RoleService,
  UserController,
  UserService,
};
