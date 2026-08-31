// src/modules/landing/components/TestimonialCard.tsx

import React from "react";
import { ITestimonialItem } from "../types";

export interface ITestimonialCardProps {
  testimonial: ITestimonialItem;
}

export const TestimonialCard: React.FC<ITestimonialCardProps> = ({
  testimonial,
}) => {
  return (
    <article className="font-primary flex flex-col justify-between min-w-72 sm:min-w-80 max-w-sm flex-shrink-0 bg-glass-card border border-glass-border rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-glass-card-hover hover:border-glass-border-hover hover:shadow-glass-card">
      <a
        href={testimonial.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <h4 className="font-display text-xl text-glow-white mb-3 tracking-wide group-hover:text-primary-light transition-colors [text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary),0_0_24px_var(--color-primary-dark)]">
          {testimonial.name}
        </h4>
        <p className="text-sm leading-relaxed text-white/85 line-clamp-6 italic">
          "{testimonial.recommendation}"
        </p>
      </a>
    </article>
  );
};
