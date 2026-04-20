#!/bin/bash
#
# Push local .env.local → Vercel production env vars
#
# Usage: bash scripts/push-env-to-vercel.sh
#
# Reads .env.local line by line (KEY=value), trims quotes/whitespace, and adds
# each entry to Vercel production. Existing values are overwritten via --force.
# Skips blank lines and comments.
#

set -e
set -o pipefail

ENV_FILE=".env.local"
TARGET_ENV="production"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found in $(pwd)"
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  echo "ERROR: vercel CLI not installed"
  exit 1
fi

echo "Pushing env vars from $ENV_FILE to Vercel $TARGET_ENV..."
echo

ADDED=0
SKIPPED=0

while IFS= read -r line || [ -n "$line" ]; do
  # Skip blank lines and comments
  [[ -z "$line" ]] && continue
  [[ "$line" =~ ^[[:space:]]*# ]] && continue

  # Split on first =
  key="${line%%=*}"
  value="${line#*=}"

  # Trim whitespace from key
  key=$(echo "$key" | xargs)
  [[ -z "$key" ]] && continue

  # Strip surrounding single or double quotes from value
  if [[ "$value" =~ ^\".*\"$ ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" =~ ^\'.*\'$ ]]; then
    value="${value:1:${#value}-2}"
  fi

  echo "→ Adding $key"

  # Remove existing (ignore errors if not present), then add fresh
  vercel env rm "$key" "$TARGET_ENV" --yes 2>/dev/null || true
  if printf "%s" "$value" | vercel env add "$key" "$TARGET_ENV" > /dev/null 2>&1; then
    ADDED=$((ADDED + 1))
  else
    echo "  ⚠ failed to add $key"
    SKIPPED=$((SKIPPED + 1))
  fi
done < "$ENV_FILE"

echo
echo "Done. Added: $ADDED, Failed: $SKIPPED"
echo
echo "Now redeploy with:  vercel --prod --yes"
