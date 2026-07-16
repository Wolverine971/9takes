<!-- docs/taskers/T-08-enneagram-and-autism-blog.md -->

# Tasker: Draft "Enneagram and Autism: Why Masking Makes You Mistype as a 5, 9, or 1"

**Requested by:** DJ Wayne / 9takes
**Created:** 2026-07-15
**Status:** Draft complete and locally verified 2026-07-15. Awaiting DJ editorial review; full repo lint and the final asset-budget gate remain red for unrelated repository issues.
**Purpose:** Draft the highest-confidence new blog the corpus audit surfaced: a falsifiable argument that masking corrupts Enneagram self-report tests, aimed at ~285 impressions of autism intent (page-agnostic, per `queries.csv`) that currently have no door.
**Recommended target file:** `src/blog/enneagram/enneagram-and-autism-why-you-keep-mistyping.md`
**Recommended URL:** `/enneagram-corner/enneagram-and-autism-why-you-keep-mistyping`
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §7 Tier A #1 (the pitch) and §8 item 11 (the schedule). Taskers `T-01` (the fabrication problem this post must not repeat) and `T-09`.

---

## 1. Objective

Write one publishable article that makes a real argument, not a topic survey:

> Autistic people disproportionately test as Enneagram 5, 9, or 1 regardless of their actual type. Every Enneagram test measures self-reported **behavior**. The system types **motivation**. Masking is a lifetime of behavior that is not motivation. The withdrawal reads as 5. The conflict-avoidance reads as 9. The rule-adherence reads as 1. All three are masking artifacts, not types.

**The falsification condition must appear in the piece, in the body, not buried in an FAQ:**

> Motivation-based interviews should scatter autistic people across all nine types where behavior-based tests cluster them on 5, 9, and 1. If a well-run motivation interview also clusters them on 5/9/1, this argument is wrong.

State the condition that would kill the argument. The audit found `falsify_pass` fails on 76 of 99 blogs in this corner. This piece does not get to be the 77th.

This is the lowest-risk, highest-certainty item on the audit's new-content list. It is scheduled for Friday in §8 item 11.

---

## 2. Required reading (read all five before drafting)

1. `.claude/skills/9takes-editorial-standards/SKILL.md`. The rulebook. Zero em-dashes, banned word list, the three substance tests. It wins over any instruction in this tasker that contradicts it.
2. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §7 Tier A item 1. The pitch, the demand case, and the cannibalization check. Also read §1 for the structural verdict and §8 item 11.
3. `src/blog/enneagram/enneagram-and-adhd-which-types-struggle-most.md`. The control and the model to beat. Read it for what earns clicks and for the trap in §6 below.
4. `src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md`. The neighbor. Read for the disclaimer box (lines 55 to 57, CSS at 792 to 800), the 24-cell type-by-condition table you must NOT rebuild, and the stranded motivation-vs-processing distinction at lines 752 to 768.
5. `docs/data/gsc/2026-07-06-queries.csv` and `docs/data/gsc/2026-07-06-page-query.csv`. The demand data. Re-verify before drafting. If a number below differs from the CSV, the CSV wins.

---

## 3. Demand evidence (re-verified 2026-07-15 against the CSVs)

Every number below was checked against the live CSVs today. **Three corrections to the original brief are folded in and flagged.**

| Query                                           | Clicks |                 Impressions |    CTR | Position | Source file          |
| ----------------------------------------------- | -----: | --------------------------: | -----: | -------: | -------------------- |
| `which enneagram is most likely to be autistic` |  **0** |                          94 |  0.00% |      7.6 | page-query           |
| `enneagram and autism`                          |     12 |                          98 | 12.24% |      5.7 | queries + page-query |
| `enneagram autism`                              |      6 |                          91 |  6.59% |      6.0 | queries + page-query |
| `autism enneagram`                              |      3 |                          64 |  4.69% |      7.0 | queries + page-query |
| `enneagram 5 autism`                            |  **0** |                          37 |  0.00% |      9.0 | page-query           |
| `autism and enneagram`                          |      2 |                          32 |  6.25% |      6.3 | queries + page-query |
| **Autism intent total**                         | **23** | **416** (see caution below) |        |          |                      |

> **Caution on that 416.** It is the union of two datasets with different scopes, so it is a fair descriptive picture of "all autism-shaped rows we can see" but it is **NOT** a figure you may compare against another cluster's `queries.csv` total. For the ADHD comparison, and for any demand sizing, use the page-agnostic `queries.csv` cut only: **autism 285 vs ADHD 274, a ratio of 1.04x**. See Correction 2 in §3.
> | `enneagram and neurodivergence` | 2 | 23 | 8.70% | 7.0 | queries |

**Correction 1 (file attribution).** The two zero-click queries that carry this post, `which enneagram is most likely to be autistic` (94 imp) and `enneagram 5 autism` (37 imp), are **not in `2026-07-06-queries.csv`**. They exist only in `2026-07-06-page-query.csv`. The brief cited the wrong file. Both numbers are correct. Cite the right file.

**Correction 2 (RETRACTED, and the retraction is instructive).** An earlier draft of this tasker claimed autism demand **exceeds** ADHD demand by roughly 50% (416 vs 274). **That is wrong. Do not use it.** It compared autism's total summed across BOTH `queries.csv` and `page-query.csv` against ADHD's total from `queries.csv` alone. Two different datasets with different scopes, which is not a comparison.

The brief's original wording was right. Verified like-for-like, both from page-agnostic `2026-07-06-queries.csv`, person-name queries excluded from both sides:

| Cluster       | Impressions | Distinct queries | Has a dedicated page? | Page performance                                            |
| ------------- | ----------: | ---------------: | --------------------- | ----------------------------------------------------------- |
| Autism intent |     **285** |                4 | **No**                | scattered onto a page about something else                  |
| ADHD intent   |     **274** |                6 | Yes                   | **252 clicks, 4.84% CTR, pos 5.6, the #2 page on the site** |

**Ratio: 1.04x. Statistically identical latent demand.** That is the argument, and it is strong enough without inflation: equivalent demand, one has a door earning 252 clicks, the other has none.

**The methodological trap, which matters for any future "should we build this page?" question:** summing `page-query.csv` gives autism 513 and ADHD 1,244, making ADHD look 2.4x bigger. That comparison is **circular**. A page+query row can only exist if a page exists to accrue it. ADHD has a dedicated page (plus anchor rows), so it accumulates rows autism structurally cannot. `page-query.csv` measures a page's harvest; `queries.csv` measures latent demand. **For a build-it decision, use `queries.csv`.** Use `page-query.csv` only for per-page diagnosis, never for cross-cluster demand sizing.

**Correction 3.** `which enneagram is most likely to be autistic` at 94 impressions, position 7.6, zero clicks is the thesis phrased as a search query, earning nothing. `enneagram 5 autism` at 37 impressions and zero clicks shows searchers already make the Type 5 connection unprompted, which corroborates the thesis from the outside. Both currently land on `enneagram-neurodivergence-guide`, a page that does not answer either one.

**Cannibalization check (verified, include a version of this in the piece only if it serves the reader; it is mainly here to preempt the objection).** When the ADHD page grew from 1,602 to 5,205 impressions, the neurodivergence guide grew from 1,755 to 4,977, with CTR **rising** from 1.82% to 2.83%. They rise together. This is directional, not clean: the windows overlap during sitewide growth. The cannibalization fear is not supported by the data.

---

## 4. Why this file goes at the top level, not in `mental-health/`

Both paths exist and both have live routes:

- `src/blog/enneagram/*.md` renders at `/enneagram-corner/[slug]`
- `src/blog/enneagram/mental-health/*.md` renders at `/enneagram-corner/mental-health/[slug]`

**Ship it at the top level.** Four reasons, in order of weight:

1. **Match the winner.** `enneagram-and-adhd-which-types-struggle-most` is the nearest comparable page, it is the #2 page on the site at 252 clicks, and it sits at the **top level**. The `mental-health/` subdirectory holds the #3 page but also holds the corpus's worst liabilities.
2. **The framing is the safety argument.** This post is about **mistyping**: a personality instrument producing a wrong answer. It is not clinical guidance about autism. Top-level placement reinforces that boundary. Filing it under `mental-health/` implies a clinical claim the piece must never make (see §9).
3. **The neighborhood is distressed.** `mental-health/` contains `enneagram-science-mental-health` (the T-01 fabrication disaster, 19 hijacked DOIs) and `enneagram-neurodivergence-guide` (`quality_grade: 'D'`, `quality_safety_gate: 'fail'`). Do not add a flagship post to that folder.
4. **Shorter URL, one level shallower.** Minor, but free.

---

## 5. Recommended frontmatter

```yaml
---
title: 'Enneagram and Autism: Why Masking Makes You Mistype as a 5, 9, or 1'
description: 'Autistic people keep testing as Type 5, 9, or 1. Enneagram tests measure behavior. The system types motivation. Masking is the gap between them.'
author: 'DJ Wayne'
date: '2026-07-15'
loc: 'https://9takes.com/enneagram-corner/enneagram-and-autism-why-you-keep-mistyping'
changefreq: 'monthly'
priority: '0.7'
published: false
type: ['situational']
blog: true
previewHtml: ''
path: src/blog/enneagram/enneagram-and-autism-why-you-keep-mistyping.md
---
```

Frontmatter rules for this file:

- **NO `lastmod`.** DJ manages it by hand. Do not add it, do not guess it. This is a hard rule.
- **`published: false`** until DJ reviews. Do not flip it.
- **Omit the `enneagram` field.** The brief asked for it, but **0 of 92** blogs in `src/blog/enneagram/` use it, including the ADHD control. The field takes one number and this thesis names three types. Match the siblings and leave it out.
- **`type: ['situational']`** matches the ADHD control. It is the most common value in the directory (28 of 92).
- **Omit the `quality_*` block entirely.** Per `T-03`, that block is not a gate and has self-certified A+ on a page carrying 19 fabricated citations. Do not add self-assessed grades.
- `description` must land in 120 to 155 characters. The draft above is 147.
- Add `pic:` only if DJ generates art. Do not invent an image slug.

---

## 6. Required article structure

### The trap, and how to avoid it

**The nine-slot type-by-type template is forbidden in this piece.** This needs saying twice, because the model to beat uses it: the ADHD control marches Type 1 through Type 9 and is still the #2 page. A drafting agent will notice that and copy it. Do not.

The nine-slot template does not earn the ADHD page its clicks. The anchor data proves it:

| Anchor section                                                      |    Impressions | Clicks |
| ------------------------------------------------------------------- | -------------: | -----: |
| ADHD `#how-adhd-affects-each-enneagram-type-differently`            |          1,967 |  **0** |
| ADHD `#why-your-enneagram-type-affects-how-adhd-shows-up`           |          1,901 |      1 |
| ADHD `#which-enneagram-types-are-most-commonly-diagnosed-with-adhd` |          1,266 |  **0** |
| Neurodivergence guide, all nine per-type anchors                    | 3,729 combined |  **0** |

The template generates impressions and zero clicks. The ADHD page wins on demand and position despite its nine slots, not because of them. The audit is blunt about this: 47 of 99 blogs are the same artifact, a sharp thesis in the first 200 words then abandoned for a nine-slot template any Enneagram site could publish verbatim. That is the documented cause of the structural ceiling at 8.0.

**The thesis names three types. Go deep on those three. Completeness is the disease.**

### H1

`Enneagram and Autism: Why Masking Makes You Mistype as a 5, 9, or 1`

### Opening

Answer in the first 100 words. The thesis is the hook; do not warm up to it. Suggested shape, rewrite in your own voice:

> If you are autistic and every Enneagram test you take says 5, 9, or 1, the test is not reading your type. It is reading your mask. Tests ask what you do. The Enneagram is a system about why you do it. Masking is decades of practiced behavior that has nothing to do with motivation.

### H2 outline (7 sections, sentence case, vary the syntax)

1. `Why the test keeps saying 5, 9, or 1`
2. `Tests measure behavior. The Enneagram types motivation.` (the mechanism, and the piece's spine)
3. `The withdrawal that reads as Type 5` (deep, mechanism-level)
4. `The conflict-avoidance that reads as Type 9`
5. `The rule-adherence that reads as Type 1`
6. `What would prove this wrong` (the falsification condition, in the body)
7. `How to find your type when your behavior is not your motivation` (the action step)
8. `FAQ`

Sections 3, 4, and 5 are the article. Each one names the masked behavior, names what the test scores it as, and separates it from the motivation that would produce the same behavior natively. A native 5 withdraws to conserve resources. A masking autistic person withdraws because social performance is expensive. Same observable act, different engine. That distinction, repeated across three types with real specificity, is the piece.

**Do not rebuild the 24-cell type-by-condition lookup table.** `enneagram-neurodivergence-guide` already owns it. This post goes where that table does not: into the mechanism of one instrument failing.

**Lift and expand the stranded asset.** The neurodivergence guide's sharpest idea is buried in its FAQ at lines 752 to 768: "clinicians diagnose ADHD and autism based on development and day-to-day functioning, not motivation. The Enneagram tracks motivation. Neurodivergence is neurological." That distinction is this post's entire thesis, and it is currently sitting in an FAQ answer on a page graded D. Lift it, expand it into section 2, and make it load-bearing. Leave the original in place; the two pages should link, not fight.

Target length: whatever sections 3 through 5 need. Do not pad to hit a word count.

---

## 7. The 9takes angle (required, not optional)

Masking is invisible from outside and obvious from inside. Nine anonymous answers to a question like **"when did you learn to perform being normal?"** would show nine different motivations producing near-identical masked behavior. That is the give-first mechanic doing the exact work the thesis needs, and no test-based competitor can reproduce it, because a test cannot see motivation. Which is the thesis.

**This is a requirement.** The audit found that **not one of 99 published Enneagram blogs** uses the give-first mechanic, the nine-types-answering-one-question format, or a single real anonymous answer from the platform. `unique_pass` fails on **95 of 99**. The site's only structural moat is absent from the section it should define. This post is the chance to be the first.

**The fallback is the default path, and you must take it.** The audit already checked whether real answers exist and they do not:

- The best question on the platform has roughly **10 typed answers**.
- **Five of nine types are absent platform-wide.**
- Roughly **52% of takes have no profile at all** (140 untyped vs 131 typed), because type tags require a profile.

The audit killed a different post outright on exactly this data. So: **pose the question, explain what nine answers to it would reveal and why a test cannot produce that, and link to `/questions`.** Invite the reader to answer it. Say honestly that the answers are being collected.

**Never invent an anonymous answer.** Not one. Not paraphrased, not composite, not "representative." The corpus already has a documented fabrication problem (see `T-01`: invented case studies, invented statistics, invented testimonials, 19 hijacked DOIs on a single live page). A fabricated user quote on a post about autistic people would be worse than all of it.

---

## 8. Required internal links

Link to all three neighbors. They rise together; they are not competitors.

- `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most`, the #2 page, the control, the closest sibling
- `/enneagram-corner/mental-health/enneagram-neurodivergence-guide`, the #3 page, 141 clicks, the source of the lifted motivation-vs-processing distinction. Link it where you lift it.
- `/enneagram-corner/neurodiversity-vs-personality`, 7 clicks, 277 impressions, pos 10.2

Also link, where each is genuinely earned and not shoehorned:

- `/questions`, the give-first ask in §7
- `/enneagram-corner/enneagram-type-5`, `/enneagram-corner/enneagram-type-9`, `/enneagram-corner/enneagram-type-1`, one each, from its own section
- `/enneagram-test`, only in the context of its own limits, which is honest and on-thesis

Verify every slug resolves before shipping. Do not link `enneagram-science-mental-health`; it is being unpublished under `T-01`.

---

## 9. Hard safety constraints (non-negotiable)

1. **Never diagnose. Never imply the Enneagram detects autism.** Never suggest a type indicates autism, or that autism indicates a type. The claim is strictly about **mistyping**: how masking corrupts a self-report instrument. That framing is defensible. Anything broader is not. If a sentence could be read as "Type 5 means you might be autistic," cut it.
2. **Autism is a clinical diagnosis.** The piece is about a personality test being wrong, not about who is autistic.
3. **Write with autistic readers, not about them.** Masking is a survival adaptation with real costs, not a quirk or a superpower. Second person where natural. No pity, no fascination, no "autistic people are like this" from the outside.
4. **Include the house disclaimer box.** Copy the pattern from `enneagram-neurodivergence-guide.md` lines 55 to 57 with its scoped SCSS at lines 792 to 800. Adapt the wording to this post's narrower claim. The mental-health cluster needed a whole safety pass in March 2026 for prescriptive and diagnostic language. Do not recreate that debt.
5. **Every claim is sourced, first-party, or explicitly labeled a hypothesis.** No exceptions. Research on autistic masking exists and is real. If you cite it, **resolve the citation first**: confirm the DOI resolves to the paper you are naming, with the authors you are naming, saying what you say it says. A resolving DOI is not a passing DOI; T-01's failure mode was real DOIs attached to fabricated authors and findings. If you cannot resolve it, do not cite it. Write the claim as a hypothesis or cut it.
6. **The 5/9/1 clustering claim is the thesis, and it is a hypothesis.** Label it as one. It is not an established research finding and must never be presented as a measured result. Its strength is that it is falsifiable and mechanistically reasoned, not that someone measured it.

---

## 10. Voice and positioning

Follow `.claude/skills/9takes-editorial-standards/SKILL.md`. The rules that will bite hardest here:

**Forbidden outright:**

- **Em-dashes. Zero. In this tasker and in the resulting blog.** Lint-enforced.
- **Negative parallelism**: "It's not X, it's Y." The audit found this is not a tic but the corpus's prose engine, firing up to nine times per article. Zero instances. Rewrite as direct statements. This one is a real risk here, because the thesis is itself a contrast (behavior vs motivation) and the pattern will feel natural every single time. It is still banned. State the distinction plainly instead.
- **The nine-slot template** (§6).
- Rebuilding the neurodivergence guide's 24-cell table (§6).
- Invented anonymous answers, invented studies, invented statistics (§7, §9).
- The banned word list: delve, unpack, tapestry, nuanced, crucial, testament, foster, multifaceted, at its core, shed light on, and the rest. Read the list.

**Aim for:**

- Tactically direct. Pattern-recognition forward. Respectfully provocative, and this topic earns the sharpness because the target is the instrument, not the reader.
- Sentence case in headings. Vary heading syntax. Vary section length and intensity.
- Concrete and visualizable. "A Type 5 withdraws to conserve energy" is a claim you can picture and check. "Masking impacts self-perception" is not.
- Paragraphs of 2 to 4 sentences. Mobile-first.

---

## 11. FAQ targets

Draw directly from the real zero-click queries. Add visible FAQ prose plus `FAQPage` JSON-LD, matching the pattern in the ADHD control. Keep the JSON-LD text in sync with the prose; T-01 found fabrications living on in schema after prose was fixed.

1. `Which Enneagram type is most likely to be autistic?` (94 imp, 0 clicks, pos 7.6. **The honest answer is none, and that is the piece.** The question assumes the test works. Answer the question the searcher meant, then correct the premise. Do not dodge it, and do not answer it with a type.)
2. `Are most autistic people Enneagram Type 5?` (37 imp, 0 clicks, pos 9.0 for `enneagram 5 autism`)
3. `Can the Enneagram tell if you are autistic?` (**No.** Say it flatly. This is the safety-critical answer.)
4. `Why do autistic people mistype on Enneagram tests?`
5. `How do I find my Enneagram type if I mask?`
6. `Is masking the same as being a Type 9?`

Answer style: direct, first sentence answers the question, no throat-clearing, no overclaiming.

---

## 12. Verification checklist

- [ ] Every number re-verified against `2026-07-06-queries.csv` and `2026-07-06-page-query.csv`; CSV wins any conflict
- [ ] `grep -cP "\\x{2014}" <file>` on the finished draft returns **0** (em-dash check)
- [ ] Zero instances of "It's not X, it's Y" negative parallelism
- [ ] No nine-slot type-by-type march; sections 3 to 5 carry the piece
- [ ] Falsification condition appears in the body, not only the FAQ
- [ ] Zero invented anonymous answers, quotes, case studies, or statistics
- [ ] Every citation resolved against the live DOI registry, or cut
- [ ] Disclaimer box present, adapted from the neurodivergence guide pattern
- [ ] All three neighbor links present and resolving
- [ ] Frontmatter has no `lastmod`, no `enneagram` field, no `quality_*` block, and `published: false`
- [ ] `description` is 120 to 155 characters
- [ ] FAQ prose and `FAQPage` JSON-LD say the same thing
- [ ] No sentence implies the Enneagram can detect autism
- [ ] `pnpm lint` passes and the build compiles (bad YAML in one draft fails the whole deploy)

---

## Definition of done

- [x] A draft exists at `src/blog/enneagram/enneagram-and-autism-why-you-keep-mistyping.md`, `published: false`, ready for DJ to review without further keyword research
- [x] The thesis is argued, not labeled, and the falsification condition is stated in the body
- [x] Sections on 5, 9, and 1 each separate masked behavior from native motivation with real specificity
- [x] The give-first question is posed and `/questions` is linked, with the honest note that answers are still being collected
- [ ] Every §12 checklist item passes
- [x] The draft itself is the only T-08 implementation file; unrelated taskers were worked in the same worktree without changing this draft's scope.
- [x] A short note to DJ records the corrections in §3 and the out-of-scope em-dash in `enneagram-neurodivergence-guide.md` frontmatter.

**Quality bar:** the audit found zero of 99 published Enneagram blogs clear the 8.5 publish gate, and the ceiling is a structural 8.0 caused by the thesis-then-template collapse. This post is the test of whether that ceiling is breakable. If it turns into a nine-slot survey with a good intro, it failed, regardless of what it grades.

---

## 13. What was actually done

Created `src/blog/enneagram/enneagram-and-autism-why-you-keep-mistyping.md` as an unpublished review draft.

- Kept `published: false` and omitted `lastmod`, `enneagram`, and every `quality_*` field.
- Wrote the three required deep sections on Types 5, 9, and 1, plus the body-level falsification condition, scoped disclaimer, give-first `/questions` invitation, and all three required neighbor links.
- Kept the 5/9/1 clustering claim explicitly framed as a hypothesis. The draft never implies that Enneagram can identify or diagnose autism.
- Resolved both research citations against their actual papers: Hull et al. on social camouflaging and the CAT-Q development paper. Confirmed the diagnostic-boundary language against CDC guidance.
- Local checks found a 144-character description, zero em-dashes, zero banned negative-parallelism instances, synchronized FAQ prose and JSON-LD, and no nine-type template.

Repository-wide `pnpm check` passes with 0 errors and 125 pre-existing warnings. Full `pnpm lint` still stops on a 96-file Prettier backlog outside this draft. A fresh production retry compiled and adapted successfully, and the autism draft produced two expected chunks. The command exits 1 only because runtime media/fonts exceed the repository budget by 112.76 KiB, unrelated to this Markdown draft.
