// src/modules/feedback/index.ts

export * from "./constants";
export * from "./types";
export { FeedbackService, feedbackService } from "./feedback.service";
export { FeedbackController, default as feedbackController } from "./feedback.controller";
export { FeedbackDialog, default as FeedbackDialogComponent } from "./components/FeedbackDialog";
