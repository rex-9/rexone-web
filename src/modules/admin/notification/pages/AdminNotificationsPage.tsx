// src/modules/admin/notifications/pages/AdminNotificationsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { useTranslate, AppLocales } from "../../../../locales";
import type { IUser } from "../../../../models";
import UserController from "../../user/user.controller";
import RoleController from "../../role/role.controller";
import type { IAdminRole } from "../../role/types";
import NotificationController from "../notification.controller";
import type {
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
} from "../types";
import {
  NOTIFICATION_ADMIN_TABS,
  type TNotificationAdminTab,
  NOTIFICATION_AUDIENCE_TYPES,
  type NotificationAudienceType,
  NOTIFICATION_DELIVERY_CHANNELS,
  NOTIFICATION_DELIVERY_FIELDS,
  NOTIFICATION_FIELDS,
  NOTIFICATION_KEYBOARD_KEYS,
} from "../constants";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import {
  AlertDialog,
  AdminState,
  Button,
  PageHeader,
  Tabs,
  type ITabItem,
} from "../../components";
import {
  AdminNotificationTemplatesTab,
  AdminNotificationPreview,
} from "../components";
import { AdminUserNotificationsPage } from "./AdminUserNotificationsPage";
import {
  Checkbox,
  Dropdown,
  FormContainer,
  SearchInput,
  StatusBadge,
} from "../../../../design/components";
import {
  BadgeVariants,
  ButtonSizes,
  ButtonTypes,
  ButtonVariants,
  DropdownSizes,
} from "../../../../design/constants";
import {
  filterAndSortBroadcastTemplates,
  getTemplateConfiguredChannels,
  getTemplateDropdownGroup,
} from "../helpers";
import { iconsLib } from "../../../../assets";

const initialValues: IAdminNotificationFormValues = {
  event: "",
  audience_type: NOTIFICATION_AUDIENCE_TYPES.ALL,
  user_ids: [],
  role_ids: [],
  send_push: true,
  send_socket: true,
  send_email: false,
};

const RECIPIENT_SEARCH_MIN_LENGTH = 2;
const RECIPIENT_SEARCH_DEBOUNCE_MS = 250;
const RECIPIENT_SEARCH_LIMIT = 20;

const mergeUsersById = (currentUsers: IUser[], nextUsers: IUser[]) => {
  const usersById = new Map<string, IUser>();
  currentUsers.forEach((user) => usersById.set(user.id, user));
  nextUsers.forEach((user) => usersById.set(user.id, user));
  return Array.from(usersById.values());
};

export const AdminNotificationsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Notifications.Title)} | Admin`);

  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const canReadRoles = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROLES);
  const canReadUsers = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USERS);
  const canReadUserNotifications = can(
    ADMIN_ACTIONS.READ,
    ADMIN_RESOURCES.USER_NOTIFICATIONS,
  );
  const canCreateNotifications = can(
    ADMIN_ACTIONS.CREATE,
    ADMIN_RESOURCES.NOTIFICATIONS,
  );

  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [templates, setTemplates] = useState<IAdminNotificationTemplate[]>([]);
  const [includeTransactional, setIncludeTransactional] = useState(false);
  const [values, setValues] =
    useState<IAdminNotificationFormValues>(initialValues);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [isRecipientFocused, setIsRecipientFocused] = useState(false);
  const [recipientSearchError, setRecipientSearchError] = useState("");
  const { isLoading, setLoading } = useLoading();
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TNotificationAdminTab | null;
  const [activeTab, setActiveTab] = useState<TNotificationAdminTab>(
    tabParam && Object.values(NOTIFICATION_ADMIN_TABS).includes(tabParam)
      ? tabParam
      : NOTIFICATION_ADMIN_TABS.BROADCAST,
  );

  useEffect(() => {
    if (tabParam && Object.values(NOTIFICATION_ADMIN_TABS).includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (!tabParam) {
      setActiveTab(NOTIFICATION_ADMIN_TABS.BROADCAST);
    }
  }, [tabParam]);

  const handleTabChange = useCallback(
    (tab: TNotificationAdminTab) => {
      setActiveTab(tab);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (tab === NOTIFICATION_ADMIN_TABS.BROADCAST) {
            next.delete("tab");
          } else {
            next.set("tab", tab);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const tabItems = useMemo<ITabItem<TNotificationAdminTab>[]>(() => {
    const tabs: ITabItem<TNotificationAdminTab>[] = [
      {
        value: NOTIFICATION_ADMIN_TABS.BROADCAST,
        label: t(AppLocales.Admin.Notifications.Tabs.Broadcast),
        icon: iconsLib.bellAlert,
      },
      {
        value: NOTIFICATION_ADMIN_TABS.TEMPLATES,
        label: t(AppLocales.Admin.Notifications.Tabs.Templates),
        icon: iconsLib.document,
      },
    ];

    if (canReadUserNotifications) {
      tabs.push({
        value: NOTIFICATION_ADMIN_TABS.USER_NOTIFICATIONS,
        label: t(AppLocales.Admin.Notifications.UserNotifications.Title),
        icon: iconsLib.bell,
      });
    }

    return tabs;
  }, [canReadUserNotifications, t]);

  useEffect(() => {
    if (permissionsLoading) return;

    const loadInitialData = async () => {
      setLoading(true);

      const [templateRes, rolesRes] = await Promise.all([
        NotificationController.getTemplates(),
        canReadRoles ? RoleController.getRoles() : Promise.resolve(null),
      ]);
      setLoading(false);

      if (templateRes.success) {
        setTemplates(templateRes.templates);
        const broadcast = templateRes.templates.filter((t) => t.admin === true);
        const available = filterAndSortBroadcastTemplates(broadcast, {
          includeTransactional: false,
        });
        if (available.length > 0) {
          const firstTpl = available[0];
          const channels = getTemplateConfiguredChannels(firstTpl);
          setValues((v) => ({
            ...v,
            event: firstTpl.event,
            send_socket: channels.send_socket,
            send_push: channels.send_push,
            send_email: channels.send_email,
          }));
        }
      } else {
        setError(
          templateRes.error ||
            t(AppLocales.Admin.Notifications.Errors.LoadTemplates),
        );
      }

      if (rolesRes && rolesRes.success) {
        setRoles(rolesRes.roles);
      }
    };

    void loadInitialData();
  }, [canReadRoles, permissionsLoading, setLoading, t]);

  const searchRecipients = useCallback(
    async (search: string) => {
      if (!canReadUsers) {
        setRecipientSearchError(
          t(AppLocales.Admin.Notifications.Errors.SearchUsers),
        );
        return;
      }

      setLoading(true, { overlay: false });

      const result = await UserController.getUsers({
        search,
        limit: RECIPIENT_SEARCH_LIMIT,
      });
      setLoading(false);

      if (result.success) {
        setUsers((currentUsers) => mergeUsersById(currentUsers, result.users));
        setRecipientSearchError("");
      } else {
        setRecipientSearchError(
          result.error || t(AppLocales.Admin.Users.Errors.LoadListFailed),
        );
      }
    },
    [canReadUsers, setLoading, t],
  );

  useEffect(() => {
    const search = recipientQuery.trim();

    if (
      values.audience_type !== NOTIFICATION_AUDIENCE_TYPES.USERS ||
      search.length < RECIPIENT_SEARCH_MIN_LENGTH
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void searchRecipients(search);
    }, RECIPIENT_SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [recipientQuery, searchRecipients, values.audience_type]);

  const sortedRoles = useMemo(
    () => [...roles].sort((a, b) => a.name.localeCompare(b.name)),
    [roles],
  );

  const broadcastTemplates = useMemo(
    () => templates.filter((t) => t.admin === true),
    [templates],
  );

  const availableTemplates = useMemo(
    () =>
      filterAndSortBroadcastTemplates(broadcastTemplates, {
        includeTransactional,
      }),
    [broadcastTemplates, includeTransactional],
  );

  const templateOptions = useMemo(
    () =>
      availableTemplates.map((template) => ({
        value: template.event,
        label: `${template.name} (${template.event})`,
        group: getTemplateDropdownGroup(template),
      })),
    [availableTemplates],
  );

  const audienceOptions = useMemo(
    () => [
      {
        value: NOTIFICATION_AUDIENCE_TYPES.ALL,
        label: t(AppLocales.Admin.Notifications.Labels.AllUsers),
      },
      ...(canReadRoles
        ? [
            {
              value: NOTIFICATION_AUDIENCE_TYPES.ROLES,
              label: t(AppLocales.Admin.Notifications.Labels.SelectedRoles),
            },
          ]
        : []),
      {
        value: NOTIFICATION_AUDIENCE_TYPES.USERS,
        label: t(AppLocales.Admin.Notifications.Labels.SelectedUsers),
      },
    ],
    [canReadRoles, t],
  );

  const selectedTemplate = useMemo(
    () => availableTemplates.find((t) => t.event === values.event),
    [availableTemplates, values.event],
  );

  useEffect(() => {
    if (availableTemplates.length > 0) {
      const exists = availableTemplates.some((t) => t.event === values.event);
      if (!exists) {
        setValues((v) => ({ ...v, event: availableTemplates[0].event }));
      }
    }
  }, [availableTemplates, values.event]);

  const configuredChannels = useMemo(
    () => getTemplateConfiguredChannels(selectedTemplate),
    [selectedTemplate],
  );

  const availableChannelsCount = [
    configuredChannels.send_push,
    configuredChannels.send_socket,
    configuredChannels.send_email,
  ].filter(Boolean).length;

  // Auto-sync channels when switching templates
  const prevEventRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (!selectedTemplate) return;

    if (prevEventRef.current !== selectedTemplate.event) {
      prevEventRef.current = selectedTemplate.event;
      setValues((prev) => ({
        ...prev,
        send_socket: configuredChannels.send_socket,
        send_push: configuredChannels.send_push,
        send_email: configuredChannels.send_email,
      }));
    }
  }, [selectedTemplate, configuredChannels]);

  // Ensure unconfigured channels cannot remain true in form state
  useEffect(() => {
    setValues((prev) => {
      let hasChange = false;
      const next = { ...prev };
      if (!configuredChannels.send_socket && prev.send_socket) {
        next.send_socket = false;
        hasChange = true;
      }
      if (!configuredChannels.send_push && prev.send_push) {
        next.send_push = false;
        hasChange = true;
      }
      if (!configuredChannels.send_email && prev.send_email) {
        next.send_email = false;
        hasChange = true;
      }
      return hasChange ? next : prev;
    });
  }, [configuredChannels]);

  const selectedRoleIds = values.role_ids;
  const selectedUserIds = values.user_ids;
  const selectedRoleIdSet = useMemo(
    () => new Set(selectedRoleIds),
    [selectedRoleIds],
  );
  const selectedUserIdSet = useMemo(
    () => new Set(selectedUserIds),
    [selectedUserIds],
  );

  const selectedUsers = useMemo(
    () => users.filter((u) => selectedUserIdSet.has(u.id)),
    [selectedUserIdSet, users],
  );

  const availableUsers = useMemo(
    () => users.filter((u) => !selectedUserIdSet.has(u.id)),
    [selectedUserIdSet, users],
  );

  const recipientSuggestions = useMemo(() => {
    const q = recipientQuery.trim().toLowerCase();
    if (!q) return [];
    return availableUsers
      .filter((u) =>
        [u.name, u.email, u.username].some(
          (val) => val && val.toLowerCase().includes(q),
        ),
      )
      .slice(0, 6);
  }, [availableUsers, recipientQuery]);

  const selectedChannelsCount = [
    values.send_push,
    values.send_socket,
    values.send_email,
  ].filter(Boolean).length;

  const updateValue = (
    field: keyof IAdminNotificationFormValues,
    value: string | string[] | boolean,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleRole = (roleId: string) => {
    setValues((current) => {
      const nextRoles = current.role_ids.includes(roleId)
        ? current.role_ids.filter((id) => id !== roleId)
        : [...current.role_ids, roleId];
      return { ...current, role_ids: nextRoles };
    });
  };

  const addUser = (userId: string) => {
    setValues((current) => {
      if (current.user_ids.includes(userId)) return current;
      return { ...current, user_ids: [...current.user_ids, userId] };
    });
    setRecipientQuery("");
  };

  const removeUser = (userId: string) => {
    setValues((current) => ({
      ...current,
      user_ids: current.user_ids.filter((id) => id !== userId),
    }));
  };

  const handleRecipientKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      (event.key === NOTIFICATION_KEYBOARD_KEYS.ADD_RECIPIENT ||
        event.key === NOTIFICATION_KEYBOARD_KEYS.SEPARATOR) &&
      recipientSuggestions.length > 0
    ) {
      event.preventDefault();
      addUser(recipientSuggestions[0].id);
      return;
    }

    if (
      event.key === NOTIFICATION_KEYBOARD_KEYS.REMOVE_RECIPIENT &&
      recipientQuery.length === 0 &&
      selectedUserIds.length > 0
    ) {
      removeUser(selectedUserIds[selectedUserIds.length - 1]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.event) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Validation.EventRequired),
      );
      return;
    }

    if (availableChannelsCount === 0) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Labels.TemplateNoChannels),
      );
      return;
    }

    if (selectedChannelsCount === 0) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Validation.DeliveryChannelRequired),
      );
      return;
    }

    if (
      values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS &&
      selectedUserIds.length === 0
    ) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Validation.UserRequired),
      );
      return;
    }

    if (
      values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES &&
      selectedRoleIds.length === 0
    ) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Validation.RoleRequired),
      );
      return;
    }

    setLoading(true);

    const result = await NotificationController.createNotification({
      ...values,
      user_ids:
        values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS
          ? values.user_ids
          : [],
      role_ids:
        values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES
          ? values.role_ids
          : [],
    });
    setLoading(false);

    if (result.success) {
      toast.success(
        result.message || t(AppLocales.Admin.Notifications.Toasts.SendSuccess),
      );
      const nextTemplate = availableTemplates[0] || null;
      const nextChannels = getTemplateConfiguredChannels(nextTemplate);
      setValues({
        ...initialValues,
        event: nextTemplate?.event || "",
        send_socket: nextChannels.send_socket,
        send_push: nextChannels.send_push,
        send_email: nextChannels.send_email,
      });
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Notifications.Errors.Send),
      );
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <PageHeader
        title={t(AppLocales.Admin.Notifications.Title)}
        description={t(AppLocales.Admin.Notifications.Description)}
      />

      <Tabs<TNotificationAdminTab>
        items={tabItems}
        value={activeTab}
        onChange={handleTabChange}
      />

      {activeTab === NOTIFICATION_ADMIN_TABS.TEMPLATES ? (
        <AdminNotificationTemplatesTab />
      ) : activeTab === NOTIFICATION_ADMIN_TABS.USER_NOTIFICATIONS ? (
        <AdminUserNotificationsPage embedded={true} />
      ) : error && templates.length === 0 ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(AppLocales.Admin.Notifications.Errors.LoadRecipients)}
          message={error}
        />
      ) : (
        <FormContainer onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Dispatch Configuration (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-200 pb-3">
                  <div>
                    <h2 className="text-body-m font-bold text-base-content flex items-center gap-2">
                      <iconsLib.bellAlert className="h-4 w-4 text-primary" />
                      Broadcast Setup
                    </h2>
                    <p className="text-caption text-base-content/60 text-xs">
                      Configure template, audience, and transmission channels.
                    </p>
                  </div>
                  {selectedTemplate && (
                    <StatusBadge
                      status={selectedTemplate.category}
                      variant={BadgeVariants.PRIMARY}
                    />
                  )}
                </div>

                {/* Field 1: Template */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="text-caption font-semibold text-base-content/80 flex items-center gap-1.5">
                      <iconsLib.document className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {t(AppLocales.Admin.Notifications.Labels.Event)}
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        checked={includeTransactional}
                        onChange={(e) =>
                          setIncludeTransactional(e.target.checked)
                        }
                        containerClassName="border-0 px-0 py-0 hover:bg-transparent text-xs text-base-content/70 hover:text-base-content gap-1.5"
                        className="checkbox-xs"
                      >
                        <span>
                          {t(
                            AppLocales.Admin.Notifications.Labels
                              .IncludeTransactional,
                          )}
                        </span>
                      </Checkbox>
                      <div
                        className="tooltip tooltip-left flex items-center text-base-content/50 hover:text-base-content transition-colors cursor-help"
                        data-tip={t(
                          AppLocales.Admin.Notifications.Labels
                            .IncludeTransactionalTooltip,
                        )}
                      >
                        <iconsLib.info className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {availableTemplates.length === 0 ? (
                    <div className="p-3 rounded-lg bg-base-200/60 border border-base-300 text-caption text-base-content/70 text-xs">
                      No broadcast templates available. Create or enable
                      &quot;Broadcast&quot; on templates in the Templates tab.
                    </div>
                  ) : (
                    <Dropdown
                      value={values.event}
                      onValueChange={(val) =>
                        updateValue(NOTIFICATION_FIELDS.EVENT, val)
                      }
                      options={templateOptions}
                      placeholder="Select a template..."
                      icon={<iconsLib.bell className="h-4 w-4" />}
                      size={DropdownSizes.SM}
                    />
                  )}
                </div>

                {/* Field 2: Audience (Clean Dropdown selector) */}
                <div className="space-y-2 pt-1 border-t border-base-200">
                  <label className="text-caption font-semibold text-base-content/80 flex items-center gap-1.5">
                    <iconsLib.userGroup className="h-3.5 w-3.5 text-primary" />
                    {t(AppLocales.Admin.Notifications.Labels.Audience)}
                  </label>
                  <Dropdown
                    value={values.audience_type}
                    onValueChange={(val) =>
                      updateValue(
                        NOTIFICATION_FIELDS.AUDIENCE_TYPE,
                        val as NotificationAudienceType,
                      )
                    }
                    options={audienceOptions}
                    icon={<iconsLib.user className="h-4 w-4" />}
                    size={DropdownSizes.SM}
                  />

                  {/* Contextual Target Options */}
                  {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ALL && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-base-200/50 border border-base-300/50 text-caption text-base-content/70 text-xs">
                      <iconsLib.info className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        Will be dispatched to all confirmed users across the
                        platform.
                      </span>
                    </div>
                  )}

                  {values.audience_type ===
                    NOTIFICATION_AUDIENCE_TYPES.ROLES && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-base-content/70 font-medium">
                          Select Target Roles ({selectedRoleIds.length} of{" "}
                          {sortedRoles.length})
                        </span>
                        <div className="flex items-center gap-2 text-xs">
                          <Button
                            type="button"
                            variant={ButtonVariants.TERTIARY}
                            onClick={() =>
                              setValues((v) => ({
                                ...v,
                                role_ids: sortedRoles.map((r) => r.id),
                              }))
                            }
                            className="p-0! min-h-0! text-primary hover:underline font-medium"
                          >
                            All
                          </Button>
                          <span className="opacity-30">•</span>
                          <Button
                            type="button"
                            variant={ButtonVariants.TERTIARY}
                            onClick={() =>
                              setValues((v) => ({ ...v, role_ids: [] }))
                            }
                            className="p-0! min-h-0! text-base-content/60 hover:text-base-content font-medium"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {sortedRoles.map((role) => {
                          const isSelected = selectedRoleIdSet.has(role.id);
                          return (
                            <Button
                              key={role.id}
                              type="button"
                              variant={ButtonVariants.TERTIARY}
                              onClick={() => toggleRole(role.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-s font-medium transition-all ${
                                isSelected
                                  ? "bg-primary! text-primary-content! shadow-sm ring-1 ring-primary"
                                  : "bg-base-200/80 hover:bg-base-200 text-base-content/80 border border-base-300/50"
                              }`}
                            >
                              {isSelected && (
                                <iconsLib.checkr className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span>{role.name}</span>
                            </Button>
                          );
                        })}
                      </div>
                      {selectedRoleIds.length === 0 && (
                        <div className="text-caption text-warning text-xs">
                          Please select at least one role to receive this
                          broadcast.
                        </div>
                      )}
                    </div>
                  )}

                  {values.audience_type ===
                    NOTIFICATION_AUDIENCE_TYPES.USERS && (
                    <div className="space-y-2 pt-1">
                      <div className="relative">
                        <SearchInput
                          value={recipientQuery}
                          placeholder="Search users by name, email, or username..."
                          searchableKeys={[
                            t(AppLocales.Admin.Common.Detail.Name),
                            t(AppLocales.Admin.Common.Detail.Email),
                            t(AppLocales.Admin.Users.Table.Username),
                          ]}
                          onChange={(e) => setRecipientQuery(e.target.value)}
                          onClear={() => setRecipientQuery("")}
                          onFocus={() => setIsRecipientFocused(true)}
                          onBlur={() => {
                            window.setTimeout(
                              () => setIsRecipientFocused(false),
                              200,
                            );
                          }}
                          onKeyDown={handleRecipientKeyDown}
                        />

                        {isRecipientFocused && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-52 overflow-y-auto rounded-lg border border-base-300 bg-base-100 shadow-xl">
                            {isLoading ? (
                              <div className="p-2.5 text-caption text-base-content/60 text-xs">
                                Searching users...
                              </div>
                            ) : recipientSearchError ? (
                              <div className="p-2.5 text-caption text-error text-xs">
                                {recipientSearchError}
                              </div>
                            ) : recipientSuggestions.length > 0 ? (
                              recipientSuggestions.map((user) => (
                                <Button
                                  key={user.id}
                                  type="button"
                                  variant={ButtonVariants.TERTIARY}
                                  className="flex! w-full! items-center! justify-between! gap-2! px-3.5! py-2! text-left! text-body-s hover:bg-primary/10 transition-colors rounded-none!"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    addUser(user.id);
                                  }}
                                >
                                  <div className="min-w-0">
                                    <div className="font-semibold text-base-content truncate text-xs">
                                      {user.name || user.username || "User"}
                                    </div>
                                    <div className="text-caption text-base-content/60 font-mono text-[11px] truncate">
                                      {user.email}
                                    </div>
                                  </div>
                                  <iconsLib.plus className="h-3.5 w-3.5 text-primary shrink-0" />
                                </Button>
                              ))
                            ) : recipientQuery.trim().length >=
                              RECIPIENT_SEARCH_MIN_LENGTH ? (
                              <div className="p-2.5 text-caption text-base-content/60 text-xs">
                                No users matching &quot;{recipientQuery}&quot;
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>

                      {selectedUsers.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {selectedUsers.map((user) => (
                            <span
                              key={user.id}
                              className="inline-flex items-center gap-1.5 rounded-md bg-base-200 px-2 py-0.5 text-xs font-medium text-base-content border border-base-300/50 shadow-sm"
                            >
                              <span className="truncate max-w-37.5">
                                {user.name || user.email || user.username}
                              </span>
                              <Button
                                type="button"
                                variant={ButtonVariants.TERTIARY}
                                onClick={() => removeUser(user.id)}
                                className="p-0! min-h-0! text-base-content/50 hover:text-error"
                                title="Remove"
                              >
                                <iconsLib.close className="h-3 w-3" />
                              </Button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-caption text-warning text-xs">
                          Please search and add at least one recipient user.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Field 3: Delivery Channels (Compact Horizontal Row) */}
                <div className="space-y-2 pt-1 border-t border-base-200">
                  <div className="flex items-center justify-between">
                    <label className="text-caption font-semibold text-base-content/80 flex items-center gap-1.5">
                      <iconsLib.sparkles className="h-3.5 w-3.5 text-primary" />
                      {t(AppLocales.Admin.Notifications.Labels.Delivery)}
                    </label>
                    <span className="text-caption text-base-content/50 text-xs">
                      {availableChannelsCount > 0 ? (
                        `${selectedChannelsCount} of ${availableChannelsCount} active`
                      ) : (
                        <span className="text-warning font-medium">0 active</span>
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {NOTIFICATION_DELIVERY_FIELDS.map(
                      ({ field, channel, label }) => {
                        const isChecked = Boolean(values[field]);
                        const isConfigured = Boolean(configuredChannels[field]);
                        const icon =
                          channel === NOTIFICATION_DELIVERY_CHANNELS.SOCKET ? (
                            <iconsLib.chat className="h-4 w-4" />
                          ) : channel ===
                            NOTIFICATION_DELIVERY_CHANNELS.PUSH ? (
                            <iconsLib.bell className="h-4 w-4" />
                          ) : (
                            <iconsLib.mail className="h-4 w-4" />
                          );
                        const activeColor =
                          channel === NOTIFICATION_DELIVERY_CHANNELS.SOCKET
                            ? "text-primary"
                            : channel === NOTIFICATION_DELIVERY_CHANNELS.PUSH
                              ? "text-warning"
                              : "text-info";

                        return (
                          <div
                            key={field}
                            className={
                              !isConfigured
                                ? "tooltip tooltip-top w-full"
                                : "w-full"
                            }
                            data-tip={
                              !isConfigured
                                ? t(
                                    AppLocales.Admin.Notifications.Labels
                                      .ChannelNotConfigured,
                                  )
                                : undefined
                            }
                          >
                            <Button
                              type="button"
                              variant={ButtonVariants.TERTIARY}
                              disabled={!isConfigured}
                              onClick={() => {
                                if (isConfigured) {
                                  updateValue(field, !isChecked);
                                }
                              }}
                              className={`flex! w-full! items-center! justify-between! px-3! py-2.5! rounded-lg border! text-left transition-all ${
                                !isConfigured
                                  ? "opacity-50 cursor-not-allowed bg-base-200/40 border-base-300 text-base-content/40 hover:bg-base-200/40 pointer-events-auto"
                                  : isChecked
                                    ? "border-primary/50 bg-primary/10 ring-1 ring-primary/40 font-medium text-base-content"
                                    : "border-base-300 bg-base-100 hover:bg-base-200/60 text-base-content/60"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={
                                    !isConfigured
                                      ? "text-base-content/30"
                                      : isChecked
                                        ? activeColor
                                        : "text-base-content/40"
                                  }
                                >
                                  {icon}
                                </span>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-body-s font-medium truncate">
                                    {t(label)}
                                  </span>
                                  {!isConfigured && (
                                    <span className="text-[10px] text-base-content/40 font-normal truncate">
                                      {t(
                                        AppLocales.Admin.Notifications.Labels
                                          .NotConfiguredBadge,
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                  !isConfigured
                                    ? "border border-base-300/60 bg-base-200/30 opacity-40"
                                    : isChecked
                                      ? "bg-primary text-primary-content"
                                      : "border border-base-300 bg-base-200/50"
                                }`}
                              >
                                {isConfigured && isChecked && (
                                  <iconsLib.checkr className="w-2.5 h-2.5" />
                                )}
                              </span>
                            </Button>
                          </div>
                        );
                      },
                    )}
                  </div>

                  {availableChannelsCount === 0 ? (
                    <div className="text-caption text-warning text-xs">
                      {t(
                        AppLocales.Admin.Notifications.Labels
                          .TemplateNoChannels,
                      )}
                    </div>
                  ) : selectedChannelsCount === 0 ? (
                    <div className="text-caption text-error text-xs">
                      {t(
                        AppLocales.Admin.Notifications.Validation
                          .DeliveryChannelRequired,
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right Column: Live Preview & Dispatch Panel (5 cols, sticky) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
              <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-base-200 pb-3">
                  <h3 className="text-body-m font-bold text-base-content flex items-center gap-1.5">
                    <iconsLib.eye className="h-4 w-4 text-primary" />
                    {t(AppLocales.Admin.Notifications.Preview.Title)}
                  </h3>
                  <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                    {values.audience_type.toUpperCase()}
                  </span>
                </div>

                <AdminNotificationPreview
                  template={selectedTemplate}
                  sendSocket={values.send_socket}
                  sendPush={values.send_push}
                  sendEmail={values.send_email}
                />

                {selectedTemplate && (
                  <div className="space-y-3">
                    {/* Broadcast Meta Summary */}
                    <div className="space-y-1.5 text-xs text-base-content/70 bg-base-200/30 rounded-lg p-2.5 border border-base-300/40">
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Event Key:</span>
                        <code className="font-mono text-xs">
                          {selectedTemplate.event}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Category:</span>
                        <span className="font-medium capitalize">
                          {selectedTemplate.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Audience:</span>
                        <span className="font-medium">
                          {values.audience_type ===
                          NOTIFICATION_AUDIENCE_TYPES.ALL
                            ? "All Confirmed Users"
                            : values.audience_type ===
                                NOTIFICATION_AUDIENCE_TYPES.ROLES
                              ? `${selectedRoleIds.length} role(s) selected`
                              : `${selectedUserIds.length} user(s) selected`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base-content/50">Channels:</span>
                        <div className="flex items-center gap-1">
                          {values.send_socket && (
                            <span className="badge badge-xs badge-neutral">
                              In-App
                            </span>
                          )}
                          {values.send_push && (
                            <span className="badge badge-xs badge-warning">
                              Push
                            </span>
                          )}
                          {values.send_email && (
                            <span className="badge badge-xs badge-info">
                              Email
                            </span>
                          )}
                          {selectedChannelsCount === 0 && (
                            <span className="text-error font-medium">None active</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Dispatch Action */}
                <div className="pt-2">
                  <Button
                    type={ButtonTypes.SUBMIT}
                    size={ButtonSizes.MD}
                    isLoading={isLoading}
                    disabled={
                      !canCreateNotifications ||
                      isLoading ||
                      !values.event ||
                      selectedChannelsCount === 0 ||
                      availableChannelsCount === 0 ||
                      (values.audience_type ===
                        NOTIFICATION_AUDIENCE_TYPES.ROLES &&
                        selectedRoleIds.length === 0) ||
                      (values.audience_type ===
                        NOTIFICATION_AUDIENCE_TYPES.USERS &&
                        selectedUserIds.length === 0)
                    }
                    className="w-full font-semibold"
                  >
                    <iconsLib.bell className="mr-2 h-4 w-4" />
                    {isLoading
                      ? t(AppLocales.Admin.Notifications.Actions.Sending)
                      : t(AppLocales.Admin.Notifications.Actions.Send)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  );
};
