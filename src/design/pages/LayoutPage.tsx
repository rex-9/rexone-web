import React from "react";
import { NavBar } from "../components";
import { PageLayout } from "./PageLayout";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const LayoutPage: React.FC<PageLayoutProps> = ({ children }) => {


  return (
    <PageLayout className="flex flex-col items-center justify-between">
      <NavBar />
      {children}
      <div></div>
    </PageLayout>
  );
};
