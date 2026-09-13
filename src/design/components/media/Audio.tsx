import React from "react";

export interface IAudioAsset {
  src: string;
  title?: string;
  type?: string;
}

export interface IAudioProps
  extends Omit<React.AudioHTMLAttributes<HTMLAudioElement>, "src"> {
  asset?: IAudioAsset;
  src?: string;
  title?: string;
  type?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export const Audio: React.FC<IAudioProps> = ({
  asset,
  src,
  title,
  type,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  className = "",
  ...rest
}) => {
  const finalSrc = asset?.src ?? src ?? "";
  const finalTitle = title ?? asset?.title;
  const finalType = type ?? asset?.type ?? "audio/mpeg";

  return (
    <audio
      className={className}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      title={finalTitle}
      {...rest}
    >
      <source src={finalSrc} type={finalType} />
      Your browser does not support the audio tag.
    </audio>
  );
};

export default Audio;
