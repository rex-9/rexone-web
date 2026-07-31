import React from "react";
import { NavBar } from "../components";
import { useAxiosInterceptor } from "../../services";
import { useSocket } from "../../hooks/useSocket";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const LayoutPage: React.FC<PageLayoutProps> = ({ children }) => {
  useAxiosInterceptor();
  useSocket();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-screen">
      <NavBar />
      {children}
      <div></div>
    </div>
  );
};
