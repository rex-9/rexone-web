import React from "react";
import { iconsLib } from "../../../../assets";
import { Button, Image, StatusBadge } from "../../../../design";
import { ButtonSizes, ButtonVariants } from "../../../../design/constants";
import { DateTime, DateTimeFormats } from "../../../../design";
import type { IAssetChild } from "../../../../models";
import {
  AdminTable,
  AdminTableActions,
  type IAdminTableColumn,
} from "../../components";
import { ADMIN_ACTIONS, ADMIN_RESOURCES } from "../../constants";
import {
  ADMIN_ASSET_COLUMNS,
  ASSET_STATUSES,
  formatAssetFileSize,
  getAssetTitle,
  isImageAsset,
} from "../constants";
import { AppLocales, useTranslate } from "../../../../locales";

export interface IAdminAssetChildrenTableProps {
  assets?: IAssetChild[];
  onDownload?: (asset: IAssetChild) => void | Promise<void>;
  onEdit?: (asset: IAssetChild) => void;
}

export const AdminAssetChildrenTable: React.FC<IAdminAssetChildrenTableProps> = ({
  assets = [],
  onDownload,
  onEdit,
}) => {
  const t = useTranslate();

  const columns: IAdminTableColumn<IAssetChild>[] = [
    {
      key: ADMIN_ASSET_COLUMNS.PREVIEW,
      header: t(AppLocales.Admin.Assets.Table.Preview),
      className: "w-14",
      render: (asset) => {
        const canPreview = isImageAsset(asset);

        return (
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-base-200">
            {canPreview ? (
              <Image
                src={asset.url}
                alt={getAssetTitle(asset)}
                className="h-full w-full object-cover"
                fallback={
                  <iconsLib.photo className="h-5 w-5 text-base-content/50" />
                }
              />
            ) : (
              <iconsLib.document className="h-5 w-5 text-base-content/50" />
            )}
          </div>
        );
      },
    },
    {
      key: ADMIN_ASSET_COLUMNS.NAME,
      header: t(AppLocales.Admin.Assets.Table.Name),
      className: "min-w-56 max-w-72",
      render: (asset) => {
        const assetTitle = getAssetTitle(asset);
        const description = asset.description?.trim();

        return (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-base-content" title={assetTitle}>
              {assetTitle}
            </span>
            {description ? (
              <span className="truncate text-xs text-base-content/70" title={description}>
                {description}
              </span>
            ) : null}
            <span className="truncate font-mono text-xs text-base-content/60" title={asset.id}>
              {asset.id}
            </span>
          </div>
        );
      },
    },
    {
      key: ADMIN_ASSET_COLUMNS.TYPE,
      header: t(AppLocales.Admin.Assets.Table.Type),
      render: (asset) => <span className="text-sm">{asset.type}</span>,
    },
    {
      key: ADMIN_ASSET_COLUMNS.FORMAT,
      header: t(AppLocales.Admin.Assets.Table.Format),
      render: (asset) => (
        <span className="text-sm uppercase">
          {asset.format || t(AppLocales.Common.NotAvailable)}
        </span>
      ),
    },
    {
      key: ADMIN_ASSET_COLUMNS.STATUS,
      header: t(AppLocales.Admin.Assets.Detail.Status),
      render: (asset) => <StatusBadge status={asset.status || ASSET_STATUSES.READY} />,
    },
    {
      key: ADMIN_ASSET_COLUMNS.SIZE,
      header: t(AppLocales.Admin.Assets.Table.Size),
      render: (asset) => (
        <span className="text-sm">{formatAssetFileSize(asset.size_bytes)}</span>
      ),
    },
    {
      key: ADMIN_ASSET_COLUMNS.CREATED_AT,
      header: t(AppLocales.Admin.Assets.Table.Created),
      render: (asset) =>
        asset.created_at ? (
          <DateTime value={asset.created_at} format={DateTimeFormats.ADMIN} />
        ) : (
          "—"
        ),
    },
  ];

  if (onDownload || onEdit) {
    columns.push({
      key: ADMIN_ASSET_COLUMNS.ACTIONS,
      header: t(AppLocales.Admin.Assets.Table.Actions),
      className: "text-right",
      render: (asset) => (
        <div className="flex items-center justify-end gap-1.5">
          {onDownload && (
            <Button
              size={ButtonSizes.XS}
              variant={ButtonVariants.SECONDARY}
              onClick={() => void onDownload(asset)}
              className="inline-flex items-center gap-1.5"
            >
              <iconsLib.download className="h-4 w-4" />
              {t(AppLocales.Admin.Assets.Download.Action)}
            </Button>
          )}
          {onEdit && (
            <AdminTableActions
              resource={ADMIN_RESOURCES.ASSETS}
              actions={[
                {
                  type: ADMIN_ACTIONS.EDIT,
                  onClick: () => onEdit(asset),
                },
              ]}
            />
          )}
        </div>
      ),
    });
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-md border border-base-300 bg-base-100 p-6 text-center text-base-content/60">
        {t(AppLocales.Admin.Assets.Detail.NoChildren)}
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      records={assets}
      getRowKey={(asset) => asset.id}
    />
  );
};
