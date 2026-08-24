import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { IApiPagination } from "../../../../models";
import ChatController from "../chat.controller";
import { IAdminChatMessage } from "../types";
import {
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  IAdminTableColumn,
} from "../../components";
import { formatAdminDate, truncateAdminText } from "../../helpers/adminPage.helper";
import {
  ADMIN_PAGE_TITLES,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_TABLE_ACTION_TYPES,
  ADMIN_TABLE_HEADERS,
} from "../../constants";

export const AdminChatMessagesPage: React.FC = () => {
  useDocumentTitle(ADMIN_PAGE_TITLES.CHAT_MESSAGES);

  const toast = useToast();
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoading();
  const [messages, setMessages] = useState<IAdminChatMessage[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] =
    useState<IAdminChatMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = useCallback(async () => {
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
  }, [page, setLoading]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadMessages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadMessages]);

  const columns = useMemo<IAdminTableColumn<IAdminChatMessage>[]>(
    () => [
      {
        key: "role",
        header: ADMIN_TABLE_HEADERS.ROLE,
        render: (message) => message.role,
      },
      {
        key: "content",
        header: ADMIN_TABLE_HEADERS.MESSAGE,
        render: (message) => truncateAdminText(message.content),
      },
      {
        key: "room",
        header: ADMIN_TABLE_HEADERS.ROOM_ID,
        render: (message) => message.room_id,
      },
      {
        key: "created",
        header: ADMIN_TABLE_HEADERS.CREATED,
        render: (message) => formatAdminDate(message.created_at),
      },
      {
        key: "actions",
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (message) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.MESSAGES}
            actions={[
              {
                type: ADMIN_TABLE_ACTION_TYPES.EDIT,
                onClick: () =>
                  navigate(
                    AppRoutes.client.protected.ADMIN_CHAT_MESSAGE_EDIT.replace(
                      ":id",
                      message.id,
                    ),
                  ),
              },
              {
                type: ADMIN_TABLE_ACTION_TYPES.DELETE,
                onClick: () => setDeleteTarget(message),
              },
            ]}
          />
        ),
      },
    ],
    [navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    await ChatController.deleteMessage(
      deleteTarget.id,
      () => {
        toast.success("Chat message deleted");
        setDeleteTarget(null);
        setIsDeleting(false);
        void loadMessages();
      },
      (message) => {
        toast.error(message);
        setIsDeleting(false);
      },
    );
  };

  return (
    <>
      {isLoading ? (
        <AdminLoadingState />
      ) : error ? (
        <AdminState title="Unable to load chat messages" message={error} />
      ) : messages.length === 0 ? (
        <AdminState title="No chat messages yet" message="Chat messages will appear here when conversations have messages." />
      ) : (
        <>
          <AdminTable columns={columns} records={messages} getRowKey={(message) => message.id} />
          <AdminPagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete chat message"
        message="Delete this chat message? This cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};
