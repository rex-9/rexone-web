import React, { useState } from "react";
import {
  IAdminPermission,
  IAdminRole,
  IAdminUser,
  IAdminUserFormValues,
} from "../../../models";
import { AdminFormShell, FormActionRow, TextInput } from "../../components";

interface AdminUserFormProps {
  mode: "create" | "edit";
  user?: IAdminUser | null;
  roles: IAdminRole[];
  permissions: IAdminPermission[];
  isSubmitting: boolean;
  onSubmit: (values: IAdminUserFormValues) => void;
  onCancel: () => void;
}

const initialValues: IAdminUserFormValues = {
  username: "",
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role_ids: [],
  permission_ids: [],
};

const buildInitialValues = (
  user?: IAdminUser | null,
): IAdminUserFormValues => {
  if (!user) return initialValues;

  return {
    username: user.username || "",
    name: user.name || "",
    email: user.email || "",
    role_ids: user.role_ids || [],
    permission_ids: user.permission_ids || [],
    password: "",
    password_confirmation: "",
  };
};

const formatResourceLabel = (resource: string): string =>
  resource.replace(/_/g, " ").toUpperCase();

const formatPermissionLabel = (permission: IAdminPermission): string =>
  permission.name || permission.action.replace(/_/g, " ");

const permissionCheckboxClassName =
  "checkbox checkbox-xs border-base-content/40 checked:border-gold-500 checked:bg-gold-500";

export const AdminUserForm: React.FC<AdminUserFormProps> = ({
  mode,
  user,
  roles,
  permissions,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<IAdminUserFormValues>(() =>
    buildInitialValues(user),
  );

  const updateValue = (
    field: keyof IAdminUserFormValues,
    value: string,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const togglePermission = (permissionId: string) => {
    setValues((current) => {
      const permissionIds = current.permission_ids || [];
      const nextPermissionIds = permissionIds.includes(permissionId)
        ? permissionIds.filter((id) => id !== permissionId)
        : [...permissionIds, permissionId];

      return { ...current, permission_ids: nextPermissionIds };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: IAdminUserFormValues = {
      username: values.username.trim(),
      name: values.name.trim(),
      email: values.email.trim(),
      permission_ids: values.permission_ids || [],
    };

    if (values.password) {
      payload.password = values.password;
      payload.password_confirmation = values.password_confirmation;
    }

    onSubmit(payload);
  };

  const selectedPermissionIds = values.permission_ids || [];
  const selectedPermissionIdSet = new Set(selectedPermissionIds);
  const allPermissionIds = permissions.map((permission) => permission.id);
  const hasAllPermissions =
    allPermissionIds.length > 0 &&
    allPermissionIds.every((permissionId) =>
      selectedPermissionIdSet.has(permissionId),
    );

  const toggleAllPermissions = () => {
    setValues((current) => ({
      ...current,
      permission_ids: hasAllPermissions ? [] : allPermissionIds,
    }));
  };

  const applyRolePreset = (roleId: string) => {
    const role = roles.find((nextRole) => nextRole.id === roleId);
    if (!role) return;

    const rolePermissionIds = role.permission_ids || [];
    if (rolePermissionIds.length === 0) return;

    setValues((current) => {
      const currentPermissionIds = current.permission_ids || [];
      return {
        ...current,
        permission_ids: Array.from(
          new Set([...currentPermissionIds, ...rolePermissionIds]),
        ),
      };
    });
  };

  const groupedPermissions = permissions.reduce<
    Record<string, IAdminPermission[]>
  >((groups, permission) => {
    const nextGroup = groups[permission.resource] || [];
    return {
      ...groups,
      [permission.resource]: [...nextGroup, permission],
    };
  }, {});

  const rolePresets = roles.filter(
    (role) => role.name !== "super_admin" && (role.permission_ids || []).length,
  );
  const sortedPermissionGroups = Object.entries(groupedPermissions).sort(
    ([left], [right]) => left.localeCompare(right),
  );
  const sortPermissionsByName = (
    left: IAdminPermission,
    right: IAdminPermission,
  ) => formatPermissionLabel(left).localeCompare(formatPermissionLabel(right));

  return (
    <AdminFormShell>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-16 md:grid-cols-2">
          <TextInput
            label="Username"
            value={values.username}
            required
            onChange={(event) => updateValue("username", event.target.value)}
          />
          <TextInput
            label="Display name"
            value={values.name}
            required
            onChange={(event) => updateValue("name", event.target.value)}
          />
          <TextInput
            label="Email"
            type="email"
            value={values.email}
            required
            onChange={(event) => updateValue("email", event.target.value)}
          />
          <TextInput
            label={mode === "create" ? "Password" : "New password"}
            type="password"
            value={values.password}
            required={mode === "create"}
            onChange={(event) => updateValue("password", event.target.value)}
          />
          <TextInput
            label="Confirm password"
            type="password"
            value={values.password_confirmation}
            required={mode === "create" || Boolean(values.password)}
            onChange={(event) =>
              updateValue("password_confirmation", event.target.value)
            }
          />
          <div className="md:col-span-2">
            <div className="rounded-md border border-base-300 bg-base-100 p-8">
              <div className="flex flex-wrap items-center gap-6">
                <h2 className="text-body-m font-semibold text-base-content">
                  Permissions
                </h2>
                <span className="rounded-md bg-base-200 px-6 py-2 text-caption font-medium text-base-content opacity-70">
                  {selectedPermissionIds.length}/{permissions.length}
                </span>
                <label className="ml-auto inline-flex h-[32px] items-center gap-5 rounded-md border border-base-300 px-8 text-caption font-medium text-base-content">
                  <input
                    type="checkbox"
                    className={permissionCheckboxClassName}
                    checked={hasAllPermissions}
                    onChange={toggleAllPermissions}
                  />
                  <span>Full access</span>
                </label>
                {rolePresets.length > 0 && (
                  <select
                    className="select select-bordered h-[32px] min-h-0 w-[180px] rounded-md text-caption"
                    value=""
                    onChange={(event) => applyRolePreset(event.target.value)}
                  >
                    <option value="">Apply role</option>
                    {rolePresets.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mt-6 grid gap-6">
                {sortedPermissionGroups.length > 0 ? (
                  sortedPermissionGroups.map(
                    ([resource, resourcePermissions]) => {
                      const sortedPermissions = [...resourcePermissions].sort(
                        sortPermissionsByName,
                      );
                      const selectedResourceCount = sortedPermissions.filter(
                        (permission) =>
                          selectedPermissionIdSet.has(permission.id),
                      ).length;

                      return (
                        <section
                          key={resource}
                          className="overflow-hidden rounded-md border border-base-300"
                        >
                          <div className="flex h-[34px] items-center justify-between gap-8 bg-base-200 px-8">
                            <h3 className="truncate text-caption font-semibold uppercase tracking-normal text-base-content">
                              {formatResourceLabel(resource)}
                            </h3>
                            <span className="rounded-md bg-base-100 px-6 py-1 text-caption font-medium text-base-content opacity-70">
                              {selectedResourceCount === 0
                                ? "None"
                                : `${selectedResourceCount}/${sortedPermissions.length}`}
                            </span>
                          </div>
                          <div className="grid gap-x-10 gap-y-4 px-8 py-6 sm:grid-cols-2 xl:grid-cols-3">
                            {sortedPermissions.map((permission) => (
                              <label
                                key={permission.id}
                                className="inline-flex min-h-[24px] items-center gap-6 text-caption font-medium text-base-content"
                              >
                                <input
                                  type="checkbox"
                                  className={permissionCheckboxClassName}
                                  checked={selectedPermissionIdSet.has(
                                    permission.id,
                                  )}
                                  onChange={() =>
                                    togglePermission(permission.id)
                                  }
                                />
                                <span className="min-w-0 break-words leading-tight">
                                  {formatPermissionLabel(permission)}
                                </span>
                              </label>
                            ))}
                          </div>
                        </section>
                      );
                    },
                  )
                ) : (
                  <span className="block px-8 py-6 text-body-s text-base-content opacity-60">
                    No permissions available.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <FormActionRow
          submitLabel={mode === "create" ? "Create user" : "Save changes"}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </AdminFormShell>
  );
};
