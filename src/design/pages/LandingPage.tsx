// src/design/pages/LandingPage.tsx

import React, { useEffect, useState } from "react";
import { LANDING_DATA } from "./landing.data";
import {
  LandingNav,
  NeonSign,
  SocialProfiles,
  SkillCard,
  ProjectCard,
  TestimonialCard,
  ContactForm,
} from "../components/landing";
import { Button } from "../components/button";
import { ButtonVariants, ComponentSizes } from "../constants";
import { colors } from "../elements";
import { images, iconsLib } from "../../assets";

const headingShadow = colors.effects.headingGlow;

export const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("#Greetings");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "Greetings",
        "Skills",
        "Projects",
        "Testimonials",
        "Contact",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${sectionId}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const skillCategoryTitles: Record<string, string> = {
    languages: "Languages",
    frontend: "Frontend",
    backend: "Backend & APIs",
    mobile: "Mobile & Cross-Platform",
    database: "Database & Caching",
    tools: "DevOps, Cloud & AI",
  };

  // Enforce dark mode on landing page
  useEffect(() => {
    const prevTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "night");
    return () => {
      if (prevTheme) {
        document.documentElement.setAttribute("data-theme", prevTheme);
      }
    };
  }, []);

  return (
    <div
      data-page="landing"
      data-theme="night"
      className="min-h-screen w-full text-glow-white font-primary selection:bg-primary selection:text-white bg-repeat bg-fixed"
      style={{
        backgroundImage: `url(${images.darkBrickWall.src})`,
        cursor: `url(${images.spotCursor.src}) 15 15, auto`,
      }}
    >
      <style>{`
        [data-page="landing"],
        [data-page="landing"] a,
        [data-page="landing"] button,
        [data-page="landing"] input,
        [data-page="landing"] textarea,
        [data-page="landing"] select {
          cursor: url(${images.spotCursor.src}) 15 15, auto !important;
        }
      `}</style>

      {/* 1. Navigation */}
      <LandingNav
        activeSection={activeSection}
        onSectionClick={handleScrollToSection}
      />

      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
        {/* 2. Hero Sign ("rex9") */}
        <NeonSign id="Greetings" />

        {/* 3. Catchphrase & Social Profiles */}
        <section
          style={{ textShadow: headingShadow }}
          className="text-center max-w-[960px] mx-auto my-8 space-y-3 text-[16px] sm:text-[18px] md:text-[19px] text-white leading-[1.85] font-display font-normal tracking-wide"
        >
          <p>Champion, welcome! 🌟</p>
          <p>
            I am a battle-hardened Full-Stack Architect with a mind sharpened by
            meditation. 🧘‍♂️💻
          </p>
          <p>
            Forging digital realms where clarity meets code, and simplicity
            meets soul. ✨
          </p>
          <p>
            Carving seamless paths where beauty and strength walk side by side.
            ⚔️🌿
          </p>
          <p>
            Let's shape thy vision into reality with purpose, and a touch of
            magic! 🚀
          </p>
        </section>

        {/* Social Profiles Row */}
        <SocialProfiles profiles={LANDING_DATA.profiles} />

        {/* Down Arrow Button */}
        <div className="flex justify-center my-8 animate-down-bounce">
          <button
            type="button"
            aria-label="Scroll to skills"
            onClick={() => handleScrollToSection("#Skills")}
            className="group flex items-center justify-center w-[40px] h-[40px] rounded-full border border-primary text-primary hover:text-white hover:border-primary-light hover:shadow-neon transition-all duration-300 drop-shadow-[0_0_8px_var(--color-primary)]"
          >
            <iconsLib.chevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* 4. Skills Section */}
        <section id="Skills" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2
              style={{ textShadow: headingShadow }}
              className="font-display text-[36px] sm:text-[44px] md:text-[50px] font-normal tracking-wide text-glow-white"
            >
              Skills
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Object.entries(LANDING_DATA.skills).map(([key, items]) => (
              <SkillCard
                key={key}
                title={skillCategoryTitles[key] || key}
                items={items}
              />
            ))}
          </div>
        </section>

        {/* 5. Projects Section */}
        <section id="Projects" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2
              style={{ textShadow: headingShadow }}
              className="font-display text-[36px] sm:text-[44px] md:text-[50px] font-normal tracking-wide text-glow-white"
            >
              My Recent Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {LANDING_DATA.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <section id="Testimonials" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2
              style={{ textShadow: headingShadow }}
              className="font-display text-[36px] sm:text-[44px] md:text-[50px] font-normal tracking-wide text-glow-white"
            >
              Testimonials
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-5 py-5 scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-black/40">
            {LANDING_DATA.testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} testimonial={testimonial} />
            ))}
          </div>
        </section>

        {/* 7. Contact & Resume Section */}
        <section id="Contact" className="py-12 scroll-mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-9">
            {/* Left Contact Text & Resume Button */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <div
                style={{ textShadow: headingShadow }}
                className="font-display text-[24px] sm:text-[30px] md:text-[34px] leading-relaxed font-normal text-glow-white"
              >
                I'm always interested in hearing about new projects,
                <br className="hidden sm:inline" /> so if you'd like to chat,
                please kindly get in touch with me.
              </div>

              <div className="resumeBox text-center lg:text-left pt-6">
                <a
                  href={LANDING_DATA.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant={ButtonVariants.NEON}
                    size={ComponentSizes.LG}
                    className="!py-3 !px-7 !text-[18px] tracking-[1px] font-bold"
                  >
                    View / Download my Resume 📄
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <ContactForm />
            </div>
          </div>

          {/* Divider matching Rex9 */}
          <div className="w-[85%] max-w-[1100px] h-[1px] mx-auto my-9 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_6px_rgba(255,94,98,0.3)]" />

          {/* Footer Social Profiles */}
          <footer className="text-center">
            <SocialProfiles profiles={LANDING_DATA.profiles} />
            <p className="text-[13px] text-white/50 font-medium">
              © {new Date().getFullYear()} Rex9. Engineered with Soul & Clarity.
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
};
