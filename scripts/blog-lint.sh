#!/usr/bin/env bash
# scripts/blog-lint.sh
#
# Deterministic lint for 9takes personality-analysis drafts.
# Born from the 2026-06-10 pipeline audit: mechanically-checkable rules were being
# enforced only by LLM willpower across 7 stages, and the corpus showed they don't
# hold (rabbit hole in 50/430 drafts, templated FAQ filler in 196, em-dash bans
# ignored). LLM passes do judgment; this script does rules.
#
# Usage:
#   ./scripts/blog-lint.sh <Person-Name>                 # looks in src/blog/people/drafts/
#   ./scripts/blog-lint.sh src/blog/people/drafts/X.md   # explicit path
#
# Exit codes: 0 = no failures (warnings allowed), 1 = at least one FAIL, 2 = usage/file error.
#
# FAIL = violates a hard rule from blog_content_creator_people_v2 / enrich / publish specs.
# WARN = suspicious but policy is unresolved or false positives are possible.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ARG="${1:-}"
if [[ -z "$ARG" ]]; then
  echo "Usage: $0 <Person-Name | path/to/draft.md>" >&2
  exit 2
fi

if [[ -f "$ARG" ]]; then
  FILE="$ARG"
elif [[ -f "$REPO_ROOT/$ARG" ]]; then
  FILE="$REPO_ROOT/$ARG"
elif [[ -f "$REPO_ROOT/src/blog/people/drafts/$ARG.md" ]]; then
  FILE="$REPO_ROOT/src/blog/people/drafts/$ARG.md"
else
  echo "Draft not found: $ARG" >&2
  exit 2
fi

BASE="$(basename "$FILE" .md)"
FAILS=0
WARNS=0

fail() { echo "FAIL  $1"; FAILS=$((FAILS + 1)); }
warn() { echo "WARN  $1"; WARNS=$((WARNS + 1)); }
pass() { echo "ok    $1"; }

# --- split frontmatter / body ---------------------------------------------
FM="$(awk '/^---$/{c++; next} c==1' "$FILE")"
BODY="$(awk '/^---$/{c++; next} c>=2' "$FILE")"

if [[ -z "$FM" ]]; then
  fail "no YAML frontmatter found"
  echo "Summary: $FAILS fail, $WARNS warn"
  exit 1
fi

# --- required frontmatter fields -------------------------------------------
for field in title meta_title persona_title description author date enneagram person suggestions production_pretext; do
  if grep -qE "^${field}:" <<<"$FM"; then
    pass "frontmatter field present: $field"
  else
    fail "missing frontmatter field: $field"
  fi
done

# --- description length (creator spec: 145-160; rubric tolerance: 120-170) --
DESC="$(grep -m1 -E "^description:" <<<"$FM" | sed -E "s/^description:[[:space:]]*//; s/^['\"]//; s/['\"]$//")"
if [[ -n "$DESC" ]]; then
  DLEN=${#DESC}
  if (( DLEN < 120 || DLEN > 170 )); then
    fail "description length $DLEN chars (must be 120-170; target 145-160)"
  elif (( DLEN < 145 || DLEN > 160 )); then
    warn "description length $DLEN chars (inside tolerance, but target is 145-160)"
  else
    pass "description length $DLEN chars"
  fi
fi

# --- meta_title length (rubric: 35-65 chars) --------------------------------
MTITLE="$(grep -m1 -E "^meta_title:" <<<"$FM" | sed -E "s/^meta_title:[[:space:]]*//; s/^['\"]//; s/['\"]$//")"
if [[ -n "$MTITLE" ]]; then
  MLEN=${#MTITLE}
  if (( MLEN > 65 )); then
    fail "meta_title length $MLEN chars (max 65)"
  elif (( MLEN < 35 )); then
    warn "meta_title length $MLEN chars (target 35-65)"
  else
    pass "meta_title length $MLEN chars"
  fi
fi

# --- required type-section headings ----------------------------------------
if grep -qiE "^## What is .*personality type\?" <<<"$BODY"; then
  pass "required H2 'What is [Person]'s personality type?' present"
else
  fail "missing required H2: 'What is [Person]'s personality type?'"
fi
if grep -qiE "^### .* is an Enneagram Type [1-9]" <<<"$BODY"; then
  pass "required H3 '[Person] is an Enneagram Type X' present"
else
  fail "missing required H3: '[Person] is an Enneagram Type X'"
fi

# --- rabbit hole (required, exactly one) ------------------------------------
RH_COUNT=$(grep -c 'enneagram-rabbit-hole' <<<"$BODY" || true)
if (( RH_COUNT == 0 )); then
  fail "missing Enneagram Rabbit Hole block (<details class=\"enneagram-rabbit-hole\">)"
elif (( RH_COUNT > 1 )); then
  fail "multiple Enneagram Rabbit Hole blocks ($RH_COUNT) — must be exactly one"
else
  pass "Enneagram Rabbit Hole block present (exactly one)"
fi

# --- TL;DR accordion ---------------------------------------------------------
if grep -q 'summary class="accordion"' <<<"$BODY"; then
  pass "TL;DR accordion present"
else
  fail "missing TL;DR <details>/<summary class=\"accordion\"> block"
fi

# --- firstLetter intro -------------------------------------------------------
if grep -q 'class="firstLetter"' <<<"$BODY"; then
  pass "firstLetter intro paragraph present"
else
  fail "missing <p class=\"firstLetter\"> intro paragraph"
fi

# --- gate ledgers (creator v2 hard-gate artifacts) ---------------------------
for ledger in "TESTIMONY LEDGER" "HEADING MIX LEDGER" "DISTRIBUTION LEDGER" "FORMULA FINGERPRINT LEDGER"; do
  if grep -q "$ledger" "$FILE"; then
    pass "ledger present: $ledger"
  else
    fail "missing ledger comment: $ledger (creator v2 hard gates require it)"
  fi
done

# --- self-loop links ---------------------------------------------------------
BASE_LOWER="$(tr '[:upper:]' '[:lower:]' <<<"$BASE")"
if grep -qiE "/personality-analysis/${BASE}([)\"'/#]|$)" <<<"$BODY" || \
   grep -qiE "/personality-analysis/${BASE_LOWER}([)\"'/#]|$)" <<<"$BODY"; then
  fail "self-loop: body links to its own slug /personality-analysis/$BASE"
else
  pass "no self-loop links"
fi

# --- visible FAQ section (banned in body; FAQs live in frontmatter schema) ---
if grep -qiE "^##+ +FAQs?( |$)" <<<"$BODY"; then
  fail "visible FAQ section in body (FAQ content belongs in frontmatter faqs: only)"
else
  pass "no visible FAQ section in body"
fi

# --- templated FAQ filler (2026-06 backfill artifact) ------------------------
if grep -q "with supporting context from" <<<"$FM"; then
  fail "templated FAQ filler in frontmatter ('with supporting context from ...') — regenerate faqs with the enrich command"
else
  pass "no templated FAQ filler"
fi

# --- unfinished markers ------------------------------------------------------
if grep -qE "TODO|\[PLACEHOLDER|Lorem ipsum|\[TBD\]" <<<"$BODY"; then
  fail "unfinished marker in body (TODO / [PLACEHOLDER / Lorem ipsum / [TBD])"
else
  pass "no unfinished markers"
fi

# --- faqs presence (enrich stage output) -------------------------------------
if grep -qE "^faqs:" <<<"$FM"; then
  pass "faqs present in frontmatter"
else
  warn "no faqs in frontmatter — frontmatter enrich stage has not run (discoverability cost)"
fi

# --- internal link count (creator spec: 2-5) ---------------------------------
LINK_COUNT=$(grep -oE 'href="/(personality-analysis|enneagram-corner|community|how-to-guides|pop-culture)/[^"]+"|\]\(/(personality-analysis|enneagram-corner|community|how-to-guides|pop-culture)/[^)]+\)' <<<"$BODY" | wc -l | tr -d ' ')
if (( LINK_COUNT < 2 )); then
  warn "only $LINK_COUNT internal links (creator spec: 2-5)"
elif (( LINK_COUNT > 6 )); then
  warn "$LINK_COUNT internal links (creator spec: 2-5)"
else
  pass "internal link count: $LINK_COUNT"
fi

# --- published/pretext consistency -------------------------------------------
if grep -qE "^published: true" <<<"$FM" && grep -qE "^[[:space:]]+status: draft" <<<"$FM"; then
  warn "published: true while production_pretext.status: draft — states disagree"
fi

# --- em-dashes (policy resolved 2026-06-10: banned in prose) ------------------
# Exemptions: HTML comments (ledgers, review notes) and quote-attribution lines
# ("…" — Person, source, year  /  lines that begin with an em-dash attribution).
BODY_PROSE="$(awk 'BEGIN{inc=0} /<!--/{inc=1} inc{if (/-->/) inc=0; next} {print}' <<<"$BODY")"
PROSE_EMDASH_COUNT=$(awk '
  {
    line = $0
    # strip em-dashes immediately after a closing quote (attribution style)
    gsub(/["\xe2\x80\x9d'\''’][[:space:]]*—/, "", line)
    # strip a leading attribution em-dash (optionally inside blockquote/italics)
    sub(/^[>[:space:]]*[_*]*—/, "", line)
    n += gsub(/—/, "", line)
  }
  END { print n + 0 }
' <<<"$BODY_PROSE")
if (( PROSE_EMDASH_COUNT > 0 )); then
  fail "$PROSE_EMDASH_COUNT prose em-dashes in body (banned; quote attributions are exempt) — rewrite with periods, commas, or colons"
else
  pass "no prose em-dashes (quote attributions exempt)"
fi

# --- banned AI phrases (warn: may appear inside quotes) -----------------------
BANNED_PHRASES=(
  "delve" "tapestry of" "multifaceted" "myriad of" "It's worth noting"
  "serves as a testament" "A closer look reveals" "In essence," "Moreover,"
  "Furthermore," "This underscores" "rich tapestry"
)
HITS=""
for phrase in "${BANNED_PHRASES[@]}"; do
  N=$(grep -oiF "$phrase" <<<"$BODY_PROSE" | wc -l | tr -d ' ')
  if (( N > 0 )); then HITS+="'$phrase'×$N "; fi
done
if [[ -n "$HITS" ]]; then
  warn "banned AI phrases in body: $HITS(check whether inside direct quotes)"
else
  pass "no banned AI phrases"
fi

# --- summary ------------------------------------------------------------------
echo
echo "blog-lint: $BASE — $FAILS fail, $WARNS warn"
if (( FAILS > 0 )); then
  exit 1
fi
exit 0
