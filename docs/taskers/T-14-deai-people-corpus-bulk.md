<!-- docs/taskers/T-14-deai-people-corpus-bulk.md -->

# Tasker: Triage and Holistically Refresh the Live People Corpus

**For:** the agent or agents assigned to diagnose and raise the quality of the live `blogs_famous_people` corpus without flattening good work or hiding weak work behind punctuation cleanup.
**Owner:** DJ
**Created:** 2026-07-18
**Revised:** 2026-07-18 after DJ rejected em-dash removal as a sufficient proxy for quality.
**Status:** **Tooling gate, then diagnostic pilot. No bulk writes.** Section 2 must be complete before a live row is changed.
**Related:** `.claude/skills/9takes-editorial-standards/SKILL.md`, `.claude/agents/editor.md`, `.claude/commands/grade_blog.md`, `.claude/commands/blog_content_creator_people_v2.md`, `scripts/blog-lint.sh`, `scripts/blog-quality-report.mjs`, `scripts/blog-source-audit.mjs`, `scripts/same-type-similarity.mjs`, `scripts/personBlogParser.js`, and `scripts/db-query.sh`. README hard rules apply.

---

## 0. What and why

`/personality-analysis` loads from `blogs_famous_people`, not directly from markdown. It is the largest surface of older people-profile content on the site.

Verified against the live DB and local drafts on 2026-07-18:

- **382 published** people blogs.
- **327 of 382** have `lastmod` before 2026-05-28. Vintage is context, not a quality verdict.
- **349 of 382** contain at least one em-dash in live `content`.
- The raw total is **9,923 em-dashes**. Using the current `blog-lint.sh` distinction, about **9,224 are prose uses** and **699 are quote-attribution punctuation**.
- **324 of 382** contain at least one prose em-dash under the lint rule.
- Grade coverage is not a trustworthy shortcut: **5 are ungraded, 329 have pre-v2 grades, and only 48 have v2 grades**. The old grades frequently call formulaic, poorly sourced pages 8.8 to 9.5.
- All **382 published rows currently have a processable local draft**. Parsed local content hashes, `lastmod`, and parser-managed metadata matched the live rows for all 382 at the verification point. The older claim that published rows were missing or stale on disk is not true in the current snapshot.

The em-dash count reveals a real older-writing cohort, but it does not tell us which edit a page needs. A weak article can have zero em-dashes. A strong article can use several in quote attributions. Recasting punctuation without fixing a generic thesis, repeated house template, unsupported quote, stale factual frame, or weak search answer would make the page look cleaner while leaving the actual problem in place.

**Program principle:** use em-dash burden to find candidates, then diagnose the whole article and apply the lightest edit depth that fixes the real problem. For the worst pages, that means a developmental edit or rebuild, not punctuation cleanup.

## 1. What a holistic refresh covers

A holistic refresh evaluates all of the following before deciding what to change:

1. **Search intent and payoff:** the title, description, opening, early type answer, headings, FAQs, and whether the page gives the visitor what the query promised.
2. **Thesis and through-line:** one person-specific argument that resolves a real contradiction and survives a name-swap test.
3. **Evidence and currentness:** traceable quotes, load-bearing factual claims, dates, recent developments, and clear separation between observed fact and Enneagram interpretation.
4. **Structure and usefulness:** section order, repetition, thin or padded sections, mobile scannability, and whether value arrives before halfway.
5. **Enneagram quality:** person-first analysis, a felt interior, an earned empathy turn, and no stock type description pasted onto a biography.
6. **Originality and house-formula risk:** same-type argument reuse, repeated contrast-pair engines, generic wound language, catalog endings, and template furniture showing through.
7. **Voice and prose:** AI tells, em-dashes, hedging, rhythm, vague abstractions, filler transitions, and 9takes voice.
8. **Frontmatter and structured data:** accurate entity metadata, source-backed citations, useful FAQs, valid anchors, and JSON-LD that agrees with the visible article.

Removing em-dashes is one exit check inside this work. It is not the work definition.

## 2. Tooling gate before any live write

Most editorial tools already exist. The corpus orchestration and live-write safeguards do not.

### 2.1 Fix the misleading lastmod assumption

The current non-`--publish` path in `scripts/personBlogParser.js` is single-person scoped, but it does **not** automatically preserve the live `lastmod`. It parses `lastmod` from the draft and includes it in the existing-row update. It preserves the DB `published` value, not the DB `lastmod`.

Before the pilot, make non-publish updates preserve the live `lastmod` by default. This must be enforced in code, not remembered by the operator. `--publish` must keep its distinct release behavior and must never be used by this tasker.

### 2.2 Add fail-closed preview and drift protection

Before the pilot, the write path must support all of these:

- **Existing-row only:** fail if the person does not already exist. A typo must never insert a new row.
- **Dry run:** print the target row and a field-by-field before/after diff without writing.
- **Stale-write guard:** capture the expected live content hash and fail if the live row changed before update. Prefer an atomic compare-and-update. A non-atomic read followed by a blind update is not enough for a parallel-work corpus program.
- **Lastmod preservation:** omit `lastmod` from non-publish updates and prove the before/after value is identical.
- **Approved-field review:** show every parser-managed field that will change. A prose edit must not silently null entity metadata, FAQs, citations, or JSON-LD.
- **Post-write verification:** confirm the live parsed-content hash matches the reviewed draft and that all non-approved fields are unchanged.

Do not represent these protections as existing until they are implemented and tested on a non-production fixture or a deliberately unchanged row.

### 2.3 Add a reproducible corpus inventory

Create a read-only `scripts/people-corpus-audit.mjs` or equivalent reproducible report. It must join the published DB rows, local drafts, and the current GSC page export and emit:

- person and canonical lowercase slug
- clicks and impressions, aggregated case-insensitively so `/Jordi-Hays` and `/jordi-hays` are one page
- live and local content hashes
- live and local `lastmod`
- raw em-dash count
- prose em-dash count using the same attribution exemption as `blog-lint.sh`
- word count and prose em-dashes per 1,000 words
- grade state: missing, pre-v2, or v2
- v2 dimension scores when present
- strong contrast-pair count
- searchable head-term result
- extractable answer-block result
- source-audit summary
- same-type similarity result

The report is a triage aid, not an auto-rewrite score. Keep the component readings visible. Do not collapse judgment into one unexplained number.

## 3. Non-negotiable mechanics

- The live DB row is the production source of truth. The local draft is the editable representation only after parity is proven.
- Re-run full parity immediately before editing each person. The 382-of-382 match recorded above is a dated snapshot, not a permanent guarantee.
- `scripts/db-query.sh` is read-only. Use it for inventory and verification.
- Push one reviewed person at a time through the hardened existing-row path.
- Never pass `--publish`.
- Never change `lastmod`.
- Never change `person`, `loc`, or Enneagram type without a separate DJ decision.
- Do not change the slug of an indexed page.
- Treat title and `meta_title` changes on traffic-bearing pages as explicit SEO changes. List them in the review diff rather than slipping them into a prose pass.
- If local and live content or metadata drift, stop. Do not pull only `content` and then full-sync the draft. The parser updates many fields, so reconciliation must preserve the full parser-managed row.

## 4. Triage model

Every pilot candidate starts at **diagnose** depth. Read the full article before assigning an edit lane.

### Lane A: no substantive edit

Use when the page is current, well sourced, person-specific, structurally sound, and already passes the quality bar. Remove remaining punctuation violations only after confirming they are truly the only issue. A recently rebuilt v2 page may land here.

### Lane B: line edit

Use when the thesis, evidence, and structure are sound. Fix AI tells, em-dashes, contrast scaffolding, repetition, rhythm, and word-level friction. Do not use this lane when source gaps or structural failures make polish cosmetic.

### Lane C: developmental edit

Use when the article has usable research and a salvageable angle but needs a stronger thesis, reordered or merged sections, deeper specifics, a current anchor, better source traceability, or a rebuilt ending. Re-run targeted research before adding claims.

### Lane D: rebuild

Use when the article fails the swap test, has no defensible thesis, leans on untraceable or inaccurate evidence, is materially stale, presents a contested typing as settled without support, or would require so many local fixes that preserving its structure adds no value. Build an evidence log first, then use the update-existing workflow in `blog_content_creator_people_v2`.

**Escalation rule:** an untagged load-bearing quote or factual claim blocks Lane A and Lane B. Source it, cut it, or move the article to Lane C or D.

## 5. Pilot cohort

Do not pilot only on the highest-traffic pages and do not pilot only on the highest em-dash counts. Use a stratified cohort so the test can detect both true positives and false negatives.

GSC clicks below are case-normalized totals from `docs/data/gsc/2026-07-06-pages.csv`.

### High traffic plus high prose em-dash burden

| Person              | Clicks | Prose em-dashes | Why included                                      |
| ------------------- | -----: | --------------: | ------------------------------------------------- |
| `jordi-hays`        |     52 |              62 | Highest people-page traffic and heavy prose debt  |
| `tina-fey`          |     20 |              52 | High density on a traffic-bearing page            |
| `sky-bri`           |     15 |              40 | High density, living-person evidence risk         |
| `sabrina-carpenter` |     11 |              75 | Highest prose count in the high-traffic cohort    |
| `marilyn-monroe`    |     12 |              50 | High density and a useful historical-profile test |
| `clavicular`        |     10 |              47 | High density and current-person test              |

### Moderate burden

| Person         | Clicks | Prose em-dashes | Why included                                        |
| -------------- | -----: | --------------: | --------------------------------------------------- |
| `jack-black`   |     17 |              36 | Strong traffic and moderate structural debt         |
| `hasan-piker`  |     13 |              30 | Current, contested public figure with sourcing risk |
| `blake-lively` |     18 |              21 | Traffic-bearing current-person profile              |
| `emma-watson`  |     10 |              34 | Moderate burden and mature indexed page             |

### Low-dash controls

| Person         | Clicks | Prose em-dashes | Why included                                                   |
| -------------- | -----: | --------------: | -------------------------------------------------------------- |
| `ryan-gosling` |     28 |               2 | Tests whether low punctuation debt hides deeper problems       |
| `kara-swisher` |     22 |               5 | Same false-negative control on a high-impression page          |
| `bob-dylan`    |     14 |               0 | Recently rebuilt v2 control that should need little or no work |
| `zendaya`      |     14 |               0 | Older zero-dash control that may still carry structural debt   |

The cohort is for diagnosis first. Do not pre-assign the six high-burden pages to rebuild solely from their counts.

## 6. Per-person diagnostic packet

Before editing, save a compact packet in the pilot findings doc:

1. Live row ID, `lastmod`, `published`, content hash, raw dash count, and parser-managed metadata hash.
2. Local draft path and parity result.
3. GSC clicks and impressions.
4. Grade state. Treat a pre-v2 grade as uncalibrated, not as evidence that the page is good.
5. Output from:

```bash
./scripts/blog-lint.sh "<Person>"
node scripts/blog-quality-report.mjs "<Person>"
node scripts/blog-source-audit.mjs "<Person>"
node scripts/same-type-similarity.mjs "<Person>" --n 8
```

6. Editor diagnosis against the three substance tests, the swap test, search payoff, thesis, evidence, structure, Enneagram depth, voice, and currentness.
7. Lane assignment with a short reason and a list of material worth preserving.

Record this in `docs/content-analysis/2026-07-18_people-corpus-pilot.md`. The diagnosis comes before a rewrite, so the original strengths and actual failure mode are not lost.

## 7. Edit protocol by lane

### Lane A or B

1. Fix any source-audit blocker first. If that requires research or structural change, escalate the lane.
2. Run the editor at the assigned depth against `9takes-editorial-standards`.
3. Remove prose em-dashes by recasting sentences, never by global punctuation substitution.
4. Remove quote-attribution em-dashes separately if the zero-per-article rule remains the policy. Convert the attribution layout without treating that punctuation as evidence of bad prose.
5. Preserve the title, slug, `loc`, type, and `lastmod` unless a separately reviewed change says otherwise.

### Lane C

1. Build or refresh the evidence log from primary interviews, first-party material, and reputable dated reporting.
2. Resolve every untagged load-bearing quote and factual claim.
3. Run the editor at developmental depth. Rework thesis, structure, weak sections, search payoff, emotional interior, and ending.
4. Run a fresh-eyes pass and targeted second pass.
5. Finish with a line edit against the editorial standards.

### Lane D

1. Write an evidence log before prose.
2. Decide what can be salvaged from the live article: verified quotes, original observations, useful links, and ranking-relevant search intent.
3. Use the update-existing workflow in `blog_content_creator_people_v2`.
4. Run fresh eyes, second pass, editor pass, frontmatter enrichment, v2 grading, and at most two targeted revision loops.
5. Compare the rebuild against the original and confirm it gained substance rather than just length.

## 8. Quality gates before live sync

Every edited page must pass all applicable gates:

- `blog-lint.sh` has zero failures.
- Raw em-dash count is zero if the README zero-per-article rule remains in force. The lint exemption for quote attributions is not sufficient for that stricter policy.
- Strong contrast-pair count is zero or an exact quoted sentence is documented as an intentional exception.
- No untagged load-bearing quote or factual claim remains. Document verified false positives from the source-audit script.
- Searchable head term and early extractable answer pass unless a deliberate, documented exception is approved.
- No stale hand-keyed corpus count remains.
- Same-type similarity has no substantive trip. Boilerplate false positives are documented, not blindly rewritten.
- The article passes the visualizable, falsifiable, and ownable tests.
- The thesis passes the name-swap test.
- Living-person claims are framed as sourced fact or clearly labeled interpretation. No diagnosis is asserted as fact.
- FAQs are supported by the visible article and their anchors exist.
- JSON-LD parses and agrees with the visible article.
- `lastmod`, slug, `person`, `loc`, and type are unchanged.
- A v2 grade is recorded after the final edit, using a real closest-anchor comparison. Overall must be at least 8.5 and discoverability at least 7, but the number does not overrule unresolved source or editorial failures.
- A second verify pass reads the article without relying on the first editor's notes or the old grade.

## 9. Live sync and verification

1. Re-run live/local parity and capture the expected live content hash.
2. Run the hardened dry-run path. Review every field in the proposed DB diff.
3. Sync one person.
4. Re-query the row and prove:
   - reviewed local parsed-content hash equals live content hash
   - `lastmod` is byte-for-byte unchanged
   - `published` is unchanged
   - only approved fields changed
   - the expected history snapshot exists
5. Render and inspect **every pilot page**, not a three-page sample. Check headings, accordions, links, FAQ output, JSON-LD, mobile rhythm, and the opening and ending in context.
6. If any check fails, stop the batch before touching the next person.

## 10. What the pilot measures

Record more than token cost:

- diagnosis and edit time per lane
- pre/post word count
- pre/post deterministic checks
- pre/post v2 rubric dimensions
- number of factual claims sourced, cut, or reframed
- sections preserved, merged, cut, or rebuilt
- whether the low-dash controls exposed false negatives
- reviewer verdict: clearly better, marginal, unchanged, or worse
- live verification result

The long-tail decision is based on quality lift and failure rate by lane, not only cost per page.

## Risks and gotchas

- **Cosmetic-success trap:** zero em-dashes can coexist with weak evidence, generic analysis, and a bad thesis.
- **Proxy false negatives:** zero-dash pages still require diagnosis in the pilot.
- **Grade inflation:** most live grades are pre-v2 and cannot be used to skip review.
- **Draft/DB drift:** parity is currently perfect but can change. Fail closed.
- **Full-row overwrite:** the parser updates many columns from the draft. Pulling only live `content` is not safe reconciliation.
- **Living-person liability:** a polished unsupported claim is worse than an awkward clearly framed interpretation.
- **Research fabrication:** never add a quote, source, date, or current event from memory.
- **SEO churn:** preserve indexed URLs. Review title and metadata changes explicitly.
- **Overwriting voice:** developmental edits should sharpen the person-specific argument, not make every profile sound like the current house template.
- **Parallel work:** one person at a time, no bulk sed, no stash, no reset, and no blind batch sync.

## Definition of done

### Pilot complete

- Tooling gate in section 2 is implemented and tested.
- The 14-page cohort has a saved pre-edit diagnosis and lane assignment.
- Every edited pilot page passes section 8 and section 9.
- Low-dash controls are included in the result, so the em-dash proxy is actually tested.
- The findings doc records quality lift, cost, failures, and the recommended lane mix for the remaining corpus.
- A DJ review gate decides whether to continue and at what depth.

### Program complete

- All 382 published rows are inventoried and assigned a lane.
- Every high-risk or weak page is holistically refreshed, rebuilt, explicitly deferred with a reason, or removed from scope by DJ. No page is silently counted as fixed because punctuation reached zero.
- The selected em-dash policy is met across the full published corpus.
- No live write changed `lastmod`, publication state, slug, `loc`, or type without explicit approval.
- Before/after manifests and live verification results exist for every changed row.
- A `## What was actually done` section is appended here with persons touched, lane used, evidence changes, quality delta, cost, and deliberate deferrals.

## What was actually done

### 2026-07-18: tooling gate implementation and first developmental pilot

- Hardened the non-publish path in `scripts/personBlogParser.js`.
  - Dry run is now the default.
  - Non-publish updates are existing-row only.
  - `date`, `loc`, `lastmod`, `published`, `enneagram`, `type`, and `person` are protected in both JavaScript and SQL.
  - A write requires the exact reviewed live content hash and an exact `--approve-fields` set matching the printed diff.
  - Optional metadata is only managed when explicitly represented by the draft, preventing absent `content_quality`, entity fields, FAQs, citations, or JSON-LD from being silently nulled.
  - Post-write verification checks every approved value, every non-approved non-derived field, the final content hash, and the latest content-history snapshot.
- Added `supabase/migrations/20260718_harden_people_content_update.sql`.
  - The RPC locks the existing row before comparing the content hash and full parser-managed snapshot.
  - Unknown and protected patch keys fail closed.
  - The migration was exercised against a disposable local PostgreSQL fixture: an approved content/title update succeeded while preserving `lastmod`, `published`, and `person`; a stale hash and a `lastmod` patch were both rejected.
  - The migration has **not** been applied to production in this task, so no live content write has been attempted.
- Added `scripts/people-corpus-audit.mjs` and the `audit:people-corpus` package script.
  - The read-only full report is saved at `docs/content-analysis/2026-07-18_people-corpus-audit.json`.
  - It reproduced 382 published rows, 9,923 raw em dashes, 9,224 prose em dashes, and the 5 missing / 329 pre-v2 / 48 v2 grade split.
  - Current parity is 380/382 for parsed content and explicitly managed metadata because Dua Lipa and Jordi Hays are the two intentional local edits. All 382 `lastmod` values match.
- Refreshed `dua-lipa` at Lane C, developmental edit.
  - Replaced an untraceable childhood-choir spine and unsupported superlatives with a dated evidence chain.
  - Rebuilt the thesis around the difference between a performance problem optimization could solve and an artistic problem it could not guarantee.
  - Added current 2025–2026 citizenship, literary-project, and marriage context.
  - Reduced raw and prose em dashes from 62/57 live to 0/0 locally.
  - Replaced the pre-v2 8.7 grade with a calibrated rubric-v2 B+ at 8.6, including discoverability 9.
  - Saved the evidence log, grade review, and diagnostic packet. Live sync remains deliberately deferred.
- Rebuilt `jordi-hays` at Lane D after saving an exact live/local parity packet.
  - Replaced unsupported childhood, household, marriage, acquisition-price, subtype, and interior claims with a dated evidence chain from direct interviews, reported profiles, official announcements, and clearly disclosed conflicted material.
  - Cut the visible article from 5,084 to 2,775 words while preserving the newspaper, J Man, Capital, daily-preparation, taste, focus, and TBPN material that could be verified.
  - Reframed the Type 3 case around observable scoreboards and daily iteration. OpenAI ownership now supplies the article's critic-pressure test rather than another victory lap.
  - Added real search answers for age, wife, and the OpenAI acquisition without inventing an exact birth date or private relationship psychology.
  - Reduced raw/prose em dashes from 69/62 live to 0/0 locally and strong/comparative contrast engines from 10/4 to 0/0.
  - Cleared the source-audit blocker at 2 inline, 0 vague, and 0 untagged load-bearing quotes; cleared same-type similarity at 0.038 against a 0.04 threshold.
  - Replaced the pre-v2 9.0 grade with a calibrated rubric-v2 B+ at 8.5, including discoverability 9 and an explicit behavioral-interior ceiling on Enneagram integration.
  - Saved the evidence log, grade review, diagnostic packet, and exact proposed live diff. Live sync remains deliberately deferred.
- Recorded a deliberate adjacent deferral: `Callum-Turner.md` still describes the couple as engaged. It needs its own parity check and diagnostic pass before correction.
