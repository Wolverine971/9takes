---
artifact: perspective-editor-pass-applied
schema_version: 1
subject: Duke-Dennis
review_dir: docs/content-analysis/perspective-reviews/Duke-Dennis/2026-08-14_190118
frozen_draft_sha256: f46a7311bbcdd538e838a9086d6c4395b07306bc9e83b887031e89a25cd9cf12
post_edit_draft_sha256: 21c6b351426eab6aafff93990a0151b06bf667eb5ef1eeeba9319f9088d97cfb
synthesis_available: false
gate_status: FAILED (missing unfamiliar.md; 4.4 exit=1, 4.5 exit=1)
resolution_status: not_a_resolution_artifact
applied_at: 2026-08-14T23:59:28Z
---

# Editor pass applied without a synthesis

**This is NOT `editor-resolution.md`.** That artifact asserts resolution against an adjudicated
synthesis Revision brief. No `synthesis.md` exists for this run: `4.4_perspective_unfamiliar`
exited 1 after 493s, `unfamiliar.md` was never written, and `4.5_perspective_reviews_gate`
failed. Writing a `perspective-editor-resolution` here would tell `/blog_perspective_verify_people`
that a gate passed which never ran.

`/blog_content_editor_pass_people` was also invoked WITHOUT `--perspective-review-dir`, so
perspective-jury mode was not formally active. The five completed reviews were used as diagnostic
input under a deliberately conservative rule: act only on findings that **two or more reviewers
raised independently**, or that **I verified first-hand**.

## Reviewer convergence

| Finding | subject | fan | critic | future | enneagram | Action |
| --- | --- | --- | --- | --- | --- | --- |
| Streamer University "as a student" is false | R1 | R1 | B4 | B2 | C4 | **fixed** (verified first-hand) |
| "circle has billed him exactly once" is false | R2 | R2 | B1 | B1 | - | **fixed** (subtractive) |
| Temperament smoothed ("never as rants" / "waved off") | R3 | R3 | C1,C2 | - | R1 | **fixed** |
| sx defined as seduction + ranked from absence | - | - | - | - | R2 | **fixed** (self-refuting internal link) |
| FAQ asserts a cause for the four-year stay | C4b | - | C4 | - | - | **fixed** |
| Corpus stat stale (45) | - | - | C7 | C4 | C2 | **fixed + inverted** |
| Travel run is not a 2026 phenomenon | - | C1 | C7 | C3 | - | **fixed** |
| Sit-down-interview qualifier missing | - | C5 | C3 | C6 | - | **fixed** (carried once) |
| Basic-training physical detail transposed | C3 | - | C6 | - | - | **fixed** |
| Union Square omits third-party cost | - | - | B2 | - | - | **partially fixed** (one clause; ceiling-bound) |
| "He owned his piece of it" launders compelled act | H3 (protect) | - | B3 | - | - | **conflict, resolved below** |

## First-hand verification

- `yt-dlp` against video IDs `2BbLkW5piSc` and `ybktw-KV_s0` returns, from channel **Duke Dennis**:
  `20250523 | Being A Professor At Streamer University` and
  `20250526 | Being A Professor At Streamer University Part 2`.
  He was faculty at the 2025 inaugural session. The "student" claim is refuted by first-party evidence.
- `src/lib/data/corpus-stats.json` (generated 2026-08-14T23:43:14Z): 409 published, 46 Type 8s.
  creator-media n=90: Type 7 = 22 (+9.77pp), Type 3 = 21 (+5.73pp), Type 8 = 11 (+0.98pp, i.e. baseline).
  The draft's original sentence implied Eight is a natural creator fit. The data says the opposite,
  so the sentence was inverted rather than merely re-numbered.

## Reviewer conflict resolved

`SUBJ-H3` marks "He owned his piece of it..." as must-survive (it is the proof the sympathetic frame
is earned). `CRITIC-B3` shows no individual apology from Duke is documented; AMP apologized
collectively and Kai individually, and crediting him for a plea-required act is motive laundering.

Resolution: keep the accountability, drop the inference. The paragraph now states the deal mechanics
("Prosecutors set the apology and the check as the price of the dismissal") and retains the harder
ownership line in the article's own voice ("he was part of the draw that pulled that crowd into that
square, and the crowd is the whole product"). Both reviewers' underlying concerns are served.

## Deliberately NOT done

- **San Antonio is not retold.** Three reviewers plus the entity-gap packet call loose legal
  characterization a repeat of the Tobey incident. CRITIC-B1 alone wanted a bounded added clause;
  subject, fan, and future all specified subtraction only. Subtraction was taken.
- **No `editor-resolution.md`.** See above.
- **FAN-C4 (expand the 2K apprenticeship)** and **CRITIC-B2's fuller harm accounting** are additive and
  the body is at 4495/4500 words. Deferred.

## Required next step

Re-run the perspective jury. `unfamiliar.md` is still missing, so this draft cannot satisfy
editorial-standards hard rule 4 (perspective gate) and is **not publish-eligible** regardless of the
edits applied here. The jury should re-run against the post-edit draft (`21c6b351426eab6aafff93990a0151b06bf667eb5ef1eeeba9319f9088d97cfb`), not the frozen one.
