import React from "react";

export interface IVideoAsset {
  src: string;
  alt: string;
  title?: string;
}

export interface IVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  asset?: IVideoAsset;
  src?: string;
  alt?: string;
  title?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export const Video: React.FC<IVideoProps> = ({
  asset,
  src,
  alt,
  title,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  className = "",
  ...rest
}) => {
  const finalSrc = asset?.src ?? src ?? "";
  const finalAlt = alt ?? asset?.alt ?? "";
  const finalTitle = title ?? asset?.title ?? finalAlt;

  return (
    <video
      className={className}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      aria-label={finalAlt}
      title={finalTitle}
      {...rest}
    >
      <source src={finalSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export const VideoPlayer = Video;

export default Video;
