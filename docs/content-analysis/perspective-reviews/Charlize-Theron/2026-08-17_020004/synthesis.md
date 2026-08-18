---
artifact: perspective-synthesis
schema_version: 1
subject: Charlize-Theron
draft_sha256: 1d74c2c827e026895d7102699b8a14eac37d524dd57f3e62010c7af61a5e9798
synthesis_status: complete
delight_target: fan
p0_open: 9
p1_accepted: 15
research_required: 6
protected_hits: 10
requires_revision: true
synthesized_at: 2026-08-17T07:42:00Z
path: docs/content-analysis/perspective-reviews/Charlize-Theron/2026-08-17_020004/synthesis.md
---

## Executive verdict

All six perspectives returned `revise`. Two returned `trust: broken` (fan, subject), four returned
`trust: strained`. Four of six recorded `delight: clear_hit`. That split is the whole verdict: the
insight in this draft is genuinely first-rate and the fact-handling around it is not yet publishable.

I re-read every cited passage against the frozen snapshot. The reviewers were, with two exceptions,
accurate about what the text says. The convergence is unusually clean — five of six perspectives
independently flagged the same sentence (`both boys`), and every perspective touched the title's
unsupported "at Ten."

The draft's real problem is narrower than nine blockers suggests. It is not a bad argument dressed in
errors; it is a strong argument that repeatedly reaches one notch past its evidence. The pattern
repeats at every scale: an age in the title no source gives, a year attached to a disclosure rather
than an event, a quote with no origin, a director's rebuke aimed at a target the source does not
assign, a ledger that omits its largest entry, and a causal spine ("a straight line") asserted where
the same piece elsewhere models the correct register perfectly ("The fortress and the healthy choice
can be the same building"). The draft already knows how to hold a claim properly. It just does not do
it consistently, and it does it least in the two positions a skeptical reader checks first — the title
and the opening sentence.

One consequence matters for sequencing: the fixes are mostly small, but the draft is at 4496 of a 4500
word ceiling with zero headroom. Nine P0 repairs and fifteen P1s cannot be applied additively. I have
costed the worklist and it balances — roughly 165 words added against roughly 180 words freed — but
only if the editor takes the named cuts. See **Conflicts and editorial tradeoffs**, item 3.

Delight target check: the informed fan is served well here. The bank-teller reframe, the Bombshell/Kelly
reversal, and the two-door ending are all things a knowledgeable reader has not seen connected before.
Every P0 below is designed to leave those intact. The one P0 that touches the piece's signature form
(the _Æon Flux_ row) makes that form stronger, not weaker.

**Recommendation: revise, then re-verify. Do not publish the current snapshot.**

## P0 — mandatory red-flag repairs

---

### P0-01 — "both boys" misgenders her children, one of whom is publicly a transgender girl

- **Originating:** FAN-R1 (fan), SUBJ-R1 (subject), CRITIC-B3 (critic), UNFAMILIAR-R1 (unfamiliar), FUTURE-R2 (future). Five of six perspectives, independently.
- **Location:** "Charlize Theron's family, age, and the husband she never wanted," snapshot line 377.
- **Passage:** "Gerda lives up the street in Los Angeles and has helped raise **both boys** since the beginning."
- **Adjudicated problem:** Contradicted by the subject's own words in the article's own primary source.
  Theron, April 2019: "I'm raising two beautiful, proud, black African girls." In the _Call Her Daddy_
  episode this draft quotes throughout: "no man's moving into our house **while my daughters are
  there**." I verified the draft is internally inconsistent: lines 53, 361 and 375 all say "children,"
  and line 377 is the only reader-visible sentence that assigns a gender. This is a single unreviewed
  word, which is why it is cheap to fix and indefensible to ship. Beyond the factual break, it
  overrides a child's publicly stated identity eight lines after the article quotes Theron asking that
  her children be left to tell their own story — in a piece whose thesis is about who gets to decide
  what someone is.
- **Evidence and confidence:** Packet CLM-03 (graded _contradicted_, "highest risk in the packet"),
  S-03, S-01, S-22. Entity-gap packet instruction: do not characterize her children beyond her own
  public statements. **Confidence: certain.**
- **Minimum repair:** "both children." See **Conflicts** item 1 for why I am overruling the
  fan/critic/unfamiliar preference for "girls" here — her own gendered wording returns via P1-10
  instead, quoted rather than asserted.
- **Reader benefit:** Removes the draft's only dignity violation and its highest-severity checkable
  error, at zero word cost.
- **At risk:** Nothing. No protected hit touches this sentence.
- **Acceptance test:** `grep -inE '\b(boys|sons|grandsons)\b'` over reader-visible text returns zero
  hits, and no sentence assigns a gender to either child except by quoting Theron directly.

---

### P0-02 — The title and TL;DR assert an age of onset no source supports

- **Originating:** SUBJ-R4 (subject, blocker), UNFAMILIAR-R2 (unfamiliar, blocker), CRITIC-C4 (critic),
  FAN-C3 (fan), FUTURE-I9 (future), ENN-R2 (enneagram). All six perspectives.
- **Location:** `title` frontmatter (line 2) and TL;DR accordion bullet 1 (line 144).
- **Passage:** "Charlize Theron: Enneagram Type 8 and the Mask She Was Handed **at Ten**" / "The costume
  issued **at ten**."
- **Adjudicated problem:** I grepped the snapshot: "ten" appears in the title, the TL;DR, and the
  cohesion-pass comment flagging it — and nowhere in the body. The body is correctly anchored to school
  years; the nearest dated ages are 13 (boarding school), 15 (the shooting), 16 (Milan). The
  originating first-person material answers a question Alex Cooper asked about **high school**. So the
  article invents the date on which a living person's trauma response began and prints it in the two
  most prominent positions on the page. The draft's own cohesion pass caught this and left it open,
  which means it ships as a _known_ unsupported claim.
- **Evidence and confidence:** Packet CLM-01 (graded _unsupported_) and Disputes item 1; targeted
  searching across the research file, the entity-gap packet, and the web returned nothing. Because the
  originating question was about high school, absence here is close to disconfirmation.
  **Confidence: high.**
- **Minimum repair:** Remove the number from both places. The body supplies replacements that keep the
  metaphor and the keyword load — "the Mask She Was Handed in Benoni," "the Mask She Built to Survive a
  House." TL;DR bullet becomes "The costume she built as a girl." Do not substitute 13 unless the body
  explicitly ties the boarding-school departure to the persona, which it currently does not.
- **Reader benefit:** Removes an unsupported autobiographical assertion from the first thing every
  reader and every SERP snippet meets, at zero cost to a thesis that never depended on the number.
- **At risk:** The title is the highest-permanence field the pipeline produces (it persists into social
  cards, RSS, and the `blogs_famous_people` row, and refresh passes edit body copy, not H1s). Get the
  replacement right now; it will not be revisited.
- **Acceptance test:** Every specific age in the title, TL;DR, and FAQs appears in the reader-visible
  body with a source.

---

### P0-03 — Miller's rebuke is aimed at Theron when the source does not aim it there

- **Originating:** CRITIC-B2 (critic, blocker), SUBJ-R3 (subject, blocker).
- **Location:** "Why people call Charlize Theron difficult," snapshot line 299.
- **Passage:** "George Miller addressed it publicly in 2024 and **did not hand her a pass**: 'There's no
  excuse for it.'"
- **Adjudicated problem:** The quote is real; the target is asserted. In The Telegraph (May 2024) the
  sentence sits immediately after Miller describes **Hardy** as needing "to be coaxed out of his
  trailer" and **Theron** as "incredibly disciplined — a dancer by training, which told in the precision
  of her performance — and always the first one on set," and it continues "…and I think there's a
  tendency in this business to use great performances as an excuse for other disruption that could be
  avoided." A reader who opens the source finds Miller weighting the criticism toward the disruption
  and, if anything, away from her. Both reviewers independently note the compounding factor and I
  confirm it: the _flattering_ half of the same passage is present in the draft, relocated into the
  Rabbit Hole and spent as 9-wing evidence. One source, split — praise to the optional block, ambiguous
  rebuke promoted into the body and pointed at her. This is the draft's single quoted concession against
  its subject, so the balance the whole section buys with it is currently unearned.
- **Evidence and confidence:** Packet CLM-07 (_quote verified; framing disputed_), S-14.
  **Confidence: high.**
- **Minimum repair:** Restore the contrast in-body, ~15 words: "Miller called Hardy someone who had to
  be coaxed out of his trailer and Theron the most disciplined person on set, then said of the conflict:
  'There's no excuse for it.'" This converts a distortion into a genuinely complicating fact and
  simultaneously satisfies P1-03 (her craft described somewhere outside the accordion). Fix the
  testimony ledger's attribution to The Telegraph in the same edit.
- **Reader benefit:** The concession becomes checkable instead of collapsing on the first click.
- **At risk:** Do not over-correct into exoneration. "None of which makes the War Rig fun for anyone
  else" (protected — PROTECT-09) must still land, and P0-05 supplies the conduct that earns it.
- **Acceptance test:** No sentence claims Miller directed criticism at Theron specifically unless it
  cites a source in which he names her as the target.

---

### P0-04 — An unverified, coarse quotation is placed in her mouth

- **Originating:** SUBJ-R5 (subject, blocker). Lone reviewer, accepted under adjudication rule 4 — it
  falls squarely inside the subject-fairness domain and the packet independently grades it unverified.
- **Location:** "Why Charlize Theron started her own production company," snapshot line 255.
- **Passage:** "She has said she could feel what the financiers actually wanted, which was **'a hot
  lesbian movie with me and Ricci,'** rather than the film Patty Jenkins was trying to make."
- **Adjudicated problem:** Quotation marks assert verbatim accuracy and no original exists. The result
  is a vulgar characterization of unnamed industry financiers attributed to Theron by name on a page
  that will rank for her name. The draft's own testimony ledger excludes a Patty Jenkins line precisely
  because it "could not be independently attributed" — the same standard applied one section away
  removes this. The adjacent Harper's Bazaar fitting-room quote _is_ verified (S-12), which makes the
  inconsistency conspicuous within a single section.
- **Evidence and confidence:** Packet CLM-13 (_unverified_) and Disputes item 5. Present in the
  repository research file with no outlet or date; targeted searching surfaced no original.
  **Confidence: high.**
- **Minimum repair:** Cut it, and replace with the verified fact that supports the identical causal
  claim on firmer ground: _Monster_ was Theron's **first producer credit**, and she put her own salary
  toward the film's finishing costs (S-16). This is a net word saving and it upgrades the section's
  evidence. Both subject and critic arrived at this replacement independently.
- **Reader benefit:** Removes the piece's clearest quotation-fidelity and defamation-adjacent exposure
  while making the "she bought the room" argument harder to dispute.
- **At risk:** The section's causal drive. The replacement fact carries it — she did not just buy
  authority, she spent her own money to finish the film — so the argument survives the cut intact.
- **Acceptance test:** Every direct quotation attributed to Theron in reader-visible text carries an
  outlet and date, inline or in the testimony ledger.

---

### P0-05 — The section that adjudicates her character states no conduct by her and omits her own account

- **Originating:** CRITIC-B1 (critic, blocker) and SUBJ-R2 (subject, blocker). Two perspectives,
  arriving at the same paragraph from opposite directions — the critic wants her conduct named, the
  subject wants her explanation restored. Both are right and the repair is one edit.
- **Location:** "Why people call Charlize Theron difficult," snapshot lines 299–315.
- **Passage:** "On _Fury Road_, Tom Hardy was chronically late, Theron sat in the War Rig in full
  costume waiting, and the set turned genuinely unpleasant for the crew around them."
- **Adjudicated problem:** I verified this against the snapshot. Every verb of agency in the paragraph
  belongs to someone else: Hardy is late, Theron waits, the set "turned." The article's entire fairness
  apparatus rests on this section, and the section names not one thing Theron did — which is why the
  later line "None of which makes the War Rig fun for anyone else" has no antecedent. _None of what?_
  Nothing has been described. The draft then supplies her motive ("An eight who has done that job does
  not become difficult on purpose") in the exact slot where her stated reason belongs. So the section
  simultaneously withholds the adverse facts and substitutes the author's inference for her own
  explanation. Note the draft reached into _Blood, Sweat & Chrome_ for Hardy's wrap note and left both
  her conduct and her account behind: this is a selection problem, not a research gap.
- **Evidence and confidence:** Kyle Buchanan, _Blood, Sweat & Chrome_ (2022) — camera operator Mark
  Goellnicht's account of the confrontation, and Theron's own "there was a sense that maybe sending a
  woman producer down could maybe equalize some of it, because I didn't feel safe." Packet
  Controversies section classifies responsibility as "contested in characterization." **Confidence: high
  on the omission and its effect; high on the existence of her quote, which both reviewers verified via
  secondary sources quoting the book rather than the book itself** — see RQ-04 if the editor wants the
  page number before quoting.
- **Minimum repair:** ~40 words in that paragraph: what she actually did, and her own dated, sourced
  reason, placed _before_ "Here is what the word difficult is doing in her case." Funded by P1-02.
- **Reader benefit:** The empathy turn converts from asserted to earned — the reader sees the
  unwillingness and can weigh it. Her account also makes the confrontation read as a safety response,
  which is _stronger_ evidence for the draft's own thesis than the inference it currently substitutes.
- **At risk:** PROTECT-02 ("Being done placating and being pleasant to work beside are different
  achievements") and PROTECT-09 (the empathy-turn mechanism). Neither is touched by adding facts ahead
  of them; both get stronger. Do not let the restored quote turn the section into a defense.
- **Acceptance test:** The "difficult" section contains at least one specific action by Theron and at
  least one dated, sourced first-person Theron quotation about the conflict, both positioned before the
  author's explanation of the label.

---

### P0-06 — The damage-report ledger is framed as complete and omits its largest entry

- **Originating:** FAN-R2 (fan, blocker). Independently corroborated in structure by CRITIC-C8
  (critic): "a ledger where all five entries clear is an argument disguised as an accounting."
- **Location:** "The damage report: what each transformation took from her body" — the framing sentence
  "Here is the ledger" and the five-row table, which runs _Monster_ (2003) straight to _Fury Road_ (2015).
- **Adjudicated problem:** The section is the article's bespoke form and its best structural idea, and
  it explicitly claims completeness. On _Æon Flux_ (2005) Theron did a back handspring, failed to get
  height, and landed on her neck on a concrete bridge — herniating a disc between the third and fourth
  vertebrae, roughly a centimetre from permanent paralysis, with the right side of her body going numb,
  days in a German hospital, a production shutdown, years of pain management and eventually a neck
  fusion. The completeness framing converts the twelve-year gap into an implied claim that nothing
  happened to her body between the Oscar and Furiosa, which is the opposite of true, and the omitted
  event is the single most famous fact about Charlize Theron's body. This is the fan's stated
  reclassification trigger: writer-did-the-work becomes writer-read-the-greatest-hits.
- **Evidence and confidence:** **Not in the packet** — the packet mentions _Æon Flux_ only as a flop
  under "Failures." I spent one of my three adjudication sources verifying it independently rather than
  inherit the finding: the injury, the mechanism, the C3–C4 herniation, the near-paralysis, the hospital
  stay, and the later fusion are corroborated across Collider, CBR, AOL/NYT syndication and
  contemporaneous CBS News coverage. **Confidence: certain on the facts; high that the omission is a
  trust break.**
- **Minimum repair:** One table row — _Æon Flux_ (2005) | a herniated disc in her neck, a centimetre
  from paralysis, and a shut-down production | a flop released fourteen months after the Oscar — plus
  one clause of prose. ~35 words. Funded by P1-02 and P1-11.
- **Reader benefit:** Closes the hole a fan reads the section to check, and hands the thesis its
  strongest single exhibit. This row is the only entry where the body was spent and the payoff column
  is a loss, which is exactly what makes "she spends her body like currency" read as an accounting
  rather than a flattering metaphor — and it independently resolves CRITIC-C8's pre-reconciled-books
  problem.
- **At risk:** PROTECT-04, the table as a form. Fix the contents, keep the shape. If the word budget
  genuinely cannot carry the row, the fallback is to drop "Here is the ledger" and reframe the table as
  selected — but that is strictly worse, trading the article's best structural idea for four words, and
  it should not be reached for before the P1 cuts are taken.
- **Acceptance test:** The damage report names _Æon Flux_ and the neck injury, and a reader can answer
  "what did her body pay between the Oscar and Furiosa?" from the article alone.

---

### P0-07 — Two load-bearing dates are attached to the wrong events

- **Originating:** CRITIC-C6 (critic), SUBJ-C7 (subject), FAN-C4 (fan). Three perspectives; graded
  concern by each, escalated to P0 here because the packet grades the first _contradicted_ and both sit
  in the two positions a skeptic checks first.
- **Location:** Opening `firstLetter` paragraph (line 130); intro paragraph 3; damage report closing
  line (line 245).
- **Passages:** "**In 2017**, training for _Atomic Blonde_, Charlize Theron cracked two of her own
  teeth." / "Torn intercostal muscles **at fifty** for _Apex_." / "**She was fifty** when they shot it."
- **Adjudicated problem:** (a) _Atomic Blonde_ principal photography began 22 November 2015 after ~2.5
  months of training, placing the clenching and the cracked molars in roughly September–November 2015.
  What happened in 2017 was the _disclosure_, at CinemaCon ("on my fourth root canal"). So the article's
  first sentence and signature image is dated to the press conference rather than the event. (b) _Apex_
  principal photography began February 2025, when Theron was 49; she was still 49 at the May 2025
  Netflix Upfront with the _Apex_ fractured toe. Neither error is load-bearing rhetorically, which is
  precisely the damage: two free-to-fix date inflations in the first three paragraphs teach a checker to
  discount the claims that are not free to check.
- **Evidence and confidence:** Packet CLM-02 (_contradicted on the date_), S-19/S-07/S-08; CLM-04
  (_disputed / likely wrong_), S-06/S-21. **Confidence: high on the 2015 date; medium-high on the age**,
  where undated _Apex_ reshoots leave a narrow escape (RQ-03).
- **Minimum repair:** "Training for _Atomic Blonde_ in 2015…" — the existing CinemaCon mention two
  sentences later already carries 2017. And "at forty-nine" in both _Apex_ locations; "She was
  forty-nine when they shot it" is if anything the sharper line. Do not reach for "fifty" unless RQ-03
  resolves.
- **Reader benefit:** The article's opening image and its best section-closing beat both survive
  fact-checking, at zero rhetorical cost.
- **At risk:** Nothing. Both repairs are shorter or equal in length.
- **Acceptance test:** Every date and age attached to a physical injury matches the event, not its
  disclosure.

---

### P0-08 — The causal spine is asserted as fact, in clinical language, against a documented house rule

- **Originating:** ENN-R2 (enneagram, blocker), CRITIC-C7 (critic), SUBJ-C3 (subject), plus SUBJ-C8 and
  ENN-C6 on the word "diagnosis." Four perspectives converging on three sentences.
- **Location:** Intro (line 132); diagnosis section (lines 165, 167).
- **Passages:** "That is **the whole woman** in one dental record." / "That phrase is the **entire
  diagnosis**." / "There is a **straight line** from the unpredictable house to the fully controlled
  one, and she walks it in public."
- **Adjudicated problem:** Three separate overreaches in one register. (a) _Etiology._ "A straight line"
  is a causal assertion, not a reading, and it collides with an internal adjudication the repo already
  records — the Enneagram's defensible contribution "is not etiology. It is a non-pathologizing
  vocabulary for motivational difference." (b) _The argument damage is worse than the policy problem,_
  and this is the enneagram reviewer's genuinely original contribution: an unpredictable alcoholic
  household is the stock origin story offered for 6, 9, 2 and 1, and the behaviours Theron names in her
  own words — "placate or hide or defend and shield," "smiling and pretending I'm this like cute girl
  that is fine," "I practiced avoidance… I became an expert" — are 9/2/6-shaped, not 8-shaped. Read as
  etiology the childhood is the draft's strongest evidence; read correctly it is the draft's largest
  _anomaly_. The causal frame is what hides that inversion. (c) _Clinical language._ "Diagnosis" applied
  to a living person who has never engaged the Enneagram contradicts the entity-gap packet's explicit
  "do not diagnose" and 9takes' own published line that the Enneagram is "a personal growth framework,
  not a scientifically validated diagnostic tool." The draft models the correct register 200 lines
  later — this is inconsistency, not incapacity.
- **Evidence and confidence:** Packet Disputes item 8 and unresolved question 9 (no Theron statement
  engaging any typology exists); entity-gap packet scope constraint; the repo's own enneagram demand-gap
  research file. **Confidence: high.**
- **Minimum repair:** Three small edits, net word-negative. Replace "the entire diagnosis" with "the
  whole case." Hedge "the whole woman" ("almost the whole woman," or cut the clause). Replace the
  "straight line" with a continuity claim rather than a causal one — _what she builds now answers what
  she says she could not stand then_ — and add one sentence conceding the inversion: the same house
  produced a girl who placated and hid, and the 8 read has to account for her.
- **Reader benefit:** Certainty proportional to evidence, and a type argument that names its own
  strongest anomaly reads as more confident, not less.
- **At risk:** PROTECT-08 — the core-fear move at line 165 ("living at their whim" → the Type 8 core
  fear is being at the mercy of someone else's decisions) is the best type reasoning in the piece and
  must survive. Cut the causal bridge, keep every quotation.
- **Acceptance test:** No reader-visible sentence claims the childhood produced the type or the adult
  architecture, no sentence claims a single phrase or object explains the whole person, and "diagnosis"
  does not appear as the author's own framing.

---

### P0-09 — The 8-vs-3 tiebreaker does not discriminate, and rests on an 18-year-old quote

- **Originating:** ENN-R1 (enneagram, blocker), CRITIC-C2 (critic), SUBJ-C6 (subject). Accepted as a
  central Enneagram theory error under adjudication rule 3.
- **Location:** Diagnosis section (line 171); restated in the Rabbit Hole (line 344); the quote also
  appears in FAQ 4 (line 59).
- **Passage:** "What settles it is what she does with an image once she owns one. She detonates it, on
  schedule, and gets irritated when anyone calls that strategy."
- **Adjudicated problem:** This is the only thing offered to settle the alternative the draft itself
  calls obvious, and it fails on its own terms three ways. (a) It argues from behaviour, not
  motivation — and the room _rewarded_ these demolitions specifically (_Monster_ won; _Tully_ and
  _Bombshell_ drew nominations), so detonating a beauty image to win an Oscar is itself image
  management aimed at a more prestigious audience. The draft states this case in its own intro ("the
  cynical reading is that ugly wins Oscars and she knows it") and never answers it. (b) The irritation
  premise is backwards as evidence: 3s are characteristically stung by the charge of calculation,
  because being seen as authentic is part of the image. "She gets irritated" is 3-compatible, so it
  cannot settle anything. (c) The settling quote dates to roughly 2008, defending _North Country_ and
  _In the Valley of Elah_ — it predates _Fury Road_ and _Tully_, the two transformations the argument
  leans on hardest. A checker who dates it finds the strongest exhibits were still in her future. The
  critic adds a fourth, independently: the rebuttal lives only in FAQ 4 and the Rabbit Hole, i.e. in
  collapsed or skippable furniture where it cannot affect the argument the body is making.
- **Evidence and confidence:** Packet CLM-11 (_quote verified; context and date undisclosed_), S-17;
  9takes' own house discriminator at `src/blog/enneagram/enneagram-type-8.md:191` — "3s want to succeed
  within the system; 8s want to make the system work for them, or burn it down trying."
  **Confidence: high.**
- **Minimum repair:** Swap the tiebreaker from image behaviour to system behaviour using material the
  draft has already built: an actor who wants approval takes better roles and a better agent; an actor
  who wants the system to answer to her buys the means of production and decides who does the measuring.
  That is the fitting rooms → Denver and Delilah → _Bombshell_ chain, already on the page. **Do not
  install the enneagram reviewer's proposed replacement quote (AnOther, S/S 2026) without verification —
  see RQ-02.** The repair works without it. Roughly word-neutral; the replacement consolidates two
  passages.
- **Reader benefit:** The type argument stops depending on the transformations, which means the
  "deglam wins Oscars" reading can be granted in full without touching the thesis — and the piece's
  most-raised objection finally gets answered where the argument lives.
- **At risk:** PROTECT-08 and the Rabbit Hole quarantine structure. Keep the counter-typing argument in
  the Rabbit Hole; only the one-paragraph body version needs the new discriminator.
- **Acceptance test:** A reader who accepts the intro's cynical reading can still finish the diagnosis
  section holding the 8 call, because nothing in the tiebreaker rests on the transformations.

## P1 — accepted high-value improvements

Compressed format; every item carries the same fields.

**P1-01 — The article's best line is not earned by its own setup.** _(UNFAMILIAR-C2, unfamiliar)_
Setup: "watching it with former Fox News colleagues while the camera stayed on **them** crying."
Payoff four paragraphs later: "The woman telling Charlize Theron to have some class had once **cried on
camera** watching Charlize Theron play her." "Them" reads as the colleagues, so the payoff asserts a
fact the setup withheld — and this is the sentence the entire Bombshell section is built to land. The
reviewer found this unaided and then confirmed via two outlets that Kelly did tear up ("I do wish I had
done more, even though I was powerless"), so the payoff is true and only the setup fails. _Repair:_ fix
the setup, not the payoff — "…watching it with former Fox News colleagues, tearing up on camera as she
said she wished she had done more." _Benefit:_ converts the strongest line in the piece from a claim
into a conclusion the reader has already reached. _At risk:_ PROTECT-03 — do not touch the payoff
sentence. _Confidence: high._ _Test:_ cover the payoff and read the setup; a reader should be able to
predict it.

**P1-02 — Testimony hygiene in the "difficult" section: cut Rogen, drop the Kelly concession.**
_(CRITIC-C5 + CRITIC-C3, critic)_ Rogen's line is a compliment delivered while presenting her a
leadership award, and its own stated reason is her filmography ("she murders people in every movie she
does"), not her conduct; placed after Hardy's "absolute nightmare" note it borrows critical colour it
does not carry, and "about as honestly as a co-star can" oversells it. Separately, "Kelly is not wrong
that Theron was performing" concedes a claim Kelly did not make — Kelly's actual charge was that the
appearance was overcompensation for being closeted. _Repair:_ cut both. See **Conflicts** item 5 for
why I reject the critic's alternative of restating Kelly's actual argument. _Benefit:_ the
adverse-testimony count stops being inflated by a compliment — which matters much more once P0-05
supplies genuine adverse material — and the section stops awarding a partial win the reader cannot
price. _At risk:_ nothing protected. This is the primary funding source for P0-05 and P0-06 (~70 words).
_Confidence: medium-high (Rogen), high (Kelly)._ _Test:_ every quotation in the section is about her
conduct, or is explicitly marked as not being about it.

**P1-03 — Name _North Country_, and describe how she works somewhere a reader will see it.**
_(FAN-C1, fan + SUBJ-C1, subject)_ "It earned her a third Best Actress nomination" invites a reader to
count and leaves the second unnamed. It is _North Country_ (2006), playing a miner in the first US
class-action sexual harassment case — fourteen years before she produced the Fox News one. The draft is
already quoting the _North Country_-era press (the 2008 "irks me" line) without naming the film.
Relatedly, the only description of her craft anywhere in the piece is Miller's "incredibly disciplined…
the precision of her performance," quarantined in the accordion as wing evidence. _Repair:_ one clause
naming _North Country_ at the third-nomination sentence; Miller's craft line moves into the body as
part of P0-03, which pays for both at once. _Benefit:_ the piece stops implying that what is
interesting about a three-decade career is what it cost her physically, and the _Bombshell_ argument
gains a fourteen-year precedent. _At risk:_ ~25 words against the ceiling. _Confidence: high._
_Test:_ all three Best Actress nominations are named, and at least one reader-visible sentence outside
the Rabbit Hole describes how she works.

**P1-04 — Orient the 1991 shooting at first mention.** _(UNFAMILIAR-C1, unfamiliar)_ The diagnosis
section opens "she does not say **the night her mother shot her father**" — a definite article
presupposing knowledge the target reader does not have, roughly 2,600 words before the event is
explained. The family section's own framing ("The basic facts, because the internet keeps guessing")
concedes readers arrive without them. _Repair:_ ~20 words at first mention — the year, the drunken
assault, the self-defence ruling. This does not spoil the family section, which is doing emotional
rather than informational work. _Benefit:_ closes the article's largest mid-read abandonment point.
_At risk:_ budget; funded by P1-06. _Confidence: high._ _Test:_ a cold reader can state what happened,
when, to whom, and how it was ruled, at first mention, without scrolling.

**P1-05 — Gloss the load-bearing proper nouns at first use.** _(UNFAMILIAR-C5, unfamiliar)_ "Alex
Cooper" is a bare name and _Call Her Daddy_ is italicised like a film and never explained, though that
one interview supplies a large share of the article's quotes. Megyn Kelly goes unidentified for a
sentence. _Repair:_ an appositive at each first use. _Benefit:_ beyond comprehension, this materially
strengthens the Kelly section — "she said this on a sex-and-relationships podcast" is what gives Kelly's
"have some class" attack its real charge, and the article currently withholds it. _At risk:_ ~15 words.
_Confidence: high._ _Test:_ every proper noun the argument depends on carries an identifying appositive
at first use.

**P1-06 — Fix the corpus statistic: drop "only," make it publish-proof.** _(UNFAMILIAR-C6, unfamiliar +
FUTURE-I1, future)_ "Of the 158 film and television figures profiled on 9takes, **only 16** read as
Type 8." Two independent problems: 16/158 is 10.1% and one ninth is 11.1%, so "only" asks the reader to
read the base rate as scarcity — easy division, caught at the exact moment the article is establishing
authority. And it is stale on publication day, since Theron makes it 159/17, with the corpus having
grown 391→417 in 23 days. _Repair:_ drop "only" and the raw counts; keep the claim that survives, which
is about clarity of the read and is the interesting claim anyway. _Benefit:_ removes an overclaim and a
sentence that needs rebuilding every publish. _At risk:_ PROTECT-08 sits two lines above; do not
disturb it. This is a funding source for P1-04. _Confidence: high._ _Test:_ regenerate corpus stats
after any three publishes; the sentence must still be true unedited.

**P1-07 — Two micro-fixes in the diagnosis section for the cold reader.** _(UNFAMILIAR-C3 + C4,
unfamiliar)_ (a) The weight changes never state a direction — "Thirty pounds… Fifty pounds" appears four
times and "gained" appears nowhere, so the reader who most needs the picture cannot form it. Three
words fixes it. (b) "The obvious counterargument is Type 3" gives a bare label whose definition sits
inside the block the article explicitly tells the reader to skip. Four words fixes it: "Type 3, the
achiever who becomes whatever the room rewards." _Benefit:_ the central physical claim becomes concrete
and the tiebreaker becomes legible instead of decorative. _At risk:_ nothing; ~7 words. _Confidence:
high._ _Test:_ a reader who skips the Rabbit Hole can state what Type 3 is and which direction her body
moved.

**P1-08 — Stop characterising her stated motive as a softening.** _(CRITIC-C1, critic)_ "She describes
the motive gently now: 'I really think I became a producer because I love the nuance of storytelling.'
**The founding was harder-edged.**" That asserts her own account is a retrospective evasion, and it
carries no source. _Repair:_ drop the assertion; argue the control reading around her stated motive
rather than through its dismissal. The verified _Monster_ producer-credit and salary facts arriving via
P0-04 do this work. _Benefit:_ the section stops overriding its subject without evidence. _At risk:_
none. _Confidence: high._ _Test:_ no sentence characterises Theron's own account of her motives as
evasive without citing something that shows it.

**P1-09 — Date the 2008 quote wherever it appears.** _(SUBJ-C6, subject; also CRITIC-C2, ENN-R1)_ "It
really irks me that people think I choose these roles…" appears in FAQ 4 and the Rabbit Hole with no
date. It is from roughly 2008. Her position appears genuinely consistent, so this is not distortion —
but presenting an undated 18-year-old remark as her verdict on work she had not yet done is a fidelity
problem a checker will find. _Repair:_ "she said in 2008," inline, both places. P0-09 removes its
load-bearing role; this removes the remaining exposure. _Benefit:_ the quote stops implying currency it
does not have. _At risk:_ two words. _Confidence: high._ _Test:_ the quote carries a year wherever it
appears.

**P1-10 — Give back her own reason for keeping men out of the house.** _(FAN-C6, fan)_ "No man is
moving into that house **because the position was never open**." Her actual line is that no man is
moving in **while her daughters are there**. The draft keeps the shape of the quote and swaps her
stated reason (protecting her kids) for the thesis's reason. Combined with P0-01, two edits in adjacent
paragraphs both erase her daughters specifically. _Repair:_ restore her framing in her own quoted
words, then let the fortress reading sit next to it rather than replace it. _Benefit:_ repairs fidelity,
makes her daughters visible in the section that is about them, and resolves the girls-vs-children
conflict without the article asserting anything about minors in its own voice (see **Conflicts** item
1). _At risk:_ PROTECT-07 — the piece is braver when her reason and the writer's reading are both on the
page, which is the same virtue the protected "fortress and the healthy choice" sentence already
demonstrates. _Confidence: medium-high._ _Test:_ the paragraph contains her stated reason in her own
framing, and the interpretive reading is marked as the writer's.

**P1-11 — Two Rabbit Hole repairs: the sexual-instinct claim and the _Tully_ arrow.** _(SUBJ-C2,
subject + ENN-C1, enneagram — same sentence, two grounds; and ENN-C3, enneagram)_ (a) "The sexual
instinct sits last: **she is content, she is not lonely**, and she is not reorganizing her life for
anyone." Two independent problems converge: it is a flat assertion about a living woman's interior
state, extrapolated from a public "wait guys, I'm good" that was a rebuttal to pity rather than a report
on her inner life; and every clause measures relationship status, which is not what the instinct tracks
(house canon: "chemistry, passion, depth"). The draft partly contradicts it two sections earlier by
describing an appearance full of exactly that charge. _Repair:_ drop the last-place claim; the stacking
argument survives on sp-dominance alone. (b) The _Tully_ clause as 8→5 stress evidence — "what a five's
collapse looks like when it lands in a body rather than a mind" — treats a depressive episode as type
movement, against her own physiological account ("my body was just dictating where my mind was") and
against house canon, which defines the 8→5 pattern as an information behaviour. The twenty-five-year
silence fits that precisely and carries it alone. _Repair:_ cut the clause. _Benefit:_ removes the
draft's only claim to know how she feels, and its clearest instance of unfalsifiable reasoning. _At
risk:_ nothing protected. Frees ~50 words toward P0-06. _Confidence: high._ _Test:_ no sentence states
her emotional state as fact without attribution; no depressive episode appears as arrow evidence.

**P1-12 — Answer counterphobic 6 by name.** _(ENN-C5, enneagram)_ "Sixes look for an authority to
trust" describes the _phobic_ 6. The relevant alternative — listed as the first mistype for 8 on
9takes' own Type 8 page — is the counterphobic 6, which presents as aggressive, confrontational, and
authority-defying, and the draft never engages it. Worse, the cluster the draft files under "the
behavior that fits none of it" (staying with a partner who called her the problem, therapy to save the
relationship, "walking on eggshells," lifelong avoidance) is a 6 cluster left stranded. _Repair:_ run
the house cold-versus-hot anger test on material already written — 8s run cold anger, going stony and
indifferent; counterphobic 6s run hot anger erupting from anxiety — and the draft's best section is
_entirely about her coldness_. Fold the stranded anomaly into that answer. Likely word-neutral, since it
replaces two disconnected passages with one. _Benefit:_ the most likely sceptic for a woman typed 8 on a
hypervigilance-heavy record finds their strongest case named and answered. _At risk:_ do not let this
grow; the Rabbit Hole is already the longest optional block on the page. _Confidence: high._ _Test:_ the
counterarguments section addresses counterphobic 6 by name, and the anomaly is either explained or
explicitly conceded as unexplained — not both at once.

**P1-13 — Decay-proof three dated claims.** _(FUTURE-I2, I3, I6, future)_ (a) "amfAR **honors** her for
it in October 2026" states a scheduled future event in the present tense; mark it announced-for-a-date
so it is true before and after 24 October. (b) Four age references ("turned 51") go wrong on 7 August
2027, ten days inside the review window, and the FAQ is the one most likely to be surfaced as a direct
answer and to feed structured data; lead that answer with the birth date and treat the age as a dated
observation. (c) "The growth line to two is **recent**" is already wrong — the adoptions were 2012 and
2015 and the therapy around 2012–14, eleven to fourteen years back; only the _Apex_ item is recent.
_Benefit:_ removes the page's only claim that could become flatly false through no fault of the writing,
and the sole surviving relative-time construction. _At risk:_ "At fifty-one, in front of the biggest
cameras ever built" in the closing paragraph is correctly anchored to the _Odyssey_ moment — leave it.
_Confidence: high._ _Test:_ set a read date of 1 September 2027; no sentence states or implies a wrong
age or an unresolved future event.

**P1-14 — Anchor the final line's tense.** _(FUTURE-R1, future — filed as a blocker there; adjudicated
to P1, see **Conflicts** item 4)_ "She still cannot wear a bra without it hurting" is an undated
present-tense claim about a living person's body, in the narrator's voice, at the position of maximum
emphasis. Its only support is her April 2026 "I can barely wear a bra. It's still that bad," about a
February 2025 injury — four months stale at publication and eighteen months from the event. _Repair:_
keep the sentence in its rhythmic slot and make the claim retrospective, tying it to the spring 2026
press, or recast so the enduring claim is about what the role cost rather than what her body is doing
today. _Benefit:_ the ending stops expiring; the image survives intact and only its tense changes. _At
risk:_ PROTECT-01, the most-protected element in the file — four perspectives protect this line
verbatim. Change the tense, nothing else. Do not add a closing thought under it. _Confidence: high that
the claim is undated; medium on whether it has resolved — which is the point._ _Test:_ read the final
sentence on 17 August 2027 with no other information; if it makes a claim about that day that cannot be
checked against a cited date, it is not fixed.

**P1-15 — Source or cut "one of only two."** _(FAN-C5, fan)_ The _Fury Road_ row says "a shoot she has
called one of only two that emotionally finished her" — and the same table supplies two other candidates
(_Tully_, _Apex_), both described in finishing-her terms. Either the claim is stale or the table
contradicts it; nothing in the packet supports the quantity. _Repair:_ attribute it with a date that
explains the count, or cut "one of only two" and keep "a shoot she has said emotionally finished her."
See RQ-05. _Benefit:_ removes a self-contradiction inside the strongest section. _At risk:_ PROTECT-04.
_Confidence: medium-high._ _Test:_ either the quote carries a date explaining the count, or no numeric
claim remains.

## P2 — optional opportunities

- **P2-01 — Account for Dior.** _(FAN-C2)_ "A face that pays for itself" is literally true in a way the
  article never mentions: Theron has fronted Dior's J'adore since 2004, the year of the _Monster_ Oscar,
  and expanded it in 2025. It does not refute the thesis, it completes it — the costume was issued to
  her; she now rents it out on a contract she signs, which is the production-company move in a different
  currency. **This is the highest-value P2 and the only one I would consider paying for**, but only if
  the budget clears after every P0 and P1. ~25 words.
- **P2-02 — Seed the door earlier.** _(UNFAMILIAR-C8)_ The door the entire ending turns on appears for
  the first time in the last hundred words, and the hedge "which is how she tells it herself" reads as
  the writer noticing. Seeding it once in the family section converts the strongest structural move in
  the piece from a reveal into a payoff. Excellent craft point; costs words in a section already growing.
- **P2-03 — Name the gut center once.** _(enneagram, item 3)_ One sentence connecting 8 as a body-center
  type to Theron's own reporting order — the knees went first and the mood followed; the body dictated
  where the mind went. The draft has already spotted the pattern in prose (PROTECT-06 adjacent) and left
  it unnamed. Buys the piece its only non-obvious lens insight.
- **P2-04 — Rebuild the wing evidence on the War Rig.** _(ENN-C2)_ Arriving early is professionalism,
  not a wing. House canon frames 8w9 as stillness that loads then detonates — which is precisely the War
  Rig sequence the draft describes elsewhere. Keep the mother quote, which is the only genuine 9-wing
  evidence in the piece.
- **P2-05 — Re-argue sp-dominance on motivation, not circumstance.** _(ENN-C4)_ "A farm childhood, a
  one-way ticket and three hundred dollars, a motel" are facts about being broke; a 3, 6 or 9 with the
  same biography generates the same list. Also flags a real double-count: the twenty-five-year silence
  is spent twice, as sp self-containment and as the 5 arrow. Pick one home for it. (The proposed
  replacement quote is unverified — RQ-02.)
- **P2-06 — Claim the _Young Adult_ → _Tully_ line.** _(FAN-C7)_ Same writer, same director, seven years
  apart, both about a woman coming apart. Turns the thinnest filmography stretch into evidence of a
  pattern.
- **P2-07 — Gloss the Enneagram itself once.** _(UNFAMILIAR-C10)_ One clause: "one of nine motivational
  patterns the Enneagram sorts people by." The reviewer ranks it last and concedes a reasonable editor
  could decline, since the core-fear definition already carries the load.
- **P2-08 — Fix the section opener that points backward.** _(UNFAMILIAR-C9)_ "She could name that house
  in a mission statement before she could name it out loud" is a good sentence in the wrong slot — both
  referents point at the previous section, and it sits where a scanning reader lands.
- **P2-09 — Drop the quarter-billion budget figure.** _(FUTURE-I7)_ A production-budget number used as a
  scale cue, against a film that opened to $264.1M; the IMAX format and the universally known plot are
  already doing that work in the same sentence. Cheap words back.
- **P2-10 — Date the crowd-database consensus.** _(FUTURE-I5)_ "The crowd databases have converged on
  8w9" is a present-perfect claim about tier-4 sites whose tallies move, and the packet notes Boo carries
  two competing Theron profiles. Add "as of 2026."

## Research required before deciding

- **RQ-01 — Is there any dated first-person source for the persona beginning at ten?** _Unresolved
  question:_ the exact age of onset. _Source needed:_ the full _Call Her Daddy_ audio (video
  `zL6N55FJuYI`), or the Oprah/O Magazine interview with Gerda that the draft's own second-pass notes
  flag as the highest-value unfetched source on the childhood. _Decision gated:_ none — **P0-02 proceeds
  regardless.** If a source later surfaces, the age may return, but it must appear in the body with its
  date before it returns to the title.
- **RQ-02 — Verify the two AnOther (S/S 2026) quotes the enneagram reviewer proposes inserting.**
  "I'm a grown-ass woman. I do want a little bit of control over my own destiny in the art that I make"
  and "I'm not scared of ageing. I just want mobility…" Neither appears in the evidence packet.
  _Source needed:_ the AnOther Magazine S/S 2026 cover story, verbatim. _Decision gated:_ whether P0-09
  and P2-05 may use them. **P0-09's repair is designed not to depend on this**; do not insert either
  quote unverified. Applying the same standard the draft used to exclude the Patty Jenkins line.
- **RQ-03 — Did any _Apex_ photography occur after 7 August 2025?** _Unresolved question:_ her age
  during the shoot. Kormákur has confirmed reshoots picked up the shots she could not finish, but no
  source dates them. _Source needed:_ Kormákur's post-production press for the April 2026 release, or
  Netflix production notes. _Decision gated:_ whether P0-07 may keep "fifty." Absent a source, both
  references read "forty-nine."
- **RQ-04 — Pin Theron's own _Fury Road_ account to a citable location.** Her "I didn't feel safe"
  statement and the producer request are attributed to Buchanan's _Blood, Sweat & Chrome_ (2022) via
  secondary sources (Vanity Fair excerpt, TheWrap); neither reviewer read the book. _Source needed:_ the
  book excerpt or the Vanity Fair publication of it, with a date. _Decision gated:_ P0-05's quotation.
  The conduct half of P0-05 can proceed on the Goellnicht reporting regardless; the quotation should not
  ship without a citable source.
- **RQ-05 — What was the "one of only two" count in its original context?** _Source needed:_ the _Fury
  Road_ or _Furiosa_ press cycle; the phrasing suggests a 2015 or 2024 remark predating _Apex_.
  _Decision gated:_ P1-15. Fallback (cut the numeric claim) is safe and available now.
- **RQ-06 — Archive the _Call Her Daddy_ transcript.** The packet's own largest structural gap: the
  research file states the transcript was pulled for video `zL6N55FJuYI`, but
  `docs/content-analysis/youtube-transcripts-people/` contains no Theron file, so **every timestamped
  quotation in this draft is currently second-hand** — and this episode is the source of most of the
  draft's psychological evidence. The packet also flags the known attribution trap: an unlabelled
  auto-transcript of a two-person show. _Decision gated:_ nothing in this revision individually, but this
  is the piece's largest systemic sourcing exposure and it should be closed before publication rather
  than at refresh.

## Conflicts and editorial tradeoffs

**1. "girls" versus "children" (P0-01).** Fan, critic and unfamiliar recommend "both girls"; subject
explicitly recommends "both children" and warns against "girls," arguing the correct minimum is to stop
assigning gender to minors at all. Both positions are defensible and both cite the same entity-gap
constraint. **Resolution: "both children" in the narrator's voice, plus P1-10 restoring her own quoted
"while my daughters are there."** This satisfies every reviewer's underlying concern simultaneously —
the misgendering is removed, the article stops characterising minors in its own voice, the gendered
reference returns in the only form the entity-gap packet permits (her own words), and her stated reason
for the no-men rule is restored at the same time. It also matches the draft's other four references,
which already say "children."

**2. Rabbit Hole placement.** Unfamiliar (C7) wants the accordion moved so that neither the
highest-search-intent section nor the ending sits behind ~700 words of optional jargon. But the second
pass moved it to its current position deliberately, so that avoidance → the world punishing her for
quitting it reads as one movement, and that intent is documented in the heading-mix ledger. The
reviewer concedes the movement survives either placement. **Resolution: defer.** The cost is real but
structural block moves are expensive this late, the documented intent is sound, and this revision
already touches seven sections. Revisit at the twelve-month refresh.

**3. The word ceiling is the binding constraint on this entire brief.** The draft is at 4496 of 4500
with, in its own words, "no headroom left." Nine P0s and fifteen P1s cannot be applied additively. I
have costed it: **adds ≈165 words** (P0-05 ~40, P0-06 ~35, P0-03 ~15, P1-03 ~25, P1-04 ~20, P1-05 ~15,
plus micro-edits) against **frees ≈180 words** (P1-02 ~70, P1-11 ~50, P0-04 ~25 net, P1-06 ~15, P0-08
net-negative, P0-02 zero-to-negative). It balances only if the editor takes the cuts _first_. **Order
the cuts before the additions.** If the arithmetic still fails, drop every P2 before touching a P0, and
take P0-06's fallback (reframe the table as selected rather than complete) only as a last resort —
future (I8) separately notes that a page declaring `changefreq: monthly` with zero headroom is a
freshness signal the page cannot honour, which is worth raising with DJ but is out of scope here.

**4. FUTURE-R1: a blocker in one lane against the most-protected sentence in the file.** The future
reviewer filed the closing line as a blocker; four perspectives protect it verbatim. **Resolution:
accept as P1-14, not P0.** The claim is not verifiably wrong — it is supported by Theron's own most
recent statement on the subject ("it's still that bad," April 2026) and is merely undated. That fails
the P0 test ("materially wrong or misleading") while clearly meriting repair. The tense anchor costs
nothing and preserves the line, so nothing is lost by the lower classification except sequencing.
Recorded here explicitly so the blocker is not silently downgraded.

**5. Kelly's actual argument (P1-02b).** The critic is factually right that Kelly's charge was
overcompensation — specifically, a speculation about Theron's sexuality — and that the draft concedes a
point Kelly did not make. But the critic's preferred repair (state the actual claim, then concede or
reject it) requires the article to repeat a stranger's public speculation about a living woman's
sexuality in order to argue with it. **Resolution: take the critic's second option — drop the
concession sentence** and let the swagger observation stand on its own without crediting Kelly for it.
This resolves the trust problem (no unearned concession) without importing a claim the subject-fairness
standard would not permit the article to amplify. The critic explicitly offers this alternative.

**6. Two reviewers propose repairs built on unverified quotes.** The enneagram reviewer's tiebreaker
rebuild and subtype repair both lean on AnOther S/S 2026 material absent from the packet. The findings
are sound; the proposed evidence is not yet checkable. **Resolution: accept the findings, route the
quotes to RQ-02, and specify repairs that work without them.** This is the same standard the draft
already applied to the Patty Jenkins line, and applying it inconsistently is what produced P0-04.

## Rejected feedback

- **FUTURE-I4 — add the forward producing slate** (_Tyrant_, _Two for the Money_, _Dance Parents_,
  _Jane_, _Atomic Blonde 2_). Rejected for this revision. The reviewer sources it to aggregator-tier
  material, all titles undated, and warns "do not state release years" and "verify against trades before
  naming more than two." Spending ~25 scarce words on unverified, undated future projects in a piece
  that must cut to fit its confirmed corrections is the wrong trade. The durability point is sound —
  carry it to the refresh list, where the titles will have firmed up.
- **SUBJ-C4 — reframe the Gerda "shot Charles Theron" section-closer.** Rejected as a mandated change.
  The fact is public, disclosed by Theron herself, and accurate; the reviewer rates its own confidence
  medium and concedes "reasonable editors will differ." The cadence is doing legitimate work — it is the
  section's argument, not an ornament. Note the paragraph is being edited anyway under P1-10, so an
  editor who shares the concern can soften it there; I decline to require it.
- **SUBJ-C5 — the first interior beat invents a childhood routine.** Rejected as a change requirement,
  logged as a live judgment. "Listen at the door first. Two steps in the hallway tells you what kind of
  day it is" does extrapolate a tactical routine from a general statement. But the `inner-thought` class
  is an established, signalled device in this corpus, the beat is grounded in her own "not knowing what
  I was walking into," and the reviewer's own confidence is medium. Requiring it would trade a working
  craft device for a risk the styling already manages.
- **Requests for more Enneagram jargon in the body.** Out of scope per the adjudication rules. The
  Rabbit Hole quarantine is a deliberate design decision and it is correct; the enneagram findings I
  accepted (P0-08, P0-09, P1-11, P1-12) are all reasoning errors or unfalsifiable moves, not requests
  for vocabulary. P2-03 and P2-07 remain optional for exactly this reason.
- **Any request to soften the Type 8 call itself.** No reviewer made this request outright and none is
  accepted by implication. Disagreement about type is not a red flag, and the packet is explicit that
  the type is a hypothesis under review. P0-08 and P0-09 fix _how the case is argued_, not what it
  concludes.
- **CRITIC-C8's standalone framing** (the ledger has no losses) is not rejected but is **absorbed into
  P0-06** — the _Æon Flux_ row is the loss. No separate work item.

## Protected hits

- **PROTECT-01 — The two-door ending, from "At fifteen she was inside a door in Benoni" through "She
  still cannot wear a bra without it hurting."** _(subject H7, fan #4, unfamiliar, future)_ **The single
  most important protected hit in this file.** It is genuinely swap-proof — it cannot be moved to
  another subject — and it is the payoff the entire piece is built toward. P1-14 changes the final
  sentence's _tense only_. Do not add a closing thought under it. Keep the clause "which is how she
  tells it herself."
- **PROTECT-02 — "Being done placating and being pleasant to work beside are different achievements,
  and she has one of them."** _(subject H1, fan #3, enneagram)_ Three perspectives call this the best
  sentence in the piece. It concedes the criticism without surrendering the thesis. P0-05 restructures
  the paragraphs around it; this sentence survives verbatim and is what the restructure is built around.
- **PROTECT-03 — "The woman telling Charlize Theron to have some class had once cried on camera
  watching Charlize Theron play her."** _(fan #2, subject #8)_ The entire justification for the
  _Bombshell_ material. P1-01 repairs its setup; the sentence itself is untouchable.
- **PROTECT-04 — The damage-report table as a form.** _(fan #8, subject, critic)_ Cost in one column,
  what the industry claimed it bought in the other — a bespoke structure that collapses if transplanted.
  P0-06 changes its contents, not its shape.
- **PROTECT-05 — "That is the origin story, and everybody remembers it as luck. It was volume."**
  _(fan #1)_ The whole argument in six words, and one of the three not-X-but-Y moves the fingerprint
  ledger deliberately kept. Do not retire it while making other edits.
- **PROTECT-06 — Kormákur's vulnerability quote in its current position**, immediately after the day she
  could not finish. _(fan #6, subject H6, enneagram)_ The best-placed quote in the draft, and external
  corroboration of the 8→2 growth line from a witness with no idea the line exists. Do not move it; keep
  the tap-out as its anchor.
- **PROTECT-07 — "The fortress and the healthy choice can be the same building, and nobody asking her
  about husbands has thought to ask which one it is,"** plus the hedging structure of the whole
  single-motherhood passage including "and she may well be right." _(subject H2, enneagram, critic)_ This
  is the register P0-08 is asking the diagnosis section to copy. It must survive intact to serve as the
  model.
- **PROTECT-08 — The core-fear move at line 165**, minus "that phrase is the entire diagnosis" and minus
  the causal bridge: "Living at their whim… The Type 8 core fear… is being at the mercy of someone
  else's decisions." _(enneagram #1 preserve)_ The best type reasoning in the piece and the thing P0-08
  and P0-09 exist to protect. Cut the frame, keep the move and every quotation.
- **PROTECT-09 — The empathy turn's mechanism** — the childhood job description ("make yourself easy so
  the man stays calm"), nobody thanked her — **and "None of which makes the War Rig fun for anyone
  else."** _(subject, fan #9, enneagram)_ This makes the coldness legible without laundering it. P0-05
  adds the antecedent that sentence currently lacks; do not delete the sentence in the process.
- **PROTECT-10 — The testimony ledger's exclusion standard** (the Patty Jenkins line, dropped for want
  of independent attribution) **and the phrasing "No current partner is publicly established."**
  _(subject H5, #9)_ The standard is right. P0-04 exists because it was applied inconsistently — the
  repair is to extend it, never to relax it.

## Revision brief

Bounded worklist. **Take the cuts before the additions** — the ceiling is the binding constraint
(Conflicts item 3).

**Stage 0 — free the budget first (~180 words).**

1. P1-02 — cut the Rogen sentence and the Kelly concession sentence. (~70w)
2. P1-11 — cut the sexual-instinct-last claim and the _Tully_ stress-arrow clause. (~50w)
3. P1-06 — drop "only" and the raw corpus counts. (~15w)
4. P0-02 — remove "at Ten" from the title and the TL;DR bullet. (zero-to-negative)
5. P0-08 — hedge "the whole woman," replace "the entire diagnosis," replace the "straight line."
   (net negative)

**Stage 1 — P0 repairs, in dependency order.** 6. **P0-01** — "both boys" → "both children." One word; do this first so it cannot be lost. 7. **P0-04** — cut the unsourced "hot lesbian movie" quote; insert the verified first-producer-credit
and salary facts. 8. **P0-07** — "Training for _Atomic Blonde_ in 2015"; "forty-nine" in both _Apex_ locations. 9. **P0-03** — restore Miller's Hardy/Theron contrast in-body; drop "did not hand her a pass"; fix the
ledger attribution to The Telegraph. 10. **P0-05** — add her actual _Fury Road_ conduct and her own dated account, before the empathy turn.
(Depends on P1-02's cuts and on RQ-04 for the quotation.) 11. **P0-06** — add the _Æon Flux_ row to the damage report, plus one clause of prose. 12. **P0-08** (completion) — add the one-sentence concession that the same house produced a girl who
placated and hid, and the 8 read has to account for her. 13. **P0-09** — rebuild the 8-vs-3 tiebreaker on system behaviour, not image behaviour. **Do not use
the unverified AnOther quote.**

**Stage 2 — research decisions that can be resolved safely now.** 14. **RQ-03** — check _Apex_ reshoot dates. If none found in one pass, "forty-nine" stands (already
applied at step 8). Do not block on this. 15. **RQ-04** — pin Theron's "I didn't feel safe" quote to a citable source. If not pinned, ship P0-05's
conduct half and hold the quotation. 16. **RQ-05** — source "one of only two." If not sourced, apply P1-15's fallback and cut the numeric
claim. 17. **RQ-02 / RQ-01 / RQ-06** — do not block this revision. RQ-06 (archive the _Call Her Daddy_
transcript) should be closed before publication as a separate task.

**Stage 3 — accepted P1s.** 18. P1-01 (Kelly's tears in the setup — highest reader return of any P1), P1-10 ("while my daughters are
there"), P1-03 (_North Country_ + Miller's craft line, which piggybacks on step 9), P1-04 (orient the
1991 shooting), P1-05 (gloss Cooper / _Call Her Daddy_ / Kelly), P1-07 (weight direction + Type 3
inline), P1-08 (drop "the founding was harder-edged"), P1-09 (date the 2008 quote), P1-12
(counterphobic 6), P1-13 (amfAR tense, age computability, "recent"), P1-14 (final line tense —
tense only, see PROTECT-01), P1-15 (per step 16).

**Stage 4 — one P2, only if the budget clears.** 19. **P2-01 (Dior)** is the only P2 that pays for itself: it neutralises the most obvious "but what
about—" a knowledgeable reader carries and converts it into thesis support. Every other P2 waits for
the refresh.

**Stage 5 — protected-hit regression checks.** Before handing off, confirm each of the ten protected
hits is present and unaltered except where a numbered item explicitly authorises the change:
PROTECT-01 (tense only, P1-14), PROTECT-02 (verbatim), PROTECT-03 (verbatim; setup changed by P1-01),
PROTECT-04 (shape intact; contents changed by P0-06), PROTECT-05 (verbatim), PROTECT-06 (position
unchanged), PROTECT-07 (verbatim), PROTECT-08 (move intact; frame cut by P0-08), PROTECT-09 (sentence
intact; antecedent added by P0-05), PROTECT-10 (standard extended, never relaxed).

**Final gates.** Re-run `blog-lint.sh` and confirm word count ≤ 4500; re-run the not-X-but-Y hand count
(target 3, do not add a fourth); confirm the same-type similarity scan still clears; and re-run
`grep -inE '\b(boys|sons|grandsons)\b'` over reader-visible text expecting zero hits.
