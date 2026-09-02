import React, { useMemo, useState } from "react";
import { IAdminRole } from "../../role/types";
import {
  IAdminUser,
  IAdminUserFormValues,
} from "../types";
import {
  AdminPermissionMatrix,
  Checkbox,
  FormActionRow,
  FormContainer,
  IAdminPermissionMatrixItem,
  TextInput,
} from "../../components";
import { ADMIN_ACTIONS, ADMIN_COMMON_LABELS } from "../../constants";

const ADMIN_USER_FORM_LABELS = {
  CREATE_USER: "Create user",
  DISPLAY_NAME: "Display name",
  EMAIL: "Email",
  NO_PERMISSIONS: "No permissions assigned.",
  RELATED_PERMISSIONS: "Related permissions",
  ROLES: "Roles",
  SAVE_CHANGES: "Save changes",
  USERNAME: "Username",
};

export interface IAdminUserFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  user?: IAdminUser;
  roles: IAdminRole[];
  onSubmit: (values: IAdminUserFormValues) => Promise<void>;
  onCancel: () => void;
}

export const AdminUserForm: React.FC<IAdminUserFormProps> = ({
  mode,
  user,
  roles,
  onSubmit,
  onCancel,
}) => {
  const initialRoleIds = useMemo(
    () => user?.role_ids ?? [],
    [user],
  );

  const [username, setUsername] = useState(user?.username ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [selectedRoleIds, setSelectedRoleIds] =
    useState<string[]>(initialRoleIds);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: IAdminUserFormValues = {
      username: username.trim(),
      name: name.trim(),
      email: email.trim(),
      role_ids: selectedRoleIds,
    };

    await onSubmit(payload);
  };

  const selectedRoleIdSet = useMemo(
    () => new Set(selectedRoleIds),
    [selectedRoleIds],
  );
  const selectedRoles = useMemo(
    () => roles.filter((role) => selectedRoleIdSet.has(role.id)),
    [roles, selectedRoleIdSet],
  );
  const selectedRolePermissions = useMemo<IAdminPermissionMatrixItem[]>(
    () => {
      const permissionsByKey = new Map<string, IAdminPermissionMatrixItem>();

      selectedRoles.forEach((role) => {
        Object.entries(role.permissions ?? {}).forEach(([resource, actions]) =>
          (Array.isArray(actions) ? actions : []).forEach((action: string) => {
            const key = `${resource}-${action}`;
            permissionsByKey.set(key, {
              id: key,
              resource,
              action,
            });
          }),
        );
      });

      return [...permissionsByKey.values()];
    },
    [selectedRoles],
  );

  return (
    <FormContainer onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label={ADMIN_USER_FORM_LABELS.USERNAME}
          value={username}
          required
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextInput
          label={ADMIN_USER_FORM_LABELS.DISPLAY_NAME}
          value={name}
          required
          onChange={(event) => setName(event.target.value)}
        />
        <div className="md:col-span-2">
          <TextInput
            label={ADMIN_USER_FORM_LABELS.EMAIL}
            type="email"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <div className="rounded-md border border-base-300 bg-base-100 p-4 md:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-body-m font-semibold text-base-content">
                {ADMIN_USER_FORM_LABELS.ROLES}
              </h2>
              <span className="rounded-md bg-base-200 px-2 py-1 text-caption font-medium text-base-content opacity-70">
                {selectedRoleIds.length}/{roles.length}
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {roles.map((role) => {
                const isSelected = selectedRoleIds.includes(role.id);
                return (
                  <Checkbox
                    key={role.id}
                    checked={isSelected}
                    onChange={() => {
                      const nextIds = isSelected
                        ? selectedRoleIds.filter((id) => id !== role.id)
                        : [...selectedRoleIds, role.id];
                      setSelectedRoleIds(nextIds);
                    }}
                    containerClassName="min-h-10 bg-base-200/40"
                  >
                    <span className="capitalize">{role.name}</span>
                  </Checkbox>
                );
              })}
            </div>

            {selectedRoles.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-base-300 pt-4">
                <h3 className="text-body-s font-semibold text-base-content">
                  {ADMIN_USER_FORM_LABELS.RELATED_PERMISSIONS}
                </h3>
                {selectedRolePermissions.length === 0 ? (
                  <div className="text-body-s text-base-content opacity-60">
                    {ADMIN_USER_FORM_LABELS.NO_PERMISSIONS}
                  </div>
                ) : (
                  <AdminPermissionMatrix permissions={selectedRolePermissions} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <FormActionRow
        cancelLabel={ADMIN_COMMON_LABELS.CANCEL}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? ADMIN_USER_FORM_LABELS.CREATE_USER
            : ADMIN_USER_FORM_LABELS.SAVE_CHANGES
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
