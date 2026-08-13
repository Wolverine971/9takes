---
artifact: perspective-revision-resolution
schema_version: 1
subject: Carl-Jung
draft_sha256: 1fc5a8c291eca14d16aaae940c6e62bce7c2935bda3a4693c8fa69d8f4a67559
resolution_status: complete
resolved_at: 2026-08-13T07:59:01Z
path: docs/content-analysis/perspective-reviews/Carl-Jung/2026-08-13_020001/revision-resolution.md
---

Revision pass executed by `/blog_content_revision_pass_people` consuming the grade sidecar
(`docs/content-analysis/grades/Carl-Jung.review.md`, 8.6 B+, Originality capped 9→8) in perspective mode.
`verification-initial.md` reported **pass** with 0 open P0s, 0 incomplete accepted P1s, and 0 protected-hit
regressions, so this pass owed no perspective repairs; every edit below is grader-driven. The verifier gate
must rerun (`/blog_perspective_verify_people`) because the draft changed after verification.

## Resolution log

No verifier-named `P0-*` or incomplete `P1-*` items existed. Grader-driven edits applied on top of the
verified draft:

| Grader item                                                   | Status                 | Edit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Originality cap (`ducked_critic_pressure`): Nazi-era omission | fixed                  | Sourced, both-columns, no-verdict, type-free paragraph closes the shadow section: 1933 presidency under Nazi-era coordination; "The State of Psychotherapy Today" (1934, the society's journal); Gustav Bally's Neue Zürcher Zeitung attack (Feb 1934); statute rewrite letting excluded German-Jewish doctors keep individual membership; 1939 resignation; Gershom Scholem's account of Rabbi Leo Baeck's 1946 confrontation ("I slipped up"). Grader's remedy 1, chosen because the entity-gap packet's actual rule ("treat with careful named sourcing or omit; never a drive-by mention") permits it — the creator pass had over-read the packet as omit-only. See Unresolved decisions: DJ veto stands open. |
| Evidence: tag "to find my own bearings" inline                | fixed, with correction | Tagged at first use "in the same 1959 BBC interview" and second use "Asked by Freeman in 1959". The grader sidecar's Houston-1957 attribution is WRONG: the local transcript (`youtube-transcripts/carl-jung/face-to-face-1959-cc.md` [27:31]–[27:48]) pins the quote to Freeman's BBC Face to Face question immediately preceding the "painful question" exchange. The synthesis's "[Houston 27:37]" pin was the same file-confusion. Source audit now reads the slot INLINE.                                                                                                                                                                                                                                     |
| Evidence: quote Emma's 1911 letter                            | fixed                  | Verbatim fragment added: asked Freud not to think of Carl "with a father's feeling: 'He will grow, but I must dwindle.'" (letter to Freud, Nov 14, 1911, The Freud/Jung Letters). Testimony ledger updated to 6 qualifying quotes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Evidence: stale source-audit ledger                           | fixed                  | Restamped via `scripts/blog-source-audit.mjs`: 8 load-bearing slots — 6 inline, 0 vague, 2 untagged (both untagged slots are the grader-accepted ones: the [28:54] rider with Freeman named in-sentence, and the PROTECT-01-locked close quote with C.G. Jung Speaking named two sentences earlier).                                                                                                                                                                                                                                                                                                                                                                                                               |
| Writing: section-closer metronome                             | fixed                  | Shadow section now closes on the Nazi-era paragraph (quoted three-word ending), burying "kept his in the same place he kept the Red Book" mid-section. "alone, in writing, behind a lock" (PROTECT-06) and the Listener beat (PROTECT-03) untouched, per grader instruction to keep those.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Writing: legacy lineage block                                 | fixed                  | Split into three paragraphs (MBTI/Enneagram lineage; present-day #shadowwork/Peterson; Freeman sequel + excavation); Freeman-sequel sentence now breathes. Light trims ("driven by a viral workbook", "The lineage since…" topic sentence, "He noticed the theft…").                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Same-corpus imperative-pivot watch item                       | partial, by design     | One pivot cut ("Read that origin story plainly."). "Watch the behavior" (inside PROTECT-06) and "Start with" left; grader marked the device under threshold on this page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

Word budget: additions offset by removing two Rabbit Hole boilerplate cross-links (internal links 7→5, lint
warn cleared; sanctioned by the second-pass note "Trim a Rabbit Hole link if the editor pass disagrees") and
micro-trims. Body 4492/4500. TL;DR "live television" corrected to "on camera" (the interview was filmed March
1959, broadcast October — never live).

Exit checks: `blog-lint.sh Carl-Jung` → 0 fail / 2 warn (2 kept comparatives; word-ceiling headroom note);
`same-type-similarity.mjs Carl-Jung --n 8` → clear (max unit-pair 0.094 vs leonardo-da-vinci, stopword-run
overlap only, no shared phrases).

## Protected hits checked

- **PROTECT-01 (ending):** Houston-quote paragraph, final line, and closing paragraph verbatim. The legacy
  section upstream of the close was split/trimmed on the grader's explicit instruction ("split it and let the
  Freeman-sequel detail breathe") — the closing paragraph itself and its lead-in ("Which brings the question
  back around…") are untouched.
- **PROTECT-02 (falsifier):** verbatim, untouched.
- **PROTECT-03 (Jung No. 1/No. 2):** untouched, including the Listener beat.
- **PROTECT-04 (shadow concession):** verbatim, untouched; the Nazi-era paragraph was inserted after the
  mechanism paragraph so the concession's referents ("the pages above", "the two women") stay scoped to the
  private ledger.
- **PROTECT-05 (fortress-object chain):** untouched.
- **PROTECT-06 (Red Book unit incl. "alone, in writing, behind a lock"):** untouched — the metronome fix
  buried the unprotected shadow closer instead.
- **PROTECT-07 (attribution ceilings):** intact; every new fact/quote is pinned (Bally + NZZ + Feb 1934;
  Scholem's account; Freud/Jung Letters + Nov 14, 1911; BBC 1959 transcript timestamps).
- **PROTECT-08 (absolute-date discipline):** intact; all new dates carry event anchors.
- **PROTECT-09 (cold open + rupture-document framing):** framing sentences and cold open verbatim. One
  adjacent non-named sentence removed ("Read that origin story plainly.") for the grader's saturation watch
  item + word budget; "a fact about structure instead of a fact about betrayal" and its paragraph logic
  survive intact.
- **Carried check (inner-thought social card):** no code touched; prior verification stands.

## Unresolved decisions

- **DJ veto on the Nazi-era paragraph (needs_human, non-blocking):** synthesis Conflicts item 6 deferred any
  scope revision "for the entity-gap process and DJ"; the grader subsequently capped Originality for the
  omission and the packet's own text permits careful named sourcing, so this pass added the paragraph rather
  than leave the cap standing. If DJ prefers the omission, delete the single paragraph beginning "The harder
  page of the record is public." and accept the Originality cap (grade ceiling ~8.6 B+).
- **Grader sidecar misattribution (for grader recalibration):** "to find my own bearings" is BBC 1959, not
  Houston 1957. The re-grade should not re-flag the BBC tag as wrong.
