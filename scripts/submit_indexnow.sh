#!/usr/bin/env bash
# scripts/submit_indexnow.sh
# Instant indexing dispatcher for RexOne across Bing, Yandex, Naver, and Seznam.
# Usage: ./scripts/submit_indexnow.sh [domain]

set -e

HOST="${1:-rexone.rex9.me}"
KEY="9f8b2c4e1a7d3e5b6c8e9a0d2b4c6e8a"
KEY_LOCATION="https://${HOST}/${KEY}.txt"

echo "============================================================"
echo "📡 SUBMITTING REXONE TO INDEXNOW PROTOCOL"
echo "   Host: $HOST"
echo "   Endpoints: Bing, Yandex, Naver, Seznam"
echo "============================================================"

PAYLOAD=$(cat <<JSON
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [
    "https://${HOST}/",
    "https://${HOST}/llms.txt",
    "https://${HOST}/llms-full.txt",
    "https://${HOST}/sitemap.xml",
    "https://${HOST}/signin",
    "https://${HOST}/signup",
    "https://${HOST}/terms",
    "https://${HOST}/privacy"
  ]
}
JSON
)

echo "🚀 Dispatching ping to api.indexnow.org..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD" || true)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
  echo "✅ IndexNow submission accepted (HTTP $HTTP_CODE)."
  echo "   All participating search engines (Bing, Yandex, Naver, Seznam) notified."
else
  echo "ℹ️ IndexNow response: HTTP $HTTP_CODE"
  [ -n "$BODY" ] && echo "   Details: $BODY"
  echo "   (Note: Ensure https://${HOST}/${KEY}.txt is live on production before indexing)"
fi
echo "============================================================"
