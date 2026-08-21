---
artifact: perspective-verification
schema_version: 1
subject: Jonathan-Bailey
draft_sha256: beb6dbab3931eb2eca2ae3242527924b6765faf2eaa98da1c7a48c0e5464c907
final_content_sha256: a43812a3bf13872b8c6cdd5d28a974d970ec582162ffd7cb38d1800842e6ed5f
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-21T08:11:10Z
path: docs/content-analysis/perspective-reviews/Jonathan-Bailey/2026-08-21_020003/verification-final.md
---

## Verification verdict

Snapshot chain verified. `synthesis.md`, `editor-resolution.md`, `revision-resolution.md` and
`verification-initial.md` all carry `draft_sha256: beb6dbab…64c907`, matching the supplied SHA. The
frozen `draft-reviewed.md` hashes to `beb6dbab…64c907` as a file and to `192d9313…ea667d` on the
reader-visible body, matching `context.json`. The current live draft at
`src/blog/people/drafts/Jonathan-Bailey.md` hashes to `a43812a3…6ed5f`, moved from `0ffa2b30…d95051f`
by the targeted revision pass.

This is the second verification of this cycle. `verification-initial.md` failed the gate on one item —
P0-08 reproduced on the post-freeze `faqs` surface — and logged three non-gating observations. All four
are now repaired. **P0-08 is resolved on both reader-visible surfaces**, and the repair is the minimum
action that artifact named, applied to frontmatter only, with no body change and no adjudication added.

I re-ran the full sweep rather than trusting the delta, because the revision pass also consumed the
grader sidecar (C, 7.7) and made edits outside the four items it was sent to fix — a section reorder, a
word-count trim, seven outbound links, and one quotation correction. **Thirty-five distinct protected
strings were asserted against the comment-stripped reader-visible body; all thirty-five are present.**
Twenty zero-hit sweeps for constructions the synthesis ordered removed all return zero. The four
structural counts hold (one `inner-thought`, one Rabbit Hole, one `key-stat`, and the two-type-theory-
paragraph ratio, which is 2 in the frozen draft and 2 now). All nine P0s, all ten accepted P1s, both
landed P2s and all three RQs stand.

Two claims in `revision-resolution.md` needed independent checking rather than acceptance, and one of
them does not hold as written. Both are in **Remaining work**; neither gates.

## P0 resolution check

**P0-01 — Time Out review structure — resolved, unchanged.** `opened with` and `landed the knife` still
return zero hits. The rebuilt staging sentence and both critic quotations are byte-identical to the
state verified against the live source in `verification-initial.md`; the revision pass wrapped an
outbound link around the Lukowski attribution and altered no word. FAQ #5, which covers the same
material, asserts nothing about where in either review a quotation appears.

**P0-02 — H2 asserting the denied claim — resolved, unchanged.** H2 #6 is still "Did Jonathan Bailey
Quit Acting? What the Time Off Was Actually For." `stopped acting for a year`, `quietest year on record`
and `The year of hiring` all return zero hits — the third is worth noting, because the revision pass
rewrote the Barbican section's opening line, which in the frozen draft was "The year of hiring has a
date at the far end of it." The replacement carries no reassertion. All three Esquire correction
quotations survive. FAQ #3 opens "No." and reproduces the correction.

**P0-03 — the epigraph — resolved, unchanged.** The rebuilt epigraph, its single marked ellipsis, the
restored "way into characters" frame and the corrected Waller-Bridge attribution are all intact.

**P0-04 — the 1p stat — resolved, unchanged.** `one hundredth of one percent` present in the label, the
LGBT+ Consortium sentence present and now carrying an outbound link to `consortium.lgbt` that is in
`citations`, and "Different denominator, so not a refutation" unchanged.

**P0-05 — `Confidence: high` resting on two closeting episodes — resolved, and now consistent across
both surfaces.** The body confound sentence is verbatim: "Two of the three happened while he was hiding,
and being closeted does most of that work on anybody, whatever their type." The no-threat third exhibit
is still cited in the diagnosis and still staged in full in §Thirty-seven. `Threes reliably report
exactly this` returns zero hits. FAQ #1, which `verification-initial.md` flagged as listing the
confounded exhibits without the confound, now carries it: "Two of those happened while he was closeted,
which does much of that work on anybody; the backflip has no closet in it, and that is the one that
carries the type." The two surfaces now make the same argument in the same order.

**P0-06 — presupposed concealed partner — resolved, unchanged.** `who he loves.` and `who it is actually
for` both return zero hits. The cold open ("or whether there is anyone to name"), H2 #4, the section
close ("if it is for anyone"), FAQ #1 ("a private life he fences") and FAQ #2 ("It is not publicly
established") are all still true if he is single.

**P0-07 — invented interior monologue — resolved, unchanged.** `He is right about what I look like`
returns zero hits; the repaired block is byte-identical and the `inner-thought` count is still 1.

**P0-08 — comedy punchline presented as a co-equal statement — RESOLVED on both surfaces.** This was the
only open gate item. The body repair is unchanged:

> In July 2025, closing out an episode of _Chicken Shop Date_, the deadpan comic interview series where
> flirting with the guest is the running bit, he told Amelia Dimoldenberg he was available.

FAQ #2 now reads:

> …in July 2025, on the deadpan comic interview series Chicken Shop Date, he told Amelia Dimoldenberg he
> was available. Neither statement has been reconciled…

Applying the synthesis's acceptance test — "a reader with no knowledge of British YouTube can state,
after reading the paragraph, which of the two statements was made in a comedy bit" — to each surface
independently: both pass. A stranger who meets FAQ #2 standalone in a rich result now has the register
in the same clause as the citation, which is the repair form the synthesis specified ("introduce the
format in the same clause that cites it").

The synthesis's **at-risk** note on this item was that the repair must not slide into adjudicating.
It did not. The body still carries "Both statements are on the record. Neither has been reconciled," the
FAQ still resolves nothing, and neither surface prints the 2019 name. `[S-03]`'s prohibition — "**What
it cannot support:** any reconciliation" — is honoured on both.

**P0-09 — a named living woman's withdrawal as scoreboard — resolved, through a reorder I checked
closely.** Both flagged constructions return zero hits (`stepped back from visibility and the other`,
`it is the reason he can still stand`), and the frozen draft's "Then his co-star withdrew" lead-in is
also gone. The synthesis's prescribed wording survives byte-identical and moved as a block:

> The two of them spent the same year being looked at more than almost anyone alive, on the same press
> tour, for the same film. The production lost its Dot to that scrutiny. As of August 2026 it is still
> scheduled, and Bailey is still Georges.

The revision pass inverted the section: the withdrawal reportage now opens it and the Barbican bookend
resolves it, where the frozen draft had the bookend first and the comparison last. That is a larger move
than the synthesis's "do not restructure" instruction anticipated, so I applied the acceptance test to
the new arrangement rather than to the sentence in isolation. Both operative clauses pass. Nothing
requires Grande's withdrawal to be a lesser choice: the ranking clause is gone, the causal credit to
Bailey's fence is gone, and what remains observes a coincidence. And the section's closing argument now
holds _more_ cleanly for a reader who knows nothing about why she withdrew, because the closing argument
is the RSC-at-seven → Georges-at-thirty-nine bookend rather than the comparison. Her representative's
statement is quoted at full length, including the Eternal Sunshine tour timing, and matches packet
`[S-22]`/`[S-13]` context verbatim. RQ-03's default holds — no THR counter-reporting is cited.

One consequence of the reorder is not covered by the acceptance test and is in **Remaining work**.

## Accepted improvements check

All ten accepted P1s and both landed P2s remain completed; the revision pass regressed none of them, and
where it rewrote a P1 repair it preserved that P1's acceptance test.

- **P1-01** completed. Anthology concession intact; `the argument in miniature` zero hits.
- **P1-02** completed. "In November 2025, after a viral NYT Cooking video…" and the backlash sentence
  both intact.
- **P1-03** completed. Fireable falsifier intact, over-enrolment scope conceded, "Neither turned up in
  the reporting behind this piece" intact (`Neither is in the public record` zero hits).
- **P1-04** completed. "had never been hyper aware of it" and "for a room that is already reaching for
  its coats" both intact; `never once minded` and `there is nobody left to clap` both zero.
- **P1-05** completed. All seven absolute markers survive the pass, including "he is due back," which the
  revision pass rewrote from the frozen "he returns" while keeping the anchor.
- **P1-06** completed. H2 #7 is still a noun phrase, "As of August 2026" survives the reorder, and `The
show opens as planned` returns zero hits — the frozen draft's version of that sentence was removed by
  the reorder and not reinstated.
- **P1-07** completed, via a second rewrite that holds. The revision pass replaced the editor pass's
  "What points to a Three is the direction he moved at thirteen" with "The Three shows in what he did
  next," on a cross-draft similarity trip against `alexandr-wang`. Re-running P1-07's acceptance test
  against the new wording: there is no "it" needing an antecedent, `What settles it` and `amputated
inside a second` both return zero hits so no sentence claims he quit within a second, "The recognition
  was instant, by his own account; the edit was partial" keeps recognition and decision distinct, and
  "He dropped the dance and kept the acting and the singing" states that he continued performing. Passes
  on all three clauses, and the at-risk condition holds — no forward reference to the Rabbit Hole was
  reintroduced.
- **P1-08** completed, and the observation from `verification-initial.md` is repaired. The list now reads
  "Anthony's panic in _Bridgerton_ when Kate is stung by a bee. His father dying in a garden years before
  that." Two distinct scenes, the causal relation between them visible, and a _Bridgerton_ viewer can no
  longer read the three-item list as counting Edmund's death twice. The concession is still a separate
  paragraph _after_ the protected sentence, and `played the Tupperware box` returns zero hits.
- **P1-09** completed. All three prompt-book parentheticals intact; "in the same conversation" intact.
- **P1-10** completed. The six/seven seam reconciliation survived the Barbican reorder verbatim.
- **P2-01 / P2-08** completed. `He can do the thing.` and `and it is the same seam every time` both zero.
- **RQ-01** still deferred with the safe default; no brand-origin claim reached the page. **RQ-02**
  resolved. **RQ-03** resolved by default.

**New factual assertions introduced by this pass.** Seven outbound links were added to existing prose
attributions; all seven resolve to URLs already present in `citations`, and none changed a word of the
sentence it wraps. Three outlet parentheticals were added inside the Rabbit Hole — "a dull ache" (E!
News, 2025), "completely absurd" (People, 2025), "a deep spike of fear and self-doubt" (People, 2025).
All three trace: the first to the research file's §2.9 (E! News, 17 Nov 2025), the other two to packet
`[S-02]` and its local transcript. Grande's representative's quotations and Empire Street's statement
match packet `[S-22]`/`[S-13]` verbatim.

One assertion was new and unsupported by the packet, so I checked it directly. The revision pass
re-attributed "five going on 29" to the Interview magazine conversation ("In the same conversation…"),
a quote the log itself concedes was untagged and absent from the research file's inventory. **The
attribution is correct** — two independent reproductions of the Waller-Bridge interview carry the line
in the same passage as the raindrop. The rendering is a separate matter; see **Remaining work**.

## Protected-hit regression check

None. All twelve `PROTECT-*` items and the runner-up survive, verified by exact string match against the
comment-stripped reader-visible body — 35 assertions, 35 present.

- **PROTECT-01** intact, checked first and read whole as the synthesis instructed. "they have a point
  worth stating at full strength," the romantic-lead / fragrance-ambassador / Sexiest Man Alive
  escalation and "because so far it has cost him nothing" are all verbatim and in position. This pass
  edited a paragraph above it (the FAQ has no body effect) and a paragraph below it; neither entered it.
- **PROTECT-02** intact. All four prompt-book headings and "Twenty-four years after the leotard"
  unchanged. §Thirty-seven still stages the backflip in full, which P0-05 depends on.
- **PROTECT-03** intact. Four cold-open paragraphs in order and in position, identity paragraph still
  delayed to fifth. The only change is an outbound link wrapped around the existing CBS attribution.
- **PROTECT-04** intact. Both verbatim critic quotations, both three-star ratings and Wolf's
  later-in-the-run hedge present.
- **PROTECT-05** intact and byte-identical, including the two clauses the revision log says a word-count
  trim briefly cut and then reverted: "Both statements are on the record." and "Neither has been
  reconciled" are both present in exactly those forms. `"private" rather than "secret."` holds at word
  level, "not publicly established, and the record is openly contradictory" holds, and the 2019 name is
  still unprinted. Naming the comic register on the FAQ surface did not adjudicate.
- **PROTECT-06** intact. "the parents were reaching for their coats" unchanged, and the closer still
  lands on it.
- **PROTECT-07** intact. The volcanoes paragraph is byte-identical to the frozen draft, "Nobody is going
  to photograph that." is still the last line of the body, and the Open University reveal is still spent
  once there. The second `Open University` hit is the TL;DR bullet, which carries it in the frozen draft
  too — pre-existing, not a regression. The Rabbit Hole refers only to "signs up for things
  compulsively," so the reveal is not pre-deflated.
- **PROTECT-08** intact. "The figure is his own count rather than a verified statistic" present, one
  `key-stat` block present, hedge extended rather than replaced.
- **PROTECT-09** intact through the reorder — the item worth reading closely, and I read it. The
  bookend survives ("The Barbican is where the Royal Shakespeare Company put him on a professional stage
  at seven, in _A Christmas Carol_") and so does the synopsis clause, verbatim: "a painter so absorbed in
  the work that the woman posing for it leaves him." Both now sit in the resolving position rather than
  the setup position. The surrounding verb moved from "he returns to sing" to "he is due back to sing"
  (P1-05 date discipline) and a closing clause was appended; the protected text itself is untouched. The
  synthesis's instruction was "cut the comparison, not the bookend," and that is what happened.
- **PROTECT-10** intact. One Rabbit Hole, skip-permission label verbatim, and the type-theory paragraph
  ratio outside diagnosis and Rabbit Hole measured at 2 in the frozen draft and 2 now — the Barbican
  section still carries no type theory at all, and the reorder moved reportage only.
- **PROTECT-11** intact. Exactly one `inner-thought` block, count re-verified at 1; no second interior
  beat was invented for the sabbatical section.
- **PROTECT-12** intact. The falsifier still stands as a published accountability offer and "This is the
  least certain call in the analysis" with the conceded 3w4 case is unchanged; the 3w4 paragraph gained
  only an outlet parenthetical.
- **Runner-up, checked last.** "Charm is a transaction with a room. Sorrow is not, and neither is love,
  which is the same border he polices offstage" and "the toolkit is not in doubt, the arrival time is"
  are both verbatim, in the same paragraph positions, in the same order. The grader's request to make the
  second absorb the following beat was declined; declining it was correct.

## Remaining work

Nothing blocking. The gate is clear. Three items for a human, in priority order.

1. **`five going on 29` still does not match the source rendering (non-blocking, one character).** The
   revision pass corrected this quotation on the grounds that the frozen draft's "about five going on
   twenty-nine" was a house-style alteration inside quotation marks — the correct instinct, and the
   attribution it added is right. But it corrected the wrong half. The fullest reproduction of the
   Interview conversation reads: "I think I was **about 5 going on 29**." The draft now reads:

   > In the same conversation he described the boy who wept over it as "five going on 29."

   Dropping "about" is defensible, because the sentence quotes the phrase rather than his hedge. Spelling
   the 5 while leaving the 29 as a numeral is not — it matches neither the source nor house style, and it
   is still an alteration inside quotation marks, which is the defect class the jury found nine times.
   _Minimum action:_ render it `"5 going on 29"`. Worth noting for the record that the packet still does
   not carry this quote; if it is kept, it should be added with the reproduction named, since it now
   rests on a Tier 3 reproduction the way the epigraph rests on a Wayback capture.

2. **The Barbican reorder put the synopsis line downstream of Grande's withdrawal (non-blocking, worth a
   human read).** P0-09's acceptance test passes, and the protected content is intact, so this does not
   gate. But the reorder created an adjacency the test does not reach. Three paragraphs after the draft
   reports that "The production lost its Dot to that scrutiny," it closes the section on Sondheim's
   musical "about a painter so absorbed in the work that the woman posing for it leaves him, **which is
   either a very long joke at his expense or the most obvious casting of his career**." That trailing
   clause is new this pass, added to land the section mid-thought. In the frozen draft the synopsis
   preceded the withdrawal and had no real-world referent near it; now it follows a real woman leaving
   the production, and the draft has used the word "Dot" for her in between. The joke's stated target is
   Bailey, so this passes the letter of the test — but P0-09 exists because the section was borrowing
   from a named living woman's hardest week, and this is the same borrowing in a comic register.
   _Minimum action:_ either drop the appended clause, or restore the synopsis line ahead of the
   withdrawal reportage. This is an editorial judgement call, not a defect I can adjudicate.

3. **Evening Standard and British GQ remain prose-attributed with no outbound link (carried over,
   non-blocking).** The revision log records this and its reasoning, which I agree with: the packet has
   both at `[S-07]` tier 2/3 and `[S-23]` tier 2, recovered through consistent syndication only, and
   linking a Tier 3 aggregator in place of an unreached original is the failure the grader's evidence cap
   exists to punish. The empathy turn's two quotes are now traced in the sentence that carries them. No
   action required to ship; both attributions are ready to take links if a later pass reaches an original.
