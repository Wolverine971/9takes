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
CONTRAST_TARGET="${BLOG_LINT_CONTRAST_TARGET:-0}"

fail() { echo "FAIL  $1"; FAILS=$((FAILS + 1)); }
warn() { echo "WARN  $1"; WARNS=$((WARNS + 1)); }
pass() { echo "ok    $1"; }

# --- split frontmatter / body ---------------------------------------------
FM="$(awk '/^---$/{c++; next} c==1' "$FILE")"
BODY="$(awk '/^---$/{c++; next} c>=2' "$FILE")"
# HTML-comment-stripped body, for STRUCTURAL checks only. Grade/review comments and
# the QUALITY GRADE block contain arbitrary prose (CSS class names, TODO/FAQ words,
# self-slugs) that must not fool presence/count checks. The gate-LEDGER checks below
# deliberately read raw $FILE because the ledgers ARE comments; the em-dash and
# banned-phrase checks already use their own stripped BODY_PROSE. Reuses the exact
# awk transform already proven in production for BODY_PROSE.
BODY_NOCOMMENT="$(awk 'BEGIN{inc=0} /<!--/{inc=1} inc{if (/-->/) inc=0; next} {print}' <<<"$BODY")"

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

# --- meta_title head-term + name check (AEO/discoverability) ----------------
# The people SERP target is explicit: [Name] + one query head term, unless a
# human writes a frontmatter exception. This prevents clever-but-unfindable
# titles from passing the nightly lint.
HEAD_TERM_EXCEPTION="$(grep -m1 -E "^head_term_exception:" <<<"$FM" | sed -E "s/^head_term_exception:[[:space:]]*//; s/^['\"]//; s/['\"]$//")"
PERSON_FIELD="$(grep -m1 -E "^person:" <<<"$FM" | sed -E "s/^person:[[:space:]]*//; s/^['\"]//; s/['\"]$//")"
PERSON_SLUG="${PERSON_FIELD:-$BASE}"
MTITLE_LOWER="$(tr '[:upper:]' '[:lower:]' <<<"$MTITLE")"
PERSON_LOWER="$(tr '[:upper:]' '[:lower:]' <<<"$PERSON_SLUG" | tr '_-' '  ')"
NAME_PRESENT=0
while IFS= read -r token; do
  [[ ${#token} -ge 3 ]] || continue
  if grep -qF "$token" <<<"$MTITLE_LOWER"; then
    NAME_PRESENT=1
    break
  fi
done < <(tr -cs '[:alnum:]' '\n' <<<"$PERSON_LOWER")

if [[ -n "$HEAD_TERM_EXCEPTION" && "$HEAD_TERM_EXCEPTION" != "false" && "$HEAD_TERM_EXCEPTION" != "null" ]]; then
  pass "head-term exception present"
else
  if grep -qiE "\benneagram\b|\btype[[:space:]]*[1-9]\b|\bpersonality type\b" <<<"$MTITLE"; then
    pass "meta_title contains a searchable head term"
  else
    fail "meta_title missing searchable head term (needs enneagram, type N, or personality type)"
  fi
fi
if (( NAME_PRESENT == 1 )); then
  pass "meta_title contains a person-name token"
else
  fail "meta_title missing person name token"
fi

# --- required type-section headings ----------------------------------------
if grep -qiE "^## What is .*personality type\?" <<<"$BODY_NOCOMMENT"; then
  pass "required H2 'What is [Person]'s personality type?' present"
else
  fail "missing required H2: 'What is [Person]'s personality type?'"
fi
if grep -qiE "^### .* is an Enneagram Type [1-9]" <<<"$BODY_NOCOMMENT"; then
  pass "required H3 '[Person] is an Enneagram Type X' present"
else
  fail "missing required H3: '[Person] is an Enneagram Type X'"
fi

# --- extractable type answer block -----------------------------------------
# The first prose paragraph after the required type-answer H2/H3 must be short
# enough for answer engines to lift. HTML wrappers are stripped for counting.
ANSWER_BLOCK="$(awk '
  BEGIN { seen = 0; collecting = 0; printed = 0; block = "" }
  /^##[[:space:]]+What[[:space:]]+is[[:space:]].*personality[[:space:]]+type\??[[:space:]]*$/ { seen = 1; next }
  seen && /^###[[:space:]].*is an Enneagram Type [1-9]/ { next }
  seen && /^[[:space:]]*$/ {
    if (collecting) { print block; printed = 1; exit }
    next
  }
  seen && /^#{1,6}[[:space:]]/ { if (collecting) { print block; printed = 1; exit } else { next } }
  seen && /^<details/ { if (collecting) { print block; printed = 1; exit } else { next } }
  seen {
    collecting = 1
    block = block (block == "" ? "" : " ") $0
  }
  END { if (collecting && !printed) print block }
' <<<"$BODY_NOCOMMENT" | sed -E 's/<[^>]+>/ /g; s/[[:space:]]+/ /g; s/^ //; s/ $//')"
if [[ -z "$ANSWER_BLOCK" ]]; then
  fail "missing extractable type-answer block after required personality-type heading"
else
  ANSWER_WORDS="$(wc -w <<<"$ANSWER_BLOCK" | tr -d ' ')"
  if (( ANSWER_WORDS > 60 )); then
    fail "type-answer opening block is $ANSWER_WORDS words (must be <=60)"
  else
    pass "type-answer opening block is extractable ($ANSWER_WORDS words)"
  fi
fi

# --- rabbit hole (required, exactly one) ------------------------------------
RH_COUNT=$(grep -c 'enneagram-rabbit-hole' <<<"$BODY_NOCOMMENT" || true)
if (( RH_COUNT == 0 )); then
  fail "missing Enneagram Rabbit Hole block (<details class=\"enneagram-rabbit-hole\">)"
elif (( RH_COUNT > 1 )); then
  fail "multiple Enneagram Rabbit Hole blocks ($RH_COUNT) — must be exactly one"
else
  pass "Enneagram Rabbit Hole block present (exactly one)"
fi

# --- TL;DR accordion ---------------------------------------------------------
if grep -q 'summary class="accordion"' <<<"$BODY_NOCOMMENT"; then
  pass "TL;DR accordion present"
else
  fail "missing TL;DR <details>/<summary class=\"accordion\"> block"
fi

# --- firstLetter intro -------------------------------------------------------
if grep -q 'class="firstLetter"' <<<"$BODY_NOCOMMENT"; then
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
if grep -qiE "/personality-analysis/${BASE}([)\"'/#]|$)" <<<"$BODY_NOCOMMENT" || \
   grep -qiE "/personality-analysis/${BASE_LOWER}([)\"'/#]|$)" <<<"$BODY_NOCOMMENT"; then
  fail "self-loop: body links to its own slug /personality-analysis/$BASE"
else
  pass "no self-loop links"
fi

# --- visible FAQ section (banned in body; FAQs live in frontmatter schema) ---
if grep -qiE "^##+ +FAQs?( |$)" <<<"$BODY_NOCOMMENT"; then
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
if grep -qE "TODO|\[PLACEHOLDER|Lorem ipsum|\[TBD\]" <<<"$BODY_NOCOMMENT"; then
  fail "unfinished marker in body (TODO / [PLACEHOLDER / Lorem ipsum / [TBD])"
else
  pass "no unfinished markers"
fi

# --- faqs presence (enrich stage output) -------------------------------------
if grep -qE "^faqs:" <<<"$FM"; then
  FAQ_BLOCK="$(awk '
    /^faqs:[[:space:]]*$/ { in_faq = 1; next }
    in_faq && /^[A-Za-z_][A-Za-z0-9_]*:/ { exit }
    in_faq { print }
  ' <<<"$FM")"
  FAQ_Q_COUNT="$(grep -cE "^[[:space:]]*-[[:space:]]*question:[[:space:]]*.+" <<<"$FAQ_BLOCK" || true)"
  FAQ_A_COUNT="$(grep -cE "^[[:space:]]*answer:[[:space:]]*.+" <<<"$FAQ_BLOCK" || true)"
  FAQ_REAL_COUNT=$(( FAQ_Q_COUNT < FAQ_A_COUNT ? FAQ_Q_COUNT : FAQ_A_COUNT ))
  if (( FAQ_REAL_COUNT >= 2 )); then
    pass "faqs present and FAQPage-eligible ($FAQ_REAL_COUNT real Q/A pairs)"
  else
    fail "faqs frontmatter has fewer than 2 real question/answer pairs"
  fi
else
  warn "no faqs in frontmatter — frontmatter enrich stage has not run (discoverability cost)"
fi

# --- contrast-pair / negative-parallelism counter ---------------------------
if [[ -f "$REPO_ROOT/scripts/blog-quality-report.mjs" ]]; then
  QUALITY_JSON="$(node "$REPO_ROOT/scripts/blog-quality-report.mjs" "$FILE" --json 2>/dev/null || true)"
  if [[ -n "$QUALITY_JSON" ]]; then
    CONTRAST_STRONG="$(node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const r=JSON.parse(s); console.log(r.contrast_pairs?.strong ?? 0);});' <<<"$QUALITY_JSON" 2>/dev/null || echo 0)"
    CONTRAST_COMPARATIVE="$(node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const r=JSON.parse(s); console.log(r.contrast_pairs?.comparative ?? 0);});' <<<"$QUALITY_JSON" 2>/dev/null || echo 0)"
    if (( CONTRAST_STRONG > CONTRAST_TARGET )); then
      fail "contrast-pair sentence engines: $CONTRAST_STRONG strong (target <= $CONTRAST_TARGET; run node scripts/blog-quality-report.mjs $BASE)"
    else
      pass "contrast-pair sentence engines: $CONTRAST_STRONG strong (target <= $CONTRAST_TARGET)"
    fi
    if (( CONTRAST_COMPARATIVE > 0 )); then
      warn "comparative contrast patterns detected: $CONTRAST_COMPARATIVE (review with blog-quality-report)"
    else
      pass "no comparative contrast patterns detected"
    fi
  else
    warn "blog-quality-report did not return JSON; contrast counter skipped"
  fi
else
  warn "blog-quality-report.mjs missing; contrast counter skipped"
fi

# --- internal link count (creator spec: 2-5) ---------------------------------
LINK_COUNT=$(grep -oE 'href="/(personality-analysis|enneagram-corner|community|how-to-guides|pop-culture)/[^"]+"|\]\(/(personality-analysis|enneagram-corner|community|how-to-guides|pop-culture)/[^)]+\)' <<<"$BODY_NOCOMMENT" | wc -l | tr -d ' ')
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
