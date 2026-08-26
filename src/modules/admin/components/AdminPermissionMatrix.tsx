import React, { useMemo } from "react";

import { Button } from "../../../design/components/button";
import {

  ADMIN_PERMISSION_ACTION_ORDER,
  ADMIN_PERMISSION_FALLBACKS,
} from "../constants";
import { iconsLib } from '../../../assets';

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
      <div className="grid gap-10 lg:grid-cols-2">
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

          return (
            <div
              key={resource}
              className="rounded-md border border-base-300 bg-base-100 p-10"
            >
              <div className="mb-8 flex items-center justify-between gap-8">
                <h3 className="text-body-s font-semibold capitalize text-base-content">
                  {formatLabel(resource)}
                </h3>
                {showSelectAll && isSelectable && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-[30px] gap-4 px-8 text-caption"
                    onClick={() =>
                      isResourceSelected
                        ? onClearPermissions?.(resourcePermissionIds)
                        : onSelectPermissions?.(resourcePermissionIds)
                    }
                  >
                    {isResourceSelected ? (
                      <iconsLib.xmark className="h-[14px] w-[14px]" />
                    ) : (
                      <iconsLib.checkr className="h-[14px] w-[14px]" />
                    )}
                   
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                {resourcePermissions.map((permission) => {
                  const isChecked =
                    !isSelectable || selectedPermissionSet.has(permission.id);

                  return (
                    <label
                      key={permission.id}
                      className="flex min-h-[34px] items-center justify-center gap-6 rounded-md bg-base-200 px-8 text-body-s font-semibold capitalize text-base-content"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs border-base-content/30 checked:border-primary checked:bg-primary"
                        checked={isChecked}
                        readOnly={!isSelectable}
                        onChange={() => onTogglePermission?.(permission.id)}
                      />
                      <span>{permission.action}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
  );
};
