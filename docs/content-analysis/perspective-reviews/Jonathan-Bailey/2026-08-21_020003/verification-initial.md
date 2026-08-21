---
artifact: perspective-verification
schema_version: 1
subject: Jonathan-Bailey
draft_sha256: beb6dbab3931eb2eca2ae3242527924b6765faf2eaa98da1c7a48c0e5464c907
final_content_sha256: 0ffa2b30496173fbabae371e22569ee1f531ba50bb676961f51729b55d95051f
verification_status: fail
open_p0: 1
protected_hit_regressions: 0
verified_at: 2026-08-21T07:44:06Z
path: docs/content-analysis/perspective-reviews/Jonathan-Bailey/2026-08-21_020003/verification-initial.md
---

## Verification verdict

Snapshot chain verified. `synthesis.md` and `editor-resolution.md` both carry
`draft_sha256: beb6dbab…64c907`, matching the supplied SHA, and the frozen `draft-reviewed.md` hashes
to `192d9313…ea667d`, matching `context.json`'s `reader_visible_content_sha256`. The current live draft
at `src/blog/people/drafts/Jonathan-Bailey.md` hashes to `0ffa2b30…d95051f`.

Eight of nine P0s are resolved and independently verified — two of them against live primary sources
rather than the packet. All twelve `PROTECT-*` items survive by exact string match, including the two
the synthesis singled out as most at risk. All ten accepted P1s, both accepted P2s and all three RQs
are completed or defaulted as the resolution log claims; I found no overstatement in that log.

The gate fails on one item, and it is not an editor failure. Between the freeze and now, the enrichment
stage added a five-entry `faqs` block to the frontmatter. That block is reader-visible on this path —
`src/routes/personality-analysis/[slug]/+page.svelte:618` renders `FAQSection` when `faqs.length >= 2`,
`PeopleBlogPageHead.svelte:104` emits FAQPage JSON-LD from the same array, and
`getReaderVisiblePerspectiveBody` counts `faqs` inside the hashed body. The FAQ answers were written
after the jury froze the draft, so they were never reviewed, and one of them reproduces the exact
construction P0-08 was raised to remove. Every other FAQ answer is consistent with its repaired section.

Two other observations, neither gating, are in **Remaining work**.

## P0 resolution check

**P0-01 — Time Out review structure — resolved.** I fetched
`timeout.com/london/theatre/richard-ii-10-review` live (HTTP 200). The review opens "The first new Bridge
Theatre production in over two years is a bit like excitedly running off to meet an old friend you
haven't seen in ages and then finding the conversation is… okay but a bit stilted," and the Bailey clause
is the second half of a compound sentence shared with Hytner in the next paragraph. Rating: 3 out of 5.
The draft now reads "Time Out's Andrzej Lukowski, who found the evening as a whole 'okay but a bit
stilted,' granted in passing that 'Jonathan Bailey is a great stage actor,' gave the production three
stars, and still found that…" — no sentence asserts where in the review a quotation appears, `opened
with` and `landed the knife` return zero hits, and the newly added "okay but a bit stilted" quotation is
verbatim from the source. Acceptance test passes.

**P0-02 — the H2 asserting the denied claim — resolved.** H2 #6 is now "Did Jonathan Bailey Quit Acting?
What the Time Off Was Actually For." Regex sweep of the comment-stripped body for `stopped acting for a
year`, `quietest year on record` and `The year of hiring`: zero hits each. The surviving "stop acting for
a bit next year" is inside the GQ quotation itself, introduced as "what he has since called 'an
unfortunate misquote.'" The correction paragraph now carries "Next year I'll be back," "I'll definitely
be back to work next year," and "I'm not taking the whole of 2026 off." TL;DR bullet de-asserted to "spent
his time off hiring charity staff"; the growth arrow to "spending his time off staffing a nonprofit"; the
closer to "Whatever else 2026 was, a good part of it went on… hiring." Reading the eight H2s alone cannot
produce the belief that he stopped acting for a year, and the query term "quit acting" is retained.
Source trail for the three added quotations: `subject.md:264-265`, from a documented WebFetch of
`eonline.com/news/1424863` reproducing Esquire UK, 9 Nov 2025 — outside the packet, but recorded.

**P0-03 — the epigraph — resolved, verified against the primary.** RQ-02's Wayback capture resolves
(`web.archive.org/web/20260629021441/…`, HTTP 200). The source passage reads: "One thing that we're all
born with is the sense of longing. Longing comes before anything else, doesn't it? Whoever you put on the
wall, laminate the poster or whatever, it's there. And actually, if you long for someone, more often than
not you don't think you are worthy of it. And that, to me, is a way into characters." Placed beside the
draft's epigraph: exactly one omission (the laminated-poster sentence), marked with an ellipsis; no
capitalisation altered — lowercase "if" is restored inside the sentence; the "way into characters" frame
is present; attribution corrected to "Jonathan Bailey to Phoebe Waller-Bridge, Interview magazine, 2024"
against an article dated 29 January 2024. The Richard II section's duplicate re-quote of "longing comes
before anything else" is gone, rewritten to prose. The FORMULA FINGERPRINT ledger's verbatim claim now
describes the marked compression and names the capture, so the contrast-pair waiver no longer rests on
false grounds. Acceptance test passes on every clause.

**P0-04 — the 1p stat — resolved.** Label now reads "of every £100 raised in the UK reaches the LGBTQ+
community, one hundredth of one percent, by Bailey's own count (British GQ, 2025)." 1p in £100 is 0.01%,
so the plain-English magnitude inside the label is correct and a US reader reading only the stat block
lands on the right order of magnitude. The body names the contradicting published figure — "LGBT+
Consortium research by Dr Cat Walker, March 2025, puts LGBT+ organisations at 10p in every £100 of
voluntary-sector income. Different denominator, so not a refutation." — which matches packet `[S-22]`
(line 707). PROTECT-08's hedge sentence is intact and extended, not replaced; the stat block survives.

**P0-05 — `Confidence: high` resting on two closeting episodes — resolved.** The confound is now named
before the exhibits: "Two of the three happened while he was hiding, and being closeted does most of that
work on anybody, whatever their type." A third, no-threat exhibit was added — "The third has no closet in
it. At thirty-seven, safe and decorated, he talked himself out of a backflip he can still land" — cited in
the diagnosis while §Thirty-seven still stages it in full, so the backflip was cited and not moved. The
unsourced population claim `Threes reliably report exactly this` returns zero hits. Running the acceptance
test literally: delete the ballet and Tupperware paragraphs and what remains is the confound sentence, the
backflip exhibit, and the direction paragraph arguing that he turned the reading on himself rather than
arguing with it or seeking a better room — which is type-discriminating evidence the closet does not
explain. That supports "Confidence on the core type: high."

**P0-06 — presupposed concealed partner — resolved.** I enumerated every reader-visible sentence touching
his romantic life, frontmatter included. Cold open: "who he loves, or whether there is anyone to name."
H2 #4: "Is Jonathan Bailey Dating Anyone? What He Will and Will Not Say" — asserts nothing. Section close:
"the fact of who it is for, if it is for anyone." Body: "not publicly established," both data points
reported, the 2019 name still unprinted. FAQ #1: "a private life he fences," an object, not a person.
FAQ #2 opens "It is not publicly established." Every one of them is still true if he is single. `who he
loves.` and `who it is actually for` return zero hits in the reader-visible body.

**P0-07 — invented interior monologue — resolved.** The block now reads "He is watching this. This isn't
the right thing I should be doing. I did not know that until now." Clause one maps to "clocking his eyes
across the room"; clause two is his own verbatim phrasing from the CBS quotation three lines above; clause
three maps to "it was that one moment in me that I went, oh" and "I just suddenly became aware." No clause
asserts he agreed with a judgement about how he looked — `He is right about what I look like` returns zero
hits. Exactly one `inner-thought` block remains in the reader-visible body (count: 1), so PROTECT-11 holds.

**P0-08 — comedy punchline presented as a co-equal statement — UNRESOLVED.** The mandated body repair
landed and is correct. The dating section now reads:

> In July 2025, closing out an episode of _Chicken Shop Date_, the deadpan comic interview series where
> flirting with the guest is the running bit, he told Amelia Dimoldenberg he was available.

That paragraph passes the acceptance test. But the acceptance test applies to the current reader-visible
draft, and the post-freeze `faqs` block reproduces the defect verbatim in a second reader-visible surface.
FAQ #2, rendered by `FAQSection` and emitted as FAQPage JSON-LD:

> In December 2023 he told the Evening Standard he was seeing a lovely man and declined to name him; in
> July 2025, on Chicken Shop Date, he told Amelia Dimoldenberg he was available. Neither statement has
> been reconciled…

This is exactly the equation the unfamiliar reviewer's unaided read produced a false conclusion from: a
stranger reading only this answer — the likely case, since FAQ answers are extracted into rich results and
read standalone — cannot state which of the two statements was made in a comedy bit, and comes away
believing Bailey publicly contradicted himself about his private life. The packet's own annotation on
`[S-03]` ("Comic format; punchline register"; "**What it cannot support:** any reconciliation") governs
this sentence as much as the body one.

_Minimum remaining action:_ add the register to the FAQ #2 answer in the same clause that cites it —
`in July 2025, on the deadpan comic interview series Chicken Shop Date, he told Amelia Dimoldenberg he was
available`. Six words, frontmatter only, no body change, and it does not touch the non-adjudication.

**P0-09 — a named living woman's withdrawal as scoreboard — resolved.** Both flagged constructions return
zero hits (`stepped back from visibility and the other`, `it is the reason he can still stand`). The
paragraph now closes: "The two of them spent the same year being looked at more than almost anyone alive,
on the same press tour, for the same film. The production lost its Dot to that scrutiny. As of August 2026
it is still scheduled, and Bailey is still Georges." That is the synthesis's own prescribed wording — the
coincidence observed without ranking. Read as if Grande's team will read it: nothing requires her
withdrawal to be a lesser choice, no causal credit is claimed for Bailey's fence, and the section's
argument holds for a reader who knows nothing about why she withdrew. PROTECT-09's bookend and the _Sunday
in the Park_ synopsis line are intact.

## Accepted improvements check

All ten accepted P1s and both landed P2s completed. Verified by diffing the comment-stripped reader-visible
body against `draft-reviewed.md` paragraph by paragraph; every change maps to a synthesis item or to a
stated redundancy trim, and no change is unaccounted for.

- **P1-01** completed. Anthology concession added ("it hands each season to a different sibling, and the
  fourth is Benedict's. Nothing required him to fill the gap."); `the argument in miniature` is gone.
- **P1-02** completed. Causal clause cut, venue corrected to "a viral NYT Cooking video," date anchored to
  "In November 2025," direction of the speculation and the backlash both named. PROTECT-01 untouched.
- **P1-03** completed. Falsifier is now fireable ("find a pattern of him walking away from work he
  committed to…"), the over-enrolment datum is placed relative to its scope with the disagreement
  conceded, and "Neither is in the public record" is softened to "Neither turned up in the reporting behind
  this piece." The Open University reveal is still spent once, in the close.
- **P1-04** completed. "never once minded" → "had never been hyper aware of it" (matches the CBS
  transcript's "wasn't hyper aware of the fact"); "there is nobody left to clap" → "for a room that is
  already reaching for its coats," corrected _to_ PROTECT-06, not the reverse.
- **P1-05** completed. All seven markers dated: "He turned thirty-eight in 2026," "Since June 2026," "In
  November 2025," "in January 2026 and returned that February," "She was ninety-five when he last told
  it," "he is due back," "on screen in 2026." Prompt-book age headings untouched.
- **P1-06** completed. H2 #7 is a noun phrase; the status is date-stamped "As of August 2026"; `The show
opens as planned` returns zero hits. Search-intent + hybrid H2 count re-counted after all three retitles:
  still 6 of 8.
- **P1-07** completed. `What settles it is the speed` returns zero hits; replaced by "What points to a Three
  is the direction he moved at thirteen," with the recognition separated from the edit and "He dropped the
  dance and kept the acting and the singing" restored.
- **P1-08** completed. The grief objection is named in the text, appended as a new paragraph _after_ the
  protected sentence, which survives verbatim and uninterrupted. The _Fellow Travelers_ autobiography
  reading is softened ("He took the part of a man who cannot name what he feels").
- **P1-09** completed. All three prompt-book cue quotations carry outlet parentheticals — "(CBS Sunday
  Morning, 2024)", "(Attitude, 2020)", "(People, 2025)" — and the "not too gay" line is introduced as "in
  the same conversation." Cue form intact.
- **P1-10** completed. "He had made that choice a year earlier, at six, turning down _Oliver!_ to get
  there" reconciles the six/seven seam at the second mention.
- **P2-01** completed within the stated scope; the LOEWE claim was correctly held for RQ-01.
- **P2-08** completed. `He can do the thing.` and `and it is the same seam every time` both gone; two
  section endings now land flat.
- **RQ-01** deferred with the safe default; no unverified brand-origin claim reached the page.
- **RQ-02** resolved, not defaulted, and independently re-verified here against the capture.
- **RQ-03** resolved by default; no THR counter-reporting cited, no headline cited whose body was unread.

No repair introduced a factual assertion without a source trail. The three claims that are new to the
draft all trace: the LGBT+ Consortium 10p figure to packet `[S-22]`; the three Esquire correction quotes
to `subject.md:264-265` and its logged E! News fetch; the _Bridgerton_ anthology pattern to packet
`CLM-08` and the fan reviewer's verification. The MARTINI "recognised marketing structure" line is
descriptive rather than a sourced allegation, as the resolution log states, and the undisclosed sum is
reported as undisclosed.

## Protected-hit regression check

None. All twelve survive, verified by exact string match against the comment-stripped reader-visible body.

- **PROTECT-01** intact and unsoftened — "they have a point worth stating at full strength," the
  fragrance/Sexiest Man Alive escalation, and "because so far it has cost him nothing" all verbatim and in
  position. Three accepted repairs edited the paragraphs around it; the diff shows none entered it. Checked
  first and read whole, as the synthesis instructed.
- **PROTECT-02** intact — "Thirteen," "Thirty," "Thirty-seven," "Twenty-four years after the leotard" all
  unchanged. P1-05's dates went to news markers only.
- **PROTECT-03** intact — the four cold-open paragraphs are in order and in position, the identity
  paragraph is still delayed to fifth. The only change inside them is P1-04's mandated transcript
  correction.
- **PROTECT-04** intact — both critics' verbatim quotations, both three-star ratings, and Wolf's
  later-in-the-run hedge all present. Only the staging changed.
- **PROTECT-05** intact — "not publicly established," "the record is openly contradictory," "Neither has
  been reconciled," "private" rather than "secret" at word level, and the 2019 name still unprinted.
  Naming the _Chicken Shop Date_ register in the body did not adjudicate.
- **PROTECT-06** intact — "the parents were reaching for their coats" unchanged; the closer moved to it.
- **PROTECT-07** intact — the volcanoes close is entire, "Nobody is going to photograph that." is the last
  line, and the Open University reveal is spent once there. The Rabbit Hole refers only to "signs up for
  things compulsively"; the second `Open University` hit is the pre-existing TL;DR bullet, unchanged from
  the frozen draft.
- **PROTECT-08** intact — "The figure is his own count rather than a verified statistic" present, stat
  block present, hedge extended rather than replaced.
- **PROTECT-09** intact — RSC at the Barbican as a child → Georges at the Barbican, and the _Sunday in the
  Park_ synopsis line. P1-10 strengthened the bookend; P0-09 cut only the comparison.
- **PROTECT-10** intact — one Rabbit Hole, its skip-permission label verbatim, and type-theory paragraphs
  outside diagnosis and Rabbit Hole still number 2 (dating section, Richard II section). P0-05's addition
  landed inside the diagnosis; P1-08's added paragraph is a performance-mechanism concession carrying no
  type vocabulary, so the ratio holds.
- **PROTECT-11** intact — exactly one `inner-thought` block, count verified. Content repaired, none added.
- **PROTECT-12** intact — the falsifier still exists as a published accountability offer, and "This is the
  least certain call in the analysis" with the conceded 3w4 case is unchanged.
- **Runner-up, checked last:** "Charm is a transaction with a room. Sorrow is not, and neither is love,
  which is the same border he polices offstage" and "the toolkit is not in doubt, the arrival time is" are
  both present, verbatim, in the same order and paragraph positions. P1-08's concession was appended as a
  separate paragraph after the claim, never inside it.

## Remaining work

1. **P0-08, FAQ #2 (blocking).** Add the comic register to the _Chicken Shop Date_ citation in the
   frontmatter FAQ answer, matching the body repair. One clause. This is the only open gate item.
2. **FAQ #1 evidence mix (non-blocking, worth one look).** The type-answer lists four exhibits, two of
   which are the closeting episodes P0-05 flagged as confounded, and it carries `Confidence on the core
type is high` without the confound sentence the body now has. It also carries the backflip and the
   fence, so it does not fail P0-05's section-scoped acceptance test — but if FAQ #2 is being edited
   anyway, this is the cheapest place to keep the two surfaces saying the same thing.
3. **`The bee sting in *Bridgerton*. A father dying in a garden.` (non-blocking).** Introduced by P1-08 as
   two items in a three-item list. Both scenes are real and distinct, but Edmund Bridgerton's death _is_ a
   bee sting in a garden, so a _Bridgerton_ viewer may read the list as counting one event twice — the
   precise class of reader the fan perspective represents. A one-word disambiguation ("Anthony's bee
   sting") would settle it.
4. **Stale editorial note (cosmetic).** The `EDITOR PASS NOTES` block and the `SECOND PASS NOTES` block
   both still list "No faqs in frontmatter — the enrich stage has not run" as open. The enrich stage has
   since run; five FAQs are present. Comment-only, outside the hash, no gate effect.
