import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { IApiPagination } from "../../../../models";
import ChatController from "../chat.controller";
import { IAdminChatMessage } from "../types";
import {
  AdminActionButton,
  AdminLayout,
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTable,
  ConfirmationDialog,
  IAdminTableColumn,
} from "../../../../design/components";
import { formatAdminDate, truncateAdminText } from "./adminPageUtils";

const PAGE_SIZE = 10;

export const AdminChatMessagesPage: React.FC = () => {
  useDocumentTitle("Chat Messages");

  const toast = useToast();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [messages, setMessages] = useState<IAdminChatMessage[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] =
    useState<IAdminChatMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setError("");

    await ChatController.getMessages(
      { page, limit: PAGE_SIZE },
      (nextMessages, nextPagination) => {
        setMessages(nextMessages);
        setPagination(nextPagination ?? null);
        setIsLoading(false);
      },
      (message) => {
        setError(message);
        setIsLoading(false);
      },
    );
  }, [page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadMessages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadMessages]);

  const columns = useMemo<IAdminTableColumn<IAdminChatMessage>[]>(
    () => [
      { key: "role", header: "Role", render: (message) => message.role },
      {
        key: "content",
        header: "Message",
        render: (message) => truncateAdminText(message.content),
      },
      {
        key: "room",
        header: "Room ID",
        render: (message) => message.room_id,
      },
      {
        key: "created",
        header: "Created",
        render: (message) => formatAdminDate(message.created_at),
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (message) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action="update"
              resource="chat_messages"
              can={can}
              size="sm"
              variant="secondary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Edit chat message"
              title="Edit"
              onClick={() =>
                navigate(
                  AppRoutes.client.protected.ADMIN_CHAT_MESSAGE_EDIT.replace(
                    ":id",
                    message.id,
                  ),
                )
              }
            >
              <PencilSquareIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
            <AdminActionButton
              action="delete"
              resource="chat_messages"
              can={can}
              size="sm"
              variant="tertiary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Delete chat message"
              title="Delete"
              onClick={() => setDeleteTarget(message)}
            >
              <TrashIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
          </div>
        ),
      },
    ],
    [can, navigate],
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
    <AdminLayout title="Chat Messages">
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

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete chat message"
        message="Delete this chat message? This cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};
