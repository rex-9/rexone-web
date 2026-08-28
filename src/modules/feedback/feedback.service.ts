// src/modules/feedback/feedback.service.ts
import AppRoutes from "../../AppRoutes";
import { IApiEnvelope, IApiResponse, IJsonApiResource } from "../../models";
import { api } from "../../services";
import {
  ICreateFeedbackRequest,
  IFeedback,
  IFeedbackListParams,
  IUpdateAdminFeedbackRequest,
} from "./types";

export class FeedbackService {
  /**
   * Submit feedback (public or authenticated)
   */
  async submitFeedback(
    feedback: ICreateFeedbackRequest,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IFeedback>>>> {
    return await api.post<IJsonApiResource<IFeedback>>(
      AppRoutes.server.public.FEEDBACK,
      feedback,
    );
  }

  /**
   * Get authenticated user's feedback history
   */
  async getMyFeedbacks(
    params?: IFeedbackListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IFeedback>[]>>> {
    return await api.get<IJsonApiResource<IFeedback>[]>(
      AppRoutes.server.protected.FEEDBACKS,
      params,
    );
  }

  /**
   * Admin: List all feedbacks
   */
  async getAdminFeedbacks(
    params?: IFeedbackListParams,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IFeedback>[]>>> {
    return await api.get<IJsonApiResource<IFeedback>[]>(
      AppRoutes.server.protected.admin.FEEDBACKS,
      params,
    );
  }

  /**
   * Admin: Update feedback status/notes
   */
  async updateAdminFeedback(
    id: string,
    feedback: IUpdateAdminFeedbackRequest,
  ): Promise<IApiResponse<IApiEnvelope<IJsonApiResource<IFeedback>>>> {
    return await api.put<IJsonApiResource<IFeedback>>(
      `${AppRoutes.server.protected.admin.FEEDBACKS}/${id}`,
      feedback,
    );
  }

  /**
   * Admin: Discard feedback
   */
  async deleteAdminFeedback(
    id: string,
  ): Promise<IApiResponse<IApiEnvelope<null>>> {
    return await api.delete<null>(
      `${AppRoutes.server.protected.admin.FEEDBACKS}/${id}`,
    );
  }
}

export const feedbackService = new FeedbackService();
export default feedbackService;
