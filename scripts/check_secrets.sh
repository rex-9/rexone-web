#!/usr/bin/env bash
# ==============================================================================
# RexOne Web Pre-Commit Secret Scanner
# Guards against accidental commits of .env files, private keys, and cloud API secrets.
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

INSTALL_HOOK=false
SCAN_ALL=false

for arg in "$@"; do
  case "$arg" in
    --install)
      INSTALL_HOOK=true
      ;;
    --all)
      SCAN_ALL=true
      ;;
    *)
      ;;
  esac
done

if [ "$INSTALL_HOOK" = true ]; then
  GIT_DIR=$(git rev-parse --git-dir 2>/dev/null || true)
  if [ -z "$GIT_DIR" ]; then
    echo -e "${RED}❌ Error: Not a git repository.${NC}"
    exit 1
  fi

  HOOK_PATH="${GIT_DIR}/hooks/pre-commit"
  echo "#!/usr/bin/env bash" > "$HOOK_PATH"
  echo "./scripts/check_secrets.sh" >> "$HOOK_PATH"
  chmod +x "$HOOK_PATH"
  echo -e "${GREEN}✅ Installed pre-commit secret scanner to ${HOOK_PATH}${NC}"
  exit 0
fi

echo -e "${CYAN}🔍 Scanning web workspace for uncommitted secrets and sensitive files...${NC}"

FAILURES=0

# 1. Check for real .env files staged for commit
if [ "$SCAN_ALL" = true ]; then
  ENV_FILES=$(git ls-files | grep -E '(^|/)\.env(\.[a-zA-Z0-9_-]+)?$' | grep -v '\.env\.example$' || true)
else
  ENV_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -E '(^|/)\.env(\.[a-zA-Z0-9_-]+)?$' | grep -v '\.env\.example$' || true)
fi

if [ -n "$ENV_FILES" ]; then
  echo -e "${RED}❌ BLOCKED: Attempting to commit real .env file(s):${NC}"
  for f in $ENV_FILES; do
    echo -e "   ${RED}• $f${NC}"
  done
  echo -e "${YELLOW}   Only .env.example may be committed to git.${NC}"
  FAILURES=$((FAILURES + 1))
fi

# 2. Check for high-risk private keys and live cloud credentials in content
if [ "$SCAN_ALL" = true ]; then
  DIFF_CONTENT=$(git grep -I -n -E \
    -e '-----BEGIN (RSA |OPENSSH |EC |DSA |PGP )?PRIVATE KEY-----' \
    -e 'AKIA[0-9A-Z]{16}' \
    -e 'sk_live_[0-9a-zA-Z]{24,}' \
    -e 'ghp_[0-9a-zA-Z]{36}' \
    -e 'github_pat_[0-9a-zA-Z_]{82}' \
    -e 'AIzaSy[0-9A-Za-z_-]{33}' \
    -- ':!*.example' ':!*.sample' ':!package-lock.json' ':!*.lock' ':!scripts/check_secrets.sh' || true)
else
  DIFF_CONTENT=$(git diff --cached -U0 --diff-filter=ACM -- ':(exclude)*.example' ':(exclude)*.sample' ':(exclude)*package-lock.json' ':(exclude)*.lock' ':(exclude)scripts/check_secrets.sh' 2>/dev/null | \
    grep -E '^\+[^+]' | \
    grep -E \
      -e '-----BEGIN (RSA |OPENSSH |EC |DSA |PGP )?PRIVATE KEY-----' \
      -e 'AKIA[0-9A-Z]{16}' \
      -e 'sk_live_[0-9a-zA-Z]{24,}' \
      -e 'ghp_[0-9a-zA-Z]{36}' \
      -e 'github_pat_[0-9a-zA-Z_]{82}' \
      -e 'AIzaSy[0-9A-Za-z_-]{33}' || true)
fi

if [ -n "$DIFF_CONTENT" ]; then
  echo -e "${RED}❌ BLOCKED: High-risk secrets or credentials detected in staged code:${NC}"
  echo "$DIFF_CONTENT" | head -n 10
  echo -e "${YELLOW}   Remove live keys or replace them with environment variable lookups.${NC}"
  FAILURES=$((FAILURES + 1))
fi

if [ "$FAILURES" -gt 0 ]; then
  echo ""
  echo -e "${RED}🚨 Commit blocked by RexOne Secret Scanner. Please resolve the above issues.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Secret scan passed: No staged credentials or unauthorized .env files detected.${NC}"
exit 0
