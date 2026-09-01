---
artifact: perspective-synthesis
schema_version: 1
subject: Naval-Ravikant
draft_sha256: e901dee508bd289461cfe4c1a6f897f8d172491151b8f830c35fb5c32d5a658f
synthesis_status: complete
delight_target: fan
p0_open: 8
p1_accepted: 14
research_required: 5
protected_hits: 10
requires_revision: true
synthesized_at: 2026-09-01T07:34:00Z
path: docs/content-analysis/perspective-reviews/Naval-Ravikant/2026-09-01_020003/synthesis.md
---

## Executive verdict

Six independent reviews returned the same two grades: `value: high`, `delight: clear_hit`, and
`trust: strained` — six for six, with no reviewer having read another. That unanimity is the
finding. Nobody disputes the Type 5 call, nobody disputes the thesis, and every reviewer
independently named the same passages as the reason to publish. What every reviewer also found,
from six unrelated angles, is a cluster of verified factual errors sitting on the page's most
prominent and most checkable surfaces.

I re-read every cited passage against the frozen snapshot and the evidence packet. The errors are
real, they are small, and they are not randomly distributed. The critic's CRITIC-C7 is the sharpest
observation in the entire jury: six independently confirmed inaccuracies all lean toward the
sympathetic reading. I confirm that pattern on my own reading, and I confirm the critic's
conclusion about what to do with it — the fix is a directional audit, not a softer thesis. A page
whose stated competitive advantage is that it reasons where aggregators vote cannot ship an
aggregator's condensation as its closing quotation. That single fact, flagged by all six
perspectives, is the whole problem in miniature.

The eight P0 items are cheap. Five are net-zero words, two are near-zero, and one costs about
twenty-five. None requires abandoning or softening any argument on the page; several make the
argument stronger, which is the tell that they are corrections rather than concessions.

The one genuinely hard editorial problem is arithmetic. The body runs 4,333 words against a 4,500
ceiling — roughly 167 words of headroom — and the accepted improvements ask for about 185 words of
additions on top of a net +25 from the P0 repairs. That does not fit. It fits after trims the
reviewers themselves identified, and the Conflicts section below gives a concrete funding plan.
Cut first, then add.

The highest-value single change on this list is not a repair at all. The page argues a Five for
4,333 words and never names the Five's passion or its virtue — on a subject whose most famous
doctrine _is_ the Five's virtue, and whose most obvious counterexample (Fives hoard; this one gives
a million-selling book away) is what the packet calls "the thesis's load-bearing weak joint." That
paragraph is one paragraph away, the house canon and a corpus precedent both supply it, and it
simultaneously answers the critic's strongest structural objection. It is P1-01 and it is worth
more than any other addition on this list.

**Requires revision: yes.** No reviewer recommended hold; all six recommended revise.

## P0 — mandatory red-flag repairs

### P0-01 — The closing pull-quote is an aggregator's condensation published as first-party verbatim, with the wrong date

- **Origin:** CRITIC-B2 (critic), SUBJ-B2 (subject), FAN-R2 (fan), UNFAM-R1 (unfamiliar), ENN-R3
  (enneagram), FUTURE-R2 (future). **All six perspectives, independently.**
- **Location:** lines 388–391, "Naval Ravikant at Fifty-One" — the article's final quotation and its
  designated current-tense anchor. Ledger duplicate at line 121.
- **Passage:** `> "For the first time, nothing is beyond me. Any math textbook, any physics paper, I
can have the AI break it down until I understand it." — Naval Ravikant, "A Motorcycle for the
Mind," nav.al, February 22, 2026`
- **Adjudicated problem:** Quote distortion at the single most checkable position on the page. The
  first-party source reads "Feb 19 2026" and the sentence is materially different and materially
  longer. "Physics paper" is not a compression of "physics textbook" — it is a different noun. The
  draft's wording and date both trace to Podcast Notes, a Tier 4 aggregator. Presented with
  blockquote, em-dash attribution, named title and a specific date, this is the strongest verbatim
  signal the page uses, deployed on text the subject did not say.
- **Evidence:** Packet CLM-16 (risk: **High**), Disputes #2, S-03 vs S-18. The packet downloaded and
  grepped `nav.al/ai` locally after two retrieval passes disagreed. **Confidence: high.**
- **Minimum repair:** Replace with the first-party wording, marking any cut with a visible ellipsis,
  and correct the date to February 19, 2026 in the attribution, in the prose sentence above it
  ("A year later, in February 2026"), and at ledger line 121. "For the first time, nothing is beyond
  me" survives intact inside the real sentence, so the image costs nothing. Four reviewers
  independently observed the longer first-party text is _better_ here — the escalating "any… any…
  any…" is a man cataloguing everything that used to be out of reach.
- **Reader benefit:** The article's emotional payoff becomes verifiable at the subject's own site
  instead of refuted by it.
- **At risk:** PROTECT-08. The closing paragraph and the "never closes" image are untouched by this
  repair and must not be rewritten alongside it.
- **Acceptance test:** Every character inside the closing blockquote appears contiguously (modulo
  marked ellipsis) at `nav.al/ai`, and every date reference to that episode — body, attribution, and
  ledger line 121 — reads February 19, 2026.

### P0-02 — The opening sentence rewrites the family's emigration and contradicts the article's own account

- **Origin:** SUBJ-B1 (subject), FAN-R1 (fan), UNFAM-R2 (unfamiliar), CRITIC-C7 item 1 (critic).
- **Location:** line 148, opening paragraph — the page's first factual claim.
- **Passage:** "Naval Ravikant was nine years old when **his mother moved him and his older brother**
  from New Delhi to a studio apartment in Queens."
- **Adjudicated problem:** Naval's own account is that the family emigrated together, that his father
  worked in a New York hardware store because his Indian pharmacist degree was not recognized, and
  that "my family split up" came afterward. The draft states the correct sequence ninety lines later
  in the Queens section, so the page contradicts itself. The unfamiliar reviewer caught this cold,
  without leaving the page — the only blocker in the entire jury that was independently detectable
  by a reader with no outside evidence.
- **Evidence:** Packet CLM-02, classed **contradicted in part**; Ferriss #97 ("We were immigrants so
  we came to this country when I was 9"); Almanack ("My dad came to the US—he was a pharmacist in
  India. But his degree wasn't accepted here, so he worked in a hardware store" / "My family split
  up"). **Confidence: high** — settled by the draft's own later text independent of the packet.
- **Minimum repair:** Make the first sentence agent-accurate about the move and let the split arrive
  where the article already handles it correctly. The father's unrecognized degree is a _better_
  window-pane datum than anything currently in paragraph one, so this can be done at roughly net-zero
  words by shedding the duplicate father sentence in the Queens section.
- **Reader benefit:** Removes the page's only internal contradiction, at its most-read position.
- **At risk:** The cold open's momentum (PROTECT — UNFAM-H1). Do not let the repair add throat-clearing;
  the library beat must still land in the same paragraph.
- **Acceptance test:** The opening paragraph and the Queens section can be read back to back without
  producing two incompatible accounts of who came to America and when the family split.

### P0-03 — "He holds exactly one line" is contradicted by the cited episode

- **Origin:** SUBJ-B3 (subject), FAN-R3 (fan), UNFAM-C5 (unfamiliar), CRITIC-C6 (critic), ENN-I3
  correction (enneagram). **Five perspectives.**
- **Location:** line 380, "Naval Ravikant at Fifty-One."
- **Passage:** "They wake and sleep when they want and get wide latitude on food and screens. **He
  holds exactly one line:** 'I insist on math and reading.'"
- **Adjudicated problem:** Naval names **two** interference points in the same episode. The missing
  one is that he steps in when one child is hitting the other. "Exactly one" is a manufactured
  absolute that sharpens the section's irony by deleting the humanizing half, and it leaves a reader
  with the impression that a father permitting unlimited screens also permits his children to hit
  each other. It is the most confidently stated claim on the page and the source contradicts it.
- **Evidence:** Packet CLM-13, classed **contradicted**, verified by local grep of tim.blog #788: "The
  two places where I probably interfere a lot is one is I insist on math and reading… And the other
  one is if one of them is hitting"; also "Where I would say I am restrictive is I probably interfere
  a lot if they're fighting." **Confidence: high.**
- **Minimum repair:** "He names two: 'I insist on math and reading,' and he steps in when one of them
  is hitting the other." About +10 words. Three reviewers independently noted the second limit is
  _better_ material for this article — it is the one place on the page where Naval intervenes on
  behalf of somebody else's pain, and the one place his sovereignty doctrine meets another person's
  body.
- **Reader benefit:** Removes a checkable misstatement about the subject's children from the section
  the draft is otherwise most honest in.
- **At risk:** PROTECT-03. The repair sits two sentences before "He is the best available witness for
  that and the worst possible one," which must survive verbatim.
- **Acceptance test:** The stated count of parental interventions matches the count Naval gives in
  Ferriss #788, and both are in his own words.

### P0-04 — The plaintiff count is wrong in the body and in structured FAQ data

- **Origin:** CRITIC-B4 (critic), SUBJ-C3 (subject), FAN-R9 (fan), UNFAM-C3 (unfamiliar).
- **Location:** line 263 (body) and frontmatter `faqs` question 3 (ships as FAQPage JSON-LD).
- **Passage:** body — "In January 2005, **Naval and three co-founders** filed suit…"; FAQ — "Ravikant
  and **three Epinions co-founders** sued Benchmark Capital, August Capital, and co-founder Nirav
  Tolia…"
- **Adjudicated problem:** Both phrasings assert four founder-plaintiffs. Contemporaneous reporting
  says **three of five** founders filed, while a _different_ set — **four of five** — held the
  6M+ shares and blessed the merger; the plaintiff group also included non-founder employees. The
  draft appears to have merged the two sets. It is a checkable number about a live legal proceeding
  naming living third parties, and the FAQ version ships to search engines and AI answer boxes where
  it is scraped and repeated and cannot be quietly corrected.
- **Evidence:** Packet CLM-10, classed **likely wrong**, risk **High**; S-07 (SFGate, headline "3 of
  site's founders sue VC partners"), S-09 (Venture Intelligence reprint), S-10 (Eric Goldman, listing
  non-founder Kevin Laws among plaintiffs). Packet dispute #1 notes the docket was not retrieved.
  **Confidence: high that the current number matches no source; the correct precise count is
  RQ-02.**
- **Minimum repair:** De-count in both surfaces without waiting on the docket — "Naval and several
  former Epinions colleagues filed suit" — or, if RQ-02 resolves, state the reported form ("three of
  the five founders, Naval among them, along with other former employees"). Fix body and FAQ in
  lockstep. Net zero words. While in the passage, add the unfamiliar reviewer's half-sentence
  bridging the settlement to the plaintiffs, since "fifty-one former employees" currently arrives
  having never been introduced.
- **Reader benefit:** A high-risk checkable error stops shipping inside structured data, and the
  thesis's hinge section becomes followable on one pass.
- **At risk:** PROTECT-07 and the lawsuit section's sequencing, which four reviewers named as the
  best-reported stretch in the draft. Do not resequence; correct in place.
- **Acceptance test:** No precise founder-plaintiff count appears in body or FAQ unless it matches a
  named source that states that number, and body and FAQ agree.

### P0-05 — A Ferriss exchange is staged as a live back-and-forth that did not occur

- **Origin:** CRITIC-C8 (critic), SUBJ-C5 (subject), FAN-M4/R7 (fan), UNFAM-R3 (unfamiliar).
- **Location:** line 194, diagnosis section — the page's only in-body pressure test of its own type
  call.
- **Passage:** "Ferriss, who has known him for years, **said it to his face**: 'I think you're a very,
  very good strategist and combatant when need be.' **Naval took the read and raised it**: 'I am an
  extremely intense person, very competitive…'"
- **Adjudicated problem:** The transcript order is reversed. Naval's intensity passage sits around
  lines 121–130, prompted by Ferriss relaying an unnamed friend; Ferriss's "combatant" line is at
  line 264 and was itself prompted by Naval having already used the word about himself. Both quotes
  are real; the scene is invented. "Said it to his face" and "took the read and raised it" describe
  a challenge-then-escalation beat that never happened, and the fabricated adjacency does
  argumentative work the record does not support. This is the one passage on the page that is
  supposed to demonstrate rigor, which is exactly why the staging cannot stand.
- **Evidence:** Packet CLM-06, classed "quotes verified; **sequencing contradicted**," with transcript
  line positions. **Confidence: high.**
- **Minimum repair:** Drop the staging verbs and present both as what they are — two moments from one
  long conversation, in the order they occurred. Net zero words. All four reviewers independently
  noted the true sequence is _stronger_ evidence: Naval volunteered "combatant" about himself, and
  volunteered self-description beats being goaded into it.
- **Reader benefit:** The steelman becomes real, which is the entire strategic reason this page
  outperforms an aggregator.
- **At risk:** PROTECT-04. The Type 8 tiebreaker argument that follows is sound and must survive
  intact; only the staging changes.
- **Acceptance test:** No sentence presents either speaker as responding to something the other had
  not yet said, and the order of speech acts on the page matches the #97 transcript.

### P0-06 — The FAQ names head-triad evidence as the clearest Type 5 evidence, contradicting the article's own Rabbit Hole

- **Origin:** ENN-R1 (enneagram). Lone-perspective finding, squarely in-domain, confirmed on my
  reading as an internal contradiction.
- **Location:** frontmatter `faqs` question 1 (line 58, ships as FAQPage JSON-LD); milder duplicate in
  TL;DR bullet 1 (line 162).
- **Passage:** "**The clearest evidence** comes from him, unprompted, on the Tim Ferriss Show in 2018:
  'What I find is that 90 percent of thoughts that I have are fear.'"
- **Adjudicated problem:** Fear is the organizing affect of the **entire head triad** — 5, 6, and 7 —
  which the draft's own body states correctly at line 182, and which the draft's own Rabbit Hole
  makes explicit at line 345 by listing the same figure as the case _for_ **Type 6**. So the field
  most likely to be extracted standalone into search results and AI answers nominates as the
  clearest Type 5 evidence a datum that does not discriminate Type 5 from its triad neighbours, and
  that the same page elsewhere assigns to a rival type. A page whose stated value proposition is
  that aggregators publish "zero reasoning" is publishing self-refuting reasoning in its most
  machine-readable field. This meets the P0 bar for a central Enneagram theory error.
- **Evidence:** Draft lines 58, 162, 182, 345 (verified directly); packet, "Enneagram hypothesis
  evidence": "The 90%-fear figure is the single most Six-shaped datum in the record";
  `src/blog/enneagram/enneagram-concepts.md` line 213 (Type 5 core fear: helplessness / incapability /
  incompetence). **Confidence: high** — this is internal contradiction, not a typing disagreement.
- **Minimum repair:** Rewrite the FAQ answer so the fear quote establishes the _triad_ and the honesty
  passage does the _discriminating_: keep the quote, then add that fear is the head triad's signature
  and does not by itself separate a Five from a Six, and that the discriminator is how he justifies
  his honesty — as processing cost rather than as strength or reputation. Change the TL;DR bullet
  lead from "He typed himself out loud" to a triad-accurate framing. **Frontmatter changes do not
  count against the body word ceiling**, which makes this the cheapest high-value fix on the list.
- **Reader benefit:** Whichever fragment a reader or a model extracts, they get the page's actual
  argument instead of a label the page itself refutes two screens later.
- **At risk:** PROTECT-04. Do not paraphrase the "second thread" line loosely when importing it into
  the FAQ; quote it.
- **Acceptance test:** Read the FAQ answer alone with the article hidden. It must contain at least one
  piece of evidence inconsistent with Type 6, and must not describe a head-triad datum as the clearest
  Type 5 evidence. Then confirm the FAQ and the Rabbit Hole no longer assign opposite weights to the
  same quote.

### P0-07 — "Twenty years of transcripts contain neither" asserts an exhaustive search that was never run

- **Origin:** ENN-R2 (enneagram, blocker); corroborated as an open question by FAN-Q3 (fan) and
  UNFAM-Q3 (unfamiliar).
- **Location:** line 347, Rabbit Hole, "Counterarguments" — the final sentence of the page's
  falsification offer.
- **Passage:** "What would flip this: find him checking a decision with an inner circle before he
  makes it, or find him describing solitude as a thing he recovers in and then leaves. **Twenty years
  of transcripts contain neither.**"
- **Adjudicated problem:** This is an absolute negative over a twenty-year corpus that was not
  searched. The packet says so directly, and its limitation #4 records that Naval's All-In, Joe
  Rogan and Chris Williamson appearances were never examined. The sentence sits inside the paragraph
  that converts this page from a vote into an argument, so it carries more trust per word than
  anything else here — and it is the one sentence a single counterexample destroys. Three
  perspectives arrived at the same doubt from three different directions.
- **Evidence:** Packet, "Falsification test the draft proposes" ("this packet did not run an
  exhaustive search against that test, and it is not obviously decisive") and Research limitations #4.
  **Confidence: high on the overclaim.**
- **Minimum repair:** Scope the claim to the sources actually searched — the published Ferriss,
  Farnam Street and nav.al transcripts — and pre-empt the near-miss the packet itself flags: Naval's
  long allegiance to David Deutsch's school is an intellectual source, not a decision run past a
  group, and saying so disarms the obvious rebuttal instead of leaving it lying next to the claim.
  Net zero to +15 words. **Fold in ENN-C4 at the same time:** the page names Type 8 as "the strongest
  objection" and then supplies a flip test that an Eight passes comfortably. One clause fixes it —
  "or find him justifying his bluntness as strength rather than as overhead, which is an Eight's
  reason and not a Five's" — and it gives the body's best argument a second load-bearing appearance.
- **Reader benefit:** The page's one falsifiable offer becomes an honest one, and it covers the
  alternative the page itself ranks first.
- **At risk:** The falsification paragraph is a preserve item for the subject perspective ("it tells
  the subject what evidence would change the article's mind"). Scope it; do not remove it.
- **Acceptance test:** Every absolute claim about the corpus ("twenty years," "never," "nowhere")
  either names the specific sources searched or is downgraded; and for each type the page names as a
  serious alternative (8, 7, 6, 3), the flip test contains at least one condition that alternative
  would satisfy and a Five would not.

### P0-08 — The H2 heading states an age that becomes false sixty-five days after the stated publication date

- **Origin:** FUTURE-R1 (future). Lone-perspective finding, squarely in-domain. No other reviewer
  flagged it, which is itself the argument for it — five readers checked this page hard and none
  noticed a scheduled falsehood.
- **Location:** line 374 (`## Naval Ravikant at Fifty-One`), line 395 ("a **fifty-one-year-old**
  man"), line 150 ("**Forty-two years later**"). Ledger duplicates at lines 104 and 121.
- **Adjudicated problem:** Naval was born 5 November 1974. He is 51 at the draft date of 2026-09-01
  and turns 52 on 2026-11-05. The heading is correct for sixty-five days and false thereafter, in
  the most structurally prominent text on the page short of the title — headings surface in tables
  of contents, search snippets and internal anchors. "Forty-two years later" becomes forty-three in
  January 2027. The draft is `published: false` with further pipeline passes pending, so there is a
  real chance it goes live at or after the expiry date. Correct-on-publication and durable are
  different tests, and this is the one claim where they come apart inside the same quarter.
- **Evidence:** Packet, "Identity and scope" — birth date verified; the packet explicitly notes he
  "turns 52 on 5 November 2026." **Confidence: high**; the arithmetic is not in dispute.
- **Minimum repair:** Use the rounded, event-anchored idiom the draft already uses successfully in its
  own final sentence ("Four decades after Queens"). Heading → an event anchor rather than an age
  anchor. Body → "a man in his fifties," true until 2034. Intro → "Four decades later," matching the
  close. Net zero words, no new research, no sourcing change. Update ledger lines 104 and 121 for
  internal consistency.
- **Reader benefit:** Removes the only scheduled falsehood on the page and decouples its shelf life
  from a `lastmod` bump nobody is tracking.
- **At risk:** PROTECT-08 — "Four decades after Queens" in the final sentence is the model for the
  repair and must not itself be changed.
- **Acceptance test:** Set a hypothetical read date of 2027-09-01 and confirm no reader-visible
  sentence is false at that date. Grep for `fifty-one`, `Fifty-One`, `Forty-two`, `\d{2}-year-old`
  and confirm zero hits that change value on 2026-11-05.

## P1 — accepted high-value improvements

Ordered by value per word. Items P1-01 through P1-03 are the substantive ones; P1-04 through P1-14
are rewordings, deletions and short disclosure clauses that are net-zero or near-zero on the budget.

### P1-01 — Name the Five's passion and virtue, and answer the "why does this Five give everything away" objection

- **Origin:** ENN-C1 (enneagram, highest-priority concern) **merged with** CRITIC-C4 (critic) and
  FAN-I1/M1 (fan). Three perspectives found three faces of the same hole; none saw the others.
- **Location:** end of the diagnosis section, or the Rabbit Hole "Counterarguments" block. Currently
  absent from both.
- **Passage at issue:** the intro fact — "which has reportedly sold over a million copies and which
  you can read free, in full, on the internet right now. He takes none of the money" — is left
  standing without the objection it obviously raises.
- **Adjudicated problem:** Three distinct gaps that one paragraph closes. (a) The page argues a Five
  for 4,333 words and never names the Five's passion (**avarice**) or virtue (**non-attachment**) —
  the words appear zero times — while the packet identifies "Fives are stereotypically hoarders and
  this one gives everything away" as "the thesis's load-bearing weak joint," and the repo's own
  research file concedes the current resolution is "generous." (b) The critic's mundane competing
  hypothesis is never stated and therefore never defeated: content is the standard deal-flow engine
  of modern venture (Graham 2004, Wilson, Feld, a16z, First Round), so publishing is weak diagnostic
  evidence for a type unless the page says why this case is different. The draft's own `suggestions`
  frontmatter lists Paul Graham and Marc Andreessen — the two people who did this without the Queens
  biography. (c) Naval's own framework is absent from the reader-visible body: `specific knowledge` 0,
  `permissionless` 0, `productize yourself` 0. The article's thesis _is_ his published doctrine,
  uncredited, and "productize" reaches the reader only inside the title of Brock's attack essay.
- **Evidence:** `src/blog/enneagram/enneagram-concepts.md` line 213 — Type 5 passion **Avarice**,
  virtue **Detachment**, fixation Stinginess (verified directly). Corpus precedent verified at
  `src/blog/people/drafts/Malcolm-Gladwell.md`: avarice is "not greed for money, but the hoarding of
  _self_. Energy, time, emotional availability, presence. The Five gives the world their analysis,
  their frameworks, their labels. What they withhold is themselves." Fan's term-count audit of the
  frozen body. Packet, "Behavior the type does not comfortably explain." **Confidence: high.**
- **Minimum repair:** One paragraph, ~110 words, doing three moves at once. (1) _The avarice
  objection answered:_ he publishes his understanding without limit and withholds himself without
  exception — no net worth, no spouse on the record, and by the article's own construction not one
  scene in this piece places him in a room with another living person. The Almanack costs him nothing
  a Five actually hoards. (2) _The commercial reading defeated:_ he gave away the information
  asymmetry his own side of the table profited from, while employed on that side, and he takes no
  money from the book. Both facts are already on the page. (3) _The credit returned:_ his own word
  for it is **permissionless**, which is the exact word for a man whose defining injury was needing
  permission to see the numbers. Land the virtue last — "desire is a contract you make with yourself
  to be unhappy" is the Five's prescribed medicine, sold publicly by a man the page argues was formed
  by the disease.
- **Reader benefit:** Closes the one objection that comes from inside Type 5, converts the thesis
  from asserted to argued for the reader who works in venture, and produces the page's most
  non-obvious insight. It also does the sameness work the packet asks for — Musk, Andreessen and
  Dorsey are not publicly evangelizing non-attachment.
- **At risk:** **PROTECT-10.** The enneagram reviewer is explicit that adding "avarice" and
  "non-attachment" must not become permission to reopen the Type 5 avoid-list vocabulary (fortress
  mind, retreat into the mind, the world takes more than it gives), whose deliberate absence is a
  documented asset. Use plain-English apposition, one occurrence each. Also at risk: PROTECT-06 —
  do not let the "he withholds himself" beat drift into speculation about his marriage.
- **Word cost:** ~110. Funding plan in Conflicts.
- **Acceptance test:** A reader who knows Type 5's passion can find, in one paragraph, the page's
  answer to "why does this Five give everything away," and that answer must distinguish what he gives
  from what he keeps. A reader who works in venture can state, from the page, why the psychological
  reading beats the marketing reading. The words "avarice" and "non-attachment" appear once each, in
  apposition, and no avoid-list phrase appears anywhere.

### P1-02 — Retire "Nobody asked him that question" and restore the frame that follows the fear quote

- **Origin:** CRITIC-C5 (critic), SUBJ-C2 (subject), ENN-C5 (enneagram). Three perspectives.
- **Location:** TL;DR bullet 1 (line 162), diagnosis (line 178), FAQ answer 1 (line 58).
- **Passage:** "'90 percent of thoughts that I have are fear…' **Nobody asked him that question.**"
  and "He supplied the evidence himself, **unprompted**… A public figure associated with calm and
  engineered serenity **volunteered** that nine out of ten of his thoughts are frightened ones."
- **Adjudicated problem:** The quote is verified verbatim; the framing is oversold. In the transcript
  the line lands at the end of a riff in which Naval has just said he is afraid "because I'm losing
  my hair," Ferriss replies "That's a very tactful way to put it," and Naval immediately adds "as any
  Buddhist will tell you, desire is just fear by another name." The draft quotes the setup ("The
  other 10 percent are probably desire based") and withholds the clause that collapses the two
  categories. "Unprompted" is narrowly defensible — Ferriss did not ask about fear. "Nobody asked him
  that question" is not, once the surrounding text is visible. This is the page's single most-repeated
  piece of evidence, appearing on four surfaces.
- **Evidence:** Packet, "The typing self-report," with the context block explicitly flagged as "not in
  the draft"; Disputes #9 ("Conclusions resting on 'nobody asked him that question' should stay
  qualified"). **Confidence: high.**
- **Minimum repair:** Delete "Nobody asked him that question" (free) and soften "unprompted" to
  something the transcript supports ("he volunteered it, in an answer about something else"). Then
  add the Buddhist clause, ~30 words, because two reviewers independently observed it makes the
  evidence _stronger_: a man who converts a private fear into a doctrinal generalization mid-sentence
  is doing exactly what the page argues he always does, and a man whose two available states are fear
  and fear-in-disguise has told you what he is organized around.
- **Reader benefit:** The page's load-bearing evidence survives a reader who opens the transcript.
- **At risk:** The diagnosis section's opening momentum. Also note the draft's own source-audit
  constraint: do not lengthen prose between the Knowledge Project pull-quote and the "antisocial
  introvert" sentence, or that citation drops from inline to vague. Place the addition before the
  pull-quote, not after.
- **Word cost:** ~+25 net.
- **Acceptance test:** A reader who reads twenty lines either side of Ferriss #97:1291 finds nothing
  in that passage the article failed to anticipate, and no surface asserts that nobody asked.

### P1-03 — Scope, credential and de-superlative the Brock frame

- **Origin:** CRITIC-B1 (critic, **blocker — downgraded, see Conflicts**), UNFAM-C7 (unfamiliar),
  FUTURE-C1 (future). Three perspectives, three different defects in one sentence.
- **Location:** line 356.
- **Passage:** "**The sharpest** came in July 2026 from Mike Brock, writing in _Notes From the
  Circus_, and it deserves to be **stated at full strength rather than softened**."
- **Adjudicated problem:** Three things at once. (a) The page promises the case at full strength and
  imports only the half a childhood story can answer; Brock's essay is a political argument placing
  Naval in a division of labour with Thiel and Balaji Srinivasan and reading his democracy commentary
  as reactionary politics in spiritual language. The packet flags this directly: the draft "quotes
  the sharpest formulations of a polemic while leaving out the argument they belong to." (b) An
  unfamiliar reader is asked to accept "the sharpest criticism in existence" from a person and a
  publication they have never heard of, on the article's word alone. (c) "The sharpest" is a
  superlative about the state of published criticism, dated five weeks before publication, that can
  only become less defensible; and if Naval's political profile grows at all, a page that quotes
  Brock four times while never mentioning politics ages from "balanced" to "conspicuously incurious"
  without a word changing.
- **Evidence:** Packet S-12 ("Polemic with an explicit political thesis the draft does not import");
  the future reviewer fetched the essay directly and confirmed the 2026-07-27 date, no paywall, both
  quoted phrases present, and the political thesis. **Confidence: high.**
- **Minimum repair:** Two clauses, no restructuring. Drop the superlative ("One of the sharpest…").
  Replace "stated at full strength rather than softened" with an explicit scope statement that
  credentials Brock and discloses the borrowing in the same breath — that his essay makes a broader
  political argument this page is not equipped to adjudicate, and that the narrower charge about
  method is the one that bites here. Roughly net zero.
- **Reader benefit:** The page's strongest passage stops resting on unexplained authority and on a
  checkable claim about its own fairness that fails, and it gets credit for a scoping decision it
  already made responsibly.
- **At risk:** **PROTECT-02.** Do not touch "That lands, and pretending otherwise would be fandom,"
  the gradient-background sentence, or "he has an obvious interest in only one of those facts being
  discussed." All three were named by multiple reviewers and one (the last) is the sentence that stops
  the empathy turn from becoming an acquittal.
- **Acceptance test:** A reader who opens Brock's essay from this page encounters no central thesis
  they were not warned about, can tell who Brock is, and the section contains no unqualified
  superlative about the state of criticism.

### P1-04 — Disclose the friendly witnesses

- **Origin:** CRITIC-C1 (critic).
- **Location:** line 265 (Hoffman), line 194 and three further citations (Ferriss), line 150 (Almanack
  money claim).
- **Passage:** "Auren Hoffman, **an entrepreneur who has watched Naval's career from inside the same
  world for two decades**, put the cost plainly."
- **Adjudicated problem:** The page's entire corroborating chorus is friendly, and the reader is told
  the opposite. Hoffman is introduced as a neutral long-range observer; his essay is an admiring piece
  whose organizing premise is a favorable Naval/Nirav Tolia contrast, and the packet classifies his
  "true to his nature" line as "interpretation by a friend, not documentation" while noting it is the
  sole outside corroboration of the outsider thesis. Ferriss was an advisor to AngelList at the time
  of #97 and says so in his own introduction.
- **Evidence:** Packet S-11 (Hoffman tier note), Third-party testimony (Ferriss conflict, disclosed in
  the episode). **Confidence: high.**
- **Minimum repair:** Three to six words each. "Hoffman, a friend and longtime admirer…" / "Ferriss,
  then an advisor to AngelList…" The Almanack money claim is already correctly attributed to the
  project's own site and needs nothing.
- **Reader benefit:** Disclosure costs almost nothing and inoculates the page against a fairness
  objection a hostile reader will otherwise land cleanly.
- **At risk:** PROTECT — the Hoffman block quote itself, which three reviewers named as doing work no
  paraphrase could. Change the introduction only, never the quote.
- **Acceptance test:** Each third-party voice on the page carries its relationship to the subject.

### P1-05 — Link the Type 5 page from the main body and stop using "5w4" before it is defined

- **Origin:** UNFAM-C2 (unfamiliar).
- **Location:** line 178 (diagnosis, "most likely a 5w4") and FAQ answer 1; the three
  `/enneagram-corner/` links all sit inside the collapsed Rabbit Hole.
- **Adjudicated problem:** The page never says what the Enneagram is, "5w4" appears roughly 2,000
  words before the Rabbit Hole defines a wing, and the Rabbit Hole opens by telling non-nerds to skip
  it — so the only orientation on the page is behind a door the reader who needs it is told not to
  open. I verified this is a house-convention deviation rather than reader unfamiliarity: **479 of
  532 people drafts link an `enneagram-type-N` page; this draft has zero.** Siblings link it from the
  main body (Hailee-Steinfeld line 167, Pamela-Anderson line 162, Ryan-Reynolds line 166).
- **Evidence:** Direct grep of the frozen draft and of `src/blog/people/drafts/`. **Confidence: high.**
- **Minimum repair:** Link the first main-body mention of the type to
  `/enneagram-corner/enneagram-type-5`, and either drop "most likely a 5w4" from the diagnosis opener
  and the FAQ (letting the Rabbit Hole introduce it) or append a four-word gloss. Near zero words.
- **Reader benefit:** One click to orientation for the newcomer, no undefined notation before its
  definition, and recovered internal-link equity the page is currently leaving on the floor.
- **At risk:** PROTECT-07 (Rabbit Hole gating). Do not un-gate the Rabbit Hole to solve this; the
  gating is a preserve item for the unfamiliar perspective itself.
- **Acceptance test:** No Enneagram notation appears in the main body before it is glossed or linked,
  and at least one Enneagram link sits outside the collapsed section.

### P1-06 — The checkable-detail cluster

- **Origin:** FAN-R9 (fan), CRITIC-C7 (critic), FUTURE-C2 and C5 (future), UNFAM-C8 (unfamiliar),
  SUBJ (subject).
- **Adjudicated problem:** Seven small verified inaccuracies, none individually trust-breaking, which
  collectively produce the directional pattern that is the critic's central finding. All are
  packet-verified and all repairs are net-zero or near-zero.
  1. **"a reader named Eric Jorgenson"** (line 150) — Jorgenson is a professional writer and product
     strategist, later CEO of Scribe Media. "A reader" purifies the give-it-away story into a fairy
     tale. Repair: "a writer named Eric Jorgenson." One word. (CLM-28; three perspectives.)
  2. **"which became default infrastructure for startup fundraising and hiring"** (line 150) —
     AngelList Talent was spun out in November 2022 and rebranded Wellfound; AngelList kept fund
     admin, SPVs and rolling funds. Repair: drop "and hiring," which is not load-bearing anywhere on
     the page, or bound it in time. Two words. (FUTURE-C2, sourced.)
  3. **"In 1999, at twenty-five"** (line 251) — born 1974-11-05, so he was 24 for most of 1999.
     Repair: drop the age or say twenty-four. (CLM-22.)
  4. **"Epinions raised about $45 million from Benchmark Capital and August Capital"** (line 253) —
     ~$45M is the reported total raised; only the $8M seed is documented to those two firms. Repair:
     "raised about $45 million, seeded by Benchmark Capital and August Capital." (CLM-23.)
  5. **"peaked at number 23 among US social apps"** (line 306) — inferred from a single-week
     SensorTower snapshot; a same-week report put Airchat at #27. Repair: "reached number 23 … in its
     launch week." (CLM-26.)
  6. **FAQ #4 lists Neuralink** among his early investments — Wikipedia attributes Neuralink to
     _Spearhead founders_, not Naval's personal early checks. Repair: drop Neuralink;
     Uber/Twitter/Notion/Postmates are solid. (CLM-29; frontmatter, so free on the word budget.)
  7. **"two and a half hours"** (line 376) and **"His own children, he said, are…"** (line 380) — the
     runtime is unverified (packet dispute #8), and a January 2025 statement about minors is rendered
     in the present tense thirty-two months before the twelve-month review horizon. Repair: "a full
     episode" unless the runtime is checked; and "As of that conversation, his children **were**…"
     One word, and it makes the claim permanently true rather than a live assertion about children.
- **Evidence:** Packet CLM-22, CLM-23, CLM-26, CLM-28, CLM-29, dispute #8; future reviewer's direct
  sourcing on the Wellfound spin-out. **Confidence: high on all seven.**
- **Reader benefit:** Converts the piece's biggest structural vulnerability — errors that all lean one
  way — into a demonstrable strength, at almost no cost.
- **At risk:** PROTECT-06. Preserve every existing hedge while fixing these; "reportedly sold over a
  million copies," "the book's own site says so," and "take it as his account rather than as an
  audited fact" are doing durability and trust work and must survive.
- **Acceptance test:** Each number and descriptor on the page traces to a named source that states it,
  the FAQ agrees with the body, and no sentence asserts a current fact about the subject's family
  sourced to a statement more than twelve months old.

### P1-07 — Remove the durable-exile implication and carry the allegation hedge downstream

- **Origin:** CRITIC-B3 and part of CRITIC-B4 (critic, **blocker — downgraded, see Conflicts**);
  UNFAM-C3 and UNFAM-Q1 (unfamiliar).
- **Location:** H2 at line 278 ("How Naval Ravikant Turned Being **Frozen Out** Into AngelList"),
  line 270 ("Naval had traded a seat on the inside for a check whose size nobody knows"), TL;DR
  bullet 5.
- **Adjudicated problem:** Two parts. (a) The section asserts a realized, lasting cost — exile from
  the inside — while VentureBeat, the same article the draft uses for the settlement and the
  fifty-one employees, reports that any post-suit freeze-out "apparently evaporated" within months
  and separately ran a correction retracting a claim that Ravikant had been "booted" from Dot Edu
  Ventures. The draft takes the supporting fact from that source and leaves the undercutting one.
  (b) The named defendants are living third parties; the case settled with no admission and was never
  adjudicated, and their account appears nowhere.
- **Adjudication note:** I am **downgrading this from the critic's blocker to P1**, and the reason
  matters for the editor. The _ex ante_ claim survives fully: Hoffman, quoted verbatim on the page,
  says Naval "knew he'd had to give it up (likely would get fired)" and that the suit "was his path to
  cementing being an outsider." That is a trajectory claim, and it is exactly what the draft's
  sentence asserts. What is unsupported is the implication of a _lasting_ exile carried by the H2's
  "Frozen Out." So this is a precision problem in a defensible claim, not a false claim.
- **Evidence:** Packet S-08 (VentureBeat correction and the "evaporated" note), dispute #5, S-11
  (Hoffman verbatim). **Confidence: high on the precision problem; the underlying claim stands.**
- **Minimum repair:** One clause acknowledging the freeze-out was real but short-lived, re-anchoring
  the psychological point on the decision to sue _knowing the likely cost_ — which the evidence fully
  supports and which the critic correctly notes is the more interesting claim: choosing a cost you
  expect and then not paying it beats martyrdom. Consider whether the H2 still earns "Frozen Out."
  Separately, add one short clause that the defendants disputed the allegations and the December 2005
  settlement carried no admission of liability. ~20 words total.
- **Reader benefit:** The argument gets stronger, not weaker, and the page's largest fairness gap
  regarding named third parties closes.
- **At risk:** **PROTECT-07** and the subject reviewer's SUBJ-H2, which names the lawsuit section's
  allegation framing as exemplary and asks to preserve it verbatim. The filing sentence is already
  correctly hedged — do not touch it. Only the downstream and headline language changes.
- **Acceptance test:** No sentence claims a durable exile; no sentence outside a direct quotation
  asserts as fact that Naval was deceived; a reader who has read the VentureBeat piece finds nothing
  to correct.

### P1-08 — Stop using CoinList as the emblem of un-revisable ledgers

- **Origin:** CRITIC-C2 (critic). **Direct conflict with FAN preserve item #8 — resolved below.**
- **Location:** line 310.
- **Passage:** "CoinList and MetaStable are the same wound working in a second material: a man whose
  defining injury was being handed somebody else's summary of the numbers spent a decade on ledgers
  anyone can audit and **nobody can quietly revise**."
- **Adjudicated problem:** A company is used as affirmative character evidence while the single most
  citable fact about its public conduct cuts the other way: CoinList Markets LLC settled with OFAC on
  2023-12-13 for $1,207,830 over 989 Crimea-related transactions, with OFAC finding the violations
  were not voluntarily self-disclosed. The sentence also conflates the ideology of trustless ledgers
  with the ordinary intermediaries built on top of them, which remain subject to ordinary compliance
  failure.
- **Adjudication:** The fan reviewer names this sentence "the second-best connection in the piece" and
  puts it on their preserve list; the critic wants CoinList removed. Both are right about different
  things. The _insight_ — the window-pane injury restated in a second material — is genuinely strong
  and must survive. The _exposure_ comes from naming CoinList specifically as the emblem and from the
  absolutism of "nobody can quietly revise." So: keep the insight, remove the load from CoinList.
- **Evidence:** Critic's own research (OFAC settlement PDF and CoinDesk corroboration), not
  packet-verified — the packet does not mention CoinList's record at all. **Confidence: high that the
  sentence is unearned as written; the repair does not depend on adjudicating the OFAC facts.**
  Fairness constraint: Naval co-founded CoinList in 2017 and was not CEO; the conduct postdates his
  founding role. No repair may imply personal culpability. See RQ-04.
- **Minimum repair:** Cheapest and safe either way — generalize to the decade in crypto and let
  MetaStable carry the naming, and soften "nobody can quietly revise" to a claim about the design
  rather than the companies. Net zero words. If RQ-04 shows Naval held no operating or board role in
  the violation window, the sentence can keep CoinList with the softened absolutism.
- **Reader benefit:** Removes the page's clearest instance of one-sided evidence selection about a
  third party, without losing the connection the fan reader most enjoyed.
- **At risk:** **PROTECT-05** and the fan's preserve item. "He opens rooms and then walks out of them"
  closes this paragraph and must survive untouched.
- **Acceptance test:** The sentence's claim survives a reader who knows about the December 2023
  settlement, and the window-pane-in-a-second-material insight is still legible.

### P1-09 — Rebuild the 5w6 rebuttal on the real six-wing evidence

- **Origin:** ENN-C2 (enneagram).
- **Location:** Rabbit Hole, "Naval Ravikant's Wing: 5w4," lines 325–327.
- **Passage:** "a 5w4 makes aesthetic objects out of understanding… returns compulsively to interior
  states, meaning, and beauty **rather than to mechanism**." And: "the 6 wing tends to bind you to a
  group or a system for safety, and **Naval keeps choosing the exit**."
- **Adjudicated problem:** The wing call is probably right and the argument for it is the softest
  reasoning on a page whose whole pitch is reasoning. Three pieces of the article's own evidence point
  the other way. "Rather than to mechanism" is contradicted by his signature output — leverage,
  specific knowledge, "productize yourself," "assets that earn while you sleep," all mechanism claims
  — and by the page's own best interiority evidence, which is engineering vocabulary ("debugging
  mode," "a second thread," the draft's own "memory leak"). "Keeps choosing the exit" is contradicted
  by the one affiliation he has never exited: Popper–Deutsch critical rationalism, sustained over a
  decade, including calling _The Beginning of Infinity_ "the best book I read in 20 years," sitting
  with Deutsch on Ferriss #662 (2023), and in 2025 spending an episode advocating a doctrine tim.blog
  itself describes as deriving from "the philosophy of Popper and Deutsch called Taking Children
  Seriously." And the outsiderness assigned to the 4 wing is, in Naval's own telling, material and
  immigrant — the window pane sentence ends "I want that for myself and my kids," which is wanting-in,
  not the Four's sense of being constitutionally different.
- **Evidence:** Enneagram reviewer's sourced external research (Ferriss #662, tim.blog's own
  description of the TCS lineage); the draft's own quoted vocabulary. **Confidence: high that the
  current argument is unsound; medium on the wing call itself, which both the enneagram reviewer and
  I would still land on 5w4 for the form of the output.**
- **Minimum repair:** Keep 5w4; fix the argument. Acknowledge that his _content_ is mechanism and his
  _form_ is aesthetic, since the wing shows in form. Replace the exit sentence with the real
  counterweight and a real answer: name the decade of critical-rationalism allegiance as the strongest
  5w6 evidence, then answer it — he affiliates with _ideas_ and not with _institutions_; he left
  August Capital, sued Benchmark, and handed AngelList away. Roughly net zero.
- **Reader benefit:** A reader who thinks Naval is 5w6 can see the page understood their case.
- **At risk:** Nothing on the protect list. This paragraph is not on any reviewer's preserve list.
- **Acceptance test:** The 5w6 paragraph cites at least one concrete, dated piece of six-wing evidence
  and answers it.

### P1-10 — Resolve the two incompatible meanings assigned to January 2005

- **Origin:** ENN-C3 (enneagram).
- **Location:** Rabbit Hole "Stress and Growth Arrows" (line 339) against the body's lawsuit and
  "Under Pressure" sections.
- **Passage:** Rabbit Hole — "In growth the Five moves toward Eight, and **January 2005 is the
  cleanest example in his life**." Body — "CoinList and MetaStable are the same **wound**…"; and
  Hoffman, quoted approvingly, calls the suit "**true to his nature**."
- **Adjudicated problem:** The same event is the health peak, the defining wound, and characteristic
  rather than developmental. A reader tracking the argument cannot hold all three, and it invites
  exactly the charge the packet warns about — "the arrow framework can absorb almost any assertive
  behavior." The arrow _direction_ is correct per house canon (5 integrates to 8), but "growth" is a
  health-level claim and the page carries no health-level frame anywhere.
- **Evidence:** `enneagram-concepts.md` line 213 confirms the arrow directions; the contradiction is
  internal to the draft. **Confidence: high on the contradiction.**
- **Minimum repair:** Drop the growth label and keep the observation — "January 2005 is where the
  Eight line shows: he stopped observing and stated the conclusion out loud" — plus one clause
  conceding that the same act is, on this page's reading, also the injury he has been answering ever
  since. Fewer words than the current version.
- **Reader benefit:** Removes an internal contradiction and demonstrates the page knows the difference
  between an arrow and an excuse.
- **At risk:** PROTECT-05. The stress-arrow paragraph's refusal to resolve Airchat-vs-handoff must not
  be disturbed.
- **Acceptance test:** The Rabbit Hole arrow paragraph and the "Under Pressure" section do not assign
  opposite valences to the 2005 lawsuit without the page acknowledging it is doing so.

### P1-11 — Give the Type 6 rebuttal the evidence it currently asserts without

- **Origin:** FAN-M2/I2 (fan).
- **Location:** Rabbit Hole "Counterarguments," the Type 6 paragraph.
- **Passage:** "a Six seeks an authority, an ally, or a contingency plan, and **Naval's response to
  fear is to sit alone and name it until it dissolves**."
- **Adjudicated problem:** This clause is the page's counter to its own single most disconfirming
  datum — ninety percent fear, which the packet calls "the single most Six-shaped datum in the
  record" — and nothing on the page supports it. `meditat` appears zero times in the reader-visible
  body. A fan recognizes the paraphrase of the sixty-minutes-for-sixty-days practice, but recognition
  is not citation, and a reader should not have to supply the article's evidence from memory.
- **Evidence:** Fan's term-count of the frozen body; navalmanack.com "Meditation + Mental Strength,"
  fetched by the fan reviewer — "try sixty days of one hour a day, first thing in the morning"; "like
  a giant inbox of unanswered emails, going back to your childhood"; "When you open your mental
  'email' and there are none." The domain is already inside the draft's `citations`, so this adds no
  new sourcing risk. **Confidence: high.**
- **Minimum repair:** One clause naming the practice and its mechanism, ~20 words — not the fan's full
  two sentences. The discriminating force is what matters: his prescription involves no authority, no
  ally and no contingency plan, which is precisely what a Six would reach for.
- **Reader benefit:** The counter-typing move becomes evidenced rather than asserted, and "mental
  inbox zero" quietly closes the loop opened by the page's own pull-quote ("nothing is missing… your
  mind shuts down").
- **At risk:** Word budget. This competes directly with P1-01; if only one addition survives the trim
  plan, P1-01 wins and this becomes P2.
- **Acceptance test:** The Type 6 paragraph cites at least one first-party description of what he
  actually does with fear, and a reader can state the practice without prior knowledge.

### P1-12 — Carry his mother's "unconditional and unfailing love"

- **Origin:** SUBJ-C4 (subject).
- **Location:** the Queens section, which together with the opening renders the childhood as unbroken
  lack — a menial job, night classes, keys and no supervision, nine or ten addresses, no friends, nose
  against the glass.
- **Adjudicated problem:** In the same Almanack passage the draft mines for every one of those
  details, Naval says: "My mother uniquely provided, against the background of hardship, unconditional
  and unfailing love." The packet flags it as "the strongest available counterweight to a purely
  deprivation-shaped reading" and explicitly notes its absence "is an evidentiary choice a reviewer
  may fairly examine." It is also the page's most notable act of selective quotation from a source it
  otherwise quotes freely, and it concerns a private person who is currently characterized only by her
  jobs and her absence from the apartment.
- **Evidence:** Packet, First-person evidence, with the line quoted and the omission flagged.
  **Confidence: high.**
- **Minimum repair:** One sentence in his words, ~25 words, placed so it cannot read as a softening of
  the thesis. It _sharpens_ the type argument: a Five's insufficiency is about capacity and
  information, not about love, and saying so makes the argument more precise — what was missing was
  never affection.
- **Reader benefit:** Removes the page's clearest selective quotation and makes the Enneagram claim
  more exact.
- **At risk:** The Queens section's economy. Fold it into the existing mother sentence rather than
  adding a new beat.
- **Acceptance test:** A reader who opens the Almanack's "In His Own Words" page finds no childhood
  passage the article suppressed.

### P1-13 — Give the Decompressing section its forward context, and gloss "cap table"

- **Origin:** UNFAM-C1 (unfamiliar, highest-priority concern).
- **Location:** "Decompressing Naval Ravikant's Most Famous Sentence," the "A contract" beat and the
  section's closing.
- **Passage:** "The metaphor arrives from a man who **watched a document declare his shares
  worthless**…" and "revised by a thirty-year-old who had just been shown **a cap table with his name
  on the wrong line**."
- **Adjudicated problem:** At this point nothing has mentioned Epinions, shares, a merger or a
  lawsuit — those arrive in the next two sections. The bespoke centerpiece, the single thing that
  makes this page unportable to another subject, spends its two strongest beats pointing at events
  the reader has never heard of. The next section's opener ("He got the metaphor somewhere") confirms
  the withhold is deliberate, but a deliberate withhold still costs the newcomer the payoff at the
  moment it is offered. "Cap table" is unglossed jargon landing squarely in the gap.
- **Evidence:** Structural, from the unfamiliar reviewer's unaided cold read, formed before any
  external input. **Confidence: high on the effect.**
- **Minimum repair:** One clause of forward context inside the "A contract" beat that names the event
  without spending the story, plus a gloss or replacement for "cap table." ~12 words. **Reject the
  reorder** — see Rejected feedback.
- **Reader benefit:** The page's most distinctive section lands on first read for the reader least
  equipped to supply the missing story.
- **At risk:** **PROTECT-01.** The four-beat structure and "Not a feeling. A document." must not be
  disturbed; add the clause inside the existing beat.
- **Acceptance test:** A reader who has read the article top to bottom and nothing else can explain
  what "watched a document declare his shares worthless" refers to at the moment they encounter it.

### P1-14 — Mark the interior monologue as reconstruction

- **Origin:** SUBJ-C7 (subject), UNFAM-C4 (unfamiliar).
- **Location:** lawsuit section, `<p class="inner-thought">`.
- **Passage:** "They have the numbers. I have their summary of the numbers. And there is no way, from
  here, to check."
- **Adjudicated problem:** First person, present tense, dropped between two paragraphs of documented
  fact with no speaker and no framing, inside the page's only legal section — where invented
  first-person thought carries the most weight. The unfamiliar reader reported being unable to tell
  whether it was Naval quoted, Naval paraphrased, or the author imagining. Mitigating and confirmed by
  the subject reviewer's repo check: the device is house convention across 158 blog files and renders
  (per `src/scss/blog.scss:630`) as an italic tinted panel with a thought-bubble icon, typographically
  distinct from the page's real quotations. It is also not in quotation marks and is a fair
  restatement of his documented information-asymmetry complaint.
- **Evidence:** Draft's own ledger describes it as an authored "Interior beat"; repo CSS check.
  **Confidence: medium** — this is house convention, and reasonable readers will distinguish it.
- **Minimum repair:** One framing clause in the preceding sentence marking the beat as reconstruction
  ("The position they were in is easy to reconstruct:"). ~8 words. **Do not delete it** — both
  reviewers agree it is the most vivid sentence in the section and is doing real work.
- **Reader benefit:** Keeps the device and removes any chance a reader banks it as testimony.
- **At risk:** The section's rhythm. Both reviewers were explicit that deletion is the wrong repair.
- **Acceptance test:** No reader skimming the section can plausibly attribute the sentence to Naval
  Ravikant.

## P2 — optional opportunities

Only **P2-01** is likely to pay for itself in this revision. The rest are recorded so they are not
lost and can be picked up at a future pass with more headroom.

- **P2-01 — The luck / survivorship objection and Naval's answer to it.** (CRITIC-C3.) A section
  titled "Why Naval Ravikant's Advice Annoys People" that never mentions luck is answering a
  different question than its title asks — the thread is literally called "How to Get Rich (Without
  Getting Lucky)." The strongest form of this is _internal_: the draft supplies the disconfirming
  material itself at line 219 ("That saved my life, because once I had the Stuyvesant brand, I got
  into an Ivy League college") and then endorses the meritocratic gloss three sentences later ("A
  test. One test, taken alone, scored objectively, with the rules published in advance"). Naval has a
  documented four-kinds-of-luck answer, so the draft currently omits both the charge and his reply.
  Repair is net-zero words if paid from that gloss. The critic searched and found no Brock-grade
  published formulation, so this must rest on the internal tension, not on a weak citation. **Verify
  the four-kinds-of-luck wording against the Almanack before quoting it.** This is the only P2 I
  would spend budget on, and only after every P0 and P1-01 through P1-03 are done.
- **P2-02 — Make the aggregator claim structural rather than enumerative.** (FUTURE-C4.) "The
  personality aggregators split their MBTI votes across INFJ, ENFP, INTJ, and INTP" is the page's
  competitive differentiator stated as a snapshot of pages that change continuously. The durable claim
  is that they publish tallies without reasoning. Date-stamp it or restate it structurally.
- **P2-03 — Make the limit the finding in the instinctual-subtype paragraph.** (ENN-C6.) The page
  ranks the sexual/one-to-one instinct last on the basis of material the scope constraints removed by
  policy — an inference from a hole the page dug. The enneagram reviewer's replacement is better: the
  one-to-one instinct is hardest to rate _because_ he keeps that material off the record, which is
  itself the most Five-shaped fact available, and the love-as-transaction quote already in the body is
  far stronger ground than absence.
- **P2-04 — Retire the two unsupported population claims about Fives.** (ENN-C7.) "Fives are heavily
  overrepresented in tech" lost its only support when the second pass cut the corpus percentages;
  "Most of them are painfully aware of how much they do not know" is a totalizing claim inside an
  otherwise person-first paragraph. Both are also **trim candidates** — see the funding plan.
- **P2-05 — Place Shane Parrish's testimony in the body.** ("You're one of the most voracious readers
  I know.") Flagged by the subject and fan reviewers and by the draft's own second-pass notes. It is
  the only third-party observation of a plainly observable behavior rather than an inferred one, and
  it has sat in the TESTIMONY LEDGER unused across three passes.
- **P2-06 — Name one book Naval actually reads.** (FAN-M3.) Books are the epigraph, the recurring
  motif and the closing image, and every named book on the page belongs to Kamal, Stupple or
  Jorgenson. The physics/Feynman thread is already sourced in the Rabbit Hole and could be promoted
  with a single clause.
- **P2-07 — Compress the venture list.** (UNFAM-C6.) Five proper nouns, four unexplained, in two
  sentences; the only place the unfamiliar reader's attention dropped. Also a **funding source** —
  see the plan below.
- **P2-08 — Add an as-of marker to "stayed on as chairman."** (FUTURE-C6.) The role can end without
  announcement and the sentence uses it to carry an argument.
- **P2-09 — Read the Sovereign Child material through the type, not only for irony.** (ENN-I3.) "I
  insist on math and reading" is not an arbitrary line — it is the two literacies that let a child
  educate himself without needing anybody, which is exactly what the library and the Stuyvesant exam
  did for a nine-year-old with no supervision. Genuinely good, and ~50 words the budget does not have
  this pass.

## Research required before deciding

- **RQ-01 — Are the two `@naval` posts dismissing personality typing authentic, and what is their
  exact wording and date?** _(Origin: SUBJ-C1, the subject reviewer's highest-priority concern.)_
  Two first-party status URLs surfaced consistently across two searches and two years —
  `x.com/naval/status/1127367372430426113` ("Horoscopes for the educated classes") and
  `x.com/naval/status/1434675499377127425` ("Myers-Briggs is astrology for the overeducated class")
  — but **direct fetch returned HTTP 402 and the wording is unverified.** _What it unlocks:_ the page
  performs a typology on a man who has publicly called typologies astrology, and never says so, while
  its own keyword list targets "Naval Ravikant MBTI." If verified, two sentences in the
  Counterarguments paragraph quoting him and stating that this page is an argument from his record
  rather than a claim about his self-conception is the highest-leverage credibility move available —
  it is the strongest possible framing for a page whose advantage is that it reasons where aggregators
  vote. _Source needed:_ the live posts via a browser session or an archive service. _Fallback if
  unverifiable:_ a generic one-sentence acknowledgment that he is on record as skeptical of
  personality systems — weaker, but still better than silence. **Do not print either tweet as a
  quotation without verifying the live post.**
- **RQ-02 — Who exactly filed the January 2005 complaint in _Ravikant v. Tolia_?** _(Origin:
  CRITIC-Q1, SUBJ-Q2, FAN-Q2, UNFAM-Q2 — four perspectives.)_ Reporting is consistent that three of
  five founders filed while four of five held the blessed-then-worthless shares, and that the
  plaintiff group included non-founder employees such as Kevin Laws. The draft's "Naval and three
  co-founders" matches none of these. _What it unlocks:_ whether the FAQ can ship a precise count
  (better for structured data) or must ship the hedge. **P0-04's safe repair does not wait on this.**
  _Source needed:_ San Francisco Superior Court docket, complaint filed 2005-01-19; the packet
  confirms it was never retrieved and every secondary reprints the same SFGate report. A
  contemporaneous defense statement from Gurley, Johnston or Tolia would additionally upgrade P1-07's
  no-admission clause into a one-sentence steelman of the other side.
- **RQ-03 — Did Naval leave or lose his position at August Capital after filing suit?** _(Origin:
  UNFAM-Q1; bears on CRITIC-B3.)_ The section's entire stake is that he "traded a seat on the inside,"
  and the only support is Hoffman's _prediction_ that he "likely would get fired." The unfamiliar
  reader wanted this more than any other missing fact on the page. _What it unlocks:_ a confirmed
  departure lets P1-07 state the outcome plainly and strengthens the thesis; a confirmed stay-on
  forces the softer framing. _Source needed:_ August Capital team-page captures 2005–2007,
  contemporaneous VentureBeat/PEHub coverage, or Naval's own account in the Ferriss #97 transcript
  already held locally.
- **RQ-04 — Did Naval hold any operating or board role at CoinList between April 2020 and May 2022?**
  _(Origin: CRITIC-Q2.)_ _What it unlocks:_ which P1-08 repair is right. If he was purely a founding
  investor with no operating role, generalizing away from CoinList is correct and sufficient. If he
  held a board seat during the violation window, the fact arguably belongs on the page — still with no
  culpability claim. _Source needed:_ CoinList corporate filings or coverage of the 2017 Protocol Labs
  spinout and subsequent governance.
- **RQ-05 — Did Naval fund or commission _The Sovereign Child_?** _(Origin: ENN-Q1.)_ A
  search-result synthesis asserts he "is a donor to the organization that funded the book and pushed
  Aaron to write it." The enneagram reviewer **could not corroborate it and used none of it as fact**
  — the tim.blog episode page describes him only as a co-discussant. _What it unlocks:_ if verified,
  the "Fifty-One" section changes meaning — not a man moved by another's book but a man who paid for
  his own philosophy to be written down by someone else and then took it to the largest podcast in the
  world. That is the publication thesis in a third domain, **and it is a disclosure the page would owe
  the reader.** _Source needed:_ takingchildrenseriously.com funding/acknowledgements, the book's
  acknowledgements, or Stupple on the record.

## Conflicts and editorial tradeoffs

**1. The word ceiling is the binding constraint, and it does not fit without trims.**
Verified: the reader-visible body runs **4,333 words** against a 4,500 ceiling — about **167 words of
headroom**. Accepted additions total roughly **185 words** (P1-01 ~110, P1-02 ~25, P1-12 ~25, P1-11
~20) on top of a net **+25** from the P0 repairs. That is ~210 against 167. Reviewers identified
enough trims to close it, all of which the jury independently endorsed:

| Trim                                                                                           | Source                    | Approx. words |
| ---------------------------------------------------------------------------------------------- | ------------------------- | ------------- |
| Compress the venture list to the shape of the claim (P2-07)                                    | UNFAM-C6                  | ~25           |
| Cut "Fives are heavily overrepresented in tech" (P2-04)                                        | ENN-C7                    | ~8            |
| Trim the second half of the sp/so subtype paragraph                                            | ENN-C1's own funding note | ~30           |
| Cut the "In 2018 he posted the thread. In 2020 he let a reader give the rest of it away" recap | FAN-I1                    | ~20           |
| Shed the duplicate father sentence in Queens (paid by P0-02)                                   | SUBJ-B1                   | ~15           |

That is ~98 words recovered against ~43 needed, leaving margin. **Order of operations: cut first,
then add.** This repo has a documented history of second passes blowing the ceiling by adding
fresh-eyes substance before trimming. If the budget still binds after trims, **P1-11 (meditation) is
the first thing to drop to P2**, and **P1-01 is the last thing to drop, ever** — it is the highest
value item on this list.

**2. Two critic blockers downgraded to P1, with reasons on the record.**

- _CRITIC-B1 (the "full strength" promise)_ → P1-03. The draft does state Brock's compression charge
  at full strength — four verbatim quotes in his sharpest formulations, conceded before being
  answered. What it omits is a _different_ charge, the political one. That is a scoping problem
  requiring disclosure, not a false claim requiring a rebuttal. I also **reject the critic's own
  preferred option (b)** — spending two sentences adjudicating Brock's ideology charge — as outside
  the entity-gap packet's `personality-lane-only` scope and as costing words P1-01 needs.
- _CRITIC-B3 (the freeze-out)_ → P1-07. The _ex ante_ claim is fully supported by Hoffman verbatim on
  the page; only the implication of a _lasting_ exile is unsupported. Precision problem in a
  defensible claim, not a false claim.

**3. Critic vs fan on CoinList — resolved by splitting insight from emblem.** The fan puts the crypto
sentence on their preserve list as "the second-best connection in the piece"; the critic wants
CoinList removed on the OFAC record. Resolution in P1-08: keep the window-pane-in-a-second-material
insight, move the naming load off CoinList, and soften "nobody can quietly revise." Both reviewers get
what they were actually protecting.

**4. Subject vs critic on the lawsuit section's hedging.** The subject names the allegation framing
exemplary and asks to preserve it verbatim; the critic says the hedge is dropped downstream. Both are
right about different sentences. The _filing_ sentence is correctly hedged and must not be touched;
the H2 and the downstream language are where P1-07 applies. I decline the critic's broader reading
that "told his shares were worth zero" and "handed somebody else's summary of the numbers" are
unhedged assertions of deception — the first is verified in SFGate and the second is a characterization
of his own documented complaint.

**5. Unfamiliar wants more orientation; the scope packet forbids biography.** Resolved by taking the
cheap, house-conventional fix (P1-05: link the type page, gloss the notation) and declining the prose
Enneagram definition. 479 of 532 sibling drafts already do exactly this, so it is a convention
deviation, not a scope expansion.

**6. Enneagram wants a health-level frame; I reject it.** See Rejected feedback. The cheaper
repair (P1-10) resolves the same contradiction without importing a new theory layer.

**7. Where perspectives disagree about the same paragraph, the empathy turn wins.** The critic
insists "he has an obvious interest in only one of those facts being discussed" is the single most
important sentence in the draft; the subject flags "He is doing the only thing that ever worked on
him" as a totalizing causal claim (SUBJ-C6). I am **deferring** SUBJ-C6: the subject's own
alternative — echoing "I'm not sure I answered your question about where it comes from" into the
empathy turn — costs ~20 words the budget does not have, and the critic's sentence, two lines later,
already performs the same limiting function. If budget appears, take the one-word version ("the thing
that worked on him first") rather than the 20-word one.

## Rejected feedback

- **ENN-I2 — add a health-level sentence to the diagnosis.** _Rejected._ Health levels are exactly
  the kind of system jargon the page has deliberately and successfully avoided (the enneagram reviewer
  praises this at ENN-H2 and preserve item #6, and the FORMULA FINGERPRINT ledger documents it as a
  design choice). Importing a new theory layer also _increases_ exposure to the packet's warning that
  "the arrow framework can absorb almost any assertive behavior." P1-10 resolves the contradiction the
  health-level sentence was meant to fix, for fewer words and no new jargon.
- **UNFAM-C1's alternative repair — move the Decompressing section after AngelList.** _Rejected;
  accepted the cheap clause instead (P1-13)._ The reorder would break a documented, working structural
  asset: the cohesion pass built a bridge chain in which "He got the metaphor somewhere" pays off a
  forward reference planted in the "A contract" beat, and "The amateur's format is the aphorism"
  carries Kamal's line into the compression thesis. The unfamiliar reviewer flagged medium confidence
  on which repair is better and noted "reordering has costs I cannot see from here." Those are the
  costs.
- **CRITIC-B1 option (b) — spend two sentences answering Brock's ideology charge.** _Rejected in favor
  of option (a) plus standing._ Adjudicating a political polemic about Silicon Valley reactionism is
  outside the entity-gap packet's `personality-lane-only` licence, would require importing a whole
  argument the page cannot fairly compress, and costs words P1-01 needs. Disclosure of the scoping is
  the honest and sufficient fix.
- **FAN-Q4 — use Kamal as a control group (same apartment, two answers).** _Rejected on scope._ It
  requires characterizing a second private person at length. The subject reviewer independently names
  the current restraint on Kamal a preserve item ("the divergence raised, 'He's the philosopher in the
  family; I'm just the amateur' quoted, and no attempt to explain a second private person"), and the
  fan reviewer concedes it "may be the right call under the scope rules." It is.
- **FUTURE-C3 — restructure the close so it does not depend on the February 2026 episode.**
  _Rejected._ The future reviewer's own analysis says the payoff sentence is already durable and "the
  fragility is in the setup, not the payoff," and grades the repair's sufficiency only medium. A
  current-tense anchor is a required element of this house format, and the actual exposure — a
  misquoted, misdated citation — is removed entirely by P0-01. Restructuring a close that five of six
  reviewers named as the best thing on the page to hedge against an episode becoming less notable is a
  bad trade.
- **The unfamiliar reader's request for a prose definition of the Enneagram, and for a general "what
  he does now" biography section.** _Rejected on scope_ (entity-gap packet, score 33,
  `recommended_action: personality-lane-only`; Wikipedia, navalmanack.com and nav.al own general
  biography intent). The comprehension need is real and is met by P1-05 at a fraction of the cost.
- **SUBJ — change `persona_title: "Silicon Valley's Library Kid"`.** _Deferred, not rejected._ The
  subject reviewer flags it as freezing a fifty-one-year-old at nine, and explicitly marks it "not a
  fairness break" and possibly doing real metadata work. Not worth spending a decision on this pass.

## Protected hits

Every item below was named by two or more perspectives, or by one perspective as the single reason
the page should exist. A revision that fixes all eight P0s and loses any of these has failed.

- **PROTECT-01 — The Decompressing section, whole, in place, in its four-beat structure**
  ("A contract" / "You make with yourself" / "To be unhappy" / "Until you get what you want"),
  including "Not a feeling. A document." and "Compressed, it sounds like wisdom you could apply on a
  Tuesday. Decompressed, it is autobiography. / Which is the strongest thing that can be said for it,
  and also the strongest thing that can be said against it." **Named by all six perspectives.** It
  answers Brock structurally rather than rhetorically, it has a zero decay rate, and it would not
  survive being ported to another subject. This is the reason to publish the page. If words must be
  found, they must not be found here.
- **PROTECT-02 — The Brock concession triad.** "That lands, and pretending otherwise would be
  fandom." / the gradient-background sentence that implicates the page's own audience / "…he has an
  obvious interest in only one of those facts being discussed." Named by critic, fan, subject and
  unfamiliar. The third is the anti-motive-laundering sentence: without it, the empathy turn converts
  a business practice into a wound and stops there. **If the Brock section is trimmed for length, this
  is the last thing that goes.**
- **PROTECT-03 — "He is the best available witness for that and the worst possible one."** Named by
  critic, subject, fan and unfamiliar. Credits and disqualifies the testimony in one breath.
- **PROTECT-04 — The Type 8 tiebreaker argument** via "you've created a second thread in your head
  that then has to stay active," and "He has described a memory leak in the register of ethics."
  Named by all six. It is the only passage doing what the Enneagram is actually for — reading type off
  the _reason given_ rather than the behavior — and it is the specific thing aggregator pages cannot
  produce. P0-05 fixes the staging around it; the argument itself must survive verbatim.
- **PROTECT-05 — "Airchat supports the first reading. The AngelList handoff supports the second. The
  record holds both,"** and "He opens rooms and then walks out of them." Named by fan, subject,
  unfamiliar and enneagram. Do not let a later pass "tighten" the refusal to resolve into a verdict.
- **PROTECT-06 — The restraint list and every hedge.** No net worth, no spouse, no child's name, no
  "radioactive mud," no invented settlement figure; "he tells that story himself and it has hardened
  into legend through repetition, so take it as his account rather than as an audited fact";
  "reportedly sold over a million copies"; "a check whose size nobody knows"; "the book's own site says
  so." Named by all six, for four different reasons — fairness, credibility, durability, and
  comprehension for a reader who cannot check anything.
- **PROTECT-07 — The lawsuit section's sequencing, the Hoffman block quote, the inner-thought beat,
  and "No information. He has been on that side of the glass before, at nine, in Queens."** Named by
  critic, fan, subject and future as the best-reported stretch in the draft. P0-04 and P1-07 correct
  in place; **do not resequence**, and do not expand the callback — its restraint is the craft.
- **PROTECT-08 — The closing paragraph and "Four decades after Queens."** "He is one of the most
  quoted people alive on the subject of not needing anything. Four decades after Queens, what arrived
  is a thing that will explain any book to him, at any hour, and never closes." Named by all six.
  P0-01 fixes the quotation above it and P0-08 uses "Four decades" as the model for the age repair —
  neither may touch the final paragraph itself.
- **PROTECT-09 — The empathy turn's three-sentence build.** "Not a mentor, who requires proximity.
  Not a network, which requires belonging. A sentence, small enough to hold, that still works tomorrow
  in a different apartment." Named by fan, subject, critic and enneagram as the best paragraph on the
  page. Built from Naval's own formation vocabulary rather than house armor-or-scar-tissue grammar.
- **PROTECT-10 — The absence of Type 5 avoid-list vocabulary.** No fortress mind, no "the world takes
  more than it gives," no "retreat into the mind," no "Fives operate/move/don't." The page runs on the
  subject's own images — the window pane, the library, closing time, the second thread, nothing
  missing. **This is the specific regression risk created by P1-01.** Adding "avarice" and
  "non-attachment" is not permission to reopen the register. One occurrence each, in plain-English
  apposition.

## Revision brief

Ordered, bounded worklist. Do it in this order; the trims are step 0 for a reason.

**Step 0 — Cut first (~98 words recovered).** Compress the venture list; delete "Fives are heavily
overrepresented in tech"; trim the second half of the sp/so subtype paragraph; cut the "In 2018 he
posted the thread…" recap; shed the duplicate father sentence in Queens. Do not add anything yet.

**Step 1 — The eight P0 repairs.** All are net-zero to +25 words combined.

1. **P0-01** — replace the closing pull-quote with the first-party `nav.al` wording; correct the date
   to February 19, 2026 in the attribution, the prose above it, and ledger line 121.
2. **P0-02** — fix the opening family sequence (paid by the Queens trim in step 0).
3. **P0-03** — name both parenting limits.
4. **P0-04** — de-count the plaintiffs in body **and** FAQ #3 in lockstep; add the settlement bridge.
5. **P0-05** — un-stage the Ferriss exchange.
6. **P0-06** — rewrite FAQ answer 1 so the fear quote sets the triad and the honesty passage
   discriminates; retriad the TL;DR bullet. _(Frontmatter — free on the word budget.)_
7. **P0-07** — scope "twenty years of transcripts" to the sources actually searched, pre-empt the
   Deutsch near-miss, and add the Type 8 clause to the flip test.
8. **P0-08** — de-age the H2, the body sentence and the intro; update ledger lines 104 and 121.

**Step 2 — Research-required decisions that can be safely resolved now.** RQ-02, RQ-03 and RQ-04 all
have safe defaults already built into their P0/P1 repairs, so **none of them blocks this revision**.
Resolve them if cheap; otherwise ship the hedge. **RQ-01 is the one worth actively chasing** — if the
`@naval` typology posts verify, add the two-sentence acknowledgment; if they do not, use the generic
one-sentence fallback and do not quote. **RQ-05 is a disclosure question**: if the Sovereign Child
funding claim verifies, the "Fifty-One" section needs it before publication.

**Step 3 — Accepted P1s, in this order.**

1. **P1-01** — the avarice / non-attachment / commercial-reading / permissionless paragraph (~110
   words). _The single highest-value change on this list._ Watch PROTECT-10.
2. **P1-02** — retire "Nobody asked him that question"; restore the Buddhist clause (~+25). Place it
   **before** the Knowledge Project pull-quote, not after, or that citation drops to vague.
3. **P1-03** — scope, credential and de-superlative the Brock frame (~0). Watch PROTECT-02.
4. **P1-12** — carry the mother's "unconditional and unfailing love" (~+25).
5. **P1-11** — one clause of meditation evidence for the Type 6 rebuttal (~+20). _First to drop if the
   budget binds._
6. **P1-04 through P1-10, P1-13, P1-14** — the net-zero cluster: witness disclosure; the Type 5 link
   and 5w4 gloss; the seven checkable details; the freeze-out and no-admission clause; CoinList;
   the 5w6 rebuttal; January 2005's double meaning; the Decompressing forward clause and "cap table"
   gloss; the inner-thought framing. These can all be done in one editing pass.

**Step 4 — One P2, only if it pays for itself.** **P2-01** (the luck objection and Naval's
four-kinds-of-luck answer), paid for from the meritocratic gloss at line 219, net zero. Verify the
framework's wording against the Almanack before quoting. Skip everything else in P2 this pass.

**Step 5 — Protected-hit regression checks.** Before declaring done, confirm by direct read:

- The Decompressing section's four beats and both closing sentences are byte-identical (PROTECT-01).
- "That lands, and pretending otherwise would be fandom," the gradient-background sentence, and "he
  has an obvious interest in only one of those facts being discussed" all survive (PROTECT-02).
- "He is the best available witness for that and the worst possible one" survives (PROTECT-03).
- The "second thread" / "memory leak in the register of ethics" argument survives the P0-05 staging
  fix (PROTECT-04).
- "The record holds both" and "He opens rooms and then walks out of them" survive P1-08 (PROTECT-05).
- Every hedge and every omission on the restraint list survives P1-06 (PROTECT-06).
- The lawsuit section is not resequenced and the Queens callback is not expanded (PROTECT-07).
- The final paragraph and "Four decades after Queens" are untouched by P0-01 and P0-08 (PROTECT-08).
- The empathy turn's three-sentence build is intact (PROTECT-09).
- **Grep for the Type 5 avoid-list** (fortress mind, "the world takes more than it gives," "retreat
  into the mind," "Fives operate/move/don't") and confirm zero hits after P1-01 (PROTECT-10).
- Re-run `scripts/blog-lint.sh` and confirm the body is under 4,500 words, and re-run the
  cross-sentence negative-parallelism scan the FORMULA FINGERPRINT ledger documents at zero.
