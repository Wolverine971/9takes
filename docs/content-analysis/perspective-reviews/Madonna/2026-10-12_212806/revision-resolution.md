---
artifact: perspective-revision-resolution
schema_version: 1
subject: Madonna
draft_sha256: 80ae5a3c92a77de6c4688ade2fc6c0805eac3ef825696370729c39e1458c411d
resolution_status: complete
resolved_at: 2026-10-13T04:05:01Z
---

Edited file: `src/blog/people/drafts/Madonna.md`. Inputs: `verification-initial.md` (fail, one open P0), `docs/content-analysis/grades/Madonna.review.md` (B, 8.4), and `scripts/blog-lint.sh` (0 fail going in). `date`, `lastmod` and `content_quality` were not touched.

This pass made two kinds of edit. The first table covers the gate item the verifier named. The second covers grader-driven edits to hash-covered text, listed so the re-verification can check each new assertion against its source.

Word count, same counter before and after (`scripts/blog-lint.sh`): 4,436 before, 4,410 after. Exit checks: `blog-lint.sh` 0 fail (2 warnings: `published` against `production_pretext.status`, and length above the 3,900 band). `blog-quality-report.mjs` contrast pairs 0 strong, 0 comparative. `audit:readability` flagged nothing. Frontmatter parses, five FAQs.

## Resolution log

| ID | Status | Draft location | Action taken | Evidence/source | Acceptance test self-check |
| --- | --- | --- | --- | --- | --- |
| P0-03 (FAQ 1) | fixed | `faqs[0].answer`, last sentence | "to waking from a 2023 coma and thinking, right after her children, about the people who had bought tickets" replaced with "to the notice postponing her tour after a 2023 coma, in which she told ticket holders her second thought on waking, after her children, was not disappointing them." | FP-08. Wording follows the body ("telling ticket holders the tour was postponed"). | Test (2): the July 2023 statement is identified by occasion (the postponement notice) and audience (ticket holders), and the page no longer reports her waking thoughts in its own voice: yes. |
| P0-03 (FAQ 2) | fixed | `faqs[1].answer`, last clause | "she accepted Artist of the Year at the MTV VMAs by retelling the 1984 night" replaced with "she opened her Artist of the Year speech at the MTV VMAs with the 1984 night her manager told her that her career was over." | CLM-09, S15. Matches the body's "opened her speech, again, on." | Test (4): the speech is not described as spent on the anecdote; her stated reason still comes first and the reading is still framed "The Enneagram reading sits beside it": yes. |
| P0-03 (TL;DR bullet 4) | fixed | TL;DR, fourth bullet | Reworded for the grader, still inside the P0-03 tests: "After a 2023 coma, she told ticket holders her first thought on waking was her children. Her second was not disappointing the people who bought tickets." | FP-08. | Tests (1) and (2): no claim that one statement explains her; audience named: yes. |
| Verifier non-blocking 2 | fixed | `faqs[3].answer` | Quotation now runs through "except that she had gone to sleep," as the body has it. | People, May 13, 2024 (checked by the editor pass in raw HTML; one contiguous sentence). | Quotation no longer clipped mid-sentence: yes. |
| Verifier non-blocking 3 | fixed | `faqs[2].answer` | "explained the long lens that distorted the photos" replaced with "said a long lens had distorted the photos." | FP-07. | Her claim is attributed, not stated as fact: yes. |
| Verifier non-blocking 4 | fixed | Discipline section, hostile-witness paragraph | "He is the one sibling who has challenged her telling in public" replaced with "He is the sibling who challenged her telling in public." | Synthesis wording for P0-04(d). | No claim about the other siblings: yes. |

No accepted P1 item was reported incomplete, and no protected-hit regression was reported, so none is mapped here.

### Grader-driven edits to hash-covered text

| Grader item | Draft location | Change | Source for any new assertion |
| --- | --- | --- | --- |
| NEEDS WORK 1 | `faqs[2].answer`, first sentence | Opens "No, by our reading, though Type 8 is the obvious rival." | None new. |
| NEEDS WORK 2 | Type section; backlash section, first two paragraphs; `faqs[2].answer`; type-challenge memo | "Each followed her lowest-selling album to that point" is retired for *Erotica*. Type section: "each followed an album that undersold." Backlash section adds "Erotica had stalled at No. 2, her first studio album since her debut to miss the top of the chart (Billboard)." *American Life* now reads "her lowest-selling studio album to that point (Billboard)." FAQ 3 carries both. | Billboard, Chuck Arnold, Oct 20, 2022: "peaking at No. 2 on the Billboard 200, making it her first studio LP since her self-titled debut not to reach the pole position on that chart." Billboard, Apr 21, 2018: "it became the lowest-selling studio LP of her career up to that point." Both fetched this pass through r.jina.ai and saved in `/tmp/Madonna-research/revcheck/` (not permanent; the sentences are reproduced here). The *Erotica* "lowest-selling" claim traced only to Wikipedia citing O'Brien 2007 p. 267 and Taraborrelli 2002 p. 225. Both books are lending-restricted on archive.org and were not opened. P0-08(a) still holds: the superlative is bounded in time. |
| NEEDS WORK 3 | Backlash section | Joan Lader's quotation is cut. The sentence now ends "then trained with Broadway vocal coach Joan Lader, and took home the 1997 Golden Globe." | The quotation traced only to Wikipedia citing Taraborrelli 2008 p. 260 (TP-12: "primary not accessed"). The Evita beat that P0-08 marked "at risk" survives: letter, Lader, Golden Globe. |
| NEEDS WORK 3 | Backlash section | "number one in forty countries (Guinness World Records)." | CLM-38: Wikipedia citing Glenday 2006, which its bibliography lists as *Guinness World Records 2007*. Tier 4 route, now named. |
| NEEDS WORK 3 | Still-performing section | "won seven awards (Billboard)." | Billboard winners list, saved copy: "taking home seven prizes in total." |
| NEEDS WORK 3 | Aging section | "in her words from 2024" replaced with "she wrote on Mother's Day in 2024." | People, May 13, 2024. The closing section already dates the post to May 12, 2024. |
| NEEDS WORK 3 | Type section, "Why not" | "Ask what the control is for. A few sentences before that Vanity Fair quote, she says it" replaced with "She said what the control is for in Vanity Fair that same year, a few sentences before the 'mediocre' line." | FP-02. Position in the interview is as the verifier confirmed. P1-01 tests (1) and (2) still hold. |
| NEEDS WORK 4 | Backlash section | The marriages sentence is cut to the custody lead-in and folded into the *On Purpose* paragraph: "One was a custody dispute with her ex-husband, director Guy Ritchie, over their son Rocco, settled in 2016." The Sean Penn clause and the English-accent parenthetical are gone. | None new. P0-02(d) still holds: the clause says only that the dispute was settled in 2016. PROTECT-12 still holds: her words only. |
| NEEDS WORK 4 | Still-performing section | The film paragraph now reads "The film of her own life stalled at Universal. By her account the studio dropped her script over the budget. 'Maybe they just didn't believe in me,' she told Interview, at 67." The Netflix status sentence is cut. The paragraph moves ahead of the album paragraph, which now opens "While the project sat, she made a record." | Interview, June 22, 2026, saved copy re-read this pass: "I was in limbo when that fell apart, and then Netflix reached out to make a series… I couldn't find one. This went on for another eight or nine months. I was like, 'Good thing I have another job…' I reached out to Stuart [Price]." P1-07(c) still holds: no present-tense status verb for the film. "A sequel to the 2005 record" became "the 2005 album." |
| NEEDS WORK 4 | Still-performing section, O2 paragraph | "Eighty ticketed shows later it ended with a free one on Copacabana Beach" is cut. | The show count is now in the intro ("the eighty-first show") and agrees with "81 shows" in the Mother's Day line, so P1-03 test (3) still holds. |
| NEEDS WORK 5 | Intro, third paragraph | "Two days before, she was on that stage anyway, rehearsing in a mask (AP)" replaced with "Ten months earlier she had been in an induced coma. Rio was the eighty-first show of the tour it postponed." | FP-08 and the packet timeline: ICU on June 24, 2023; concert on May 4, 2024; 81 shows counting the free Rio finale (S42, and her own "81 shows"). No duration is given for the coma. This replaces the P1-06(a) sentence; nothing unsourced is left in its place. |
| NEEDS WORK 6 | TL;DR bullets 1 and 3 | Bullet 1 now gives the word: "In 1991 she called her engine a 'horrible fear of being mediocre.' Her word for the way out, then and in 2026, was 'Somebody.'" Bullet 3 names the one producer: "Her producer Stuart Price says there is 'no off switch.'" | FP-02, FP-11, TP-05. |
| NEEDS WORK 6 | Type section | "[The Achiever]" link text is now "[Type 3]." "Head types run on fear of danger, instinctual types on anger" is cut. | None new. P1-01 test (4) still holds: shame is separated from embarrassment in the sentence before. |
| NEEDS WORK 6 | Aging section | "Look at what 'aging gracefully' asks of her" replaced with "'Aging gracefully' is a request." | None new. The protected sentence that follows is unchanged. |

Grader items not taken, with the reason:

- **Cut the Leonard block and the film-of-her-life paragraph.** PROTECT-08 and PROTECT-12, and the synthesis rejected the same cut from the critic. The film paragraph was trimmed and moved; the Leonard block is unchanged.
- **About 500 words out of the last third.** The section is held by PROTECT-11, PROTECT-12, the P0-03 tests and P1-04. This pass nets 26 words out.
- **Three reader commands** ("Notice the tense," "look at what she is afraid of," "Weigh that as a hostile account"). PROTECT-01, PROTECT-02 and PROTECT-03, verbatim.
- **A source tag on "2.1 million for Gaga."** PROTECT-09 holds the sentence verbatim. The figure is the organizers', reported by AP on May 3, 2025 (S33).
- **The graveside scene rests on secondary sources.** RQ-02 is still open. The safe default is unchanged.

## Protected hits checked

Each string below was confirmed present in the revised draft by exact-match search after the last edit.

- **PROTECT-01:** "Notice the tense in that 1991 Vanity Fair sentence, too," "Present tense, from the top of the mountain," and the 2026 "I'm going to be somebody." Present, unchanged.
- **PROTECT-02:** "The win quiets the feeling for a while." and "She calls it fear, but look at what she is afraid of." Present, unchanged. The sentence after the second one ("Head types run on fear…") was cut; the protected sentences were not edited.
- **PROTECT-03:** "Weigh that as a hostile account." and "nearly everything known about her mother's death comes from Madonna, and Madonna films things." Present. The same paragraph lost "one" and "has" from "the one sibling who has challenged."
- **PROTECT-04:** "she was pointing at something real," "The communities that created those forms never got to set them down," "That critique deserves to stand without a rebuttal," "None of that cancels hooks," "Naming the radar does not excuse it." Present, unchanged. The 1992 section was not edited.
- **PROTECT-05:** "That is hindsight, told to an industry ballroom." and "That is speculation for exactly one paragraph." Present, unchanged.
- **PROTECT-06:** "It asks her to become less visible on purpose," "she refuses a deal in which fading is dignified and staying is embarrassing," "Ridicule, whatever else it costs, means the world is still looking," "None of this makes the choice free," "she has lost control of the close-up." Present. The sentence before the first one was reworded and the 2024 quotation's lead-in now names Mother's Day. The page still does not comment on her face in its own voice.
- **PROTECT-07:** "He was describing the operating system. She kept his complaint in her own final cut." Present, unchanged.
- **PROTECT-08:** "something closer to a foreman," Leonard's "So we shut up and we did the work" and "were written one a day," Price's "There's no off switch," and "I want to have a job more than I want to have fun right now." Present, unchanged. The discipline section was edited only in the hostile-witness paragraph.
- **PROTECT-09:** "take me to the center of everything," the $35, the ledger timeline, "'The thing to do now,' she said, 'is sign me to a record deal,'" "A year later the same sand held 2.1 million for Gaga," "She found audiences. Audiences go home." Present, unchanged. The intro's third paragraph, which is not part of this hit, was replaced (NEEDS WORK 5).
- **PROTECT-10:** "doesn't explain camera optics to you" and "Provoke, absorb the hit, recalibrate, win." Present. A Guinness tag now sits before the second.
- **PROTECT-11:** The wedding-cake scene with Liz Rosenberg, the second-thought blockquote, the inner-thought paragraph, "For her, no win stays won. The feeling comes back, and she needs the next one." Present, unchanged.
- **PROTECT-12:** The custody passage uses her words only; no suicide disclosure; nothing characterizes Sean Penn or Rocco, and Penn is no longer mentioned. The family-deaths paragraph and "there's all this life in between" are unchanged. "By her account" and "at 67" are present in the film paragraph. "estimated" and "the largest crowd of her career" are present. No forward-looking claim was added. "They belong to one system" and the Type 1 sentence are unchanged. The H3 and the first sentence of the type section still commit to Type 3.

## Unresolved decisions

Nothing blocks re-verification. No item is `research_needed` or `needs_human`.

- **DJ's call, new this pass:** the English-accent parenthetical answered a live autocomplete query (`why does madonna have an english accent`) and was cut at the grader's request. If the query matters more than the tightening, its better home is a sixth FAQ, sourced from the saved accent copies in `/tmp/Madonna-research/txt/`.
- **DJ's call, new this pass:** length. The grader wants the page near 3,900 words; it is at 4,410. Every remaining cut of size is a passage the jury protected.
- **Carried forward:** RQ-02 (the *Truth or Dare* graveside scene has not been viewed) and RQ-03 (the bell hooks essay has not been read in print). Both safe defaults are in place.
- **Carried forward from the editor pass:** whether "I'm really good friends with my son" belongs beside the custody passage, and whether P2-01 ("But it's not enough") is worth 25 words.
- **Not this pass's field:** lint warns that `published: true` disagrees with `production_pretext.status: draft`.
