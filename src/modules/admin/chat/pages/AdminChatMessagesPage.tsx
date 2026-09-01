// src/modules/admin/chat/pages/AdminChatMessagesPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import ChatController from "../chat.controller";
import type { IAdminChatMessage } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  type IAdminTableColumn,
} from "../../components";
import { formatAdminDate, truncateAdminText } from "../../helpers/admin.helper";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_TABLE_HEADERS,
} from "../../constants";
import {
  ADMIN_CHAT_MESSAGE_TABLE_KEYS,
  ADMIN_CHAT_PAGE_TITLES,
  ADMIN_CHAT_TABLE_HEADERS,
} from "../constants";

export const AdminChatMessagesPage: React.FC = () => {
  useDocumentTitle(ADMIN_CHAT_PAGE_TITLES.MESSAGES);

  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { can } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [messages, setMessages] = useState<IAdminChatMessage[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [discardTarget, setDiscardTarget] = useState<IAdminChatMessage | null>(null);

  const updateFilters = useCallback(
    (updates: { page?: number }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadMessages = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.MESSAGES)) return;

    setLoading(true);
    setError("");

    await ChatController.getMessages(
      { page, limit: ADMIN_PAGE_SIZE },
      (nextMessages, nextPagination) => {
        setMessages(nextMessages);
        setPagination(nextPagination ?? null);
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );
  }, [can, page, setLoading]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const columns = useMemo<IAdminTableColumn<IAdminChatMessage>[]>(
    () => [
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.ROLE,
        header: ADMIN_CHAT_TABLE_HEADERS.ROLE,
        render: (message) => (
          <span className="rounded-md bg-base-200 px-2 py-0.5 font-mono text-xs font-semibold text-base-content opacity-80">
            {message.role}
          </span>
        ),
      },
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.CONTENT,
        header: ADMIN_CHAT_TABLE_HEADERS.MESSAGE,
        render: (message) => (
          <div className="max-w-md">
            <div className="line-clamp-2 text-body-m text-base-content">
              {truncateAdminText(message.content)}
            </div>
            <div className="text-caption text-base-content opacity-50 font-mono text-xs pt-0.5">
              Room: {message.room_id}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.CREATED,
        header: ADMIN_TABLE_HEADERS.CREATED,
        render: (message) => formatAdminDate(message.created_at),
      },
      {
        key: ADMIN_CHAT_MESSAGE_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (message) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.MESSAGES}
            actions={[
              {
                type: ADMIN_ACTIONS.EDIT,
                onClick: () =>
                  navigate(
                    AppRoutes.withId(
                      AppRoutes.client.protected.admin.CHAT_MESSAGE_EDIT,
                      message.id,
                    ),
                  ),
              },
              {
                type: ADMIN_ACTIONS.DISCARD,
                onClick: () => setDiscardTarget(message),
              },
            ]}
          />
        ),
      },
    ],
    [navigate],
  );

  const handleDiscard = async () => {
    if (!discardTarget) return;

    setLoading(true);

    await ChatController.discardMessage(
      discardTarget.id,
      () => {
        toast.success("Chat message discarded");
        setDiscardTarget(null);
        setLoading(false);
        void loadMessages();
      },
      (message) => {
        toast.error(message);
        setLoading(false);
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chat Messages"
        description="Audit and moderate posted chat messages across all discussion rooms."
      />

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load messages"
          message={error}
        />
      ) : !isLoading && messages.length === 0 ? (
        <AdminState
          icon={iconsLib.inboxStack}
          title="No chat messages yet"
          message="Messages will appear here as users participate in chat rooms."
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={messages}
            getRowKey={(message) => message.id}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(discardTarget)}
        title="Discard Chat Message"
        message="Are you sure you want to discard this message?"
        confirmLabel={ADMIN_COMMON_LABELS.DISCARD}
        isDestructive={true}
        isLoading={isLoading}
        onClose={() => setDiscardTarget(null)}
        onConfirm={handleDiscard}
      />
    </div>
  );
};
