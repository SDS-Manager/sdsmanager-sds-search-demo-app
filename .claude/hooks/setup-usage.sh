#!/bin/sh
# One-command setup for Claude Code usage reporting (macOS / Linux).
#
#   ./setup-usage.sh            -> prompts for the token
#   ./setup-usage.sh <token>    -> takes it as an argument
#
# Writes the token to ~/.claude/shepherd-usage.env and runs the hook's own
# --check so you get a yes/no immediately. The token is never stored in the
# repo; this only writes into your home directory.
set -eu

DIR="$HOME/.claude"
CFG="$DIR/shepherd-usage.env"
HOOK="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/shepherd-usage.py"

TOKEN="${1:-}"
if [ -z "$TOKEN" ]; then
    printf 'Paste the Claude-usage token from Erlend, then press Enter\n'
    printf '  (using the prompt keeps it out of your shell history): '
    # Read without echoing, so the token is not left on screen either.
    if [ -t 0 ]; then
        stty -echo 2>/dev/null || true
        read -r TOKEN || TOKEN=""
        stty echo 2>/dev/null || true
        printf '\n'
    else
        # EOF (piped empty stdin) must reach the check below, not abort here.
        read -r TOKEN || TOKEN=""
    fi
fi
if [ -z "$TOKEN" ]; then
    printf 'No token entered - nothing was written.\n' >&2
    exit 1
fi

mkdir -p "$DIR"
umask 077
printf 'SHEPHERD_USAGE_TOKEN=%s\n' "$TOKEN" > "$CFG"
chmod 600 "$CFG"
printf '\nWrote %s\n\n' "$CFG"

PY=""
for c in python3 python; do
    if command -v "$c" >/dev/null 2>&1; then PY="$c"; break; fi
done
if [ -z "$PY" ]; then
    printf 'Python was not found, so the check could not run. Then run:\n' >&2
    printf '  python3 "%s" --check\n' "$HOOK" >&2
    exit 1
fi

if "$PY" "$HOOK" --check; then
    printf '\nSetup looks good. Now RESTART Claude Code - hooks are only read\n'
    printf 'when a session starts - then work normally. Your row appears at\n'
    printf '  https://shepherd.sdsmanager.com/claude-usage\n'
else
    rc=$?
    printf '\nThe check did not pass - see above. TOKEN REJECTED means the\n' >&2
    printf 'token is wrong, so ask Erlend for it again.\n' >&2
    exit $rc
fi
