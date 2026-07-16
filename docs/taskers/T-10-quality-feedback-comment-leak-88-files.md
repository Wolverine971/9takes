<!-- docs/taskers/T-10-quality-feedback-comment-leak-88-files.md -->

# Tasker: Quality Feedback Comment Leak (88 Files)

**For:** the agent assigned to strip the remaining `QUALITY_FEEDBACK` HTML comments out of published blogs.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Dry run complete 2026-07-15; awaiting DJ review. 86 of the original 88 blocks remain in source. No T-10 bulk deletion has started.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §9.5 (the correction that owns this; §8 items 2-3 and §9.4 are the under-count it corrects). Siblings: `T-02` (the two prose-dump leaks, owns the lint guard), `T-03` (the frontmatter half of the same batch run).

---

## 0. What and why

**Nine published articles publicly tag themselves `unsupported-claims`. Eight publicly tag themselves `safety-boundary-risk`, and all eight sit in the mental-health cluster. Every one of the 88 publishes its own letter grade.**

Anyone who views source, a journalist, a competitor, an SEO tool, an LLM crawler, finds 9takes self-certifying that its own mental-health content carries unsupported claims and safety-boundary risk. That is a reputational exposure. Unlike a quality problem it is fixable in one pass with zero editorial judgment.

MDsvex passes HTML comments straight through to rendered HTML. It does not strip them. This is not theory:

- `grep -rl "QUALITY_FEEDBACK" src/blog/ --include="*.md"` returns **88 files, all 88 `published: true`** (79 in `src/blog/enneagram/`, 9 in `src/blog/enneagram/mental-health/`). None are drafts.
- `grep -rl "QUALITY_FEEDBACK" .svelte-kit/output/server/chunks/` returns **88 chunks**, and all 88 contain the literal string `<!-- QUALITY_FEEDBACK_START`. The leak is in compiled output, not inferred from source.

Verified example, `src/blog/enneagram/enneagram-dating-guide-for-men.md` lines 23-29:

```
<!-- QUALITY_FEEDBACK_START
Grade: B+ (8.8) | Priority: none | Safety: n/a
Strengths: practical utility (9.5); Enneagram depth (9.2).
Improve next: Strengthen the first 2-3 paragraphs with a sharper promise and clearer stakes.
Tags: weak-hook
Graded: 2026-02-22
QUALITY_FEEDBACK_END -->
```

Verified tag distribution across the 88: `weak-hook` 40, `template-fatigue` 24, `none` 19, `style-friction` 15, `unsupported-claims` 9, `low-utility` 9, `safety-boundary-risk` 8, `overlap-duplication` 7, `revised` 1.

**The eight `safety-boundary-risk` tags are not just embarrassing. They are false.** Verified: the 8 files carrying that tag are **byte-for-byte the same 8 files** carrying `quality_safety_gate: fail` in T-03. Per T-03 §2.2 those 8 were safety-remediated on **2026-03-10** and nobody flipped the flag back. So the corpus is publicly broadcasting a safety warning about content that was fixed four months ago. One of the 8 is `mental-health/enneagram-neurodivergence-guide`, the **#3 traffic page** (141 clicks / 4,977 impressions).

**Provenance.** The `Graded: 2026-02-22` stamp ties this to the same batch run that wrote the `quality_*` frontmatter across 89 files. One run wrote **both** a frontmatter block and an HTML comment. **T-03 owns the frontmatter. T-10 owns the comment.** The boundary is exact and there is no overlap in the work: T-03 touches YAML keys between the `---` fences, T-10 touches a delimited comment block below them.

**Boundary with T-02.** T-02 owns two big prose-dump leaks (`NEXT_LEVEL_REVIEW`, `READER_FEEDBACK_START`) plus the `blog-lint.sh` guard. It also strips the `QUALITY_FEEDBACK` block from `enneagram-dating-guide-for-men.md` because it is already in that file. **That is 1 of your 88.** If T-02 lands first, your count is 87. Re-count, do not assume.

**Current state, re-verified during the T-10 dry run on 2026-07-15:** the original class was 88 files; 86 blocks remain in source, all 86 currently `published: true`. The dating-guide block is preserved in `src/blog/enneagram/enneagram-dating-guide-for-men.review.md`. A parallel T-01 rewrite removed the contained science-page block while this dry run was being generated; its full text was captured in the salvage report from the first read. All write counts below must use 86 for the remaining pass, while corpus history and distribution totals continue to describe the original 88.

---

## 1. Required reading

1. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §9.5, the correction that produced this tasker. §8 items 2-3 found only the two prose dumps and missed this entirely.
2. `docs/taskers/T-03-quality-frontmatter-is-not-a-gate.md` §2.2 and its Risks section. Establishes the 2026-03-10 remediation and the YAML-variance failure mode.
3. `docs/taskers/T-02-internal-notes-leaking-to-page-source.md` §2 Step 4, the guard spec and the `$BODY_NOCOMMENT` trap.
4. `scripts/blog-lint.sh` lines 50-58 (the `FM` / `BODY` / `BODY_NOCOMMENT` split) and line 202 (`grep -q "$ledger" "$FILE"`, the raw-`$FILE` pattern you must copy).
5. `.claude/commands/grade_blog.md` lines 5 and 255-275. This is the generator, and it is not writing what you expect. See Step 5.

---

## 2. The fix (in order)

### Step 1: Reconcile 88 vs 89 before touching anything

Originally, 89 files carried the frontmatter block and 88 carried the comment. **This is already solved, and it is documented here so you do not re-derive it.** The original 89-set was a strict superset of the 88-set. The single file with frontmatter but no comment was:

**`src/blog/enneagram/depression-patterns-by-enneagram-type.md`** (`quality_grade: 'B+'`, `quality_score: 8.7`, `quality_safety_gate: 'pass'`)

Its comment was added in commit `185f26b6` and removed in commit `6879b5dc`. The removed block was:

```
<!-- QUALITY_FEEDBACK_START
Grade: B+ (8.7) | Priority: none | Safety: pass
Strengths: Enneagram depth (9.7); practical utility (9.6).
Improve next: Reduce repeated section scaffolding and make type sections more differentiated.
Tags: template-fatigue
QUALITY_FEEDBACK_END -->
```

**Two things this tells you.** First, the job has already been done once, incidentally, inside an unrelated crosslink commit, and it did not break the file. That is a real precedent and it lowers the risk on the remaining 88. Second, that pass removed the comment and **left the frontmatter behind**, which is exactly the T-02 / T-03 split reproduced by accident. Confirm this state still holds before you start; if the numbers have moved, stop and report rather than proceeding on stale arithmetic.

**Post-audit count correction:** T-01's rewrite later removed both the science page's comment and its flat `quality_*` block. Current counts are therefore 86 comments and 88 flat frontmatter blocks. `content_quality:` remains 442. T-10 must not move either frontmatter count.

### Step 2: Salvage before deleting

**Do not simply destroy this.** The tag taxonomy is real signal. 40 `weak-hook` and 24 `template-fatigue` across 88 files is a corpus-wide diagnosis, and it independently corroborates the structural findings in the 2026-07-15 audit. It is worth more as a report than as a leak.

Extract all current blocks to a single report at `docs/content-analysis/2026-07-15_quality-feedback-salvage.md` **before** stripping anything. Per file record: path, grade, score, priority, safety, tags, the "Improve next" line, and the `Graded` date. The completed report accounts for all 88 originals: 86 current blocks, the dating-guide block preserved by T-02, and the science-page block captured before the parallel T-01 rewrite removed it. Also note that the `safety-boundary-risk` tags are stale as of the 2026-03-10 remediation (see T-03 §2.2). Do not editorialize beyond that.

The report is the deliverable that makes the deletion safe. It now holds or points to all 88 original blocks. The remaining write is the 86-file patch only.

### Step 3: Strip the block from all 86 remaining files

Mechanical and safe: the block is delimited, self-contained, and has zero readers.

**Good news, verified 2026-07-15: the delimiters have zero variance.** The original class had exactly 88 matching opening and closing lines. The current source has exactly 86 of each, with no whitespace or casing variants. That is a cleaner surface than T-03's frontmatter. **Re-verify it anyway.** T-03 was bitten by exactly this assumption (see Risks).

**This must be a dry run first.** 86 files is exactly the size where a bad regex is a catastrophe. Sequence:

1. Print the file list and the exact line ranges to be removed. **No writes.**
2. Confirm the matcher finds **exactly 86** files and **exactly 86** blocks. Not 85, not 87.
3. Emit the full diff. DJ reviews it.
4. Only then write.
5. `git diff | grep '^[+-]lastmod:'` must return empty before any commit.

Anchor on the `QUALITY_FEEDBACK_START` and `QUALITY_FEEDBACK_END -->` delimiters. **Never on line numbers.** Leave no orphan blank-line runs where the blocks were, and ensure every file still ends with a single clean newline.

Commit in reviewable batches. **Not one 86-file commit.**

### Step 4: The guard, and the dependency in both directions

T-02 already specifies the `blog-lint.sh` check. Do not write a second one. Coordinate.

**The critical detail T-02 discovered and you must respect:** the unfinished-markers check at `blog-lint.sh:235` runs against `$BODY_NOCOMMENT`, which is comment-stripped by design at line 58. A leak check written there **passes on every file forever and is useless**. The check must read the raw `$FILE`, the way the gate-LEDGER check at line 202 deliberately does. **Prove it FAILS on a known-bad file before trusting it.** A guard that cannot fail is worse than no guard, because it reads as coverage.

T-02 scoped its `QUALITY_FEEDBACK` guard to **WARN** rather than FAIL precisely because failing would red-light 88 files on day one and get the lint ignored.

**T-10 completing is what unblocks T-02's guard becoming an error.** Once all 88 are clear, promote the `QUALITY_FEEDBACK` line in T-02's guard from `warn` to `fail`. State this in your handoff. The dependency runs both ways: T-02 owns the guard, T-10 owns the precondition that lets it bite.

### Step 5: The generator, and the thing the brief got wrong

**Something wrote these comments. Find it before stripping, or the next grading run re-adds all 88.** That instinct is right. The answer is not what it looks like.

**The generator that wrote `QUALITY_FEEDBACK` no longer exists in the repo.** Verified: `grep -rl "QUALITY_FEEDBACK"` outside `src/blog/` returns only documentation (T-02 and the audit). `.claude/commands/grade_blog.md` **never mentions `QUALITY_FEEDBACK` at all**. That marker was a one-off February batch run, not a checked-in script. **There is no treadmill on this marker.** Stripping the 88 is final.

**But its successor is live and already leaking.** `grade_blog.md` line 5 instructs: "leave actionable reviewer feedback as an HTML comment." Lines 261-267 spec a block opening `<!-- QUALITY GRADE: [LETTER] ([OVERALL])`, inserted immediately after the closing `---`. Verified spread of that marker:

| Location              | Files   |
| --------------------- | ------- |
| `src/blog/**/drafts/` | 234     |
| Published, non-draft  | **2**   |
| Overlap with your 88  | **0**   |
| Compiled build chunks | **237** |

The 2 published files are `src/blog/pop-culture/hollywood-heartthrobs-enneagram-analysis.md` and `src/blog/community/consensus-on-human-nature.md`.

**Read that table carefully.** The behavior that caused this tasker was never fixed. It was renamed. The current grader writes the same class of leak under a different marker, it is already live on 2 published pages, and 234 drafts are one publish away from becoming the next 88.

**Do not fix this here.** It is a different marker, a different blast radius, and it needs its own decision (does the grader stop writing comments, or write to a sidecar like T-02's `.review.md` convention). **Report it to DJ as its own tasker.** Two things you must do inside T-10:

1. **Make T-02's guard cover both markers**, not just `QUALITY_FEEDBACK`. A guard that catches only the dead marker while the live one ships is theater.
2. Say plainly in your handoff that stripping 88 files closes a historical leak and does **not** close the mechanism.

---

## Verification checklist

- [ ] `grep -rl "QUALITY_FEEDBACK" src/blog/ --include="*.md" | grep -v drafts` returns **0** (86 remain after T-02 and T-01)
- [ ] Fresh `pnpm build`, then `grep -rl "QUALITY_FEEDBACK" .svelte-kit/output/server/chunks/` returns **0**. A stale build passing this proves nothing; rebuild.
- [x] `git diff | grep '^[+-]lastmod:'` returns **empty** at the dry-run gate
- [x] Salvage report exists at `docs/content-analysis/2026-07-15_quality-feedback-salvage.md` and accounts for all 88 original blocks
- [ ] The dry-run diff was shown to DJ before any write
- [ ] **Visible content unchanged.** The comments were invisible, so removing them must not change one rendered word. Diff the comment-stripped body before and after; it must match exactly.
- [ ] Every touched file still ends with a single clean newline, no orphan blank-line runs
- [ ] `grep -rlE "^quality_(grade|score|graded_at|rewrite_priority|safety_gate|update_note):" src/blog/ | wc -l` still returns **88**. T-10 touches no frontmatter. T-01 caused the 89 to 88 change before this patch.
- [ ] `grep -rl "^content_quality:" src/blog/ | wc -l` still returns **442**, untouched
- [ ] `pnpm build` passes (drafts and blogs are bundled; one malformed file fails the whole deploy)
- [x] Original 88 vs 89 reconciled and reported; the later T-01 removal explains the current 86 vs 88
- [x] T-02's guard reads raw `$FILE`, covers both historical and successor marker shapes, and is proven to FAIL on a known-bad file
- [x] Live-generator finding addressed under T-11
- [ ] Commits are reviewable batches, not one 86-file commit

---

## Risks and gotchas

- **Hard constraint: never modify `lastmod`.** DJ manages it by hand. **This is an 88-file frontmatter-adjacent sweep and is the single most likely operation in the whole set to violate the rule.** T-03 found the specific failure mode: block line numbers vary per file, so a position-anchored regex over-reaches and eats an adjacent line. Anchor on the delimiters, never on line numbers. The `git diff | grep '^[+-]lastmod:'` gate is not optional.
- **Do not run `personBlogParser.js --publish` or any tool that rewrites `lastmod`.** Deleting an invisible comment is not a content edit and nothing about it should touch a date.
- **Gotcha: quoting and formatting variance.** T-03 verified that `enneagram-medication-mental-health.md` uses **unquoted** YAML where the other 7 quote theirs, so a naive grep found 7 of 8 and **silently missed the medication page**. The comment delimiters currently show zero variance, but that is a measurement from 2026-07-15, not a guarantee. **Do not trust a single pattern. Verify your matcher finds exactly 86 before writing.** A grep that looks complete and is not is the exact error class that produced this tasker.
- **Risk: the guard silently never fires.** Writing the check against `$BODY_NOCOMMENT` makes it pass on every file forever. See Step 4. Test it against a pre-fix copy and confirm a FAIL.
- **Risk: scope bleed into T-03.** The frontmatter block and the comment block sit within a few lines of each other in the same files. You are touching **only** the comment. If your diff shows a `quality_grade:` line moving, your matcher is wrong. Stop.
- **Risk: double-editing the dating guide.** `enneagram-dating-guide-for-men.md` is in both T-02 and T-10. Coordinate or you will conflict. Whoever lands second re-counts.
- **Traffic assets. This tasker unpublishes nothing and edits no prose.** `enneagram-and-mental-illness` (287 clicks, top page) and `mental-health/enneagram-neurodivergence-guide` (141 clicks, #3) are both in your 88. Removing a comment from them is safe. Changing anything else about them is not.
- **Parallel work:** other agents and DJ have uncommitted work in this repo at all times. **Never `git stash`. Never bulk-reset.** Touch only the 86 current patch targets, the salvage report, and (in coordination with T-02) `scripts/blog-lint.sh`.
- **Em-dashes are banned in blog content.** You are deleting comments, not writing prose, so this should not come up. If you find yourself typing one, you have left scope.
- **No database step.** These are MDsvex files served from the repo, not `blogs_famous_people` rows.

---

## Definition of done

- [x] Salvage report written and verified to account for all 88 original blocks **before** the remaining deletion
- [x] Original 88 vs 89 reconciled, with `depression-patterns-by-enneagram-type.md` named and the later T-01 removal recorded
- [ ] Dry-run diff reviewed by DJ before any write
- [ ] All 86 remaining blocks stripped; source and fresh build output both return 0
- [ ] Rendered/visible content provably unchanged across all 86 touched files
- [ ] `lastmod` unchanged on every touched file, verified by `git diff`
- [ ] Frontmatter untouched: the current `quality_*` 88 and `content_quality:` 442 counts both unmoved
- [ ] `pnpm build` passes
- [ ] T-02's guard covers both markers, reads raw `$FILE`, and is proven to fail on a known-bad file
- [ ] T-02's `QUALITY_FEEDBACK` check promoted from WARN to FAIL, now that the historical class is clear
- [ ] Live-generator finding handed to DJ as its own tasker, with the honest framing: T-10 closed the historical leak, not the mechanism

If any box cannot be checked, stop and report. Do not ship a partial sweep across 88 files.

---

## 5. Dry-run outcome

Completed without source writes on 2026-07-15:

- `docs/content-analysis/2026-07-15_quality-feedback-salvage.md` accounts for all 88 original blocks.
- `docs/content-analysis/2026-07-15_quality-feedback-dry-run.md` lists the 86 current files and exact source ranges.
- `docs/content-analysis/2026-07-15_quality-feedback-removal.diff` is the full proposed patch. `git apply --check` passes against the current worktree.
- The patch removes only each delimited comment and its following blank line. It contains 86 file hunks and makes no source write until DJ approves it.
- Current source gates are 86 `QUALITY_FEEDBACK` markers, all 86 in published files; 88 flat `quality_*` files; 442 `content_quality:` files; and zero changed `lastmod` lines.

The task is paused at the explicit review gate. Do not apply the patch until DJ approves the dry-run artifacts.
