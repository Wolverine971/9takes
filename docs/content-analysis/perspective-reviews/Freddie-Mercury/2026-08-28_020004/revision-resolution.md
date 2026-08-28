---
artifact: perspective-revision-resolution
schema_version: 1
subject: Freddie-Mercury
draft_sha256: f0fb9928071271f8faea829e79114be609dd4bb7df81357ac4711d80bbbf7ba8
resolution_status: complete
resolved_at: 2026-08-28T07:44:12Z
path: docs/content-analysis/perspective-reviews/Freddie-Mercury/2026-08-28_020004/revision-resolution.md
---

# Revision resolution: Freddie Mercury (2026-08-28_020004)

## Resolution log

**Trigger.** This revision pass was grade-triggered (B+ 8.7, below the 9.0 bar), not verification-triggered. `verification-initial.md` had already returned **pass** with `open_p0: 0`, zero incomplete accepted P1s, and `protected_hit_regressions: 0`. There were therefore no verifier-named `P0-*` items and no incomplete `P1-*` items for this pass to repair; the perspective inputs functioned as constraints (PROTECT list, adjudications) on the grade-driven edits below.

| Item                                                                                           | Status                    | Edit                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grader: quarantine/de-mechanize Munich stress-arrow paragraph                                  | fixed                     | Body paragraph removed from the Munich section; its content merged into the Rabbit Hole "Stress and Growth Arrows" section with the ENNEAGRAM-H4 sentence "Munich is that arrow with a street address" preserved **verbatim** there (honors the jury keep-note in enneagram.md and synthesis line 47 while satisfying the grader's quarantine ask — the grader itself named the Rabbit Hole as the correct home). |
| Grader: de-mechanize "withdrawn type working as designed"                                      | fixed                     | Shy-section closing paragraph reworded with no type-mechanics language; decoy insight retained mid-paragraph; section now closes on a bridge into Scene by Scene. Distribution ledger updated 2 → 0.                                                                                                                                                                                                              |
| Grader: trim epigraph to scars sentence                                                        | fixed                     | Epigraph now carries only "I'm just riddled with scars and I just don't want any more."; the "more I open up" line appears once, in the diagnosis-section quote. No jury hit covered the epigraph verbatim (subject.md P175 leaned the same direction).                                                                                                                                                           |
| Grader: pin deathbed "house" quote                                                             | fixed                     | Attribution cue added inline: "in the account she gave OK! magazine in 2000" — matching the evidence packet's verified source (OK! magazine, March 17, 2000). Follow-on marriage quote re-attributed as "she said in the same interview" to avoid double outlet naming.                                                                                                                                           |
| Grader: pin Brian May quote                                                                    | fixed                     | "May recalled in Total Guitar" now inline (outlet previously lived only in the testimony ledger comment).                                                                                                                                                                                                                                                                                                         |
| Grader: vary two aphoristic closers                                                            | fixed                     | Shy-section "was loving the decoy" closer reshaped; "arrow with a street address" left the body entirely (now mid-paragraph in the Rabbit Hole). Third flagged closer not varied — see Unresolved decisions rationale (it is PROTECT-09).                                                                                                                                                                         |
| Grader: returned-gifts triplication                                                            | fixed (partial by design) | TL;DR Munich bullet gives up the "gifts came back" punchline; Munich section owns the reveal. Live Aid "or return his gifts" callback kept — PROTECT-02 territory and already adjudicated intentional in the second-pass notes.                                                                                                                                                                                   |
| verification-initial Remaining-work #1 (do not re-flag Hutton "in the house" / Fasching quote) | honored                   | Both untouched.                                                                                                                                                                                                                                                                                                                                                                                                   |
| verification-initial Remaining-work #2 (cut before adding, 3-word headroom)                    | honored                   | Net cut: 4,497 → 4,485 words; headroom widened to 15.                                                                                                                                                                                                                                                                                                                                                             |
| verification-initial Remaining-work #3 (optional Freestone 1998 memoir upgrade)                | not taken                 | Optional-only; current attributed framing verified safe by the initial verification.                                                                                                                                                                                                                                                                                                                              |

Lint after edits: **0 fail**, 1 warn (standing thin-headroom advisory, now 4,485/4,500).

## Protected hits checked

All ten re-verified against the post-revision draft by anchor-phrase grep and section inspection:

- **PROTECT-01** — teeth cold open through "They are the same gesture, made in opposite directions." Untouched (epigraph trim sits above it and was not part of the protected span).
- **PROTECT-02** — pull-quote + "conducted from behind a wall of 72,000 witnesses" + "or return his gifts" callback. Untouched.
- **PROTECT-03** — "could not be explained by Freddie Mercury" / "the only ground the fame never flooded." Untouched.
- **PROTECT-04** — Freestone laughing paragraph, "What he rationed was access." Untouched; the reworked paragraph is the one **after** it.
- **PROTECT-05** — "The statue is not where he is…" / "the last door he ever asked her to hold shut" / "still outside it, singing." Untouched; the Austin-pin edits touch only the preceding paragraph.
- **PROTECT-06** — base-rate concession ("should be suspected") with August-2026 stamp. Untouched.
- **PROTECT-07** — "One honest complication" paragraph in main-body position + "Wounded Threes perform harder. Wounded Sevens book the next adventure." Untouched.
- **PROTECT-08** — "The name came all the way back." Untouched.
- **PROTECT-09** — both song readings ("sings along to the door", "begging on behalf of one") verbatim. This protection is why the third flagged closer was not varied.
- **PROTECT-10** — all hedges and silences hold: "If Hutton's dating is right", no sexuality label in draft voice, matching-rings sentence, no estate figures / secret-daughter / posthumous clinical claims, Wigg source card, Rabbit Hole skip-permission line, criticism-first Silence structure, closing disclaimer ("pretence anyway"), date-anchored streaming certification. The Austin quote pin adds an attribution, not a claim.
- **ENNEAGRAM-H4** (jury keep-note, non-numbered) — "Munich is that arrow with a street address" survives verbatim, relocated to the Rabbit Hole per the grader's quarantine directive; the transcript-confirmed gifts-returned admission still carries it.

## Unresolved decisions

None. One constrained rejection for the record: the grader's closer-cadence list included "sings along to the door" by implication; it was left verbatim because PROTECT-09 requires it. The other two flagged cadence instances were resolved instead, satisfying the "vary two closers" ask without a protected-hit regression.

The gate is not declared passed here; `/blog_perspective_verify_people` must rerun against the revised draft per pipeline rules.
