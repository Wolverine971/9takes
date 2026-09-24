---
artifact: perspective-editor-resolution
schema_version: 1
subject: Druski
draft_sha256: cd7495c0576972c3b971fd6582ab20da8004b2f507999b028a260e80d619096f
resolution_status: complete
resolved_at: 2026-09-24T02:26:49Z
path: docs/content-analysis/perspective-reviews/Druski/2026-09-23_210138/editor-resolution.md
---

# Editor resolution: Druski

Edited `src/blog/people/drafts/Druski.md` against `synthesis.md` (same subject and frozen-draft SHA,
confirmed from `context.json` and the synthesis frontmatter). Line numbers below refer to the edited
draft. `lastmod` is untouched (`2026-04-29`).

**Exit checks (2026-09-23):** `BLOG_LINT_CONTRAST_TARGET=0 ./scripts/blog-lint.sh Druski` returns 0 fail
and 3 warn (11 internal links, `production_pretext` draft vs `published: true`, body over band).
`node scripts/blog-quality-report.mjs Druski` returns 0 contrast pairs (0 strong, 0 comparative) and
head-term PASS, with the answer block at 56 words.

**Word budget:** the body is 4,085 words (blog-lint), up from the 3,894-word snapshot, so +191 net
against the +50 target. It sits 185 over the 3,200–3,900 band and 415 under the 4,500 ceiling. The
overage comes from P0 repairs (P0-01 takedown, P0-02 identification, P0-06 fear quote) plus the RQ-01
quote. The synthesis ranks P0 correctness above the band (Conflicts #11). Cuts taken:
- L110 intro line.
- Harvey gloss.
- "Every laugh…".
- The Season 2 guest list.
- The entire post-Mafiathon "volume" paragraph.
- "closed loop".
- The brand framing.
- "The success story usually skips this part".
- The Exxon clause, moved up.
- The Big Boss opener, duplicated by the new intro.
- The TL;DR fifth bullet, a duplicate.
- The Rabbit Hole wing list.
- The Roast "social tier" clause.
- The What's Next restatement of the two jobs.

## Resolution log

| ID | Status | Draft location | Action taken | Evidence/source | Acceptance test self-check |
| --- | --- | --- | --- | --- | --- |
| P0-01 | fixed | L211 (whiteface), L301 (Rabbit Hole Type 3), L4 (description), L89 (FAQ 5), L83 (FAQ 3), L270 and L272 (frame) | Added the April 2022 "That Friend that tries to make the girls OVERLY drink" skit, both readings of the criticism, the takedown, and "I didn't want to continue to trigger people" (Rolling Stone 2024), placed after the acid-test paragraph. The 2022/2025 difference is left open: "What changed, he hasn't said." Rewrote the Type 3 counter around the 2022 adjustment with the site's respected-vs-liked test ("the record splits"). "Refuses to smooth them over" is gone. The description is scoped to "those critics." FAQ 3 and FAQ 5 carry the takedown. The frame section says "Even his one retreat, over the 2022 skit, came without an argument." | S04 (RS 2024-02-22), S31; `enneagram-type-8.md` L191 | 1 pass: skit, takedown, and attributed quote named; criticism given both readings. 2 pass: grep finds no "never retreat" or "smooth them over"; the description is scoped. 3 pass. 4 pass: no cause stated, only the juxtaposition of his own words. |
| P0-02 | fixed | L203, L205, L215, FAQ 3 (L83) | L203 now identifies her at first body mention: "Charlie Kirk's widow, who took over Turning Point USA after he was shot and killed in September 2025." L205 cuts "The defense lane is well-staffed," the *Ebony* clause, and the verdict. It states the symmetry charge ("whiteface should be judged like blackface") as the charge Corbould took on and scopes her point ("With the head of Turning Point as the target, the power part holds"), noting the timing she can't settle. L215 now reads "After the Kirk sketch." FAQ 3 glosses her as "Charlie Kirk's widow and Turning Point USA's CEO." | S34, S48/S13, S14 (Corbould), TP-11 dropped. I checked Jake Paul as a symmetry source (Complex, 2026-04-05, fetched): he praised the sketch, so he is not used. | 1 pass: widow, September 2025 killing, and March 2026 sketch are all in the section. 2 pass: the claim is stated and tied to the argument Corbould rebuts; no page verdict remains. 3 pass: no *Ebony*. 4 pass: the body uses "Erika Kirk" only as her name. 5 pass. |
| P0-03 | fixed | L225, L229, L231, L295, FAQ 5 | L225: the security complaint is organizer-directed ("They wouldn't let me get my son"), and only the agreed fragments are quoted ("an older person"; "physically and mentally"). Added "The same videos, Atlanta Black Star reported, also called Druski racial slurs," with the slur not reproduced. L231: cut the "conceding that the room itself was wrong" sentence; the section now ends on "cost him little." Cut the whole "What followed instead was volume" paragraph and "The accurate version…clean exit." Rabbit Hole L295 now uses the Type 8 growth practice instead of a silence motive: "That ain't no excuse" is the mistake owned in the moment, "I'm a bigger dude" the joke stapled to it. | Atlanta Black Star 2024-11-30 (via synthesis), TP-19, CLM-28, CLM-29; `enneagram-type-8.md` L403 | 1 pass. 2 pass: the child is unnamed; "nine," "fat," the crying, and "bigger dude" all remain. 3 pass. 4 pass: no "instead," "accurate version," or "moved fast enough." 5 pass. 6 pass: L227, L229 (first two sentences), and L231 through "cost him little" are verbatim. |
| P0-04 | fixed | L207, L217, FAQ 3 | Rebuilt L207: "Category comedy was always his format: the frat bro Kyle Rogger, the Coulda Been label boss. What changed in 2025 was four hours in the makeup chair." NASCAR is the pure category case, and "volume does the work that precision usually does" stays there. The Kirk sketch "put a category title on one identifiable, recently widowed woman. The title says conservative women; the face says her." This cashes the childhood deniability bridge as a labeled "looks like." L217 now says "the NASCAR sketch had skipped." FAQ 3's cost clause is aligned. | CLM-21; Billboard cover 2025-12-09 ("Kyle Rogger frat bro character"); draft's own L203 | 1 pass. 2 pass. 3 pass (the makeup, plus the category title on a specific widow). 4 pass. 5 pass. |
| P0-05 | fixed | L209, L217, L229, L270, FAQ 3, FAQ 5 | L209: "As of September 2026, he has not apologized for either sketch or answered a critic's argument," which replaces "hasn't engaged any of it." It adds his Billboard remark about the sketch (RQ-01), so no claim of total silence about the sketches remains. L217: "What held was the refusal: no apology, and no answer to a critic." L229: dated. L270: the frame roll call is dated "As of September 2026." FAQ 3 and FAQ 5 use "has not" plus the date. | CLM-22, CLM-35, FP-17 now resolved (RQ-01), FP-19 | 1 pass. 2 pass: the frame section and every other absence claim carry "as of September 2026" or sit after a dated sentence in the same section. 3 pass: the page now quotes him talking about the sketch. 4 pass. 5 pass: RQ-01 shows reach and denial of backlash, not an answer to critics on substance; wording matches. |
| P0-06 | fixed | L133, FAQ 1, L299, L213, FAQ 3, L285 | L133 names "specifically a 7w8" and concedes joke-then-next-project as Seven-leaning, which in an 8w7 is the wing's exit-making. It tips on the fear of depending on anyone, anchored to "We don't need anybody to tell us… or to kiss up to somebody…" (RS 2024). The buffet list and "securing territory" are cut. FAQ 1 carries the same argument plus the "creative side" quote. L299: "It explains the exits… The Eight explains the control and the refusal to depend on anyone." L213: type explains only how easily he holds the line on the non-apology ("rather be respected than liked"), and economics is named first via Billboard's acid test. FAQ 3 opens on economics. The wing paragraph (L285) now names the exit-maker. | `enneagram-type-8.md` L173, L191, L195, L201; FP-11 | 1 pass. 2 pass: no "keeps doors open" or "fails on consolidation." 3 pass: reconciled through the 7 wing's exits. 4 pass. 5 pass: no general claim that Eights avoid critics. 6 pass. 7 pass: 4 type paragraphs outside the diagnosis and Rabbit Hole (Roast, Whiteface L213, Mafiathon, What's Next). |
| RQ-01 | fixed | L209, FAQ 3 | Resolved from source. The full Billboard cover text (Kyle Denis, 2025-12-09; print issue Dec. 13, 2025) had been fetched to `/tmp/bb_druski.html` by the refresh session on 2026-09-23; I verified the passage in the raw HTML against the canonical URL. Asked about bringing the whiteface skit back, he said: "I always knew that skit would have that kind of reach… It wasn't until I saw it on the news and my family kept calling me that I realized how much it blew up… it really was never any backlash. Everybody loved it." He talked about the sketch but did not answer critics on substance; he denied there was a backlash. The frame rule stands, and the quote is added. | billboard.com/music/features/druski-number-ones-billboard-cover-story-interview-1236132075/ (raw HTML, 2026-09-23) | P0-05 test 5 satisfied: L209, L217, and L270 match what he said. |
| RQ-02 | fixed | L211 | No cause stated. The page sets his own words side by side ("In 2022 he pulled a clip because people were upset. In 2025 he said nobody was. What changed, he hasn't said."). | S04, Billboard cover | P0-01 test 4 pass. |
| RQ-03 | deferred | L203, L205 | Military.com (LaBee, 2026-03-26) could not be read: the fetch returned HTTP 404. No "memorial" or "grieving widow" framing is attributed to critics. The repair uses only verified facts (widow, killing date, CEO role), and the timing point is the page's own ("the sketch posted about six months after the shooting"). | S34 | Safe interim applied. |
| RQ-04 | fixed | L229, FAQ 5 | Grepped the *2 Bears, 1 Cave* Ep. 273 transcript (`/tmp/druski_oojm3YT7sys.txt`) for Kai, Cenat, Thanksgiving, Mafia, fat, crying, and apolog: no mention. L229 stands, dated. Kai Cenat's December 2024 streams were not checked and are logged as a residual gap. | Ep. 273 transcript | No wording change needed beyond the P0-05 date. |
| RQ-05 | fixed | L225 | Quoted only the fragments both transcriptions agree on ("They wouldn't let me get my son"; "an older person"; "physically and mentally"). "Insulting/assaulting" and "Security blocked/would block me" are not quoted. The testimony ledger is updated to mark the verb DISPUTED. | TP-19, ABS via synthesis | Safe interim applied; no transcription picked by guess. |
| P1-01 | fixed | L106–L112, L119, L141 | New hook: "If Druski walked into your office right now, he'd act like he ran it, and within a minute everyone would be laughing." This fits the Beckham and Harlow witnesses. Identity line added: "the sketch comedian behind Coulda Been Records, and he owns the company that pays for it." Cut "He has big energy…intimidating" and "infectious smile." "Clowning Drake" became "treated Drake's music-video set like his own office," and "clowned the host" became "played the owner anyway." The `firstLetter` wrapper and persona title are kept. | TP-01, TP-03, CLM-04 | 1 pass. 2 pass. 3 pass: no "clown" apart from "class clown." 4 pass: the intro went from 104 to about 100 words. |
| P1-02 | fixed | L139, L262 | Added at the top of Big Boss: "He started small: a first sketch in October 2017 at an Exxon in Lawrenceville, Georgia, then Instagram characters like the frat bro Kyle Rogger. By 2020, Drake, Lil Yachty, and Jack Harlow had all cast him in their music videos." L262 is shortened to the callback "The Exxon sketch had become an arena show on both sides of the Atlantic." Coulda Been Records is not dated. | S01 (GQ Exxon); Billboard cover 2025-12-09 (Kyle Rogger from late-2010s skits; 2020 videos, verified in raw HTML) | 1 pass. 2 pass. |
| P1-03 | fixed | L131, L133, L135 | Replaced "Anger is the Eight's fuel" with the recorded move: hurt, then the vow ("in the same breath he promised to prove it to all of them"). The lawsuit example is cut. The diagnosis no longer mentions Gwinnett. L135 names both 2026 jobs (the BET Awards and Universal's *The Catch*) and keeps "The fit strains in 2026." | FP-03, type-8 L114 | 1 pass. 2 pass. 3 pass. 4 pass. |
| P1-04 | fixed | L157, L165, L179 (former L185), L207 | L157: "One way to read it:" plus the italic label *Just joking*, with no quotation marks. L165: the grandmother appears only through her recorded action ("What his grandmother got for her ultimatum"). "The depression left him with a chip… Every laugh he chases…" is cut; the section now ends on the empathy turn "The rise started as a way out of a hole." L207's callback is hedged ("It looks like"). | CLM-08, CLM-10, CLM-13 | 1 pass. 2 pass: no quotation marks around words he isn't recorded saying. 3 pass. 4 pass. |
| P1-05 | fixed | L151 | "His parents were academically minded." | TP-05 | Pass: no parent's full name in the reader-visible body or FAQs. The internal ledger comments keep their prior references; they are not reader-visible. |
| P1-06 | fixed | L189–L193, FAQ 4 (L86) | Roast: "You can see it in who gets to join in." Rubi Rose gets "a flat denial." Then "This time Druski played along" for Harlow, and "The stranger got a rebuttal. The friend got a bit." FAQ 4's question is now "Why does Druski roast himself?" The answer calls Rubi Rose's reply a "flat rebuttal" and Harlow's reply "a bit back." The anchor is unchanged. | CLM-15 | 1 pass. 2 pass. 3 pass. |
| P1-07 | fixed | L245, L249 | L245: "how he handles an accusation of fact: a public denial within days, court filings two months later. A factual charge got a factual answer." There is no PR claim and no "brand." The bridge at L249 is now "Everything he was defending, he had paid for himself." PROTECT-03 (L241–L243) is verbatim. | CLM-31 | 1 pass. 2 pass. 3 pass. |
| P1-08 | fixed | FAQ 5 (L89) | The answer now cites the Mafiathon (a live apology, and no answer to the mother, whose videos also used slurs), the 2022 takedown, and the non-apologies for the 2025–26 whiteface sketches. It identifies the suit ("a March 2025 amendment named him in a sexual assault suit against Sean 'Diddy' Combs"), says "dismissed without prejudice for failure to prosecute," and uses "has not" with the date. | S07, CLM-41 | 1 pass. 2 pass. 3 pass. 4 pass. |
| P1-09 | fixed | L268–L272 | States the rule once: "When the charge is a fact, he answers fast and on the record, himself or through his reps… When the charge is a verdict on his taste or character, he doesn't argue." Parham is part of the rule, not an exception. Punch fits it: "The factual half got answered for him; the verdict got nothing." "Closed loop" is cut. "The strategy is" becomes "Read as a pattern, his answer to a verdict runs…". PROTECT-14 and "He hasn't hit a wall yet… rooms he doesn't run" are kept. | FP-15, FP-19, TP-19 | 1 pass. 2 pass. 3 pass. 4 pass: a future comment on reach that doesn't answer a critic leaves the section true. |
| P1-10 | fixed | L270 | "…or Erika Kirk, who said on *The Charlie Kirk Show* in April 2026, 'I have comedians dressing up in whiteface,' without naming him." This sits inside the "As of September 2026" sentence. The long Punch sentence was split. | S16, S17 | Pass. |
| P1-11 | fixed | L264, L312, L314, FAQ 2 | "In June 2025 came word of a feature film," and "Next is" is removed. L312: "still in development as of September 2026, fifteen months after it was announced." L314 now defines the observable: a 4Lifers producing credit and his own writers means the Eight reading holds; hired work with outside writers means the Three reading gets stronger. FAQ 2 is dated, and "His next step" is removed. | S24, S20 | 1 pass: every "still/due/in development" claim carries an absolute date. 2 pass. |
| P1-12 | fixed | L177, L217, FAQ 3 | "he told Complex"; "Ten months after the NASCAR backlash"; FAQ 3 now says "August 31, 2025." The Harvey gloss is cut (CLM-12). | FP-06 | 1 pass. 2 pass. 3 pass. |
| P2-01 | fixed | L316 | "now the label boss Timothée Chalamet shows up in Brooklyn to judge beside." (0 words) | n/a | Pass. |

## Protected hits checked

- **PROTECT-01:** L231 from "This is where the Type 8 frame stops explaining and starts excusing" through "cost him little" is verbatim. Only the sentence after it was cut, per P0-03.
- **PROTECT-02:** L227 is verbatim, and so is "The apology went to the boy. The complaint came from his mother, and that one he never answered." (L229). The date was added in the following sentence.
- **PROTECT-03:** L241–L243 (sanctions denial, photo lineup, "almost certainly lack a factual basis," "The dismissal is procedural… points his way") are verbatim.
- **PROTECT-04:** "The role lets Druski be the listener while still running the room. Bieber gets to confess. Druski never has to." (L195) is present.
- **PROTECT-05:** The two-readings paragraph and "the Three reading gets stronger" (L314) are present, sharpened with a checkable observable.
- **PROTECT-06:** Harlow's openness quote and reading (L183–L185) still come before "The Type 8 reading adds a second layer" (L187).
- **PROTECT-07:** The mother's list, the family camera, "Performing was welcome. It was supposed to fit the schedule." (L151), and "His discipline is his key, and his resilience." (L167) are present.
- **PROTECT-08:** "walking around talking to people like I was the CEO" (L141), "His 'Coulda Been Records' character runs on the same nerve," and the Wahlberg and Chalamet details (L143) are present.
- **PROTECT-09:** "Most creators treat that string of rejections as a verdict. Druski treated it as a budget meeting." (L251) is present.
- **PROTECT-10:** L215–L217 are present. "apparently" and "domestication more than an arms race" are kept. The only changes are word-level: "After the Kirk sketch," "NASCAR backlash," and "the NASCAR sketch had skipped."
- **PROTECT-11:** "as Essence tallied them in October 2025," August 31, 2025, September 4, 2025, September 13, 2025, and "a 30-year-old comedian roasting a 9-year-old" are all present. There is no current-age wording.
- **PROTECT-12:** L155, L157 (GQ quotes), L163, L173, and L175 are verbatim, with no clinical label added.
- **PROTECT-13:** "The fit strains in 2026" (L135), "the least certain call on the page" (L289), "2026 strengthened it" (L301), "the part the type frame won't tell you" (L318), the disclaimer, and the skip permission (L281) are present.
- **PROTECT-14:** "A production source told TMZ the producers made that call while Druski was backstage changing clothes." (L270) is present.
- **PROTECT-15:**
  - The child is unnamed.
  - "Assaulted" is not used.
  - There is no "accountability" ask.
  - There is no Kirk intent statement.
  - Parham is not called "exonerated" or "cleared."
  - No parents' careers or names appear.
- **PROTECT-16:** The acid-test quote, "just passed the test" (L209), and "The cost is that the real question… stands unanswered. Druski keeps the bit. The critics keep the critique." (L213) are present.
- **H2 and FAQ anchors:** all eleven H2s and all five FAQ anchors are unchanged. Only FAQ 4's question text changed, per P1-06.
- **Type-theory ceiling:** 4 paragraphs outside the diagnosis and Rabbit Hole, unchanged.
- **`lastmod`:** untouched.

## Unresolved decisions

- **RQ-03 (research):** The Military.com piece (LaBee, 2026-03-26) was not readable at the URL tried. Read it directly before anyone attributes a "memorial setting" or "grieving widow" framing to named critics. The page currently attributes none.
- **RQ-05 (research):** "Insulting" or "assaulting," and "blocked" or "would block," need checking against the original video (Drama Alert repost on X, 2024-11-28). The page quotes only the agreed fragments until then.
- **RQ-04 residual (research):** Kai Cenat's December 2024 streams were not checked for any later Druski mention of the incident.
- **Word band (human):** The body is 4,085 words, above the 3,900 band and under the 4,500 ceiling. If DJ wants the band enforced, the next cuts are the Beckham paragraph and the Perry gloss, not P0 or PROTECT content.
- **`lastmod` (human, FUTURE-C4):** The page displays April 29, 2026 above content dated through September 2026. This is DJ's call at push; the in-body "as of September 2026" anchors cover it until then.
