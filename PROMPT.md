I have a React + TypeScript web application with the following architecture:

### Core Technologies

- React 18+ with TypeScript
- Vite as build tool
- Jotai for state management with localStorage persistence
- DaisyUI + TailwindCSS for styling
- React Router DOM for routing

### Design System Location

All design tokens are in `src/design/elements/`:

- `colors.ts` - Color palette (gold, navy, gray, semantic colors)
- `typography.ts` - Font sizes, weights, families
- `spacing.ts` - Spacing scale
- `radius.ts` - Border radius values
- `shadows.ts` - Box shadows
- `motion.ts` - Animation durations and easing
- `index.ts` - Exports everything

### Components Location

All reusable components are in `src/design/components/`:

- `button/Button.tsx` - Primary, secondary, tertiary variants with DaisyUI classes
- `button/GoogleButton.tsx` - Google Sign-In button
- `form/TextInput.tsx` - Form inputs with validation
- `form/PasscodeInput.tsx` - 6-digit passcode input
- `form/Toggle.tsx` - Toggle switch
- `form/Dropdown.tsx` - Dropdown select
- `common/NavBar.tsx` - Navigation bar
- `common/Typography.tsx` - Typography components
- `common/ProfileAvatar.tsx` - User avatar
- `overlay/Dialog.tsx` - Modal dialogs
- `overlay/LoadingOverlay.tsx` - Loading spinner
- `overlay/Toast.tsx` - Toast notifications
- `auth/*.tsx` - Auth dialogs (InitialDialog, SigninPasscodeDialog, etc.)

### Pages Location

Pages are in `src/design/pages/`:

- `HomePage.tsx` - Dashboard/home
- `LandingPage.tsx` - Landing/root
- `ProfilePage.tsx` - User profile
- `LayoutPage.tsx` - Layout wrapper with NavBar
- `auth/*.tsx` - Auth pages (SignIn, SignUp, ConfirmEmail, etc.)

### State Management

- Uses Jotai atoms from `src/atoms/index.ts`
- Atoms are persisted to localStorage via `atomWithStorage`
- Key atoms: `tokenAtom`, `currentUserAtom`, `themeAtom`, `localeAtom`

### Services Pattern

Services are in `src/services/`:

- `api.service.ts` - Axios instance with interceptors
- `auth.service.ts` - Auth API calls
- `user.service.ts` - User API calls
- `payment.service.ts` - Payment API calls

### Controllers Pattern

Controllers are in `src/controllers/`:

- `auth.controller.ts` - Auth logic
- `payment.controller.ts` - Payment logic
- `user.controller.ts` - User logic

### Context Providers

- `AuthContext.tsx` - Auth state provider using Jotai
- `LoadingContext.tsx` - Global loading state

### Routes

- `AppRoutes.ts` - Client and server route constants
- Uses dialog-based auth flow with URL parameters

### Tailwind Config

- Imports design tokens from `src/design/elements/`
- Uses DaisyUI themes: "day" (light) and "night" (dark)
- No direct color classes - use DaisyUI utility classes

### Key Patterns

- MVC: Components (View) → Controllers (Controller) → Services (Model/API)
- Always import from `src/design/index.ts` for design tokens
- Always use DaisyUI classes for styling (btn, card, etc.)
- No inline styles, no custom CSS
- Loading states handled by `LoadingContext`
- Error handling via `Toast` notifications

### Payment Flow

- Products listed on payment page
- Checkout button calls `PaymentController.createCheckout`
- Opens Stripe Checkout URL
- Success/cancel redirects back to app
- Subscription status shown on home page

### When implementing new features:

1. Create service in `src/services/` for API calls
2. Create controller in `src/controllers/` for business logic
3. Create page in `src/design/pages/`
4. Use existing components from `src/design/components/`
5. Use design tokens from `src/design/elements/`
6. Use DaisyUI classes for styling
7. Use Jotai atoms for state that needs persistence
8. Use LoadingContext for loading states
9. Use Toast for user feedback
10. Follow existing pattern of other pages/controllers
