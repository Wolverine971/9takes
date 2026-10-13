---
artifact: perspective-verification
schema_version: 1
subject: Madonna
draft_sha256: 80ae5a3c92a77de6c4688ade2fc6c0805eac3ef825696370729c39e1458c411d
final_content_sha256: 865ebb2b42ab3552411de792a66eea0932606e11be86125c68f8b104cb48c49d
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: 2026-10-13T04:14:30Z
---

## Verification verdict

**Pass. All eight P0 items are resolved, all seven accepted P1 items are completed, and all twelve protected hits survive.**

- **What closed since `verification-initial.md`.** P0-03 was open in two FAQ answers. Both are fixed. FAQ 1 now names the July 2023 statement as "the notice postponing her tour" and says she "told ticket holders" her second thought. FAQ 2 now says she "opened her Artist of the Year speech" with the 1984 night, matching the body. The three non-blocking notes from that verification were also taken.
- **What else changed.** The revision pass made grader-driven edits to hash-covered text: the hook's third paragraph, three TL;DR bullets, the sales claims, the custody lead-in, the film paragraph, and four source tags. I checked every sentence that is new since the snapshot (122 of 304) and traced each new assertion to the packet or a saved source. The list is under "Accepted improvements check."
- **SHA chain.** `draft-reviewed.md` hashes to `80ae5a3c…411d`, matching `context.json`, `synthesis.md`, `editor-resolution.md`, `revision-resolution.md` and the supplied value. Its reader-visible hash is `dc3dfff1…6312`, matching `context.json`. The live draft's reader-visible hash is `865ebb2b…c49d`, computed with `hashReaderVisiblePerspectiveBody` before and after this file was written.
- **Covered frontmatter.** `title`, `meta_title`, `persona_title`, `enneagram` and `person` are unchanged from the snapshot. `description` changed "alive" to "in pop" (P1-07e). `faqs` is new since the snapshot and was checked answer by answer. `date` and `lastmod` are unchanged.
- **Length.** 4,410 words in the reader-visible body by an independent count that agrees with the revision log; 4,436 at the snapshot. Under the 4,500 hard stop. The Rabbit Hole is 405 words against 436.
- **Source checks run for this verification.** All from saved copies under `/tmp/Madonna-research/`. No new research was needed.
  - Time, May 27, 1985: the three quoted spans of the couch scene are each contiguous, the "take control" sentence has no comma after "not in control," and the next sentence is "Then my mother spent about a year in the hospital." The report-card passage is verbatim. "Then everything changed. My family was always split up…" follows the death, and the children were "all back together again" once housekeepers were hired.
  - People via Yahoo, May 13, 2024 (raw HTML): both Mother's Day strings are verbatim, each inside one sentence. "On Instagram Sunday" gives May 12.
  - Second transcription of the _On Purpose_ audio: "I was abandoned as a child by my own mother. And so losing a child, it was like life repeating itself." Matches the page.
  - Billboard, October 20, 2022: "peaking at No. 2 on the Billboard 200, making it her first studio LP since her self-titled debut not to reach the pole position on that chart." Billboard, April 21, 2018: "it became the lowest-selling studio LP of her career up to that point."
  - Interview, June 22, 2026: the Universal budget dispute, "Maybe they just didn't believe in me," the showrunner search that "went on for another eight or nine months," "Good thing I have another job because I need to work, I need to create," and "I reached out to Stuart."
  - Rolling Stone, September 2025: the "No" was "about me needing to forgive and make good with people that I still held grudges against."
  - Billboard's 2026 VMA winners list: "taking home seven prizes in total." Stein's memoir excerpt (Variety): the cassette sent to Lenox Hill and his call asking to meet her. TVLine, August 21, 2018: Franklin "died Aug. 16," four days before the VMAs.
- **Two small accuracy notes.** Neither touches an acceptance test. Both are under "Remaining work."

## P0 resolution check

| ID | Status | Basis |
| --- | --- | --- |
| P0-01 | resolved | (1) The quotation sits in the couch scene, opened by "Her own origin scene comes earlier, while her mother was sick." Same event and same order as the Time sidebar. (2) "Inside that grief and that labor" and "A five-year-old wrote" are gone. No sentence places the decision after the death, the remarriage or the chores. (3) "Then I realized she was crying" is in the scene. (4) "I made the most money off of every report card." |
| P0-02 | resolved | (a) The blockquote reads "I still have to prove that I'm _Somebody._" and matches FP-02 from "Because even though" to "never will." The memo comment is fixed. (b) "and I think he was devastated too" is present. (c) "appropriate to air it at this time" is verbatim in FP-13 with the negation outside the marks. "At the turn of April 2003… the album three weeks out" agrees with a March 31 or April 1 statement and an April 21 release. (d) The two _On Purpose_ fragments stay in quotation marks. The pass notes log the second transcription with clip range, timestamp and wording, and the saved transcript matches. The custody clause now reads "settled in 2016" and states no living arrangement. |
| P0-03 | resolved | Previously open in the FAQ block. (1) No "explains her better than any interview," no "entire psychology," and no equivalent in the body, the TL;DR or the FAQs. (2) Body: "sixteen days later, telling ticket holders the tour was postponed." TL;DR: "she told ticket holders." FAQ 1: "the notice postponing her tour after a 2023 coma, in which she told ticket holders her second thought on waking, after her children, was not disappointing them." (3) Her meaning of the "No" and "I need to work, I need to create. I need to do what I was put on this earth to do" are both in the section, in her words. (4) Body: "The Enneagram's answer sits beside hers… she opened her speech, again, on the person who told her she was finished." FAQ 2: "she opened her Artist of the Year speech at the MTV VMAs with the 1984 night." "That is why" is gone. |
| P0-04 | resolved | (1) No "never spoke of it again" and no "never mentioned again." The TL;DR, the childhood section and FAQ 5 each say "by her account" and name her father. The aging section and FAQ 4 use her 2024 words, now quoted through "gone to sleep" in both places. (2) "Nothing happened next" is gone; the page says the children "were split among relatives for a while." (3) The paragraph has no "only other person" and no "the one sibling." It gives his objection in his words ("OK, there are no boundaries now"), quotes through "life story," and says nothing on when the estrangement began. (4) "Her stated reasons are political, and they are reason enough. The rest is this page's reading, which she has never offered." (5) All three named sentences are present. The heading is unchanged, as decided. |
| P0-05 | resolved | The Malawi paragraph is cut. No "Malawi," "Mercy," "Blantyre" or "counter-entry" in the body or the frontmatter. |
| P0-06 | resolved | hooks is given two claims, both in TP-11 as read: the "Like a Prayer" video, and _Truth or Dare_ as a star making dancers who depended on her for a living submit to her will. Vogueing is in the page's voice ("The vogueing came out of Harlem ballrooms first."). She is identified as "the Black feminist critic." The 1992 section is unchanged since the initial verification. |
| P0-07 | resolved | (1) The type section quotes the refusal to apologize ("the way that I look or dress") beside the long-lens explanation. FAQ 3 paraphrases it. (2) "Every backlash" is gone. The rule reads "By our reading of the record below, outrage alone rarely moves her. Her two big changes of product, after 1992 and after 2003, each followed an album that undersold." The 1984 and 1989 beats do not contradict it, and the backlash section carries the specifics with Billboard named for each. (3) "Someone who doesn't care what you think doesn't explain camera optics to you" is present. See Remaining work item 1 for a word-order note that does not affect these tests. |
| P0-08 | resolved | (a) "her lowest-selling studio album to that point (Billboard)." (b) "Withheld for fifteen years" is gone, and the singing insult is "an older insult" with no tie to Kakutani. No Grammy claim was substituted. (c) The Ritchie parenthetical is gone entirely, "two decades" is gone, and the Rabbit Hole says "a Kabbalah practice begun in the mid-1990s." |

## Accepted improvements check

| ID | Status | Basis |
| --- | --- | --- |
| P1-01 | completed | "I'm compulsive about being in control" is in the "Why not" section. The section says what the control serves with "all of my will has always been to conquer some horrible feeling of inadequacy." The revised lead-in ("in Vanity Fair that same year, a few sentences before the 'mediocre' line") is accurate against FP-02. The step from her "will" to "control" is the page's, as P1-01 directed. Remembering insults is no longer used against Type 8. Shame is separated from embarrassment in one clause. |
| P1-02 | completed | Confidence can be ranked: type committed, wing "a looser call than the type," subtype "The least certain call here." No duration on "paralyzed." No loyalty claim and no forward reference. "Shame" does not appear in the box. The falsifier separates the types ("An Eight would leave that record; a Three would not") and names the best contrary evidence. Net 31 words out. |
| P1-03 | completed | The Mother's Day sentence is verbatim from People's printing, dated May 12, 2024, and not joined across a gap. The show count is consistent: "the eighty-first show" in the hook and "81 shows" in her line. The O2 sentence no longer carries a count. The last two lines are unchanged. |
| P1-04 | completed | Leno in January 2012 and the VMA stage in August 2018 are both dated. The 2018 occasion is named ("remarks that began with Aretha Franklin, who had died four days earlier"). The criticism is not mentioned, so her reply is not needed, and it is not quoted. |
| P1-05 | completed | All five required glosses are in place: the Grammys close-ups, MTV dropped from the fights list, Kamins and the demo's route to Stein, the corrected Interview setup, and "her daughter Lourdes Leon." |
| P1-06 | completed | (a) "She rehearsed it like a debut anyway" is gone. The revision pass replaced the AP rehearsal sentence with "Ten months earlier she had been in an induced coma. Rio was the eighty-first show of the tour it postponed." That is a different repair from the one the synthesis sketched, and it meets the test: the hinge now rests on dated facts in the packet (June 24, 2023 to May 4, 2024; 81 shows by S42 and by her own count). It is the swap UNFAMILIAR-C3 offered. (b) The Beatty scene follows Vanity Fair, and "He thought he was describing a flaw" is cut. (c) The Dunkin' Donuts row is gone; the assault row reads "Year one" and opens "By her account." (d), (e) Cut. (f) Leonard's two answers are quoted separately. (g) "trained with"; the Lader quotation, which traced only to Wikipedia, is now cut too. |
| P1-07 | completed | "at 68" and "fifteen years" are gone. The film paragraph is past tense throughout, and the Netflix status sentence was cut. The autocomplete sentence states the query. The description says "in pop." The round spans and "forty-eight years" are on the refresh list in the pass notes. |

No accepted P1 item was rejected or deferred. P2-01 was not taken, for length. RQ-01 was completed. RQ-02 and RQ-03 stay open behind their safe defaults, and the draft text matches those defaults.

**New assertions introduced by the revision pass.** Each has a source trail.

| Assertion | Source |
| --- | --- |
| "Ten months earlier she had been in an induced coma. Rio was the eighty-first show of the tour it postponed." | Packet timeline and FP-08; S42 and her "81 shows" (People). The coma is her account, as it already was in the snapshot. |
| "Erotica had stalled at No. 2, her first studio album since her debut to miss the top of the chart (Billboard)." | Billboard, October 20, 2022, saved copy. |
| "her lowest-selling studio album to that point (Billboard)" | Billboard, April 21, 2018, saved copy. |
| "each followed an album that undersold" | The two Billboard pages. On _Erotica_: "not as big of a hit as its predecessor." |
| "number one in forty countries (Guinness World Records)" | CLM-38. The route is Wikipedia citing _Guinness World Records 2007_; Guinness was not opened. |
| "won seven awards (Billboard)" | Billboard winners list, saved copy. |
| "she wrote on Mother's Day in 2024" | People, May 13, 2024. |
| "While the project sat, she made a record." | Interview, June 22, 2026, saved copy. |
| "a custody dispute with her ex-husband, director Guy Ritchie, over their son Rocco, settled in 2016" | S40. Nothing new; the Sean Penn clause and the accent parenthetical were cut. |
| TL;DR bullets 1, 3 and 4 | FP-02, TP-06, FP-08. Each quoted fragment is verbatim. |

No new allegation, no new person and no forward-looking claim was added.

## Protected-hit regression check

None. Every string in the brief's regression list was confirmed by exact match in the live body.

| ID | Result | Note |
| --- | --- | --- |
| PROTECT-01 | intact | Tense reading and the 2026 "I'm going to be somebody" unchanged. |
| PROTECT-02 | intact | "The win quiets the feeling for a while…" and "She calls it fear, but look at what she is afraid of" unchanged. The sentence after the second one was cut; the protected sentences were not edited. |
| PROTECT-03 | intact | "Weigh that as a hostile account." and "…comes from Madonna, and Madonna films things." unchanged. |
| PROTECT-04 | intact | All five strings unchanged. |
| PROTECT-05 | intact | Both evidence-type markers present. |
| PROTECT-06 | intact | All five strings present. The lead-in is now "'Aging gracefully' is a request." The page describes commentary about her face and never comments on it in its own voice, in the body or the FAQs. |
| PROTECT-07 | intact | "He was describing the operating system. She kept his complaint in her own final cut." |
| PROTECT-08 | intact | The foreman turn, Price's quotation and the "job" line unchanged. Leonard's quotation is two separate fragments, as P1-06(f) required. |
| PROTECT-09 | intact | The $35 open, Stein's line, the Gaga sentence, the teardown paragraph and the last paragraph are unchanged. The ledger keeps its form with three rows. The hook's third paragraph, which is not part of this hit, was replaced. |
| PROTECT-10 | intact | Both lines unchanged. |
| PROTECT-11 | intact | The wedding-cake paragraph, the second-thought blockquote, the inner-thought paragraph and "For her, no win stays won…" unchanged. |
| PROTECT-12 | intact | Custody passage in her words only; no suicide disclosure; nothing characterizes Rocco, and Sean Penn is no longer mentioned. Family-deaths paragraph unchanged. "By her account," "at 67," "estimated" and "the largest crowd of her career" present. No forward-looking claim. "They belong to one system" and the Type 1 sentence unchanged. The H3 and the first sentence still commit to Type 3. |

## Remaining work

**Blocking.** None.

**Non-blocking.** Neither item affects the gate. Any edit to the body or the FAQs changes the reader-visible hash, so taking either one means running this verification again.

1. **Type section and FAQ 3, the order of the 2023 post.** The body says her statement "refused to apologize for 'the way that I look or dress,' then explained that the photos were taken 'with a long lens camera…'" FAQ 3 says she "refused to apologize and then said a long lens had distorted the photos." In the post the long-lens sentence comes first and the refusal comes later (FP-07; the CBS copy introduces the refusal with "Madonna continued"). Both halves are reported accurately and P0-07's tests do not turn on order. The minimum fix is "and" in place of "then" in both places.
2. **FAQ 2, "her manager."** The answer says "the 1984 night her manager told her that her career was over" in the page's voice. In the 2026 speech she corrects herself to "the assistant to the manager," and FP-12 marks who said it as unresolved. The body avoids the problem by quoting her. A fix would be "the 1984 night she says she was told her career was over."

**Carried forward, unchanged by this verification.**

- RQ-02: nobody in the pipeline has viewed the _Truth or Dare_ graveside scene. RQ-03: the bell hooks essay has not been read in print. Both safe defaults are in place.
- DJ's calls from the two resolution logs: whether "I'm really good friends with my son" belongs beside the custody passage; whether P2-01 ("But it's not enough") is worth 25 words; whether the English-accent query gets a sixth FAQ; and length, which is 4,410 against a 3,900 band with every large cut held by a protected hit.
- The RQ-01 transcript and the two Billboard pages live in `/tmp` and will not persist. Their wording is reproduced in the draft's pass notes and in the two resolution files.
- Lint warns that `published: true` disagrees with `production_pretext.status: draft`. That field is outside this gate.
