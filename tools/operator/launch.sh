#!/usr/bin/env bash
# Start (or restart) the agent-operated browser: real Chrome, its own profile,
# CDP on 127.0.0.1:9222. Separate --user-data-dir means it coexists with the
# human's normal Chrome and never touches their profile. The profile persists,
# so a one-time human sign-in stays available to future agent sessions.
set -euo pipefail
PROFILE="$HOME/.pumasi/operator-chrome"
mkdir -p "$PROFILE"
pkill -f "user-data-dir=$PROFILE" 2>/dev/null && sleep 1 || true
nohup google-chrome \
  --user-data-dir="$PROFILE" \
  --remote-debugging-port=9222 \
  --no-first-run --no-default-browser-check \
  --window-size=1440,1000 \
  "${1:-about:blank}" >/dev/null 2>&1 &
sleep 3
curl -s http://127.0.0.1:9222/json/version | head -c 200 && echo && echo "operator browser up"
