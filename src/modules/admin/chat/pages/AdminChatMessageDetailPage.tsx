import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  DetailField,
  DetailGrid,
  DetailHeader,
  DetailSection,
  StatusBadge,
} from "../../../../design";
import { AdminState } from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import ChatController from "../chat.controller";
import type { IAdminChatMessage } from "../types";

const loadMessage = async (id: string) => {
  const result = await ChatController.getMessage(id);
  return { ...result, record: result.message };
};
export const AdminChatMessageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: message, error } = useAdminDetail<IAdminChatMessage>(
    id,
    loadMessage,
  );
  const listPath = AppRoutes.client.protected.admin.CHAT_MESSAGES;
  return (
    <div className="space-y-6">
      <DetailHeader
        breadcrumbs={[
          { label: t(AppLocales.Admin.Common.Detail.Admin), to: AppRoutes.client.protected.admin.HOME },
          { label: t(AppLocales.Admin.Chat.MessagesTitle), to: listPath },
          { label: message ? t(AppLocales.Admin.Chat.MessageDetail.MessageBreadcrumb, { role: message.role }) : t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={message?.role ? `${message.role.toUpperCase()} Message` : t(AppLocales.Admin.Chat.MessageDetail.Title)}
        description={t(AppLocales.Admin.Chat.MessageDetail.Description)}
        backTo={listPath}
        icon={iconsLib.chatBubbleLeftRight}
        statusBadge={message ? <StatusBadge status={message.role} /> : undefined}
        entityId={message?.id}
        timestamps={
          message
            ? {
                createdAt: message.created_at,
                updatedAt: message.updated_at,
              }
            : undefined
        }
      />
      {error ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : message ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <DetailSection
            title={t(AppLocales.Admin.Chat.MessageDetail.Context)}
            icon={iconsLib.chatBubbleLeftRight}
            accent
          >
            <DetailGrid columns={1}>
              <DetailField
                label={t(AppLocales.Admin.Chat.MessageDetail.Role)}
                value={<StatusBadge status={message.role} />}
              />
              <DetailField
                label={t(AppLocales.Admin.Chat.MessageDetail.RoomId)}
                value={message.room_id}
                copyable
                mono
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={
                  <DateTime
                    value={message.created_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={
                  <DateTime
                    value={message.updated_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
            </DetailGrid>
          </DetailSection>
          <DetailSection
            title={t(AppLocales.Admin.Chat.MessageDetail.Content)}
            icon={iconsLib.document}
            className="lg:col-span-2"
          >
            <div className="whitespace-pre-wrap wrap-break-word leading-relaxed text-base-content">
              {message.content}
            </div>
          </DetailSection>
        </div>
      ) : null}
    </div>
  );
};
