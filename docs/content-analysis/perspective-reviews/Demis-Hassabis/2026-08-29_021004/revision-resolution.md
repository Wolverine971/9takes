---
artifact: perspective-revision-resolution
schema_version: 1
subject: Demis-Hassabis
draft_sha256: e4da97083dbcdd623da5a8093ce678282f02d1f0faf27b150c6c61ee233cf8b0
resolution_status: complete
resolved_at: 2026-08-29T18:08:09Z
path: docs/content-analysis/perspective-reviews/Demis-Hassabis/2026-08-29_021004/revision-resolution.md
---

## Resolution log

This revision pass was triggered by the grade (B 8.4, `sameness_originality_7` cap), not by the perspective gate: `verification-initial.md` reported **pass** with 0 open P0s and 0 protected-hit regressions, and no accepted P1 was verifier-marked incomplete (P1-08's H2-tense sub-decision was deferred-with-reason and accepted). The perspective-scoped work therefore reduces to the verifier's non-blocking Remaining-work items plus a regression guarantee for the grade-driven edits below.

- **Verifier Remaining work #3 (TL;DR bullet 2 durability polish)** — `fixed`. "for roughly a decade he has run a second workday" → "for roughly a decade he ran a second workday" (the exact one-word fix the verifier specified).
- **Verifier Remaining work #1 / RQ-01 (Mallaby book check)** — `research_needed`, unchanged. Remains listed in `production_pretext.blockers`; requires the printed _The Infinity Machine_, outside this pass's scope. The deterministic gate and the publish decision own clearance.
- **Verifier Remaining work #2 (RQ-02 Althöfer full text)** — no action, per verifier: refresh-cycle item, non-blocking, his-telling framing safe under every outcome.
- **Verifier Remaining work #4 (attach future.md refresh list to production notes)** — carried in EDITOR PASS NOTES; production/publish stage responsibility.
- **Verifier Remaining work #5 / P2-04 (template owner checks)** — `needs_human`, unchanged; already logged for the template owner in EDITOR PASS NOTES.

Grade-driven edits applied in the same pass (all reader-visible; targeted at the originality cap):

1. Diagnosis-section closer: "Watch what he pays for. Watch what he refuses to pay for. The type is just the name for the pattern." → single declarative sentence (imperative-drumbeat + aphoristic-closer fix).
2. Cut "Sit with what that scene contains." from the AlphaGo paragraph.
3. Cut "Put the exits in one place:" after the protected "The pattern will, though." (sentence preserved verbatim; timeline block untouched).
4. "Now run the contradiction through…" → declarative "The contradiction reads differently against…" bridge.
5. Tanks-section closer flattened: "…In August 2026 he stopped spending it." → "…and he kept spending it right up until the August 2026 memo."
6. Rabbit Hole counter-typing line reworded to break the steve-martin rhyme ("a Three would have toured that victory for a decade" construction removed; same factual claim and P1-01-answer function preserved).
7. Added "in 2025" to the "worried for humanity" Lex Fridman attribution (verified against the local lex-475 2025 transcript).

## Protected hits checked

All PROTECT-01 through PROTECT-08 quoted sentences grep-verified verbatim after the edits: Thiel autopsy pair (PROTECT-01); fortress-of-hours and never-quits-the-work sentences, second-workday section otherwise untouched per "nothing else moves" (PROTECT-02); one-worry and concede-all-of-it (PROTECT-03); weapons-ban indictment (PROTECT-04); all three steelman sentences including "The pattern will, though." exactly (PROTECT-05); falsifier (PROTECT-06); close intact including "a board, an opponent, and unlimited time to think" (PROTECT-07); intro reframe, crown line, type-definition, after-victory tiebreaker, laboratory/Liechtenstein pair, and timeline block (PROTECT-08). No regressions. Edits 3–5 sit adjacent to PROTECT-03/04/05/08 territory and were placed outside the protected sentences. blog-lint re-run: 0 fail, 3 pre-existing warns (comparative count unchanged at 2; 4445 words).

Grader asks deliberately rejected to protect jury hits: breaking the "Here is the problem with the demotion story" reframe (PROTECT-08 verbatim; synthesis: "Reword the scope, not the move"), varying the return-to-Liechtenstein/"screaming" close (PROTECT-07), and flattening "Chess as a career died in Liechtenstein." (PROTECT-08) or "He quits whatever is billing time against the work." (PROTECT-02).

## Unresolved decisions

- **RQ-01 (production_pretext blocker, `research_needed`)**: verify the two Mallaby marquee quotes, the wartime staging, the sale motive, and the Facebook-rejection ground against the printed _The Infinity Machine_ before publish, or visibly re-attribute and record the accepted risk in the publish decision.
- **P2-04 (`needs_human`, template owner)**: inner-thought panel visual distinctness and FAQ-block placement on the live personality-analysis template.

The gate is not declared passed here; targeted perspective verification (`/blog_perspective_verify_people`) must rerun against the edited draft.
