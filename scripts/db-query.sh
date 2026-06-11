#!/usr/bin/env bash
# scripts/db-query.sh
#
# Read-only SQL runner for the growth-analyst agent (and any analytics work).
# Connects to the Supabase Postgres database and runs a single SELECT-style
# query in a forced read-only session. Output is CSV (agent/spreadsheet friendly).
#
# Setup (one time):
#   1. Supabase dashboard -> project -> Connect -> "Session pooler" connection string
#      (looks like postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres)
#   2. Add it to .env.local as:  SUPABASE_DB_URL=postgresql://...
#
# Usage:
#   ./scripts/db-query.sh "SELECT count(*) FROM profiles WHERE created_at > now() - interval '7 days'"
#   ./scripts/db-query.sh path/to/query.sql
#
# Safety:
#   - PGOPTIONS forces default_transaction_read_only=on for the whole session;
#     any INSERT/UPDATE/DELETE/DDL fails with "cannot execute ... in a read-only transaction".
#   - 30s statement timeout so a runaway query can't hang an agent run.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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
  cat >&2 <<'EOF'
SUPABASE_DB_URL is not set.

One-time setup:
  1. Supabase dashboard -> your project -> Connect -> copy the "Session pooler" URI
  2. Append to .env.local:
       SUPABASE_DB_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
EOF
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "usage: $0 \"SELECT ...\"  or  $0 query.sql" >&2
  exit 1
fi

# NOTE: Supabase's pooler (Supavisor) drops the PGOPTIONS startup parameter,
# so read-only must be set as a statement inside the session instead.
GUARD="SET default_transaction_read_only = on; SET statement_timeout = '30s';"

if [[ -f "$1" ]]; then
  exec psql "$URL" -X -q -P pager=off --csv -v ON_ERROR_STOP=1 -c "$GUARD" -f "$1"
else
  exec psql "$URL" -X -q -P pager=off --csv -v ON_ERROR_STOP=1 -c "$GUARD" -c "$1"
fi
