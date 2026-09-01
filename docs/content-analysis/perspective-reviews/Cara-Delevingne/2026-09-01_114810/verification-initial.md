---
artifact: perspective-verification
schema_version: 1
subject: Cara-Delevingne
draft_sha256: a793ab65b49c80255ab2c22a0a09524bd06f41485c4645c567a6979396198c48
final_content_sha256: 25ccc9adfb988eda2c1eb36f12ce22daf5994d286bc11f8260df3aafa157a389
verification_status: fail
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-09-01T17:40:21Z
path: docs/content-analysis/perspective-reviews/Cara-Delevingne/2026-09-01_114810/verification-initial.md
---

## Verification verdict

All eleven P0 repairs pass their stated acceptance tests, and all twelve protected hits survive.
On the two counts the gate scores, this revision is clean: `open_p0: 0`,
`protected_hit_regressions: 0`. The editor pass is, on the evidence, the best work in this file —
it listened to the source audio three prior passes had declined to open, which closed RQ-01 and
RQ-02 and caught a real misdate, and it retrieved Playboy on the fourth attempt.

The status is nonetheless `fail`, on verification method step 6: **the revision introduced new
factual assertions as part of repairs, without a source trail, and at least one of them is
contradicted by the sources.** Three are material:

1. **A false claim about a living brand relationship.** The P1-05 repair to "back at Topshop"
   invented a 2017 Topshop design history that does not exist. External sources say the August 2026
   capsule is Topshop's _first-ever co-designed_ collection with her.
2. **An unsupported date on the crowd-vote evidence.** The P0-10 repair asserts the Boo and
   Sakinorva votes were "all cast in 2018." Boo's page displays no vote dates; only Sakinorva's
   three carry 2018 timestamps, and the editor's own log records dates for Sakinorva only.
3. **The close states a future release in the past tense**, contradicting the hook six sections
   earlier and making the article's final paragraph false on its own publication date.

None of these three is a judgment call. Each has a one-clause minimum action, listed below. The
irony is worth naming: the synthesis diagnosed this draft's single habit as _supplying its own
version of something it already had the source's version of_, and the repair pass reproduced that
habit three times in smaller form — in each case in a spot no acceptance test happened to point at.
That is a known blind spot in this gate, which scores P0 and PROTECT only.

Two softer step-6 items and one artifact-integrity finding are recorded under Remaining work.

## P0 resolution check

| ID    | Verdict                             | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-01 | **resolved**                        | `grep "stopped counting"` = 0. Hook now opens "As a child, Cara Delevingne started throwing herself off things" and carries her category ("danger-seeking behavior, for sure"), her motive ("So I just wanted to feel pain") and her caveat ("It didn't consciously happen in that way in my head"). Tie-breaker at L179 rests on the stated motive, not on involuntariness. Section premise at L221 ("the pain kept arriving where other people could see it, whether she put it there or it came on its own") is true of all five surviving rows. Fractures row's third column now carries her account of the act. One residual, in frontmatter FAQ 1 — see Remaining work #4. |
| P0-02 | **resolved**                        | `grep -icE "runs about\|eleven cit"` = 0. L146: "ran through six cities between 1 and 26 June 2026 … ending on sold-out nights in Los Angeles and Brooklyn." Past tense, closed range, every later tour reference dated (L248 "a headline tour", L315 "the June tour"). The editor's decision to state a closed range rather than a show count, given the 10-vs-11 disagreement between the itinerary and the synthesis, is the right call and is logged.                                                                                                                                                                                                                        |
| P0-03 | **resolved**                        | `inner-thought` appears twice in the file, both inside HTML comments (L125 ledger, L405 editor note) recording the deletion; zero in the body. The panel is replaced by her verbatim account of the same seconds (L303). The FORMULA FINGERPRINT interior-beat entry at L125 is rewritten to record that the beat is hers, not authored — the ledger is no longer stale.                                                                                                                                                                                                                                                                                                         |
| P0-04 | **resolved**                        | Every phrase now attributed to the wings guide returns a `grep -o` hit against `src/blog/enneagram/enneagram-wings-complete-guide.md`: "turn personal struggles into art" (1), "brand their authenticity" (1), "mentally rehearse vulnerable moments before sharing them" (1), "The Aristocrat" (2). All three locations agree — L156 (TL;DR), L250 (Rabbit Hole), L315 (skeptic beat). PROTECT-08's argument survives sentence for sentence.                                                                                                                                                                                                                                    |
| P0-05 | **resolved**                        | The 2017 song is collected at L301 as the synthesis preferred, not merely conceded. Every "first" is narrowed to "substantially hers" in all four locations, including frontmatter FAQ 5 (L74) — L158, L291, L74, and the close. Credit reality lands at L309 (Burton, Fiona Apple co-writing "Need It"). RQ-05 unresolved, so the narrow fix is correct per the brief. Close rewritten to "This one she wrote, named, and declined to gloss," which moves the weight onto the unilateral act. A reader who names "I Feel Everything" now contradicts nothing.                                                                                                                   |
| P0-06 | **resolved**                        | L195. Her sarcasm framing appears with attribution, and I verified the attribution the packet could not settle: she did post it to Twitter on 29 July 2015, the day after the segment (IBTimes UK, TheWrap, Gulf News). No sentence asserts unperformed affect — "she gave them sarcasm back all the way down." _Paper Towns_ and Margo Roth Spiegelman both named, with the fantasy-projection gloss the synthesis asked for.                                                                                                                                                                                                                                                   |
| P0-07 | **resolved**                        | `counter-type` appears once, inside an HTML comment (L408) recording the fix; zero in the body. L254 now reads "runs envy as competition and anger rather than as withdrawal or quiet shame." The competition framing is attributed to Naranjo, not to the linked 9takes page.                                                                                                                                                                                                                                                                                                                                                                                                   |
| P0-08 | **resolved**                        | `grep "blind listen"` = 0, `grep "nobody named"` = 0. Her Vogue April 2023 concession replaces the writer's inference at L285. Dyspraxia clause at L211 now reads "with dyspraxia, a coordination disorder, and with depression" — the unsourced attribution is gone and the P1-05 gloss lands in the same edit. Every surviving "she has said" / "by her own account" in the body resolves to a quotation or a packet-verified fact (13 instances checked). The retained clause "she got it partly because her name sells" is PROTECT-07's own protected wording, which the synthesis explicitly ruled must survive; keeping it is correct, not a miss.                         |
| P0-09 | **resolved**                        | `grep "nobody cites"` = 0; the superlative is gone. L287 adds _Carnival Row_ (co-lead opposite Orlando Bloom, eighteen episodes, two seasons) and _Club Kid_ — which I verified independently: Cannes premiere May 2026, A24, cinemas 6 November 2026 (Deadline, Variety, IndieWire, UPI). No claim that her _Club Kid_ performance was praised, per FUTURE's scope caution. "now recording artist" → "then recording artist" at L283, so the acting chapter is not closed. Gomez quotation and Alice Banks intact.                                                                                                                                                              |
| P0-10 | **resolved on its acceptance test** | Every site counted is named (Boo, Sakinorva); the count is not asserted. Vote thinness stated once. As-of date carried ("Checked in September 2026"). `grep "or an Eight"` = 0. I re-ran the lookup: Boo profile 2978 shows 7w6 at 1 vote / 100%; Sakinorva id 212 shows 7w6 ×2 (2018-07-10, 2018-05-03) and 3w4 ×1 (2018-10-08) — the editor's counts are exactly right. **But** the sentence's "all cast in 2018" is not supported for Boo, whose page displays no vote dates. That is a step-6 failure, not an acceptance-test failure; see Remaining work #2.                                                                                                                |
| P0-11 | **resolved**                        | L181: "It sits on top of an identity problem and it serves one." No unhedged causal-order claim survives. Falsifier at L274 widened to "escape from pain or reality full stop, with the identity complaint absent rather than sitting underneath it" — still a specific, checkable disconfirmer, not a hedge. The Vogue line is quoted in full and answered by name inside the counterargument section at L272, which is where the synthesis wanted it.                                                                                                                                                                                                                          |

## Accepted improvements check

| ID    | Verdict                                      | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-01 | **completed (reduced scope, reasoned)**      | L199 carries her August 2015 contemporaneous words in one sentence rather than the two-to-four the synthesis budgeted, and deliberately says "stepping back from fashion work" rather than asserting she quit. The reduction is defensible and logged: RQ-01's resolution removed the de-risking rationale, and the word budget was hard. The acceptance test still holds — delete every 2026 _Call Her Daddy_ quotation and the thesis retains a dated, documented source.                                                                                                                        |
| P1-02 | **completed**                                | All six. Vogue interview "late January 2023" for an April cover (L237); Van Nuys "a public Los Angeles airport" (L231); the "opened London Fashion Week" claim removed rather than restated, with Bailey/Burberry carried at L187; "a Screen Actors Guild ensemble nomination" (L287); "She was 20" (L197); "in 2013 it flared through Fashion Week" plus her "It only happened during Fashion Week" (L197); `grep "Delevingne, 34"` = 0.                                                                                                                                                          |
| P1-03 | **completed**                                | `Nylon` appears twice, both inside HTML comments; the body reads FEMMUSIC (L287). Besson re-verified rather than cut, and the testimony ledger at L96 now matches the body, citing Press Association / Irish News / Express & Star, 24 July 2017.                                                                                                                                                                                                                                                                                                                                                  |
| P1-04 | **completed, with one new unmarked elision** | Elbow quotation restored to her full syntax (L138). Epigraph ellipses added (L132). Dangling "either" trimmed to "owed that to anyone" with the attribution clause untouched (L191). Two tense errors the audio exposed were corrected ("I don't feel like I had a voice as a kid", both instances). **But** the pull-quote at L173 now drops "in my family" from "I didn't feel like I belonged in my body, in my family, in any of it" with no ellipsis — a new unmarked elision, against this item's own acceptance test. See Remaining work #5.                                                |
| P1-05 | **completed, one repair factually wrong**    | Five of six are clean: "gurning" glossed by apposition (L142); Weinstein's role identified (L191); the Enneagram and what a Seven wants in one clause (L148); Belgravia glossed (L187); dyspraxia glossed (L211). The sixth — replacing "back at Topshop" — introduced a false 2017 design history. See Remaining work #1.                                                                                                                                                                                                                                                                         |
| P1-06 | **completed**                                | L268 names Type 3, states what would favour it (identification with the successful image), and gives on-record evidence against it. L233's protected line was echoed, not relocated — it still sits in the career section at L295.                                                                                                                                                                                                                                                                                                                                                                 |
| P1-07 | **completed**                                | L270: "The Four reading explains the using years least well. A decade at that scale is genuinely gluttonous in the Seven sense, and the Seven reading gets there with less work." An explicit statement of what the Four reading does not explain.                                                                                                                                                                                                                                                                                                                                                 |
| P1-08 | **completed**                                | "Being the one who makes it fun" and "I was so good at hiding it" are both gone from L260. The 2-move is now shown through self-abandonment inside relationships, and the entertainer affect is explicitly named as cover. No behaviour the draft elsewhere calls the Seven-shaped public affect remains in the paragraph.                                                                                                                                                                                                                                                                         |
| P1-09 | **completed**                                | _Planet Sex with Cara Delevingne_ (2022) named at L256. The unsourced "Relationships as the arena where the identity question gets settled" sentence is cut. Amber Heard not approached. I verified the Playboy addition independently: Summer 2026 issue, published 14 July 2026, female-led creative team, her own framing as the first time she posed nude entirely on her own terms (Out.com, PinkNews, TMZ).                                                                                                                                                                                  |
| P1-10 | **completed**                                | `grep -icE "right now\|last three years\|nearly four years\|August's single"` = 0. "As of September 2026" (L146); "sober since autumn 2022" (L146); "every year since her 2023 Vogue cover" (L154); "released 22 August 2026" (L307); "Fifteen years after the billboards went up" (L311, correctly recomputed from the 2011 Burberry debut); Rag & Bone dated fall 2026 (L315); Minke re-anchored to "was beside her through the record" with no current-status assertion (L307). Topshop restated as a dated finite drop — the dating is right, the appended history is not (Remaining work #1). |
| P1-11 | **completed, with a tense defect**           | Year added, ongoing-absence assertion removed, close recast as a statement about the release itself. All three acceptance-test conditions pass, and CRITIC's ambivalence clause is in ("An unexplained title is also excellent marketing, and she knows that"). But the recast puts a 25 September 2026 release in the past tense inside a piece dated 1 September 2026, contradicting L146. See Remaining work #3.                                                                                                                                                                                |
| P1-12 | **completed**                                | Poppy's bed quotation is out of the ledger and into the household section at L209, where it reads as Poppy meant it. Table is five dated rows; no weaker row backfilled.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| P1-13 | **completed**                                | L207: "Delevingne's mother, Pandora, has spoken publicly about her own heroin addiction." Outlet not named, per the brief. The household claims no longer rest solely on a relative's testimony.                                                                                                                                                                                                                                                                                                                                                                                                   |
| P2-01 | **rejected with reason**                     | Defensible, and the reasoning is recorded rather than taken silently: RQ-01's resolution removed half the asymmetry the item was confessing, and P0-11 already places the Vogue quotation in full inside the counterargument section. Optional item; no gate consequence.                                                                                                                                                                                                                                                                                                                          |
| P2-05 | **completed, soft on one clause**            | The Bella Hadid comparison is specific and moved to the end of the paragraph, so the section opens on the title as the synthesis preferred. "Types the same way" checks out — `Bella-Hadid.md` is `enneagram: '4'`. "Both say the assignment was somebody else's" is a fair paraphrase of her corpus-documented "I was the uglier sister… I wasn't as cool as Gigi," but "cast as the composed one" is the writer's word, not hers; the local draft's words are "the brooding one" and "not as outgoing." Soft, not wrong.                                                                         |

## Protected-hit regression check

All twelve survive. Verified by reading each passage in the current draft, then diffing it against
`draft-reviewed.md`.

- **PROTECT-01** — L317 still ends "The album is not the test. The test is what she makes after the raw thing stops selling," unanswered. The skeptic paragraph before it is intact and is not softened; only the quoted wing wording changed and the ammunition gained dates.
- **PROTECT-02** — L293 is verbatim: "Seen that way, the four careers are one request, refused three times and repeated anyway." The Sally Bowles clause at L291 is intact. The only ladder change is "substantially hers," which is exactly the relative-comparison fix P0-05 required.
- **PROTECT-03** — The hook still lands "A cast is a sentence the body can say out loud" (L140), untouched. It now opens on her throwing herself off things rather than on a bone count she never gave; that is the P0-01 repair, and the essential function — the injuries, then the cast, then the sentence — survives in order.
- **PROTECT-04** — Requalified, not deleted (L235): "For twenty-three years the reports had been filed, some by her body and some by her own hands, and it took images humiliating enough to run on every celebrity site on earth before one reached somebody who could act on it, including her." The rewrite is confined to the opening clause, which is what the synthesis mandated, and the line has not been flattened into prose.
- **PROTECT-05** — L191 reads as it did, including "her own account on _Call Her Daddy_ in June 2026" and her stated reason for declining a formal coming out. P1-05's four words identifying Weinstein's role sit before the quotation; P1-04's trim removed only the dangling "either." The attribution clause is byte-identical to the snapshot.
- **PROTECT-06** — L274 still names a specific, checkable condition that would change the call. Widened in content; not softened into a hedge.
- **PROTECT-07** — L285 survives: "Concede what is true in it. She got a major-label deal that thousands of better singers will never see, and she got it partly because her name sells." Only the final unsourced sentence changed, replaced by her own stronger on-record concession.
- **PROTECT-08** — L250. The literal-aristocrat argument survives sentence for sentence; only the quoted wording is corrected, and the correction sharpens it ("branded authenticity" for "performed authenticity").
- **PROTECT-09** — L287: "The music backlash, meanwhile, was a social event more than a critical one," with FEMMUSIC in place of _Nylon_. Claim intact, citation now resolves.
- **PROTECT-10** — L323–325. The close still declines to explain the title, time-boxed rather than explained. The added marketing clause is CRITIC's cheapest version and does not deflate it.
- **PROTECT-11** — Still a table, still three columns, still five dated rows, still scannable (L225–231). Not dissolved into prose; no weaker row backfilled.
- **PROTECT-12** — Gomez quotation intact at L287 with the new credits added around it, not in place of it. L169's plain-English Type 4 gloss is byte-identical. L233's line survives in the career section at L295 — the middle sentence beside it ("From inside it is a search for a channel with enough bandwidth to carry the signal") was trimmed for budget, but the protected sentence is verbatim.

## Remaining work

Ordered by severity. Items 1–3 are what the `fail` rests on; each is a single-clause fix.

**1. The Topshop sentence states a design history that does not exist.** _(P1-05 / P1-10, L315.)_

> "In August 2026 she put out a sixteen-piece co-designed Topshop capsule, the retailer she first designed for in 2017."

The dating of the capsule is right (packet CLM-21 / S-08: 25 August 2026, sixteen pieces). The
appended history is not. TheIndustry.fashion describes the 2026 capsule as Topshop's
"first-ever co-designed capsule collection" with her, and puts her prior Topshop history at a 2014
solo campaign and a 2025 thirty-piece styling edit — modelling and styling, not design, and no 2017
anything. Nothing in the packet, the six reviews, the synthesis or `editor-resolution.md` sources a
2017 date. P1-05 offered two options for "back at Topshop" — establish the prior history or cut the
word — and the repair invented the history instead. This sits inside PROTECT-01's ammunition, so it
is also the worst place in the article to carry a checkable error.

_Minimum action:_ delete "the retailer she first designed for in 2017," or replace it with the
verified version — she has fronted Topshop campaigns since 2014, and this is the first collection
she co-designed. The second version is better ammunition for the beat anyway.

**2. "All cast in 2018" is not supported for the Boo vote.** _(P0-10, L148.)_

> "Checked in September 2026, Boo carried it on one vote and Sakinorva on two, all cast in 2018, with a dissenting 3w4 beside them."

I re-ran the lookup. Sakinorva id 212 shows exactly what the editor logged, dates included: 7w6 by
scumfuc (2018-07-10) and Taco110 (2018-05-03), 3w4 by forestgump (2018-10-08). Boo profile 2978
shows 7w6 at 1 vote / 100% and **displays no vote dates at all** — which is why the editor's own log
records dates for Sakinorva only and none for Boo. The word "all" sweeps the undated Boo vote into a
2018 claim, and the next sentence ("A handful of strangers typed the gurning eight years ago and it
set") inherits it. This is the one repair where the article's new evidentiary rigour asserts
something the evidence does not carry, in the paragraph whose entire job is to stop over-claiming
about the crowd.

_Minimum action:_ scope the date to Sakinorva. "Boo carried it on a single vote and Sakinorva on
two, both cast in 2018, with a dissenting 3w4 from the same year." The thinness argument is
unaffected; the Sakinorva votes alone carry "eight years ago."

**3. The close puts a future release in the past tense, and contradicts the hook.** _(P1-11, L323 vs L146.)_

> L146: "Her debut album, _Not Normal_, arrives on 25 September on Warner Records."
> L323: "Delevingne released _Not Normal_ on 25 September 2026 without attaching an explanation to the title…"

The draft's `date` and `lastmod` are both 2026-09-01. On that date the album has not been released,
so the article's final paragraph asserts as completed fact something twenty-four days away — and
the hook six sections earlier says so. P1-11's three acceptance conditions all pass, which is why
this is not an open P1; the durability recast simply overshot into a tense the publication date
cannot support. Whichever date the piece goes live on, one of these two sentences is currently
wrong.

_Minimum action:_ reconcile the two. Either publish on or after 25 September 2026, or restore a
forward construction in the close that still survives a later gloss — e.g. "_Not Normal_ goes out on
25 September 2026 with no explanation attached to the title." Do not touch anything else in the
paragraph; PROTECT-10 is intact as written.

**4. Frontmatter FAQ 1 substitutes a motive she did not give.** _(P0-01 residual, L62.)_

> "…and by her own account threw herself off things because a cast was the only thing that made internal pain legible to anyone else."

The body gets this exactly right at L179 — she went looking for pain, _and_ what she wanted from the
hospital was the cast; two linked facts, both hers. The FAQ collapses them into a single causal
claim she never made, attributed with "by her own account." `faqs` is reader-visible and feeds
FAQPage JSON-LD, and P0-01's acceptance test asks that a reader who then reads the transcript find
nothing in the article that contradicts it. This is the last small instance of the habit the whole
review was about. _Minimum action:_ mirror the body's two-clause version.

**5. A new unmarked elision in the pull-quote.** _(P1-04 residual, L173.)_ The snapshot quoted
"I didn't feel like I belonged in my body, in my family, in any of it"; the current draft drops
"in my family" with no ellipsis, and the following sentence was rewritten to match, so the cut looks
deliberate rather than accidental. If the audio showed she did not say it, that belongs in the
resolution log alongside the two other audio-driven quote corrections. Otherwise it fails this
item's own test — every elision marked. _Minimum action:_ restore the phrase or add the ellipsis.

**6. Two audio-sourced changes are unlogged.** The age-7 table row's quotation was replaced
wholesale — snapshot: "I thought she was dead and I didn't understand. I just would stop eating at 7
and just be on a hunger strike because I didn't know where my mother was"; current: "I was not going
to eat, because that to me was the only thing I had control over." The new line is almost certainly
from the transcription the editor ran, but `editor-resolution.md` has no row for it, and the
replacement drops the mother from a row whose "What happened" column is about the mother. Worth a
line in the log and a glance at whether the row still coheres.

**7. Word budget — DJ's call, already flagged.** `scripts/blog-lint.sh` returns 0 fail, 1 warn: body
is 4,127 words against the 3,200–3,900 band, 373 under the 4,500 ceiling. The editor's account is
accurate — roughly 730 words of existing prose were cut to absorb eleven P0 repairs and twelve
accepted P1s onto a draft already at the band ceiling, and closing the gap would have meant cutting a
repair or a protected passage. The named cheapest ~250 words (album-section record-making detail,
Rabbit Hole growth arrow) are both unprotected. Not a verification blocker; recording it so the
decision stays with DJ.

**8. Artifact integrity: the frozen snapshot is no longer byte-verifiable.** `context.json` is
tab-indented, but `scripts/perspective-review-gate.mjs` writes it with `JSON.stringify(context, null, 2)`
— two spaces. A formatter ran over the review directory after the snapshot phase and rewrote both
files, so `draft-reviewed.md` now hashes to `73cf7ba3…` rather than the frozen
`a793ab65…` in `context.json`, and its reader-visible body hashes to `09a363c8…` rather than
`context.json`'s recorded `a5d0da87…`. The gate never re-hashes `draft-reviewed.md`, so nothing
tripped. The snapshot's _content_ is clearly intact — the sentence-level diff against the current
draft is coherent throughout and every protected passage matched — so this does not invalidate the
review. But the freeze is currently advisory rather than enforced. Worth either excluding
`docs/content-analysis/perspective-reviews/**` from the formatter or having the gate re-verify
`draft-reviewed.md` against `draft_sha256` at each phase.

Everything else asked for by the synthesis is done. The four ledgers the brief said would go stale —
TESTIMONY, HEADING MIX, DISTRIBUTION, FORMULA FINGERPRINT — were all checked against the revised
body and all four match: five qualifying quotes with Poppy's two now placed in the household
section, seven H2s in the listed order, two type-theory paragraphs at L295 and L315, and a
FORMULA FINGERPRINT whose interior-beat and word-count entries are current.
