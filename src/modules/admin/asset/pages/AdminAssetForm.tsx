import React, { useEffect, useMemo, useState } from "react";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import { useLoading } from "../../../../contexts/LoadingContext";
import type { IAssetChild } from "../../../../models";
import type { IAdminAsset } from "../types";
import {
  ASSET_TYPE_OPTIONS,
  ASSET_TYPES,
  ASSET_FORMATS,
  ASSET_STATUSES,
  formatAssetFileSize,
  getAssetChildren,
  getAssetThumbnail,
  isImageAsset,
  isSrtSubtitleFile,
  isChildAssetType,
} from "../constants";
import {
  AlertDialog,
  Dropdown,
  FormActionRow,
  FormContainer,
  TextArea,
  TextInput,
} from "../../components";
import {
  AdminAssetChildrenTable,
  AdminParentAssetSelect,
} from "../components";
import {
  Badge,
  Button,
  FileInput,
  Image,
  ProgressBar,
  ProgressBarVariants,
  StatusBadge,
} from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { UPLOAD_SIZE_LIMITS } from "../../../../constants";
import { ADMIN_ACTIONS } from "../../constants";
import { DateTime, DateTimeFormats } from "../../../../design";

export interface IAdminAssetEditFormValues {
  name: string;
  title?: string;
  description?: string;
  type: string;
  parent_asset_id?: string;
}

export interface IFileItem {
  file: File;
  previewUrl: string | null;
}

export interface IAdminAssetFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  asset?: IAdminAsset;
  onUploadBatch?: (
    files: File[],
    type: string,
    onProgress: (percent: number, msg: string) => void,
    meta?: {
      title?: string;
      description?: string;
      parent_asset_id?: string;
    },
  ) => Promise<void>;
  onSubmitEdit?: (values: IAdminAssetEditFormValues) => Promise<void>;
  onCompress?: () => Promise<void>;
  onDownload?: () => Promise<void>;
  onRegenerateThumbnail?: () => Promise<void>;
  onUploadThumbnail?: (file: File) => Promise<void>;
  onUploadSubtitle?: (file: File) => Promise<void>;
  onDownloadChild?: (asset: IAssetChild) => Promise<void>;
  onEditChild?: (asset: IAssetChild) => void;
  isCompressing?: boolean;
  isUpdatingThumbnail?: boolean;
  isUpdatingSubtitle?: boolean;
  onCancel: () => void;
}

export const AdminAssetForm: React.FC<IAdminAssetFormProps> = ({
  mode,
  asset,
  onUploadBatch,
  onSubmitEdit,
  onCompress,
  onDownload,
  onRegenerateThumbnail,
  onUploadThumbnail,
  onUploadSubtitle,
  onDownloadChild,
  onEditChild,
  isCompressing = false,
  isUpdatingThumbnail = false,
  isUpdatingSubtitle = false,
  onCancel,
}) => {
  const t = useTranslate();
  const { isLoading, setLoading } = useLoading();
  const isCreate = mode === ADMIN_ACTIONS.CREATE;

  // Create Mode state
  const [fileItems, setFileItems] = useState<IFileItem[]>([]);
  const [uploadType, setUploadType] = useState<string>(ASSET_TYPES.GENERAL);
  const [uploadParentAssetId, setUploadParentAssetId] = useState<string>("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusMessage, setUploadStatusMessage] = useState("");
  const [hasOversizedFiles, setHasOversizedFiles] = useState(false);

  // Edit Mode state
  const [editName, setEditName] = useState(asset?.name ?? "");
  const [editTitle, setEditTitle] = useState(asset?.title ?? "");
  const [editDescription, setEditDescription] = useState(
    asset?.description ?? "",
  );
  const [editType, setEditType] = useState(asset?.type ?? ASSET_TYPES.GENERAL);
  const [editParentAssetId, setEditParentAssetId] = useState<string>(
    asset?.parent_asset_id ?? "",
  );
  const [parentAssetError, setParentAssetError] = useState<string>("");

  useEffect(() => {
    if (asset) {
      setEditName(asset.name ?? "");
      setEditTitle(asset.title ?? "");
      setEditDescription(asset.description ?? "");
      setEditType(asset.type ?? ASSET_TYPES.GENERAL);
      setEditParentAssetId(asset.parent_asset_id ?? "");
      setParentAssetError("");
    }
  }, [
    asset?.id,
    asset?.name,
    asset?.title,
    asset?.description,
    asset?.type,
    asset?.parent_asset_id,
  ]);

  const [alertMessage, setAlertMessage] = useState("");
  const isChildAsset = Boolean(asset?.parent_asset_id);

  const filteredTypeOptions = useMemo(
    () => ASSET_TYPE_OPTIONS.filter((opt) => opt.value !== ""),
    [],
  );

  const totalSize = useMemo(
    () => fileItems.reduce((acc, item) => acc + item.file.size, 0),
    [fileItems],
  );

  const handleFilesSelected = (newFiles: File[]) => {
    setHasOversizedFiles(false);
    if (!newFiles || newFiles.length === 0) return;

    if (
      fileItems.length + newFiles.length >
      UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT
    ) {
      setAlertMessage(
        t(AppLocales.Admin.Assets.UploadDialog.MaxFilesExceeded, {
          count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
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
      setAlertMessage(
        t(AppLocales.Admin.Assets.UploadDialog.FileSizeExceeded, {
          names: oversizedFiles.join(", "),
        }),
      );
    }

    setFileItems((prev) => [...prev, ...validatedItems]);
  };

  const handleRemoveFile = (index: number) => {
    if (isLoading) return;
    setFileItems((prev) => {
      const target = prev[index];
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAllFiles = () => {
    if (isLoading) return;
    fileItems.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFileItems([]);
  };

  const handleBatchUploadSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (fileItems.length === 0 || isLoading || !onUploadBatch) return;

    if (isChildAssetType(uploadType) && !uploadParentAssetId) {
      setParentAssetError(t(AppLocales.Admin.Assets.Form.ParentAssetRequired));
      return;
    }

    setLoading(true, { overlay: false });
    setUploadProgress(0);
    setUploadStatusMessage("");

    try {
      await onUploadBatch(
        fileItems.map((item) => item.file),
        uploadType,
        (percent, msg) => {
          setUploadProgress(percent);
          setUploadStatusMessage(msg);
        },
        {
          title: uploadTitle.trim() || undefined,
          description: uploadDescription.trim() || undefined,
          parent_asset_id: isChildAssetType(uploadType)
            ? uploadParentAssetId
            : undefined,
        },
      );
    } catch (err: unknown) {
      setAlertMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false, { overlay: false });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onSubmitEdit) return;

    const trimmed = editName.trim();
    if (!trimmed) {
      setAlertMessage("Asset name is required.");
      return;
    }

    const effectiveType = isChildAsset && asset ? asset.type : editType;
    if (isChildAssetType(effectiveType) && !editParentAssetId) {
      setParentAssetError(t(AppLocales.Admin.Assets.Form.ParentAssetRequired));
      return;
    }

    await onSubmitEdit({
      name: trimmed,
      title: editTitle.trim() || undefined,
      description: editDescription.trim() || undefined,
      type: effectiveType,
      parent_asset_id: isChildAssetType(effectiveType)
        ? editParentAssetId
        : undefined,
    });
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      {isCreate ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (lg:col-span-1): Guidelines, Batch Summary & Optimization Tools */}
          <div className="lg:col-span-1 space-y-5 h-fit">
            {/* Upload Guidelines Card */}
            <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                <iconsLib.upload className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base-content text-base">
                  {t(AppLocales.Admin.Assets.UploadDialog.BulkNoticeTitle)}
                </h3>
              </div>

              <div className="space-y-4 text-xs text-base-content/80 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <iconsLib.inboxStack className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      Batch Limits
                    </strong>
                    <span>
                      Upload up to {UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT} files
                      simultaneously in a single upload session.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <iconsLib.photo className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      File Size Limits
                    </strong>
                    <span>
                      Maximum {UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB}MB for
                      images and documents; up to{" "}
                      {UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB}MB for video files.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <iconsLib.cube className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      Asset Categorization
                    </strong>
                    <span>
                      All selected files within this batch will share the chosen
                      asset classification type.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <iconsLib.shieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base-content font-medium">
                      Garage Storage
                    </strong>
                    <span>
                      Assets are encrypted, processed, and persisted directly to
                      self-hosted Garage object storage.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Batch Summary Card (when files are selected) */}
            {fileItems.length > 0 && (
              <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Batch Summary
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">Selected Files</span>
                    <span className="font-semibold text-base-content">
                      {fileItems.length} / {UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">
                      Total Batch Size
                    </span>
                    <span className="font-semibold text-base-content">
                      {formatAssetFileSize(totalSize)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">Assigned Type</span>
                    <Badge>{uploadType}</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Optimization Tools Card */}
            <div className="bg-base-100 rounded-xl border border-base-200 p-6 space-y-3">
              <div className="flex items-center gap-2">
                <iconsLib.sparkles className="w-4 h-4 text-warning shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Optimization Tools
                </h4>
              </div>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Need to compress oversized files before uploading to comply with
                batch size limits?
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant={ButtonVariants.TERTIARY}
                  size={ComponentSizes.XS}
                  className="bg-base-200/80 hover:bg-base-300 text-primary border border-base-300 px-3 py-2 text-xs justify-between rounded-lg font-medium"
                  onClick={() =>
                    window.open(
                      "https://tinypng.com",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <span>
                    {t(AppLocales.Admin.Assets.UploadDialog.CompressImages)}
                  </span>
                  <span className="text-xs opacity-70">↗</span>
                </Button>
                <Button
                  variant={ButtonVariants.TERTIARY}
                  size={ComponentSizes.XS}
                  className="bg-base-200/80 hover:bg-base-300 text-primary border border-base-300 px-3 py-2 text-xs justify-between rounded-lg font-medium"
                  onClick={() =>
                    window.open(
                      "https://www.freeconvert.com/video-compressor",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  <span>
                    {t(AppLocales.Admin.Assets.UploadDialog.CompressVideos)}
                  </span>
                  <span className="text-xs opacity-70">↗</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-2): Form Container */}
          <div className="lg:col-span-2">
            <FormContainer
              onSubmit={handleBatchUploadSubmit}
              className="space-y-6"
            >
              {/* Compression Recommendation Banner if oversized */}
              {hasOversizedFiles && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-warning/30 bg-warning/5 text-base-content">
                  <iconsLib.warning className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-xs space-y-2 flex-1">
                    <div>
                      <span className="font-bold block text-base-content">
                        {t(AppLocales.Admin.Assets.UploadDialog.CompressTipTitle)}
                      </span>
                      <p className="text-base-content/80 leading-relaxed mt-0.5">
                        {t(AppLocales.Admin.Assets.UploadDialog.CompressTipDesc)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields Card */}
              <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                  <iconsLib.photo className="h-5 w-5 text-primary" />
                  <h3 className="text-body-m font-bold text-base-content">
                    Upload Configuration
                  </h3>
                </div>

                <Dropdown
                  label={t(AppLocales.Admin.Assets.UploadDialog.TypeLabel)}
                  value={uploadType}
                  options={filteredTypeOptions.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  onValueChange={(val) => {
                    setUploadType(val);
                    if (!isChildAssetType(val)) {
                      setUploadParentAssetId("");
                      setParentAssetError("");
                    }
                  }}
                  disabled={isLoading}
                />

                {isChildAssetType(uploadType) && (
                  <AdminParentAssetSelect
                    value={uploadParentAssetId}
                    onChange={(id) => {
                      setUploadParentAssetId(id);
                      if (id) setParentAssetError("");
                    }}
                    targetType={uploadType}
                    disabled={isLoading}
                    error={parentAssetError}
                  />
                )}

                <TextInput
                  label={t(AppLocales.Admin.Assets.UploadDialog.TitleLabel)}
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Optional title"
                  disabled={isLoading}
                />

                <TextArea
                  label={t(AppLocales.Admin.Assets.UploadDialog.DescriptionLabel)}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Optional description"
                  disabled={isLoading}
                  rows={2}
                />

                <FileInput
                  label={t(AppLocales.Admin.Assets.UploadDialog.FileLabel)}
                  buttonText={t(
                    AppLocales.Admin.Assets.UploadDialog.ChooseFiles,
                    {
                      count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
                    },
                  )}
                  multiple
                  onFilesChange={handleFilesSelected}
                  disabled={isLoading}
                  helperText={t(
                    AppLocales.Admin.Assets.UploadDialog.FileLimitHint,
                    {
                      count: UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT,
                      imageLimit: UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB,
                      videoLimit: UPLOAD_SIZE_LIMITS.MAX_VIDEO_SIZE_MB,
                    },
                  )}
                />

                {/* Selected Files Tray */}
                {fileItems.length > 0 && (
                  <div className="border border-base-200 rounded-xl p-4 bg-base-200/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-base-content/80 pb-2 border-b border-base-200">
                      <span>
                        {t(AppLocales.Admin.Assets.UploadDialog.SelectedFiles)}{" "}
                        ({fileItems.length} /{" "}
                        {UPLOAD_SIZE_LIMITS.MAX_FILE_COUNT}) •{" "}
                        {formatAssetFileSize(totalSize)}
                      </span>
                      {!isLoading && (
                        <Button
                          variant={ButtonVariants.TERTIARY}
                          size={ComponentSizes.SM}
                          onClick={handleClearAllFiles}
                          className="text-error hover:bg-error/10 h-7 px-2.5 text-xs"
                        >
                          {t(AppLocales.Admin.Assets.UploadDialog.ClearAll)}
                        </Button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {fileItems.map((item, index) => (
                        <div
                          key={`${item.file.name}-${index}`}
                          className="flex items-center justify-between gap-3 p-2 rounded-lg bg-base-100 border border-base-200 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {item.previewUrl ? (
                              <div className="w-10 h-10 rounded-md shrink-0 overflow-hidden border border-base-300">
                                <Image
                                  src={item.previewUrl}
                                  alt={item.file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-md shrink-0 bg-base-200 flex items-center justify-center border border-base-300">
                                <iconsLib.document className="w-5 h-5 text-base-content/60" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-base-content">
                                {item.file.name}
                              </span>
                              <span className="text-[11px] text-base-content/60">
                                {formatAssetFileSize(item.file.size)}
                              </span>
                            </div>
                          </div>

                          {!isLoading && (
                            <Button
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
                {isLoading && (
                  <div className="space-y-2 pt-2">
                    <ProgressBar
                      value={uploadProgress}
                      showPercentage
                      label={
                        uploadStatusMessage ||
                        t(AppLocales.Admin.Assets.UploadDialog.Uploading)
                      }
                      variant={ProgressBarVariants.PRIMARY}
                    />
                  </div>
                )}
              </div>

              <FormActionRow
                cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                submitLabel={
                  isLoading
                    ? t(AppLocales.Admin.Assets.UploadDialog.Uploading)
                    : `${t(AppLocales.Admin.Assets.UploadDialog.UploadButton)}${
                        fileItems.length > 1 ? ` (${fileItems.length})` : ""
                      }`
                }
                onCancel={onCancel}
              />
            </FormContainer>
          </div>
        </div>
      ) : asset ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset Preview and Details Card */}
            <div className="lg:col-span-1 h-fit bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
              <h3 className="font-semibold text-base-content text-lg">
                {t(AppLocales.Admin.Assets.Table.Preview)}
              </h3>

              <div className="w-full aspect-video rounded-lg overflow-hidden bg-base-200 flex items-center justify-center border border-base-300">
                {isImageAsset(asset) || getAssetThumbnail(asset)?.url ? (
                  <Image
                    src={getAssetThumbnail(asset)?.url || asset.url}
                    alt={asset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                    fallback={
                      <div className="flex flex-col items-center gap-2 text-base-content/60">
                        <iconsLib.photo className="w-12 h-12" />
                        <span className="text-xs uppercase font-medium">
                          {asset.format || "Media"}
                        </span>
                      </div>
                    }
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-base-content/60">
                    <iconsLib.photo className="w-12 h-12" />
                    <span className="text-xs uppercase font-medium">
                      {asset.format || "Media"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">
                    {t(AppLocales.Admin.Assets.Table.Type)}
                  </span>
                  <Badge>{asset.type}</Badge>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">
                    {t(AppLocales.Admin.Assets.Table.Format)}
                  </span>
                  <span className="font-mono text-xs uppercase font-medium text-base-content">
                    {asset.format || t(AppLocales.Common.NotAvailable)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">
                    {t(AppLocales.Admin.Assets.Table.Size)}
                  </span>
                  <span className="text-base-content font-medium">
                    {formatAssetFileSize(asset.size_bytes)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">
                    {t(AppLocales.Admin.Assets.Detail.Status)}
                  </span>
                  <StatusBadge status={asset.status || ASSET_STATUSES.READY} />
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">
                    {t(AppLocales.Admin.Assets.Table.Created)}
                  </span>
                  <span className="text-base-content/70">
                    <DateTime
                      value={asset.created_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2 space-y-4">
              <FormContainer onSubmit={handleEditSubmit}>
                <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 border-b border-base-200 pb-3">
                    <iconsLib.pencilSquare className="h-5 w-5 text-primary" />
                    <h3 className="text-body-m font-bold text-base-content">
                      {t(AppLocales.Admin.Assets.Detail.Title)}
                    </h3>
                  </div>

                  <TextInput
                    label={t(AppLocales.Admin.Assets.Table.Name)}
                    value={editName}
                    disabled
                  />

                  <TextInput
                    label={t(AppLocales.Admin.Assets.Table.Title)}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />

                  <TextArea
                    label={t(AppLocales.Admin.Assets.Table.Description)}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    rows={3}
                  />

                  <Dropdown
                    label={t(AppLocales.Admin.Assets.Table.Type)}
                    value={editType}
                    options={filteredTypeOptions.map((opt) => ({
                      value: opt.value,
                      label: opt.label,
                    }))}
                    onValueChange={(val) => {
                      setEditType(val);
                      if (!isChildAssetType(val)) {
                        setEditParentAssetId("");
                        setParentAssetError("");
                      }
                    }}
                    disabled={isChildAsset}
                  />

                  {isChildAssetType(editType) && (
                    <AdminParentAssetSelect
                      value={editParentAssetId}
                      onChange={(id) => {
                        setEditParentAssetId(id);
                        if (id) setParentAssetError("");
                      }}
                      targetType={editType}
                      currentAssetId={asset?.id}
                      disabled={isLoading}
                      error={parentAssetError}
                    />
                  )}
                </div>

                <FormActionRow
                  cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                  submitLabel={t(AppLocales.Admin.Common.Actions.Save)}
                  onCancel={onCancel}
                />
              </FormContainer>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2 xl:grid-cols-5">
                  {onDownload && (
                    <Button
                      variant={ButtonVariants.SECONDARY}
                      size={ComponentSizes.SM}
                      className="flex items-center justify-center gap-1.5 whitespace-nowrap"
                      onClick={onDownload}
                    >
                      <iconsLib.download className="w-4 h-4" />
                      {t(AppLocales.Admin.Assets.Download.Action)}
                    </Button>
                  )}

                  {asset.format === ASSET_FORMATS.VIDEO &&
                    onRegenerateThumbnail && (
                      <Button
                        variant={ButtonVariants.SECONDARY}
                        size={ComponentSizes.SM}
                        className="flex items-center justify-center gap-1.5 whitespace-nowrap"
                        onClick={onRegenerateThumbnail}
                        isLoading={isUpdatingThumbnail}
                        disabled={isUpdatingThumbnail}
                      >
                        <iconsLib.arrowPath className="w-4 h-4" />
                        {t(AppLocales.Admin.Assets.Thumbnail.Regenerate)}
                      </Button>
                    )}

                  {(asset.format === ASSET_FORMATS.VIDEO ||
                    asset.format === ASSET_FORMATS.AUDIO) &&
                    onUploadThumbnail && (
                      <FileInput
                        accept="image/*"
                        disabled={isUpdatingThumbnail}
                        onChange={(file) => {
                          if (file) void onUploadThumbnail(file);
                        }}
                        buttonText={
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <iconsLib.upload className="w-4 h-4" />
                            {t(
                              isUpdatingThumbnail
                                ? AppLocales.Admin.Assets.Thumbnail.Uploading
                                : AppLocales.Admin.Assets.Thumbnail.Upload,
                            )}
                          </span>
                        }
                      />
                    )}

                  {(asset.format === ASSET_FORMATS.VIDEO ||
                    asset.format === ASSET_FORMATS.AUDIO) &&
                    onUploadSubtitle && (
                      <FileInput
                        accept=".srt"
                        disabled={isUpdatingSubtitle}
                        onChange={(file) => {
                          if (!file) return;
                          if (!isSrtSubtitleFile(file)) {
                            setAlertMessage(
                              t(AppLocales.Admin.Assets.Subtitle.InvalidType),
                            );
                            return;
                          }
                          if (
                            file.size > UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_BYTES
                          ) {
                            setAlertMessage(
                              t(AppLocales.Admin.Assets.Subtitle.TooLarge, {
                                size: UPLOAD_SIZE_LIMITS.MAX_NON_VIDEO_SIZE_MB,
                              }),
                            );
                            return;
                          }
                          void onUploadSubtitle(file);
                        }}
                        buttonText={
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <iconsLib.upload className="w-4 h-4" />
                            {t(
                              isUpdatingSubtitle
                                ? AppLocales.Admin.Assets.Subtitle.Uploading
                                : AppLocales.Admin.Assets.Subtitle.Upload,
                            )}
                          </span>
                        }
                      />
                    )}

                  {onCompress &&
                    asset.status !== ASSET_STATUSES.OPTIMAL &&
                    asset.status !== ASSET_STATUSES.PROCESSING && (
                      <Button
                        variant={ButtonVariants.SECONDARY}
                        size={ComponentSizes.SM}
                        className="flex items-center justify-center gap-1.5 whitespace-nowrap"
                        onClick={onCompress}
                        isLoading={isCompressing}
                        disabled={isCompressing}
                      >
                        <iconsLib.sparkles className="w-4 h-4 text-primary" />
                        <span>
                          {t(AppLocales.Admin.Assets.Compression.Compress)}
                        </span>
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-base-200 pb-3">
              <iconsLib.document className="h-5 w-5 text-primary" />
              <h3 className="text-body-m font-bold text-base-content">
                {t(AppLocales.Admin.Assets.Detail.Children)}
              </h3>
            </div>
            <AdminAssetChildrenTable
              assets={getAssetChildren(asset)}
              onDownload={onDownloadChild}
              onEdit={onEditChild}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};
