// src/modules/landing/components/LandingNav.tsx

import React, { useState } from "react";
import { icons, iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "../../../modules/auth";
import {
  Asset,
  Button,
  ButtonVariants,
  ComponentSizes,
  TextLink,
} from "../../../design";
import { isRex9LandingDomain } from "../helpers";

export interface ILandingNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
  hideEnter?: boolean;
}

export const LandingNav: React.FC<ILandingNavProps> = ({
  activeSection = "#Greetings",
  onSectionClick,
  hideEnter,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentSection = activeSection;
  const shouldHideEnter = hideEnter ?? isRex9LandingDomain();

  const navItems = [
    { label: "Greetings", href: "#Greetings" },
    { label: "Skills", href: "#Skills" },
    { label: "Features", href: "#Features" },
    { label: "Comparison", href: "#Comparison" },
    { label: "Projects", href: "#Projects" },
    { label: "Testimonials", href: "#Testimonials" },
    { label: "FAQs", href: "#FAQ" },
    { label: "Sponsor", href: "#Sponsor" },
    { label: "Contact", href: "#Contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onSectionClick) {
      onSectionClick(href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleEnterClick = () => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated) {
      navigate(AppRoutes.client.protected.HOME);
    } else {
      navigate(AppRoutes.buildDialogUrl(DialogAuthSteps.INITIAL));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-glass-nav backdrop-blur-xl border-b border-glass-border transition-all duration-300">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-between w-full">
          {/* Left: Brand Logo & Wordmark */}
          <TextLink
            href="#Greetings"
            onClick={(e) => handleNavClick(e, "#Greetings")}
            className="flex items-center gap-3 no-underline select-none group text-base-content! hover:no-underline"
            aria-label="RexOne Home"
          >
            <Asset
              asset={icons.logo}
              className="h-8 sm:h-9 w-8 sm:w-9 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.6)]"
            />
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-glow-white [text-shadow:0_0_7px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.85),0_0_30px_rgba(var(--color-primary-rgb),0.5)]">
              RexOne
            </span>
          </TextLink>

          {/* Middle: Navigation Links */}
          <div className="flex items-center space-x-5 lg:space-x-6.5 font-primary text-sm sm:text-[15px] font-medium tracking-normal text-base-content">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`transition-colors duration-200 hover:no-underline ${
                    isActive
                      ? "text-primary-light! font-bold"
                      : "text-base-content/75! hover:text-white!"
                  }`}
                >
                  {item.label}
                </TextLink>
              );
            })}
          </div>

          {/* Right: Enter Button */}
          {!shouldHideEnter && (
            <Button
              variant={ButtonVariants.PRIMARY}
              size={ComponentSizes.SM}
              onClick={handleEnterClick}
              className="font-semibold shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] px-5 py-2 text-sm"
            >
              Enter
            </Button>
          )}
        </nav>

        {/* Mobile Navigation Header */}
        <div className="flex md:hidden items-center justify-between w-full h-full">
          {/* Left: Brand Logo & Title */}
          <TextLink
            href="#Greetings"
            onClick={(e) => handleNavClick(e, "#Greetings")}
            className="flex items-center gap-2.5 no-underline select-none text-base-content! hover:no-underline"
            aria-label="RexOne Home"
          >
            <Asset
              asset={icons.logo}
              className="h-8 w-8 shrink-0 select-none drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.6)]"
            />
            <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-glow-white [text-shadow:0_0_7px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.85),0_0_30px_rgba(var(--color-primary-rgb),0.5)]">
              RexOne
            </span>
          </TextLink>

          {/* Right: Enter & Toggle */}
          <div className="flex items-center gap-2">
            {!shouldHideEnter && (
              <Button
                variant={ButtonVariants.PRIMARY}
                size={ComponentSizes.SM}
                onClick={handleEnterClick}
                className="py-1.5! px-4! text-xs font-semibold font-primary"
              >
                Enter
              </Button>
            )}

            <Button
              variant={ButtonVariants.FLAT}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1! text-base-content bg-transparent! border-0 shadow-none hover:bg-transparent! focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <iconsLib.close className="w-7 h-7 text-primary" />
              ) : (
                <iconsLib.menu className="w-7 h-7 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-glass-nav backdrop-blur-2xl border-b border-glass-border-hover py-4 px-6">
          <div className="flex flex-col space-y-3 text-center font-primary text-base font-medium">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`py-2 transition-colors duration-200 hover:no-underline ${
                    isActive
                      ? "text-primary-light! font-bold"
                      : "text-base-content/75! hover:text-white!"
                  }`}
                >
                  {item.label}
                </TextLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
