import React, { useMemo, useState } from "react";
import { isAdminRoleName } from "../../../../models";
import {
  IAdminPermission,
  IAdminRole,
  IAdminRoleFormValues,
} from "../types";
import {
  AdminPermissionMatrix,
  FormActionRow,
  FormContainer,
  TextInput,
} from "../../components";
import { ADMIN_ACTIONS, ADMIN_COMMON_LABELS } from "../../constants";
import { ADMIN_ROLE_FORM_LABELS } from "../constants";

interface IAdminRoleFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  role?: IAdminRole | null;
  permissions: IAdminPermission[];
  onSubmit: (values: IAdminRoleFormValues) => void;
  onCancel: () => void;
}

export const AdminRoleForm: React.FC<IAdminRoleFormProps> = ({
  mode,
  role,
  permissions,
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
      setNameError(ADMIN_ROLE_FORM_LABELS.NAME_ERROR);
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
    <FormContainer onSubmit={handleSubmit}>
      <div className="grid gap-16 md:grid-cols-2">
        <TextInput
          label={ADMIN_ROLE_FORM_LABELS.ROLE_NAME}
          value={name}
          required
          disabled={role?.system}
          error={nameError}
          helperText={
            shouldValidateAdminName
              ? ADMIN_ROLE_FORM_LABELS.NAME_HELPER
              : undefined
          }
          onChange={(event) => {
            setName(event.target.value);
            if (nameError) setNameError("");
          }}
        />
        <TextInput
          label={ADMIN_ROLE_FORM_LABELS.DESCRIPTION}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <div className="md:col-span-2">
          <div className="rounded-md border border-base-300 bg-base-100 p-12">
            <div className="mb-10 flex items-center justify-between gap-8">
              <h2 className="text-body-m font-semibold text-base-content">
                {ADMIN_ROLE_FORM_LABELS.PERMISSIONS}
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
        cancelLabel={ADMIN_COMMON_LABELS.CANCEL}
        submitLabel={
          mode === ADMIN_ACTIONS.CREATE
            ? ADMIN_ROLE_FORM_LABELS.CREATE_ROLE
            : ADMIN_ROLE_FORM_LABELS.SAVE_CHANGES
        }
        onCancel={onCancel}
      />
    </FormContainer>
  );
};
