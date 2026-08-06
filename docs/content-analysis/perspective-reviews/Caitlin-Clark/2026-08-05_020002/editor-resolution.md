---
artifact: perspective-editor-resolution
schema_version: 1
subject: Caitlin-Clark
draft_sha256: 4573f054476806a5f939660a6be57fbeafce53b0941d183d6fb2df9b186a2925
resolution_status: complete
resolved_at: 2026-08-05T07:38:56Z
---

<!-- docs/content-analysis/perspective-reviews/Caitlin-Clark/2026-08-05_020002/editor-resolution.md -->

# Editor resolution — Caitlin Clark

Frozen draft SHA verified against `context.json` before editing. Post-edit draft SHA:
`2d49a25eca4adfbcece9d4566b48a7b0809165189897e21b08712668ba09066f`.

Exit checks after the pass: `blog-lint.sh` **0 fail, 3 warn**; contrast-pair sentence engines **0 strong**
(target 0); prose em-dashes **0**; body **4,497 words** against the 4,500 ceiling (baseline 4,490).

Two research questions the synthesis routed to audio/video were resolved from indexed text sources this
session (RQ-02, RQ-03). RQ-01 was not, and the draft was rebuilt so it no longer depends on the answer.

## Resolution log

| ID | Status | Draft location | Action taken | Evidence/source | Acceptance test self-check |
| --- | ------ | -------------- | ------------ | --------------- | -------------------------- |
| P0-01 | fixed | H2 3, Olympic beat | Added "She never conceded the larger point. She told the same magazine she knew she was good enough for that roster, and called the omission a blessing that woke a monster." Rewrote the close to "argued the committee's case for them, in public, specified the evidence against herself, and went on believing she belonged… it did not change what she thought she was worth." Deleted "she has no mechanism for pretending otherwise." | Packet CLM-13, Disputes 2; TIME 2024-12-10 narration as fetched by SUBJ. Paraphrased rather than block-quoted pending RQ-05. | PASS. Both halves of her TIME position are stateable from the paragraph. No sentence claims she cannot defend herself. "That is not grace" kept. |
| P0-02 | fixed | H2 7 (primary); H2 1 and Rabbit Hole wing (propagated) | Replaced the scene with the sourced version: "Bluder called technical fouls on Clark in practice more than once, sometimes from the bench herself when no hired official would, and once sent her off the floor entirely." Deleted the scout team, blue squad, walk-ons, week's assignment, mid-drill whistle and "back in for the next drill." H2 1 now reads "took to calling technical fouls on her in practice"; Rabbit Hole reads "the same coach who kept calling technicals on her in practice." | RQ-02 resolved (below). Jensen via *Talkin' Hawks*; Bluder's own recurring-technicals framing (S-21, S-22). | PASS. Every concrete noun traces to a named source or is gone. Recurrence is stated. |
| P0-03 | fixed | H2 1 block quote + unpacking; Rabbit Hole subtype | Restored the excised sentence verbatim inside the block quote ("I come in here every single day… because I want to be the best player in the world and I want to help this team win"). Rewrote the unpacking to absorb it: "She names the outcome she wants and then puts the engine somewhere else. Being the best player in the world is a standard, and no scoreboard signs off on a standard." The Rabbit Hole rendering that terminated at the same comma was deleted outright with the sp affirmative case (see P0-10). | Packet CLM-03, S-03. Took the restoration option, not the ellipsis floor. | PASS. No unmarked excision remains. The two identical truncations no longer exist. PROTECT-01-family scoreboard/hours sentences survive verbatim. |
| P0-04 | fixed | Rabbit Hole → Counterarguments | Replaced the invented Seattle datum with a sourced one: "Her own account of the reflex: 'I'm always analyzing my play. I'm always trying to find ways to be better.'" Kept "Threes convert wins into fuel. Clark converts them into the next audit." | Packet S-05. | PASS. No type discriminator anywhere rests on `inner-thought` content. Both `inner-thought` blocks kept. |
| P0-05 | fixed (strong version) | H2 5 resolution paragraph | Changed "and Clark grades correctness at the moment of decision" to "and the reading here is that Clark grades correctness at the moment of decision." Added a following paragraph carrying her competing first-person account and a falsifier: Sue Bird podcast, "Maybe it's a toxic part of me, but I always think it's going to go well" → "That is a prediction about the ball arriving, which is the thing this reading says she does not grade" → "it's just how I play" → "Watch for the night she takes the safe pass to protect a number. This reading does not survive it." | RQ-03 resolved (below): SI, *Bird's Eye View* with Sue Bird, 2025-08-08. | PASS. Inference is distinguished from her statements, a falsifiable observable is named, and the mechanism sentence ("settled a half-second later by four other people") is verbatim and uncompressed. |
| P0-06 | fixed | H2 3, Maravich | Replaced the paraphrase with her verbatim answer: "Not really. When they announced it and everybody screamed, that's when I knew." Deleted "she did not feel it." Kept "a career scoring total is an accounting somebody else keeps." | Packet CLM-08, S-31, Disputes 4. | PASS. The awareness claim matches S-31. No sentence asserts she did not know it happened. |
| P0-07 | fixed | H2 6 block quote + line 254; TESTIMONY LEDGER; `research/Caitlin-Clark.md:129` | "hella good numbers" → "helluva numbers" in the draft body **and** the ledger. "in the same breath" → "in the same appearance." Corrected the research file at source and left an inline provenance comment so the misquote cannot re-propagate on refresh. | Packet CLM-15, CLM-16, S-27. | PASS. Draft and research file agree. PROTECT-03 (the concession argument) untouched. |
| P0-08 | fixed | TL;DR bullet 4 | Replaced "Neither of them means it as a compliment" with the convergence claim: "four years and one league apart, both land on 'perfectionist.' Both attach the same prescription to it: give yourself some grace." | Packet CLM-06, S-20, S-23, S-24. | PASS. No sentence characterizes Bluder's or White's attitude in terms their own quotes do not support. |
| P0-09 | fixed (cut) | H2 5 | Deleted the Cynthia Cooper sentence entirely. Removed her from the TESTIMONY LEDGER with a note recording why. Freed ~24 words toward the P1 tier. | Packet CLM-26, S-28; research file line 133 shows the full context is rim pressure and playmaking, not decision-auditing. | PASS. No third party is described as confirming the article's inference. The surrounding mechanism paragraph was not shortened. |
| P0-10 | fixed (ENN path b) | Rabbit Hole → Instinctual Subtype | Deleted the "intensity toward a single rival" definition and the affirmative sp case ("watch where her time goes… the gym, the hours" plus the truncated quote). Kept the sp/so call and argued it against the Zeal profile on anger direction: "The one-to-one One, the Zeal countertype, runs anger hot and outward and gets mistyped as an Eight for exactly that… What separates her is the order. Bluder's list of her targets starts with 'mad at herself.' The Zeal One starts pointed outward; Clark's overflow comes off an audit pointed in." | `src/blog/enneagram/enneagram-type-1.md`, "The three kinds of Ones." | PASS. The characterization is consistent with the pillar, and the H2 7 anger-direction evidence is engaged rather than left contradicting the call. Section not expanded; PROTECT-10 untouched. |
| RQ-01 | research_needed | Cold open; TL;DR bullet 1; H2 1 bridge | **Could not resolve** (needs ten seconds of the ESPN video; no text source characterizes her delivery, and the packet's own transcript renders a filled pause before the number). Took the synthesis's instruction "do not publish the tempo claim unverified" and removed the dependency instead: "None of it explains how fast the number came out" → "She was asked for a number and returned a verdict with the evidence attached." TL;DR bullet 1's "The speed is the interesting part" → "The unrequested evidence is the interesting part." H2 1's "The six came out fast" → "The six arrived with its evidence attached." | Packet transcript rendering; no primary viewed. | PASS on the risk. The article makes no tempo claim. The underlying fact remains unverified and is listed under Unresolved decisions. |
| RQ-02 | fixed | H2 7 | **Resolved negatively.** No indexed account of the Jensen episode contains a scout team, blue squad, mid-drill whistle or return to the floor; the recoverable framing is Jensen's plain "kicked her out of practice and gave her a technical" plus Bluder's own description of practice technicals as a recurring tool she called from the bench. De-specification stands; UNFAMILIAR-H4's walk-on gloss is spent. | Sportskeeda/On3 write-ups of *Talkin' Hawks with The VandeBergs* (~July 2025) via search; direct fetch still blocked (HTTP 405), so no new wording was block-quoted. | PASS. Consistent with conflict-6 ruling (sourcing wins). |
| RQ-03 | fixed | H2 5 | **Resolved.** Primary pinned: Sue Bird's *Bird's Eye View*, reported by SI on 2025-08-08. Wording confirmed as "Maybe it's a toxic part of me, but I always think it's going to go well" and "I'm not saying it's a good thing to brag about, but I don't know, it's just how I play." Enabled the strong version of P0-05. Added to the TESTIMONY LEDGER. | si.com, *Bird's Eye View* coverage, 2025-08-08. | PASS. Quoted from a named outlet with a date, not from an aggregator paraphrase. Only the short clause "it's just how I play" is quoted, to avoid importing a strong contrast-pair engine into the prose counter. |
| RQ-04 | fixed (moot) | H2 5 | Disappears with P0-09. The Cooper sentence is cut, so the verbatim question no longer needs answering. | — | PASS. |
| RQ-05 | deferred | H2 3 | Not run. P0-01 was executed on paraphrase, which the synthesis states is sufficient. TIME's full text was not read line by line, so her assertion is reported in the article's words, not block-quoted. | — | Acceptable: the synthesis marks RQ-05 as an upgrade path, not a blocker. |
| P1-01 | fixed | H2 3 seam | Added "Eight days after that final, Indiana took her first overall in the WNBA draft." and changed the following clause to "as a rookie for a Fever team that had started 3-9." | Packet timeline (drafted No. 1 overall, 2024-04-15). | PASS. A reader who cannot name a WNBA team can now answer "which team started 3-9, and was she still in college?" from the sentence. |
| P1-02 | fixed | H2 9, H2 7, box-score table, TL;DR bullet 2 | Ranks → "top three in scoring, top two in assists." Added "with two months and a postseason still in front of them." Injury bound to "the August injury report with a back problem." "who now coaches her in Indiana" → "who took over as her head coach in Indiana in 2025." Table: "Fastest to 200 career threes in league history" → "Got to 200 career threes in 74 games, faster than anyone in league history had." TL;DR: "is also the most error-prone" → "set its record for giving the ball away." | Packet CLM-29, CLM-23, CLM-24, CLM-10; FUTURE RQ-F1/F2. | PASS. Read as August 2027, no sentence asserts a false "now." The word "now" no longer attaches to any role, title, status or ranking. PROTECT-09 date stamp kept. |
| P1-03 | fixed | H2 1 | Cut "Threes do not get called for a T by their own coach at a closed practice. Ones do." Replaced with the real discriminator: "She spent room-management capital in a gym with no audience in it." | Packet CLM-04. | PASS. No sentence asserts a type is incapable of a behavior. |
| P1-04 | fixed | Cold open | Cut "and had spent two years as the most-watched athlete in her sport." | Packet CLM-30 (unresolved). | PASS. No cold-open superlative is contradicted later. PROTECT-08 hook untouched. |
| P1-05 | fixed | H2 2 and closing bookend | Age removed from both. H2 2: "She got on a bike without training wheels because her older brother had gotten on his, which is how her mother tells it." Close: "She got on the bike because her brother had gotten on his that morning and the gap was hers to close." | Packet CLM-31. | PASS. The age appears zero times. "Nobody has told her the gap closed" untouched. |
| P1-06 | fixed | Cold open; H2 7 close | (a) Added "Andrews pointed out that she had not capped herself there. 'We'll have to see,' Clark said, with a wry smile." (b) Added a new H2 7 ending: "Two months later she was blunter about why the prescription does not take. 'The fire and the passion, that's what makes me, me,' she told ESPN, and said nobody should ever try to take that away from her." | Packet S-02; July 2026 ESPN quotes verified by SUBJ against two write-ups. | PASS. Both beats present. PROTECT-06 ("The reframe changes what the behavior means without changing what it cost") remains upstream of the new ending. |
| P1-07 | fixed | H2 6 | (a) "Twelve days later, after Connecticut's DiJonai Carrington had said publicly that Clark was not being vocal enough about it, she said this:" (b) Added "The complaint drew its own criticism. ESPN's Monica McNutt said there was 'room for a little bit more accountability and self awareness in terms of her role in the larger sisterhood.'" | Packet S-11 for the sequencing; McNutt wording per the synthesis's verification. | PASS. A reader can identify that a named professional criticized Clark before she spoke in June 2024, and the section carries a named, sourced criticism of her conduct. The "fearful" trap was avoided: that construction is not quoted at all. PROTECT-02 family ("no standing to argue with at all") kept verbatim. |
| P1-08 | fixed | H2 4 | Added the authorial lead-in "If the pattern holds, the drive home sounds something like this." on the H2 4 block only. H2 8 left alone. | `src/scss/blog.scss:592`; packet CLM-38. | PASS. Both blocks kept; only one labeled. |
| P1-09 | fixed | Cold open, H2 1, H2 7 | Andrews → "ESPN's Malika Andrews" at first use (the redundant later "she told ESPN" became "she said"). Bluder → "her head coach, Lisa Bluder" on first mention in H2 1. Jensen → "Bluder's successor as Iowa head coach, Jan Jensen," which fixes the broken "her" referent. Cooper repair disappeared with P0-09. | Verified absences in the frozen text. | PASS. Every named third party's relationship to Clark is stated where the name first appears. |
| P1-10 | fixed | Rabbit Hole → Counterarguments | Re-aimed at the sp-Three and moved the discrimination onto core fear: "The Three that competes here is the self-preservation Three: uneasy with self-promotion, privately exacting about the work, and the single most common Three mistyped as a One. Every discriminator above is also sp-Three behavior. So discriminate on the fear. A Three's dread is worthlessness and it attaches to output. A One's dread is corruption and it attaches to character." Pointed at the H2 6 filter rather than restating it. | ENN's reading against the house pillar. | PASS. The section addresses a Three who is not image-managing and discriminates on core fear. PROTECT-05 was not compressed to fund the pointer. |
| P1-11 | fixed | H2 3 | Added "South Carolina's bench outscored Iowa's 37-0 that night; Iowa's reserves attempted three shots all game. In the biggest game of her career there was nobody to hand it to." | FUTURE/FAN verification of the 2024 final bench splits. | PASS. A reader arriving on "why did Caitlin Clark never win a national championship" can answer from the article. The COHESION PASS NOTES' open item is marked resolved in the draft. |
| P2-02 | fixed | Rabbit Hole → Stress arrow | Swapped the non-discriminating "Disappointed isn't a big enough word" for the pillar's Four-arrow signature: "The sharper Four marker is the complaint that arrow specializes in, that the effort goes unseen, and she has made it in her own words: 'people didn't understand how I was wired.'" | ENN-C2; the quote was already in the draft body. | PASS. Word-neutral, as the synthesis predicted. |

### Funding decision (conflict 1)

The synthesis escalated the word ceiling to DJ. I took its stated recommendation — all four expensive P1s,
paid for out of Rabbit Hole and TL;DR material no perspective protects — and did **not** bank FUTURE-C2's
reserve, which cannot coexist with the P1 set. Recorded below as a production decision, not settled here.

Because the strong version of P0-05 and the fuller P1-07/P1-10 repairs cost more than the synthesis's
estimate, additional funding came from material the reviewers flagged as weak or redundant, none of it
protected: TL;DR bullet 3 (FAN: restates the body); "She did not edge past that record. She removed it from
the conversation by 86" (restates the key-stat box directly above it); the unsourced wing quote at
`research/Caitlin-Clark.md:118`, the article's only unledgered quotation (P2-10, partial); the unsourced
superlatives "the most-watched four years any college basketball player has ever had" and "the most famous
basketball player in the country"; "Clark is one of the few athletes at her altitude who went and got
professional help…" (unverifiable comparative); the Rabbit Hole's Eight paragraph, which duplicated the
anger-direction argument the repaired subtype section now makes; and five negative-parallelism constructions
that were AI tells independent of the review ("not her game / it is the war," "not a leadership flaw," "not
'you are loved when you win,'" "nothing to do with cameras," "Note what is missing from the grief").

## Protected hits checked

- **PROTECT-01 — turnover-resolution paragraph.** Present and uncompressed. "Whether the ball arrives is a
  separate question, settled a half-second later by four other people" is verbatim. Only the framing changed
  ("the reading here is that Clark grades correctness…"), and P0-09's cut removed a sentence beneath it
  without shortening the mechanism.
- **PROTECT-02 — the commercial seam.** Verbatim, in the body, unresolved, no salary figure. "There may be no
  version of her career in which she can" kept per conflict 2. "She had no standing to argue with at all" kept
  per conflict 3.
- **PROTECT-03 — the Swoopes concession.** Argument untouched. Only the quoted wording and "same breath" →
  "same appearance" changed, per P0-07.
- **PROTECT-04 — the box-score table.** Final row verbatim ("Three points. Against a 6-21 team. With 45 from
  her."). Assist row's "right read versus a bailout" verbatim. Only the threes row was re-tensed for P1-02.
- **PROTECT-05 — the character-versus-output filter.** Present in full, uncompressed. It carries the one
  surviving comparative contrast pair; I left it rather than rewrite a protected paragraph to satisfy a
  counter that only warns.
- **PROTECT-06 — "The reframe changes what the behavior means without changing what it cost."** Verbatim, and
  still upstream of H2 7's new P1-06 ending. It now stands as its own paragraph after the unverifiable
  "one of the few athletes" sentence was cut.
- **PROTECT-07 — the bike bookend.** "Nobody has told her the gap closed" untouched; only the age was removed.
- **PROTECT-08 — the cold open through "Six."** Intact, including the one-word paragraph. **Spent in part:**
  the sentence *after* the hook changed from the tempo hinge to a content hinge, because RQ-01 could not be
  resolved and the synthesis forbids publishing the tempo claim unverified. The reviewer flagged this
  contingency themselves.
- **PROTECT-09 — "It is August 2026, and she is spending the hours again"** and the self-dating headings.
  Stamp verbatim; the H2 8 hotel-room heading verbatim. Only what follows the stamp was re-tensed.
- **PROTECT-10 — the Rabbit Hole's permission-to-skip line.** "The rest of the analysis stands on its own"
  verbatim. Section not expanded.
- **PROTECT-11 — the Goldman Sachs beat.** "I mean, like, yes" intact inside the body block quote. The
  Rabbit Hole's redundant restatement of the same beat was shortened; the body beat was not touched.

**Protected hits spent:** one and a half. UNFAMILIAR-H4 (the walk-on gloss) is gone, per the conflict-6 ruling
and RQ-02's negative result. PROTECT-08's hook survives but its follow-through was re-hinged, per RQ-01.

## Unresolved decisions

1. **RQ-01, the tempo of the six.** Still unverified. Ten seconds of ESPN YouTube `arXekQ8W4_c` settles it.
   The article no longer depends on the answer, so this is not a publish blocker — but if anyone wants the
   "answered instantly" framing back, it needs the video first. Do not restore it on memory.
2. **FUTURE-C2's 120–150 word refresh reserve — production decision for DJ.** Not banked; there was no room
   alongside the accepted P1 set. The body sits at 4,497 of 4,500. The October 2026 postseason refresh is not
   optional and will breach the ceiling immediately. The options are unchanged from the synthesis: grant this
   page a one-time `BLOG_LINT_WORD_CEILING` exception, or cut roughly 150 words in the October pass before
   adding anything. This is a pipeline-policy call and I did not make it.
3. **RQ-05, TIME's full text.** Her "good enough" assertion is paraphrased, not block-quoted. Reading
   `time.com/7200904` line by line would let the paragraph quote her directly, which the synthesis judges the
   stronger version.
4. **P2 items not taken.** P2-01 (the "you can't see me" gesture, the highest-value fan addition), P2-03,
   P2-04, P2-05, P2-06, P2-07, P2-08, P2-09 and the remainder of P2-10. All were blocked by the ceiling, not
   by judgment. P2-10 was partly taken: the unsourced wing quote is gone, but the 1w2-versus-1w9 evidence
   still does not strongly discriminate.
5. **Frontmatter enrich has not run** — no `faqs`, a standing discoverability cost flagged by lint.

This artifact does not assert that the perspective gate passed. `/blog_perspective_verify_people` checks that
independently against the post-edit draft.
