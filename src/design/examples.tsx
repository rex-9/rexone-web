// src/design/examples.tsx

/**
 * Rexone Design System - Usage Examples
 *
 * Demonstrates standard Tailwind CSS & DaisyUI class usage with Rexone design tokens.
 *
 * ⚠️ NEVER import tokens directly into UI components — use standard Tailwind & DaisyUI classes!
 */

// ============================================================
// 1. COLORS
// ============================================================

export const ColorExamples = () => {
  return (
    <div className="space-y-6">
      {/* Brand Colors */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-base-content">Brand Colors</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-primary text-white px-4 py-2 rounded-md shadow-sm">
            Primary (#FF5E62)
          </div>
          <div className="bg-secondary text-white px-4 py-2 rounded-md shadow-sm">
            Secondary (#FF7556)
          </div>
          <div className="bg-accent text-white px-4 py-2 rounded-md shadow-sm">
            Accent (#FF2A4B)
          </div>
        </div>
      </div>

      {/* Semantic Colors */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-base-content">Semantic Colors</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-success text-white px-4 py-2 rounded-md">
            Success
          </div>
          <div className="bg-warning text-white px-4 py-2 rounded-md">
            Warning
          </div>
          <div className="bg-error text-white px-4 py-2 rounded-md">
            Error
          </div>
          <div className="bg-info text-white px-4 py-2 rounded-md">
            Info
          </div>
        </div>
      </div>

      {/* Theme Surfaces */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-base-content">Theme Base Surfaces</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-base-100 border border-base-300 px-4 py-2 rounded-md text-base-content">
            Base 100 (Canvas)
          </div>
          <div className="bg-base-200 border border-base-300 px-4 py-2 rounded-md text-base-content">
            Base 200 (Surface)
          </div>
          <div className="bg-base-300 px-4 py-2 rounded-md text-base-content">
            Base 300 (Card)
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 2. TYPOGRAPHY
// ============================================================

export const TypographyExamples = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-display-l font-display text-base-content">Display Large (40px)</h1>
        <h2 className="text-display-m font-display text-base-content">Display Medium (32px)</h2>
        <h3 className="text-display-s font-display text-base-content">Display Small (28px)</h3>
        <h1 className="text-2xl font-bold font-primary text-base-content">Heading 1 (24px)</h1>
        <h2 className="text-xl font-bold font-primary text-base-content">Heading 2 (20px)</h2>
        <h3 className="text-lg font-semibold font-primary text-base-content">Heading 3 (18px)</h3>
        <h4 className="text-base font-semibold font-primary text-base-content">Heading 4 (16px)</h4>
        <p className="text-body-l text-base-content">Body Large (16px)</p>
        <p className="text-body-m text-base-content">Body Medium (14px)</p>
        <p className="text-body-s text-base-content/70">Body Small (12px)</p>
      </div>
    </div>
  );
};

// ============================================================
// 3. TAILWIND SPACING SCALE
// ============================================================

export const SpacingExamples = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-base-content">Standard Tailwind Spacing</h4>
        <div className="flex items-center gap-4 flex-wrap text-base-content">
          <div className="bg-primary w-2 h-2 rounded-xs" />
          <span className="text-xs">w-2 (8px)</span>
          <div className="bg-primary w-3 h-3 rounded-xs" />
          <span className="text-xs">w-3 (12px)</span>
          <div className="bg-primary w-4 h-4 rounded-xs" />
          <span className="text-xs">w-4 (16px)</span>
          <div className="bg-primary w-6 h-6 rounded-xs" />
          <span className="text-xs">w-6 (24px)</span>
          <div className="bg-primary w-8 h-8 rounded-xs" />
          <span className="text-xs">w-8 (32px)</span>
          <div className="bg-primary w-12 h-12 rounded-xs" />
          <span className="text-xs">w-12 (48px)</span>
          <div className="bg-primary w-16 h-16 rounded-xs" />
          <span className="text-xs">w-16 (64px)</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 4. RADIUS
// ============================================================

export const RadiusExamples = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        <div className="bg-primary w-16 h-16 rounded-xs flex items-center justify-center text-white text-xs">
          xs
        </div>
        <div className="bg-secondary w-16 h-16 rounded-sm flex items-center justify-center text-white text-xs">
          sm
        </div>
        <div className="bg-primary w-16 h-16 rounded-md flex items-center justify-center text-white text-xs">
          md
        </div>
        <div className="bg-secondary w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs">
          lg
        </div>
        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center text-white text-xs">
          full
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 5. SHADOWS & NEON GLOW
// ============================================================

export const ShadowExamples = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-6 flex-wrap">
        <div className="bg-base-200 border border-base-300 w-24 h-24 shadow-sm rounded-lg flex items-center justify-center text-xs text-base-content">
          shadow-sm
        </div>
        <div className="bg-base-200 border border-base-300 w-24 h-24 shadow-md rounded-lg flex items-center justify-center text-xs text-base-content">
          shadow-md
        </div>
        <div className="bg-base-200 border border-base-300 w-24 h-24 shadow-xl rounded-lg flex items-center justify-center text-xs text-base-content">
          shadow-xl
        </div>
        <div className="bg-primary text-white w-24 h-24 shadow-neon rounded-lg flex items-center justify-center text-xs font-semibold">
          shadow-neon
        </div>
        <div className="bg-primary text-white w-24 h-24 shadow-neon-lg rounded-lg flex items-center justify-center text-xs font-semibold">
          shadow-neon-lg
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 6. ANIMATIONS
// ============================================================

export const AnimationExamples = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-6 flex-wrap">
        <div className="bg-primary w-24 h-24 rounded-lg animate-fade-in flex items-center justify-center text-white text-xs">
          fade-in
        </div>
        <div className="bg-secondary w-24 h-24 rounded-lg animate-fade-rise flex items-center justify-center text-white text-xs">
          fade-rise
        </div>
        <div className="bg-primary w-24 h-24 rounded-lg animate-slide-up flex items-center justify-center text-white text-xs">
          slide-up
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 7. COMPLETE CARD EXAMPLE
// ============================================================

export const CompletePageExample = () => {
  return (
    <div className="bg-base-100 min-h-screen p-6 sm:p-8 text-base-content">
      <div className="max-w-md mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-extrabold font-primary text-primary">
            ✨ Rexone ✨
          </h1>
          <p className="text-body-m text-base-content/80">
            Super robust foundation to build & scale any digital product.
          </p>
        </div>

        {/* Card */}
        <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold font-primary text-base-content mb-2">Get Started</h2>
          <p className="text-body-s text-base-content/70 mb-4">
            Enter your email to sign in or create an account.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            />
            <button className="w-full bg-primary hover:opacity-95 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-neon active:scale-[0.98]">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
