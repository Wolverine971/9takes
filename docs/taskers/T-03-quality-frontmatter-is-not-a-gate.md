<!-- docs/taskers/T-03-quality-frontmatter-is-not-a-gate.md -->

# Tasker: Quality Frontmatter Is Not a Gate

**For:** the agent assigned to decide the fate of the `quality_*` frontmatter block across the enneagram corpus.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Not started. Blocked on DJ's decision at §2. The original class was 89 files; 88 remain after T-01's rewrite removed the science page's stale block. Do not write to any blog file before that decision.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §9.1 (the correction that produced this tasker) and `docs/taskers/T-01-fabricated-citations-science-mental-health.md` (Step 5 of T-01 feeds §4 of this doc).

---

> **Read §0 before you touch anything.** The first version of this finding was wrong, and it recommended unpublishing a page that gets 141 clicks a month. The recommendation has been retracted. If you skim this doc and act on a `safety_gate: fail` flag, you will delete one of the best pages on the site over four-month-old bookkeeping. The flag is not telling you what you think it is telling you.

---

## 0. What and why

**Do not bulk-unpublish anything on this tasker. Do not act on a `safety_gate: fail` flag. The flags are stale.**

The `quality_*` frontmatter block is not a signal. It is wrong in **both directions at once**, which is the part that makes it dangerous: it says `A+ / 9.5 / pass` on the worst page on the site, and `D / 6.9 / fail` on eight pages that were remediated a month after the stamp was applied. A reader of the frontmatter cannot tell good from bad, and an agent that trusts it will act confidently in the wrong direction.

The original audit read the `fail` flags as live and recommended unpublishing `why-therapy-doesnt-work-the-same-for-every-type`. **That recommendation is retracted.** See `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §9.1.

Three facts establish the whole picture, all verified by hand on 2026-07-15:

1. **The block gates nothing.** `grep` for `quality_grade`, `quality_score`, and `quality_safety_gate` across `src/`, `scripts/`, `src/lib/types/`, and every config returns **zero** consumers. Nothing reads these fields. No build step, no lint, no route, no type. They have never blocked a publish.
2. **The block is an orphaned schema.** The flat `quality_*` keys exist on **exactly 89 files, all of them in `src/blog/enneagram/`**, and all stamped `quality_graded_at: '2026-02-22'`. The current `/grade_blog` writes a _different_, nested `content_quality:` block, which exists on **442 files** with **zero overlap** with the flat 89. The flat block is a dead branch from one batch pass in February.
3. **The block is wrong in both directions.** Detailed in §1 below.

Net: a number in frontmatter that nothing enforces is decoration that reads as authority. It has produced exactly one demonstrated effect so far, which was almost getting a top page deleted.

**The real question is a decision, not a code change.** Half-measures produced this state. §2 forces the decision.

---

## 1. Required reading

1. **`docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §9.1**, the correction. This is the most important section in the doc and the reason this tasker exists. Read §9.3 too, it bounds the DOI scope for §4.
2. **`docs/taskers/T-01-fabricated-citations-science-mental-health.md`**, the falsely-passing page in detail. Its Step 5 hands the grader fix to this tasker.
3. **`.claude/commands/grade_blog.md`**, the grader. Note §2 "Evidence / Sourcing, weight 1.5x (highest)" contains no mention of DOI, Crossref, or resolving a source. That absence is the bug in §4.
4. **`.claude/skills/9takes-editorial-standards/SKILL.md`**, rule 1, line 13: never modify `lastmod`. This tasker is the operation most likely to violate it.

---

## 2. The evidence, in both directions

### 2.1 Falsely PASSING

`src/blog/enneagram/mental-health/enneagram-science-mental-health.md` self-certifies:

```yaml
quality_grade: 'A+'
quality_score: 9.5
quality_safety_gate: 'pass'
quality_rewrite_priority: 'none'
```

Its real audited grade is **1/10**. It carries **19 unique hijacked DOIs**: real DOIs that resolve to real papers on unrelated subjects, attached to fabricated author names, titles, and findings. The grader rewarded the fabricated citations **as rigor**, because it cannot resolve a source. It scores the appearance of evidence, and fabricated evidence has a cleaner appearance than real evidence does.

Two more, same batch, same pattern:

- `enneagram-coach-toolkit`: self-certifies A+ / 9.5 with "evidence quality 9.6" on an article containing no evidence.
- `philosophy-psychology-and-the-enneagram`: claims "evidence quality 9.1" with zero citations across 925 words.

### 2.2 Falsely FAILING (the correction, and the more dangerous half)

**Exactly 8** files carry `quality_safety_gate: fail` **while `published: true`**:

| File (under `src/blog/enneagram/`)                 | Note                                                                       |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| `why-therapy-doesnt-work-the-same-for-every-type`  | the original audit's retracted unpublish target                            |
| `mental-health/enneagram-neurodivergence-guide`    | **#3 traffic page. 141 clicks / 4,977 impressions / 2.83% CTR at pos 7.3** |
| `mental-health/enneagram-medication-mental-health` | unquoted YAML, see Risks and gotchas                                       |
| `mental-health/enneagram-addiction-recovery-guide` |                                                                            |
| `mental-health/enneagram-workplace-mental-health`  |                                                                            |
| `mental-health/enneagram-parenting-mental-health`  |                                                                            |
| `mental-health/enneagram-trauma-response-guide`    |                                                                            |
| `mental-health/enneagram-therapy-guide`            |                                                                            |

All 8 carry semantically identical quality frontmatter: `quality_grade: D`, `quality_score: 6.9`, `quality_rewrite_priority: rebuild`, `quality_safety_gate: fail`, `quality_graded_at: '2026-02-22'`.

**Identical scores across 8 distinct articles is a batch stamp, not 8 individual judgments.** 6.9 eight times is not a coincidence, it is a default. And **89 blogs carry that same `2026-02-22` timestamp**, so the batch covered essentially the whole enneagram corpus.

All 8 **also** carry a `quality_update_note` reading, with wording varying slightly per file:

> `Safety edits applied 2026-03-10: added disclaimer, softened prescriptive claims`

**The safety remediation was done on 2026-03-10. Nobody flipped the gate flag back to pass. The flags have been stale for four months.** The file records its own remediation and its own failure side by side, and the failure is the older of the two.

`enneagram-neurodivergence-guide` is on that list and it is one of the best-performing pages on the whole site. An agent that reads `safety_gate: fail` and bulk-unpublishes deletes it. That is the entire reason this doc exists.

---

## 3. Step 1: Decide first. Do not code yet.

The `quality_*` block is either wired to something real or it is deleted. Present both options to DJ honestly and get an explicit answer before editing a single file.

### Option A: WIRE IT

Make the gate real. A `published: true` file with `safety_gate: fail` fails the build or the lint.

- **Prerequisite:** re-grade or clear all 8 stale flags **first**, or the build breaks immediately on 8 files including the #3 page.
- **Cost:** the gate is only as good as the grader, and the grader just gave A+ to 19 fabricated citations. **A wired gate backed by a broken grader is worse than no gate: it launders bad content as approved.** Today the A+ on the DOI page is merely decorative. Wire the gate and that same A+ becomes an institutional endorsement that a build step certified.

### Option B: DELETE THE FIELDS

Strip `quality_grade`, `quality_score`, `quality_safety_gate`, `quality_rewrite_priority`, `quality_graded_at`, and `quality_update_note` from frontmatter entirely. Keep grading as an out-of-band report, the way the audit at `docs/content-analysis/` already works.

Frontmatter stops lying because it stops claiming.

### RECOMMENDATION: Option B

Reasons, in order of weight:

1. **The fields have never gated anything.** Zero code consumers, verified by grep. Deleting them cannot break a consumer that does not exist. (`grade_blog.md:254` asserts "consumers read them" about its own v1 keys. For the flat block, that claim is false.)
2. **They are stale across 89 files** and stamped in a single February batch that no longer reflects the corpus.
3. **They are wrong in both directions simultaneously**, so they carry no recoverable signal. A field that is wrong in one direction is a bug. A field that is wrong in both is noise wearing a uniform.
4. **Their only demonstrated effect has been to almost get a top page deleted.**
5. **The schema is already abandoned.** Current `/grade_blog` writes `content_quality:` on 442 other files. The flat block is a dead branch, and 89 files is its entire blast radius.

If DJ wants a gate later, build it on a grader that can resolve a citation. Do not rebuild it on this one.

---

## 4. Step 2: Clear the 8 stale flags truthfully (either option)

Whichever option DJ picks, the 8 stale flags get cleared **first**. They are the live hazard, and they stay a hazard under Option A (build break) and under Option B (until deleted).

The safety edits **were** applied on 2026-03-10. So:

- **Under Option A:** set the gate to reflect the post-remediation state. Do not invent a new score to go with it, and do not re-run the grader to produce one. If a real re-grade is wanted, that is its own scoped job with a human reading each of the 8, not a batch.
- **Under Option B:** remove the field along with the rest of the block.

**Do not leave the corpus asserting that 8 live mental-health pages failed safety.** That assertion is false, it is four months old, and it is a loaded gun pointed at the #3 page by the next agent who greps for it.

---

## 5. Step 3: Fix the grader's blind spot

`/grade_blog` scores the appearance of rigor. It has no network call and no way to check whether a source exists, so it rewards citation density, DOI links, author-year formatting, named journals, and specific-looking effect sizes. A fabricated article supplies all of those more cleanly than a real one, because real research summaries are hedged and sparse. **Fabrication is not a failure the grader missed. It is a gradient the grader rewards.**

**Recommended rule:** any blog containing a `doi.org` link must have every DOI resolved against Crossref and logged before it can score above a floor.

- Extract DOIs, resolve each against Crossref, log results next to the file for human audit.
- Fail on any DOI that does not resolve.
- **Also fail on any DOI that resolves to a paper whose title shares no meaningful terms with the surrounding claim.**

**Be explicit with DJ about that last bullet.** The cheap resolve-only version of this rule would **not** have caught `enneagram-science-mental-health`, because every DOI on that page resolves perfectly. The hijack is in the mismatch between the paper and the claim, not in the link. Recommend both halves or the rule is theater.

**T-01 handoff, verified 2026-07-15:** all 19 unique DOIs were resolved against Crossref, and **19 of 19 were hijacked**. Zero links failed resolution, so a resolve-only gate would have passed the entire fabricated citation set. Registry success must therefore be treated as the start of verification, not the verdict. At minimum, the logged audit must compare DOI title, authors, journal, year, and topic with the surrounding claim; medical-adjacent content also requires a human check before publication. The file contains 23 DOI links, but only two unique DOIs repeat: one appears four times and one twice.

**Scope note:** per audit §9.3, `enneagram-science-mental-health.md` is the **only** published blog on the site citing a DOI (verified: `grep -rl "doi\.org" src/blog/` returns 1 file). So this rule gates exactly one file today. That is fine. It is cheap insurance against the next one, and the gradient that produced this page has not changed. Say the honest version to DJ: this rule is prophylactic, not a cleanup.

Cross-reference `T-01`. Do not implement the DOI cleanup here, and do not implement the lint rule under `T-01`.

---

## 6. Step 4: Do not bulk-edit the remaining 88 files without DJ's explicit go

Other agents and DJ edit this repo in parallel. The original sweep covered 89 files; T-01's rewrite removed one complete block, leaving 88. A frontmatter sweep across the remaining files is the highest-collision operation in this codebase.

Any sweep must be a **dry run first**, emitting a diff DJ reviews before anything is written. Sequence:

1. Print the file list and the exact lines to be removed. No writes.
2. DJ reviews the diff.
3. Only then write, and only to the 88 files currently carrying the flat block.
4. `git diff` the result and re-read the `lastmod` guard in the checklist below before committing.

---

## Verification checklist

Run these before marking anything done. The first command is the one that matters.

- [ ] **No published file asserts a `fail` gate while also carrying a later remediation note.** Returns 8 lines today. Must return **0** when this tasker is done:

  ```bash
  cd /Users/djwayne/9takes
  for f in $(grep -rlE "^quality_safety_gate:[[:space:]]*'?fail'?" src/blog/); do
    grep -q "^published: true" "$f" && grep -q "^quality_update_note:" "$f" && echo "STALE: $f"
  done
  ```

- [ ] Flat-block file count. **88** after T-01. Must be **0** under Option B, **88** under Option A:

  ```bash
  grep -rlE "^quality_(grade|score|graded_at|rewrite_priority|safety_gate|update_note):" src/blog/ | wc -l
  ```

- [ ] **Nested `content_quality:` block untouched.** Must return **442** before and after, under either option:

  ```bash
  grep -rl "^content_quality:" src/blog/ | wc -l
  ```

- [ ] **`lastmod` untouched.** Must return **nothing**:

  ```bash
  git diff -- src/blog/ | grep -E "^[+-]lastmod:"
  ```

- [ ] `enneagram-neurodivergence-guide` is still `published: true`
- [ ] `enneagram-and-mental-illness` is still `published: true` and otherwise untouched
- [ ] Zero files unpublished by this tasker
- [ ] DJ approved the §3 decision explicitly, in writing, before any file was written
- [ ] The dry-run diff was shown to DJ before the sweep
- [ ] DOI lint recommendation recorded, including the explicit note that the resolve-only version would not have caught `enneagram-science-mental-health`
- [ ] `pnpm build` passes (drafts are bundled into the build, so a bad YAML edit fails the whole deploy)

---

## Risks and gotchas

- **Hard constraint: never modify `lastmod`.** DJ manages it by hand. **A frontmatter sweep is exactly the operation most likely to violate this rule.** A regex that matches "the quality block" and over-reaches by one line eats the `lastmod` above or below it. Line numbers for the block vary between files (16 to 22 across the 8 fail files), so do not anchor on line position. Match on key names only, and verify with the `git diff` guard above.
- **Hard constraint: never `git stash` or bulk-reset.** Other agents and DJ have uncommitted work in this repo at all times.
- **Traffic assets. Do not unpublish either, ever, on this tasker:** `enneagram-and-mental-illness` (287 clicks, the site's top page) and `enneagram-neurodivergence-guide` (141 clicks, #3). This tasker unpublishes nothing. If your work leads you toward an unpublish, you have misread the doc, and specifically you have misread §0.
- **Gotcha: the 8 files are NOT byte-identical, despite what audit §9.1 says.** `enneagram-medication-mental-health.md` uses **unquoted** YAML (`quality_safety_gate: fail`, `quality_grade: D`) while the other 7 quote their values (`'fail'`, `'D'`). A naive `grep "quality_safety_gate: 'fail'"` finds **7 of 8 and silently misses the medication page**. Every command in this doc uses `'?fail'?` for that reason. This is the same class of error as the original finding: a grep that looked complete and was not.
- **Gotcha: `quality_safety_gate: 'n/a'` is the corpus default**, on 78 of the 89. Do not read `n/a` as a passing grade or as a considered judgment. It means the February batch had no opinion. The full split is 78 `n/a`, 8 `fail`, and **3 `pass`**. The gate returned a considered `pass` exactly three times in 89 files, and the highest-scoring of those three (A+ / 9.5) is `enneagram-science-mental-health`, the fabricated-DOI page. That is the whole indictment in one line: the gate's proudest verdict is its worst call.
- **Scope guard: the flat `quality_*` block only.** Do not touch the nested `content_quality:` block on 442 files. That schema is live, current `/grade_blog` writes it, and it is out of scope here. Zero files carry both.
- **Scope guard: this tasker changes no prose.** No edits to article bodies, titles, slugs, or structure. Frontmatter keys only, or nothing at all.
- **Risk: re-grading to clear the flags.** Tempting under Option A, and it reintroduces the exact problem: the grader that produced the wrong flags produces the new ones. If the 8 need real grades, a human reads them. Do not batch.

---

## Definition of done

- [ ] DJ made an explicit Option A / Option B decision, recorded in this doc's Status line
- [ ] The 8 stale flags are cleared truthfully, per the chosen option
- [ ] The corpus no longer asserts that 8 live mental-health pages failed safety (verification command returns 0)
- [ ] Zero pages unpublished. Both traffic assets verified still live
- [ ] `lastmod` unchanged across every touched file, verified by `git diff`
- [ ] `content_quality:` on 442 files untouched, verified by count
- [ ] DOI rule recommendation handed to DJ with both halves and the honest scope note from §5
- [ ] `pnpm build` passes
- [ ] Audit §9.1 updated with the byte-identical correction from Risks and gotchas, or the correction noted for DJ

If you cannot satisfy any one of these boxes, stop and report. Do not ship a partial sweep across the remaining 88 files.
