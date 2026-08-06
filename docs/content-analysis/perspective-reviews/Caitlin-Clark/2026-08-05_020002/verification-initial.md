---
artifact: perspective-verification
schema_version: 1
subject: Caitlin-Clark
draft_sha256: 4573f054476806a5f939660a6be57fbeafce53b0941d183d6fb2df9b186a2925
final_content_sha256: e38aaaea002f5336799727e838fa9ca2f88826d2e048628170a038c4818438ea
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-08-05T07:50:52Z
---

<!-- docs/content-analysis/perspective-reviews/Caitlin-Clark/2026-08-05_020002/verification-initial.md -->

# Perspective verification — Caitlin Clark

## Verification verdict

**Pass.** All ten P0 repairs satisfy their acceptance tests against the current live draft. All eleven
accepted P1s are completed. All eleven `PROTECT-*` items survive, and the two hits the editor recorded
as "spent" were both pre-adjudicated by the synthesis rather than lost in execution.

Snapshot integrity confirmed:

- `shasum -a 256 draft-reviewed.md` → `4573f054…f9b186a2925`, matching `context.json`, `synthesis.md`
  frontmatter, `editor-resolution.md` frontmatter, and the supplied `--draft-sha`.
- `hashReaderVisiblePerspectiveBody(draft-reviewed.md)` → `19531b42…d0e7d9246`, matching
  `context.json:reader_visible_content_sha256`. The frozen body is the body that was reviewed.
- `hashReaderVisiblePerspectiveBody(src/blog/people/drafts/Caitlin-Clark.md)` → `e38aaaea…4818438ea`.
  Recorded above as the post-edit reader-visible hash.

One artifact discrepancy worth recording, resolved as benign: `editor-resolution.md` reports a
post-edit whole-file SHA of `2d49a25e…`, and the current whole-file SHA is `befcb798…`. The delta is
frontmatter, not prose — the frontmatter-enrich stage ran after the editor pass and added five `faqs`
entries (the resolution's "Unresolved decisions" item 5 says enrich had not yet run; lint now reports
`faqs present and FAQPage-eligible (5 real Q/A pairs)`). I diffed the full reader-visible body against
the frozen snapshot line by line; every prose change maps to a logged repair, a logged funding cut, or
one of the four unlogged trims listed in Remaining work. No unexplained body edit exists.

Exit state: `blog-lint.sh` **0 fail, 2 warn** (4,497 words against the 4,500 ceiling; 1 comparative
contrast pattern, which is the protected PROTECT-05 sentence the synthesis ruled must not be rewritten).

## P0 resolution check

| ID | Verdict | Acceptance test applied to current text |
| --- | --- | --- |
| P0-01 | **resolved** | Both halves of the TIME position are stateable from H2 3 alone: the concession sits in the block quote (line 253), and "She never conceded the larger point. She told the same magazine she knew she was good enough for that roster, and called the omission a blessing that woke a monster." carries the assertion (line 256). "she has no mechanism for pretending otherwise" — 0 occurrences. No sentence claims she cannot defend herself; the close now reads "went on believing she belonged… it did not change what she thought she was worth." "That is not grace" survives verbatim, and the paragraph did not soften into admiration. |
| P0-02 | **resolved** | Scout team, blue squad, walk-ons, week's assignment, mid-drill whistle and "back in for the next drill" — 0 reader-visible occurrences (the only hits are inside the stale SECOND PASS NOTES comment; see Remaining work). The surviving sentence is "Bluder called technical fouls on Clark in practice more than once, sometimes from the bench herself when no hired official would, and once sent her off the floor entirely." Recurrence is stated. Each concrete element traces to a ledgered source: the recurring-technicals framing to Bluder (S-21/S-22), the ejection to Jensen, attributed inline one paragraph later ("Bluder's successor as Iowa head coach, Jan Jensen, tells that last one…"). Propagations agree: H2 1 "took to calling technical fouls on her in practice"; Rabbit Hole wing "the same coach who kept calling technicals on her in practice." |
| P0-03 | **resolved** | The H2 1 block quote now matches evidence-packet S-03 (lines 116–119) word for word, including "I come in here every single day and I want to put in the work and get everything done because I want to be the best player in the world and I want to help this team win." No unmarked internal excision remains in any block quote in the draft. The Rabbit Hole rendering that terminated at the same comma is gone entirely. PROTECT-01-family sentences survive verbatim, and the unpacking absorbs the restored clause rather than ignoring it: "Being the best player in the world is a standard, and no scoreboard signs off on a standard." |
| P0-04 | **resolved** | The invented Seattle datum ("She followed the greatest scoring night in league history by finding a three-point margin to be unhappy about") is gone. Its replacement is sourced: "Her own account of the reflex: 'I'm always analyzing my play. I'm always trying to find ways to be better.'" (S-05). I checked the other direction too — no discriminator anywhere in the article cites content that appears only in an `inner-thought` block. Both blocks kept. |
| P0-05 | **resolved (strong version)** | Framing marked: "the reading here is that Clark grades correctness at the moment of decision." Mechanism sentence verbatim and uncompressed: "Whether the ball arrives is a separate question, settled a half-second later by four other people." Her competing account is carried and argued with rather than suppressed, and a falsifiable observable is named: "Watch for the night she takes the safe pass to protect a number. This reading does not survive it." See Remaining work item 2 on the venue/date attribution attached to that quote. |
| P0-06 | **resolved** | The paragraph now uses her verbatim S-31 answer: "Not really. When they announced it and everybody screamed, that's when I knew." "she did not feel it" — 0 occurrences; replaced by "the building had to tell her," which is what S-31 supports. "a career scoring total is an accounting somebody else keeps" kept. |
| P0-07 | **resolved** | Block quote reads "Those are helluva numbers. But, to me, that's not dominating." "hella good" — 0 reader-visible occurrences. "in the same breath" → "in the same appearance." Both files agree: `docs/content-analysis/research/Caitlin-Clark.md:129` now carries "helluva numbers" with an inline provenance comment at line 130 recording the correction, so the misquote cannot re-propagate on refresh. The TESTIMONY LEDGER matches. PROTECT-03's argument untouched. |
| P0-08 | **resolved** | TL;DR bullet 4 reads "four years and one league apart, both land on 'perfectionist.' Both attach the same prescription to it: give yourself some grace." "Neither of them means it as a compliment" — 0 occurrences. No surviving sentence characterizes Bluder's or White's attitude in terms their quoted words do not support. |
| P0-09 | **resolved (cut)** | Cooper appears nowhere in reader-visible prose; the only hits are an HTML-comment note in the TESTIMONY LEDGER recording why she was removed. No third party is described as confirming the article's inference. Verified the surrounding mechanism paragraph was not shortened to absorb the cut — it is longer than the frozen version, not shorter. |
| P0-10 | **resolved (ENN path b)** | "intensity toward a single rival" — 0 reader-visible occurrences. I read `src/blog/enneagram/enneagram-type-1.md:328-334` directly. The pillar gives the sx One as "The one-to-one One (Zeal): The countertype… This One's anger runs hot and outward, aimed at perfecting other people and society more than the self… Frequently mistyped as an 8." The draft's new paragraph is consistent with it word for word in substance: "The one-to-one One, the Zeal countertype, runs anger hot and outward and gets mistyped as an Eight for exactly that." The H2 7 anger-direction evidence is now engaged rather than left contradicting the call ("Bluder's list of her targets starts with 'mad at herself.' The Zeal One starts pointed outward; Clark's overflow comes off an audit pointed in"). The Rabbit Hole was not expanded — it is shorter than the frozen version. |

**Open P0: 0.**

## Accepted improvements check

| ID | Verdict | Evidence in current text |
| --- | --- | --- |
| P1-01 | completed | "Eight days after that final, Indiana took her first overall in the WNBA draft," followed by "as a rookie for a Fever team that had started 3-9." A reader who cannot name a WNBA team can answer both halves of the acceptance question from the sentence. |
| P1-02 | completed | Ranks softened to "top three in the league in scoring and top two in assists"; "with two months and a postseason still in front of them" added; injury bound to "the August injury report with a back problem"; "who now coaches her in Indiana" → "who took over as her head coach in Indiana in 2025"; threes row re-tensed to "Got to 200 career threes in 74 games, faster than anyone in league history had"; TL;DR bullet 2 → "set its record for giving the ball away." I grepped the whole reader-visible body for `now`: two hits, neither attached to a role, title, status or ranking — one is past-tense narration ("the audience she was now bringing to the door"), one is inside a Clark quote ("makes me emotional right now"). PROTECT-09 stamp verbatim. |
| P1-03 | completed | "Threes do not get called for a T by their own coach at a closed practice. Ones do." — 0 occurrences. Replaced by "She spent room-management capital in a gym with no audience in it." I checked the rest of the draft for the same defect shape: no surviving sentence asserts a type is incapable of a behavior. |
| P1-04 | completed | "had spent two years as the most-watched athlete in her sport" cut; the cold open now stops at the 66-of-67 credential. No cold-open superlative is contradicted by a later section. |
| P1-05 | completed | "three or four" and "four years old" — 0 occurrences each. H2 2 and the closing bookend both carry the sourced motive without an age. |
| P1-06 | completed | (a) "Andrews pointed out that she had not capped herself there. 'We'll have to see,' Clark said, with a wry smile." (b) H2 7 now closes on "'The fire and the passion, that's what makes me, me,' she told ESPN, and said nobody should ever try to take that away from her." PROTECT-06 sits one paragraph upstream of that ending, as required. |
| P1-07 | completed | Sequencing added: "Twelve days later, after Connecticut's DiJonai Carrington had said publicly that Clark was not being vocal enough about it, she said this:". Named criticism added: "ESPN's Monica McNutt said there was 'room for a little bit more accountability and self awareness in terms of her role in the larger sisterhood.'" The "fearful" trap was avoided — that construction is not quoted anywhere in the draft. PROTECT-02 family ("no standing to argue with at all") kept verbatim. |
| P1-08 | completed | "If the pattern holds, the drive home sounds something like this." precedes the H2 4 block only. The H2 8 block is unlabeled and still followed by its existing cue ("Her own account of it, given to ESPN months later"). Both blocks kept. |
| P1-09 | completed | Andrews identified at first use ("ESPN's Malika Andrews", the article's first two words); Bluder at first use ("at Iowa she rode her own teammates hard enough that her head coach, Lisa Bluder"); Jensen's broken referent fixed ("Bluder's successor as Iowa head coach, Jan Jensen"); the Cooper repair disappeared with P0-09. I also spot-checked the other named third parties — Swoopes, White, McNutt, Carrington, Carter, Nizzi-Clark, Linder, Reese — each carries a relationship at first mention. |
| P1-10 | completed | The counterargument now targets the sp-Three and discriminates on core fear: "A Three's dread is worthlessness and it attaches to output. A One's dread is corruption and it attaches to character," pointing back at the H2 6 filter rather than restating it. PROTECT-05 was not compressed to fund the pointer — it is byte-identical to the frozen version. |
| P1-11 | completed | "South Carolina's bench outscored Iowa's 37-0 that night; Iowa's reserves attempted three shots all game. In the biggest game of her career there was nobody to hand it to." The heading's promised "why" is now answerable from the section. |
| P2-02 | completed (optional) | Four-arrow evidence swapped to "people didn't understand how I was wired," per the synthesis's step 4. |

**Accepted P1s unresolved: 0. Rejected-with-reason: 0. Deferred-with-reason: 0.**

RQ status, for the record: RQ-02 and RQ-03 resolved; RQ-04 moot with P0-09; RQ-01 unresolved and the
draft rebuilt so it no longer depends on the answer (the tempo claim is not published, which is what
the synthesis required); RQ-05 deferred as the upgrade path the synthesis said it was. None of these
block the gate.

## Protected-hit regression check

All eleven survive. Verified by exact-string comparison against `draft-reviewed.md`, not by reading
for gist.

| ID | Verdict | Note |
| --- | --- | --- |
| PROTECT-01 | intact | Mechanism sentence byte-identical. Framing changed by exactly the one sentence P0-05 authorized. The paragraph is longer after the pass, not shorter — P0-09's cut did not shorten it. |
| PROTECT-02 | intact | "She also keeps the check. Both are true, she has not solved it, and there may be no version of her career in which she can" verbatim, in the body, unresolved, no salary figure. "no standing to argue with at all" verbatim, per conflicts 2 and 3. |
| PROTECT-03 | intact | "it was partly correct, and the fan base that spent a year screaming at Swoopes never engaged the part that was", "rookie efficiency was ordinary by superstar standards", "on the timeline she was right" all verbatim. Only the quoted wording and "same breath" → "same appearance" changed. |
| PROTECT-04 | intact | "Three points. Against a 6-21 team. With 45 from her." and "the right read versus a bailout" verbatim. Only the threes row re-tensed, per P1-02. |
| PROTECT-05 | intact | The H2 6 filter paragraph is unchanged from the frozen snapshot — it does not appear in the body diff at all. Its comparative contrast pair is the one lint warning, correctly left alone. |
| PROTECT-06 | intact | Verbatim, and now standing as its own paragraph upstream of H2 7's new P1-06 ending. |
| PROTECT-07 | intact | "Nobody has told her the gap closed" verbatim; only the age removed. |
| PROTECT-08 | intact, follow-through re-hinged | The hook through the one-word "Six." paragraph survives, including the one-word paragraph. The two edits inside the span are the authorized P1-09 identifier and the P1-04 superlative cut. The re-hinged sentence sits *after* "Six.", outside the protected span, and the synthesis declared PROTECT-08 "contingent on RQ-01" while forbidding publication of the tempo claim unverified. Removing it is compliance with an adjudicated instruction, and the insight survives in tighter form ("She was asked for a number and returned a verdict with the evidence attached"). **Not scored as a regression.** |
| PROTECT-09 | intact | "It is August 2026, and she is spending the hours again" verbatim; the H2 8 hotel-room heading verbatim. Only what follows the stamp was re-tensed. |
| PROTECT-10 | intact | "The rest of the analysis stands on its own" verbatim. Section not expanded. |
| PROTECT-11 | intact | "I mean, like, yes" inside the body block quote. |

On the editor's self-reported "one and a half hits spent": both were adjudicated in advance by the
synthesis, not lost in execution. UNFAMILIAR-H4 (the walk-on gloss) is not one of the eleven
`PROTECT-*` items — the synthesis ruled on it directly in conflict 6 ("sourcing wins, pending RQ-02"),
and RQ-02 returned negative. PROTECT-08's contingency was written into the protected-hits list itself.

**Protected-hit regressions: 0.**

## Remaining work

None of the following blocks the gate. All four are recorded so the next stage does not have to
rediscover them.

1. **Two stale production comments now contradict adjudicated rulings, and one of them instructs a
   future editor to undo P0-09.** `SECOND PASS NOTES` (line 473) still describes the deleted scene as
   an accuracy correction — "It was a technical foul called during a drill against the scout team, and
   she was back in for the next drill" — and line 485 says "Cynthia Cooper quote is trimmed to its
   shortest useful fragment purely for length. If an editor pass frees words, restore the fuller
   line." Neither is reader-visible, so neither is a P0 failure. But the second is a live instruction
   to restore a sentence the synthesis ruled must be cut, and the October refresh is the pass most
   likely to read it. The practice-scene note is already neutralized by the `[Editor pass 2026-08-05:
   … Do not re-inflate it into a scene.]` annotation in the TYPE-CHALLENGE MEMO; the Cooper note has no
   such counter. **Minimum action:** annotate line 485 the same way — the quote was cut for overclaim
   and non-verification (packet CLM-26, S-28), not for length, and RQ-04 does not reopen it.

2. **The Sue Bird attribution introduced by the P0-05 repair conflicts with the packet's own dating.**
   The draft asserts "On Sue Bird's podcast in August 2025"; the TESTIMONY LEDGER records "*Bird's Eye
   View* with Sue Bird, reported by SI, August 2025." The packet's S-29 dates the turnover material to
   **2024** (Pro Football Network, headline-level only), and the synthesis's RQ-03 assumed *Bird's Eye
   View*, **2024**. The editor states it pinned the primary to an SI report of 2025-08-08. That is a
   source trail, so verification check 6 passes on its face — but it is asserted in the resolution log
   and corroborated nowhere in the review artifacts, and it contradicts the packet. P0-05's acceptance
   test does not depend on the date, so I did not open research on it per the verifier's scope limit.
   **Minimum action:** confirm the SI piece and its date before publish; if it is the 2024 appearance,
   the in-body date and the ledger both need correcting.

3. **The enrich stage re-stated P0-05's hedged mechanism as unhedged fact in the frontmatter.** FAQ 3
   reads "The resolution is that she grades correctness at the moment of decision, not at the moment
   the ball arrives" — the exact assertion-as-property framing that P0-05 was convened to convert into
   "the reading here is that…". The perspective hash ignores frontmatter by design, and the body
   paragraph passes its acceptance test, so this is not an open P0. It is not inert either:
   `PeopleBlogPageHead.svelte:111-116` feeds `faqs` into FAQPage JSON-LD, so this is the version search
   and answer engines get. **Minimum action:** one clause in FAQ 3 — "the reading here is that she
   grades correctness…" — matching the body.

4. **One unlogged block-quote trim repeats the directional-compression habit this pass was convened
   over.** The Letterman sports-psychologist quote lost its closing clause: packet S-06 reads "…the
   effect and the power that I could have on people, whether it was negative or whether it was also
   positive"; the draft now ends at "…that I could have on people." This is a terminal truncation, not
   a mid-quote excision, so it does not violate P0-03's acceptance test — every word between the
   draft quotation's first and last words is present. But the dropped clause is the balancing half
   ("or whether it was also positive"), removed in the section arguing her effect on the room was
   costly, and it was not recorded in the resolution log. **Minimum action:** either restore the clause
   or accept it as a word-budget trim knowingly; three other unlogged trims in the same funding pass
   (the "pull-up threes" style detail, "at any level" in the Nielsen line, "and it detonated") are
   cosmetic and need nothing.

Also carried forward unchanged from the editor's own unresolved list, since the gate does not touch
them: the body sits at 4,497 of 4,500 with the October postseason refresh not optional (a pipeline
policy call for DJ — one-time `BLOG_LINT_WORD_CEILING` exception, or cut ~150 words before adding
anything), and RQ-01's tempo fact remains unverified with the article no longer depending on it.
