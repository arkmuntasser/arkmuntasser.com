#!/usr/bin/env bash
set -euo pipefail

HANDLE="arkmuntasser.com"
IMAGE="${1:?usage: ./set-icon.sh path/to/image.png}"
RKEY="self"
COLLECTION="site.standard.publication"
PDS="https://bsky.social"   # or your own PDS endpoint

read -srp "App password: " APP_PW; echo
MIME=$(file -b --mime-type "$IMAGE")
SIZE=$(stat -c%s "$IMAGE" 2>/dev/null || stat -f%z "$IMAGE")

SESSION=$(curl -sS -X POST "$PDS/xrpc/com.atproto.server.createSession" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$HANDLE\",\"password\":\"$APP_PW\"}")
JWT=$(echo "$SESSION" | jq -r .accessJwt)
DID=$(echo "$SESSION" | jq -r .did)

BLOB=$(curl -sS -X POST "$PDS/xrpc/com.atproto.repo.uploadBlob" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: $MIME" \
  --data-binary "@$IMAGE" | jq -c .blob)

CURRENT=$(curl -sS "$PDS/xrpc/com.atproto.repo.getRecord?repo=$DID&collection=$COLLECTION&rkey=$RKEY" | jq .value)
NEW=$(echo "$CURRENT" | jq --argjson blob "$BLOB" '. + {icon: $blob}')

curl -sS -X POST "$PDS/xrpc/com.atproto.repo.putRecord" \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d "$(jq -n --arg repo "$DID" --arg coll "$COLLECTION" --arg rkey "$RKEY" --argjson record "$NEW" \
        '{repo:$repo,collection:$coll,rkey:$rkey,record:$record}')" | jq .
