#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${NVM_DIR:-}" ]]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
  echo "nvm is not available in this shell. Install nvm or open a shell with nvm loaded."
  exit 1
fi

# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"

if ! nvm ls 20.20.1 >/dev/null 2>&1; then
  echo "Node 20.20.1 is not installed. Run: nvm install 20.20.1"
  exit 1
fi

nvm exec 20.20.1 "$@"
