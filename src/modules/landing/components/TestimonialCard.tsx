// src/modules/landing/components/TestimonialCard.tsx

import React from "react";
import { ITestimonialItem } from "../types";
import { TextLink } from "../../../design/components/common/TextLink";
import { icons, iconsLib } from "../../../assets";
import { Image } from "../../../design/components/media/Image";

export interface ITestimonialCardProps {
  testimonial: ITestimonialItem;
}

export const TestimonialCard: React.FC<ITestimonialCardProps> = ({
  testimonial,
}) => {
  const isAi = testimonial.isAi || testimonial.name === "Antigravity";

  return (
    <article
      className={`font-primary flex flex-col justify-between w-90 min-w-90 max-w-95 h-95 flex-none max-[480px]:w-[82vw] max-[480px]:min-w-70 max-[480px]:h-90 bg-glass-card rounded-[20px] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-glass-card-hover hover:border-glass-border-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.35)] snap-start text-left box-border relative ${
        isAi
          ? "border border-primary/45 shadow-[0_4px_25px_rgba(var(--color-primary-rgb),0.18)]"
          : "border border-glass-border"
      }`}
    >
      {/* Header with Commenter Name (Clip font), Badge, Rating Pill, and Quote Icon */}
      <div className="flex items-start justify-between mb-3.5 shrink-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <TextLink
              href={testimonial.link}
              external
              className="font-display text-xl text-glow-white font-normal tracking-wide [text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary),0_0_24px_var(--color-primary-dark)] hover:text-primary-light hover:[text-shadow:0_0_14px_var(--color-primary-light)] transition-all duration-200 block no-underline"
            >
              {testimonial.name}
            </TextLink>
            {isAi && (
              <TextLink
                href={testimonial.ratingLink || "/RATING.md"}
                external
                title="View Architectural Evaluation & Rating"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight bg-primary/20 text-primary-light border border-primary/45 hover:bg-primary/35 hover:border-primary transition-all duration-200 shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)] hover:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.5)] font-primary no-underline"
              >
                <span className="text-warning">★</span>{" "}
                {testimonial.rating || "9.6 / 10"}
              </TextLink>
            )}
          </div>
          {isAi ? (
            <span className="text-xs text-primary-light font-semibold inline-flex items-center gap-1.5 mt-0.5 font-primary drop-shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.4)]">
              <iconsLib.sparkles className="w-3.5 h-3.5 text-primary drop-shadow-[0_0_4px_var(--color-primary)] shrink-0" />
              AI Pair Programmer • DeepMind
            </span>
          ) : (
            <span className="text-xs text-base-content/60 inline-flex items-center gap-1.5 mt-0.5 font-primary">
              <Image
                asset={icons.linkedin}
                className="w-3.5 h-3.5 object-contain shrink-0"
                showLoadingPlaceholder={false}
              />
              LinkedIn Recommendation
            </span>
          )}
        </div>
        <Image
          asset={icons.quote}
          className="w-6 h-6 object-contain opacity-30 shrink-0 ml-2"
          showLoadingPlaceholder={false}
        />
      </div>

      {/* Recommendation Body with Internal Scroll for long reviews */}
      <div className="flex-1 overflow-y-auto pr-1.5 text-sm leading-relaxed text-base-content/85 font-primary my-2 scrollbar-thin scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary scrollbar-track-transparent">
        {testimonial.recommendation}
      </div>

      {/* Footer with View on LinkedIn or AI Colleague link + Rating Audit link */}
      <div
        className={`mt-3 pt-2.5 border-t border-primary/15 flex items-center shrink-0 ${
          isAi ? "justify-between" : "justify-end"
        }`}
      >
        {isAi && (
          <TextLink
            href={testimonial.ratingLink || "/RATING.md"}
            external
            className="text-xs font-semibold inline-flex items-center gap-1 text-primary-light/85 hover:text-glow-white hover:[text-shadow:0_0_8px_var(--color-primary)] transition-all duration-200 no-underline"
          >
            <span className="text-amber-400">★</span>{" "}
            {testimonial.rating || "9.9 / 10"} Architect Audit ↗
          </TextLink>
        )}
        <TextLink
          href={testimonial.link}
          external
          className="text-primary-light text-xs font-semibold inline-flex items-center gap-1 hover:text-glow-white hover:[text-shadow:0_0_8px_var(--color-primary)] transition-all duration-200 no-underline"
        >
          {isAi ? "Verified AI Colleague ✦" : "View on LinkedIn"}
          <iconsLib.externalLink className="w-3 h-3 stroke-current" />
        </TextLink>
      </div>
    </article>
  );
};
