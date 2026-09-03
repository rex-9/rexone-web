import React, { useEffect, useState } from "react";

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
  fallback?: React.ReactNode;
}

export const Image: React.FC<IImageProps> = ({
  asset,
  src,
  alt,
  title,
  className,
  onError,
  fallback,
  loading = "lazy",
  referrerPolicy = "no-referrer",
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const finalSrc = asset?.src ?? src ?? "";
  const finalAlt = alt ?? asset?.alt ?? "";
  const finalTitle = title ?? asset?.title ?? finalAlt;

  useEffect(() => {
    setHasError(false);
  }, [finalSrc]);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={finalSrc}
      alt={finalAlt}
      aria-label={finalAlt}
      title={finalTitle}
      className={className}
      loading={loading}
      referrerPolicy={referrerPolicy}
      onError={handleError}
      {...rest}
    />
  );
};

export const Asset = Image;

export default Image;
