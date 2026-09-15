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
  src: string;
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
        {tracks.map((track, index) => (
          <Track
            key={`${track.src}-${index}`}
            src={track.src}
            kind={track.kind ?? "subtitles"}
            label={track.label}
            language={track.language}
            default={track.default ?? index === 0}
            type={track.type ?? "srt"}
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
