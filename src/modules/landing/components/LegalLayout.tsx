// src/modules/landing/components/LegalLayout.tsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { icons, iconsLib, images } from "../../../assets";
import AppRoutes from "../../../AppRoutes";
import {
  Asset,
  Button,
  ButtonVariants,
  ComponentSizes,
  TextLink,
} from "../../../design";
import { LANDING_DATA } from "../constants";
import { SocialProfiles } from "./SocialProfiles";

export interface ILegalTocItem {
  id: string;
  label: string;
}

export interface ILegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  tableOfContents: ILegalTocItem[];
  children: React.ReactNode;
}

export const LegalLayout: React.FC<ILegalLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  tableOfContents,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("");

  const isPrivacy =
    location.pathname === AppRoutes.client.public.PRIVACY_POLICY;
  const isTerms =
    location.pathname === AppRoutes.client.public.TERMS_AND_CONDITIONS;

  // Enforce dark mode on legal pages
  useEffect(() => {
    const prevTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "night");
    return () => {
      if (prevTheme) {
        document.documentElement.setAttribute("data-theme", prevTheme);
      }
    };
  }, []);

  // Track active section for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = tableOfContents.length - 1; i >= 0; i--) {
        const item = tableOfContents[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          return;
        }
      }
      if (tableOfContents.length > 0) {
        setActiveSection(tableOfContents[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div
      data-page="legal"
      data-theme="night"
      className="min-h-screen w-full text-glow-white font-primary selection:bg-primary selection:text-primary-content bg-repeat bg-fixed flex flex-col justify-between"
      style={{
        backgroundImage: `url(${images.darkBrickWall.src})`,
        cursor: `url(${images.spotCursor.src}) 15 15, auto`,
      }}
    >
      <style>{`
        [data-page="legal"],
        [data-page="legal"] a,
        [data-page="legal"] button,
        [data-page="legal"] input,
        [data-page="legal"] textarea,
        [data-page="legal"] select {
          cursor: url(${images.spotCursor.src}) 15 15, auto !important;
        }
      `}</style>

      {/* Top Cyber-Glass Header */}
      <header className="sticky top-0 z-50 w-full bg-glass-nav backdrop-blur-xl border-b border-glass-border transition-all duration-300">
        <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Brand Logo & Back to Root */}
          <TextLink
            to={AppRoutes.client.public.ROOT}
            className="flex items-center gap-3 no-underline select-none group text-base-content! hover:no-underline"
            aria-label="Return to RexOne Home"
          >
            <Asset
              asset={icons.logo}
              className="h-8 sm:h-9 w-8 sm:w-9 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.6)]"
            />
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary)]">
                RexOne
              </span>
            </div>
          </TextLink>

          {/* Center Document Switcher Tabs */}
          <nav
            aria-label="Legal Documents"
            className="hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-base-300/40 border border-glass-border backdrop-blur-md text-sm font-display tracking-wide"
          >
            <TextLink
              to={AppRoutes.client.public.PRIVACY_POLICY}
              className={`px-4 py-1.5 rounded-full transition-all duration-300 hover:no-underline cursor-pointer ${
                isPrivacy
                  ? "bg-primary text-primary-content shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.5)] font-bold"
                  : "text-base-content/70 hover:text-glow-white"
              }`}
            >
              Privacy Policy
            </TextLink>
            <TextLink
              to={AppRoutes.client.public.TERMS_AND_CONDITIONS}
              className={`px-4 py-1.5 rounded-full transition-all duration-300 hover:no-underline cursor-pointer ${
                isTerms
                  ? "bg-primary text-primary-content shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.5)] font-bold"
                  : "text-base-content/70 hover:text-glow-white"
              }`}
            >
              Terms & Conditions
            </TextLink>
          </nav>

          {/* Right Action: Back to Home button */}
          <div className="flex items-center gap-3">
            <Button
              variant={ButtonVariants.TERTIARY}
              size={ComponentSizes.SM}
              onClick={() => navigate(AppRoutes.client.public.ROOT)}
              className="hidden md:inline-flex items-center gap-2 border border-glass-border bg-glass-card hover:bg-glass-card-hover text-glow-white hover:text-primary transition-all duration-300"
            >
              <iconsLib.chevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <Button
              variant={ButtonVariants.PRIMARY}
              size={ComponentSizes.SM}
              onClick={() => navigate(AppRoutes.client.public.ROOT)}
              className="md:hidden"
            >
              Home
            </Button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Tabs */}
        <div className="sm:hidden flex border-t border-glass-border/60 bg-base-300/30 px-4 py-2 justify-center gap-2 text-xs font-display">
          <TextLink
            to={AppRoutes.client.public.PRIVACY_POLICY}
            className={`px-3 py-1 rounded-full transition-all duration-300 hover:no-underline cursor-pointer ${
              isPrivacy
                ? "bg-primary text-primary-content font-bold shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]"
                : "text-base-content/70"
            }`}
          >
            Privacy Policy
          </TextLink>
          <TextLink
            to={AppRoutes.client.public.TERMS_AND_CONDITIONS}
            className={`px-3 py-1 rounded-full transition-all duration-300 hover:no-underline cursor-pointer ${
              isTerms
                ? "bg-primary text-primary-content font-bold shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]"
                : "text-base-content/70"
            }`}
          >
            Terms & Conditions
          </TextLink>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 flex-1">
        {/* Document Header Hero */}
        <div className="mb-8 sm:mb-12 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary-light text-xs font-semibold tracking-wider uppercase drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]">
            <span>RexOne Covenant & Legal</span>
            <span className="text-primary/50">•</span>
            <span>{lastUpdated}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-base-content/75 leading-relaxed font-primary">
            {subtitle}
          </p>
        </div>

        {/* Mobile Horizontal Scrollable Table of Contents */}
        {tableOfContents.length > 0 && (
          <div className="lg:hidden mb-8">
            <div className="p-3 rounded-xl bg-glass-card border border-glass-border backdrop-blur-md">
              <div className="text-xs uppercase tracking-wider text-base-content/50 font-bold mb-2 px-1 flex items-center gap-1.5">
                <iconsLib.search className="w-3.5 h-3.5 text-primary" />
                <span>Jump to Section</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleTocClick(e, item.id)}
                    className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
                      activeSection === item.id
                        ? "bg-primary text-primary-content border-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.4)]"
                        : "bg-base-300/40 text-base-content/70 border-glass-border hover:text-glow-white hover:border-primary/50"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Grid: TOC + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Desktop Sticky Table of Contents */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
              <div className="p-5 rounded-2xl bg-glass-card border border-glass-border backdrop-blur-md space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                <div className="border-b border-glass-border pb-3 flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold tracking-wider text-glow-white uppercase">
                    Table of Contents
                  </h2>
                  <span className="text-xs text-base-content/50 font-mono">
                    {tableOfContents.length} Sections
                  </span>
                </div>

                <nav aria-label="Table of contents" className="space-y-1">
                  {tableOfContents.map((item, index) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => handleTocClick(e, item.id)}
                        className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-primary/15 text-primary-light border-l-2 border-primary font-semibold shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.15)]"
                            : "text-base-content/65 hover:text-glow-white hover:bg-base-300/30"
                        }`}
                      >
                        <span
                          className={`font-mono text-xs w-5 text-right shrink-0 ${
                            isActive
                              ? "text-primary font-bold"
                              : "text-base-content/40 group-hover:text-base-content/70"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </a>
                    );
                  })}
                </nav>

                <div className="pt-3 border-t border-glass-border/60 text-xs text-base-content/50 space-y-2">
                  <p>
                    Questions or legal notices?
                  </p>
                  <a
                    href="mailto:support@meritmoon.com"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                  >
                    <span>support@meritmoon.com</span>
                  </a>
                </div>
              </div>
            </aside>
          )}

          {/* Legal Document Content Card */}
          <article
            className={`w-full ${
              tableOfContents.length > 0 ? "lg:col-span-8" : "lg:col-span-12"
            } p-6 sm:p-10 rounded-2xl bg-glass-card border border-glass-border backdrop-blur-md space-y-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] leading-relaxed text-base-content/90`}
          >
            {children}
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-glass-border/70 bg-glass-nav backdrop-blur-xl mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center space-y-4">
          <SocialProfiles profiles={LANDING_DATA.profiles} />

          <div className="flex items-center justify-center gap-6 text-xs text-base-content/60 font-medium">
            <TextLink
              to={AppRoutes.client.public.PRIVACY_POLICY}
              className={`hover:text-primary transition-colors ${
                isPrivacy ? "text-primary font-semibold" : ""
              }`}
            >
              Privacy Policy
            </TextLink>
            <span className="text-base-content/30">•</span>
            <TextLink
              to={AppRoutes.client.public.TERMS_AND_CONDITIONS}
              className={`hover:text-primary transition-colors ${
                isTerms ? "text-primary font-semibold" : ""
              }`}
            >
              Terms & Conditions
            </TextLink>
            <span className="text-base-content/30">•</span>
            <TextLink
              to={AppRoutes.client.public.ROOT}
              className="hover:text-primary transition-colors"
            >
              RexOne Home
            </TextLink>
          </div>

          <p className="text-xs text-base-content/40 font-medium">
            © {new Date().getFullYear()} Rex9. Engineered with Soul & Clarity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LegalLayout;
