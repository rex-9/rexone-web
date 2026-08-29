import React from "react";
import { ITestimonialItem } from "../../pages/landing.data";
import { colors } from "../../elements";

interface TestimonialCardProps {
  testimonial: ITestimonialItem;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
}) => {
  return (
    <article className="font-primary flex flex-col justify-between min-w-[280px] sm:min-w-[320px] max-w-[360px] flex-shrink-0 bg-glass-card border border-glass-border rounded-[20px] p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-glass-card-hover hover:border-glass-border-hover hover:shadow-glass-card">
      <a
        href={testimonial.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <h4
          style={{
            textShadow: colors.effects.cardHeading,
          }}
          className="font-display text-[20px] text-glow-white mb-3 tracking-wide group-hover:text-primary-light transition-colors"
        >
          {testimonial.name}
        </h4>
        <p className="text-[14px] leading-relaxed text-white/85 line-clamp-6 italic">
          "{testimonial.recommendation}"
        </p>
      </a>
    </article>
  );
};
