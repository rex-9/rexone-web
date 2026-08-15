import React, { useEffect, useMemo, useState } from "react";
import {
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  Admin,
  IAdminNotificationFormValues,
  IAdminUser,
} from "../../../../modules/admin";
import {
  AdminFormShell,
  AdminFormAlert,
  AdminLayout,
  AdminLoadingState,
  AdminState,
  FormActionRow,
  TextArea,
  TextInput,
  Button,
} from "../../../components";

const initialValues: IAdminNotificationFormValues = {
  user_ids: [],
  title: "",
  message: "",
  send_push: true,
  send_socket: true,
  send_email: false,
};

const channelCheckboxClassName =
  "checkbox checkbox-sm border-base-content/40 checked:border-gold-500 checked:bg-gold-500";

const deliveryChannels = [
  { field: "send_push", label: "Push" },
  { field: "send_socket", label: "In app" },
  { field: "send_email", label: "Email" },
] as const;

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
  useDocumentTitle("Notifications");

  const navigate = useNavigate();
  const toast = useToast();
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [values, setValues] =
    useState<IAdminNotificationFormValues>(initialValues);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [isRecipientFocused, setIsRecipientFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void Admin.NotificationController.getRecipients(
        (nextUsers) => {
          setUsers(nextUsers);
          setIsLoading(false);
        },
        (message) => {
          setError(message);
          setIsLoading(false);
        },
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const sortedUsers = useMemo(
    () =>
      [...users].sort((left, right) =>
        (left.email || left.username || "").localeCompare(
          right.email || right.username || "",
        ),
      ),
    [users],
  );
  const userIds = useMemo(() => sortedUsers.map((user) => user.id), [sortedUsers]);
  const selectedUserIds = useMemo(() => values.user_ids, [values.user_ids]);
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
    updateValue("user_ids", areAllUsersSelected ? [] : userIds);
    setRecipientQuery("");
  };

  const handleRecipientKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      recipientSuggestions.length > 0
    ) {
      event.preventDefault();
      addUser(recipientSuggestions[0].id);
      return;
    }

    if (
      event.key === "Backspace" &&
      recipientQuery.length === 0 &&
      selectedUserIds.length > 0
    ) {
      removeUser(selectedUserIds[selectedUserIds.length - 1]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedChannels === 0) {
      setError("Select at least one delivery channel.");
      return;
    }

    if (selectedUserIds.length === 0) {
      setError("Select at least one user.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    await Admin.NotificationController.createNotification(
      {
        ...values,
        title: values.title.trim(),
        message: values.message.trim(),
      },
      () => {
        toast.success(
          selectedUserIds.length === 1
            ? "Notification sent"
            : "Notifications sent",
        );
        setValues(initialValues);
        setIsSubmitting(false);
      },
      (message) => {
        setError(message);
        setIsSubmitting(false);
      },
    );
  };

  return (
    <AdminLayout title="Notifications">
      {isLoading ? (
        <AdminLoadingState />
      ) : error && users.length === 0 ? (
        <AdminState title="Unable to load users" message={error} />
      ) : (
        <>
          <AdminFormShell>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-16 md:grid-cols-2">
                {error && (
                  <div className="md:col-span-2">
                    <AdminFormAlert message={error} />
                  </div>
                )}

                <TextInput
                  label="Title"
                  value={values.title}
                  required
                  onChange={(event) => updateValue("title", event.target.value)}
                />

                <div className="md:col-span-2">
                  <div className="rounded-md border border-base-300 bg-base-100 p-12">
                    <div className="mb-10 flex items-center justify-between gap-8">
                      <h2 className="text-body-m font-semibold text-base-content">
                        Recipients
                      </h2>
                      <div className="flex items-center gap-8">
                        <span className="rounded-md bg-base-200 px-8 py-3 text-caption font-medium text-base-content opacity-70">
                          {selectedUserIds.length}/{sortedUsers.length}
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-[30px] w-[30px] p-0"
                          aria-label={
                            areAllUsersSelected
                              ? "Clear all users"
                              : "Select all users"
                          }
                          title={
                            areAllUsersSelected
                              ? "Clear all users"
                              : "Select all users"
                          }
                          onClick={toggleAllUsers}
                        >
                          {areAllUsersSelected ? (
                            <XMarkIcon className="h-[14px] w-[14px]" />
                          ) : (
                            <CheckIcon className="h-[14px] w-[14px]" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex min-h-[34px] flex-wrap items-center gap-5 rounded-md border border-base-300 bg-base-100 px-7 py-4 focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/20">
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
                              aria-label={`Remove ${getUserLabel(user)}`}
                              onClick={() => removeUser(user.id)}
                            >
                              <XMarkIcon className="h-[12px] w-[12px]" />
                            </button>
                          </span>
                        ))}

                        <input
                          type="text"
                          value={recipientQuery}
                          className="min-w-[180px] flex-1 border-0 bg-transparent px-1 py-1 text-body-s text-base-content outline-none placeholder:text-base-content/40"
                          placeholder={
                            selectedUsers.length === 0 ? "Recipients" : ""
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

                      {isRecipientFocused && recipientSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-lg">
                          {recipientSuggestions.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              className="flex w-full items-center justify-between gap-10 px-10 py-8 text-left text-body-s transition hover:bg-gold-500/10"
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
                              <CheckIcon className="h-[14px] w-[14px] shrink-0 text-gold-500" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <TextArea
                    label="Message"
                    value={values.message}
                    required
                    rows={4}
                    onChange={(event) =>
                      updateValue("message", event.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-md border border-base-300 bg-base-100 p-12">
                    <div className="mb-10 flex items-center justify-between gap-8">
                      <h2 className="text-body-m font-semibold text-base-content">
                        Delivery
                      </h2>
                      <span className="rounded-md bg-base-200 px-8 py-3 text-caption font-medium text-base-content opacity-70">
                        {selectedChannels}/3
                      </span>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3">
                      {deliveryChannels.map(({ field, label }) => (
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
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <FormActionRow
                submitLabel="Send notification"
                isSubmitting={isSubmitting}
                onCancel={() => {
                  navigate(AppRoutes.client.protected.ADMIN_USERS);
                }}
              />
            </form>
          </AdminFormShell>
        </>
      )}
    </AdminLayout>
  );
};
