import React, { useMemo, useState } from "react";
import { isAdminRoleName } from "../../../../models";
import {
  IAdminPermission,
  IAdminRole,
  IAdminRoleFormValues,
} from "../types";
import {
  AdminFormShell,
  AdminPermissionMatrix,
  FormActionRow,
  TextInput,
} from "../../../../design/components";

interface AdminRoleFormProps {
  mode: "create" | "edit";
  role?: IAdminRole | null;
  permissions: IAdminPermission[];
  isSubmitting: boolean;
  onSubmit: (values: IAdminRoleFormValues) => void;
  onCancel: () => void;
}

export const AdminRoleForm: React.FC<AdminRoleFormProps> = ({
  mode,
  role,
  permissions,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [nameError, setNameError] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    role?.permission_ids ?? [],
  );
  const shouldValidateAdminName = !role?.system;

  const permissionItems = useMemo(
    () =>
      permissions.map((permission) => ({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
      })),
    [permissions],
  );

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const selectPermissions = (permissionIds: string[]) => {
    setSelectedPermissionIds((current) => [
      ...new Set([...current, ...permissionIds]),
    ]);
  };

  const clearPermissions = (permissionIds: string[]) => {
    setSelectedPermissionIds((current) =>
      current.filter((id) => !permissionIds.includes(id)),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = name.trim();

    if (shouldValidateAdminName && !isAdminRoleName(nextName)) {
      setNameError(
        "Admin panel roles must end with _admin, for example notification_admin.",
      );
      return;
    }

    setNameError("");

    onSubmit({
      name: nextName,
      description: description.trim(),
      permission_ids: selectedPermissionIds,
    });
  };

  return (
    <AdminFormShell>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-16 md:grid-cols-2">
          <TextInput
            label="Role name"
            value={name}
            required
            disabled={role?.system}
            error={nameError}
            helperText={
              shouldValidateAdminName
                ? "Use a name ending with _admin, such as notification_admin."
                : undefined
            }
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError("");
            }}
          />
          <TextInput
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="md:col-span-2">
            <div className="rounded-md border border-base-300 bg-base-100 p-12">
              <div className="mb-10 flex items-center justify-between gap-8">
                <h2 className="text-body-m font-semibold text-base-content">
                  Permissions
                </h2>
              </div>

              <AdminPermissionMatrix
                permissions={permissionItems}
                selectedPermissionIds={selectedPermissionIds}
                isSelectable
                showSelectAll
                onTogglePermission={togglePermission}
                onSelectPermissions={selectPermissions}
                onClearPermissions={clearPermissions}
              />
            </div>
          </div>
        </div>

        <FormActionRow
          submitLabel={mode === "create" ? "Create role" : "Save changes"}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </AdminFormShell>
  );
};
