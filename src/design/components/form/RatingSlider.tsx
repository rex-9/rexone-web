// src/design/components/form/RatingSlider.tsx
import React from "react";
import { cn } from "../../utils";

export interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const getSentiment = (rating: number): { emoji: string; text: string } => {
  if (rating <= 2) return { emoji: "😞", text: "Needs Work" };
  if (rating <= 4) return { emoji: "😕", text: "Could Be Better" };
  if (rating <= 6) return { emoji: "😐", text: "Neutral" };
  if (rating <= 8) return { emoji: "🙂", text: "Good" };
  return { emoji: "🤩", text: "Exceptional!" };
};

export const RatingSlider: React.FC<RatingSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
  className,
  disabled = false,
}) => {
  const sentiment = getSentiment(value);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex justify-between items-center">
        {label && (
          <span className="text-sm font-medium text-base-content/80">
            {label}
          </span>
        )}
        <div className="badge badge-primary badge-outline gap-1.5 py-3 px-3 font-medium text-xs">
          <span>{sentiment.emoji}</span>
          <span className="font-bold">
            {value} / {max}
          </span>
          <span className="opacity-80">({sentiment.text})</span>
        </div>
      </div>

      <div className="w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={1}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="range range-primary text-primary range-xs w-full"
        />
        <div className="flex justify-between text-xs px-1 mt-1 text-base-content/50 font-mono">
          <span>{min} (Low)</span>
          <span>5</span>
          <span>{max} (High)</span>
        </div>
      </div>
    </div>
  );
};

export default RatingSlider;
