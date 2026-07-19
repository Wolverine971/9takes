<!-- docs/taskers/T-15-pop-culture-section-audit.md -->

# Tasker: Pop-Culture Section First Audit

**For:** the agent assigned to run the first quality-and-liability audit of the `/pop-culture` section.
**Owner:** DJ
**Created:** 2026-07-18
**Status:** Diagnosis complete 2026-07-18. Findings are ready for DJ review. Tier A remediation remains review-gated; no published page was edited or unpublished.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` (the method to copy), `T-01` (the fabricated-DOI pattern this must screen for), `T-14` (the de-AI pass that inherits the non-legal fixes), skill `9takes-editorial-standards`. README hard rules apply.

---

## 0. What and why

The 2026-07-15 full-corpus audit was **enneagram-only**. Pop-culture has **never been audited**, and it is the section with the highest liability profile on the site because it profiles living, named people. Verified 2026-07-18:

- **32 published** pop-culture pages, most dated March to May 2026, i.e. pre-Opus-4.8 vintage.
- **1,263 em-dashes** across the section, with the single worst offenders on the whole site: `podcaster-personality-map` (135), `hollywood-heartthrobs-enneagram-analysis` (117), `us-presidents-enneagram-analysis` (95).
- The section carries no `QUALITY_FEEDBACK` marker (that class is enneagram-only, confirmed). The audit did find internal review-note comments in two Tier A source files. They are not visible in the live article text, but they remain in the server build artifact and should be removed during the approved page edits.

Two distinct risks, and they do not get the same treatment:

1. **Liability.** Pages that make psychological or factual claims about living, named individuals (defamation surface). 9takes has shipped a legal-risk claim before (the Tobey Maguire incident), so this is a known failure mode, not a hypothetical.
2. **Quality.** Em-dashes, generic phrasing, and the template sameness the enneagram audit found everywhere.

You cannot blindly de-AI a page that might contain a defamatory or fabricated claim about a real person. So this is **diagnosis first**.

## 1. Required reading

1. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md`, especially the method and the §9 post-audit corrections (six findings were retracted on verification, so single-pass grading is unreliable; use an adversarial verify pass).
2. `skill 9takes-editorial-standards`.
3. `T-01` for the exact shape of the fabricated-DOI pattern (a real DOI resolving to an unrelated paper, attached to a fabricated author and finding).
4. README hard rules.

## 2. Scope and triage

Build the live list first, do not trust this snapshot blindly:

```bash
find src/blog/pop-culture -name '*.md' -not -path '*/drafts/*' \
  ! -name '*.instagram.md' ! -name '*.reddit.md' ! -name '*.twitter.md' \
  ! -name '*.review.md' -print0 | while IFS= read -r -d '' f; do
  awk '/^---/{c++; next} c==1{print} c==2{exit}' "$f" | grep -iq '^published:[[:space:]]*true' && echo "$f"
done
```

**Tier A, liability, audit these first.** Pages centered on living or recently-living named people and sensitive topics:

- `epstein-psychology-part-1`, `epstein-psychology-part-2`
- `ghislaine-maxwell-psychology`
- `musk-vs-altman-trial-personality-dynamics` (the word "trial" plus named living principals)
- `kardashian-family-enneagram-analysis`
- `alex-cooper-alix-earle-beef-enneagram-analysis`
- `hollywood-heartthrobs-enneagram-analysis`
- `trump-type-8-vs-biden-type-2`
- `us-presidents-enneagram-analysis`

For each Tier A page: resolve every citation by hand (the T-01 pattern), and flag any sentence that states as fact a claim about a real person's psychology, diagnosis, motive, or conduct that is not sourced or clearly framed as interpretation. Diagnosis-language about real people ("X is a narcissist") is the specific trap.

**Tier B, quality.** The remaining ~24 pages: em-dashes, AI tells, template sameness. These inherit into `T-14`'s method once triaged clean of liability.

## 3. Deliverable (the diagnosis)

Write `docs/content-analysis/2026-07-18_pop-culture-section-audit.md` with:

- Per Tier A page: citation resolution table (claim, DOI or source, what it actually resolves to, verdict), and a list of unsourced factual claims about named people with a recommended action (source it, reframe as interpretation, or cut).
- A liability verdict per Tier A page: safe as-is, fixable, or unpublish-until-fixed.
- Section-wide quality numbers: em-dash count per page, template-sameness notes, worst offenders.
- A prioritized fix queue that hands Tier B to the de-AI pass and keeps Tier A fixes explicitly gated on DJ review.

## 4. Fixes (only after the diagnosis is reviewed)

- **Liability fixes** are DJ-gated. Do not silently rewrite a claim about a real person; propose the change in the findings doc and let DJ approve. Unpublishing a Tier A page pending fix is cheap and is the safe default if a claim cannot be sourced.
- **Quality fixes** (em-dashes, tells) follow `T-14`'s protocol and `9takes-editorial-standards`. Zero em-dashes per page. Never change `lastmod`.

## Verification checklist

```bash
# em-dash count per published pop-culture page (target 0 after quality fixes)
find src/blog/pop-culture -name '*.md' -not -path '*/drafts/*' ! -name '*.review.md' -print0 \
 | while IFS= read -r -d '' f; do awk '/^---/{c++;next} c==1{print} c==2{exit}' "$f" | grep -iq '^published:[[:space:]]*true' \
   && printf '%s  %s\n' "$(awk '/^---/{c++;next} c>=2' "$f" | grep -o "$(printf '\342\200\224')" | wc -l | tr -d ' ')" "$f"; done | sort -rn
# every DOI in the section, to resolve by hand
grep -rEno '10\.[0-9]{4,}/[^ )"]+' src/blog/pop-culture --include='*.md' | grep -v '/drafts/'
pnpm check && pnpm build
```

## Risks and gotchas

- **Defamation is the real risk here, not em-dashes.** Treat Tier A as the point of the tasker. A missed fabricated citation about a living person is the worst outcome on the site.
- **Single-pass grading is unreliable** (the enneagram audit proved it; 68 of 99 first-pass grades were corrected on verify). Use an adversarial verify pass on Tier A claims.
- **Never modify `lastmod`.** Even on a liability fix.
- **Parallel work.** One file at a time, no bulk operations.
- **Do not scope-creep into a rewrite.** Audit, then propose. The rebuild of any single weak page is its own follow-on, not this tasker.

## Definition of done

- `docs/content-analysis/2026-07-18_pop-culture-section-audit.md` exists with per-Tier-A citation tables and liability verdicts, plus section-wide quality numbers.
- Every DOI in the section has been hand-resolved and recorded.
- A prioritized fix queue exists, with Tier A fixes DJ-gated and Tier B handed to the de-AI method.
- No content edited before the diagnosis is written and reviewed.
- A `## What was actually done` section appended here on completion.

## What was actually done

Completed 2026-07-18.

- Rebuilt the live inventory from frontmatter: 32 published pages, nine Tier A and 23 Tier B.
- Wrote `docs/content-analysis/2026-07-18_pop-culture-section-audit.md`.
- Audited all nine Tier A pages for sourced facts, allegations, diagnosis language, motive claims, conduct claims, and current-event drift.
- Extracted 126 citation occurrences representing 107 unique external URLs. Ninety-four returned a normal 2xx or 3xx response. Thirteen returned an anti-bot response rather than a 404; browser and search checks corroborated their destinations.
- Searched the published section for DOI strings. Result: zero.
- Recorded a liability verdict for each Tier A page. Five are recommended for temporary unpublishing until fixed; four are fixable in place after DJ review. No Tier A page was judged safe as-is.
- Verified that the Musk and Altman trial page is obsolete: it remains written as a prediction after the jury ruled for OpenAI on 2026-05-18.
- Verified the section-wide visible-body quality count: 1,263 U+2014 characters across 19 pages; 13 pages are already at zero.
- Identified two source hygiene findings outside the `QUALITY_FEEDBACK` pattern: internal review-note comments in `epstein-psychology-part-2.md` and `ghislaine-maxwell-psychology.md`. They do not appear in the live visible article text, but are present in the server build artifact.
- Preserved all article content and protected metadata. No `lastmod`, `published`, link, widget, JSON-LD, or body text was changed.

The next action is a DJ decision on the five P0 pages listed in the findings doc. Liability edits and any temporary unpublishing remain explicitly unapproved.
