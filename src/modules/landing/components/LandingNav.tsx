// src/modules/landing/components/LandingNav.tsx

import React, { useState } from "react";
import { iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "../../../modules/auth";
import { Button, ButtonVariants, ComponentSizes } from "../../../design";

export interface ILandingNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export const LandingNav: React.FC<ILandingNavProps> = ({
  activeSection = "#Greetings",
  onSectionClick,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentSection = activeSection;

  const navItems = [
    { label: "Greetings", href: "#Greetings" },
    { label: "Skills", href: "#Skills" },
    { label: "Projects", href: "#Projects" },
    { label: "Testimonials", href: "#Testimonials" },
    { label: "Contact", href: "#Contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
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
      <div className="max-w-6xl mx-auto h-16 sm:h-20 px-5 flex items-center justify-between">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-between w-full font-display text-xl tracking-wider text-white">
          <div className="flex items-center space-x-7">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-white font-bold [text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_20px_var(--color-primary-dark),0_0_30px_var(--color-glow-outer)]"
                      : "text-white/65 hover:text-white hover:[text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_16px_var(--color-primary-dark),0_0_22px_var(--color-glow-outer)]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Enter Button in Desktop Nav */}
          <Button
            variant={ButtonVariants.PRIMARY}
            size={ComponentSizes.LG}
            onClick={handleEnterClick}
          >
            Enter
          </Button>
        </nav>

        {/* Mobile Navigation Header */}
        <div className="flex md:hidden items-center justify-between w-full h-full">
          <Button
            variant={ButtonVariants.PRIMARY}
            size={ComponentSizes.SM}
            onClick={handleEnterClick}
            className="!py-1.5 !px-4 text-xs font-primary"
          >
            Enter
          </Button>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white bg-transparent border-0 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <iconsLib.close className="w-8 h-8 text-primary drop-shadow-[0_0_8px_var(--color-primary)]" />
            ) : (
              <iconsLib.menu className="w-8 h-8 text-primary drop-shadow-[0_0_8px_var(--color-primary)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-glass-nav backdrop-blur-2xl border-b border-glass-border-hover py-4 px-6">
          <div className="flex flex-col space-y-4 text-center font-display text-xl">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`py-2 transition-all duration-300 ${
                    isActive
                      ? "text-white font-bold [text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_20px_var(--color-primary-dark),0_0_30px_var(--color-glow-outer)]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
