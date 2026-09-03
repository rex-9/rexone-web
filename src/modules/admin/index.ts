import { AnalyticsController, AnalyticsService } from "./analytics";
import { ChatController, ChatService } from "./chat";
import { NotificationController, NotificationService } from "./notification";
import { ProductController, ProductService } from "./product";
import { RoleController, RoleService } from "./role";
import UserController from "./user/user.controller";
import UserService from "./user/user.service";
import AdminAccessesController from "./access/access.controller";
import AdminAccessesService from "./access/access.service";
import AdminFeedbackController from "./feedback/feedback.controller";
import AdminFeedbackService from "./feedback/feedback.service";
import AdminLogsController from "./log/log.controller";
import AdminLogsService from "./log/log.service";

export * from "./analytics";
export * from "./chat";
export * from "./notification";
export * from "./product";
export * from "./access";
export * from "./feedback";
export * from "./log";
export * from "./role";
export * from "./user";
export * from "./asset";
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
  AdminLogsController,
  AdminLogsService,
};
