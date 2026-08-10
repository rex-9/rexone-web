import React from "react";

interface AdminFormShellProps {
  children: React.ReactNode;
}

export const AdminFormShell: React.FC<AdminFormShellProps> = ({
  children,
}) => (
  <div className="p-4 md:p-8">
    {children}
  </div>
);
