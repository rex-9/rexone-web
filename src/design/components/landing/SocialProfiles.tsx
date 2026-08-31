// src/design/components/landing/SocialProfiles.tsx

import React from "react";
import { ISocialProfile } from "../../pages/landing.data";

interface SocialProfilesProps {
  profiles: ISocialProfile[];
  className?: string;
}

export const SocialProfiles: React.FC<SocialProfilesProps> = ({
  profiles,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-wrap justify-center items-center gap-3 sm:gap-4 my-6 ${className}`}
    >
      {profiles.map((profile) => {
        const isRaster =
          profile.iconSrc.includes(".jpeg") ||
          profile.iconSrc.includes(".jpg") ||
          profile.iconSrc.includes(".png");

        return (
          <a
            key={profile.platform}
            href={profile.link}
            target="_blank"
            rel="noopener noreferrer"
            title={profile.platform}
            className="group inline-flex items-center justify-center p-1 transition-all duration-300 hover:-translate-y-1"
          >
            <img
              src={profile.iconSrc}
              alt={profile.platform}
              className={`w-7 h-7 object-contain transition-all duration-300 drop-shadow-[0_0_3px_var(--color-primary)] group-hover:drop-shadow-[0_0_8px_var(--color-primary)] ${
                isRaster ? "rounded-[6px]" : "filter brightness-0 invert"
              }`}
            />
          </a>
        );
      })}
    </div>
  );
};
