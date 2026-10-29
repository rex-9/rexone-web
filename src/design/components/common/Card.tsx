// src/design/components/common/Card.tsx
import React from "react";
import { cn } from "../../helpers";

export interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isLit?: boolean;
  padding?: string;
  className?: string;
  onClick?: () => void;
  border?: boolean;
  hoverable?: boolean;
}

export interface IGroupedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  isLit?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface ISectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isLit?: boolean;
}

export const Card: React.FC<ICardProps> & {
  Grouped: React.FC<IGroupedCardProps>;
  Section: React.FC<ISectionCardProps>;
} = ({
  children,
  isLit = false,
  padding = "p-5",
  className,
  onClick,
  border = true,
  hoverable = false,
  ...props
}) => {
  const isClickable = !!onClick || hoverable;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "relative rounded-2xl transition-all duration-300 backdrop-blur-md overflow-hidden",
        isLit
          ? "bg-base-200/90 shadow-md border-primary/50"
          : "bg-base-200/60 border-base-300/40 shadow-sm",
        border && "border",
        isClickable &&
          "cursor-pointer hover:border-primary/40 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
        padding,
        className,
      )}
      {...props}
    >
      {/* Subtle top rim highlight */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent",
          isLit && "via-primary/30",
        )}
      />
      {children}
    </div>
  );
};

export const GroupedCard: React.FC<IGroupedCardProps> = ({
  children,
  isLit = false,
  className,
  ...props
}) => {
  const items = React.Children.toArray(children);

  return (
    <Card isLit={isLit} padding="p-0" className={className} {...props}>
      <div className="divide-y divide-base-300/40">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 transition-colors">
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
};

export const SectionCard: React.FC<ISectionCardProps> = ({
  title,
  subtitle,
  actions,
  children,
  className,
  isLit = false,
  ...props
}) => {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-semibold text-base-content">{title}</h3>
          {subtitle && (
            <p className="text-xs text-base-content/60 mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <Card isLit={isLit} padding="p-5">
        {children}
      </Card>
    </div>
  );
};

Card.Grouped = GroupedCard;
Card.Section = SectionCard;
