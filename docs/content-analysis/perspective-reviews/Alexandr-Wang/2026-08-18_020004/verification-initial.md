---
artifact: perspective-verification
schema_version: 1
subject: Alexandr-Wang
draft_sha256: 90b3e93277b347fb9018465040de2486a12f4bccdeb78be8ed1e1383c3f2cea3
final_content_sha256: df930d0ccd416916aad3edaba0fd87a16d1b2d0a31417fb6ac6815ee207b5fec
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-18T07:26:10Z
---

## Verification verdict

**Pass.** All seven P0 acceptance tests are met in the current live draft, all fourteen accepted P1
items are completed, and all fourteen `PROTECT-*` items survive — the twenty-five protected strings
grep byte-identical, and the three protected passages that sit inside edited paragraphs (the
epigraph and opening, the privacy sentence, the closing movement's final two lines) diff clean
against the frozen snapshot.

Provenance checks:

- Supplied `--draft-sha` `90b3e932…` matches `context.json:draft_sha256`, `synthesis.md`
  frontmatter, and `shasum -a 256` of `draft-reviewed.md`. Frozen snapshot verified.
- `context.json:reader_visible_content_sha256` `93c3433d…` reproduces from `draft-reviewed.md` with
  `hashReaderVisiblePerspectiveBody`. The current live draft hashes to `df930d0c…`, confirming the
  reader-visible body did change.
- `lastmod` is `2026-08-18` in both files — untouched, per house rule.

Independent verification of the repairs' factual content was not needed: every P0 acceptance test
resolved against the draft's own text or against packet claims the synthesis had already
adjudicated, so no new research was run. Two P0 repairs rest on facts the editor verified externally
and recorded (LeCun's crediting clause; the Washington Post response); both are logged in the draft's
own testimony ledger with outlet and date, which satisfies the source-trail check.

## P0 resolution check

| ID | Status | Evidence in current draft |
| --- | --- | --- |
| P0-01 | resolved | The generalization is now scoped to his telling and set against his record: "He tells it as though he has made every room by exactly one spot… The record says otherwise. He was the youngest self-made billionaire in the world at 24, and Zuckerberg paid $14.3 billion for 49% of a company substantially to get him into a building. Nobody sneaks in on those terms." No sentence asserts narrow qualification outside the sixth-grade competition. PROTECT-01's callback "Ranked, seeded, cut lists, top four in the state." and PROTECT-02's payoff both verbatim. |
| P0-02 | resolved | "He also gave him something: 'He learns fast, he knows what he doesn't know.' Then the specific charge…" Mirrored in FAQ 4 ("He allowed that Wang 'learns fast…'") and testimony ledger entry 2. No sentence characterizes the verdict as wholly dismissive. |
| P0-03 | resolved | Zero occurrences of "twenty year" in the file. Body ¶2 reads "Sixteen years later"; FAQ 1 reads "the ten years since he left MIT". Both derive from dates the article states (born January 1997 / episode February 2025 / left MIT 2016, stated in FAQ 2). |
| P0-04 | resolved | Split as specified: "In March 2025 Scale became prime contractor on Project Thunderforge, the Defense Innovation Unit's military planning program, **on an award with no published dollar value.** Fourteen months later the Pentagon's Chief Digital and AI Office put $500 million behind its Scale contract, five times the previous September's deal." No dollar figure attaches to Thunderforge; the $500M is attributed to CDAO. See Remaining work #3 on the date being relative rather than absolute. |
| P0-05 | resolved | Order inverted and the beat labelled: the sourced scene ("I literally teared up," told Forbes; "an attendee heard him ask") now runs first, then "Nobody recorded the rest. Here is what this article thinks was running underneath the sentence he could not finish:" ahead of the `inner-thought` block. Rabbit-hole tiebreaker now reads "by one attendee's account he corrected it out loud." A cold reader can separate record from reconstruction without leaving the page. PROTECT-14's three elements verbatim; the device was marked, not cut. |
| P0-06 | resolved | Table row 2: "Google dropped Scale as a labeling vendor within weeks… **then resumed months later; OpenAI, already pulling back before the deal, did not return**". Growth arrow: "Google came back a few months later. OpenAI did not." Neither passage implies permanent attrition; the arrow now leans on the durable loss ("while your own name is the reason its biggest customer walked"). PROTECT-04, three paragraphs above, untouched. |
| P0-07 | resolved | Harshest case now carries the labor charge: "And the company he sold was assembled out of judgment bought at 30 cents for four hours from people who then had to chase the payment." The concession acknowledges it is not dissolved: "the psychology does not reach the taskers at all. Knowing why a man built a machine tells you nothing about how it treated the people inside it, and on that the reporting is not ambiguous." PROTECT-05 and PROTECT-13 intact. |

`open_p0: 0`.

## Accepted improvements check

All fourteen accepted P1 items are **completed**. None was rejected or deferred.

- **P1-01** — completed. TL;DR bullet 4: "in the internal memo announcing the deal that bought him." Spot-checked the full witness set the acceptance test names: Sarah Guo carries "the investor who had the founders in her pool house"; Cameron Stanley carries his title and agency; Lucy Guo's exit is narrated in the same paragraph as her quote; LeCun's declaration is intact and lengthened.
- **P1-02** — completed. Row 1 corrected to one late-start departure ("one lasted under a month in the core lab and one left before his official start date") with a third column that implements the synthesis's own proposed wording. Row 2's third column is the free thesis payoff and unambiguously cuts against him: "Headcount metrics do not count contractors, which is how a cut touching 700 people gets reported as 200." Row 3 adds both beaten competitors. PROTECT-11's header, vendor flag and closer verbatim.
- **P1-03** — completed. "unprompted" returns zero matches. Body now reads "when Von asks whether he won it, the margin", consistent with FAQ 1's "Asked about". The retired not-X-but-Y move is recorded in the fingerprint ledger, which now hand-counts 0 authorial moves. PROTECT-09 verbatim.
- **P1-04** — completed. All three reasons restored ("compute per researcher, talent density in a small group, and freedom to take bold research bets"), and the counterexample stands for a beat before the ironic reading: "Sit with that for a beat, because it is the best evidence against this article." The ironic reading survives unchanged.
- **P1-05** — completed. Wang's "strongly disagree[s]" qualifier, the three named endorsers, and a named outlet objection (TechCrunch) all precede the psychological reading. PROTECT-13's landing is still the paragraph's landing.
- **P1-06** — completed. "first commercial" returns zero matches; "first coding product" is consistent across intro (`:143`), closing section (`:319`) and FAQ 3.
- **P1-07** — completed. The unnamed Fortune quote appears only on the ledger's EXCLUDED line. No unnamed source in reader-visible copy.
- **P1-08** — completed. Subtype paragraph names the framework and both readings ("Read as Naranjo's countertype… Our own subtypes guide takes the other common reading… Either lens leaves the social call standing"). Wing paragraph drops both bad legs and substitutes the honest scope limit ("nearly all the warmth on record was deployed in a hiring context"). No sentence attributes the name spelling to a choice Wang made; no sentence claims an emotional display cuts against the 2 wing.
- **P1-09** — completed. "make sense of that data, and **then** structure it" restored in both body and ledger entry 6.
- **P1-10** — completed. "The price list at launch carried a standard tier and, beneath it, a contributor tier…" No imperative, no live-page instruction; the claim is bounded by launch. The final four paragraphs read intact with the pricing page assumed gone.
- **P1-11** — completed. "And the June 2025 reorganisation briefly put him under Wang before he left. LeCun waves that part off: 'You don't tell a researcher what to do…'" Three distinct interests are now legible: competing company, decade-old architectural prior, reporting line. PROTECT-06 verbatim and levelled up, not diluted.
- **P1-12** — completed. Zhao is named *and used*: "It does not answer LeCun, who was talking about Wang himself. It answers the org chart, with the move he has made since he was 19." Placed after the Alex Ren pairing, so PROTECT-03 remains the section's pivot.
- **P1-13** — completed. "who still tells it as though he barely made the cut" — a claim about his telling, not his private certainty. Closing two lines diff byte-identical against the frozen draft.
- **P1-14** — completed. (a) "In March 2024 Remotasks abruptly cut off workers… Rest of World reported it the following month." (b) "~500 contractors" in the table row and "roughly 500 contractors" in the rabbit hole, alongside the 200/14% figure. (c) "Both answers were specific," now true because RQ-02 supplied the Washington Post response. PROTECT-07's numbers and the "Somebody wrote the rubric" construction untouched.

Research questions: **RQ-02** and **RQ-03** resolved and applied as logged (RQ-02 added Anna Franko's response plus the Post's rebuttal, and is recorded as testimony ledger entry 7 with outlet and date; RQ-03 confirmed "prompts and completions" and is recorded in the fingerprint ledger). **RQ-01** was deliberately not attempted, which is what the synthesis's revision brief instructed — "do not attempt to resolve inside this revision" — and nothing in the shipped draft references the settlement, so no acceptance test depends on it.

Optional items taken: **P2-01** (Surge AI foil, three sentences, plus the FAN-R4 rescope from "the supply chain underneath most of the industry" to "one of the supply chains the industry runs on") and a light **P2-06** ("Hold it loosely: he also owns a large piece of what he is defending."). P2-02 through P2-05 and P2-07 through P2-10 remain open and optional, as intended.

## Protected-hit regression check

All fourteen survive. `protected_hit_regressions: 0`.

- **PROTECT-01** — all four positions intact. Epigraph and opening paragraph diff byte-identical against the frozen draft; "Ranked, seeded, cut lists, top four in the state." and "Top four in New Mexico. He came fourth." both present verbatim. The three edits passing through it (P0-01, P0-03, P1-03) each changed only their scoped span.
- **PROTECT-02** — verbatim.
- **PROTECT-03** — verbatim; the Zhao material sits after it, not between it and its payoff.
- **PROTECT-04** — the stress-arrow refusal and both falsifiers verbatim, including "so far." P0-06 and P1-08 edited the same rabbit hole without entering these paragraphs.
- **PROTECT-05** — closing movement diffs clean except P1-13's single scoped clause; final two lines byte-identical.
- **PROTECT-06** — verbatim; both P0-02 and P1-11 added ahead of it.
- **PROTECT-07** — "36", "all but two said payments had been delayed, cut or cancelled", "30 cents for four hours" all present. New labor material was added around them; nothing was traded for them.
- **PROTECT-08** — "fudged" returns zero matches anywhere in the file. The omission is still recorded in the entity-gap compliance line ("LeCun's Llama 4 benchmark allegation omitted entirely rather than half-attributed"), which is inside an editorial comment, not reader-visible copy.
- **PROTECT-09** — both sentences verbatim.
- **PROTECT-10** — the privacy sentence diffs byte-identical. No bare age, no net-worth figure, no partner named.
- **PROTECT-11** — "(Meta's reported figures, August 2026)", "What the score cannot see" and the closer all verbatim; P1-02 edited cells beneath the header only. The absolute-date habit is net stronger than in the frozen draft, since P0-04 and P1-14(a) each converted an undated or relatively-dated claim into a dated one.
- **PROTECT-12** — the fence verbatim, and the distribution ledger's discipline holds: still exactly one type-theory paragraph outside the diagnosis section and the rabbit hole ("The heart triad is the strange part"). Nothing added this pass migrated system vocabulary into the body — the Surge AI and Zhao insertions both run without type language.
- **PROTECT-13** — the Lucy Guo turn, the MEI landing and "measured, then measuring" all verbatim; the landing is still the landing after P1-05's insertions.
- **PROTECT-14** — all three elements present and verbatim.

Also held: the single em-dash in the reader-visible body is the epigraph attribution dash, identical to the frozen draft — no prose em-dash was introduced. `blog-source-audit.mjs` re-run independently: 4 load-bearing quotes, 4 inline, 0 vague, 0 untagged.

## Remaining work

None of the following blocks the gate. All are notes for the next pass.

1. **RQ-01 remains open by design.** The SF Superior Court docket for CGC-24-620481 was not pulled. Requirements are recorded in the draft's EDITOR PASS NOTES, including the constraint not to write it from a law-firm summary and never to run it without the May 2025 DOL dismissal alongside it. Separate work; nothing shipped depends on it.
2. **`citations` frontmatter was not updated for the pass's five new sources.** The list diffs identical to the frozen draft, but the revision added claims sourced to the Washington Post's Franko response (the WaPo URL is already cited, so that one is covered), TechCrunch on MEI, Forbes on Surge AI and Edwin Chen, TechCrunch/CNBC on Shengjia Zhao's appointment, and the FT relay carrying LeCun's crediting clause and reporting line. Minimum action: add those four URLs to `citations`.
3. **P0-04's $500M date is derivable rather than stated.** The acceptance test asked for the CDAO figure "with its 2026 date"; the draft gives "Fourteen months later… five times the previous September's deal", which chains two relative constructions off "In March 2025". It resolves correctly to May 2026 and the next sentence cites "Forbes in May 2026", so the repair's substance holds and the conflation the P0 existed to prevent is gone. But this is the one place the piece's absolute-date habit lapses, and the deferred P2-07 already flags relative-duration constructions. Minimum action, if taken: state "In May 2026" and "a $100 million deal in September 2025" outright.
4. **Length is a human call.** Body measures ~4,400 words against a 4,500 ceiling and a 4,050 warn threshold. The editor bought room by trimming rather than dropping P1-12, and flagged Zhao as the clean cut if DJ would rather bank refresh headroom. Recording it here so the decision is not lost: the beat is currently the section's second-strongest original connection, and cutting it costs the delight target's single largest gap finding.
5. **Frontmatter gained `wikidata_qid: 'Q112629173'` and three `same_as` entries** (Wikidata, Meta's executive page, TIME100 AI) that appear in no perspective-review artifact. These are outside the reader-visible hash and outside this review's scope — almost certainly the entity-gap enrichment stage, which produced `docs/content-analysis/entity-gaps/Alexandr-Wang.md` the same night. Flagged only so a later stage does not read it as unexplained drift.
6. **`scripts/blog-source-audit.mjs` was modified during the editor pass** to register "This Past Weekend", "Core Memory" and "Rest of World" in its OUTLETS list. Disclosed in the draft's fingerprint ledger, and the change is a tooling improvement rather than a draft repair, but it is an uncommitted repo change riding alongside this draft.
