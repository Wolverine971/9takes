---
artifact: perspective-revision-resolution
schema_version: 1
subject: Jonathan-Bailey
draft_sha256: beb6dbab3931eb2eca2ae3242527924b6765faf2eaa98da1c7a48c0e5464c907
resolution_status: complete
resolved_at: 2026-08-21T08:03:01Z
path: docs/content-analysis/perspective-reviews/Jonathan-Bailey/2026-08-21_020003/revision-resolution.md
---

Targeted revision pass against `verification-initial.md` (`verification_status: fail`,
`open_p0: 1`, `protected_hit_regressions: 0`). One gate item was open. It is repaired, together
with the three non-gating observations in that artifact's **Remaining work** section.

This pass also consumed the grader sidecar `docs/content-analysis/grades/Jonathan-Bailey.review.md`
(C, 7.7, capped on `evidence_untraceable_load_bearing` and `originality_cross_draft_sameness`).
Those edits are logged in the draft's `REVISION PASS NOTES` block, not here, except where they
touched a protected passage.

## Resolution log

**P0-08 — comedy punchline presented as a co-equal statement, FAQ #2 surface — `fixed`.**
The verifier accepted the body repair and failed the gate on the post-freeze `faqs` block, which
reproduced the defect on a second reader-visible surface (`FAQSection` at
`src/routes/personality-analysis/[slug]/+page.svelte:618`, plus FAQPage JSON-LD from
`PeopleBlogPageHead.svelte:104`). Applied the verifier's own minimum remaining action, verbatim in
substance, to the frontmatter only:

> …in July 2025, on the deadpan comic interview series Chicken Shop Date, he told Amelia
> Dimoldenberg he was available.

Acceptance test: a stranger reading only FAQ #2, extracted into a rich result and read standalone,
can now state which of the two statements was made in a comedy bit. No body text changed. The
non-adjudication is untouched — "Neither statement has been reconciled" still follows, still
resolves nothing, and still prints no name. `[S-03]`'s annotation ("Comic format; punchline
register"; "**What it cannot support:** any reconciliation") is now honoured on both surfaces.

**Remaining work 2 — FAQ #1 evidence mix — `fixed`.** The type answer listed four exhibits, two of
them the closeting episodes P0-05 flagged as confounded, and asserted `Confidence on the core type
is high` without the confound sentence the body carries. Inserted, in the same answer:

> Two of those happened while he was closeted, which does much of that work on anybody; the
> backflip has no closet in it, and that is the one that carries the type.

The two reader-visible surfaces now make the same argument in the same order. The body's own
confidence sentence was separately rewritten to drop a cross-draft template ("Confidence on the
core type: high." against Ms-Rachel's "Confidence on this call is high."); it retains the claim and
the wing hedge.

**Remaining work 3 — `The bee sting in *Bridgerton*. A father dying in a garden.` — `fixed`.**
Edmund Bridgerton's death _is_ a bee sting in a garden, so the three-item list could read as
counting one event twice. Now:

> Anthony's panic in _Bridgerton_ when Kate is stung by a bee. His father dying in a garden years
> before that.

Two distinct scenes, both real, and the causal relation between them is now visible rather than
collapsed. This paragraph is P1-08's added concession and sits _after_ the protected sentence, not
inside it; see the protected-hits section below.

**Remaining work 4 — stale editorial notes — `fixed`.** The `SECOND PASS NOTES` and `EDITOR PASS
NOTES` blocks both still listed "No faqs in frontmatter — the enrich stage has not run" as open.
Both now record the enrich stage as run, five FAQs present, and FAQ #1 and #2 repaired by this pass.
Comment-only, outside the hashed body, no gate effect either way.

## Protected hits checked

All twelve `PROTECT-*` items plus the runner-up were re-checked by exact string match against the
comment-stripped reader-visible body after every edit in this pass. **Zero regressions.** Thirty-one
distinct protected strings were asserted programmatically; all thirty-one are present.

- **PROTECT-01** — untouched. This pass edited two paragraphs in the same section (the _Chicken
  Shop Date_ register lives one paragraph above it in the FAQ, not the body; the empathy-turn
  attribution lives one paragraph below). "they have a point worth stating at full strength," the
  fragrance/Sexiest Man Alive escalation and "because so far it has cost him nothing" are all
  verbatim and in position.
- **PROTECT-02** — untouched. All four prompt-book headings and "Twenty-four years after the
  leotard" unchanged. The one edit inside a prompt-book entry cut a decorative clause about
  backflip physics from the _body_ of the §Thirty-seven entry; the cue, the quotation, the
  attribution and the closing sentence are unchanged.
- **PROTECT-03** — untouched. Cold-open paragraphs in order and in position. The only change is an
  outbound link wrapped around the existing "CBS Sunday Morning" attribution; no word altered.
- **PROTECT-04** — untouched. Both critics' verbatim quotations, both three-star ratings and Wolf's
  later-in-the-run hedge all present. Links were wrapped around the two critic attributions; the
  staging sentence P0-01 rebuilt is unchanged.
- **PROTECT-05** — untouched, and deliberately restored mid-pass. A word-count trim briefly cut
  "Both statements are on the record." and rephrased "Neither has been reconciled" to "Neither
  statement has been reconciled." Both were reverted on the grounds that the synthesis protects this
  passage "exactly as written" and the verifier checks that clause by exact string. The paragraph is
  now byte-identical to the verified state. "not publicly established," "the record is openly
  contradictory," "private" rather than "secret" at word level, and the unprinted 2019 name all
  hold. The headroom was taken from the backflip clause instead.
- **PROTECT-06** — untouched. "the parents were reaching for their coats" unchanged, and the closer
  still lands on it. The grader asked for this close to be replaced as a cross-draft echo; that was
  rejected precisely because P1-04 moved the closer _to_ this passage this cycle.
- **PROTECT-07** — untouched. The volcanoes close is entire, "Nobody is going to photograph that."
  is still the last line of the body, and the Open University reveal is still spent once there. One
  sentence in the same paragraph was shortened ("103 performances of _Richard II_" to "Shakespeare",
  removing a repeat from the Richard II section); it sits three paragraphs above the reveal and does
  not touch it.
- **PROTECT-08** — untouched. "The figure is his own count rather than a verified statistic" and the
  `key-stat` block both present, hedge intact. The LGBT+ Consortium sentence gained an outbound link
  to `consortium.lgbt`; the "Different denominator, so not a refutation" clause is unchanged.
- **PROTECT-09** — intact through a reorder, which is the one item worth reading closely. The
  Barbican section was restructured on grader item 6 (the shared-scrutiny argument was buried at the
  bottom of an otherwise flat section). The synthesis's prescribed P0-09 wording moved as a block
  and is byte-identical:

  > The two of them spent the same year being looked at more than almost anyone alive, on the same
  > press tour, for the same film. The production lost its Dot to that scrutiny. As of August 2026
  > it is still scheduled, and Bailey is still Georges.

  The withdrawal facts now precede it rather than follow it, so "The two of them" resolves to a
  named antecedent instead of a forward reference. Both flagged constructions still return zero
  hits. Grande's representative's statement is quoted at the same length as before, including the
  Eternal Sunshine tour timing — a shorter version was considered as a word-count trim and rejected,
  because compressing a named living woman's stated reasons is the exact fault P0-09 was raised
  against. Nothing in the new order requires her withdrawal to be a lesser choice, and the section's
  argument still holds for a reader who knows nothing about why she left. The RSC-at-the-Barbican to
  Georges-at-the-Barbican bookend and the _Sunday in the Park_ synopsis line both survive, now in
  the resolving position.

- **PROTECT-10** — untouched. Exactly one Rabbit Hole, skip-permission label verbatim, and
  type-theory paragraphs outside diagnosis and Rabbit Hole still number 2 (dating section, Richard
  II section). This pass added outlet parentheticals inside the Rabbit Hole and changed no argument.
- **PROTECT-11** — untouched. Exactly one `inner-thought` block, verbatim, count re-verified at 1.
  No second interior beat was invented while attributing the sabbatical section.
- **PROTECT-12** — untouched. The falsifier still stands as a published accountability offer, and
  "This is the least certain call in the analysis" with the conceded 3w4 case is unchanged. The 3w4
  paragraph gained one outlet parenthetical on "a dull ache" (E! News, 2025).
- **Runner-up, checked last** — "Charm is a transaction with a room. Sorrow is not, and neither is
  love, which is the same border he polices offstage" and "the toolkit is not in doubt, the arrival
  time is" are both verbatim, in the same paragraph positions, in the same order. The grader asked
  for the second one to absorb the following beat rather than land on the drop; declined, and logged
  in the draft, because it is a protected hit verified this cycle. The two closers the grader wanted
  were landed elsewhere.

## Unresolved decisions

None blocking. Two items are recorded for the verifier rather than left silent:

1. **The Evening Standard and British GQ are still prose-attributed with no outbound link.** The
   empathy turn's two quotes are now traced in the sentence that carries them, to the same December
   2023 Evening Standard interview that produced "a lovely man" and "private" rather than "secret" —
   which closes the grader's evidence cap on that passage. But `standard.co.uk` originals for the
   privacy interview and `gq-magazine.co.uk` originals for the hiatus and childhood quotes were not
   reached this pass; the packet records both as recovered through consistent syndication only
   (`[S-07]` tier 2/3, `[S-23]` tier 2). No syndicated reproduction was linked in their place,
   because linking a Tier 3 aggregator as if it were the source is the failure mode the cap exists
   to punish. If a later pass reaches either original, the two attributions are ready to take links.
2. **`about five going on twenty-nine` was corrected to `five going on 29`.** The quote was
   untagged and absent from the research file's inventory. It traces to the same Interview magazine
   conversation as the raindrop, confirmed this pass through a January 2024 reproduction that renders
   the numeral as "29"; the draft had spelled it out and prefixed "about." Both were house-style
   alterations inside quotation marks, which is the defect class the jury found nine times. Now
   attributed and rendered as reported. The primary (`interviewmagazine.com`) remains 403, so this
   rests on a reproduction, same as the epigraph does.

Per the command, this artifact does not declare the gate passed. `/blog_perspective_verify_people`
reruns against the current draft.
