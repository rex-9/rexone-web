import React, { useState } from "react";
import {
  IAdminRole,
  IAdminUser,
  IAdminUserFormValues,
} from "../../../models";
import { AdminFormShell, FormActionRow, TextInput } from "../../components";

interface AdminUserFormProps {
  mode: "create" | "edit";
  user?: IAdminUser | null;
  roles: IAdminRole[];
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
    password: "",
    password_confirmation: "",
  };
};

const roleCheckboxClassName =
  "checkbox checkbox-sm border-base-content/40 checked:border-gold-500 checked:bg-gold-500";

export const AdminUserForm: React.FC<AdminUserFormProps> = ({
  mode,
  user,
  roles,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<IAdminUserFormValues>(() =>
    buildInitialValues(user),
  );

  const updateValue = (field: keyof IAdminUserFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleRole = (roleId: string) => {
    setValues((current) => {
      const roleIds = current.role_ids || [];
      const nextRoleIds = roleIds.includes(roleId)
        ? roleIds.filter((id) => id !== roleId)
        : [...roleIds, roleId];

      return { ...current, role_ids: nextRoleIds };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: IAdminUserFormValues = {
      username: values.username.trim(),
      name: values.name.trim(),
      email: values.email.trim(),
      role_ids: values.role_ids || [],
    };

    if (values.password) {
      payload.password = values.password;
      payload.password_confirmation = values.password_confirmation;
    }

    onSubmit(payload);
  };

  const selectedRoleIds = values.role_ids || [];
  const selectedRoleIdSet = new Set(selectedRoleIds);

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
            <div className="rounded-md border border-base-300 bg-base-100 p-12">
              <div className="mb-10 flex items-center justify-between gap-8">
                <h2 className="text-body-m font-semibold text-base-content">
                  Roles
                </h2>
                <span className="rounded-md bg-base-200 px-8 py-3 text-caption font-medium text-base-content opacity-70">
                  {selectedRoleIds.length}/{roles.length}
                </span>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className="flex min-h-[42px] items-center gap-8 rounded-md border border-base-300 px-10 text-body-s font-medium text-base-content"
                  >
                    <input
                      type="checkbox"
                      className={roleCheckboxClassName}
                      checked={selectedRoleIdSet.has(role.id)}
                      onChange={() => toggleRole(role.id)}
                    />
                    <span className="truncate">{role.name}</span>
                  </label>
                ))}
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
