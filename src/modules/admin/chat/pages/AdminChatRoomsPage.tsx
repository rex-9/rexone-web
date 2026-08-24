import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { IApiPagination } from "../../../../models";
import ChatController from "../chat.controller";
import { IAdminChatRoom } from "../types";
import {
  AdminActionButton,
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTable,
  ConfirmDialog,
  IAdminTableColumn,
} from "../../components";
import { formatAdminDate, truncateAdminText } from "../../helpers/admin-page.helper";
import {
  ADMIN_ACTIONS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_TABLE_HEADERS,
} from "../../constants";

export const AdminChatRoomsPage: React.FC = () => {
  useDocumentTitle("Chat Rooms");

  const toast = useToast();
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoading();
  const [rooms, setRooms] = useState<IAdminChatRoom[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminChatRoom | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError("");

    await ChatController.getRooms(
      { page, limit: ADMIN_PAGE_SIZE },
      (nextRooms, nextPagination) => {
        setRooms(nextRooms);
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
      void loadRooms();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRooms]);

  const columns = useMemo<IAdminTableColumn<IAdminChatRoom>[]>(
    () => [
      {
        key: "title",
        header: ADMIN_TABLE_HEADERS.ROOM,
        render: (room) => room.title,
      },
      {
        key: "messages",
        header: ADMIN_TABLE_HEADERS.MESSAGES,
        render: (room) => room.message_count,
      },
      {
        key: "last",
        header: ADMIN_TABLE_HEADERS.LAST_MESSAGE,
        render: (room) => truncateAdminText(room.last_message),
      },
      {
        key: "created",
        header: ADMIN_TABLE_HEADERS.CREATED,
        render: (room) => formatAdminDate(room.created_at),
      },
      {
        key: "actions",
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (room) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action={ADMIN_ACTIONS.UPDATE}
              resource={ADMIN_RESOURCES.ROOMS}
              size="sm"
              variant="secondary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Edit chat room"
              title="Edit"
              onClick={() =>
                navigate(
                  AppRoutes.client.protected.ADMIN_CHAT_ROOM_EDIT.replace(
                    ":id",
                    room.id,
                  ),
                )
              }
            >
              <PencilSquareIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
            <AdminActionButton
              action={ADMIN_ACTIONS.DELETE}
              resource={ADMIN_RESOURCES.ROOMS}
              size="sm"
              variant="tertiary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Delete chat room"
              title="Delete"
              onClick={() => setDeleteTarget(room)}
            >
              <TrashIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
          </div>
        ),
      },
    ],
    [navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    await ChatController.deleteRoom(
      deleteTarget.id,
      () => {
        toast.success("Chat room deleted");
        setDeleteTarget(null);
        setIsDeleting(false);
        void loadRooms();
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
        <AdminState title="Unable to load chat rooms" message={error} />
      ) : rooms.length === 0 ? (
        <AdminState title="No chat rooms yet" message="Chat rooms will appear here when users start conversations." />
      ) : (
        <>
          <AdminTable columns={columns} records={rooms} getRowKey={(room) => room.id} />
          <AdminPagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete chat room"
        message={`Delete ${deleteTarget?.title || "this chat room"}? This will also delete its messages.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};
