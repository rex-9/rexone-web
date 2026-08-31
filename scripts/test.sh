#!/usr/bin/env bash

# ==============================================================================
# Rexone Web — Test Runner (Vitest Unit + Playwright E2E)
#
# Usage:
#   ./scripts/test.sh [flow|file] [options]
#
# Examples:
#   ./scripts/test.sh                     # Run all auth flows
#   ./scripts/test.sh sign-in             # Run Sign In flow
#   ./scripts/test.sh sign-up             # Run Sign Up flow
#   ./scripts/test.sh passcode            # Run Passcode flow
#   ./scripts/test.sh password-reset      # Run Password Reset flow
#   ./scripts/test.sh sso                 # Run SSO flow
#   ./scripts/test.sh sign-out            # Run Sign Out flow
#   ./scripts/test.sh e2e/specs/auth/sign-in.spec.ts  # Run specific file
#
# Options:
#   --headed, -h     Run tests with a visible browser window
#   --ui, -u         Open Playwright's interactive UI mode
#   --debug, -d      Run in debug mode with Playwright Inspector
#   --help           Show this help message
# ==============================================================================

set -e

# Resolve script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

TARGET=""
EXTRA_ARGS=()

for arg in "$@"; do
  case "$arg" in
    --help)
      echo "Rexone Web — E2E Test Runner"
      echo ""
      echo "Usage: ./scripts/test.sh [flow|file] [--headed|--ui|--debug]"
      echo ""
      echo "Available Flows:"
      echo "  all             Run all E2E test suites (default)"
      echo "  sign-in         Sign In with email & passcode, retry, cooldown"
      echo "  sign-up         Full registration flow, name validation, username sanitization"
      echo "  passcode        Passcode matching, mismatch rejection, retries"
      echo "  password-reset  Forgot passcode link and cooldown timer"
      echo "  sso             Google SSO authentication"
      echo "  sign-out        Sign out & session termination"
      echo ""
      echo "Modes / Options:"
      echo "  --headed, -h    Watch tests run in real browser"
      echo "  --ui, -u        Launch interactive Playwright UI"
      echo "  --debug, -d     Launch step-by-step Playwright Inspector"
      echo ""
      exit 0
      ;;
    --headed|-h)
      EXTRA_ARGS+=("--headed")
      ;;
    --ui|-u)
      EXTRA_ARGS+=("--ui")
      ;;
    --debug|-d)
      EXTRA_ARGS+=("--debug")
      ;;
    all)
      TARGET="e2e/specs/auth/"
      ;;
    sign-in|signin|login)
      TARGET="e2e/specs/auth/sign-in.spec.ts"
      ;;
    sign-up|signup|register)
      TARGET="e2e/specs/auth/sign-up.spec.ts"
      ;;
    password|passcode|pin)
      TARGET="e2e/specs/auth/password.spec.ts"
      ;;
    password-reset|reset-password|forgot|forgot-password|forgot-passcode)
      TARGET="e2e/specs/auth/password-reset.spec.ts"
      ;;
    sso|google)
      TARGET="e2e/specs/auth/sso.spec.ts"
      ;;
    sign-out|signout|logout)
      TARGET="e2e/specs/auth/sign-out.spec.ts"
      ;;
    *.spec.ts|*.spec.tsx|e2e/*)
      TARGET="$arg"
      ;;
    *)
      # If unknown argument and doesn't start with dash, treat as search pattern or extra arg
      if [[ "$arg" != -* ]]; then
        if [ -f "$arg" ]; then
          TARGET="$arg"
        else
          TARGET="e2e/specs/auth/*${arg}*.spec.ts"
        fi
      else
        EXTRA_ARGS+=("$arg")
      fi
      ;;
  esac
done

if [ -z "$TARGET" ]; then
  TARGET="e2e/specs/auth/"
fi

echo ""
echo "===================================================="
echo " Running Unit Tests (Vitest)"
echo "===================================================="

npx vitest run

echo ""
echo "===================================================="
echo " Running E2E Tests (Playwright)"
echo " Target: $TARGET"
if [ ${#EXTRA_ARGS[@]} -gt 0 ]; then
  echo " Flags:  ${EXTRA_ARGS[*]}"
fi
echo "===================================================="

cleanup_test_data() {
  echo ""
  echo "🧹 Cleaning up test users from database..."
  docker exec dev-rexone-core-api bin/rails runner "User.where('email LIKE ? OR email LIKE ?', 'e2e-%', '%@rexone.test').destroy_all" 2>/dev/null || true
}
trap cleanup_test_data EXIT

npx playwright test "$TARGET" "${EXTRA_ARGS[@]}"
