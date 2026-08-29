// src/design/components/landing/NeonSign.tsx

import React from "react";
import { colors } from "../../elements";

interface NeonSignProps {
  id?: string;
  className?: string;
}

export const NeonSign: React.FC<NeonSignProps> = ({
  id = "Greetings",
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`flex justify-center items-center w-full max-w-[600px] min-h-[200px] mx-auto my-[50px] tracking-[6px] select-none uppercase font-display text-[80px] sm:text-[110px] md:text-[140px] leading-none text-center text-glow-white animate-hero-sign ${className}`}
      style={{
        backgroundImage: `radial-gradient(ellipse 65% 55% at 50% 50%, rgba(107, 20, 38, 0.85), transparent 70%)`,
        textShadow: colors.effects.heroSign,
      }}
    >
      <span className="animate-fast-flicker-char">r</span>
      <span>e</span>
      <span className="animate-flicker-char">x</span>
      <span>9</span>
    </section>
  );
};
