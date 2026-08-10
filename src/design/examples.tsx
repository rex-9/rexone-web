// src/design/examples/UsageExamples.tsx

/**
 * Rexone Design System - Usage Examples
 *
 * Examples showing how to use the design system tokens
 *
 * ⚠️ DON'T import tokens directly in components - use Tailwind classes instead!
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
          <div className="bg-gold-400 px-4 py-2 rounded-md">Gold 400</div>
          <div className="bg-gold-500 px-4 py-2 rounded-md">
            Gold 500 (Primary)
          </div>
          <div className="bg-gold-600 px-4 py-2 rounded-md">Gold 600</div>
          <div className="bg-blue-400 px-4 py-2 rounded-md">Blue 400</div>
          <div className="bg-blue-500 px-4 py-2 rounded-md">
            Blue 500 (Secondary)
          </div>
          <div className="bg-blue-600 px-4 py-2 rounded-md">Blue 600</div>
          <div className="bg-navy-700 text-white px-4 py-2 rounded-md">
            Navy 700
          </div>
          <div className="bg-navy-900 text-white px-4 py-2 rounded-md">
            Navy 900
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
          <div className="bg-warning px-4 py-2 rounded-md">Warning</div>
          <div className="bg-error text-white px-4 py-2 rounded-md">Error</div>
          <div className="bg-info text-white px-4 py-2 rounded-md">Info</div>
        </div>
      </div>

      {/* Theme Colors */}
      <div className="space-y-2">
        <h4 className="text-h4">Theme Colors</h4>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="bg-light-bg-primary p-4 border rounded-md">
            Light BG Primary
          </div>
          <div className="bg-light-bg-secondary p-4 border rounded-md">
            Light BG Secondary
          </div>
          <div className="bg-dark-bg-primary text-white p-4 rounded-md">
            Dark BG Primary
          </div>
          <div className="bg-dark-bg-secondary text-white p-4 rounded-md">
            Dark BG Secondary
          </div>
        </div>
      </div>

      {/* Grays */}
      <div className="space-y-2">
        <h4 className="text-h4">Grays</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-gray-50 px-4 py-2 border rounded-md">Gray 50</div>
          <div className="bg-gray-100 px-4 py-2 border rounded-md">
            Gray 100
          </div>
          <div className="bg-gray-200 px-4 py-2 border rounded-md">
            Gray 200
          </div>
          <div className="bg-gray-300 px-4 py-2 border rounded-md">
            Gray 300
          </div>
          <div className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Gray 500
          </div>
          <div className="bg-gray-700 text-white px-4 py-2 rounded-md">
            Gray 700
          </div>
          <div className="bg-gray-900 text-white px-4 py-2 rounded-md">
            Gray 900
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
      {/* Display */}
      <div className="space-y-2">
        <h4 className="text-h4">Display</h4>
        <div className="space-y-1">
          <p className="text-display-xl">Display XL</p>
          <p className="text-display-l">Display L</p>
          <p className="text-display-m">Display M</p>
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-2">
        <h4 className="text-h4">Headings</h4>
        <div className="space-y-1">
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-h4">Heading 4</p>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <h4 className="text-h4">Body</h4>
        <div className="space-y-1">
          <p className="text-body-l">
            Body Large - The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-body-m">
            Body Medium - The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-body-s">
            Body Small - The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-caption text-gray-500">
            Caption - The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>

      {/* Font Families */}
      <div className="space-y-2">
        <h4 className="text-h4">Font Families</h4>
        <div className="space-y-1">
          <p className="font-primary">Primary Font (Inter)</p>
          <p className="font-display">Display Font (Cormorant Garamond)</p>
          <p className="font-handwritten">Handwritten Font (Satisfy)</p>
        </div>
      </div>

      {/* Font Weights */}
      <div className="space-y-2">
        <h4 className="text-h4">Font Weights</h4>
        <div className="space-y-1">
          <p className="font-light">Light (300)</p>
          <p className="font-regular">Regular (400)</p>
          <p className="font-medium">Medium (500)</p>
          <p className="font-semibold">Semibold (600)</p>
          <p className="font-bold">Bold (700)</p>
        </div>
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
          <div className="bg-gold-500 w-4 h-4 rounded-sm" />
          <span className="text-body-s">4px</span>
          <div className="bg-gold-500 w-8 h-8 rounded-sm" />
          <span className="text-body-s">8px</span>
          <div className="bg-gold-500 w-12 h-12 rounded-sm" />
          <span className="text-body-s">12px</span>
          <div className="bg-gold-500 w-16 h-16 rounded-sm" />
          <span className="text-body-s">16px</span>
          <div className="bg-gold-500 w-20 h-20 rounded-sm" />
          <span className="text-body-s">20px</span>
          <div className="bg-gold-500 w-24 h-24 rounded-sm" />
          <span className="text-body-s">24px</span>
          <div className="bg-gold-500 w-32 h-32 rounded-sm" />
          <span className="text-body-s">32px</span>
          <div className="bg-gold-500 w-40 h-40 rounded-sm" />
          <span className="text-body-s">40px</span>
        </div>
      </div>

      {/* Padding Examples */}
      <div className="space-y-2">
        <h4 className="text-h4">Padding Examples</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-gray-100 p-4 border rounded-md">p-4</div>
          <div className="bg-gray-100 p-8 border rounded-md">p-8</div>
          <div className="bg-gray-100 p-12 border rounded-md">p-12</div>
          <div className="bg-gray-100 p-16 border rounded-md">p-16</div>
        </div>
      </div>

      {/* Gap Examples */}
      <div className="space-y-2">
        <h4 className="text-h4">Gap Examples</h4>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-gold-500 w-12 h-12 rounded-sm" />
          <div className="bg-blue-500 w-12 h-12 rounded-sm" />
          <div className="bg-gold-500 w-12 h-12 rounded-sm" />
        </div>
        <div className="flex gap-8 flex-wrap">
          <div className="bg-gold-500 w-12 h-12 rounded-sm" />
          <div className="bg-blue-500 w-12 h-12 rounded-sm" />
          <div className="bg-gold-500 w-12 h-12 rounded-sm" />
        </div>
        <div className="flex gap-12 flex-wrap">
          <div className="bg-gold-500 w-12 h-12 rounded-sm" />
          <div className="bg-blue-500 w-12 h-12 rounded-sm" />
          <div className="bg-gold-500 w-12 h-12 rounded-sm" />
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
        <div className="bg-gold-500 w-24 h-24 rounded-xs flex items-center justify-center text-white text-body-s">
          xs
        </div>
        <div className="bg-blue-500 w-24 h-24 rounded-sm flex items-center justify-center text-white text-body-s">
          sm
        </div>
        <div className="bg-gold-500 w-24 h-24 rounded-md flex items-center justify-center text-white text-body-s">
          md
        </div>
        <div className="bg-blue-500 w-24 h-24 rounded-lg flex items-center justify-center text-white text-body-s">
          lg
        </div>
        <div className="bg-gold-500 w-24 h-24 rounded-full flex items-center justify-center text-white text-body-s">
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
        <div className="bg-white w-32 h-32 shadow-xs rounded-md flex items-center justify-center text-body-s">
          xs
        </div>
        <div className="bg-white w-32 h-32 shadow-sm rounded-md flex items-center justify-center text-body-s">
          sm
        </div>
        <div className="bg-white w-32 h-32 shadow-md rounded-md flex items-center justify-center text-body-s">
          md
        </div>
        <div className="bg-gold-500 w-32 h-32 shadow-glow rounded-full flex items-center justify-center text-navy-900 text-body-s">
          glow
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
        <div className="bg-gold-500 w-32 h-32 rounded-md animate-fade-in flex items-center justify-center text-navy-900 text-body-s">
          fade-in
        </div>
        <div className="bg-blue-500 w-32 h-32 rounded-md animate-fade-rise flex items-center justify-center text-white text-body-s">
          fade-rise
        </div>
        <div className="bg-gold-500 w-32 h-32 rounded-md animate-slide-up flex items-center justify-center text-navy-900 text-body-s">
          slide-up
        </div>
        <div className="bg-gold-500 w-32 h-32 rounded-full shadow-glow animate-glow-pulse flex items-center justify-center text-navy-900 text-body-s">
          pulse
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
    <div className="bg-light-bg-primary min-h-screen p-16 dark:bg-dark-bg-primary">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-display-l font-display text-navy-900 dark:text-white">
            ✨ Rexone ✨
          </h1>
          <p className="text-body-l text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Support dreams or make yours come true—where every merit counts.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-8">
          <h2 className="text-h2 mb-4">Get Started</h2>
          <p className="text-body-m text-gray-700 dark:text-gray-300 mb-6">
            Enter your email to sign in or create an account.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-dark-bg-primary text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <button className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold py-3 px-4 rounded-md transition-all duration-200 shadow-glow hover:shadow-glow active:scale-[0.98]">
              Continue
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-dark-bg-secondary px-4 text-body-s text-gray-500 dark:text-gray-400">
                or
              </span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-dark-bg-primary border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-bg-secondary text-gray-700 dark:text-white font-medium py-3 px-4 rounded-md transition-all duration-200 active:scale-[0.98]">
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-caption text-gray-500 dark:text-gray-400">
            © 2026 Rexone. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN EXPORT
// ============================================================

export const DesignExamples = () => {
  return (
    <div className="space-y-12 p-8 max-w-6xl mx-auto">
      <h1 className="text-display-l text-center">🎨 Rexone Design System</h1>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-h2 mb-6">1. Colors</h2>
        <ColorExamples />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-h2 mb-6">2. Typography</h2>
        <TypographyExamples />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-h2 mb-6">3. Spacing</h2>
        <SpacingExamples />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-h2 mb-6">4. Radius</h2>
        <RadiusExamples />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-h2 mb-6">5. Shadows</h2>
        <ShadowExamples />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-h2 mb-6">6. Animations</h2>
        <AnimationExamples />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-h2 mb-6">7. Complete Example</h2>
        <CompletePageExample />
      </div>
    </div>
  );
};

export default DesignExamples;
