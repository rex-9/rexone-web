import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { useTranslate } from "../../../../locales";
import RoleController from "../../roles/role.controller";
import { IAdminRole } from "../../roles/types";
import { IAdminUser } from "../../users/types";
import NotificationController from "../notification.controller";
import {
  IAdminNotificationFormValues,
  IAdminNotificationTemplate,
} from "../types";
import {
  NOTIFICATION_AUDIENCE_TYPES,
  NOTIFICATION_DELIVERY_FIELDS,
  NOTIFICATION_EVENT_CATEGORIES,
  NOTIFICATION_FIELDS,
  NOTIFICATION_KEYBOARD_KEYS,
  NOTIFICATION_LOCALES,
} from "../constants";
import { ADMIN_ACTIONS, ADMIN_COMMON_LABELS, ADMIN_RESOURCES } from "../../constants";
import { ADMIN_NOTIFICATION_PAGE_TITLES } from "../constants";
import {
  AlertDialog,
  AdminState,
  FormActionRow,
  FormContainer,
  Button,
  Radio,
} from "../../components";
import { iconsLib } from '../../../../assets';

const initialValues: IAdminNotificationFormValues = {
  event: "",
  audience_type: NOTIFICATION_AUDIENCE_TYPES.USERS,
  user_ids: [],
  role_ids: [],
  send_push: true,
  send_socket: true,
  send_email: false,
};

const channelCheckboxClassName =
  "checkbox checkbox-sm border-base-content/40 checked:border-primary checked:bg-primary";

const getUserLabel = (user: IAdminUser) =>
  user.email || user.name || user.username || user.id;

const matchesUserQuery = (user: IAdminUser, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [user.email, user.name, user.username, user.id]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedQuery));
};

export const AdminNotificationsPage: React.FC = () => {
  useDocumentTitle(ADMIN_NOTIFICATION_PAGE_TITLES.LIST);

  const navigate = useNavigate();
  const t = useTranslate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const canReadRoles = can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.ROLES);
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [templates, setTemplates] = useState<IAdminNotificationTemplate[]>([]);
  const [values, setValues] =
    useState<IAdminNotificationFormValues>(initialValues);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [isRecipientFocused, setIsRecipientFocused] = useState(false);
  const {setLoading } = useLoading();
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (permissionsLoading) return;

    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      const recipientRequests = [
        NotificationController.getTemplates(
          (nextTemplates) => setTemplates(nextTemplates),
          (message) => setError(message),
        ),
        NotificationController.getRecipients(
          (nextUsers) => setUsers(nextUsers),
          (message) => setError(message),
        ),
      ];

      if (canReadRoles) {
        recipientRequests.push(
          RoleController.getRoles(
            (nextRoles) => setRoles(nextRoles),
            (message) => setError(message),
          ),
        );
      }

      void Promise.all(recipientRequests).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [canReadRoles, permissionsLoading, setLoading]);

  const sortedRoles = useMemo(
    () =>
      [...roles].sort((left, right) => left.name.localeCompare(right.name)),
    [roles],
  );
  const sortedUsers = useMemo(
    () =>
      [...users].sort((left, right) =>
        (left.email || left.username || "").localeCompare(
          right.email || right.username || "",
        ),
      ),
    [users],
  );
  const roleIds = useMemo(() => sortedRoles.map((role) => role.id), [sortedRoles]);
  const userIds = useMemo(() => sortedUsers.map((user) => user.id), [sortedUsers]);
  const selectedRoleIds = useMemo(() => values.role_ids, [values.role_ids]);
  const selectedUserIds = useMemo(() => values.user_ids, [values.user_ids]);
  const selectedRoleIdSet = useMemo(
    () => new Set(selectedRoleIds),
    [selectedRoleIds],
  );
  const selectedUserIdSet = useMemo(
    () => new Set(selectedUserIds),
    [selectedUserIds],
  );
  const selectedUsers = useMemo(
    () => sortedUsers.filter((user) => selectedUserIdSet.has(user.id)),
    [selectedUserIdSet, sortedUsers],
  );
  const availableUsers = useMemo(
    () => sortedUsers.filter((user) => !selectedUserIdSet.has(user.id)),
    [selectedUserIdSet, sortedUsers],
  );
  const recipientSuggestions = useMemo(
    () =>
      availableUsers
        .filter((user) => matchesUserQuery(user, recipientQuery))
        .slice(0, 8),
    [availableUsers, recipientQuery],
  );
  const areAllUsersSelected =
    userIds.length > 0 && selectedUserIds.length === userIds.length;
  const areAllRolesSelected =
    roleIds.length > 0 && selectedRoleIds.length === roleIds.length;

  const selectedChannels = [
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
      const roleIds = current.role_ids.includes(roleId)
        ? current.role_ids.filter((id) => id !== roleId)
        : [...current.role_ids, roleId];

      return { ...current, role_ids: roleIds };
    });
  };

  const addUser = (userId: string) => {
    setValues((current) => {
      if (current.user_ids.includes(userId)) {
        return current;
      }

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

  const toggleAllUsers = () => {
    updateValue(NOTIFICATION_FIELDS.USER_IDS, areAllUsersSelected ? [] : userIds);
    setRecipientQuery("");
  };

  const toggleAllRoles = () => {
    updateValue(NOTIFICATION_FIELDS.ROLE_IDS, areAllRolesSelected ? [] : roleIds);
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

    if (selectedChannels === 0) {
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

    setLoading(true, { overlay: false });

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
        setLoading(false, { overlay: false });
        toast.success(message);
        setValues(initialValues);
      },
      (message) => {
        setAlertMessage(message);
        setLoading(false, { overlay: false });
      },
    );
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && users.length === 0 && roles.length === 0 ? (
        <AdminState title={t(NOTIFICATION_LOCALES.Errors.LoadRecipients)} message={error} />
      ) : (
        <>
          <FormContainer onSubmit={handleSubmit}>
              <div className="grid gap-16 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
                    <h2 className="text-body-m font-semibold text-base-content">
                      {t(NOTIFICATION_LOCALES.Labels.Event)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {templates.map((template) => {
                      const isSelected = values.event === template.event;
                      const categoryClass = isSelected
                        ? "border-primary bg-primary text-primary-content shadow-sm"
                        : template.admin_available
                          ? "border-primary/40 bg-primary/5 text-base-content hover:border-primary hover:bg-primary/10"
                        : template.category === NOTIFICATION_EVENT_CATEGORIES.PAYMENT
                          ? "border-warning/50 bg-warning/10 text-warning-content"
                          : "border-base-300 bg-base-200/70 text-base-content/60";

                      return (
                        <button
                          key={template.event}
                          type="button"
                          disabled={!template.admin_available}
                          aria-pressed={isSelected}
                          title={template.unavailable_reason || template.label}
                          className={`inline-flex min-h-[36px] items-center gap-4 rounded-full border px-7 py-3 text-left transition ${categoryClass} disabled:cursor-not-allowed disabled:opacity-70`}
                          onClick={() =>
                            updateValue(NOTIFICATION_FIELDS.EVENT, template.event)
                          }
                        >
                          {isSelected && <iconsLib.checkr className="h-[13px] w-[13px] shrink-0" />}
                          <span className="text-caption font-semibold">
                            {template.label}
                          </span>
                          <span className={`text-[10px] capitalize ${isSelected ? "text-primary-content/75" : "opacity-60"}`}>
                            {template.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-md border border-base-300 bg-base-100 p-12">
                    <div className="mb-10 flex items-center justify-between gap-8">
                      <h2 className="text-body-m font-semibold text-base-content">
                        {t(NOTIFICATION_LOCALES.Labels.Audience)}
                      </h2>
                      <div className="flex items-center gap-8">
                        <span className="rounded-md bg-base-200 px-8 py-3 text-caption font-medium text-base-content opacity-70">
                          {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS
                            ? `${selectedUserIds.length}/${sortedUsers.length}`
                            : values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES
                              ? `${selectedRoleIds.length}/${sortedRoles.length}`
                              : t(NOTIFICATION_LOCALES.Labels.All)}
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-[30px] w-[30px] p-0"
                          aria-label={
                            values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS
                              ? areAllUsersSelected
                                ? t(NOTIFICATION_LOCALES.Actions.ClearAllUsers)
                                : t(NOTIFICATION_LOCALES.Actions.SelectAllUsers)
                              : areAllRolesSelected
                                ? t(NOTIFICATION_LOCALES.Actions.ClearAllRoles)
                                : t(NOTIFICATION_LOCALES.Actions.SelectAllRoles)
                          }
                          title={
                            values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS
                              ? areAllUsersSelected
                                ? t(NOTIFICATION_LOCALES.Actions.ClearAllUsers)
                                : t(NOTIFICATION_LOCALES.Actions.SelectAllUsers)
                              : areAllRolesSelected
                                ? t(NOTIFICATION_LOCALES.Actions.ClearAllRoles)
                                : t(NOTIFICATION_LOCALES.Actions.SelectAllRoles)
                          }
                          onClick={
                            values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS
                              ? toggleAllUsers
                              : toggleAllRoles
                          }
                          disabled={values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ALL}
                        >
                          <iconsLib.checkr className="h-[14px] w-[14px]" />
                        </Button>
                      </div>
                    </div>

                    <div
                      className={`mb-10 grid gap-8 ${
                        canReadRoles ? "sm:grid-cols-3" : "sm:grid-cols-2"
                      }`}
                    >
                      <Radio
                          name={NOTIFICATION_FIELDS.AUDIENCE_TYPE}
                          checked={values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS}
                          onChange={() =>
                            updateValue(
                              NOTIFICATION_FIELDS.AUDIENCE_TYPE,
                              NOTIFICATION_AUDIENCE_TYPES.USERS,
                            )
                          }
                          containerClassName="min-h-[42px] px-10"
                        >
                          {t(NOTIFICATION_LOCALES.Labels.SelectedUsers)}
                      </Radio>
                      {canReadRoles && (
                        <Radio
                            name={NOTIFICATION_FIELDS.AUDIENCE_TYPE}
                            checked={values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES}
                            onChange={() =>
                              updateValue(
                                NOTIFICATION_FIELDS.AUDIENCE_TYPE,
                                NOTIFICATION_AUDIENCE_TYPES.ROLES,
                              )
                            }
                            containerClassName="min-h-[42px] px-10"
                          >
                            {t(NOTIFICATION_LOCALES.Labels.SelectedRoles)}
                        </Radio>
                      )}
                      <Radio
                          name={NOTIFICATION_FIELDS.AUDIENCE_TYPE}
                          checked={values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ALL}
                          onChange={() =>
                            updateValue(
                              NOTIFICATION_FIELDS.AUDIENCE_TYPE,
                              NOTIFICATION_AUDIENCE_TYPES.ALL,
                            )
                          }
                          containerClassName="min-h-[42px] px-10"
                        >
                          {t(NOTIFICATION_LOCALES.Labels.AllUsers)}
                      </Radio>
                    </div>

                    {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.USERS && (
                      <div className="relative">
                        <div className="flex min-h-[34px] flex-wrap items-center gap-5 rounded-md border border-base-300 bg-base-100 px-7 py-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                          {selectedUsers.map((user) => (
                            <span
                              key={user.id}
                              className="inline-flex max-w-full items-center gap-4 rounded-md bg-base-200 px-6 py-2 text-body-s font-medium text-base-content"
                            >
                              <span className="max-w-[180px] truncate">
                                {getUserLabel(user)}
                              </span>
                              <button
                                type="button"
                                className="rounded-full p-1 text-base-content opacity-70 transition hover:bg-base-300 hover:opacity-100"
                                aria-label={t(NOTIFICATION_LOCALES.Actions.RemoveRecipient, {
                                  recipient: getUserLabel(user),
                                })}
                                onClick={() => removeUser(user.id)}
                              >
                                <iconsLib.xmark className="h-[12px] w-[12px]" />
                              </button>
                            </span>
                          ))}

                          <input
                            type="text"
                            value={recipientQuery}
                            className="min-w-[180px] flex-1 border-0 bg-transparent px-1 py-1 text-body-s text-base-content outline-none placeholder:text-base-content/40"
                            placeholder={
                              selectedUsers.length === 0
                                ? t(NOTIFICATION_LOCALES.Labels.Recipients)
                                : ""
                            }
                            onChange={(event) =>
                              setRecipientQuery(event.target.value)
                            }
                            onFocus={() => setIsRecipientFocused(true)}
                            onBlur={() => {
                              window.setTimeout(() => {
                                setIsRecipientFocused(false);
                              }, 120);
                            }}
                            onKeyDown={handleRecipientKeyDown}
                          />
                        </div>

                        {isRecipientFocused &&
                          recipientSuggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-lg">
                              {recipientSuggestions.map((user) => (
                                <button
                                  key={user.id}
                                  type="button"
                                  className="flex w-full items-center justify-between gap-10 px-10 py-8 text-left text-body-s transition hover:bg-primary/10"
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    addUser(user.id);
                                  }}
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate font-semibold text-base-content">
                                      {getUserLabel(user)}
                                    </span>
                                    <span className="block truncate text-caption text-base-content/60">
                                      {user.username || user.id}
                                    </span>
                                  </span>
                                  <iconsLib.checkr className="h-[14px] w-[14px] shrink-0 text-primary" />
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {values.audience_type === NOTIFICATION_AUDIENCE_TYPES.ROLES && (
                      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedRoles.map((role) => (
                          <label
                            key={role.id}
                            className="flex min-h-[42px] items-center gap-8 rounded-md border border-base-300 px-10 text-body-s font-medium text-base-content"
                          >
                            <input
                              type="checkbox"
                              className={channelCheckboxClassName}
                              checked={selectedRoleIdSet.has(role.id)}
                              onChange={() => toggleRole(role.id)}
                            />
                            <span className="min-w-0 truncate">{role.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-md border border-base-300 bg-base-100 p-12">
                    <div className="mb-10 flex items-center justify-between gap-8">
                      <h2 className="text-body-m font-semibold text-base-content">
                        {t(NOTIFICATION_LOCALES.Labels.Delivery)}
                      </h2>
                      <span className="rounded-md bg-base-200 px-8 py-3 text-caption font-medium text-base-content opacity-70">
                        {selectedChannels}/{NOTIFICATION_DELIVERY_FIELDS.length}
                      </span>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3">
                      {NOTIFICATION_DELIVERY_FIELDS.map(({ field, label }) => (
                        <label
                          key={field}
                          className="flex min-h-[42px] items-center gap-8 rounded-md border border-base-300 px-10 text-body-s font-medium text-base-content"
                        >
                          <input
                            type="checkbox"
                            className={channelCheckboxClassName}
                            checked={values[field]}
                            onChange={(event) =>
                              updateValue(field, event.target.checked)
                            }
                          />
                          <span>{t(label)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <FormActionRow
                cancelLabel={ADMIN_COMMON_LABELS.CANCEL}
                submitLabel={t(NOTIFICATION_LOCALES.Actions.Send)}
                onCancel={() => {
                  navigate(AppRoutes.client.protected.admin.USERS);
                }}
              />
            </FormContainer>
        </>
      )}
    </>
  );
};
