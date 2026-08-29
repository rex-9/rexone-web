// src/design/components/landing/ProjectCard.tsx

import React from "react";
import { IProjectItem } from "../../pages/landing.data";
import { colors } from "../../elements";

import { Badge } from "../common";
import { BadgeVariants, ComponentSizes } from "../../constants";

interface ProjectCardProps {
  project: IProjectItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative w-full h-[380px] rounded-[20px] overflow-hidden border border-glass-border bg-glass-project shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-400 hover:-translate-y-1 hover:border-glass-border-hover hover:shadow-neon">
      {/* Background Image */}
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Frosted Glass Overlay: Collapsed to reveal project title strip at bottom, slides up smoothly on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-glass-project/90 backdrop-blur-xl border-t border-glass-border p-4 flex flex-col items-center text-center font-primary transform translate-y-[calc(100%-58px)] transition-transform duration-500 ease-out group-hover:translate-y-0 group-hover:bg-glass-project-hover/95 group-hover:border-glass-border-hover">
        <h3
          style={{ textShadow: colors.effects.cardHeading }}
          className="font-display text-[22px] text-glow-white mb-2.5 tracking-wide"
        >
          {project.name}
        </h3>

        {/* Tech Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {project.techs.map((tech) => (
            <Badge
              key={tech}
              variant={BadgeVariants.NEON}
              size={ComponentSizes.SM}
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Bullet Details */}
        <div className="flex flex-col w-[95%] text-left text-[13.5px] leading-snug text-white/85 mb-3 space-y-1">
          {project.details.map((detail, idx) => (
            <p key={idx} className="flex items-start">
              <span className="text-primary font-bold mr-1.5 select-none">
                •
              </span>
              <span>{detail}</span>
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around w-full pt-1">
          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-bold font-primary uppercase tracking-[3px] border border-glass-border bg-glass-tag-bg text-primary px-5 py-2 rounded-[6px] transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-neon-lg active:scale-[0.98]"
            >
              Source
            </a>
          ) : (
            <span className="text-[14px] font-bold font-primary uppercase tracking-[3px] border border-glass-border/30 text-white/30 px-5 py-2 rounded-[6px] pointer-events-none">
              Source
            </span>
          )}

          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-bold font-primary uppercase tracking-[3px] border border-glass-border bg-glass-tag-bg text-primary px-5 py-2 rounded-[6px] transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:shadow-neon-lg active:scale-[0.98]"
            >
              Live
            </a>
          ) : (
            <span className="text-[14px] font-bold font-primary uppercase tracking-[3px] border border-glass-border/30 text-white/30 px-5 py-2 rounded-[6px] pointer-events-none">
              Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
