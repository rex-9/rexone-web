import { AnalyticsController, AnalyticsService } from "./analytics";
import { ChatController, ChatService } from "./chat";
import { NotificationController, NotificationService } from "./notifications";
import { ProductController, ProductService } from "./products";
import { RoleController, RoleService } from "./roles";
import UserController from "./users/user.controller";
import UserService from "./users/user.service";
import AdminAccessesController from "./accesses/accesses.controller";
import AdminAccessesService from "./accesses/accesses.service";
import AdminFeedbackController from "./feedback/feedback.controller";
import AdminFeedbackService from "./feedback/feedback.service";

export * from "./analytics";
export * from "./chat";
export * from "./notifications";
export * from "./products";
export * from "./accesses";
export * from "./feedback";
export * from "./roles";
export * from "./users";
export * from "./components";
export * from "./helpers/admin.helper";
export * from "./constants";

export const Admin = {
  AnalyticsController,
  AnalyticsService,
  ChatController,
  ChatService,
  NotificationController,
  NotificationService,
  ProductController,
  ProductService,
  RoleController,
  RoleService,
  UserController,
  UserService,
  AdminAccessesController,
  AdminAccessesService,
  AdminFeedbackController,
  AdminFeedbackService,
};
