// src/modules/admin/chat/pages/AdminChatRoomsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions ,  useSort, SORT_ORDERS } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import ChatController from "../chat.controller";
import type { IAdminChatRoom } from "../types";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import { formatAdminDate, truncateAdminText } from "../../helpers/admin.helper";
import {
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_TABLE_HEADERS,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
} from "../../constants";
import {
  ADMIN_CHAT_PAGE_TITLES,
  ADMIN_CHAT_ROOM_SORT_KEYS,
  ADMIN_CHAT_ROOM_TABLE_KEYS,
  ADMIN_CHAT_TABLE_HEADERS,
} from "../constants";

interface IAdminChatRoomsPageProps {
  view?: TAdminViewMode;
}

export const AdminChatRoomsPage: React.FC<IAdminChatRoomsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? ADMIN_CHAT_PAGE_TITLES.ROOMS
      : ADMIN_CHAT_PAGE_TITLES.ROOMS_RECYCLE_BIN,
  );

  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy:
      view === ADMIN_VIEW_MODES.ACTIVE
        ? ADMIN_CHAT_ROOM_SORT_KEYS.CREATED_AT
        : ADMIN_CHAT_ROOM_SORT_KEYS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

  const { can } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [rooms, setRooms] = useState<IAdminChatRoom[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [discardTarget, setDiscardTarget] = useState<IAdminChatRoom | null>(null);
  const [destroyTarget, setDestroyTarget] = useState<IAdminChatRoom | null>(null);

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

  const loadRooms = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROOMS)) return;

    setLoading(true);
    setError("");

    const result = await ChatController.getRooms({
      page,
      limit: ADMIN_PAGE_SIZE,
      sort_by: sortBy,
      sort_order: sortOrder,
      discarded: view === ADMIN_VIEW_MODES.DISCARDED ? "true" : undefined,
    });

    if (result.success) {
      setRooms(result.rooms);
      setPagination(result.pagination);
    } else {
      setError(result.error || "Failed to load chat rooms");
    }
    setLoading(false);
  }, [can, page, setLoading, sortBy, sortOrder, view]);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const handleUndiscard = async (room: IAdminChatRoom) => {
    setLoading(true);
    const result = await ChatController.undiscardRoom(room.id);
    setLoading(false);

    if (result.success) {
      toast.success("Chat room restored");
      void loadRooms();
    } else {
      toast.error(result.error || "Failed to restore chat room");
    }
  };

  const columns = useMemo<IAdminTableColumn<IAdminChatRoom>[]>(
    () => [
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.TITLE,
        header: ADMIN_CHAT_TABLE_HEADERS.ROOM,
        sortKey: ADMIN_CHAT_ROOM_SORT_KEYS.TITLE,
        render: (room) => (
          <div>
            <div className="font-semibold text-base-content">
              {room.title || "Untitled Room"}
            </div>
            {room.last_message && (
              <div className="text-body-s text-base-content opacity-60">
                {truncateAdminText(room.last_message)}
              </div>
            )}
          </div>
        ),
      },
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.MESSAGES,
        header: ADMIN_CHAT_TABLE_HEADERS.MESSAGES,
        sortKey: ADMIN_CHAT_ROOM_SORT_KEYS.MESSAGE_COUNT,
        render: (room) => (
          <span className="font-semibold text-base-content">
            {room.message_count ?? 0}
          </span>
        ),
      },
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.CREATED,
        header: ADMIN_TABLE_HEADERS.CREATED,
        sortKey: ADMIN_CHAT_ROOM_SORT_KEYS.CREATED_AT,
        render: (room) => formatAdminDate(room.created_at),
      },
      {
        key: ADMIN_CHAT_ROOM_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (room) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.ROOMS}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.CHAT_ROOM_EDIT,
                            room.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.DISCARD,
                      onClick: () => setDiscardTarget(room),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () => void handleUndiscard(room),
                    },
                    {
                      type: ADMIN_ACTIONS.DESTROY,
                      onClick: () => setDestroyTarget(room),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, toast, view],
  );

  const handleDiscard = async () => {
    if (!discardTarget) return;

    setLoading(true);

    const result = await ChatController.discardRoom(discardTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success("Chat room discarded");
      setDiscardTarget(null);
      void loadRooms();
    } else {
      toast.error(result.error || "Failed to discard room");
    }
  };

  const handleDestroy = async () => {
    if (!destroyTarget) return;

    setLoading(true);
    const result = await ChatController.deleteRoom(destroyTarget.id);
    setLoading(false);

    if (result.success) {
      toast.success("Chat room permanently destroyed");
      setDestroyTarget(null);
      void loadRooms();
    } else {
      toast.error(result.error || "Failed to destroy room");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chat Rooms"
        description="Moderate chat rooms, inspect discussion threads, and manage community channels."
      >
        {can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.ROOMS) && (
          <Tabs
            value={view}
            onChange={(tab) => {
              navigate(
                tab === ADMIN_VIEW_MODES.ACTIVE
                  ? AppRoutes.client.protected.admin.CHAT_ROOMS
                  : AppRoutes.client.protected.admin.CHAT_ROOMS_RECYCLE_BIN,
              );
              updateFilters({ page: 1 });
            }}
            items={[
              {
                value: ADMIN_VIEW_MODES.ACTIVE,
                label: "Active Rooms",
                icon: iconsLib.chatBubbleLeftRight,
                count:
                  view === ADMIN_VIEW_MODES.ACTIVE
                    ? pagination?.total_count
                    : undefined,
              },
              {
                value: ADMIN_VIEW_MODES.DISCARDED,
                label: "Recycle Bin",
                icon: iconsLib.trash,
                count:
                  view === ADMIN_VIEW_MODES.DISCARDED
                    ? pagination?.total_count
                    : undefined,
              },
            ]}
          />
        )}
      </PageHeader>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load chat rooms"
          message={error}
        />
      ) : !isLoading && rooms.length === 0 ? (
        <AdminState
          icon={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? iconsLib.chatBubbleLeftRight
              : iconsLib.trash
          }
          title={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No chat rooms yet"
              : "Recycle bin is empty"
          }
          message={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "Chat rooms will appear here when users start conversations."
              : "Discarded chat rooms will appear here."
          }
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={rooms}
            getRowKey={(room) => room.id}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(discardTarget)}
        title="Discard Chat Room"
        message={`Are you sure you want to discard "${discardTarget?.title || "this chat room"}"?`}
        confirmLabel={ADMIN_COMMON_LABELS.DISCARD}
        isDestructive={true}
        isLoading={isLoading}
        onClose={() => setDiscardTarget(null)}
        onConfirm={handleDiscard}
      />

      <ConfirmDialog
        isOpen={Boolean(destroyTarget)}
        title="Destroy Chat Room"
        message={`Are you sure you want to permanently destroy "${destroyTarget?.title || "this chat room"}"? This action cannot be undone.`}
        confirmLabel={ADMIN_COMMON_LABELS.DESTROY}
        isDestructive={true}
        isLoading={isLoading}
        onClose={() => setDestroyTarget(null)}
        onConfirm={handleDestroy}
      />
    </div>
  );
};
