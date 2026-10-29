// src/modules/landing/components/ProductHuntBadge.tsx

import React from "react";
import { TextLink } from "../../../design";

export interface IProductHuntBadgeProps {
  className?: string;
}

export const ProductHuntBadge: React.FC<IProductHuntBadgeProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative inline-flex group items-center justify-center ${className}`}
    >
      <TextLink
        to="https://www.producthunt.com/products/rexone/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-rexone"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Review RexOne on Product Hunt"
        className="relative z-10 inline-flex items-center justify-center rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl p-1 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_4px_18px_rgba(var(--color-primary-rgb),0.25)] hover:-translate-y-0.5 active:scale-95 cursor-pointer select-none no-underline"
        style={{ width: "258px", height: "62px" }}
      >
        <svg
          width="250"
          height="54"
          viewBox="0 0 250 54"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="w-62.5 h-13.5 rounded-xl object-contain transition-all duration-300"
        >
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            {/* Themed Card Bezel */}
            <rect
              className="stroke-primary/30 transition-all duration-300 group-hover:stroke-primary/70"
              strokeWidth="1"
              fill="#120c0e"
              x="0.5"
              y="0.5"
              width="249"
              height="53"
              rx="10"
            />

            {/* Subtext: LEAVE A REVIEW ON in RexOne Primary Red */}
            <text
              fontFamily="var(--font-mono, monospace)"
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.8"
              fill="var(--color-primary)"
              className="transition-colors duration-300"
            >
              <tspan x="53" y="21">
                LEAVE A REVIEW ON
              </tspan>
            </text>

            {/* Title: Product Hunt in Crisp Glow White */}
            <text
              fontFamily="var(--font-display, system-ui, sans-serif)"
              fontSize="16"
              fontWeight="800"
              fill="var(--color-glow-white, #FFFFFF)"
              className="transition-colors duration-300"
            >
              <tspan x="52" y="39">
                Product Hunt
              </tspan>
            </text>

            {/* 5-Star Rating Star in RexOne Primary Red */}
            <g
              transform="translate(205.000000, 11.000000) scale(1.4)"
              fill="var(--color-primary)"
              className="transition-colors duration-300"
            >
              <g transform="translate(3, 0)">
                <path d="M23.04,9.021L14.77,8.796L12,1L9.23,8.796L0.96,9.021l6.559,5.043L5.177,22L12,17.321L18.823,22l-2.342-7.935L23.04,9.021z M12,14.896l-3.312,2.271l1.137-3.851l-3.183-2.448l4.014-0.109L12,6.974l1.344,3.784l4.014,0.109l-3.183,2.448l1.137,3.851 L12,14.896z" />
              </g>
            </g>

            {/* Product Hunt Iconic 'P' Badge Themed to RexOne Red */}
            <g transform="translate(11.000000, 12.000000)">
              <circle
                cx="15.5"
                cy="15.5"
                r="15.5"
                fill="var(--color-primary)"
                className="transition-colors duration-300"
              />
              <path
                d="M17.4329412,15.9558824 L17.4329412,15.9560115 L13.0929412,15.9560115 L13.0929412,11.3060115 L17.4329412,11.3060115 L17.4329412,11.3058824 C18.7018806,11.3058824 19.7305882,12.3468365 19.7305882,13.6308824 C19.7305882,14.9149282 18.7018806,15.9558824 17.4329412,15.9558824 M17.4329412,8.20588235 L17.4329412,8.20601152 L10.0294118,8.20588235 L10.0294118,23.7058824 L13.0929412,23.7058824 L13.0929412,19.0560115 L17.4329412,19.0560115 L17.4329412,19.0558824 C20.3938424,19.0558824 22.7941176,16.6270324 22.7941176,13.6308824 C22.7941176,10.6347324 20.3938424,8.20588235 17.4329412,8.20588235"
                fill="#FFFFFF"
              />
            </g>
          </g>
        </svg>
      </TextLink>
    </div>
  );
};

export default ProductHuntBadge;
