<!-- docs/taskers/T-11-grade-blog-still-instructs-the-leak.md -->

# Tasker: grade_blog Still Instructs the Leak

**For:** the agent assigned to stop the blog pipeline from writing reviewer feedback into public page source.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Implemented and locally verified 2026-07-15. Fresh target chunks are clean. A real slash-command smoke test remains; the overall build command is red only on an unrelated asset-budget overage.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §9.5. Siblings: `T-10` (the historical half, 88 files), `T-02` (owns the lint guard and the `.review.md` convention), `T-03` (the frontmatter half).

---

## 0. What and why

T-10 strips 88 published files carrying `<!-- QUALITY_FEEDBACK_START` from a one-off 2026-02-22 batch run. No generator for that marker exists in the repo, so stripping it is final. **T-10 closes a historical leak. It does not close the mechanism.**

**The behavior was renamed, not fixed, and the successor is live.** `.claude/commands/grade_blog.md` line 5 reads, verbatim:

> "You are a strict, calibrated blog quality grader for 9takes celebrity personality analysis blogs. Your job is to read a blog, score it against the rubric, add grades to the file's frontmatter, and leave actionable reviewer feedback as an HTML comment."

**"leave actionable reviewer feedback as an HTML comment" is the instruction that causes the leak.** MDsvex passes HTML comments straight through to rendered HTML. The command is doing exactly what it was told. The instruction is the bug.

Verified spread of the successor marker `<!-- QUALITY GRADE:` as of 2026-07-15:

| Location                                               | Count |
| ------------------------------------------------------ | ----- |
| `src/blog/**/drafts/`                                  | 234   |
| Non-draft files                                        | **4** |
| Non-draft **and** `published: true`                    | **2** |
| Compiled chunks in `.svelte-kit/output/server/chunks/` | 237   |
| Overlap with T-10's 88 files                           | **0** |

The 2 live files are `src/blog/pop-culture/hollywood-heartthrobs-enneagram-analysis.md` and `src/blog/community/consensus-on-human-nature.md`. Both have chunks in the build (`hollywood-heartthrobs-enneagram-analysis2.js`, `consensus-on-human-nature2.js`). Different marker, different run, different blast radius from T-10. Zero overlap.

**CORRECTION 1: a naive sweep returns 4, not 2.** `grep -rl '<!-- QUALITY GRADE:' src/blog/ --include='*.md' | grep -v drafts` returns four files. Two are `published: false`: `src/blog/guides/how-to-stand-up-for-yourself.md` (which **does** have build chunks) and `src/blog/pop-culture/epstien-research/Jeffrey-Epstein.md` (no chunk; it sits in a subdirectory the route globs do not reach). Do not panic when you see 4. Do not stop at 2 either: the checklist gate is written against all 4, which is the stricter and correct bar.

**Servability: verify, do not assert.** Most of the 237 chunks are people-drafts (`Steve-Martin.js`, `Nancy-Reagan.js`, `Olivia-Wilde.js`, `Brendan-Fraser.js` all confirmed present). Drafts are bundled because `src/routes/admin/drafts/+page.ts:6` globs `/src/blog/people/drafts/*.{md,svx,svelte.md}` with no exclusions. That route is admin-gated, and `/personality-analysis/*` is DB-driven, so those draft chunks are very likely not served to the public. **Confirm that rather than taking it on faith.** The draft count is a latent risk, not a current one: any draft that gets published carries its leak with it.

**Why this ranks above its own cleanup.** T-10 clears 88 files once. T-11 stops the mechanism. Without T-11, every future `/grade_blog` run re-adds the leak under the current marker, and the 234 drafts each become a live leak the moment they publish. **T-11's instruction fix must land BEFORE or WITH T-10, or the cleanup is a treadmill.** T-10 §2 Step 5 says stripping is "final, not a treadmill". That is true **only** of T-10's specific marker and is **not** true of the leak class. Do not let any reader conclude the class is closed.

---

## 1. Required reading

1. `.claude/commands/grade_blog.md` lines 5, 18, 124 to 138, and 259 to 279. Line 5 is the instruction. 259 to 279 is the template. 124 to 138 tells you how big the class really is.
2. `.claude/commands/blog_content_revision_pass_people.md` lines 46 to 53 and 145. **This is the hard consumer. Read it before you touch anything.** See Step 1.
3. `scripts/run-blog-pipeline.sh` lines 146 to 160, the existing pre-grade strip.
4. `docs/taskers/T-02-internal-notes-leaking-to-page-source.md` §2 Step 4, the guard spec and the `$BODY_NOCOMMENT` trap.
5. `docs/taskers/T-10-quality-feedback-comment-leak-88-files.md` §2 Step 5, which raised this and scoped it out.
6. `scripts/blog-lint.sh` lines 49 to 58 (the `FM` / `BODY` / `BODY_NOCOMMENT` split), line 202 (`grep -q "$ledger" "$FILE"`, the raw-`$FILE` pattern to copy), and lines 200 to 206 (the ledger gate that constrains Step 4).
7. `src/lib/slugFromPath.ts` and `scripts/personBlogParser.js` lines 752 to 753.

---

## 2. The fix (in order)

### Step 1: Fix the instruction, but know it is a contract, not a line

Rewrite `grade_blog.md` line 5 so reviewer feedback goes somewhere that is never served. Also fix line 18 (`Pre-Approved Operations`), which independently authorizes "reviewer comments to draft files", and the template at 259 to 279.

**CORRECTION 2, and it reshapes this whole tasker: the comment is a live inter-stage handoff, not dead output.** `blog_content_revision_pass_people.md` line 49 says:

> "Extract the **QUALITY GRADE** HTML comment (immediately after the frontmatter). This contains the per-dimension scores and the grader's feedback. **If there is no QUALITY GRADE comment, stop and report** because this command needs grader feedback to act on."

So the pipeline is: `run-blog-pipeline.sh` strips prior comments (lines 149 to 159, anti-anchoring), grade_blog writes one, the revision pass reads it and hard-stops without it. **Deleting or relocating the comment without updating the reader breaks the revision pass on every draft.** This is a three-file contract change:

1. `.claude/commands/grade_blog.md` (writer)
2. `.claude/commands/blog_content_revision_pass_people.md` step 3 (reader)
3. `scripts/run-blog-pipeline.sh` pre-grade strip (must keep working, or become a no-op cleanly)

**Recommended destination, and the reasoning.** The scores are already carried losslessly in the `content_quality` frontmatter block (442 files, non-leaky, machine-read by `personBlogParser.js`, `seed-quality-grades.js`, `generate-famous-types.js`, `audit-people-seo.js`). The comment's only unique payload is the prose feedback the revision pass consumes. That prose needs a home that is **never served and never bundled**.

Two candidate destinations, and they are not equivalent:

- **`.review.md` sidecar (T-02's convention).** Verified 2026-07-15: `ls .svelte-kit/output/server/chunks/ | grep -ic review` returns **0**, so the 10 existing `src/blog/enneagram/mental-health/*.review.md` files are excluded from routes **and** kept out of the bundle. For enneagram paths this convention is genuinely safe on all three legs T-02 checked plus the bundle leg. **But see CORRECTION 3 in Step 3 before writing one anywhere else.**
- **Outside `src/` entirely**, matching the existing `docs/content-analysis/pipeline-logs/` convention the pipeline already writes to. Nothing under `docs/` is globbed, bundled, or served.

**Recommendation: write grade feedback to `docs/content-analysis/grades/<Person>.review.md`, outside `src/`.** Justification: a `.review.md` sidecar under `src/blog/people/drafts/` would be picked up by the unexcluded `admin/drafts` glob and bundled, which is the same failure in a new costume. A path outside `src/` is unbundlable by construction, needs no glob edits, and needs no future agent to remember a convention. Keep the `.review.md` extension for continuity with T-02.

**Make the grader self-healing.** grade_blog line 261 already says "Replace, don't stack: if the file already contains one or more `<!-- QUALITY GRADE ... -->` comments, delete ALL of them before writing yours." Keep that delete behavior and drop the write. Then every one of the 234 drafts cleans itself the next time it is graded, and Step 4's bulk edit becomes an accelerant rather than a prerequisite.

### Step 2: Audit the rest of the command surface

One fixed line in one file does not fix the class. **CORRECTION 3: the class is at least 10 markers across 6 commands, not one.** grade_blog's own line 126 admits it: drafts arrive having "been through 5+ pipeline stages that leave HTML comments at the bottom". Verified:

| Command                                | Marker(s) it writes                                                                           | Drafts               | Non-draft | `published: true` |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------- | --------- | ----------------- |
| `grade_blog.md`                        | `QUALITY GRADE:`                                                                              | 234                  | 4         | **2**             |
| `blog_content_creator_people_v2.md`    | `TESTIMONY LEDGER`, `HEADING MIX LEDGER`, `DISTRIBUTION LEDGER`, `FORMULA FINGERPRINT LEDGER` | 135 / 135 / 135 / 72 | 0         | 0                 |
| `blog_content_fresh_eyes_people.md`    | `FRESH EYES REVIEW`                                                                           | 112                  | 1         | 0                 |
| `blog_content_second_pass_people.md`   | `SECOND PASS NOTES`                                                                           | 94                   | 0         | 0                 |
| `blog_content_editor_pass_people.md`   | `EDITOR PASS NOTES`                                                                           | 73                   | 0         | 0                 |
| `blog_content_revision_pass_people.md` | `REVISION PASS NOTES`                                                                         | 11                   | 0         | 0                 |

`blog_content_frontmatter_enrich_people.md:252` actively **preserves** these ("Do not touch HTML comment blocks"), so nothing downstream cleans them up.

**The good news: only grade_blog's marker has escaped to a published file.** The ledger and pass-note markers are draft-only today. **The bad news: `blog_content_publish_pop_culture.md:132` is the hole that let the escape happen.** Its publish gate checks for placeholder markers and then explicitly whitelists everything else: "HTML comments that are not placeholders ... are fine." `hollywood-heartthrobs-enneagram-analysis.md` is a pop-culture file, published, carrying a grade comment. That gate is why. Fix that line as part of this tasker. `blog_content_publish_people.md` has no comment check at all, but the people path is covered (see Step 4).

Scope call: **fix grade_blog's instruction and the pop-culture publish gate in this tasker.** Report the ledger and pass-note markers to DJ with the counts above. Do not rewrite five more commands here; the guard in Step 5 is what stops them escaping, and it should be written to catch markers nobody has invented yet.

### Step 3: Strip the 2 published leaks

Small and mechanical. Salvage first, same as T-02 and T-10 require. Do not just delete.

**CORRECTION 4, and this one bites: the `.review.md` exclusion does NOT hold in pop-culture or community.** T-02 verified the exclusion on the 7 enneagram-corner globs, the indexer, and the sitemap. That verification does not transfer. Both files in scope live outside enneagram. Verified:

- `src/routes/pop-culture/[slug]/+page.ts:8`, `pop-culture/[slug]/+page.server.ts:12`, `pop-culture/+page.server.ts:95`, and `blog/+page.server.ts:16` glob `/src/blog/pop-culture/*.{md,svx,svelte.md}` and exclude only `*-twitter.md`, `incel-exit-post.md`, `template.md`. **No `!**/*.review.md`.**
- The community globs (`community/[slug]/+page.ts:8`, `community/[slug]/+page.server.ts:10`, `community/+page.server.ts:9`) exclude only `societal-ticking-time-bombs-fact-check.md`. **No `!**/*.review.md`.**
- `src/lib/slugFromPath.ts` collapses **every** `*.review.md` to the literal slug `review`. Confirmed by running it: `hollywood-heartthrobs-enneagram-analysis.review.md` returns `"review"`, not the full name.

So a sidecar dropped naively into `src/blog/pop-culture/` would be bundled into the build and would map to slug `review`. It is kept off `/pop-culture/review` **only** by the `post.metadata.published` check at `pop-culture/[slug]/+page.ts`, which is a far weaker guarantee than the glob exclusion enneagram enjoys, and it collides with itself if a second sidecar ever lands in the same directory. **Salvaging naively converts a view-source leak into a bundled file on a live-ish slug.**

Order of operations, and it is not negotiable:

1. Add `'!**/*.review.md'` to every pop-culture and community glob site. Find them with `grep -rn 'src/blog/pop-culture/\*\|src/blog/community/\*' src/routes/ --include='*.ts'`.
2. **Then** write the salvage sidecars.
3. **Then** strip the blocks from the 2 files, anchoring on `<!-- QUALITY GRADE:` and its closing `-->`.
4. Rebuild and confirm `grep -ic review` on the chunks is still 0.

Or sidestep the whole thing by salvaging to `docs/content-analysis/grades/` per Step 1, which needs no glob edits. Either is defensible. Pick one, say which, and do not half-do both.

### Step 4: Decide the 234 drafts

**Recommendation: strip them, in the same pass, scoped to the `QUALITY GRADE` marker only.** Publishing a draft is a one-line frontmatter change and nobody will remember to clean the comment first. That is exactly how the 2 published leaks happened.

**This narrows further than expected. `scripts/personBlogParser.js` lines 752 to 753 already strips every HTML comment before DB push:**

```js
// Remove HTML comments
cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, '');
```

So the **DB path is safe**, and `/personality-analysis/*` is DB-driven. Only the bundled-build path matters, and the drafts are bundled solely through the admin-gated `admin/drafts` route. **That reduces the 234 from an emergency to hygiene.** Confirm this before relying on it, then tell DJ plainly: the drafts are a latent risk, not a live one, and Step 1's self-healing grader drains them over time for free.

**Hard constraint on the strip: scope it to `<!-- QUALITY GRADE:` and nothing else.** `scripts/blog-lint.sh` lines 200 to 206 **require** the four ledger comments to be present and `fail` a draft that lacks them. A broad "strip all HTML comments" pass would red-light 135 drafts on the ledger gate instantly. The ledgers are a different marker with a different owner. Leave them.

This is a bulk edit, so: dry run first, print the file list and line ranges with no writes, confirm the matcher finds exactly 234, emit the diff, DJ reviews, only then write. Commit in reviewable batches, never one 234-file commit.

### Step 5: Extend T-02's guard to cover both markers, and the ones not invented yet

T-02 owns the guard. Do not write a second one. Coordinate.

**Match the general shape, not a marker list.** Enumeration is precisely how the first rename escaped: T-02's guard names `QUALITY_FEEDBACK_START` and would sail straight past `QUALITY GRADE:` on the 2 live files. Match on an HTML comment containing a grade or reviewer feedback. Something along the shape of `<!--[[:space:]]*(QUALITY[ _]|.*\b(GRADE|REVIEW|FEEDBACK|LEDGER|NOTES)\b)`, tuned against the real corpus so it does not eat the benign structural comments T-02 §3 protects (`<!-- Section 1 -->`, the file-path comments, the documented pop-culture TODO).

**Critical, from T-02's verification and repeated here because it is the single most likely way this tasker ships a fake fix:** `blog-lint.sh` runs its unfinished-markers check at line 232 against `$BODY_NOCOMMENT`, which is comment-stripped by design at line 58. **A leak check written there passes on every file forever.** It must read the raw `$FILE`, the way the gate-LEDGER check at line 202 deliberately does. **Prove it FAILS on a known-bad file before trusting it.** A guard that cannot fail is worse than no guard, because it reads as coverage.

Gate on `published: true`. Keep T-02's WARN/FAIL split: `QUALITY_FEEDBACK` stays WARN until T-10 clears the 88, then promotes to FAIL. `QUALITY GRADE` can go straight to FAIL for published files once the 2 are stripped, since the draft population is not gated on `published: true`.

---

## Verification checklist

- [x] `grade_blog.md` no longer instructs HTML-comment feedback: line 5 rewritten, line 18 (`Pre-Approved Operations`) rewritten, template at 259 to 279 retargeted
- [ ] `blog_content_revision_pass_people.md` step 3 updated to read the new destination. **The revision pass still works end to end on a real draft.** Prove it; it hard-stops without grader feedback
- [x] `scripts/run-blog-pipeline.sh` pre-grade cleanup targets both the new sidecar and legacy body comments; shell syntax passes
- [x] Sibling commands checked and reported: the 10 markers across 6 commands in Step 2, with counts
- [x] `blog_content_publish_pop_culture.md:132` no longer whitelists non-placeholder HTML comments
- [x] `grep -rl '<!-- QUALITY GRADE:' src/blog/ --include='*.md' | grep -v drafts` returns **0**
- [x] Fresh production compilation completed; the marker count is **0 for the two formerly affected servable pages**
- [x] `ls .svelte-kit/output/server/chunks/ | grep -ic review` returns **0** after sidecars were written outside `src/`
- [x] Salvage sidecars exist under `docs/content-analysis/grades/` and preserve feedback for all four non-draft files
- [x] Sidecars were placed outside `src/`, so no route-glob edits were needed
- [x] `git diff | grep '^[+-]lastmod:'` returns **empty**
- [ ] **A fresh `/grade_blog` run on a scratch file produces NO HTML comment in the blog body.** This is the only check that proves the mechanism is closed
- [x] Visible content is unchanged by removal of the four invisible grade comments
- [x] T-02's guard reads raw `$FILE`, matches by shape rather than an enumerated marker list, and was proven to FAIL on known-bad published files
- [x] Counter-gate, T-10's lane: T-11 did not touch the historical class; later T-02 and T-01 changes reduced it to 86
- [x] Counter-gate, T-03's lane: T-11 did not touch flat frontmatter; the later T-01 rewrite reduced it to **88**, while `content_quality:` remains **442**
- [ ] `pnpm build` passes (drafts are bundled; one malformed file fails the whole deploy)
- [ ] Commits are reviewable batches, not one 234-file commit

---

## Risks and gotchas

- **Risk: breaking the revision pass.** The `QUALITY GRADE` comment is a live contract with a hard-stop reader, not dead output. This is the biggest risk in the tasker and the one the originating brief did not see. Change writer, reader, and pipeline strip together, then run the pass on a real draft.
- **Risk: the salvage creates a new leak.** Pop-culture and community globs do not exclude `*.review.md`, and `slugFromPath` collapses every sidecar to the slug `review`. Add the exclusions first, or salvage outside `src/`. Do not assume T-02's enneagram verification transfers.
- **Risk: the guard silently never fires.** Writing it against `$BODY_NOCOMMENT` makes it pass on every file forever. Test against a pre-fix copy and confirm a FAIL.
- **Risk: over-broad draft strip.** `blog-lint.sh:200-206` **requires** the four ledger comments. Stripping all HTML comments red-lights 135 drafts. Scope to `<!-- QUALITY GRADE:` only.
- **Hard constraint: never modify `lastmod`.** DJ manages it by hand. Removing an invisible comment is not a content edit and must not touch a date. **Never run `personBlogParser.js --publish`**, which rewrites `lastmod` to today. The `git diff | grep '^[+-]lastmod:'` gate is not optional.
- **Anchor on comment delimiters, never on line numbers.** T-03 found block positions vary per file, so position-anchored regexes over-reach and eat adjacent lines. That failure mode applies here at 234-file scale.
- **Scope guard: different lanes.** Do not touch T-10's 88 files or T-03's 89 frontmatter files. The counter-gates above must all be unmoved by this tasker. If your diff shows a `quality_grade:` line moving, your matcher is wrong. Stop.
- **Em-dashes are banned.** Zero per document. Note that grade_blog's own template at line 267 contains one; fixing it is in scope only because you are rewriting that template anyway.
- **Parallel work:** other agents and DJ have uncommitted work in this repo at all times. **Never `git stash`. Never bulk-reset.** Batched, reviewable commits only.
- **No database step for the 2 published files.** These are MDsvex files served from the repo, not `blogs_famous_people` rows.

---

## Definition of done

- [x] `grade_blog.md` no longer instructs, authorizes, or templates HTML-comment feedback into blog bodies
- [x] The destination is `docs/content-analysis/grades/<Person>.review.md`, outside `src/` and therefore outside route and bundle globs
- [ ] The three-file contract (writer, reader, pipeline strip) is consistent, and the revision pass is proven working
- [x] Sibling commands audited; the 10-marker class reported to DJ with counts
- [x] The pop-culture publish gate no longer whitelists non-placeholder comments
- [x] Both published leaks salvaged, then stripped; source and fresh build both clean for servable pages
- [x] 234 drafts explicitly deferred: the DB parser strips comments, the admin route is gated, and the revised grader self-heals each draft on its next run
- [x] `lastmod` unchanged everywhere, verified by `git diff`
- [x] T-02's guard covers both markers by shape, reads raw `$FILE`, and is proven to fail on a known-bad file
- [ ] A fresh `/grade_blog` run leaves no HTML comment in the body
- [x] T-11 left T-10 and T-03 untouched; later parallel work moved the current counts to 86 / 88 / 442 and is recorded separately
- [x] Handoff states plainly: **T-11 closes the mechanism; T-10 closes the history. Neither closes the other, and the ledger and pass-note markers remain an open class held back only by the guard.**

If any box cannot be checked, stop and report. Do not ship a partial fix that leaves the writer and reader disagreeing.

---

## 3. What was actually done

Implemented 2026-07-15:

- Chose `docs/content-analysis/grades/<Person>.review.md` for grader prose. This path sits outside `src/`, so route globs and the production bundle cannot serve it.
- Updated the writer, revision-pass reader, and pipeline cleanup as one contract. The grader replaces the sidecar, removes any legacy body grade comment, and keeps numeric scores in `content_quality` frontmatter.
- Tightened the pop-culture publish command so grade, review, feedback, ledger, and notes comments block publication.
- Salvaged and removed all four non-draft `QUALITY GRADE` comments. The published files were `consensus-on-human-nature.md` and `hollywood-heartthrobs-enneagram-analysis.md`; the unpublished files were `how-to-stand-up-for-yourself.md` and `Jeffrey-Epstein.md`.
- Extended `scripts/blog-lint.sh` to inspect raw published source by marker shape. The guard intentionally excludes `QUALITY_FEEDBACK` from failure until T-10 clears its historical backlog, while still warning on it.
- Corrected the tasker's draft assumption in code: 186 files under `src/blog/people/drafts/` carry `published: true` metadata even though they remain admin-only. The guard excludes the drafts path so it protects public source without breaking the active pipeline.
- Deferred the 234-draft cleanup. `personBlogParser.js` strips all HTML comments before DB publication, the build exposure is through the admin-gated drafts route, and the updated grader removes the legacy block on each future grading run. A bulk strip still requires the DJ-reviewed dry run specified above.

Current counts after the parallel T-01 rewrite: 234 draft `QUALITY GRADE` blocks, 0 non-draft blocks, 86 historical `QUALITY_FEEDBACK` blocks, 88 flat `quality_*` frontmatter files, and 442 `content_quality` files. Ledger and pass-note counts remain: testimony 135, heading mix 135, distribution 135, formula fingerprint 72, fresh eyes 112, second pass 94, editor pass 73, revision pass 11.

Verification: both modified shell scripts pass `bash -n`; the guard failed on known-bad published files before cleanup and passes them afterward; `pnpm check` passes with 0 errors and 125 pre-existing warnings; no `lastmod` line changed. Full `pnpm lint` is still blocked by a 96-file repository Prettier backlog. A fresh production retry compiled and adapted successfully: zero review sidecar chunks, zero `QUALITY GRADE` markers in the two formerly affected target chunks, and a present `manifest-full.js`. The final build-budget check fails because runtime media/fonts exceed the configured limit by 112.76 KiB. A real `/grade_blog` plus revision-pass scratch run is still required before calling the end-to-end command contract proven.
