// src/modules/admin/asset/components/AdminAssetUploadDialog.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  FileInput,
  Dropdown,
  Button,
  ProgressBar,
  ProgressBarVariants,
  Image,
} from "../../../../design";
import {
  ButtonVariants,
  ComponentSizes,
  UPLOAD_SIZE_LIMITS,
} from "../../../../constants";
import { iconsLib } from "../../../../assets";
import { AppLocales, useTranslate } from "../../../../locales";
import AdminAssetController from "../asset.controller";
import {
  ASSET_TYPE_OPTIONS,
  ASSET_TYPES,
  formatAssetFileSize,
} from "../constants";
import { useToast } from "../../../../contexts/ToastContext";
import { IAsset } from "../../../../models/asset.model";

interface IAdminAssetUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAssets?: IAsset[]) => void;
  onAssetUploaded?: (asset: IAsset) => void;
}

interface IFileItem {
  file: File;
  previewUrl: string | null;
}

export const AdminAssetUploadDialog: React.FC<IAdminAssetUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onAssetUploaded,
}) => {
  const t = useTranslate();
  const toast = useToast();
  const [fileItems, setFileItems] = useState<IFileItem[]>([]);
  const [type, setType] = useState<string>(ASSET_TYPES.GENERAL);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [hasOversizedFiles, setHasOversizedFiles] = useState(false);

  const resetState = useCallback(() => {
    fileItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFileItems([]);
    setType(ASSET_TYPES.GENERAL);
    setError(null);
    setHasOversizedFiles(false);
    setProgress(0);
    setStatusMessage("");
    setIsUploading(false);
  }, [fileItems]);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    if (isUploading) return;
    resetState();
    onClose();
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    setHasOversizedFiles(false);
    if (!newFiles || newFiles.length === 0) return;

    if (fileItems.length + newFiles.length > UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT) {
      setError(
        t(AppLocales.Admin.Assets.UploadDialog.MaxFilesExceeded, {
          count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
          defaultValue: `Maximum ${UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT} files allowed per batch upload.`,
        }),
      );
      return;
    }

    const validatedItems: IFileItem[] = [];
    const oversizedFiles: string[] = [];

    for (const f of newFiles) {
      const isVideo = f.type.startsWith("video/");
      const sizeLimit = isVideo
        ? UPLOAD_SIZE_LIMITS.MAX_VIDEO_BYTES
        : UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_BYTES;
      const limitMb = isVideo
        ? UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB
        : UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB;

      if (f.size > sizeLimit) {
        oversizedFiles.push(`${f.name} (>${limitMb}MB)`);
      } else {
        const previewUrl = f.type.startsWith("image/")
          ? URL.createObjectURL(f)
          : null;
        validatedItems.push({ file: f, previewUrl });
      }
    }

    if (oversizedFiles.length > 0) {
      setHasOversizedFiles(true);
      setError(
        t(AppLocales.Admin.Assets.UploadDialog.FileSizeExceeded, {
          names: oversizedFiles.join(", "),
          defaultValue: `Some files exceed maximum size limit: ${oversizedFiles.join(", ")}`,
        }),
      );
    }

    setFileItems((prev) => [...prev, ...validatedItems]);
  };

  const handleRemoveFile = (index: number) => {
    if (isUploading) return;
    setFileItems((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAll = () => {
    if (isUploading) return;
    fileItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFileItems([]);
  };

  const handleUpload = async () => {
    if (fileItems.length === 0 || isUploading) return;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    const total = fileItems.length;
    const uploadedAssets: IAsset[] = [];

    try {
      for (let i = 0; i < total; i++) {
        const item = fileItems[i];
        setStatusMessage(
          t(AppLocales.Admin.Assets.UploadDialog.UploadingStatus, {
            defaultValue: `Uploading file {{current}} of {{total}}: {{name}}`,
            current: i + 1,
            total,
            name: item.file.name,
          }),
        );

        const response = await AdminAssetController.uploadAsset(item.file, {
          type,
        });

        if (!response.success) {
          throw new Error(
            response.error ||
              `${t(AppLocales.Admin.Assets.Errors.UploadFailed)} (${item.file.name})`,
          );
        }

        if (response.asset) {
          uploadedAssets.push(response.asset);
          onAssetUploaded?.(response.asset);
        }

        setProgress(Math.round(((i + 1) / total) * 100));
      }

      if (total > 1) {
        toast.success(
          t(AppLocales.Admin.Assets.Toasts.BulkUploadSuccess, {
            defaultValue: `Successfully uploaded ${total} assets`,
            count: total,
          }),
        );
      } else {
        toast.success(t(AppLocales.Admin.Assets.Toasts.UploadSuccess));
      }

      setTimeout(() => {
        onSuccess(uploadedAssets);
        handleClose();
      }, 150);
    } catch (err: any) {
      setError(err.message || t(AppLocales.Admin.Assets.Errors.UploadFailed));
    } finally {
      setIsUploading(false);
    }
  };

  const filteredTypeOptions = ASSET_TYPE_OPTIONS.filter(
    (opt) => opt.value !== "",
  );

  const totalSize = fileItems.reduce((acc, item) => acc + item.file.size, 0);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={t(AppLocales.Admin.Assets.UploadDialog.Title, "Upload Assets")}
      className="max-w-xl w-full"
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Bulk Upload Notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl border border-warning/30 bg-warning/10 text-warning-content">
          <iconsLib.warning className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold block text-base-content">
              {t(
                AppLocales.Admin.Assets.UploadDialog.BulkNoticeTitle,
                "Notice for Batch Uploads",
              )}
            </span>
            <p className="text-base-content/80 leading-relaxed">
              {t(
                AppLocales.Admin.Assets.UploadDialog.BulkNotice,
                {
                  count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
                  imageLimit: UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB,
                  videoLimit: UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB,
                  defaultValue: `You can choose up to ${UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT} files per batch (Max ${UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB}MB per image, ${UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB}MB per video). All selected files in a batch will share the chosen Asset Type (e.g., all Thumbnails, all Avatars, or all Covers). Mixed types cannot be uploaded in the same batch.`,
                },
              )}
            </p>
          </div>
        </div>

        {/* Compression Recommendation Banner - Only displayed when at least one file is oversized */}
        {hasOversizedFiles && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-warning/30 bg-warning/5 text-base-content">
            <iconsLib.warning className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-xs space-y-2 flex-1">
              <div>
                <span className="font-bold block text-base-content">
                  {t(
                    AppLocales.Admin.Assets.UploadDialog.CompressTipTitle,
                    "Compression Recommended",
                  )}
                </span>
                <p className="text-base-content/80 leading-relaxed mt-0.5">
                  {t(
                    AppLocales.Admin.Assets.UploadDialog.CompressTipDesc,
                    "Built-in media compression is not yet available. Please compress large files before uploading to optimize loading performance and reduce storage usage:",
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Button
                  variant={ButtonVariants.TERTIARY}
                  size={ComponentSizes.XS}
                  className="bg-base-200/80 hover:bg-base-300 text-primary border border-base-300 px-2.5 py-1 text-xs gap-1.5 rounded-lg font-medium"
                  onClick={() =>
                    window.open(
                      "https://tinypng.com",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <span>
                    {t(
                      AppLocales.Admin.Assets.UploadDialog.CompressImages,
                      "Compress Images (TinyPNG)",
                    )}
                  </span>
                  <span className="text-xs opacity-70">↗</span>
                </Button>
                <Button
                  variant={ButtonVariants.TERTIARY}
                  size={ComponentSizes.XS}
                  className="bg-base-200/80 hover:bg-base-300 text-primary border border-base-300 px-2.5 py-1 text-xs gap-1.5 rounded-lg font-medium"
                  onClick={() =>
                    window.open(
                      "https://www.freeconvert.com/video-compressor",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <span>
                    {t(
                      AppLocales.Admin.Assets.UploadDialog.CompressVideos,
                      "Compress Videos (FreeConvert)",
                    )}
                  </span>
                  <span className="text-xs opacity-70">↗</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Asset Type Selector */}
        <Dropdown
          label={t(
            AppLocales.Admin.Assets.UploadDialog.TypeLabel,
            "Asset Type",
          )}
          value={type}
          options={filteredTypeOptions.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
          onValueChange={(val) => setType(val)}
          disabled={isUploading}
        />

        {/* Multi-File Picker */}
        <FileInput
          label={t(
            AppLocales.Admin.Assets.UploadDialog.FileLabel,
            "Select Files",
          )}
          buttonText={t(
            AppLocales.Admin.Assets.UploadDialog.ChooseFiles,
            {
              count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
              defaultValue: `Choose Files (Up to ${UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT})`,
            },
          )}
          multiple
          onFilesChange={handleFilesSelected}
          disabled={isUploading}
          error={error || undefined}
          helperText={t(
            AppLocales.Admin.Assets.UploadDialog.FileLimitHint,
            {
              count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
              imageLimit: UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB,
              videoLimit: UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB,
              defaultValue: `You can choose up to ${UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT} files per batch (Max ${UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB}MB per image, ${UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB}MB per video).`,
            },
          )}
        />

        {/* Selected Files Tray */}
        {fileItems.length > 0 && (
          <div className="border border-base-200 rounded-xl p-3 bg-base-200/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-base-content/80 pb-1 border-b border-base-200">
              <span>
                {t(
                  AppLocales.Admin.Assets.UploadDialog.SelectedFiles,
                  "Selected Files",
                )}{" "}
                ({fileItems.length} / {UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT}) • {formatAssetFileSize(totalSize)}
              </span>
              {!isUploading && (
                <Button
                  type="button"
                  variant={ButtonVariants.TERTIARY}
                  size={ComponentSizes.SM}
                  onClick={handleClearAll}
                  className="text-error hover:bg-error/10 h-6 px-2 text-xs"
                >
                  {t(
                    AppLocales.Admin.Assets.UploadDialog.ClearAll,
                    "Clear All",
                  )}
                </Button>
              )}
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {fileItems.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-base-100 border border-base-200 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {item.previewUrl ? (
                      <div className="w-8 h-8 rounded shrink-0 overflow-hidden border border-base-300">
                        <Image
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded shrink-0 bg-base-200 flex items-center justify-center border border-base-300">
                        <iconsLib.document className="w-4 h-4 text-base-content/60" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-base-content">
                        {item.file.name}
                      </span>
                      <span className="text-[10px] text-base-content/60">
                        {formatAssetFileSize(item.file.size)}
                      </span>
                    </div>
                  </div>

                  {!isUploading && (
                    <Button
                      type="button"
                      variant={ButtonVariants.TERTIARY}
                      size={ComponentSizes.SM}
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 h-auto text-base-content/50 hover:text-error"
                    >
                      <iconsLib.close className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-1.5">
            <ProgressBar
              value={progress}
              showPercentage
              label={
                statusMessage ||
                t(
                  AppLocales.Admin.Assets.UploadDialog.Uploading,
                  "Uploading...",
                )
              }
              variant={ProgressBarVariants.PRIMARY}
            />
          </div>
        )}
      </div>

      {/* Dialog Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant={ButtonVariants.SECONDARY}
          onClick={handleClose}
          disabled={isUploading}
        >
          {t(AppLocales.Admin.Common.Actions.Cancel, "Cancel")}
        </Button>
        <Button
          variant={ButtonVariants.PRIMARY}
          onClick={handleUpload}
          disabled={fileItems.length === 0 || isUploading}
          isLoading={isUploading}
        >
          {t(AppLocales.Admin.Assets.UploadDialog.UploadButton, "Upload")}
          {fileItems.length > 1 ? ` (${fileItems.length})` : ""}
        </Button>
      </div>
    </Dialog>
  );
};
