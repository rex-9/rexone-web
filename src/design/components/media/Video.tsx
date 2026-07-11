// src/components/Media/Video.tsx
import React from "react";

interface VideoProps {
  asset: { src: string; alt: string; title?: string };
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export const Video: React.FC<VideoProps> = ({
  asset,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  className = "",
}) => {
  return (
    <video
      className={className}
      controls={controls}
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      aria-label={asset.alt}
      title={asset.title ?? asset.alt}
    >
      <source src={asset.src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
