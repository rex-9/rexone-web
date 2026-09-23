import React from "react";
import {
  MediaPlayer,
  MediaProvider,
  Track,
  isHLSProvider,
  type MediaPlayerProps,
  type MediaProviderAdapter,
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
  preload?: "none" | "metadata" | "auto";
  className?: string;
}

function parseTimestampToMs(
  hStr: string | undefined,
  mStr: string,
  sStr: string,
  msStr: string,
): number {
  const h = hStr !== undefined ? parseInt(hStr, 10) : 0;
  const m = parseInt(mStr, 10);
  const s = parseInt(sStr, 10);
  const ms = parseInt(msStr, 10);
  return h * 3600000 + m * 60000 + s * 1000 + ms;
}

function formatVttTimestamp(totalMs: number): string {
  const ms = Math.max(0, Math.floor(totalMs % 1000));
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  const mmm = String(ms).padStart(3, "0");

  return `${hh}:${mm}:${ss}.${mmm}`;
}

const TIMESTAMP_REGEX =
  /(?:(\d{1,2}):)?(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(?:(\d{1,2}):)?(\d{2}):(\d{2})[,.](\d{3})(.*)/;

/**
 * Normalizes SRT / VTT content into standard WebVTT format for browser and Vidstack player.
 * Converts SRT comma timestamps (00:00:01,000) to WebVTT period timestamps (00:00:01.000),
 * strips BOM if present, pads single-digit hours, and bridges small inter-cue gaps (<= 800ms)
 * to prevent subtitles from disappearing or flickering during fast-forward and rewind.
 */
export function srtToVtt(content: string, maxGapMs = 800): string {
  if (!content) return "";
  const trimmed = content.replace(/^\uFEFF/, "").trim();
  const normalized = trimmed.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const rawBlocks = normalized.split(/\n\s*\n/);
  const cues: Array<{
    prefix: string[];
    startMs: number;
    endMs: number;
    settings: string;
    textLines: string[];
  }> = [];
  const nonCueHeaders: string[] = [];

  for (const block of rawBlocks) {
    const lines = block.split("\n");
    let matchIndex = -1;
    let match: RegExpMatchArray | null = null;

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(TIMESTAMP_REGEX);
      if (m) {
        matchIndex = i;
        match = m;
        break;
      }
    }

    if (match && matchIndex !== -1) {
      const startMs = parseTimestampToMs(match[1], match[2], match[3], match[4]);
      const endMs = parseTimestampToMs(match[5], match[6], match[7], match[8]);
      const settings = match[9] || "";
      const prefix = lines.slice(0, matchIndex);
      const textLines = lines.slice(matchIndex + 1);

      cues.push({
        prefix,
        startMs,
        endMs,
        settings,
        textLines,
      });
    } else {
      if (cues.length === 0 && !block.trim().startsWith("WEBVTT")) {
        nonCueHeaders.push(block);
      }
    }
  }

  if (cues.length === 0) {
    if (trimmed.startsWith("WEBVTT")) return trimmed;
    return `WEBVTT\n\n${normalized}`;
  }

  const resultBlocks: string[] = [];
  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    let cueEndMs = cue.endMs;

    if (i + 1 < cues.length) {
      const nextStartMs = cues[i + 1].startMs;
      const gap = nextStartMs - cueEndMs;
      if (gap > 0 && gap <= maxGapMs) {
        cueEndMs = nextStartMs;
      } else if (gap > maxGapMs) {
        const extended = cueEndMs + 300;
        cueEndMs = extended < nextStartMs ? extended : nextStartMs;
      }
    }

    const timestampLine = `${formatVttTimestamp(cue.startMs)} --> ${formatVttTimestamp(cueEndMs)}${cue.settings}`;
    const blockLines = [...cue.prefix, timestampLine, ...cue.textLines];
    resultBlocks.push(blockLines.join("\n"));
  }

  const cueBody = resultBlocks.join("\n\n");
  if (nonCueHeaders.length > 0) {
    return `WEBVTT\n\n${nonCueHeaders.join("\n\n")}\n\n${cueBody}`;
  }
  return `WEBVTT\n\n${cueBody}`;
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
  preload = "metadata",
  className = "",
}) => {
  const finalSrc = asset?.src ?? src ?? "";
  const finalAlt = alt ?? asset?.alt ?? "";
  const finalTitle = title ?? asset?.title ?? finalAlt;
  const finalType = type ?? asset?.type;
  const playerSrc = (
    finalType ? { src: finalSrc, type: finalType } : finalSrc
  ) as MediaPlayerProps["src"];

  const handleProviderChange = React.useCallback(
    (provider: MediaProviderAdapter | null) => {
      if (isHLSProvider(provider)) {
        // Stabilize HLS streaming and enable instant chunk rewinding from memory:
        // - backBufferLength: keeps 60s of past chunks in memory for zero-latency rewind
        // - maxBufferLength: buffers 60s ahead for smooth playback on slower connections
        // - maxBufferSize: limits cache size to 60MB
        provider.config = {
          backBufferLength: 60,
          maxBufferLength: 60,
          maxBufferSize: 60 * 1024 * 1024,
        };
      }
    },
    [],
  );

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
      preload={preload}
      viewType={view}
      aria-label={finalAlt || finalTitle}
      onProviderChange={handleProviderChange}
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
