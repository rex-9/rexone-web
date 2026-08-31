// src/design/components/landing/LandingNav.tsx

import React, { useState, useEffect } from "react";
import { iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "../../../modules/auth";
import { Button } from "../button";
import { colors } from "../../elements";

import { ButtonVariants, ComponentSizes } from "../../constants";

interface LandingNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

const activeShadow = colors.effects.navActive;

export const LandingNav: React.FC<LandingNavProps> = ({
  activeSection = "#Greetings",
  onSectionClick,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(activeSection);

  useEffect(() => {
    setCurrentSection(activeSection);
  }, [activeSection]);

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
    setCurrentSection(href);
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
      <div className="max-w-[1200px] mx-auto h-[70px] px-5 flex items-center justify-between">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-between w-full font-display text-[21px] tracking-wider text-white">
          <div className="flex items-center space-x-7">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  style={isActive ? { textShadow: activeShadow } : undefined}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-white font-bold"
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
            size={ComponentSizes.SM}
            onClick={handleEnterClick}
            className="!py-2 !px-6 text-sm"
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
          <div className="flex flex-col space-y-4 text-center font-display text-[22px]">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  style={isActive ? { textShadow: activeShadow } : undefined}
                  className={`py-2 transition-all duration-300 ${
                    isActive
                      ? "text-white font-bold"
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
