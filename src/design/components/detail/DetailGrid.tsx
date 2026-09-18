// src/design/components/detail/DetailGrid.tsx
import React from "react";
import { cn } from "../../helpers";

export interface IDetailGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const DetailGrid: React.FC<IDetailGridProps> = ({
  children,
  className,
  columns = 3,
}) => {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <dl
      className={cn(
        "grid gap-3.5 sm:gap-4",
        columnClasses,
        className,
      )}
    >
      {children}
    </dl>
  );
};
