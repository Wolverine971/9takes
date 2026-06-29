<!-- docs/content-analysis/revision-tasks/sean-evans/writer-revision-brief.md -->

# Writer Revision Brief — Sean Evans blog

**Phase:** 2 (run AFTER all five research briefs are complete). **SERIAL — one agent, one
session. This task edits the article.**
**Recommended agent:** editor (depth: developmental-light / targeted, not a full rewrite).

## Target file

`/Users/djwayne/9takes/src/blog/people/drafts/Sean-Evans.md`

A Type 6 / 6w5 analysis of Hot Ones host Sean Evans. Currently graded 9.1 / A. Your job is
to make it tighter AND more complete at roughly the same length. This is surgery, not a redo.

## Inputs

- The `READER FRESH-EYES REVIEW` HTML comment block at the bottom of the article = your spec.
- The five research briefs (research-1 … research-5) = your sourced raw material. Use their
  facts and citations; do not invent beyond them. If a research brief said "Ship: NO" (e.g.
  health beat), skip that addition.

## Global guardrails (do not violate)

- **Never modify the `lastmod` frontmatter field.**
- **No em-dashes** in any added prose. Commas, periods, or restructure.
- **YAML safety:** this draft is in the build. After any frontmatter change, re-read the
  frontmatter and confirm it's valid (balanced quotes, no `\'`). A broken draft fails deploy.
- **Net-neutral word count:** the additions in Pass A are paid for by the trims in Pass B.
  Check length before and after; don't let it grow meaningfully.
- **Preserve voice.** Match the existing cadence. No new AI tells (see 9takes editorial
  standards / deai rules). The piece already passes the bar; keep it there.
- Keep new citations in the `citations:` frontmatter list if you add sourced claims that
  warrant it.

## Do the passes IN ORDER. Don't skip ahead.

### Pass A — Additions (sourced, woven into existing sections; no new H2 unless needed)

1. **Paul Rudd counter-example** (from research-1). Add to "What Hot Ones did to the celebrity
   interview." Frame: Rudd is the guest who is _in on the structure with Evans_ rather than
   dissolving under it — the exception that proves the thesis. Sits naturally near the existing
   Keke Palmer "makes Evans part of the bit" beat. ~2–4 sentences.
2. **The rituals paragraph** (from research-2). One tight paragraph that honors Da Bomb (wing 8),
   the wing of shame, and Explain That Gram — and frames **The Last Dab as counterphobic 6**:
   choosing extra suffering on purpose to prove it can't take him. This is the highest-value
   add; make the Type 6 point land. Likely fits in "What Hot Ones did..." or near the wing-eating
   paragraph.
3. **The scripted intro** (from research-3). Quote the verbatim opening line as _proof_ of the
   existing "the voice is the voice, the posture is the posture" point (last big section). The
   identical-every-episode open = the 6 narrowing to a known quantity. ~1–2 sentences.
4. **Arrows paragraph** (no research needed — Enneagram theory). Add one paragraph naming the
   Type 6 lines: disintegration to 3 (competitive, image-managing — touchable via the buy-side
   acquisition) and integration to 9 (calm, settled — his on-camera stillness reads almost 9-ish).
   Best home: the diagnosis area ("Why Sean Evans gets nervous...") or as a short beat after the
   acquisition section. Keep it concrete to Evans, not a theory lecture (respect the existing
   DISTRIBUTION LEDGER rule about consecutive system-level sentences).
5. **Health beat (CONDITIONAL)** — only if research-4 returned "Ship: YES" with a real quote.
   One human sentence near the existing Pavlovian line. If research said NO, skip entirely.

### Pass B — Trims (this is how you pay for Pass A)

1. **"In the mud"** appears 3x (opening quote, diagnosis section, ending). Keep the opening
   quote and one callback; cut the third so it stays a motif, not a tic.
2. **Fight Club / "building's going to give way"** appears 3x (TL;DR, prep section, dedicated
   Variety-anniversary paragraph). Keep the dedicated paragraph (strongest), trim one earlier echo.
3. **Mother's "support / be that for others" quote** appears nearly verbatim twice (pull-quote in
   the signature section + the closing). Pick the stronger placement; don't quote it twice.

### Pass C — Consistency

1. **Birthplace** (from research-5): make frontmatter `birth_place` and the body agree. Validate
   YAML after the frontmatter edit.
2. Re-scan **TL;DR, FAQs, and the testimony/heading ledgers** for anything Pass A/B made stale or
   contradictory. Update the FAQ answers if a fact changed. Keep ledgers honest if you rely on them.

### Pass D — Polish + regrade

1. Light cohesion + de-AI pass over only the changed paragraphs (don't re-edit untouched prose).
2. Confirm: no em-dashes added, lastmod untouched, length net-neutral, YAML valid.
3. Re-grade against the 9takes quality bar and update the `content_quality` block + `graded_at`.
   The target is to hold or beat 9.1 while closing the fan-gap.
4. Update the `READER FRESH-EYES REVIEW` comment (or add a short EDIT PASS LEDGER entry) noting
   what was added/trimmed/fixed, so the change history stays legible.

## Definition of done

- Paul Rudd, the rituals (with Last Dab framed as counterphobic), the scripted intro, and the
  arrows are all in — sourced where they need sourcing.
- The three repetitions are trimmed; word count is roughly flat.
- Frontmatter and body agree on birthplace; YAML validates.
- Voice intact, no em-dashes, lastmod untouched, regrade recorded.
