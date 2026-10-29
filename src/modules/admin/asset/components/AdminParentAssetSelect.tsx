// src/modules/admin/asset/components/AdminParentAssetSelect.tsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import { Badge, Button, ConfirmDialog, ListTile, SearchInput } from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { useLoading } from "../../../../contexts";
import type { IAdminAsset } from "../types";
import { ASSET_TYPES, formatAssetFileSize } from "../constants";
import { Admin } from "../..";

export interface IAdminParentAssetSelectProps {
  value: string;
  onChange: (id: string) => void;
  targetType: string;
  currentAssetId?: string;
  disabled?: boolean;
  error?: string;
}

export const AdminParentAssetSelect: React.FC<IAdminParentAssetSelectProps> = ({
  value,
  onChange,
  targetType,
  currentAssetId,
  disabled = false,
  error,
}) => {
  const t = useTranslate();
  const { isLoading, setLoading } = useLoading();
  const [parentAssets, setParentAssets] = useState<IAdminAsset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingReplaceParent, setPendingReplaceParent] =
    useState<IAdminAsset | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch parent assets on mount
  useEffect(() => {
    let isMounted = true;
    const loadParents = async () => {
      setLoading(true);
      try {
        const result = await Admin.AssetController.getAssets({
          record_scope: "parents",
          limit: 100,
        });
        if (isMounted && result.success && result.assets) {
          setParentAssets(result.assets);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void loadParents();
    return () => {
      isMounted = false;
    };
  }, [setLoading]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Eligible parent assets (exclude self)
  const eligibleParents = useMemo(() => {
    return parentAssets.filter((p) => p.id !== currentAssetId);
  }, [parentAssets, currentAssetId]);

  // Filtered by search query across name and title
  const filteredParents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return eligibleParents;
    return eligibleParents.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q)),
    );
  }, [eligibleParents, searchQuery]);

  // Find currently selected parent
  const selectedParent = useMemo(() => {
    return eligibleParents.find((p) => p.id === value);
  }, [eligibleParents, value]);

  const handleSelect = (parent: IAdminAsset) => {
    const isThumbnail = targetType === ASSET_TYPES.THUMBNAIL;
    const hasExistingThumbnail =
      isThumbnail &&
      Boolean(parent.children?.thumbnail) &&
      parent.children?.thumbnail?.id !== currentAssetId;

    if (hasExistingThumbnail) {
      setPendingReplaceParent(parent);
      return;
    }

    onChange(parent.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleConfirmReplace = () => {
    if (!pendingReplaceParent) return;
    onChange(pendingReplaceParent.id);
    setPendingReplaceParent(null);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = () => {
    onChange("");
    setSearchQuery("");
  };

  const isReplacingThumbnail =
    targetType === ASSET_TYPES.THUMBNAIL &&
    Boolean(selectedParent?.children?.thumbnail) &&
    selectedParent?.children?.thumbnail?.id !== currentAssetId;

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-body-s font-medium text-base-content/70">
        {t(AppLocales.Admin.Assets.Form.ParentAssetLabel)}{" "}
        <span className="text-error">*</span>
      </label>

      {/* Selected Parent Card or Selection Trigger */}
      {selectedParent ? (
        <div className="flex items-center justify-between p-3 rounded-lg border border-base-300 bg-base-200/50">
          <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
            <div className="w-9 h-9 rounded-md bg-base-300 flex items-center justify-center shrink-0 text-base-content/60">
              {selectedParent.format === "video" ? (
                <iconsLib.play className="w-5 h-5" />
              ) : selectedParent.format === "audio" ? (
                <iconsLib.speaker className="w-5 h-5" />
              ) : (
                <iconsLib.photo className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-base-content truncate">
                  {selectedParent.title || selectedParent.name}
                </span>
                {selectedParent.format && (
                  <Badge className="text-xs uppercase font-medium">
                    {selectedParent.format}
                  </Badge>
                )}
                {isReplacingThumbnail && (
                  <Badge className="text-xs bg-warning/20 text-warning border-warning/30">
                    Replacing Thumbnail
                  </Badge>
                )}
              </div>
              <p className="text-xs text-base-content/60 truncate font-mono mt-0.5">
                {selectedParent.name}
                {selectedParent.size_bytes != null &&
                  selectedParent.size_bytes > 0 &&
                  ` • ${formatAssetFileSize(selectedParent.size_bytes)}`}
              </p>
            </div>
          </div>

          {!disabled && (
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant={ButtonVariants.FLAT}
                size={ComponentSizes.XS}
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-xs font-medium"
              >
                Change
              </Button>
              <Button
                variant={ButtonVariants.FLAT}
                size={ComponentSizes.XS}
                onClick={handleClear}
                className="text-xs text-error hover:bg-error/10"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            role="button"
            tabIndex={disabled || isLoading ? -1 : 0}
            onClick={() => {
              if (!disabled && !isLoading) setIsOpen((prev) => !prev);
            }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !disabled && !isLoading) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
              }
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left text-sm transition-colors cursor-pointer select-none ${
              error
                ? "border-error focus:ring-1 focus:ring-error"
                : "border-glass-border hover:border-glass-border-hover focus:border-primary focus:ring-1 focus:ring-primary shadow-glass-card"
            } bg-glass-card text-base-content ${disabled || isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
          >
            <span className={value ? "text-base-content" : "text-base-content/40"}>
              {isLoading
                ? t(AppLocales.Admin.Assets.Form.ParentAssetLoading)
                : t(AppLocales.Admin.Assets.Form.ParentAssetPlaceholder)}
            </span>
            <iconsLib.chevronDown className="w-4 h-4 text-base-content/40 ml-2 shrink-0" />
          </div>
        </div>
      )}

      {/* Searchable Options Popover */}
      {isOpen && !disabled && (
        <div className="relative z-20">
          <div className="absolute left-0 right-0 top-1 bg-glass-card/95 border border-glass-border rounded-xl shadow-glass-card backdrop-blur-xl overflow-hidden animate-in fade-in-50 duration-150">
            {/* Search Input Filter */}
            <div className="p-2 border-b border-glass-border/40 bg-glass-card/50">
              <SearchInput
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder={t(
                  AppLocales.Admin.Assets.Form.ParentAssetSearchPlaceholder,
                )}
                className="text-xs"
              />
            </div>

            {/* Results List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-glass-border/40">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-base-content/60 flex items-center justify-center gap-2">
                  <iconsLib.arrowPath className="w-4 h-4 animate-spin text-primary" />
                  <span>{t(AppLocales.Admin.Assets.Form.ParentAssetLoading)}</span>
                </div>
              ) : filteredParents.length === 0 ? (
                <div className="p-4 text-center text-xs text-base-content/50">
                  {t(AppLocales.Admin.Assets.Form.ParentAssetNone)}
                </div>
              ) : (
                filteredParents.map((parent) => {
                  const isThumbnail = targetType === ASSET_TYPES.THUMBNAIL;
                  const hasThumb =
                    isThumbnail &&
                    Boolean(parent.children?.thumbnail) &&
                    parent.children?.thumbnail?.id !== currentAssetId;
                  const isSelected = parent.id === value;

                  return (
                    <ListTile
                      key={parent.id}
                      onClick={() => handleSelect(parent)}
                      contentPadding="p-2.5"
                      className={`text-xs transition-colors hover:bg-glass-card-hover rounded-none ${
                        isSelected ? "bg-primary/10" : ""
                      }`}
                      leading={
                        <div className="w-7 h-7 rounded bg-glass-card/60 border border-glass-border/40 flex items-center justify-center shrink-0 text-base-content/60">
                          {parent.format === "video" ? (
                            <iconsLib.play className="w-3.5 h-3.5" />
                          ) : parent.format === "audio" ? (
                            <iconsLib.speaker className="w-3.5 h-3.5" />
                          ) : (
                            <iconsLib.photo className="w-3.5 h-3.5" />
                          )}
                        </div>
                      }
                      title={
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-base-content truncate">
                            {parent.title || parent.name}
                          </span>
                          {parent.format && (
                            <Badge className="text-[10px] px-1 py-0 uppercase">
                              {parent.format}
                            </Badge>
                          )}
                        </div>
                      }
                      subtitle={
                        <span className="text-[11px] text-base-content/50 truncate font-mono block">
                          {parent.name}
                          {parent.size_bytes != null &&
                            parent.size_bytes > 0 &&
                            ` • ${formatAssetFileSize(parent.size_bytes)}`}
                        </span>
                      }
                      trailing={
                        <div className="flex items-center gap-1.5 shrink-0">
                          {hasThumb && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-warning/15 text-warning border border-warning/30">
                              {t(
                                AppLocales.Admin.Assets.Form
                                  .ParentAssetAlreadyHasThumbnail,
                              )}
                            </span>
                          )}
                          {isSelected && (
                            <iconsLib.check className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>
                      }
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {error && <p className="text-xs text-error mt-1">{error}</p>}

      {/* Confirmation Dialog for Replacing Existing Thumbnail */}
      <ConfirmDialog
        isOpen={Boolean(pendingReplaceParent)}
        onClose={() => setPendingReplaceParent(null)}
        onConfirm={handleConfirmReplace}
        title={t(AppLocales.Admin.Assets.Form.ReplaceThumbnailTitle)}
        message={t(AppLocales.Admin.Assets.Form.ReplaceThumbnailMessage, {
          parentTitle:
            pendingReplaceParent?.title || pendingReplaceParent?.name || "",
          existingThumbnail:
            pendingReplaceParent?.children?.thumbnail?.title ||
            pendingReplaceParent?.children?.thumbnail?.name ||
            "thumbnail",
        })}
        confirmLabel={t(AppLocales.Admin.Assets.Form.ReplaceThumbnailConfirm)}
        cancelLabel={t(AppLocales.Admin.Assets.Form.ReplaceThumbnailCancel)}
        isDestructive={false}
      />
    </div>
  );
};
