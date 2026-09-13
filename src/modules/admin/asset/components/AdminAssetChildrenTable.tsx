import React from "react";
import { iconsLib } from "../../../../assets";
import { Button, Image, StatusBadge } from "../../../../design";
import { ButtonSizes, ButtonVariants } from "../../../../design/constants";
import { DateTime, DateTimeFormats } from "../../../../design";
import type { IAssetChild } from "../../../../models";
import { AdminTable, type IAdminTableColumn } from "../../components/AdminTable";
import { formatAssetFileSize, isImageAsset } from "../constants";
import { AppLocales, useTranslate } from "../../../../locales";

export interface IAdminAssetChildrenTableProps {
  assets?: IAssetChild[];
  onDownload?: (asset: IAssetChild) => void | Promise<void>;
}

export const AdminAssetChildrenTable: React.FC<IAdminAssetChildrenTableProps> = ({
  assets = [],
  onDownload,
}) => {
  const t = useTranslate();

  const columns: IAdminTableColumn<IAssetChild>[] = [
    {
      key: "preview",
      header: t(AppLocales.Admin.Assets.Table.Preview),
      className: "w-14",
      render: (asset) => {
        const canPreview = isImageAsset(asset);

        return (
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-base-200">
            {canPreview ? (
              <Image
                src={asset.url}
                alt={asset.name}
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
      key: "name",
      header: t(AppLocales.Admin.Assets.Table.Name),
      className: "min-w-56 max-w-72",
      render: (asset) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-base-content" title={asset.name}>
            {asset.name}
          </span>
          <span className="truncate font-mono text-xs text-base-content/60" title={asset.id}>
            {asset.id}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: t(AppLocales.Admin.Assets.Table.Type),
      render: (asset) => <span className="text-sm">{asset.type}</span>,
    },
    {
      key: "format",
      header: t(AppLocales.Admin.Assets.Table.Format),
      render: (asset) => (
        <span className="text-sm uppercase">{asset.format || "N/A"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (asset) => <StatusBadge status={asset.status || "ready"} />,
    },
    {
      key: "size",
      header: t(AppLocales.Admin.Assets.Table.Size),
      render: (asset) => (
        <span className="text-sm">{formatAssetFileSize(asset.size_bytes)}</span>
      ),
    },
    {
      key: "created",
      header: t(AppLocales.Admin.Assets.Table.Created),
      render: (asset) =>
        asset.created_at ? (
          <DateTime value={asset.created_at} format={DateTimeFormats.ADMIN} />
        ) : (
          "—"
        ),
    },
  ];

  if (onDownload) {
    columns.push({
      key: "actions",
      header: "",
      className: "text-right",
      render: (asset) => (
        <Button
          size={ButtonSizes.XS}
          variant={ButtonVariants.SECONDARY}
          onClick={() => void onDownload(asset)}
          className="inline-flex items-center gap-1.5"
        >
          <iconsLib.download className="h-4 w-4" />
          {t(AppLocales.Admin.Assets.Download.Action)}
        </Button>
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
