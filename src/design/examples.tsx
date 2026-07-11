/**
 * Meritbox Design System - Usage Examples
 *
 * Examples showing how to use the design system tokens
 *
 * DON'T use them directly. Only use from Tailwind Config after importing there for clean structure.
 *
 * This file is for reference and can be deleted if not needed
 */

import { colors, typography } from "./index";
import { getColor, getSpacing, getRadius, getShadow } from "./utils";

/**
 * Example: Using tokens directly in TypeScript
 */
export const ExampleDirectUsage = () => {
  const primaryColor = colors.gold[500];
  const bodyTextSize = typography.fontSize.bodyM.fontSize;

  return (
    <div
      style={{
        color: primaryColor,
        fontSize: bodyTextSize,
      }}
    >
      Direct token usage
    </div>
  );
};

/**
 * Example: Using utility functions
 */
export const ExampleUtilityFunctions = () => {
  const gold = getColor("gold", 500);
  const padding = getSpacing(16);
  const borderRadius = getRadius("md");
  const shadow = getShadow("sm");

  return (
    <div
      style={{
        backgroundColor: gold,
        padding,
        borderRadius,
        boxShadow: shadow,
      }}
    >
      Using utility functions
    </div>
  );
};

/**
 * Example: Using Tailwind classes (recommended)
 */
export const ExampleTailwindClasses = () => {
  return (
    <div className="bg-gold-500 text-navy-900 p-8 rounded-m shadow-s">
      <h1 className="text-h1 font-semibold mb-4">Heading 1</h1>
      <p className="text-body-m mb-2">Body text using design system tokens</p>
      <span className="text-caption text-gray-700">Caption text</span>
    </div>
  );
};

/**
 * Example: Using CSS variables
 */
export const ExampleCSSVariables = () => {
  return (
    <style>{`
      .custom-component {
        background-color: var(--mb-gold-500);
        color: var(--mb-navy-900);
        padding: var(--mb-spacing-16);
        border-radius: var(--mb-radius-m);
        box-shadow: var(--mb-shadow-s);
        font-family: var(--mb-font-primary);
        font-size: var(--mb-body-m-font-size);
        line-height: var(--mb-body-m-line-height);
      }
    `}</style>
  );
};

/**
 * Example: Semantic colors
 */
export const ExampleSemanticColors = () => {
  return (
    <div className="space-y-4">
      <div className="bg-success text-white p-4 rounded-m">Success message</div>
      <div className="bg-warning text-navy-900 p-4 rounded-m">
        Warning message
      </div>
      <div className="bg-error text-white p-4 rounded-m">Error message</div>
      <div className="bg-info text-white p-4 rounded-m">Info message</div>
    </div>
  );
};

/**
 * Example: Typography scale
 */
export const ExampleTypographyScale = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-display-xl">Display XL</h1>
      <h1 className="text-display-l">Display L</h1>
      <h1 className="text-display-m">Display M</h1>
      <h1 className="text-h1">Heading 1</h1>
      <h2 className="text-h2">Heading 2</h2>
      <h3 className="text-h3">Heading 3</h3>
      <h4 className="text-h4">Heading 4</h4>
      <p className="text-body-l">Body Large - Lorem ipsum dolor sit amet</p>
      <p className="text-body-m">Body Medium - Lorem ipsum dolor sit amet</p>
      <p className="text-body-s">Body Small - Lorem ipsum dolor sit amet</p>
      <span className="text-caption">Caption text</span>
    </div>
  );
};

/**
 * Example: Spacing system
 */
export const ExampleSpacing = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gold-500 p-4">Padding 4</div>
      <div className="bg-blue-500 p-8">Padding 8</div>
      <div className="bg-gold-500 p-12">Padding 12</div>
      <div className="bg-blue-500 p-16">Padding 16</div>
      <div className="bg-gold-500 p-24">Padding 24</div>
      <div className="bg-blue-500 p-32">Padding 32</div>
    </div>
  );
};

/**
 * Example: Radius system
 */
export const ExampleRadius = () => {
  return (
    <div className="space-y-4">
      <div className="bg-gold-500 p-8 rounded-xs">Radius XS</div>
      <div className="bg-blue-500 p-8 rounded-s">Radius S</div>
      <div className="bg-gold-500 p-8 rounded-m">Radius M (Default)</div>
      <div className="bg-blue-500 p-8 rounded-l">Radius L</div>
      <div className="bg-gold-500 p-8 rounded-full w-32 h-32">Radius Full</div>
    </div>
  );
};

/**
 * Example: Shadow system
 */
export const ExampleShadows = () => {
  return (
    <div className="space-y-8 p-8">
      <div className="bg-white p-8 shadow-xs rounded-m">Shadow XS</div>
      <div className="bg-white p-8 shadow-s rounded-m">Shadow S</div>
      <div className="bg-white p-8 shadow-m rounded-m">Shadow M</div>
      <div className="bg-gold-500 p-8 shadow-glow rounded-full w-32 h-32 mx-auto">
        Glow Shadow
      </div>
    </div>
  );
};
