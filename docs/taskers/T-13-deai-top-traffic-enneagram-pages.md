<!-- docs/taskers/T-13-deai-top-traffic-enneagram-pages.md -->

# Tasker: De-AI and Em-dash Pass, Top-Traffic Enneagram Pages

**For:** the agent assigned to run a voice-preserving de-AI editorial pass on the highest-traffic enneagram-corner blogs.
**Owner:** DJ
**Created:** 2026-07-18
**Status:** Done 2026-07-18, with an unrelated repository budget exception. The editorial and integrity checks are complete across all 15 pages. `pnpm check` passes, and the Vite/MDsvex production build completes. The `pnpm build` wrapper exits only at the protected-portrait budget gate: 78.53 KiB and 2 files over budget. See `## What was actually done`.
**Related:** skill `9takes-editorial-standards` (the rule source), `.claude/commands/deai.md`, the `editor` agent (line-edit depth), `T-10` (owns the leaked `QUALITY_FEEDBACK` comment, do not touch it here), `T-04` and `T-05` (own the CTR and structural work on astrology and compatibility-matrix, do not overlap), `T-06` (the promise rule), `T-12` (owns the StrategicQuestion widget on the ADHD and depression pages). README hard rules apply.

---

## 0. What and why

DJ's read on 2026-07-18: content not refreshed since Opus 4.8 shipped (2026-05-28) reads like older, weaker-model output. Verified against the live corpus, not asserted from memory:

- Em-dashes, banned to zero per article by `9takes-editorial-standards`, appear on **71 of 99 published enneagram pages, 1,263 total**.
- The bulk of that debt sits on pages that also carry the most traffic, so a pass here returns the most per edit.
- The tell is not only em-dashes. It is generic phrasing, hedge stacking, and template scaffolding that the editorial standards skill catalogs as AI writing tells.

This tasker is the **surgical top-of-funnel pass**: the ~15 pages that earn real clicks, edited by hand-grade agent. The corpus-wide sweep is `T-14` (people) and `T-15` (pop-culture). Do not let this one grow into a corpus sweep. Fifteen pages, done well, then stop.

## 1. Required reading

1. `skill 9takes-editorial-standards` in full. It is the single source of truth for banned words, AI tells, and voice attributes. Load it before editing a single line.
2. `docs/taskers/README.md`, the four hard rules at the top.
3. This file, top to bottom.

## 2. Scope: the 15 pages, traffic-ranked

Clicks are GSC 2026-04-05 to 2026-07-04 (`docs/data/gsc/2026-07-06-pages.csv`). `lastmod` is the manually managed content-vintage stamp. Do not change it.

| #   | Slug                                              | Clicks | lastmod    | Notes / boundaries                                                                                            |
| --- | ------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | `enneagram-and-mental-illness`                    | 287    | 2025-12-20 | **FROZEN**: prose de-AI only. Never retitle, reslug, or let it be absorbed.                                   |
| 2   | `enneagram-and-adhd-which-types-struggle-most`    | 252    | 2026-04-01 | Carries the T-12 StrategicQuestion widget. Do not touch widget markup.                                        |
| 3   | `mental-health/enneagram-neurodivergence-guide`   | 141    | 2026-03-10 | Mental-health page. Its `description` frontmatter also required cleanup. The QFB comment remains T-10's lane. |
| 4   | `astrology-and-the-enneagram`                     | 86     | 2026-03-20 | Voice only. CTR and chart-surfacing belong to **T-04**, do not overlap.                                       |
| 5   | `depression-patterns-by-enneagram-type`           | 85     | 2026-04-01 | Carries the T-12 widget. Do not touch widget markup.                                                          |
| 6   | `enneagram-compatibility-matrix`                  | 81     | 2026-01-16 | Voice only. Merge and CTR belong to **T-05**, do not overlap.                                                 |
| 7   | `toxic-traits-of-each-enneagram-type`             | 54     | 2026-01-18 |                                                                                                               |
| 8   | `toxic-traits-relationships-warning-signs`        | 44     | 2025-12-03 |                                                                                                               |
| 9   | `attachment-styles-and-enneagram-types`           | 42     | 2026-01-18 | Etiology already fixed 2026-07-15. Do not reintroduce a WHAT-vs-WHY claim.                                    |
| 10  | `enneagram-instinctual-subtypes`                  | 35     | 2025-12-03 |                                                                                                               |
| 11  | `how-each-enneagram-type-manipulates`             | 34     | 2025-12-31 |                                                                                                               |
| 12  | `enneagram-wings-complete-guide`                  | 33     | 2026-04-02 |                                                                                                               |
| 13  | `biggest-compliments-to-give-each-enneagram-type` | 31     | 2025-12-03 |                                                                                                               |
| 14  | `enneagram-types-and-career-choices`              | 23     | 2026-04-08 |                                                                                                               |
| 15  | `enneagram-strengths-and-weaknesses`              | 22     | 2025-12-20 |                                                                                                               |

All paths are `src/blog/enneagram/<slug>.md` except #3, which is `src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md`.

## 3. Per-file baseline (run before editing each file)

```bash
f=src/blog/enneagram/<slug>.md
# Count U+2014 and U+2013 outside the T-10-owned QFB comment.
node - "$f" <<'NODE'
const fs = require('node:fs');
const text = fs.readFileSync(process.argv[2], 'utf8');
const visible = text.replace(
  /<!-- QUALITY_FEEDBACK_START[\s\S]*?QUALITY_FEEDBACK_END -->/g,
  ''
);
console.log({
  'U+2014': (visible.match(/\u2014/g) || []).length,
  'U+2013': (visible.match(/\u2013/g) || []).length
});
NODE
# leaked comment present? if yes, T-10 owns it. Leave it byte-for-byte.
grep -c 'QUALITY_FEEDBACK_START' "$f"
# T-12 widget present? if yes, do not touch its markup.
grep -c 'StrategicQuestion\|strategic-question' "$f"
```

## 4. Edit protocol

1. Run the pass at **line-edit depth** (voice-preserving cleanup), one file at a time. The skill `9takes-editorial-standards` is the rubric.
2. **Remove every em-dash.** Recast the sentence. Do not swap in an en-dash or a spaced hyphen as a disguise. A comma, a colon, a period, or a rewrite is the fix.
3. Strip the AI tells the skill names (hedge stacking, "it's not just X, it's Y" scaffolding, empty intensifiers, listicle sameness). Preserve DJ's voice attributes: tactically direct, pattern-recognition focused, results-driven.
4. **Do not touch** the `QUALITY_FEEDBACK` comment block. `T-10` owns it and has a review-gated patch pending. If you strip prose around it, leave the comment intact so T-10's patch still applies.
5. **Do not touch** the T-12 widget markup on the ADHD and depression pages.
6. **Do not** retitle, reslug, or restructure. This is voice cleanup, not a rebuild. Structural and CTR work on astrology (T-04) and compatibility-matrix (T-05) is out of scope.
7. **Never edit `lastmod`.** DJ sets it by hand.

## Verification checklist

Run per file after editing:

```bash
f=src/blog/enneagram/<slug>.md
node - "$f" <<'NODE'
const fs = require('node:fs');
const text = fs.readFileSync(process.argv[2], 'utf8');
const visible = text.replace(
  /<!-- QUALITY_FEEDBACK_START[\s\S]*?QUALITY_FEEDBACK_END -->/g,
  ''
);
console.log({
  'U+2014': (visible.match(/\u2014/g) || []).length,
  'U+2013': (visible.match(/\u2013/g) || []).length
}); // both MUST be 0
NODE
grep -c 'QUALITY_FEEDBACK_START' "$f"              # MUST equal the pre-edit count
git diff -U0 "$f" | grep -i 'lastmod'              # MUST be empty
git diff -U0 "$f" | grep -iE 'title:|slug:|loc:'   # MUST be empty on #1
```

Then once for the batch:

```bash
pnpm check      # types clean
pnpm build      # build green; MDsvex compiles the edited files
```

## Risks and gotchas

- **Parallel work.** DJ and other agents edit this repo live. Edit one file, verify, move on. Never `git stash`, never a bulk sed across the 15. Hand or editor-agent edits only.
- **The freeze.** `enneagram-and-mental-illness` is the #1 page. Prose de-AI is welcome; a retitle, reslug, or merge is forbidden.
- **The widget.** ADHD and depression pages route give-first answers into question 567. Breaking that markup breaks a live experiment (T-12).
- **The leak lane.** If you strip the `QUALITY_FEEDBACK` comment yourself you collide with T-10's pending patch. Leave it.
- **CTR lanes.** Astrology and compatibility-matrix have dedicated CTR taskers. Voice only here.

## Definition of done

- All 15 files have zero U+2014 and U+2013 characters outside T-10-owned QFB comments.
- The one raw U+2014 character on the neurodivergence page remains only inside its byte-identical QFB comment until T-10 removes the block.
- No `lastmod`, `title`, `slug`, or `loc` changed on any file; nothing changed on the frozen page beyond body prose.
- Each `QUALITY_FEEDBACK` block still present and byte-identical (T-10 will remove them).
- T-12 widget markup intact on the two pages that carry it.
- `pnpm check` green, and the application build compiles. Any unrelated repository budget failure is recorded explicitly rather than attributed to this content pass.
- A `## What was actually done` section appended here per the house habit, recording final dash counts, verification results, and any file left unchanged.

---

## What was actually done (2026-07-18)

**Result.** All 15 pages received a line-edit-depth audit. Fourteen were edited; `biggest-compliments-to-give-each-enneagram-type` was already clean enough to remain unchanged. The pass removed U+2014 and U+2013 characters from visible content, cut banned vocabulary and repetitive negative-parallel constructions, replaced generic journey and deep-dive scaffolding, tightened conclusions, and reviewed FAQ wording. The attachment-style FAQ now distinguishes the frameworks by level instead of using the banned WHAT-vs-WHY etiology claim.

**Files edited.** `enneagram-and-mental-illness`, `enneagram-and-adhd-which-types-struggle-most`, `mental-health/enneagram-neurodivergence-guide`, `astrology-and-the-enneagram`, `depression-patterns-by-enneagram-type`, `enneagram-compatibility-matrix`, `toxic-traits-of-each-enneagram-type`, `toxic-traits-relationships-warning-signs`, `attachment-styles-and-enneagram-types`, `enneagram-instinctual-subtypes`, `how-each-enneagram-type-manipulates`, `enneagram-wings-complete-guide`, `enneagram-types-and-career-choices`, and `enneagram-strengths-and-weaknesses`.

**SEO and integrity checks.** The protected `title`, `slug`, `loc`, `lastmod`, `published`, and `date` values match HEAD. Link destinations match HEAD. Every QFB block is byte-identical to HEAD, and both T-12 StrategicQuestion widgets are byte-identical to HEAD. All 14 matching JSON-LD script blocks parse successfully. Renamed headings were checked for legacy fragment traffic and repository references; compatibility spans preserve `#the-18-wing-combinations-deep-dive-analysis` and `#the-integration-journey`.

**Verification.** All 15 pages contain zero U+2014 and U+2013 characters outside comments. The neurodivergence file has one raw U+2014 character only inside its T-10-owned QFB comment. `pnpm check` passes with 0 errors and 140 pre-existing warnings. The Vite/MDsvex production build completes successfully. The final `pnpm build` budget step exits because the protected portrait library is 40.66 MiB against a 40.58 MiB limit and contains 834 files against a limit of 832, an overage of 78.53 KiB and 2 files unrelated to these content edits.

**Remaining boundaries.** T-10 still owns QFB removal. The repeated compatibility-matrix structure remains in T-05's lane, and broader developmental rewrites identified by QFB notes remain outside this line-edit task. No further T-13 copy work is identified.
