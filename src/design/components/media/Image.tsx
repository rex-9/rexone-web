import React from "react";

export interface IImageAsset {
  src: string;
  alt: string;
  title?: string;
}

export interface IImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  asset?: IImageAsset;
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  onError?: () => void;
}

export const Image: React.FC<IImageProps> = ({
  asset,
  src,
  alt,
  title,
  className,
  onError,
  loading = "lazy",
  ...rest
}) => {
  const finalSrc = asset?.src ?? src ?? "";
  const finalAlt = alt ?? asset?.alt ?? "";
  const finalTitle = title ?? asset?.title ?? finalAlt;

  return (
    <img
      src={finalSrc}
      alt={finalAlt}
      aria-label={finalAlt}
      title={finalTitle}
      className={className}
      loading={loading}
      onError={onError}
      {...rest}
    />
  );
};

export const Asset = Image;

export default Image;
