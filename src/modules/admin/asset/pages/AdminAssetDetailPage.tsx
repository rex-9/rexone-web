import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Button, ConfirmDialog, Image, StatusBadge } from "../../../../design";
import { ButtonVariants } from "../../../../design/constants";
import { useToast } from "../../../../contexts/ToastContext";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import AssetController from "../asset.controller";
import { formatAssetFileSize, getAssetChildren, getAssetThumbnail } from "../constants";
import { AdminAssetChildrenTable } from "../components";
import type { IAdminAsset } from "../types";
import type { IAssetChild } from "../../../../models";

const loadAsset = async (id: string) => {
  const result = await AssetController.getAsset(id);
  return { ...result, record: result.asset };
};
export const AdminAssetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const t = useTranslate();
  const { record: asset, error, reload } = useAdminDetail<IAdminAsset>(id, loadAsset);
  const listPath = AppRoutes.client.protected.admin.ASSETS;

  const [childToDiscard, setChildToDiscard] = useState<IAssetChild | null>(null);
  const [childToUndiscard, setChildToUndiscard] = useState<IAssetChild | null>(null);
  const [childToDestroy, setChildToDestroy] = useState<IAssetChild | null>(null);

  const preview =
    asset?.format?.toLowerCase() === "image"
      ? asset.url
      : getAssetThumbnail(asset)?.url;

  const handleDownload = async (target: IAdminAsset | IAssetChild) => {
    const result = await AssetController.getDownloadUrl(target.id);
    if (!result.success || !result.url) return;

    const link = document.createElement("a");
    link.href = result.url;
    link.rel = "noopener";
    link.click();
  };

  const handleDiscardChild = async () => {
    if (!childToDiscard) return;
    const result = await AssetController.discardAsset(childToDiscard.id);
    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Assets.Toasts.DiscardSuccess));
      setChildToDiscard(null);
      reload();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Errors.DiscardFailed));
    }
  };

  const handleUndiscardChild = async () => {
    if (!childToUndiscard) return;
    const result = await AssetController.undiscardAsset(childToUndiscard.id);
    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Assets.Toasts.RestoreSuccess));
      setChildToUndiscard(null);
      reload();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Errors.RestoreFailed));
    }
  };

  const handleDestroyChild = async () => {
    if (!childToDestroy) return;
    const result = await AssetController.destroyAsset(childToDestroy.id);
    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Assets.Toasts.DestroySuccess));
      setChildToDestroy(null);
      reload();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Errors.DestroyFailed));
    }
  };

  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          { label: t(AppLocales.Admin.Common.Detail.Admin), to: AppRoutes.client.protected.admin.HOME },
          { label: t(AppLocales.Admin.Assets.Title), to: listPath },
          { label: asset?.title || asset?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={t(AppLocales.Admin.Assets.Detail.Title)}
        description={t(AppLocales.Admin.Assets.Detail.Description)}
        backTo={listPath}
      />
      {error ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : asset ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <AdminDetailSection title={t(AppLocales.Admin.Assets.Detail.Preview)} icon={iconsLib.photo}>
            {preview ? (
              <Image
                src={preview}
                alt={asset.title || asset.name}
                className="max-h-80 w-full rounded-lg object-contain"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg bg-base-200">
                <iconsLib.photo className="h-12 w-12 text-base-content/30" />
              </div>
            )}
            <div className="pt-4">
              <Button
                variant={ButtonVariants.SECONDARY}
                fullWidth
                onClick={() => void handleDownload(asset)}
                className="gap-1.5"
              >
                <iconsLib.download className="h-4 w-4" />
                {t(AppLocales.Admin.Assets.Download.Action)}
              </Button>
            </div>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Assets.Detail.Metadata)}
            icon={iconsLib.document}
            className="lg:col-span-2"
          >
            <AdminDetailGrid>
              {asset.title && (
                <AdminDetailField
                  label={t(AppLocales.Admin.Assets.Table.Title)}
                  value={asset.title}
                  className="sm:col-span-2 xl:col-span-3"
                />
              )}
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Name)}
                value={asset.name}
                className="sm:col-span-2 xl:col-span-3"
              />
              {asset.description && (
                <AdminDetailField
                  label={t(AppLocales.Admin.Assets.Table.Description)}
                  value={asset.description}
                  className="sm:col-span-2 xl:col-span-3"
                />
              )}
              <AdminDetailField label={t(AppLocales.Admin.Common.Detail.Type)} value={asset.type} />
              <AdminDetailField label={t(AppLocales.Admin.Common.Detail.Format)} value={asset.format} />
              <AdminDetailField
                label={t(AppLocales.Admin.Assets.Detail.Status)}
                value={<StatusBadge status={asset.status || "unknown"} />}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Size)}
                value={formatAssetFileSize(asset.size_bytes)}
              />
              <AdminDetailField label={t(AppLocales.Admin.Common.Detail.Source)} value={asset.source} />
              <AdminDetailField
                label={t(AppLocales.Admin.Assets.Detail.Duration)}
                value={
                  asset.duration_secs ? `${asset.duration_secs}s` : undefined
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Assets.Detail.StorageKey)}
                value={asset.storage_key}
                className="sm:col-span-2 xl:col-span-3"
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Assets.Detail.Children)}
            icon={iconsLib.document}
            className="lg:col-span-3"
          >
            <AdminAssetChildrenTable
              assets={getAssetChildren(asset)}
              onDownload={handleDownload}
              onRowClick={(child) =>
                navigate(
                  AppRoutes.client.protected.admin.ASSET_DETAIL.replace(
                    ":id",
                    child.id,
                  ),
                )
              }
              onEdit={(child) =>
                navigate(
                  AppRoutes.client.protected.admin.ASSET_EDIT.replace(
                    ":id",
                    child.id,
                  ),
                )
              }
              onDiscard={(child) => setChildToDiscard(child)}
              onUndiscard={(child) => setChildToUndiscard(child)}
              onDestroy={(child) => setChildToDestroy(child)}
            />
          </AdminDetailSection>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(childToDiscard)}
        title={t(AppLocales.Admin.Assets.Confirm.DiscardTitle)}
        message={t(AppLocales.Admin.Assets.Confirm.DiscardMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleDiscardChild}
        onClose={() => setChildToDiscard(null)}
        isDestructive
      />

      <ConfirmDialog
        isOpen={Boolean(childToUndiscard)}
        title={t(AppLocales.Admin.Assets.Confirm.RestoreTitle)}
        message={t(AppLocales.Admin.Assets.Confirm.RestoreMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Restore)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleUndiscardChild}
        onClose={() => setChildToUndiscard(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(childToDestroy)}
        title={t(AppLocales.Admin.Assets.Confirm.DestroyTitle)}
        message={t(AppLocales.Admin.Assets.Confirm.DestroyMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleDestroyChild}
        onClose={() => setChildToDestroy(null)}
        isDestructive
      />
    </div>
  );
};