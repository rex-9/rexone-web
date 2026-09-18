#!/usr/bin/env bash
# ==============================================================================
# RexOne Web — Development Container Runner
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

COMPOSE_FILE="docker-compose.dev.yaml"

if [ -n "$(docker compose -f "$COMPOSE_FILE" ps -q)" ]; then
  echo "Containers are already running. Starting without rebuild..."
  docker compose -f "$COMPOSE_FILE" up "$@"
else
  echo "Containers are not running. Building and starting..."
  docker compose -f "$COMPOSE_FILE" up --build "$@"
fi
