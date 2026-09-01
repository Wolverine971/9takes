---
artifact: perspective-verification
schema_version: 1
subject: Cara-Delevingne
draft_sha256: a793ab65b49c80255ab2c22a0a09524bd06f41485c4645c567a6979396198c48
final_content_sha256: ae6fe6a7241fdafa1d1c03a23cd066847559f144a8147de9b3dc3fb3566b9265
verification_status: fail
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-09-01T18:52:00Z
path: docs/content-analysis/perspective-reviews/Cara-Delevingne/2026-09-01_114810/verification-final.md
---

## Verification verdict

The revision pass did what it was asked to do. All six draft-scoped items from
`verification-initial.md` are fixed, the three material step-6 failures that the previous `fail`
rested on are gone, and the ~290-word trim that brought the body from 4,127 to 3,892 did not cost a
P0 repair, a protected passage or a ledger. `scripts/blog-lint.sh` returns 0 fail, 0 warn. On the two
counts the gate scores this is clean: `open_p0: 0`, `protected_hit_regressions: 0`.

The status is `fail` again, on verification method step 6, and in the same sentence as last time —
though the defect is much smaller and the load-bearing claim is now correct.

RW-1 removed the invented "the retailer she first designed for in 2017." What replaced it is
**"her first design credit at a retailer she had only modelled for since 2014."** The headline claim
is true and sourced: the August 2026 capsule is Topshop's first-ever co-designed collection with her.
The appended characterisation is not. TheIndustry.fashion, the trade source for this story, says her
Topshop connection has "long gone beyond modelling" and records a **30-piece styling edit in 2025**,
plus an ambassador role around Topshop.com's August 2025 relaunch. Styling is not modelling, so
"only modelled for" is contradicted by the same outlet that establishes the "first design credit"
half of the sentence. The packet carries only CLM-21 / S-08, the 2026 capsule itself; it does not
settle the prior relationship, so the clause has no source trail.

This is a two-word fix and it is the last one. I am recording it as `fail` rather than waving it
through because it sits inside PROTECT-01's ammunition — the skeptic beat, where a checkable error
costs the most — and because it is the third iteration of the habit the synthesis named: supplying
the article's own version of something a source already answers. It is materially less severe than
the 2017 invention it replaced, and nothing else in the draft is blocking.

Two smaller items and the unresolved artifact-integrity finding are under Remaining work.

## P0 resolution check

All eleven were verified `resolved` in `verification-initial.md`. This pass re-tested each against
the revised text to confirm the trim did not reopen one. None did.

| ID    | Verdict      | Evidence                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-01 | **resolved** | Hook, table row and FAQ now agree. `grep "stopped counting"` = 0. RW-4 fixed the residual: frontmatter FAQ 1 carries the body's two-clause version — "threw herself off things because she wanted to feel pain, then wanted the cast so a stranger could see she was hurting" — both clauses hers. The table's age-7 and childhood rows survive the trim with her account intact.                             |
| P0-02 | **resolved** | `grep -icE "runs about\|eleven cit"` = 0. Closed range and past tense hold.                                                                                                                                                                                                                                                                                                                                   |
| P0-03 | **resolved** | `inner-thought` = 0 in the body after stripping HTML comments; the two hits are the ledger and the editor note recording the deletion. Her verbatim account carries the beat.                                                                                                                                                                                                                                 |
| P0-04 | **resolved** | All four phrases still return `grep -o` hits against `enneagram-wings-complete-guide.md`: "turn personal struggles into art" (1), "brand their authenticity" (1), "mentally rehearse vulnerable moments before sharing them" (1), "The Aristocrat" (2).                                                                                                                                                       |
| P0-05 | **resolved** | "substantially hers" in all four locations. The 2017 "I Feel Everything" receipt survives the trim.                                                                                                                                                                                                                                                                                                           |
| P0-06 | **resolved** | _Good Day Sacramento_ (3 hits) and Margo Roth Spiegelman intact; the sarcasm framing is still hers.                                                                                                                                                                                                                                                                                                           |
| P0-07 | **resolved** | `counter-type` = 0 in the body. The revision folded "Naranjo's word for it is 'competition'" into the preceding sentence: "The sexual Four runs envy as what Naranjo called competition." Still attributed to Naranjo, still not to the linked 9takes page. Fold verified clean.                                                                                                                              |
| P0-08 | **resolved** | `grep "blind listen"` = 0, `grep "nobody named"` = 0. Her Vogue concession survives the trim verbatim at L305.                                                                                                                                                                                                                                                                                                |
| P0-09 | **resolved** | `grep "nobody cites"` = 0. _Carnival Row_, _Club Kid_, the SAG ensemble nomination and the Gomez quotation all survive.                                                                                                                                                                                                                                                                                       |
| P0-10 | **resolved** | RW-2 fixed the over-claim. `grep "all cast in 2018"` = 0. Body now reads "Boo carried it on a single vote and Sakinorva on two, both cast in 2018, with a dissenting 3w4 from the same year," and the two echo sites — TL;DR bullet 1 and frontmatter FAQ 1 — both read "on a handful of votes, two of them dated 2018." The undated Boo vote is no longer swept into a 2018 claim. `grep "or an Eight"` = 0. |
| P0-11 | **resolved** | "It sits on top of an identity problem and it serves one" intact; no unhedged causal-order claim.                                                                                                                                                                                                                                                                                                             |

## Accepted improvements check

Re-checked only where the revision pass touched them. Everything else stands as recorded in
`verification-initial.md`.

| ID                 | Verdict                                   | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-04              | **completed**                             | RW-5 fixed. The pull-quote is restored in full at L193 — "I knew I was a little queer kid running around. I didn't feel like I belonged in my body, in my family, in any of it" — and the following sentence is back to "The body first, then the family, and an opening clause that names why." The epigraph's cut middle clause retains its ellipsis ("it wasn't me… I'm not this"), so that elision stays marked. Every elision in the piece is now marked. |
| P1-05              | **completed, one clause still unsourced** | Five of six were always clean. The sixth is improved but not correct — see Remaining work #1.                                                                                                                                                                                                                                                                                                                                                                  |
| P1-10              | **completed, same clause**                | The Topshop dating is right and now cites Retail Gazette. The appended history is still doing unsourced work.                                                                                                                                                                                                                                                                                                                                                  |
| P1-11              | **completed**                             | RW-3 fixed the tense. L339 now reads "_Not Normal_ goes out on 25 September 2026 with no explanation attached to the title." Forward construction, consistent with the hook's "arrives on 25 September" at L166, and it still survives a later gloss. Nothing else in the paragraph moved.                                                                                                                                                                     |
| P1-03 / PROTECT-09 | **completed, strengthened**               | The revision added the two review quotations the grader wanted, and both check out against the packet verbatim: Atwood's "startling confidence" and "necessary" (packet L298–299), and When The Horn Blows, 2 June 2026, "conceptual clarity and aesthetic ambition" (packet L300, S-15). Sourced additions, correctly logged in the TESTIMONY ledger as non-qualifying third-party voices.                                                                    |
| P1-08              | **completed**                             | The stress-arrow paragraph survives the trim with the self-abandonment reading and the entertainer-affect-as-cover framing both intact.                                                                                                                                                                                                                                                                                                                        |
| P2-01              | **rejected with reason**                  | Unchanged, still defensible, no gate consequence.                                                                                                                                                                                                                                                                                                                                                                                                              |
| P2-05              | **completed**                             | The revision removed the softness the previous pass flagged. "Cast as the composed one" is gone; L339 now reads "drew the opposite assignment, composed where Delevingne was wild," which makes the framing plainly the writer's rather than implying it is hers.                                                                                                                                                                                              |

RW-6 is also discharged: the two audio-sourced changes are now logged in `revision-resolution.md`,
and the coherence question is answered — the age-7 row's "What happened" column still carries the
mother, and the third column carries her motive, which is what that column does in all five rows.

## Protected-hit regression check

All twelve survive. Verified by locating each passage in the current draft and diffing the
reader-visible body against `draft-reviewed.md`.

- **PROTECT-01** — L333 still ends "The album is not the test. The test is what she makes after the raw thing stops selling," unanswered. The skeptic paragraph is intact and now carries WWD and Retail Gazette citations. Its ammunition is stronger than at snapshot; one clause in it is still wrong (Remaining work #1).
- **PROTECT-02** — L313 byte-identical: "Seen that way, the four careers are one request, refused three times and repeated anyway." The section now _ends_ there, because the trim cut the type-theory paragraph that followed it. That paragraph was not protected, the cut is logged in the DISTRIBUTION ledger, and ending on the protected line strengthens rather than damages its function.
- **PROTECT-03** — L160 "A cast is a sentence the body can say out loud" untouched. The hook still runs injuries → cast → sentence in order.
- **PROTECT-04** — L255 byte-identical, "For twenty-three years the reports had been filed, some by her body and some by her own hands…" Not flattened into prose.
- **PROTECT-05** — L211 byte-identical including the attribution clause and her stated reason for declining a formal coming out.
- **PROTECT-06** — L294 falsifier byte-identical. Still a specific, checkable disconfirmer. The 0.045 same-type similarity trip against `Hunter-Biden` is recorded in the FORMULA FINGERPRINT ledger with the reasoning for leaving it alone — under the run's 0.079 noise max, not a Gate 6 blocker.
- **PROTECT-07** — L305: "she got it partly because her name sells" and her Vogue concession both intact. Only Besson's Academy Award clause was trimmed, two sentences later.
- **PROTECT-08** — L270 literal-aristocrat argument survives sentence for sentence, wings-guide wording verified against the source page.
- **PROTECT-09** — L307 "The music backlash, meanwhile, was a social event more than a critical one" byte-identical, FEMMUSIC named, and the claim now carries two sourced review quotations instead of a bare outlet list.
- **PROTECT-10** — L339–341. The close still declines to explain the title and still ends "This one she wrote, named, and declined to gloss." Only RW-3's tense fix and the Bella Hadid tightening touched it.
- **PROTECT-11** — Still a three-column table with five dated rows (7 pipe-leading lines = header, separator, five rows). Two cells shortened; no row dropped or backfilled.
- **PROTECT-12** — Gomez quotation intact at L307. The plain-English Type 4 gloss is byte-identical and still passes lint as the extractable answer block at 48 words.

The four ledgers were re-checked against the revised body and all four are current, including the
two the trim would have staled: DISTRIBUTION correctly now reads "Type-theory paragraphs… 1" with
the cut recorded, and FORMULA FINGERPRINT carries the 3,892-word count with an itemised account of
where the ~290 net words came from.

## Remaining work

**1. The Topshop sentence still appends an unsourced history.** _(P1-05 / P1-10, L331. This is what the `fail` rests on.)_

> "On 25 August 2026 she put out a sixteen-piece co-designed Topshop capsule (Retail Gazette), her
> first design credit at a retailer she had only modelled for since 2014."

Everything up to "credit" is right and cited. "A retailer she had only modelled for since 2014" is
not sourced by the packet and is contradicted by TheIndustry.fashion, which reports a **30-piece
styling edit in 2025** and says her Topshop connection has "long gone beyond modelling." She was
also an ambassador at the August 2025 Topshop.com relaunch. Separately, 2014 is the year of her
first _solo campaign_, not the start of the relationship — her Topshop runway appearances date to
the early 2010s — so "since 2014" is load-bearing in a way the sources do not support either.

_Minimum action:_ cut the clause to something the sources carry. "Her first design credit at a
retailer she has fronted since 2014" removes the false exclusivity while keeping the contrast the
beat needs. The previous verification's suggested wording — she has fronted Topshop campaigns since
2014, and this is the first collection she co-designed — also works and is the safest version.

**2. "Sold-out" is an unverified qualifier.** _(P0-02, L166.)_ "…ending on sold-out nights in Los
Angeles and Brooklyn." The packet confirms the LA ×2 and Brooklyn ×2 dates and the 26 June close
(S-11/S-12/S-13), but nothing in it establishes the shows sold out. The previous verification quoted
this sentence in full and passed it, so I am not reopening P0-02 over it — recording it because it
entered as part of a repair and has no source trail. Cheapest fix is to drop the word.

**3. RW-8, artifact integrity — `needs_human`, unchanged.** Not a draft defect and not fixable by
editing the draft, correctly left alone by the revision pass. `draft-reviewed.md` no longer hashes to
`context.json`'s `draft_sha256` because a formatter rewrote both files after the snapshot phase, and
`scripts/perspective-review-gate.mjs` never re-verifies it, so nothing tripped. The snapshot's
content is intact — this pass diffed the full reader-visible body against it and every protected
passage matched — so the review stands. But the freeze is advisory rather than enforced until either
`docs/content-analysis/perspective-reviews/**` is excluded from the formatter, or the gate re-hashes
`draft-reviewed.md` against `draft_sha256` at each phase. DJ's call.

**4. RQ-05 stays unresolved**, as at both prior passes. No evidence she has addressed
"I Feel Everything" in the 2026 press cycle, so every "first" remains correctly narrowed to
"substantially hers." No action required.
