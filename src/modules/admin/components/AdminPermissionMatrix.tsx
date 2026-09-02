import React, { useMemo } from "react";

import { Button } from "../../../design/components/button";
import { ButtonTypes, ButtonVariants } from "../../../design/constants";
import { Checkbox } from "../../../design/components/form";
import {
  ADMIN_PERMISSION_ACTION_ORDER,
  ADMIN_PERMISSION_FALLBACKS,
} from "../constants";
import { iconsLib } from "../../../assets";

export interface IAdminPermissionMatrixItem {
  id: string;
  resource: string;
  action: string;
}

interface IAdminPermissionMatrixProps {
  permissions: IAdminPermissionMatrixItem[];
  selectedPermissionIds?: string[];
  isSelectable?: boolean;
  showSelectAll?: boolean;
  onTogglePermission?: (permissionId: string) => void;
  onSelectPermissions?: (permissionIds: string[]) => void;
  onClearPermissions?: (permissionIds: string[]) => void;
}

const normalizeResource = (value: string): string => {
  const normalized = value?.trim().toLowerCase();
  return normalized && normalized !== ADMIN_PERMISSION_FALLBACKS.NULL_RESOURCE
    ? normalized
    : ADMIN_PERMISSION_FALLBACKS.UNASSIGNED_RESOURCE;
};

const formatLabel = (value: string): string =>
  normalizeResource(value).split("_").join(" ");

const groupPermissions = (
  permissions: IAdminPermissionMatrixItem[],
): Array<[string, IAdminPermissionMatrixItem[]]> =>
  Object.entries(
    permissions.reduce<Record<string, IAdminPermissionMatrixItem[]>>(
      (groups, permission) => {
        if (!permission.action) return groups;

        const resource = normalizeResource(permission.resource);
        const current = groups[resource] ?? [];
        return {
          ...groups,
          [resource]: [
            ...current,
            {
              ...permission,
              resource,
            },
          ],
        };
      },
      {},
    ),
  )
    .map(
      ([resource, resourcePermissions]): [
        string,
        IAdminPermissionMatrixItem[],
      ] => [
        resource,
        [...resourcePermissions].sort(
          (left, right) =>
            ADMIN_PERMISSION_ACTION_ORDER.indexOf(left.action) -
            ADMIN_PERMISSION_ACTION_ORDER.indexOf(right.action),
        ),
      ],
    )
    .sort(([left], [right]) => left.localeCompare(right));

export const AdminPermissionMatrix: React.FC<IAdminPermissionMatrixProps> = ({
  permissions,
  selectedPermissionIds = [],
  isSelectable = false,
  showSelectAll = false,
  onTogglePermission,
  onSelectPermissions,
  onClearPermissions,
}) => {
  const permissionGroups = useMemo(
    () => groupPermissions(permissions),
    [permissions],
  );
  const selectedPermissionSet = useMemo(
    () => new Set(selectedPermissionIds),
    [selectedPermissionIds],
  );

  return (
    <div className="overflow-x-auto rounded-md border border-base-300 bg-base-100">
      <table className="table w-full text-left text-body-s">
        <thead>
          <tr className="border-b border-base-300 bg-base-200/50 text-caption font-semibold uppercase tracking-wider text-base-content/70">
            <th className="px-4 py-3 font-semibold">Resource</th>
            {ADMIN_PERMISSION_ACTION_ORDER.map((action) => (
              <th
                key={action}
                className="px-4 py-3 text-center font-semibold uppercase"
              >
                {action}
              </th>
            ))}
            {showSelectAll && isSelectable && (
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-base-300">
          {permissionGroups.map(([resource, resourcePermissions]) => {
            const resourcePermissionIds = resourcePermissions.map(
              (permission) => permission.id,
            );
            const selectedResourceCount = resourcePermissionIds.filter((id) =>
              selectedPermissionSet.has(id),
            ).length;
            const isResourceSelected =
              resourcePermissionIds.length > 0 &&
              selectedResourceCount === resourcePermissionIds.length;

            const permissionByAction = new Map(
              resourcePermissions.map((permission) => [
                permission.action.toLowerCase(),
                permission,
              ]),
            );

            return (
              <tr
                key={resource}
                className="transition-colors hover:bg-base-200/30"
              >
                <td className="px-4 py-3 font-medium capitalize text-base-content">
                  <div className="flex items-center gap-2">
                    <span>{formatLabel(resource)}</span>
                    <span className="rounded-md bg-base-200 px-2 py-1 text-caption font-medium text-base-content opacity-70">
                      {selectedResourceCount}/{resourcePermissionIds.length}
                    </span>
                  </div>
                </td>

                {ADMIN_PERMISSION_ACTION_ORDER.map((action) => {
                  const permission = permissionByAction.get(
                    action.toLowerCase(),
                  );
                  if (!permission) {
                    return (
                      <td
                        key={action}
                        className="px-4 py-3 text-center text-base-content/40 select-none font-bold"
                      >
                        —
                      </td>
                    );
                  }

                  const isChecked =
                    !isSelectable || selectedPermissionSet.has(permission.id);

                  return (
                    <td key={action} className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={isChecked}
                          disabled={!isSelectable}
                          readOnly={!isSelectable}
                          onChange={() => onTogglePermission?.(permission.id)}
                          aria-label={`${action} ${formatLabel(resource)}`}
                        />
                      </div>
                    </td>
                  );
                })}

                {showSelectAll && isSelectable && (
                  <td className="px-4 py-3 text-right">
                    <Button
                      type={ButtonTypes.BUTTON}
                      variant={ButtonVariants.SECONDARY}
                      className="h-8 gap-1 px-2 text-caption"
                      onClick={() =>
                        isResourceSelected
                          ? onClearPermissions?.(resourcePermissionIds)
                          : onSelectPermissions?.(resourcePermissionIds)
                      }
                    >
                      {isResourceSelected ? (
                        <>
                          <iconsLib.close className="h-4 w-4" />
                          <span>Clear</span>
                        </>
                      ) : (
                        <>
                          <iconsLib.checkr className="h-4 w-4" />
                          <span>All</span>
                        </>
                      )}
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
