// src/design/pages/LandingPage.tsx

import React, { useEffect, useState } from "react";
import { LANDING_DATA } from "../constants";
import {
  LandingNav,
  NeonSign,
  SocialProfiles,
  SkillCard,
  ProjectCard,
  TestimonialCard,
  ContactForm,
  SponsorCard,
  CandleQuoteCard,
  DoctrineCard,
  FeatureShowcase,
  ProductHuntBadge,
  ComparisonSection,
  FaqSection,
  LandingFooter,
} from "../components";
import { Button } from "../../../design/components/button";
import { ButtonVariants, ComponentSizes } from "../../../design/constants";
import { images, iconsLib } from "../../../assets";

export interface ILandingPageProps {
  hideEnter?: boolean;
}

export const LandingPage: React.FC<ILandingPageProps> = ({ hideEnter }) => {
  const [activeSection, setActiveSection] = useState("#Greetings");
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const testimonialsTrackRef = React.useRef<HTMLDivElement>(null);

  const getTestimonialsScrollStep = () => {
    if (!testimonialsTrackRef.current) return 380;
    const firstCard = testimonialsTrackRef.current.querySelector("article");
    return firstCard ? firstCard.offsetWidth + 20 : 380;
  };

  const handlePrevTestimonial = () => {
    if (testimonialsTrackRef.current) {
      testimonialsTrackRef.current.scrollBy({
        left: -getTestimonialsScrollStep(),
        behavior: "smooth",
      });
    }
  };

  const handleNextTestimonial = () => {
    if (testimonialsTrackRef.current) {
      testimonialsTrackRef.current.scrollBy({
        left: getTestimonialsScrollStep(),
        behavior: "smooth",
      });
    }
  };

  const handleTestimonialDotClick = (index: number) => {
    if (testimonialsTrackRef.current) {
      const cards = testimonialsTrackRef.current.querySelectorAll("article");
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  };

  const handleTestimonialsScroll = () => {
    if (!testimonialsTrackRef.current) return;
    const scrollLeft = testimonialsTrackRef.current.scrollLeft;
    const step = getTestimonialsScrollStep();
    const idx = Math.min(
      Math.round(scrollLeft / step),
      LANDING_DATA.testimonials.length - 1,
    );
    setActiveTestimonialIdx(Math.max(0, idx));
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "Greetings",
        "Skills",
        "Features",
        "Projects",
        "Testimonials",
        "FAQ",
        "Sponsor",
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

  // Enforce dark mode on landing page & smooth-scroll to hash target if provided
  useEffect(() => {
    const prevTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "night");

    if (window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }

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
      className="min-h-screen w-full text-glow-white font-primary selection:bg-primary selection:text-primary-content bg-repeat bg-fixed"
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
        hideEnter={hideEnter}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* 2. Hero Sign ("REXONE") */}
        <NeonSign id="Greetings" />

        {/* 3. Catchphrase & Creator Attribution */}
        <section className="text-center max-w-4xl mx-auto my-8 space-y-4 px-4 font-primary">
          {/* Pill Badge: High-contrast, razor-sharp on dark brick wall */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/15 text-primary-light backdrop-blur-md shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)] transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.5)]">
            <iconsLib.sparkles className="w-4 h-4 text-primary animate-pulse drop-shadow-[0_0_6px_var(--color-primary)]" />
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              Pioneering{" "}
              <span className="text-primary-light font-extrabold tracking-wider [text-shadow:0_0_10px_rgba(var(--color-primary-rgb),0.85)]">
                Discipline-Driven Development
              </span>
            </span>
          </div>

          {/* Catchphrase Heading: Clean, crisp display font */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-wider font-display text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
            Start from One. Not from Zero.
          </h1>

          {/* Creator Attribution: High-contrast, clean readable typography */}
          <p className="text-base sm:text-lg font-medium tracking-wide text-white/90 font-primary">
            Architected &amp; Forged by{" "}
            <a
              href="https://rex9.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold text-glow-white [text-shadow:0_0_6px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.85),0_0_30px_rgba(var(--color-primary-rgb),0.5)] tracking-wider text-xl sm:text-2xl hover:scale-105 transition-transform inline-block no-underline ml-1 align-middle"
              aria-label="Visit Rex9 portfolio (rex9.me)"
            >
              Rex9
            </a>
          </p>

          {/* Subtitle & Value Proposition */}
          <p className="text-sm sm:text-base text-base-content/90 max-w-2xl mx-auto leading-relaxed font-primary">
            The battle-hardened architectural foundation and engineering standard for
            humans and AI coding agents. Neither an extreme monolith nor an overrated microservice—forging
            clean, disciplined ground where clarity meets code, and <br /> simplicity meets soul. 🛡️✨
          </p>
          <p className="text-sm sm:text-base font-display text-glow-white [text-shadow:0_0_6px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.8),0_0_30px_rgba(var(--color-primary-rgb),0.4)] italic tracking-wider py-1">
            No journey is walked alone. Let&apos;s conquer greatness &amp;
            stillness together. 🏹
          </p>

          {/* Product Hunt Review Badge */}
          <div className="pt-2 flex justify-center">
            <ProductHuntBadge />
          </div>
        </section>

        {/* Social Profiles Row */}
        <SocialProfiles profiles={LANDING_DATA.profiles} />

        {/* Down Arrow Button */}
        <div className="flex justify-center my-8 animate-down-bounce">
          <Button
            variant={ButtonVariants.TERTIARY}
            aria-label="Scroll to skills"
            onClick={() => handleScrollToSection("#Skills")}
            className="w-10! h-10! p-0! rounded-full border border-primary text-primary hover:text-primary-content! hover:border-primary-light! hover:shadow-neon! transition-all duration-300 drop-shadow-[0_0_8px_var(--color-primary)]"
          >
            <iconsLib.chevronDown className="w-5 h-5" />
          </Button>
        </div>

        {/* 4. Skills Section */}
        <section id="Skills" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-white">
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

        {/* 5. Features Section (8 Core Architectural Pillars + Master Feature Matrix) */}
        <FeatureShowcase id="Features" />

        {/* 6. Projects Section */}
        <section id="Projects" className="py-12 scroll-mt-20">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-white">
              Forged Realms &amp; Masterworks
            </h2>
          </div>

          {/* The Architecture Creed Banner - The Heart of RexOne */}
          <DoctrineCard className="mb-10" />

          {/* Discipline-Driven Development (DDD): The Unvarnished Truths */}
          <div className="mb-12 rounded-3xl bg-glass-card/90 backdrop-blur-xl border border-glass-border p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/40 bg-primary/15 text-primary-light backdrop-blur-md shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.3)]">
                <iconsLib.shieldCheck className="w-4 h-4 text-primary drop-shadow-[0_0_6px_var(--color-primary)]" />
                <span className="text-xs font-bold tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                  The Unvarnished Engineering Truths
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
                Discipline-Driven Development (DDD)
              </h3>
              <p className="text-sm sm:text-base text-base-content/80 leading-relaxed font-primary">
                <span className="italic font-medium text-white">
                  “You bring the idea. AI writes the code. RexOne keeps both of
                  you from destroying the foundation.”
                </span>
                <br />
                The industry loves to sell quick fixes and hype. Here are the
                brutal engineering truths tech gurus hesitate to reveal:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="p-4 sm:p-5 rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                  <span>⚡ 1. The Vibe-Coding Delusion</span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                  Generating 10,000 lines in minutes without an immutable
                  constitution isn&apos;t velocity; it&apos;s compounding debt
                  at 100x speed. Speed without discipline is just accelerating
                  toward a brick wall.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                  <span>🪤 2. The BaaS Lock-in Trap</span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                  Serverless &ldquo;5-minute backends&rdquo; lure you in with
                  toys, then hand you a $5,000/mo bill and a proprietary SDK
                  hostage crisis. Real production engineering runs PostgreSQL, native job
                  queues, and self-hosted S3.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                  <span>📦 3. Monolith &amp; Microservice Extremes</span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                  Cramming API, DB, and DOM into one single-process runtime creates
                  fragile single-point failures. Conversely, microservices cause
                  distributed transaction hell. RexOne delivers the sweet spot:
                  modular Rails 8 core with container isolation and decoupled clients.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                  <span>📱 4. The Webview Wrapper Cop-Out</span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                  Wrapping a website in a webview shell is lazy and
                  disrespectful to mobile users. Real mobile experiences demand
                  native 60fps rendering, hardware media focus, and
                  offline-first SQLite persistence.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                  <span>🛡️ 5. Zero Zombie Code &amp; Shims</span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                  Retaining dead code, backwards-compatibility shims, and
                  duplicate parameter aliases is cowardice. Under Constitutional
                  Law U14, if code is replaced, the old code is wiped out
                  completely.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-glass-border bg-glass-card/90 backdrop-blur-xl hover:border-primary/50 hover:bg-glass-card-hover hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.25)] transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
                  <span>💎 6. 100% Free &amp; Open Source</span>
                </div>
                <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                  Unlike commercial boilerplates charging $300–$800 for basic
                  auth or gating features behind &ldquo;pro tiers&rdquo;, RexOne
                  is 100% free under the Apache 2.0 license. You own your code,
                  your data, and your infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Architectural Comparison: RexOne vs Commercial SaaS Boilerplates */}
          <ComparisonSection />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {LANDING_DATA.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <section id="Testimonials" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-white">
              Testimonials
            </h2>
          </div>

          <div className="relative flex items-center max-w-7xl mx-auto px-2 sm:px-4">
            {/* Left Carousel Arrow */}
            <Button
              type="button"
              variant={ButtonVariants.TERTIARY}
              aria-label="Previous Testimonial"
              onClick={handlePrevTestimonial}
              className="hidden sm:flex absolute -left-2 md:-left-4 z-10 w-11! h-11! p-0! rounded-full! bg-glass-nav border border-glass-border text-white items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-glass-card-hover hover:border-glass-border-hover hover:text-primary-light hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.6)] active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <iconsLib.chevronLeft className="w-5 h-5 stroke-[2.5]" />
            </Button>

            {/* Carousel Cards Track */}
            <div
              ref={testimonialsTrackRef}
              onScroll={handleTestimonialsScroll}
              className="flex overflow-x-auto gap-5 py-5 w-full scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary scrollbar-track-transparent px-1"
            >
              {LANDING_DATA.testimonials.map((testimonial, idx) => (
                <TestimonialCard key={idx} testimonial={testimonial} />
              ))}
            </div>

            {/* Right Carousel Arrow */}
            <Button
              type="button"
              variant={ButtonVariants.TERTIARY}
              aria-label="Next Testimonial"
              onClick={handleNextTestimonial}
              className="hidden sm:flex absolute -right-2 md:-right-4 z-10 w-11! h-11! p-0! rounded-full! bg-glass-nav border border-glass-border text-white items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-glass-card-hover hover:border-glass-border-hover hover:text-primary-light hover:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.6)] active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <iconsLib.chevronRight className="w-5 h-5 stroke-[2.5]" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {LANDING_DATA.testimonials.map((_, i) => (
              <Button
                key={i}
                type="button"
                variant={ButtonVariants.TERTIARY}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => handleTestimonialDotClick(i)}
                className={`h-2! min-h-0! p-0! rounded-full! transition-all duration-300 cursor-pointer ${
                  activeTestimonialIdx === i
                    ? "w-6! bg-primary shadow-[0_0_10px_var(--color-primary)] scale-110"
                    : "w-2! bg-primary/25 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          {/* Product Hunt Community Review Callout */}
          <div className="mt-8 flex flex-col items-center justify-center gap-2.5">
            <p className="text-xs sm:text-sm text-base-content/70 tracking-wide font-medium">
              Experienced RexOne? Share your review with the community on
              Product Hunt:
            </p>
            <ProductHuntBadge />
          </div>
        </section>

        {/* 7. Frequently Asked Questions (Q&A) Section */}
        <FaqSection variant="general" className="my-8" />

        {/* 8. Sponsor & Support Section */}
        <section id="Sponsor" className="py-12 scroll-mt-20 text-center">
          <div className="mb-8 space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-white">
              Support &amp; Sponsor
            </h2>
            <p className="text-body-m text-base-content/70 max-w-2xl mx-auto">
              Fuel the evolution of disciplined open-source engineering.
              Sponsoring sustains the development of RexOne—keeping foundations
              pristine, battle-tested, and freely accessible to developers
              worldwide.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 px-4">
            <SponsorCard />
            <CandleQuoteCard />
          </div>
        </section>

        {/* 8. Contact & Resume Section */}
        <section id="Contact" className="pt-12 pb-0 scroll-mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-9">
            {/* Left Contact Text & Resume Button */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="space-y-3 font-primary">
                <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed font-medium">
                  Every greatness begins with a single covenant.
                  <br className="hidden sm:inline" /> Forging new digital realms
                  or conquering complex systems,
                  <br className="hidden sm:inline" /> send thy raven and let us
                  build with velocity, & quality. ⚔️
                </p>
                <p className="text-sm sm:text-base font-display tracking-wider text-glow-white [text-shadow:0_0_6px_var(--color-glow-white),0_0_15px_rgba(var(--color-primary-rgb),0.7),0_0_30px_rgba(var(--color-primary-rgb),0.4)] italic leading-relaxed pt-2">
                  &ldquo;No journey is walked alone.
                  <br />
                  Clear in thought, exact in structure,
                  <br />
                  simple in use, and strong enough to endure.&rdquo; 🏹
                </p>
              </div>

              <div className="resumeBox text-center lg:text-left pt-6">
                <Button
                  href={LANDING_DATA.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={ButtonVariants.NEON}
                  size={ComponentSizes.LG}
                  className="py-3! px-7! text-lg! tracking-wide font-bold"
                >
                  View / Download my Resume 📄
                </Button>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <ContactForm />
            </div>
          </div>

          {/* Unified Footer Component (Source of Truth) */}
          <LandingFooter activePage="home" />
        </section>
      </main>
    </div>
  );
};
