import React from "react";
import { cn } from "../utils";

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
}) => <div className={cn("min-h-screen w-full", className)}>{children}</div>;
