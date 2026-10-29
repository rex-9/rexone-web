// src/modules/admin/asset/components/AdminAssetMediaViewer.tsx

import React, { useEffect, useMemo, useState } from "react";
import { iconsLib } from "../../../../assets";
import { Button, Image, Player } from "../../../../design";
import { ButtonVariants } from "../../../../design/constants";
import { AppLocales, useTranslate } from "../../../../locales";
import AppConfig from "../../../../AppConfig";
import AssetController from "../../../asset/asset.controller";
import type { IAdminAsset } from "../types";
import type { IAssetPlaybackResponse } from "../../../../models";
import {
  formatAssetFileSize,
  getAssetThumbnail,
  isImageAsset,
  isVideoAsset,
  isAudioAsset,
} from "../constants";

export interface IAdminAssetMediaViewerProps {
  asset: IAdminAsset;
  onDownload?: () => void;
  showDownload?: boolean;
  className?: string;
}

export const AdminAssetMediaViewer: React.FC<IAdminAssetMediaViewerProps> = ({
  asset,
  onDownload,
  showDownload = true,
  className = "",
}) => {
  const t = useTranslate();

  const isVideo = isVideoAsset(asset);
  const isAudio = isAudioAsset(asset);
  const isImage = isImageAsset(asset);

  const [playback, setPlayback] = useState<IAssetPlaybackResponse | null>(null);
  const [isLoadingPlayback, setIsLoadingPlayback] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!asset.id || (!isVideo && !isAudio)) {
      setPlayback(null);
      setIsLoadingPlayback(false);
      setPlaybackError(null);
      return;
    }

    const fetchPlayback = async () => {
      setIsLoadingPlayback(true);
      setPlaybackError(null);
      const res = await AssetController.getPlayback(asset.id);
      if (!isMounted) return;
      setIsLoadingPlayback(false);
      if (res.success && res.playback) {
        setPlayback(res.playback);
      } else {
        setPlaybackError(res.error || null);
      }
    };

    void fetchPlayback();

    return () => {
      isMounted = false;
    };
  }, [asset.id, isVideo, isAudio]);

  const posterUrl = useMemo(() => {
    return (
      getAssetThumbnail(asset)?.url ||
      playback?.media?.thumbnail?.url ||
      undefined
    );
  }, [asset, playback?.media?.thumbnail?.url]);

  const mediaUrl = useMemo(() => {
    return playback?.delivery?.url || asset.url || "";
  }, [playback?.delivery?.url, asset.url]);

  const tracks = useMemo(() => {
    const rawSubtitles =
      playback?.media?.subtitles || asset.children?.subtitles || [];
    return rawSubtitles
      .filter((s) => Boolean(s.content || s.core_url || s.url))
      .map((subtitle, index) => {
        const fallbackUrl = subtitle.core_url
          ? subtitle.core_url.startsWith("http")
            ? subtitle.core_url
            : `${AppConfig.SERVER_BASE_URL}${subtitle.core_url}`
          : subtitle.url;

        return {
          src: fallbackUrl,
          content: subtitle.content,
          kind: "subtitles" as const,
          label:
            subtitle.title || subtitle.name || `Subtitle ${index + 1}`,
          default: index === 0,
        };
      });
  }, [playback?.media?.subtitles, asset.children?.subtitles]);

  return (
    <div className={`space-y-4 ${className}`}>
      {isVideo ? (
        <div className="overflow-hidden rounded-xl border border-glass-border bg-black/90 shadow-glass-card">
          {isLoadingPlayback && !mediaUrl ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-base-content/60">
              <iconsLib.arrowPath className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs">Loading video stream...</span>
            </div>
          ) : mediaUrl ? (
            <div className="aspect-video w-full bg-base-300">
              <Player
                view="video"
                src={mediaUrl}
                type={playback?.media.content_type || "video/mp4"}
                poster={posterUrl}
                alt={asset.title || asset.name}
                tracks={tracks}
                className="aspect-video h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 p-6 text-center text-base-content/60">
              <iconsLib.photo className="h-10 w-10 text-base-content/30" />
              <span className="text-xs">
                {playbackError || "Video unavailable"}
              </span>
            </div>
          )}
        </div>
      ) : isAudio ? (
        <div className="w-full space-y-3">
          {posterUrl ? (
            <div className="overflow-hidden rounded-xl border border-glass-border bg-base-200/50 p-2 shadow-inner flex items-center justify-center">
              <Image
                src={posterUrl}
                alt={asset.title || asset.name}
                className="max-h-64 w-full rounded-lg object-contain"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-glass-border bg-base-200/40 p-6 text-center">
              <div className="rounded-full bg-primary/10 p-4 text-primary">
                <iconsLib.speaker className="h-8 w-8" />
              </div>
              <div className="max-w-xs">
                <h4 className="text-sm font-semibold text-base-content truncate">
                  {asset.title || asset.name}
                </h4>
                <p className="text-xs text-base-content/60 font-mono mt-0.5">
                  {asset.format?.toUpperCase() || "AUDIO"} •{" "}
                  {formatAssetFileSize(asset.size_bytes)}
                </p>
              </div>
            </div>
          )}

          <div className="w-full">
            {isLoadingPlayback && !mediaUrl ? (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-base-content/60">
                <iconsLib.arrowPath className="h-4 w-4 animate-spin text-primary" />
                <span>Loading audio stream...</span>
              </div>
            ) : mediaUrl ? (
              <Player
                view="audio"
                src={mediaUrl}
                type={playback?.media.content_type || "audio/mp3"}
                title={asset.title || asset.name}
                tracks={tracks}
                className="w-full rounded-lg border border-glass-border"
              />
            ) : (
              <p className="text-xs text-error py-2">
                {playbackError || "Audio unavailable"}
              </p>
            )}
          </div>
        </div>
      ) : isImage ? (
        <div className="group relative overflow-hidden rounded-xl border border-glass-border bg-base-200/50 p-2 shadow-inner flex items-center justify-center">
          <Image
            src={asset.url || getAssetThumbnail(asset)?.url || ""}
            alt={asset.title || asset.name}
            referrerPolicy="no-referrer"
            className="max-h-80 w-full rounded-lg object-contain"
          />
          {asset.url && (
            <a
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 rounded-lg border border-glass-border bg-base-100/80 p-2 text-base-content/80 shadow-sm backdrop-blur-md transition-all hover:bg-base-100 hover:text-primary"
              title="Open full size"
            >
              <iconsLib.externalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-glass-border bg-base-200/40 p-6 text-center">
          <div className="rounded-full bg-base-content/10 p-4 text-base-content/70">
            <iconsLib.document className="h-8 w-8" />
          </div>
          <div className="max-w-xs">
            <h4 className="text-sm font-semibold text-base-content truncate">
              {asset.title || asset.name}
            </h4>
            <p className="text-xs text-base-content/60 font-mono mt-0.5">
              {asset.format?.toUpperCase() ||
                asset.extension?.toUpperCase() ||
                "FILE"}{" "}
              • {formatAssetFileSize(asset.size_bytes)}
            </p>
          </div>
          {asset.url && (
            <a
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1 font-medium"
            >
              <span>Open raw file</span>
              <iconsLib.externalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {showDownload && onDownload && (
        <div className="pt-2">
          <Button
            variant={ButtonVariants.SECONDARY}
            fullWidth
            onClick={onDownload}
            className="gap-2 font-semibold"
          >
            <iconsLib.download className="h-4 w-4 text-primary" />
            {t(AppLocales.Admin.Assets.Download.Action)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminAssetMediaViewer;
