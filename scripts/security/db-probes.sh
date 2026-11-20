#!/usr/bin/env bash
# scripts/security/db-probes.sh
#
# Runs the database access-rule probes (db-probes.sql) against the Supabase
# Postgres database inside a transaction that is ALWAYS rolled back: nothing
# this script does is ever committed. Exits non-zero if any probe fails.
#
# Usage:
#   ./scripts/security/db-probes.sh                 # probe the database as it is
#   ./scripts/security/db-probes.sh --phase 1       # skip rules that need the phase-2 migration
#   ./scripts/security/db-probes.sh --verbose       # list every probe, not only failures
#   ./scripts/security/db-probes.sh --with a.sql --with b.sql
#       Dry run: apply those migration files first, inside the same rolled-back
#       transaction, then probe. Proves a migration applies and closes what it
#       claims to before it is ever committed.
#
# Connection: SUPABASE_DB_URL from the environment, else .env.local / .env
# (the same variable scripts/db-query.sh uses).
#
# Safety: one transaction, no COMMIT anywhere, short lock and statement
# timeouts so a probe run can never queue behind or block live traffic for
# long. If psql exits early for any reason the server discards the transaction.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROBES="$REPO_ROOT/scripts/security/db-probes.sql"

PHASE=2
VERBOSE=0
WITH_FILES=()
while [[ $# -gt 0 ]]; do
	case "$1" in
		--phase) PHASE="$2"; shift 2 ;;
		--verbose) VERBOSE=1; shift ;;
		--with) WITH_FILES+=("$2"); shift 2 ;;
		*) echo "Unknown argument: $1" >&2; exit 2 ;;
	esac
done

URL="${SUPABASE_DB_URL:-}"
if [[ -z "$URL" ]]; then
	for envfile in "$REPO_ROOT/.env.local" "$REPO_ROOT/.env"; do
		if [[ -f "$envfile" ]]; then
			line="$(grep -m1 '^SUPABASE_DB_URL=' "$envfile" || true)"
			if [[ -n "$line" ]]; then
				URL="${line#SUPABASE_DB_URL=}"
				URL="${URL%\"}"; URL="${URL#\"}"
				break
			fi
		fi
	done
fi
if [[ -z "$URL" ]]; then
	echo "SUPABASE_DB_URL is not set (environment, .env.local or .env)." >&2
	exit 2
fi

SCRIPT="$(mktemp)"
trap 'rm -f "$SCRIPT"' EXIT
{
	echo '\set ON_ERROR_STOP on'
	echo 'BEGIN;'
	echo "SET LOCAL lock_timeout = '3s';"
	echo "SET LOCAL statement_timeout = '45s';"
	echo "SET LOCAL idle_in_transaction_session_timeout = '60s';"
	for f in ${WITH_FILES[@]+"${WITH_FILES[@]}"}; do
		echo "\\echo '== Dry-run applying $(basename "$f") =='"
		echo "\\i '$f'"
	done
	echo "\\set phase $PHASE"
	if [[ "$VERBOSE" == "1" ]]; then echo '\set verbose 1'; fi
	echo "\\i '$PROBES'"
	echo 'ROLLBACK;'
	echo '\if :probe_failed'
	echo "\\echo 'RESULT: FAILED'"
	echo '\else'
	echo "\\echo 'RESULT: all probes held'"
	echo '\endif'
} >"$SCRIPT"

# psql cannot set its own exit code from a query result, so translate the sentinel line.
OUTPUT="$(PGAPPNAME=9takes-db-probes psql "$URL" --no-psqlrc --quiet --set=ON_ERROR_STOP=1 -f "$SCRIPT" 2>&1)" || {
	echo "$OUTPUT"
	echo "RESULT: ERROR (psql failed; transaction discarded)" >&2
	exit 3
}
echo "$OUTPUT"
if grep -q '^RESULT: FAILED' <<<"$OUTPUT"; then
	exit 1
fi
