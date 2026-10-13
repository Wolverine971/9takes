---
artifact: perspective-verification
schema_version: 1
subject: Madonna
draft_sha256: 80ae5a3c92a77de6c4688ade2fc6c0805eac3ef825696370729c39e1458c411d
final_content_sha256: 245d18a724f42c7c932a068c2b5c8122eddc5c43802f83eee310ed4cd1946a71
verification_status: fail
open_p0: 1
protected_hit_regressions: 0
verified_at: 2026-10-13T03:46:30Z
---

## Verification verdict

**Fail, on one narrow item. The body passes every P0 test. The FAQ block does not.**

- **What is open.** P0-03, in the `faqs` frontmatter only. The enrich stage (stage 6) wrote five FAQ answers after the editor's self-check. FAQ 1 restates the July 2023 tour notice as a plain record of what she thought on waking, which is the first defect P0-03 named. FAQ 2 compresses the 2026 speech to the 1984 anecdote. The fix is two sentences of frontmatter. No body edit is needed.
- **What passed.** P0-01, P0-02, P0-04, P0-05, P0-06, P0-07 and P0-08 are resolved. All seven accepted P1 items are completed. All twelve protected hits survive. No protected string was altered.
- **SHA chain.** `draft-reviewed.md` hashes to `80ae5a3c…411d`, matching `context.json`, `synthesis.md`, `editor-resolution.md` and the supplied value. Its reader-visible hash is `dc3dfff1…6312`, matching `context.json`. The live draft's reader-visible hash is `245d18a7…6a71`.
- **What changed since the snapshot.** 159 lines in, 72 out. The body changes are the editor pass. The frontmatter changes are the enrich stage: `faqs` (hash-covered), plus metadata fields outside the hash. The description changed "alive" to "in pop" (P1-07e).
- **Length.** 4,436 words before and after, by an independent count that agrees with the editor's. Under the 4,500 hard stop. The Rabbit Hole went from 436 to 405 words.
- **Source checks run for this verification.** All from saved copies; no new research.
  - Time, May 27, 1985 (`/tmp/Madonna-research/editcheck/time-1985-jina.md`): the couch scene, the "take control" sentence and the report-card passage are verbatim, and each quoted span is contiguous. "Then everything changed. My family was always split up…" follows "Then my mother died," and the next section says the children were "all back together again" once housekeepers were hired, which supports "for a while."
  - People via Yahoo, May 13, 2024 (raw HTML): both Mother's Day strings are verbatim and each sits inside one sentence. "On Instagram Sunday" gives May 12.
  - Second transcription of the *On Purpose* audio (`/tmp/Madonna-research/audio/shetty-zUvRv5JrItk-4420-4540.txt`): "I was abandoned as a child by my own mother. And so losing a child, it was like life repeating itself." Matches the page.
  - Stein's memoir excerpt (Variety, 2018): the cassette sent to Lenox Hill, Kamins shopping the demo, and Stein's call asking to meet her are all there.
  - Ciccone memoir snippets: "I make Alek put the camera back in the trunk… I ask him and Madonna to leave me alone at the grave." Supports "refused to be filmed there."
  - 2018 VMA transcript (WISN): the remarks open "Aretha Louise Franklin changed the course of my life" and include the 1984 story.

## P0 resolution check

| ID | Status | Basis |
| --- | --- | --- |
| P0-01 | resolved | (1) The quotation sits in the couch scene, opened by "Her own origin scene comes earlier, while her mother was sick." Same event and order as the Time sidebar. (2) "Inside that grief and that labor" and "A five-year-old" are gone; no sentence places the decision after the death, the remarriage, or the chores. (3) "Then I realized she was crying" is in the scene. (4) "I made the most money off of every report card." The quotation has no comma after "not in control," as in the archive. |
| P0-02 | resolved | (a) The blockquote reads "I still have to prove that I'm *Somebody.*" and matches FP-02 from "Because even though" to "never will." The memo comment is fixed too. (b) "and I think he was devastated too" is restored. (c) "appropriate to air it at this time" is verbatim in FP-13 with the negation outside the marks; "At the turn of April 2003… the album three weeks out" agrees with a March 31 or April 1 statement and an April 21 release. (d) The two *On Purpose* fragments stay in quotation marks; the pass notes log a second transcription with clip range, timestamp and wording, and I confirmed the saved transcript. The custody clause says only that the dispute "was settled in 2016." |
| P0-03 | **unresolved (FAQ answers only)** | Body and TL;DR pass all four tests. FAQ 1 fails test (2). FAQ 2 is borderline on test (4). Detail below. |
| P0-04 | resolved | (1) No "never spoke of it again" or "never mentioned again." The TL;DR, the childhood section and FAQ 5 each say "by her account" and name her father; the aging section and FAQ 4 use her 2024 words. (2) "Nothing happened next" is gone. (3) The paragraph has no "only other person," gives his objection in his words ("OK, there are no boundaries now"), quotes through "life story," and says nothing on when the estrangement began. (4) "Her stated reasons are political, and they are reason enough. The rest is this page's reading, which she has never offered." (5) All three named sentences are present. The heading is unchanged, as decided. |
| P0-05 | resolved | The Malawi paragraph is cut. No "Malawi," "Mercy" or "counter-entry" anywhere in the body or frontmatter. The hooks paragraph is followed by the Flynn and Burgoyne paragraph the synthesis chose to keep. |
| P0-06 | resolved | hooks is given two claims, both in TP-11 as read: the "Like a Prayer" video, and *Truth or Dare* as a star making "people who were dependent on her for their immediate livelihood submit to her will." Vogueing is in the page's voice ("The vogueing came out of Harlem ballrooms first."). She is identified as "the Black feminist critic." Nothing is quoted from the unofficial reproduction. |
| P0-07 | resolved | (1) The statement's refusal to apologize is quoted ("the way that I look or dress") before the long-lens explanation, in the body and in FAQ 3. (2) "Every backlash" is gone. The rule now reads "outrage alone rarely moves her," with the two changes of product tied to her lowest-selling albums to that point, marked "By our reading." The 1984 and 1989 beats do not contradict it. (3) The camera-optics sentence is present. |
| P0-08 | resolved | (a) "the worst seller of her career to that point." (b) "withheld for fifteen years" is gone and the singing insult is "an older insult," with no tie to Kakutani. No Grammy claim was substituted. (c) The Ritchie parenthetical no longer mentions Kabbalah; "two decades" is replaced by "a Kabbalah practice begun in the mid-1990s." |

### P0-03, open item

**Current passage, FAQ 1 ("What is Madonna's personality type?"):**

> "The pattern runs from the report cards her father paid for by the A, to a producer who says she has 'no off switch,' to waking from a 2023 coma and thinking, right after her children, about the people who had bought tickets."

**Why the test still fails.** Test (2) requires the July 2023 statement to be identified by occasion and audience. The body does it ("sixteen days later, telling ticket holders the tour was postponed") and so does the TL;DR ("she told ticket holders"). This sentence does neither. It reports the content of that notice in the page's own voice as what she thought on waking, and offers it as type evidence. That is the first defect in the synthesis's problem statement ("The page treats it as a record of waking"), and the packet says the source cannot carry it (FP-08: "Cannot support: what she thought on waking, as distinct from what she chose to tell ticket holders two weeks later"). The FAQ block is hash-covered, and it is the answer to the page's main query.

**Minimum remaining action.** Rewrite that one clause so it names the notice and its audience. For example: "…to the notice she sent ticket holders after a 2023 coma, which said her second thought on waking, after her children, was not disappointing them."

**Current passage, FAQ 2 ("Why is Madonna still performing?"):**

> "…and in September 2026 she accepted Artist of the Year at the MTV VMAs by retelling the 1984 night her manager told her that her career was over."

**Why it is borderline.** Test (4) says the speech may not be described as spent on the anecdote. "Accepted… by retelling" makes the retelling the whole acceptance. About half the speech was the "finding myself" message and thanks (CLM-09), and the body now says "opened her speech, again, on." The rest of FAQ 2 passes: her stated reason comes first, and the page's answer is framed as "The Enneagram reading sits beside it."

**Minimum remaining action.** Match the body: "…she opened her Artist of the Year speech at the MTV VMAs with the 1984 night her manager told her that her career was over." Fix it in the same touch as FAQ 1.

## Accepted improvements check

| ID | Status | Basis |
| --- | --- | --- |
| P1-01 | completed | "I'm compulsive about being in control" is in the "Why not" section. The section says what the control serves with "all of my will has always been to conquer some horrible feeling of inadequacy." The 2016-list sentence and "Madonna keeps the insults" are cut, and the 2016 speech is identified in full at its new first mention in the $35 section. Shame is separated from embarrassment in one clause. "A few sentences before that Vanity Fair quote" is accurate against FP-02. |
| P1-02 | completed | Confidence can be ranked: type committed, wing "a looser call than the type," subtype "the least certain call here." No duration on "paralyzed." No loyalty claim and no forward reference. "Shame" does not appear in the box. The falsifier separates the types ("An Eight would leave that record; a Three would not") and names the best contrary evidence. Net −31 words. |
| P1-03 | completed | The Mother's Day sentence is verbatim from People's printing, dated May 12, 2024, and not joined across a gap. "Eighty ticketed shows later it ended with a free one" agrees with "81 shows." The last two lines are unchanged. |
| P1-04 | completed | Leno in January 2012 and the VMA stage in August 2018 are both dated. The 2018 occasion is named ("remarks that began with Aretha Franklin, who had died four days earlier"). The criticism is not mentioned, so her reply is not needed, and it is not quoted. |
| P1-05 | completed | All five required glosses landed: the Grammys close-ups, MTV dropped from the fights list, Kamins and the demo's route to Stein, the corrected Interview setup, and "her daughter Lourdes Leon." The optional glosses were dropped for length, as the brief allowed. |
| P1-06 | completed | (a) "rehearsing in a mask (AP)." (b) The Beatty scene follows Vanity Fair; "He thought he was describing a flaw" is cut. (c) The Dunkin' Donuts row is gone; the assault row reads "Year one" and opens "By her account." (d), (e) Cut. (f) Leonard's two answers are quoted separately. (g) "trained with." |
| P1-07 | completed | "at 68" and "fifteen years" are gone. The film paragraph is past tense, with "When that interview ran, in June 2026." The autocomplete sentence states the query. The description says "in pop." The remaining round spans and "forty-eight years" are on the refresh list in the pass notes. `date` and `lastmod` are unchanged. |

No accepted P1 item was rejected or deferred. P2-01 was not taken, for length. RQ-01 was completed. RQ-02 and RQ-03 stay open behind their safe defaults, and the draft text matches those defaults.

**New assertions introduced by repairs.** Each traces to the packet or to a saved source checked above: the couch scene and report cards (FP-03), "split among relatives for a while" (FP-03), Stern's question (FP-04), Kamins and the cassette (TP-04), the doctor's offer (TP-01), Christopher refusing to be filmed (TP-02, S26), the 2003 date and reason (FP-13), "sixteen days later" (FP-08, June 24 to July 10), the 2012 and 2018 tellings (FP-12), the Mother's Day post (People), "mid-1990s" for Kabbalah (S42). FAQ 5's birth date and Bay City are in the packet's identity section. Two small exceptions are listed under Remaining work as non-blocking.

## Protected-hit regression check

None. Every string in the brief's regression list was confirmed by exact match in the live body.

| ID | Result | Note |
| --- | --- | --- |
| PROTECT-01 | intact | Tense reading and the 2026 "I'm going to be somebody" unchanged. The quotation above them is now correct, and the Interview setup is fixed. |
| PROTECT-02 | intact | "The win quiets the feeling for a while…" and "She calls it fear, but look at what she is afraid of" unchanged. |
| PROTECT-03 | intact | "Weigh that as a hostile account." and "…comes from Madonna, and Madonna films things." unchanged. |
| PROTECT-04 | intact | All five strings unchanged. The Flynn and Burgoyne paragraph and the radar paragraph are byte-identical to the snapshot. |
| PROTECT-05 | intact | Both evidence-type markers present. |
| PROTECT-06 | intact | All five strings present. The new text describes commentary about her face and never comments on it in the page's voice. |
| PROTECT-07 | intact | "He was describing the operating system. She kept his complaint in her own final cut." |
| PROTECT-08 | intact | The chaos-agent-to-foreman turn, Price's quotation and the "job" line unchanged. Leonard's quotation is now two separate fragments; "A few hours and they were done" was dropped under P1-06(f). The function survives. |
| PROTECT-09 | intact | The $35 open, Stein's line, the Gaga sentence, the teardown paragraph and the last paragraph are byte-identical. The ledger keeps its form with three rows; the Dunkin' Donuts row was removed under P1-06(c). |
| PROTECT-10 | intact | Both lines unchanged. |
| PROTECT-11 | intact | The wedding-cake paragraph, the second-thought blockquote, the inner-thought paragraph and "For her, no win stays won…" unchanged. |
| PROTECT-12 | intact | Custody passage in her words only; no suicide disclosure; nothing added about Sean Penn, Rocco or her adopted children. Family-deaths paragraph byte-identical. "By her account," "at 67," "estimated" and "the largest crowd of her career" present. No forward-looking claim. "They belong to one system" and the Type 1 sentence unchanged. The H3 and the first sentence still commit to Type 3. |

## Remaining work

**Blocking (one item, frontmatter only).**

1. **P0-03, FAQ 1 and FAQ 2.** Make the two edits given above. Touch nothing in the body. Do not change `date` or `lastmod`. The reader-visible hash will change, so the page needs re-verification after the edit.

**Non-blocking. Worth taking in the same touch; none affects the gate.**

2. **FAQ 4, clipped quotation.** "…her mother, in her words, 'disappeared and there was no explanation.'" Her sentence continues "except that she had gone to sleep," and the body quotes it in full. Quote through "gone to sleep," or close the quotation after "disappeared."
3. **FAQ 3, her claim stated as fact.** "…explained the long lens that distorted the photos." The body attributes this to her statement. Change to "said a long lens had distorted the photos."
4. **Body, "the one sibling."** "He is the one sibling who has challenged her telling in public." The synthesis asked for "the sibling who challenged her telling in public." "The one" claims no other sibling has, and the packet ran no search for the others. Drop "one."

**Carried forward, unchanged by this verification.**

- RQ-02: nobody in the pipeline has viewed the *Truth or Dare* graveside scene. RQ-03: the bell hooks essay has not been read in print. Both safe defaults are in place.
- DJ's calls from the editor's log: whether "I'm really good friends with my son" belongs beside the custody passage, and whether P2-01 ("But it's not enough") is worth 25 words.
- The RQ-01 transcript lives in `/tmp` and will not persist. Its wording is reproduced in the draft's pass notes and in `editor-resolution.md`.
