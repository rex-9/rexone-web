// src/modules/admin/notification/pages/AdminUserNotificationDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { useToast } from "../../../../contexts/ToastContext";
import {
  Badge,
  Button,
  DateTime,
  DateTimeFormats,
} from "../../../../design";
import {
  BadgeVariants,
  ButtonSizes,
  ButtonTypes,
  ButtonVariants,
} from "../../../../design/constants";
import { usePermissions } from "../../../../hooks";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
  ConfirmDialog,
} from "../../components";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import NotificationController from "../notification.controller";
import type { IAdminUserNotification } from "../types";

const loadUserNotification = async (id: string) => {
  const result = await NotificationController.getUserNotification(id);
  return { ...result, record: result.notification };
};

export const AdminUserNotificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();

  const { record, error } = useAdminDetail<IAdminUserNotification>(
    id,
    loadUserNotification,
  );
  const [notification, setNotification] =
    useState<IAdminUserNotification | null>(null);

  useEffect(() => {
    if (record) {
      setNotification(record);
    }
  }, [record]);

  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isUndiscardOpen, setIsUndiscardOpen] = useState(false);
  const [isDestroyOpen, setIsDestroyOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const canDelete = can(
    ADMIN_ACTIONS.DELETE,
    ADMIN_RESOURCES.USER_NOTIFICATIONS,
  );

  const isDiscarded = Boolean(notification?.discarded_at);
  const listPath = isDiscarded
    ? AppRoutes.client.protected.admin.USER_NOTIFICATIONS_RECYCLE_BIN
    : AppRoutes.client.protected.admin.USER_NOTIFICATIONS;

  const handleDiscard = async () => {
    if (!notification) return;
    setActionLoading(true);
    try {
      const result = await NotificationController.discardUserNotification(
        notification.id,
      );
      if (result.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .DiscardSuccess,
          ),
        );
        setIsDiscardOpen(false);
        navigate(AppRoutes.client.protected.admin.USER_NOTIFICATIONS);
      } else {
        toast.error(result.error || "Failed to discard user notification");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUndiscard = async () => {
    if (!notification) return;
    setActionLoading(true);
    try {
      const result = await NotificationController.undiscardUserNotification(
        notification.id,
      );
      if (result.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .RestoreSuccess,
          ),
        );
        setIsUndiscardOpen(false);
        setNotification((prev) =>
          prev ? { ...prev, discarded_at: null } : null,
        );
      } else {
        toast.error(result.error || "Failed to restore user notification");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDestroy = async () => {
    if (!notification) return;
    setActionLoading(true);
    try {
      const result = await NotificationController.destroyUserNotification(
        notification.id,
      );
      if (result.success) {
        toast.success(
          t(
            AppLocales.Admin.Notifications.UserNotifications.Toasts
              .DestroySuccess,
          ),
        );
        setIsDestroyOpen(false);
        navigate(
          AppRoutes.client.protected.admin.USER_NOTIFICATIONS_RECYCLE_BIN,
        );
      } else {
        toast.error(
          result.error || "Failed to permanently delete user notification",
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  const hasMetadata =
    notification?.metadata && Object.keys(notification.metadata).length > 0;

  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          {
            label: t(AppLocales.Admin.Notifications.UserNotifications.Title),
            to: AppRoutes.client.protected.admin.USER_NOTIFICATIONS,
          },
          ...(isDiscarded
            ? [
                {
                  label: t(
                    AppLocales.Admin.Notifications.UserNotifications.Tabs
                      .RecycleBin,
                  ),
                  to: AppRoutes.client.protected.admin
                    .USER_NOTIFICATIONS_RECYCLE_BIN,
                },
              ]
            : []),
          {
            label:
              notification?.title ||
              t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={t(AppLocales.Admin.Notifications.UserNotifications.Detail.Title)}
        description={t(
          AppLocales.Admin.Notifications.UserNotifications.Detail.Description,
        )}
        backTo={listPath}
      />

      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : notification ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info Column (Left 2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Notification Content Section */}
            <AdminDetailSection
              title={t(
                AppLocales.Admin.Notifications.UserNotifications.Detail
                  .ContentSection,
              )}
              icon={iconsLib.bell}
            >
              <div className="space-y-4">
                <div>
                  <span className="text-caption text-xs font-semibold uppercase tracking-wider text-base-content/60">
                    {t(
                      AppLocales.Admin.Notifications.UserNotifications.Detail
                        .NotificationTitle,
                    )}
                  </span>
                  <h3 className="mt-1 text-title-3 font-semibold text-base-content">
                    {notification.title}
                  </h3>
                </div>

                <div>
                  <span className="text-caption text-xs font-semibold uppercase tracking-wider text-base-content/60">
                    {t(
                      AppLocales.Admin.Notifications.UserNotifications.Detail
                        .NotificationMessage,
                    )}
                  </span>
                  <p className="mt-1 whitespace-pre-wrap text-body-s text-base-content/90 rounded-lg bg-base-200/40 p-4 border border-base-300">
                    {notification.message}
                  </p>
                </div>

                {notification.link && (
                  <div>
                    <span className="text-caption text-xs font-semibold uppercase tracking-wider text-base-content/60 block mb-1">
                      {t(
                        AppLocales.Admin.Notifications.UserNotifications.Detail
                          .TargetLink,
                      )}
                    </span>
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline break-all"
                    >
                      <iconsLib.externalLink className="w-3.5 h-3.5 shrink-0" />
                      {notification.link}
                    </a>
                  </div>
                )}
              </div>
            </AdminDetailSection>

            {/* Recipient & Delivery Section */}
            <AdminDetailSection
              title={t(
                AppLocales.Admin.Notifications.UserNotifications.Detail
                  .RecipientSection,
              )}
              icon={iconsLib.user}
            >
              <AdminDetailGrid className="grid-cols-1 sm:grid-cols-2">
                <AdminDetailField
                  label={t(
                    AppLocales.Admin.Notifications.UserNotifications.Detail
                      .Recipient,
                  )}
                  value={
                    <div className="flex flex-col">
                      <span className="font-medium text-base-content break-all">
                        {notification.user_email || notification.user_id}
                      </span>
                      {notification.user_id && (
                        <span className="font-mono text-xs text-base-content/50">
                          ID: {notification.user_id}
                        </span>
                      )}
                    </div>
                  }
                />

                <AdminDetailField
                  label={t(
                    AppLocales.Admin.Notifications.UserNotifications.Detail
                      .RecipientName,
                  )}
                  value={
                    notification.user_name || (
                      <span className="text-base-content/40 italic">
                        Not available
                      </span>
                    )
                  }
                />

                <AdminDetailField
                  label={t(
                    AppLocales.Admin.Notifications.UserNotifications.Detail
                      .ReadStatus,
                  )}
                  value={
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          notification.read
                            ? BadgeVariants.SUCCESS
                            : BadgeVariants.WARNING
                        }
                      >
                        {notification.read ? "Read" : "Unread"}
                      </Badge>
                      {notification.read_at && (
                        <DateTime
                          value={notification.read_at}
                          format={DateTimeFormats.ADMIN}
                          className="text-xs text-base-content/60"
                        />
                      )}
                    </div>
                  }
                />

                <AdminDetailField
                  label={t(
                    AppLocales.Admin.Notifications.UserNotifications.Detail
                      .Platforms,
                  )}
                  value={
                    <div className="flex flex-wrap gap-1">
                      {notification.clients && notification.clients.length > 0 ? (
                        notification.clients.map((client) => (
                          <Badge
                            key={client}
                            variant={BadgeVariants.SECONDARY}
                            className="capitalize text-xs"
                          >
                            {client}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-base-content/40 italic text-xs">
                          All platforms
                        </span>
                      )}
                    </div>
                  }
                />

                <AdminDetailField
                  label={t(
                    AppLocales.Admin.Notifications.UserNotifications.Detail
                      .SentAt,
                  )}
                  value={
                    <DateTime
                      value={notification.created_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  }
                />

                {notification.discarded_at && (
                  <AdminDetailField
                    label={t(
                      AppLocales.Admin.Notifications.UserNotifications.Detail
                        .DiscardedAt,
                    )}
                    value={
                      <DateTime
                        value={notification.discarded_at}
                        format={DateTimeFormats.ADMIN}
                        className="text-error"
                      />
                    }
                  />
                )}
              </AdminDetailGrid>
            </AdminDetailSection>

            {/* Async Operation Section if present */}
            {notification.operation_id && (
              <AdminDetailSection
                title={t(
                  AppLocales.Admin.Notifications.UserNotifications.Detail
                    .OperationSection,
                )}
                icon={iconsLib.cube}
              >
                <AdminDetailGrid className="grid-cols-1 sm:grid-cols-3">
                  <AdminDetailField
                    label={t(
                      AppLocales.Admin.Notifications.UserNotifications.Detail
                        .OperationId,
                    )}
                    value={
                      <span className="font-mono text-xs text-base-content">
                        {notification.operation_id}
                      </span>
                    }
                  />
                  <AdminDetailField
                    label={t(
                      AppLocales.Admin.Notifications.UserNotifications.Detail
                        .OperationType,
                    )}
                    value={
                      <Badge variant={BadgeVariants.SECONDARY}>
                        {notification.operation_type || "N/A"}
                      </Badge>
                    }
                  />
                  <AdminDetailField
                    label={t(
                      AppLocales.Admin.Notifications.UserNotifications.Detail
                        .OperationStatus,
                    )}
                    value={
                      <Badge
                        variant={
                          notification.operation_status === "completed" ||
                          notification.operation_status === "ready"
                            ? BadgeVariants.SUCCESS
                            : notification.operation_status === "failed"
                              ? BadgeVariants.ERROR
                              : BadgeVariants.INFO
                        }
                      >
                        {notification.operation_status || "N/A"}
                      </Badge>
                    }
                  />
                </AdminDetailGrid>
              </AdminDetailSection>
            )}

            {/* Metadata Section */}
            <AdminDetailSection
              title={t(
                AppLocales.Admin.Notifications.UserNotifications.Detail
                  .MetadataSection,
              )}
              icon={iconsLib.document}
            >
              <pre className="max-h-72 overflow-auto rounded-lg bg-base-300/60 p-4 font-mono text-xs text-base-content border border-base-300">
                {hasMetadata
                  ? JSON.stringify(notification.metadata, null, 2)
                  : "{}"}
              </pre>
            </AdminDetailSection>
          </div>

          {/* Actions & Lifecycle Column (Right 1 col) */}
          <div className="space-y-6">
            <AdminDetailSection
              title={t(AppLocales.Admin.Common.Table.Actions)}
              icon={iconsLib.filter}
            >
              <div className="space-y-3">
                {notification.link && (
                  <Button
                    type={ButtonTypes.BUTTON}
                    variant={ButtonVariants.SECONDARY}
                    size={ButtonSizes.MD}
                    fullWidth
                    onClick={() => {
                      if (notification.link) {
                        window.open(notification.link, "_blank");
                      }
                    }}
                  >
                    <iconsLib.externalLink className="w-4 h-4 mr-2" />
                    {t(
                      AppLocales.Admin.Notifications.UserNotifications.Detail
                        .TargetLink,
                    )}
                  </Button>
                )}

                {canDelete && !isDiscarded && (
                  <Button
                    type={ButtonTypes.BUTTON}
                    variant={ButtonVariants.SECONDARY}
                    size={ButtonSizes.MD}
                    className="btn-error"
                    fullWidth
                    onClick={() => setIsDiscardOpen(true)}
                  >
                    <iconsLib.trash className="w-4 h-4 mr-2" />
                    {t(AppLocales.Admin.Common.Actions.Discard)}
                  </Button>
                )}

                {canDelete && isDiscarded && (
                  <>
                    <Button
                      type={ButtonTypes.BUTTON}
                      variant={ButtonVariants.SECONDARY}
                      size={ButtonSizes.MD}
                      fullWidth
                      onClick={() => setIsUndiscardOpen(true)}
                    >
                      <iconsLib.arrowPath className="w-4 h-4 mr-2" />
                      {t(AppLocales.Admin.Common.Actions.Restore)}
                    </Button>

                    <Button
                      type={ButtonTypes.BUTTON}
                      variant={ButtonVariants.SECONDARY}
                      size={ButtonSizes.MD}
                      className="btn-error"
                      fullWidth
                      onClick={() => setIsDestroyOpen(true)}
                    >
                      <iconsLib.trash className="w-4 h-4 mr-2" />
                      {t(AppLocales.Admin.Common.Actions.Destroy)}
                    </Button>
                  </>
                )}
              </div>
            </AdminDetailSection>
          </div>
        </div>
      ) : null}

      {/* Discard Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDiscardOpen}
        title={t(
          AppLocales.Admin.Notifications.UserNotifications.DiscardTitle,
        )}
        message={t(
          AppLocales.Admin.Notifications.UserNotifications.DiscardMessage,
        )}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleDiscard}
        onClose={() => setIsDiscardOpen(false)}
        isLoading={actionLoading}
        isDestructive
      />

      {/* Restore Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isUndiscardOpen}
        title={t(
          AppLocales.Admin.Notifications.UserNotifications.RestoreTitle,
        )}
        message={t(
          AppLocales.Admin.Notifications.UserNotifications.RestoreMessage,
        )}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Restore)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleUndiscard}
        onClose={() => setIsUndiscardOpen(false)}
        isLoading={actionLoading}
      />

      {/* Destroy Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDestroyOpen}
        title={t(AppLocales.Admin.Notifications.UserNotifications.DeleteTitle)}
        message={t(
          AppLocales.Admin.Notifications.UserNotifications.DeleteMessage,
        )}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        isDestructive
        onConfirm={handleDestroy}
        onClose={() => setIsDestroyOpen(false)}
        isLoading={actionLoading}
      />
    </div>
  );
};
