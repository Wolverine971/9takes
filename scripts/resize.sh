#!/usr/bin/env bash
# Backwards-compatible entry point. The maintained implementation has a descriptive name.

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$script_dir/prepare-personality-image.sh" "$@"
