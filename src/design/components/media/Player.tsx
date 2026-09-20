import React from "react";
import {
  MediaPlayer,
  MediaProvider,
  Track,
  type MediaPlayerProps,
} from "@vidstack/react";
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

export type TPlayerView = "audio" | "video";

export type TPlayerTrackKind =
  | "subtitles"
  | "captions"
  | "descriptions"
  | "chapters"
  | "metadata";

export type TPlayerTrackFormat = "srt" | "vtt" | "ssa" | "ass" | "json";

export interface IPlayerTrack {
  src?: string;
  content?: string | null;
  kind?: TPlayerTrackKind;
  label?: string;
  language?: string;
  default?: boolean;
  type?: TPlayerTrackFormat;
}

export interface IPlayerAsset {
  src: string;
  alt?: string;
  title?: string;
  type?: string;
}

export interface IPlayerProps {
  view: TPlayerView;
  asset?: IPlayerAsset;
  src?: string;
  alt?: string;
  title?: string;
  type?: string;
  tracks?: IPlayerTrack[];
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

/**
 * Normalizes SRT / VTT content into standard WebVTT format for browser and Vidstack player.
 * Converts SRT comma timestamps (00:00:01,000) to WebVTT period timestamps (00:00:01.000),
 * strips BOM if present, and ensures the WEBVTT header is present.
 */
export function srtToVtt(content: string): string {
  if (!content) return "";
  const trimmed = content.replace(/^\uFEFF/, "").trim();
  if (trimmed.startsWith("WEBVTT")) {
    return trimmed;
  }
  const normalized = trimmed
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(
      /(?:(\d{1,2}):)?(\d{2}):(\d{2}),(\d{3})/g,
      (_match, h, m, s, ms) => {
        const hours = h !== undefined ? h.padStart(2, "0") : "00";
        return `${hours}:${m}:${s}.${ms}`;
      },
    );
  return `WEBVTT\n\n${normalized}`;
}

export const Player: React.FC<IPlayerProps> = ({
  view,
  asset,
  src,
  alt,
  title,
  type,
  tracks = [],
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  className = "",
}) => {
  const finalSrc = asset?.src ?? src ?? "";
  const finalAlt = alt ?? asset?.alt ?? "";
  const finalTitle = title ?? asset?.title ?? finalAlt;
  const finalType = type ?? asset?.type;
  const playerSrc = (
    finalType ? { src: finalSrc, type: finalType } : finalSrc
  ) as MediaPlayerProps["src"];

  const processedTracks = React.useMemo(() => {
    return tracks
      .map((track) => {
        let finalTrackSrc = track.src || "";
        let finalTrackType = track.type ?? "vtt";

        // FAST PATH: In-memory subtitle content provided directly by API payload.
        // Converts SRT/VTT text to an in-memory Data URI (data:text/vtt;charset=utf-8,...).
        // Benefits: 0 network requests, instantaneous rendering, immune to browser CORS policies.
        if (track.content) {
          const vtt = srtToVtt(track.content);
          finalTrackSrc = `data:text/vtt;charset=utf-8,${encodeURIComponent(vtt)}`;
          finalTrackType = "vtt";
        } else if (track.src && !track.type) {
          // FALLBACK PATH: Remote URL (e.g. Core's /v1/assets/:id/subtitles/:subtitle_id or S3 URL).
          // Used when raw text content is omitted from the JSON payload.
          finalTrackType = track.src.endsWith(".srt") ? "srt" : "vtt";
        }

        return {
          ...track,
          src: finalTrackSrc,
          type: finalTrackType,
        };
      })
      .filter((t) => Boolean(t.src));
  }, [tracks]);

  if (!finalSrc) return null;

  return (
    <MediaPlayer
      className={className}
      style={{ ["--video-volume-slider-max-width" as string]: "7.5rem" }}
      title={finalTitle}
      src={playerSrc}
      autoPlay={autoplay}
      loop={loop}
      playsInline
      viewType={view}
      aria-label={finalAlt || finalTitle}
      {...(muted ? { muted: true } : {})}
    >
      <MediaProvider>
        {processedTracks.map((track, index) => (
          <Track
            key={`${track.src}-${index}`}
            src={track.src}
            kind={track.kind ?? "subtitles"}
            label={track.label}
            language={track.language}
            default={track.default ?? index === 0}
            type={track.type ?? "vtt"}
          />
        ))}
      </MediaProvider>
      {controls &&
        (view === "audio" ? (
          <DefaultAudioLayout
            icons={defaultLayoutIcons}
            smallLayoutWhen={false}
            noAudioGain
          />
        ) : (
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            smallLayoutWhen={false}
            noAudioGain
          />
        ))}
    </MediaPlayer>
  );
};

export default Player;
