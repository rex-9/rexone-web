import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { AdminChatController } from "../../../controllers";
import { useToast } from "../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../hooks";
import { IAdminChatRoom, IApiPagination } from "../../../models";
import {
  AdminActionButton,
  AdminLayout,
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTable,
  ConfirmationDialog,
  IAdminTableColumn,
} from "../../components";
import { formatAdminDate, truncateAdminText } from "./adminPageUtils";

const PAGE_SIZE = 10;

export const AdminChatRoomsPage: React.FC = () => {
  useDocumentTitle("Chat Rooms");

  const toast = useToast();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [rooms, setRooms] = useState<IAdminChatRoom[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminChatRoom | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    setError("");

    await AdminChatController.getRooms(
      { page, limit: PAGE_SIZE },
      (nextRooms, nextPagination) => {
        setRooms(nextRooms);
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
      void loadRooms();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRooms]);

  const columns = useMemo<IAdminTableColumn<IAdminChatRoom>[]>(
    () => [
      { key: "title", header: "Room", render: (room) => room.title },
      {
        key: "messages",
        header: "Messages",
        render: (room) => room.message_count,
      },
      {
        key: "last",
        header: "Last message",
        render: (room) => truncateAdminText(room.last_message),
      },
      {
        key: "created",
        header: "Created",
        render: (room) => formatAdminDate(room.created_at),
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (room) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action="update"
              resource="chat_rooms"
              can={can}
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
              action="delete"
              resource="chat_rooms"
              can={can}
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
    [can, navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    await AdminChatController.deleteRoom(
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
    <AdminLayout title="Chat Rooms">
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

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete chat room"
        message={`Delete ${deleteTarget?.title || "this chat room"}? This will also delete its messages.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};
