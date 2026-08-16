---
artifact: perspective-verification
schema_version: 1
subject: Simone-Biles
draft_sha256: c562d27c5e2965cb7192e3151184b3ba1d279ac8014c2904144f51f129513eae
final_content_sha256: eb4f295fe1446eac981c4e78a65dc91fac70ed707acdebe210de68c05fd63b44
verification_status: needs_human
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-16T08:09:08Z
path: docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/verification-initial.md
---

<!-- docs/content-analysis/perspective-reviews/Simone-Biles/2026-08-16_020003/verification-initial.md -->

## Verification verdict

Provenance checks pass. `synthesis.md` carries `draft_sha256: c562d27c…9513eae`, identical to the
supplied snapshot SHA, and `context.json` carries the same value plus
`reader_visible_content_sha256: 866b01bd…9ee610c9`. Recomputing that hash over
`draft-reviewed.md` with `hashReaderVisiblePerspectiveBody` reproduces `866b01bd…` exactly, so the
frozen snapshot is the artifact the six seats reviewed. The current live draft hashes to
`eb4f295f…5fd63b44`. Only `editor-resolution.md` is present; there is no `revision-resolution.md`.

**All ten P0 repairs are resolved.** Each acceptance test was applied to the current text
independently of the editor's self-report, and each holds. **All nineteen `PROTECT-*` items
survive**, verified by fixed-string match, with the three amendments the synthesis itself authorised
(P1-18 on PROTECT-05's opening clause, P1-01 on PROTECT-07's "a vault she can land", P1-15 on
PROTECT-11's trailing tense). No protected insight was deleted to pay for a lower-priority
improvement. Eighteen of nineteen accepted P1s are completed; P1-13 is partial, with half (b)
deferred under a stated word-budget reason, which the synthesis's own Conflicts 7 anticipated.

Two independent checks on repair-introduced facts came back clean. The P1-05 distance correction is
right: the Tokyo–Spring, Texas great circle computes to 10,706 km, so "10,700 kilometres" is
accurate where "nine thousand kilometres" was not. And `scripts/blog-source-audit.mjs`, re-run
**after** the OUTLETS fix as the brief required, reports 8 load-bearing quotes, 8 inline, 0 vague,
0 untagged — every quote now resolves to a real, locatable outlet.

The verdict is `needs_human` rather than `pass` because two publication blockers survive the
revision, neither of which the verifier can close and neither of which is a P0 or a protected-hit
regression:

1. **`blog-lint.sh` FAILs on length.** Body is 4,842 words against the 4,500 ceiling. The editor
   escalated this rather than silently trimming a repair, which is the correct behaviour under
   Conflicts 7 — but it is a hard FAIL and it needs DJ's decision.
2. **A factual error inside PROTECT-05, confirmed by this pass.** The concession states that a
   teammate "was going home without a medal." The United States won team silver; every team member
   medalled. The article contradicts itself on this three paragraphs later. Details in Remaining
   work.

The numeric gate conditions (`open_p0: 0`, `protected_hit_regressions: 0`) are met, so the
deterministic gate's counts will read clean. The `needs_human` label records that a human decision
is still owed before this page can finalize.

## P0 resolution check

| ID        | Status   | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0-01** | resolved | No sentence states a per-apparatus count of two; `grep -ni "two.up\|two.count"` returns only three do-not-reintroduce annotations inside HTML comments. Body now reads "An Olympic team final has no drop score, every routine a team puts up is added in, and Biles was slated on all four apparatus." Chiles's status is corrected in the article's own voice — "Jordan Chiles, already on the team, ended up competing all four events" — and `grep -ni "chiles enter\|into the competition\|let jordan chiles"` returns nothing. The elision is marked and "and physical" is restored inside the quotation. FAQ rewritten to match. |
| **P0-02** | resolved | All three reader-facing instances now read _The Art of Excellence_, host named on first use ("Glenn Zweig's _The Art of Excellence_"). TESTIMONY LEDGER corrected to "Ep. 122 (Glenn Zweig), 12 Oct 2025". `grep -n "Beyond Medals" scripts/blog-source-audit.mjs` returns nothing and `'The Art of Excellence'` is registered at L300. See the deviation note in Remaining work on the literal grep prong.                                                                                                                                                                                                                             |
| **P0-03** | resolved | L405 reads "There was always a part of me that thought what if? And I think that was my anxiety talking." The certainty marker is gone, the published hedge restored, nothing cut inside the marks. PROTECT-11 three lines below is untouched.                                                                                                                                                                                                                                                                                                                                                                                          |
| **P0-04** | resolved | `grep -n "Simone Biles Rising"` returns nothing. The beat survives as paraphrase: "She has said the appointment was a point of strength." Every remaining quoted string in the article maps to a ledger entry, per the source audit.                                                                                                                                                                                                                                                                                                                                                                                                    |
| **P0-05** | resolved | "Nothing further" is gone. H2 9 now carries the June hospitalisation, the 22 July second procedure with Owens present, the pledge to explain, and the as-of date: "As of mid-August 2026 she had not, and this page will not guess." The layers frame survives only at the arena-tour trauma paragraph, where she applied it. The paragraph reads correctly if she publishes tomorrow.                                                                                                                                                                                                                                                  |
| **P0-06** | resolved | Cold open now reads "the reason she names first is mental" — the absolute is gone. H2 9 carries "my body is aging. I felt it in Paris." The L'Équipe material is marked "In an L'Équipe interview of uncertain date". FAQ reworded to "named mental preparation ahead of physical conditioning". PROTECT-01's bookend sentence in the same neighbourhood is verbatim.                                                                                                                                                                                                                                                                   |
| **P0-07** | resolved | `grep -ni "Achiever trusts\|scoreboard is the point\|She checks with them"` returns nothing. The discriminator is now content-based: "A Three asks whether the result was enough, and it never is; 9takes' own [Type 3](/enneagram-corner/enneagram-type-3) page calls it a moving finish line. Biles asks about the danger." That is consistent with `enneagram-type-3.md` L44/L199 and testable against both quoted questions rather than their setting. PROTECT-02 above it is verbatim.                                                                                                                                             |
| **P0-08** | resolved | `grep -ni "confirm the result\|already settled\|confirmation of settled"` returns nothing across body, H2s, FAQ and TL;DR. The passage now reads "asked whether she had done it," with Boorman's competing gloss quoted in place: "It was about the process that it took to get there." TL;DR bullet is "Takes the question to a person"; the falsifier no longer rests on the settled-result premise.                                                                                                                                                                                                                                  |
| **P0-09** | resolved | "At the 2023 World Championships in Antwerp… Laurent Landi stood on the landing mat and did not touch her" — past tense, dated, no present-tense WCC arrangement anywhere in the draft. TL;DR reads "half a point at the 2023 Worlds". H2 9 states the Landis "left World Champions Centre in December 2024," and no replacement is asserted. A reader of H2 9 can tell who coached her through Paris and that they have gone.                                                                                                                                                                                                          |
| **P0-10** | resolved | "The way she tells it now, the mechanism was already clear to her" attributes the reasoning to her adult account; the behaviour stays unhedged. The frame is converted once: "The hallway is the earliest place this pattern is visible, which is not the same as its cause; Adria went through the same placement and came out someone else." Adria is not typed. PROTECT-03 is word-for-word intact; the hallway scene and the locker callback both survive.                                                                                                                                                                          |

## Accepted improvements check

Eighteen completed, one partial-with-reason. Spot-verified in the current text rather than accepted
on report:

- **Completed:** P1-01 (Memmel concession present; "a vault nobody else has competed"), P1-02
  (Nassar appositive), P1-03 (Barbosu clause in body and FAQ), P1-04 (key-stat label de-counted;
  "when she cried in front of anyone"), P1-05 (all four: "last afternoon", "10,700 kilometres",
  "Shanon", "she says people made her ashamed of"), P1-06 ("the vocabulary was already in place"),
  P1-07 (three watchable falsifiers, two promoted into the body beside the confidence label),
  P1-08 (loyalty resting on "She was free to leave and stayed" plus the contemporaneous 2021 quote,
  remorse demoted to corroboration), P1-09 (residue named), P1-10 (Two/Eight discriminators swapped
  off distress), P1-11 ("Anxiety by itself is not a type"), P1-12 (heading de-aged, anchor set to
  `simone-biles-left-the-answer-at-50-50` **before** publication with the FAQ cross-reference
  matching, TL;DR and `description` dated), P1-13(a) ("five skills named after her in the sport's
  code of points"), P1-14 (Type 3 line quoted with the anti-Three context), P1-15 (Colts clause
  cut; "since she was six"; "by the summer of 2026, still could not say"), P1-16 (glennzweig.com
  Ep. 122 and the Forbes report added to `citations`), P1-17 ("surveillance" gone; "the watching is
  part of why she stayed"), P1-18 ("Neither made the argument that deserves answering, so here it
  is"), P1-19 (confidence label re-set and scoped).
- **P1-13(b) — deferred with reason.** The Enneagram/Loyalist first-mention gloss was not shipped.
  "Loyalist" appears in the FAQ and the keyword set but not in reader-visible body text. The editor
  recorded the tradeoff explicitly (word ceiling; (a) was the half the unfamiliar seat rated
  higher). Defensible, and contingent on blocker 1 below — if DJ raises the ceiling, ship it.

Two verifications the resolution log claimed and this pass confirmed independently rather than
trusting: the source audit re-run after the OUTLETS fix (8 inline, 0 vague, 0 untagged), and the
great-circle distance behind P1-05.

## Protected-hit regression check

Zero regressions. All nineteen verified by fixed-string match against the current draft.

- **PROTECT-01** — "She never looked. She just always knew where it was" and the closing "She always
  knew where the ground was, and she never once looked at it. She was too scared to look." are
  verbatim. No P2-01 inference was added at the close, and the payoff is not previewed at the top.
- **PROTECT-02** — the two-questions spine and the Type 6 sentence are verbatim. P1-11's new passage
  follows it rather than folding into it.
- **PROTECT-03** — "Verification was the only power on offer." intact; P0-10 edited only the
  sentences before it and the framing after it.
- **PROTECT-04** — the timeline's procedural form survives, including the one-touch warm-up gloss
  and the `inner-thought` landing-mat beat.
- **PROTECT-05** — concession present and still ahead of the rebuttal; only "because they had one"
  changed, exactly as P1-18 and Conflicts 6 authorised. (Its factual defect is separate; see below.)
- **PROTECT-06 through PROTECT-19** — Osaka distinction, spotter sentence (amended only by P1-01's
  four words), "she does not name Tokyo", twisties FAQ framing, Senate testimony quoted verbatim and
  first with the authority pairing intact, the 2015-vs-2024 turn (trailing tense only), the
  unresolved 50-50 ending, the declared subtype uncertainty, "body in the room", the TL;DR accordion
  and the Rabbit Hole's permission to skip, Nellie's barriers and "Where'd you come from?", the 6w7
  humour tell, "my love blanky" and the Owens ruling, and the falsifier's existence — all present.

The revision introduced no new factual assertion without a source trail. The frontmatter changes
made after the editor pass (`wikidata_qid` `Q7520786` → `Q7520267`, `imdb_id` added) came from the
separate `6_enrich_frontmatter` stage at 04:05, not from a perspective repair, and are outside the
reader-visible hash by design. The new QID checks out — Q7520267 is Simone Biles — which means the
**evidence packet's `Q7520786` (recorded as a `verified fact` at packet L44) is wrong** and should
be corrected there so it cannot re-enter, the same way CLM-09 was.

## Remaining work

**1. Word ceiling — blocking, DJ's call.** `blog-lint.sh` returns `FAIL body is 4842 words (ceiling
4500)`, plus the one known-benign comparative-contrast WARN (the verbatim Biles quote already
documented in the FORMULA FINGERPRINT LEDGER). The P0 repairs cost ~515 words and a compression pass
recovered ~180. Closing the remaining ~342 means cutting material this review protected or praised.
Minimum remaining action: DJ picks (a) the documented `BLOG_LINT_WORD_CEILING` exception for this
page, or (b) cuts from the editor's pre-costed list. Do not resolve this by trimming a P0 repair.

**2. Confirmed factual error inside PROTECT-05 — needs human.** Current passage:

> "An Olympic team is four other women who trained five years, and one was going home without a
> medal because of a decision Biles made in a hallway."

Two defects, and the acceptance test that fails is the article's own internal consistency rather
than any synthesis item — which is why no seat caught it and why it is not counted as an open P0.
(a) The United States won team silver, so no team member went home without a medal; the draft says
so itself three paragraphs later — "The United States won silver" — leaving a self-contradiction on
the page in the section that carries the piece's single most important act of persuasion.
(b) Tokyo 2020 team rosters were four gymnasts (Biles, Chiles, Lee, McCallum), so there were **three**
other women, not four. The adjacent counterfactual "four women go home with nothing" is correct as
written, because it counts Biles herself. Minimum remaining action: a human-authored two-clause
repair that keeps the concession's content and its position ahead of the rebuttal — the cost is real
and landed on real people without requiring that anyone finished medal-less. The editor was right
not to edit into a protected passage unilaterally.

**3. P0-02 acceptance-test deviation — advisory, not open.** The test as written requires
`grep -rn "Beyond Medals" src/blog/people/drafts/Simone-Biles.md scripts/blog-source-audit.mjs` to
return nothing. It returns one hit: draft L636, inside the EDITOR PASS NOTES HTML comment, which
exists precisely to stop the wrong name re-entering ("Podcast is The Art of Excellence…, not 'Beyond
Medals and Perfection' (that is the episode title)"). The substantive prong — every italicised
publication name resolves to a real, locatable source — passes, the tool contamination is gone, and
the hit is excluded from the reader-visible hash and stripped on push. Counted resolved. Flagged so
a future gate tightening does not mistake the annotation for the defect.

**4. Two minor residuals for the next refresh — not blocking.**

- The FAQ "Is Simone Biles competing at the 2028 Olympics?" opens with "As of April 2026" and then
  carries the undated L'Équipe quote inside that dated answer. P0-06's date-marking prong was scoped
  to the body paragraph, which is fixed; the FAQ carries only the softened absolute. One clause
  would close it.
- Evidence-packet corrections owed so the next refresh does not re-inject them: CLM-09 (two-up
  two-count) is already corrected per the resolution log; the `Q7520786` QID at packet L44 is not.

**5. Open research, logged and non-blocking:** RQ-01 (FIG substitution mechanism), RQ-02 (locate the
"point of strength" venue), RQ-03 (does the 2025–2028 Code still carry the 0.5), RQ-05 (the
visual-spotting technique claim, which is why P2-01 correctly did not ship). Each has a safe repair
already in the draft that holds under either answer.
