#!/usr/bin/env bash
# scripts/test-person-draft-path.sh

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=scripts/lib/person-draft-path.sh
source "$REPO_ROOT/scripts/lib/person-draft-path.sh"

TEST_DIR="$(mktemp -d)"
trap 'rm -rf "$TEST_DIR"' EXIT

touch "$TEST_DIR/Stable-Ronaldo.md"
touch "$TEST_DIR/Caitlin-Clark.md"

assert_resolves() {
	local input="$1"
	local expected="$2"
	local actual
	actual="$(resolve_person_draft_path "$TEST_DIR" "$input")" || {
		echo "FAIL: expected '$input' to resolve" >&2
		exit 1
	}
	if [[ "$actual" != "$TEST_DIR/$expected" ]]; then
		echo "FAIL: '$input' resolved to '$actual', expected '$TEST_DIR/$expected'" >&2
		exit 1
	fi
}

assert_resolves "Stable-Ronaldo" "Stable-Ronaldo.md"
assert_resolves "stableronaldo" "Stable-Ronaldo.md"
assert_resolves "stable_ronaldo.md" "Stable-Ronaldo.md"
assert_resolves "caitlinclark" "Caitlin-Clark.md"

if resolve_person_draft_path "$TEST_DIR" "missing-person" >/dev/null 2>&1; then
	echo "FAIL: missing identifier unexpectedly resolved" >&2
	exit 1
fi

touch "$TEST_DIR/A-B.md"
touch "$TEST_DIR/AB.md"
assert_resolves "AB" "AB.md"
resolve_person_draft_path "$TEST_DIR" "a_b" >/dev/null 2>&1
ambiguous_rc=$?
if [[ "$ambiguous_rc" -ne 2 ]]; then
	echo "FAIL: ambiguous identifier returned $ambiguous_rc, expected 2" >&2
	exit 1
fi

echo "person draft path resolver: PASS"
