// src/modules/landing/components/ProductHuntBadge.tsx

import React, { useState } from "react";

export interface IProductHuntBadgeProps {
  className?: string;
  theme?: "light" | "dark" | "neutral";
}

export const ProductHuntBadge: React.FC<IProductHuntBadgeProps> = ({
  className = "",
  theme = "dark",
}) => {
  const [imageError, setImageError] = useState(false);
  const isDark = theme === "dark";

  return (
    <div className={`relative inline-flex group items-center justify-center ${className}`}>
      {/* Ambient Neon Backlight Halo */}
      <div
        className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-primary via-primary-light to-primary opacity-0 blur-md transition-all duration-300 group-hover:opacity-100 group-hover:blur-lg pointer-events-none"
        aria-hidden="true"
      />

      <a
        href="https://www.producthunt.com/products/rexone/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-rexone"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Review RexOne on Product Hunt"
        className="relative z-10 inline-flex items-center justify-center rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl p-1 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-neon-lg active:scale-95 cursor-pointer select-none"
        style={{ width: "258px", height: "62px" }}
      >
        {/* Official Product Hunt SVG Badge Image */}
        {!imageError ? (
          <img
            src={`https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1330748&theme=${theme}`}
            alt="RexOne - Start from One, not Zero. Tri-platform architecture foundation | Product Hunt"
            width="250"
            height="54"
            onError={() => setImageError(true)}
            className="w-62.5 h-13.5 rounded-xl object-contain transition-all duration-300 drop-shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover:drop-shadow-[0_0_16px_var(--color-primary)] group-hover:scale-[1.02]"
          />
      ) : (
        /* Standalone Vector Fallback (Shield against ad-blockers / offline) */
        <svg
          width="250"
          height="54"
          viewBox="0 0 250 54"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 rounded-xl transition-all duration-300 drop-shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.4)] group-hover:drop-shadow-[0_0_16px_var(--color-primary)] group-hover:scale-[1.02]"
        >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            {/* Card Bezel */}
            <rect
              className="transition-all duration-300 stroke-primary group-hover:stroke-primary-light"
              strokeWidth="1.5"
              fill={isDark ? "#121013" : "#FFFFFF"}
              x="0.75"
              y="0.75"
              width="248.5"
              height="52.5"
              rx="11"
            />

            {/* Subtext */}
            <text
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.8"
              className="transition-all duration-300 fill-primary group-hover:fill-primary-light"
            >
              <tspan x="53" y="21">
                LEAVE A REVIEW ON
              </tspan>
            </text>

            {/* Product Hunt Title */}
            <text
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="16"
              fontWeight="800"
              className="transition-all duration-300 fill-white group-hover:fill-glow-white"
            >
              <tspan x="52" y="39">
                Product Hunt
              </tspan>
            </text>

            {/* 5-Star Rating */}
            <g
              transform="translate(195, 18) scale(1.15)"
              className="transition-all duration-300 fill-primary group-hover:fill-primary-light group-hover:drop-shadow-[0_0_6px_var(--color-primary)]"
            >
              <path d="M23.04,9.021L14.77,8.796L12,1L9.23,8.796L0.96,9.021l6.559,5.043L5.177,22L12,17.321L18.823,22l-2.342-7.935L23.04,9.021z M12,14.896l-3.312,2.271l1.137-3.851l-3.183-2.448l4.014-0.109L12,6.974l1.344,3.784l4.014,0.109l-3.183,2.448l1.137,3.851 L12,14.896z" />
            </g>

            {/* Product Hunt Iconic 'P' Badge */}
            <g transform="translate(12, 11)">
              <circle
                cx="16"
                cy="16"
                r="16"
                className="transition-all duration-300 fill-primary group-hover:fill-primary-light group-hover:drop-shadow-[0_0_6px_var(--color-primary)]"
              />
              <path
                d="M17.4329 15.9559H13.0929V11.306H17.4329C18.7019 11.306 19.7306 12.347 19.7306 13.631C19.7306 14.915 18.7019 15.9559 17.4329 15.9559M17.4329 8.2059H10.0294V23.7059H13.0929V19.056H17.4329C20.3938 19.056 22.7941 16.627 22.7941 13.631C22.7941 10.6348 20.3938 8.2059 17.4329 8.2059Z"
                fill={isDark ? "#121013" : "#FFFFFF"}
              />
            </g>
          </g>
        </svg>
      )}
    </a>
    </div>
  );
};

export default ProductHuntBadge;
