// src/design/examples/UsageExamples.tsx

/**
 * Rexone Design System - Usage Examples
 *
 * Examples showing how to use the design system tokens
 *
 * ⚠️ DON'T import tokens directly in components - use Tailwind / DaisyUI classes instead!
 * This file is for reference/documentation only.
 */

// ============================================================
// 1. COLORS
// ============================================================

export const ColorExamples = () => {
  return (
    <div className="space-y-6">
      {/* Brand Colors */}
      <div className="space-y-2">
        <h4 className="text-h4">Brand Colors</h4>
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
        <h4 className="text-h4">Semantic Colors</h4>
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
        <h4 className="text-h4">Theme Base Surfaces</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-base-100 border border-base-300 px-4 py-2 rounded-md">
            Base 100 (Canvas)
          </div>
          <div className="bg-base-200 border border-base-300 px-4 py-2 rounded-md">
            Base 200 (Surface)
          </div>
          <div className="bg-base-300 px-4 py-2 rounded-md">
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
        <h1 className="text-display-l font-display">Display Large (40px)</h1>
        <h2 className="text-display-m font-display">Display Medium (32px)</h2>
        <h3 className="text-display-s font-display">Display Small (28px)</h3>
        <h1 className="text-h1">Heading 1 (24px)</h1>
        <h2 className="text-h2">Heading 2 (20px)</h2>
        <h3 className="text-h3">Heading 3 (18px)</h3>
        <h4 className="text-h4">Heading 4 (16px)</h4>
        <p className="text-body-l">Body Large (16px)</p>
        <p className="text-body-m">Body Medium (14px)</p>
        <p className="text-body-s">Body Small (12px)</p>
      </div>
    </div>
  );
};

// ============================================================
// 3. SPACING
// ============================================================

export const SpacingExamples = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-h4">Spacing Scale</h4>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-primary w-4 h-4 rounded-sm" />
          <span className="text-body-s">4px</span>
          <div className="bg-primary w-8 h-8 rounded-sm" />
          <span className="text-body-s">8px</span>
          <div className="bg-primary w-12 h-12 rounded-sm" />
          <span className="text-body-s">12px</span>
          <div className="bg-primary w-16 h-16 rounded-sm" />
          <span className="text-body-s">16px</span>
          <div className="bg-primary w-20 h-20 rounded-sm" />
          <span className="text-body-s">20px</span>
          <div className="bg-primary w-24 h-24 rounded-sm" />
          <span className="text-body-s">24px</span>
          <div className="bg-primary w-32 h-32 rounded-sm" />
          <span className="text-body-s">32px</span>
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
        <div className="bg-primary w-24 h-24 rounded-xs flex items-center justify-center text-white text-body-s">
          xs
        </div>
        <div className="bg-secondary w-24 h-24 rounded-sm flex items-center justify-center text-white text-body-s">
          sm
        </div>
        <div className="bg-primary w-24 h-24 rounded-md flex items-center justify-center text-white text-body-s">
          md
        </div>
        <div className="bg-secondary w-24 h-24 rounded-lg flex items-center justify-center text-white text-body-s">
          lg
        </div>
        <div className="bg-primary w-24 h-24 rounded-full flex items-center justify-center text-white text-body-s">
          full
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 5. SHADOWS
// ============================================================

export const ShadowExamples = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-8 flex-wrap">
        <div className="bg-base-200 w-32 h-32 shadow-xs rounded-md flex items-center justify-center text-body-s">
          xs
        </div>
        <div className="bg-base-200 w-32 h-32 shadow-sm rounded-md flex items-center justify-center text-body-s">
          sm
        </div>
        <div className="bg-base-200 w-32 h-32 shadow-md rounded-md flex items-center justify-center text-body-s">
          md
        </div>
        <div className="bg-primary w-32 h-32 shadow-lg rounded-full flex items-center justify-center text-white text-body-s">
          lg
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
      <div className="flex gap-8 flex-wrap">
        <div className="bg-primary w-32 h-32 rounded-md animate-fade-in flex items-center justify-center text-white text-body-s">
          fade-in
        </div>
        <div className="bg-secondary w-32 h-32 rounded-md animate-fade-rise flex items-center justify-center text-white text-body-s">
          fade-rise
        </div>
        <div className="bg-primary w-32 h-32 rounded-md animate-slide-up flex items-center justify-center text-white text-body-s">
          slide-up
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 7. COMPLETE PAGE EXAMPLE
// ============================================================

export const CompletePageExample = () => {
  return (
    <div className="bg-base-100 min-h-screen p-16 text-base-content">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-display-l font-display text-primary">
            ✨ Rexone ✨
          </h1>
          <p className="text-body-l text-base-content/80 max-w-2xl mx-auto">
            Super robust foundation to build & scale any digital product.
          </p>
        </div>

        {/* Card */}
        <div className="bg-base-200 border border-base-300 rounded-lg shadow-md p-8">
          <h2 className="text-h2 mb-4">Get Started</h2>
          <p className="text-body-m text-base-content/80 mb-6">
            Enter your email to sign in or create an account.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-base-300 rounded-md bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <button className="w-full bg-primary hover:opacity-90 text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 shadow-sm active:scale-[0.98]">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
