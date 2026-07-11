import React from "react";
import { useAxiosInterceptor } from "../../services";
import { NavBar } from "../components";

interface PageLayoutProps {
  children: React.ReactNode;
}

const LayoutPage: React.FC<PageLayoutProps> = ({ children }) => {
  useAxiosInterceptor();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen w-screen">
      <NavBar />
      {children}
      <div></div>
    </div>
  );
};

export default LayoutPage;
