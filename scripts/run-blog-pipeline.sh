#!/usr/bin/env bash
# scripts/run-blog-pipeline.sh
# Evidence-first people-profile pipeline. See docs/writing-system/people-profile-standard.md.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"
# Explicit rollback for the pilot; legacy reviews remain supported by the publisher.
use_legacy=0
legacy_args=()
for arg in "$@"; do
  if [[ "$arg" == "--legacy" ]]; then
    use_legacy=1
  else
    legacy_args+=("$arg")
  fi
done
if [[ "$use_legacy" -eq 1 ]]; then
  exec bash "$REPO_ROOT/scripts/run-blog-pipeline-legacy.sh" "${legacy_args[@]}"
fi
exec node "$REPO_ROOT/scripts/run-blog-pipeline.mjs" "$@"
