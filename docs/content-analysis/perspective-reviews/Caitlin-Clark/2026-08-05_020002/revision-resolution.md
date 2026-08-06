---
artifact: perspective-revision-resolution
schema_version: 1
subject: Caitlin-Clark
draft_sha256: 4573f054476806a5f939660a6be57fbeafce53b0941d183d6fb2df9b186a2925
resolution_status: complete
resolved_at: 2026-08-05T08:06:09Z
---

<!-- docs/content-analysis/perspective-reviews/Caitlin-Clark/2026-08-05_020002/revision-resolution.md -->

# Perspective revision resolution — Caitlin Clark

This pass ran on the grade sidecar (C, 7.9 — Evidence 6, Originality 7), not on an open perspective
gate. `verification-initial.md` returned **pass, 0 open P0, 0 protected-hit regressions, 0 unresolved
accepted P1s**. There was therefore nothing in the P0 or PROTECT set for this pass to repair.

What this pass took from the perspective artifacts instead is the four non-blocking items in
`verification-initial.md` § Remaining work, each of which named a minimum action. All four are
closed below.

Post-revision whole-file SHA: `c277f99f291bb244a200183d0d10c44c2bba2fb1af8ef5117a443296b747a2c8`.

## Resolution log

| ID | Status | Edit |
| --- | --- | --- |
| P0-01 … P0-10 | fixed (no action needed) | All ten verified resolved before this pass. No edit in this pass touches any of their acceptance-test spans. |
| P1-01 … P1-11, P2-02 | fixed (no action needed) | All verified completed. One exception with a deliberate change, logged in the next row. |
| P1-02 (partial reopen) | fixed | The verifier passed P1-02 on tense repair, but packet CLM-29 separately marks "top three in the league in scoring" **disputed and unverified** (one leaderboard snapshot puts Kelsey Mitchell above Clark at 24.03 to 21.54; whether A'ja Wilson also sits above her decides second vs third). Cut the clause from the H2 9 anchor. "Top two in assists," which CLM-29 confirms, is untouched. This narrows a claim P1-02 softened; it does not reverse P1-02. |
| RW-1 (Remaining work 1) | fixed | Both stale production comments annotated. The `SECOND PASS NOTES` line instructing a future editor to "restore the fuller line" of the Cynthia Cooper quote now carries `[SUPERSEDED — editor pass 2026-08-05, P0-09 … cut for overclaim and non-verification (packet CLM-26, S-28). Do not restore it, in October or ever, without new sourcing.]`. The scout-team practice-scene note carries a matching `[SUPERSEDED … P0-02 … Do not re-inflate it.]`. The October refresh can no longer read either as a live instruction. |
| RW-2 (Remaining work 2) | fixed | Sue Bird date confirmed rather than assumed. The *Bird's Eye View* episode aired Friday **2025-08-08**, and SI covered it as "Fever Star Caitlin Clark Points Out Positive in 'Toxic' Turnover Trait to Sue Bird." The draft's in-body "On Sue Bird's podcast in August 2025" is correct as written; packet S-29 (Pro Football Network, 2024) is a separate, earlier item, not the same appearance. Recorded as an inline annotation on TESTIMONY LEDGER entry 7 so the conflict does not get rediscovered. No body edit required. |
| RW-3 (Remaining work 3) | fixed | FAQ 3 in frontmatter changed from "The resolution is that she grades correctness at the moment of decision" to "**The reading here is that** she grades correctness at the moment of decision," matching the body's P0-05 framing. This is the version `PeopleBlogPageHead.svelte` feeds into FAQPage JSON-LD, so the hedge now reaches answer engines. |
| RW-4 (Remaining work 4) | fixed | The Letterman sports-psychologist block quote's terminal truncation is restored to packet S-06 in full: "…the effect and the power that I could have on people, **whether it was negative or whether it was also positive**." The balancing half is back in the section that argues her effect on the room was costly. Funded by cuts logged below. |

### Grade-driven edits (outside the perspective set, recorded for the verifier's diff)

Every remaining body change in this pass traces to the grader's NEEDS WORK / TO REACH list. Listing
them so the next verification pass does not have to classify them as unexplained edits.

**Evidence (cap: `evidence_untraceable_load_bearing`).** Outlet + date added to Bluder's
"perfectionist" (KCRG, February 2025 — packet S-20) and Stephanie White's (Athlon Sports, 2025 —
S-23); Jensen's testimony source named in the body (Talkin' Hawks, 2025); Yahoo Sports attached to
the May 2026 grace quote; publishers attached to the numeric spine (Guinness World Records on the
223, CBS Sports on the 37-0 bench, an AP line-header on the box-score table, the Fever's 2026-08-04
release on the current-tense paragraph); "We'll have to see" tagged to ESPN in the cold open.
`blog-source-audit.mjs` moved from **3 inline / 2 vague / 1 untagged** to **4 / 2 / 0**, and
`untagged quote in epigraph OR cold open` moved from YES to no. The two surviving vague quotes are
the six-out-of-ten pair, traceable to ESPN's Malika Andrews, June 2026, named in the article's first
sentence.

**Originality (cap: `sameness_originality`).** Reader-command imperatives cut from eight to two,
keeping the two the grader named. Three of the six converted were cohesion bridges; each kept its
carried keyword and lost only the imperative mood, so the seams the cohesion pass built still hold. A
ninth imperative the grader did not enumerate ("Read against the six…") was converted for the same
reason. The closing no longer performs the return-to-the-origin-object move shared with Nara-Smith,
Stable-Ronaldo and Tate-McRae.

**Funding cuts** (the draft entered at 4,497 of 4,500): the closing bike sentence (−22), "that would
spend the whole summer in last place" (−8, already carried by the table's "Against a 6-21 team"),
"top three in the league in scoring" (−6, disputed per CLM-29), the "draining" fragment from a
three-quote run (−4), "and it lands as one" (−5), and the imperative conversions (net −11). Exit:
**4,494 words**.

## Protected hits checked

All eleven re-checked against `draft-reviewed.md` by exact string, after this pass.

| ID | Verdict | Note |
| --- | --- | --- |
| PROTECT-01 | intact | Turnover-resolution paragraph untouched. The only change anywhere near it is the key-stat div above it gaining "per Guinness World Records," which is outside the protected paragraph. Not compressed to fund anything. |
| PROTECT-02 | intact | Commercial seam byte-identical, still in the body, still unresolved, still no salary figure. |
| PROTECT-03 | intact | Swoopes concession byte-identical. The preceding sentence changed from "Start with the criticism she has actually absorbed on basketball" to "The criticism she has actually absorbed is about basketball" — an imperative conversion in the lead-in, not in the concession. |
| PROTECT-04 | intact | Box-score table and its final row byte-identical, including "right read versus a bailout." The added "The AP line, row by row:" sits above the table, and the trim of "that would spend the whole summer in last place" is in the paragraph below it, not in the protected rows. |
| PROTECT-05 | intact | H2 6 filter paragraph does not appear in this pass's diff. Its comparative contrast pair remains the one lint warning, correctly left alone. |
| PROTECT-06 | intact | "The reframe changes what the behavior means without changing what it cost." verbatim, still upstream of H2 7's ending. |
| PROTECT-07 | **intact, setup cut by design** | "Nobody has told her the gap closed." survives **verbatim and still closes the article**. Its setup sentence ("She got on the bike because her brother had gotten on his that morning and the gap was hers to close.") was cut, because that sentence *is* the return-to-origin-object move the grader capped originality on. The line now attaches to the arithmetic paragraph, so "the gap" reads as the distance between her six and a ten, and the bike keeps its H2 2 home. The swap test still passes: no other subject produces this ending. Flagged here explicitly so the verifier adjudicates rather than infers. |
| PROTECT-08 | intact | Hook through the one-word "Six." paragraph unchanged. The one edit in the cold open is **after** "Six." — "Clark said" to "Clark told ESPN" — clearing the source audit's untagged-in-cold-open flag, which blocks B+ mechanically. Outside the protected span, and it adds attribution rather than removing content. |
| PROTECT-09 | intact | "It is August 2026, and she is spending the hours again" verbatim; H2 8 heading verbatim. What follows the stamp lost the disputed scoring rank and gained the Fever release date. |
| PROTECT-10 | intact | Rabbit Hole permission-to-skip line verbatim; section not expanded. The Type Eight sentence at the end of the section was reworded ("as the subtype note above works through" to "and the subtype note works through why"), which is outside PROTECT-10's span. |
| PROTECT-11 | intact | "I mean, like, yes" inside the Goldman Sachs block quote. The sentence after it changed from "Read against the six, that answer…" to "Against the six, that answer…" — imperative conversion, outside the quote. |

**Protected-hit regressions: 0.** One item (PROTECT-07) had its setup sentence removed by deliberate
adjudication between a jury hit and a grader cap; the protected sentence itself and its closing
position are untouched.

## Unresolved decisions

1. **Word ceiling, unchanged and still DJ's call.** The body sits at 4,494 of 4,500. This pass ran
   net-negative and bought six words, which is not a solution. The October postseason refresh still
   needs either a one-time `BLOG_LINT_WORD_CEILING` exception or a structural cut of ~150 words
   decided by a human. Carried forward from the editor resolution and the verification unchanged.

2. **RQ-01 (the tempo claim) remains unverified,** and the draft still does not depend on it. No
   change from the verification's position.

3. **Two of the four cross-draft sameness moves are not fixed and cannot be fixed here.** The grader
   named four recurring house moves; this pass fixed the two it prescribed (imperatives, closing
   shape). The other two — the epigraph → cold-open scene → reframe-twist furniture, and the TL;DR
   bold-noun-phrase-plus-colon bullet skeleton — are properties of the people-draft template, not of
   this draft. Fixing them here would make Caitlin-Clark inconsistent with 400+ siblings for no
   reader gain. **Needs a human decision about the template itself**, and it will keep capping
   originality on every draft graded in a batch until someone makes it.

4. **"Top two in assists" has a shelf life.** CLM-29 confirms it as of 2026-08-04 (Thomas 8.32,
   Clark 8.03). It is a live-season rank inside a current-tense anchor and will need re-checking at
   the October refresh alongside the postseason update.

The gate is not declared passed here. `/blog_perspective_verify_people` reruns against this pass.
