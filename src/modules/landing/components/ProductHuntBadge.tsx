// src/modules/landing/components/ProductHuntBadge.tsx

import React, { useState } from "react";
import { Asset, TextLink } from "../../../design";

export interface IProductHuntBadgeProps {
  className?: string;
  theme?: "light" | "dark" | "neutral";
}

export const ProductHuntBadge: React.FC<IProductHuntBadgeProps> = ({
  className = "",
  theme = "dark",
}) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return null;
  }

  return (
    <div
      className={`relative inline-flex group items-center justify-center ${className}`}
    >
      {/* Ambient Neon Backlight Halo */}
      <div
        className="absolute -inset-1.5 rounded-2xl bg-linear-to-r from-primary via-primary-light to-primary opacity-0 blur-md transition-all duration-300 group-hover:opacity-100 group-hover:blur-lg pointer-events-none"
        aria-hidden="true"
      />

      <TextLink
        to="https://www.producthunt.com/products/rexone/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-rexone"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Review RexOne on Product Hunt"
        className="relative z-10 inline-flex items-center justify-center rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl p-1 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-neon-lg active:scale-95 cursor-pointer select-none no-underline"
        style={{ width: "258px", height: "62px" }}
      >
        <Asset
          src={`https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1330748&theme=${theme}`}
          alt="RexOne - Start from One, not Zero. Tri-platform architecture foundation | Product Hunt"
          width={250}
          height={54}
          onError={() => setImageError(true)}
          className="w-62.5 h-13.5 rounded-xl object-contain transition-all duration-300 drop-shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover:drop-shadow-[0_0_16px_var(--color-primary)] group-hover:scale-[1.02]"
        />
      </TextLink>
    </div>
  );
};

export default ProductHuntBadge;
