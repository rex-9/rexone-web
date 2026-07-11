// src/components/Media/Image.tsx
import React from "react";

interface ImageProps {
  asset: { src: string; alt: string; title?: string };
  className?: string;
  onError?: () => void;
}

export const Image: React.FC<ImageProps> = ({ asset, className, onError }) => {
  return (
    <img
      src={asset.src}
      alt={asset.alt}
      aria-label={asset.alt}
      title={asset.title ?? asset.alt}
      className={className}
      loading="lazy"
      onError={onError}
    />
  );
};
