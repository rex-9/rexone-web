// src/modules/admin/notifications/pages/AdminNotificationsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { useTranslate } from "../../../../locales";
import type { IUser } from "../../../../models";
import UserController from "../../users/user.controller";
import RoleController from "../../roles/role.controller";
import type { IAdminRole } from "../../roles/types";
import NotificationController from "../notification.controller";
import type {
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
} from "../types";
import {
  NOTIFICATION_AUDIENCE_TYPES,
  NOTIFICATION_DELIVERY_FIELDS,
  NOTIFICATION_FIELDS,
  NOTIFICATION_KEYBOARD_KEYS,
  NOTIFICATION_LOCALES,
} from "../constants";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import { ADMIN_NOTIFICATION_PAGE_TITLES } from "../constants";
import { AlertDialog, AdminState, Button, PageHeader, Tabs } from "../../components";
import { Badge, FormContainer, SearchInput } from "../../../../design/components";
import { iconsLib } from "../../../../assets";

const initialValues: IAdminNotificationFormValues = {
  event: "",
  audience_type: NOTIFICATION_AUDIENCE_TYPES.USERS,
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
  useDocumentTitle(ADMIN_NOTIFICATION_PAGE_TITLES.LIST);

  const t = useTranslate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const canReadRoles = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROLES);
  const canReadUsers = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.USERS);
  const canCreateNotifications = can(
    ADMIN_ACTIONS.CREATE,
    ADMIN_RESOURCES.NOTIFICATIONS,
  );

  const [users, setUsers] = useState<IUser[]>([]);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [templates, setTemplates] = useState<IAdminNotificationTemplate[]>([]);
  const [values, setValues] =
    useState<IAdminNotificationFormValues>(initialValues);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [isRecipientFocused, setIsRecipientFocused] = useState(false);
  const [recipientSearchError, setRecipientSearchError] = useState("");
  const { isLoading, setLoading } = useLoading();
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (permissionsLoading) return;

    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      const requests = [
        NotificationController.getTemplates(
          (nextTemplates) => {
            setTemplates(nextTemplates);
            // Default select the first admin available template
            const firstAvailable = nextTemplates.find((t) => t.admin_available);
            if (firstAvailable) {
              setValues((v) => ({ ...v, event: firstAvailable.event }));
            }
          },
          (message) => setError(message),
        ),
      ];

      if (canReadRoles) {
        requests.push(
          RoleController.getRoles(
            (nextRoles) => setRoles(nextRoles),
            (message) => setError(message),
          ),
        );
      }

      void Promise.all(requests).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [canReadRoles, permissionsLoading, setLoading]);

  const searchRecipients = useCallback(
    async (search: string) => {
      if (!canReadUsers) {
        setRecipientSearchError(t(NOTIFICATION_LOCALES.Errors.SearchUsers));
        return;
      }

      setLoading(true, { overlay: false });

      await UserController.getUsers(
        { search, limit: RECIPIENT_SEARCH_LIMIT },
        (nextUsers) => {
          setUsers((currentUsers) => mergeUsersById(currentUsers, nextUsers));
          setRecipientSearchError("");
          setLoading(false);
        },
        (message) => {
          setRecipientSearchError(message);
          setLoading(false);
        },
      );
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

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.event === values.event),
    [templates, values.event],
  );

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
      setAlertMessage(t(NOTIFICATION_LOCALES.Validation.EventRequired));
      return;
    }

    if (selectedChannelsCount === 0) {
      setAlertMessage(
        t(NOTIFICATION_LOCALES.Validation.DeliveryChannelRequired),
      );
      return;
    }

    if (
      values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS &&
      selectedUserIds.length === 0
    ) {
      setAlertMessage(t(NOTIFICATION_LOCALES.Validation.UserRequired));
      return;
    }

    if (
      values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES &&
      selectedRoleIds.length === 0
    ) {
      setAlertMessage(t(NOTIFICATION_LOCALES.Validation.RoleRequired));
      return;
    }

    setLoading(true);

    await NotificationController.createNotification(
      {
        ...values,
        user_ids:
          values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS
            ? values.user_ids
            : [],
        role_ids:
          values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES
            ? values.role_ids
            : [],
      },
      (_, message) => {
        setLoading(false);
        toast.success(message || "Notification dispatched successfully! 🚀");
        setValues(initialValues);
      },
      (message) => {
        setLoading(false);
        setAlertMessage(message);
      },
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <PageHeader
        title="Notification Dispatch"
        description="Broadcast system announcements, alerts, and updates across in-app WebSockets, push notifications, and email."
      />

      {error && templates.length === 0 ? (
        <AdminState
          icon={iconsLib.warning}
          title={t(NOTIFICATION_LOCALES.Errors.LoadRecipients)}
          message={error}
        />
      ) : (
        <FormContainer onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Event & Template Selection */}
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-body-l font-bold text-base-content flex items-center gap-2">
                  <iconsLib.bellAlert className="h-5 w-5 text-primary" />
                  1. Select Notification Event
                </h2>
                <p className="text-caption text-base-content opacity-60">
                  Select the template and purpose for this notification.
                </p>
              </div>
              {selectedTemplate && (
                <Badge variant="primary">
                  {selectedTemplate.category.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {templates.map((template) => {
                const isSelected = values.event === template.event;
                return (
                  <button
                    key={template.event}
                    type="button"
                    disabled={!template.admin_available}
                    onClick={() =>
                      updateValue(NOTIFICATION_FIELDS.EVENT, template.event)
                    }
                    className={`flex flex-col text-left p-3.5 rounded-lg border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                        : template.admin_available
                          ? "border-base-300 bg-base-100 hover:border-primary/50 hover:bg-base-200/50"
                          : "border-base-300/40 bg-base-200/40 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-body-m text-base-content">
                        {template.label}
                      </span>
                      {isSelected && (
                        <iconsLib.checkr className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <span className="text-caption text-base-content opacity-60 line-clamp-1">
                      {template.event}
                    </span>
                    {!template.admin_available &&
                      template.unavailable_reason && (
                        <span className="text-xs text-warning pt-1">
                          {template.unavailable_reason}
                        </span>
                      )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Target Audience */}
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-body-l font-bold text-base-content flex items-center gap-2">
                  <iconsLib.userGroup className="h-5 w-5 text-primary" />
                  2. Target Audience
                </h2>
                <p className="text-caption text-base-content opacity-60">
                  Choose which users will receive this broadcast.
                </p>
              </div>
            </div>

            {/* Audience Segmented Control */}
            <Tabs
              value={values.audience_type}
              onChange={(val) =>
                updateValue(NOTIFICATION_FIELDS.AUDIENCE_TYPE, val)
              }
              items={[
                {
                  value: NOTIFICATION_AUDIENCE_TYPES.USERS,
                  label: "Specific Users",
                  icon: iconsLib.user,
                },
                ...(canReadRoles
                  ? [
                      {
                        value: NOTIFICATION_AUDIENCE_TYPES.ROLES,
                        label: "By IAM Role",
                        icon: iconsLib.key,
                      },
                    ]
                  : []),
                {
                  value: NOTIFICATION_AUDIENCE_TYPES.ALL,
                  label: "All Active Users",
                  icon: iconsLib.userGroup,
                },
              ]}
            />

            {/* Specific Users Picker */}
            {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS && (
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <SearchInput
                    value={recipientQuery}
                    placeholder="Search by email, name, or username to add recipients..."
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

                  {/* Autocomplete Dropdown */}
                  {isRecipientFocused && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-20 max-h-60 overflow-y-auto rounded-lg border border-base-300 bg-base-100 shadow-xl">
                      {isLoading ? (
                        <div className="p-3 text-caption text-base-content opacity-60">
                          Searching users...
                        </div>
                      ) : recipientSearchError ? (
                        <div className="p-3 text-caption text-error">
                          {recipientSearchError}
                        </div>
                      ) : recipientSuggestions.length > 0 ? (
                        recipientSuggestions.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-body-s hover:bg-primary/10 transition-colors"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              addUser(user.id);
                            }}
                          >
                            <div>
                              <div className="font-semibold text-base-content">
                                {user.name || user.username || "User"}
                              </div>
                              <div className="text-caption text-base-content opacity-60 font-mono text-xs">
                                {user.email}
                              </div>
                            </div>
                            <iconsLib.plus className="h-4 w-4 text-primary shrink-0" />
                          </button>
                        ))
                      ) : recipientQuery.trim().length >=
                        RECIPIENT_SEARCH_MIN_LENGTH ? (
                        <div className="p-3 text-caption text-base-content opacity-60">
                          No users matching "{recipientQuery}"
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Selected Users Badges */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-caption font-semibold text-base-content opacity-75 mr-1">
                      Recipients ({selectedUsers.length}):
                    </span>
                    {selectedUsers.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center gap-1.5 rounded-md bg-base-200 px-2.5 py-1 text-body-s font-medium text-base-content shadow-sm"
                      >
                        <span>{user.name || user.email || user.username}</span>
                        <button
                          type="button"
                          onClick={() => removeUser(user.id)}
                          className="rounded-full p-0.5 text-base-content opacity-60 hover:opacity-100 hover:bg-base-300 transition-colors"
                          title="Remove"
                        >
                          <iconsLib.close className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Role Checkboxes */}
            {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES && (
              <div className="space-y-2 pt-2">
                <label className="text-caption font-semibold text-base-content opacity-75">
                  Select Roles ({selectedRoleIds.length} of {sortedRoles.length}{" "}
                  selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {sortedRoles.map((role) => {
                    const isSelected = selectedRoleIdSet.has(role.id);
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary font-semibold text-base-content"
                            : "border-base-300 bg-base-100 hover:bg-base-200 text-base-content"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-body-m font-semibold truncate">
                            {role.name}
                          </div>
                          {role.description && (
                            <div className="text-caption opacity-60 truncate text-xs">
                              {role.description}
                            </div>
                          )}
                        </div>
                        {isSelected ? (
                          <iconsLib.checkr className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded border border-base-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Delivery Channels */}
          <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-3">
            <div>
              <h2 className="text-body-l font-bold text-base-content flex items-center gap-2">
                <iconsLib.sparkles className="h-5 w-5 text-primary" />
                3. Delivery Channels
              </h2>
              <p className="text-caption text-base-content opacity-60">
                Select one or more delivery channels for transmission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {NOTIFICATION_DELIVERY_FIELDS.map(({ field, label }) => {
                const isChecked = Boolean(values[field]);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => updateValue(field, !isChecked)}
                    className={`flex items-center justify-between p-4 rounded-lg border text-left transition-all ${
                      isChecked
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-base-300 bg-base-100 hover:bg-base-200"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-body-m text-base-content">
                        {t(label)}
                      </div>
                      <div className="text-caption text-base-content opacity-60 text-xs">
                        {field === "send_socket"
                          ? "Real-time ActionCable banner"
                          : field === "send_push"
                            ? "Mobile & Web push alert"
                            : "Transactional email dispatch"}
                      </div>
                    </div>
                    {isChecked ? (
                      <iconsLib.checkr className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded border border-base-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              disabled={
                !canCreateNotifications || isLoading || !values.event
              }
              className="px-8"
            >
              <iconsLib.bell className="mr-2 h-5 w-5" />
              Dispatch Notification
            </Button>
          </div>
        </FormContainer>
      )}
    </div>
  );
};
