---
artifact: perspective-synthesis
schema_version: 1
subject: Bill-Burr
draft_sha256: c279d288f1395a0b96ec6c208186b19926202e563247907ae81fbfd50b37a55c
synthesis_status: complete
delight_target: fan
p0_open: 11
p1_accepted: 11
research_required: 6
protected_hits: 10
requires_revision: true
synthesized_at: 2026-08-19T07:31:27Z
---

## Executive verdict

Six independent readers reached the same two-part verdict, and I confirmed it passage by passage
against the frozen draft and the evidence packet: **the argument is right and the sourcing is not
yet honest enough to carry it.**

The argument is genuinely strong. The type call is built from Burr's own repeated words rather
than his persona, it names its own falsification criterion, it quotes a named critic at length and
then explicitly refuses to resolve the ethics in the subject's favor, and it publishes evidence
against its own framing. Every Enneagram theory claim checks out against 9takes canon. Every
corpus figure checks out against `src/lib/data/corpus-stats.json`. All six perspectives rated
delight `clear_hit`, and four of them independently named the same three passages as the reason
to publish the page.

The sourcing is the problem, and the problem has a direction. At eleven separate points the draft
prints a source and stops one clause before the place where the subject bounds, defuses, dates or
contextualizes what the draft is building — and **every one of those cuts runs the same way.**
The load-bearing THR quotation is truncated at the sentence where Burr gives the condition an end
date. The bespoke Riyadh centerpiece presents a passage as a private admission of fear while
omitting that Burr calls the same gig "one of my top three gigs of all fucking time" three
sentences away. A direct quotation about his father could not be located in any retrieved source.
A five-season show is called six. Individually these are edits. Collectively they are a thumb on
the scale, and two of them sit in freely available transcripts the draft itself cites.

The good news is that this is the cheapest class of failure to repair. Nine of the eleven P0s are
fixed by restoring words that already exist in sources the draft already cites, and — this is the
finding I want the editor to internalize — **most of the restorations make the argument stronger,
not weaker.** A boy who organized his whole personality around a threat his father never carried
out is better Type 6 evidence than a boy who was thrown through a wall. A man who can hold "top
three gig of all time" and "dry mouth for the first 20 minutes" in the same breath is better
Type 6 evidence than a man who only admits fear in private, because the second claim is falsified
by the tape and the first is not.

One hard constraint governs the whole worklist: **the body is at 4,510 words against a lint-gated
ceiling of 4,500** (`scripts/blog-lint.sh:354`). There is no headroom. Several P0 repairs add
words. The funding cuts are named in the Revision brief; the editor should not solve the ceiling
by trimming a protected hit.

**Requires revision. Do not publish as frozen.**

## P0 — mandatory red-flag repairs

### P0-01 — The closer states a disputed role as fact and stages a scene from an unreleased film

- **Origin.** FUTURE-R1 (future), CRITIC-B3 (critic), SUBJ-R6 (subject), UNFAMILIAR-R2
  (unfamiliar), FAN-C4 (fan). Five of six perspectives; the only finding with near-unanimous
  independent detection.
- **Location.** §9 "The part Bill Burr plays in October," draft L387–389.
  > "Bill Burr plays a crisis counselor.
  >
  > Somebody handed the angriest man in comedy a chair, put him across from a person coming apart,
  > and asked him to be the one who stays calm and talks them down. It is not obvious casting. It
  > is very good casting. Fifty-four years after the driveway, that is the job."
- **Adjudicated problem.** Two defects, not one. (a) The body asserts flatly what the article's own
  FAQ hedges — L86 reads "**Per the trailer**, Burr plays a crisis counselor." The body is
  inconsistent with the frontmatter of the same file. (b) The chair, the person coming apart, and
  the talking-down appear in **no source**. They are invented scene description supplied to
  complete a redemption arc, and they are the article's final impression. In a piece whose entire
  method is "here is what the record shows," the last paragraph leaves the record.
- **Evidence and confidence.** Packet CLM-32 (rated **disputed**) and dispute #5, which already
  instructs: "Any conclusion that reads the role as therapeutic must stay qualified." Wikipedia's
  cast list gives "Bill Burr as Charlie" with no occupation. Trade trailer coverage describes him
  as "the only PR guy willing to push back against Zuckerberg's stilted, awkward delivery," with
  the only reported dialogue being "These guys are counting on the next round of congressional
  testimony to make you likable, Mark" — crisis *communications*, not crisis *counseling*.
  Confidence **high** that the claim is unverified and the staging unsourced; **moderate** on which
  reading the finished film supports, which is exactly the argument for qualifying it.
- **Minimum repair.** Carry the FAQ's hedge into the body ("per the trailer"), delete the invented
  staging, and land the closer on the two things that are verified: Sorkin cast him, and the
  trailer shows him as the man in the room telling someone how the room is about to read them.
  That reading is *on-thesis* — telling a person they have misjudged how they are landing is the
  same move the draft traces through Philadelphia, SNL and the billionaires. Keep the driveway
  callback and "that is the job."
- **Reader benefit.** The ending survives 2026-10-09 either way, and the article stops doing in its
  last paragraph the exact thing it spends the Riyadh section admirably refusing to do.
- **At risk.** The emotional payoff of the whole page. Do not cut §9 to nothing — the driveway↔job
  landing is what four reviewers called the best close available. Only the therapeutic staging
  goes.
- **Acceptance test.** The reader-visible body contains zero unqualified occurrences of "crisis
  counselor," and no sentence in the closer describes an action performed by Burr's character that
  cannot be sourced to a released trailer line. Re-read on 2026-10-16: the closer requires no edit
  whichever way Charlie turns out.

### P0-02 — The Riyadh centerpiece omits the framing that changes what kind of utterance it is

- **Origin.** CRITIC-B1 (critic), SUBJ-R2 (subject), ENN-R1 (enneagram), FAN-R2 (fan). Four
  perspectives, independently, and the evidence packet calls it "the highest-leverage omission in
  the draft."
- **Location.** §5, the Aug 10 2026 table cell (L273) and the paragraph at L279.
  > "On camera, the account contains no fear at all. On his own show, with nobody to perform
  > invulnerability for, it is twenty minutes of dry mouth and a running threat assessment of
  > everyone who stood up in an 8,000-seat room. … It is the version he gives when nobody is
  > grading him."
- **Adjudicated problem.** Two defects. (a) On the tape, the dry-mouth material sits inside a run
  of favorite international gigs — Italy, Germany, Budapest — introduced with "It's like one of my
  top three gigs of all [ __ ] time" and closed with "that one was a great one." A listener who
  plays the episode the article cites hears **a war story told as a triumph, with fear as colour**,
  not a private admission. The draft prints the fear and drops the frame. (b) "with nobody to
  perform invulnerability for" and "when nobody is grading him" are stated as properties of the
  medium. MMP is a monetized twice-weekly show with a mass audience, 1,364 episodes deep. That is
  a different performance register, not the absence of one.
- **Evidence and confidence.** Packet CLM-12, verified verbatim from the transcript of YouTube
  `8NYGbY4Tmkc` (L345–353 of the packet). Confidence **high**; this is transcript fact, not
  interpretation. This is also the passage the draft's own falsification criterion is about, so
  the omission is self-defeating: the section names the right test and then withholds the evidence
  that runs against it.
- **Minimum repair.** Six words into the table cell or the paragraph beneath it — he files it as
  one of his top three gigs of all time — and then **argue through it rather than around it**. The
  fear and the pride arriving in the same breath is the counterphobic signature and is a stronger
  claim than the one currently made. Replace "with nobody to perform invulnerability for" /
  "when nobody is grading him" with a claim about *register* the evidence supports: the account he
  gives unprompted, ten months later, with no interviewer and nothing to defend. Fund the words by
  cutting "so this is no confession and no retraction," which the repaired passage makes obvious.
- **Reader benefit.** The page's marquee exhibit becomes unfalsifiable-by-playback. A fan who
  plays the episode finds the article was ahead of them rather than behind them.
- **At risk.** PROTECT-03 (the two-date table form). **Do not solve this by deleting the table.**
  All four reviewers who raised it said so unprompted. The form survives; only the interpretive
  overclaim dies.
- **Acceptance test.** §5 contains the "top three gigs" characterization, and contains no sentence
  asserting that Burr has no audience or no incentive on his own podcast. A first-time listener
  playing MMP 8-10-26 from the Saudi Arabia segment encounters nothing the section failed to
  disclose.

### P0-03 — The page's central quotation is truncated at the sentence where Burr bounds it

- **Origin.** SUBJ-R1 and SUBJ-M4 (subject). Lone perspective, squarely inside its domain — this is
  the subject-fairness standard operating exactly as designed. I confirmed it against the packet.
- **Location.** §1, L180.
  > "I became a comedian because by the time I was 23, I was so walled-off and fucked-up that doing
  > stand-up was the easiest way to go into a room full of strangers and make them like me so that
  > no one would hurt me," he told The Hollywood Reporter in 2022.
- **Adjudicated problem.** The quotation ends mid-answer. The next sentence in the same THR answer
  is **"I was onstage with the mindset of a 6-year-old from 23 to about 37."** Burr scoped the
  condition to a fourteen-year window that closed roughly twenty-one years ago. The draft uses the
  quote as the foundation of a present-tense operating system ("somewhere in there a gauge is
  always running," L301) while the same body of evidence has him reporting "the most inner peace
  that I have had in my life" (L317). A reader who opens the source finds the subject supplying the
  expiry the article suppressed — on the single most load-bearing quotation on the page.
- **Evidence and confidence.** Evidence packet L110–122 prints both sentences and marks the second
  "**not used in the draft**"; source S-04 (THR, Hibberd, 2022-04-28, verified via Yahoo
  syndication). Confidence **high** on the omission; **high** that it is material, because the
  draft's thesis is present-tense.
- **Minimum repair.** Print the next sentence, then answer it in one clause. The draft already owns
  the answer: the post-37 evidence it assembles — 2025 dry mouth in Riyadh, the 2026 MRI he had to
  be pushed into, the 2026 Rousey gauge — is the argument that the structure outlived the phase he
  dated. Making that argument explicitly is stronger than hiding the objection. Cost ~20 words;
  fund from P1-02 and the P0-11 trim.
- **Reader benefit.** Converts the page's biggest checkable vulnerability into its most rigorous
  passage, and pre-empts the strongest thing a hostile reader — or Burr — could say about it.
- **At risk.** PROTECT-02 (the three-tellings structure) sits three paragraphs later and must not be
  softened by association. The repair concedes a *date*, not the *motive*.
- **Acceptance test.** Paste the draft's THR quotation into the source and read the next sentence.
  "From 23 to about 37" appears on the page, and the article states somewhere why it argues the
  structure persisted past 37.

### P0-04 — Four unmarked elisions, all removing the clause where Burr de-escalates

- **Origin.** CRITIC-B2 (critic), SUBJ-R3 and SUBJ-R5 (subject). Independently detected in two
  domains; I verified all four against the packet.
- **Location and adjudicated problem.**

  | Draft passage | Omitted next clause in source | Packet |
  | --- | --- | --- |
  | Intro L149, driveway: "She just made me a sandwich and that was it." | "**But it wasn't a big deal back then.** I remember you would just do shit in the neighborhoods and parents just watched." | CLM-33 |
  | §3 L218: "He also remembers the catchphrase: 'I'll put you through that wall.'" | "He used to say that, right? **He never did it. It's just an empty threat.**" | CLM-22 |
  | §6 L291, helicopter blockquote | Between "L.A. basin." and "This place became really claustrophobic," deleted with **no ellipsis**: "Enough conspiracy theory about nothing behind the dollar. Robots coming and all that type of shit." The marked ellipsis later drops the punchline: "When the zombies come, you just start it up… By the way, that does not work." | CLM-16 |
  | §7 L315: "Then the anger came back tenfold." | "…that was only like a **three-week thing** because I kind of saw who I could be." | CLM-30 |

  Any one is defensible compression. Four, all removing the place where the subject limits the very
  claim the draft is building, is a directional edit. The second instance is the serious one: the
  wall line sits between "frigging terrifying… buzz-cut lunatics" and "Every way that you can be
  abused is what I'm talking about," so a reader reasonably infers the threat was carried out —
  and Burr, in the same breath in the same interview, went out of his way to say it was not. That
  is an inference about a named, living, non-public family member that the subject explicitly
  declined to make.
- **Evidence and confidence.** Packet CLM-16, CLM-22, CLM-30, CLM-33; sources S-02 (Ferriss #602),
  S-03 (Ferriss #265), S-05/S-06 (Fresh Air). Confidence **high** on all four omissions
  (packet-verified against transcripts) and **high** on the pattern reading given the uniform
  direction. Two of the four are in Ferriss transcripts the draft itself cites — this is the
  finding most likely to be found by a hostile reader.
- **Minimum repair.** Restore the "empty threat" qualifier inline (**non-negotiable** — it is the
  one with a real person's reputation attached). Restore the driveway de-escalation or add three
  words acknowledging he tells it lightly. Mark the helicopter elision with an ellipsis and cite
  the 2015 Philadelphia Inquirer line ("the ultimate 'F--- this, I'm out'"), which makes the same
  point sincerely, outside a comedy context — that citation does legitimately what the deletion was
  doing illegitimately. The psilocybin bound can stay compressed if the other three are fixed;
  restoring it is four words and is the fairer call.
- **Reader benefit.** Removes the strongest available "this article edits its sources" attack, and
  the childhood section gets *more* accurate and *more* type-diagnostic, not less.
- **At risk.** PROTECT-10 ("He does not present it as an accusation. He presents it as
  inheritance") sits in the same paragraph as the wall repair and must survive verbatim. Also: do
  not over-concede. The gap between how lightly he tells the driveway and how heavily it reads is
  itself the point the piece wants — say that, do not retreat from it.
- **Acceptance test.** Pull all four cited source passages. Every draft quotation either includes
  the qualifier or marks the cut with an ellipsis. No remaining quotation in the piece ends
  immediately before a de-escalating clause without a mark.

### P0-05 — An unsourced direct quotation about his father, plus an altered one beside it

- **Origin.** SUBJ-R4 (subject), CRITIC-C6 (critic).
- **Location.** §3, L218.
  > …he called them "frigging terrifying" buzz-cut lunatics, then went out of his way to say his
  > own dad "was a normal guy" he did not want to single out.
- **Adjudicated problem.** Two failures inside quotation marks, in the most sensitive paragraph on
  the page. (a) **"was a normal guy" could not be located in any retrieved source** — not the NPR
  web adaptation, not the full NPR page, not either Ferriss transcript. It may exist in the Fresh
  Air broadcast audio; as published it is an unsourced direct quotation attributed to a real man
  about his living father. (b) NPR prints "**freaking** terrifying"; the draft prints "**frigging**
  terrifying" — an alteration inside quotation marks. Neither changes the meaning, which is
  precisely why they are so cheap to fix and so damaging to leave: a piece whose entire method is
  "here is what he said in his own words" cannot afford loose quotation marks. Even when the
  invented wording is *protective* of the subject, a fabricated quote in the abuse paragraph is the
  fastest way to lose him.
- **Evidence and confidence.** Packet CLM-23 (rated "**partly unverified**"), dispute #3, research
  limitation #5; source S-06. Confidence **high** that "normal guy" is unverified; **unknown**
  whether it is false. Confidence **certain** on freaking/frigging.
- **Minimum repair.** Restore "freaking." Either source "was a normal guy" against the Fresh Air
  broadcast audio and cite it (see RQ-02), or drop the quotation marks: *…then went out of his way
  not to single out his own father.* Word-negative.
- **Reader benefit.** Eliminates a fabrication risk on the page's highest-stakes paragraph for the
  cost of five words.
- **At risk.** Nothing. The paraphrase preserves the protective gesture the sentence exists to
  record.
- **Acceptance test.** Grep every retrieved Burr transcript for "normal guy." Zero hits means it
  cannot run inside quotation marks. Every quoted string in §3 matches a retrievable source
  verbatim.

### P0-06 — Two wrong facts on *F Is for Family*, in the paragraph carrying the best beat in the piece

- **Origin.** FAN-R1 (fan), SUBJ-R7 (subject), UNFAMILIAR-R1 (unfamiliar), CRITIC-C7 (critic). Four
  perspectives; three filed it as a blocker.
- **Location.** §3 L236 ("Burr wrote that. **Six seasons** on Netflix…"); intro L151 and §3 L232
  ("*F Is for Family*, **which he created**").
- **Adjudicated problem.** The show ran **five** seasons (2015–2021, 44 episodes); Netflix's October
  2020 announcement renewed it "for a fifth and final season," which premiered 2021-11-25. And it
  was created by **Bill Burr and Michael Price** — "which he created" reads as sole creation, and
  contradicts the humility the same sentence reports ("insists is an amalgam of the writers'
  fathers"). Neither error is material to the thesis, which is why the critic declined to promote
  them; I am promoting them anyway because they are Wikipedia-level facts about the subject's own
  show, sitting one sentence from "The son's name is Bill" — the exact moment the article asks the
  reader to extend maximum credit to a psychological argument they cannot verify. Three reviewers
  independently reported the same reading effect: if the season count of his own show is wrong, the
  "nineteen years of tape" framing reads as posture.
- **Evidence and confidence.** Packet CLM-24 (rated **FALSE**) and CLM-26 (rated **imprecise**);
  sources S-01, S-15. Confidence **certain**.
- **Minimum repair.** "Five seasons on Netflix." "which he co-created." Word-neutral.
- **Reader benefit.** Removes the two cheapest possible reasons for a fan to stop believing the
  page.
- **At risk.** PROTECT-06 ("The son's name is Bill") is the next sentence. Fix the number; do not
  touch the beat.
- **Acceptance test.** The string "Six seasons" does not appear in the draft; neither instance of
  the credit claims sole creation.

### P0-07 — A totalizing psychological claim the draft itself contradicts one section later

- **Origin.** CRITIC-B4 (critic), SUBJ-I3 (subject).
- **Location.** §4, L256.
  > "He does not swing when he is threatened. He swings when the room turns on people he has decided
  > are his."
- **Adjudicated problem.** Three failures at once, and I confirmed all three in the frozen text.
  (1) **Unsupported:** no source establishes the negative half; it is a claim about a lifetime,
  derived from one incident. (2) **Contradicted by the draft**, 25 lines later at L281: "In
  Philadelphia the people he was covering stood next to him. Here they were the fifty comedians on
  the lineup **and, underneath that, himself.**" §5 says he swings when threatened; §4 says he does
  not. (3) **Contradicted by the source the draft prints in the same section**: Burr's own
  "I'm a defensive, fucking angry dude anyways, so it was just the perfect storm" (L248) is a
  dispositional cause the draft quotes and then declines to let count. The absolute is also *more
  generous to him than he is to himself*, which quietly removes the responsibility he assigned
  himself two paragraphs earlier.
- **Evidence and confidence.** Packet CLM-09: "The absolute framing ('does not swing when he is
  threatened') is not established by any source." Confidence **high** — the internal contradiction
  is checkable inside the draft without leaving the file.
- **Minimum repair.** Delete the negative half and convert to the supported claim: "He swings
  hardest when the room turns on people he has decided are his." Word-negative.
- **Reader benefit.** Removes an internal contradiction a careful reader will find, and stops the
  piece claiming more than its own best exhibit shows.
- **At risk.** PROTECT-07 (the "threw gas on a fire" self-grading) is what the current absolute
  quietly overrides. The repair protects it.
- **Acceptance test.** No sentence in the piece asserts what Burr never does. §4 and §5 can both be
  true simultaneously.

### P0-08 — §8 asserts Burr's contested premise in the article's own voice, against critics it never names

- **Origin.** CRITIC-B5 (critic), SUBJ-I5 (subject), UNFAMILIAR-C4 (unfamiliar, independently, from
  cold).
- **Location.** §8, L331 and L343.
  > "Half the internet called it misogyny. He did not apologize."
  >
  > "2020 and 2025 are not a conversion. They are one move run twice: **identify who is actually
  > dangerous**, tell the group it has the wrong target, take the incoming for saying so… **the
  > only variable that changed was whether the room agreed.**"
- **Adjudicated problem.** This is the one place the article does what it accuses the coverage of
  doing, and the asymmetry is visible from cold — the unfamiliar reader flagged it without
  knowing the critic lane existed. Riyadh, where Burr can be defended, gets a named critic quoted
  at length, an NGO citation, and an explicit refusal to settle the ethics. SNL 2020, where the
  criticism is harder to answer, gets an unnamed and unmeasured crowd, no critic, no argument
  stated, and then a rebuttal delivered in the article's own unattributed voice. "Identify who is
  **actually** dangerous" concedes Burr's premise as fact. "The only variable that changed was
  whether the room agreed" flattens a real disanalogy — an economic power class versus a
  demographic group inside a civil-rights movement — into audience taste. Separately, "half the
  internet" is both unsourced *and* overstated: contemporaneous coverage was genuinely split
  (Deadline "raises eyebrows"; Exclaim! and The Advocate ran divided verdicts), and overstating the
  backlash as mob noise makes it easier to dismiss than an argument would be.
- **Evidence and confidence.** Packet CLM-27: "'Half the internet called it misogyny' is an
  unmeasured summary — contemporaneous coverage was genuinely split"; sources S-08, S-09, S-37.
  Confidence **high** on the sourcing failure, the asymmetry, and the unattributed endorsement.
- **Minimum repair.** Three sentence-level changes, roughly word-neutral. (1) Replace "half the
  internet" with an accurate characterization of a split reaction, naming one outlet. (2) Attribute
  the continuity reading instead of asserting it — "the move he is running is…" rather than
  "identify who is actually dangerous." (3) Replace "the only variable that changed was whether the
  room agreed" with a formulation that concedes the two targets are not equivalent while keeping the
  behavioural pattern intact.
- **Reader benefit.** The page becomes consistent with the standard it sets three sections earlier,
  which is the standard that earns it the right to a sympathetic reading at all.
- **At risk.** The 2020↔2025 pairing itself, which the fan named as "a genuinely new connection"
  and the strongest thing in §8. **Keep the connection. Remove only the endorsement.** The critic's
  broader demand — that the continuity claim be dismantled — is rejected below.
- **Acceptance test.** §8 names at least one real critic or outlet, and every evaluative claim about
  who the real threat was is attributed to Burr rather than asserted by the article.

### P0-09 — MBTI types offered as rivals to an Enneagram type, and the "split" is manufactured

- **Origin.** ENN-R2 (enneagram), UNFAMILIAR-C2 (unfamiliar).
- **Location.** §1, L190.
  > "This typing has competition. The databases that own the search results for his name split three
  > ways: Boo and So Syncd say 6w7, SunSigns and personalitylist say ISTP, Personality Database
  > commenters argue ESTP."
- **Adjudicated problem.** Three defects in one sentence, in the diagnosis section of an Enneagram
  authority page. (1) **Category error.** ISTP and ESTP are MBTI types; they are not competing
  answers to "what is his Enneagram type?" (2) **The split is backwards.** Boo and So Syncd each
  carry *both* an MBTI type (ISTP) and an Enneagram type (6w7) — so the only two sources here that
  state an Enneagram type state the draft's own answer. As to Enneagram sources the record shows
  **agreement**, not contest. (3) **Two named sources are unverified.** SunSigns and personalitylist
  appear nowhere in the packet's source ledger, whose verification pass covered Boo (S-39), So
  Syncd (S-40) and a PDB comment (S-41). They are load-bearing attributions with no confirmed
  backing in this review chain. The unfamiliar reader independently reported this as the draft's
  densest comprehension stall — four-letter codes arriving as rival answers with nothing saying
  they belong to a different system.
- **Evidence and confidence.** Packet CLM-05, rated "**misleading as framed**." Confidence **high**
  on defects 1 and 2; **medium** on 3 (absence from the packet is not disproof, but an unverified
  citation cannot run).
- **Minimum repair.** Rewrite to the defensible and stronger claim: the databases that own this SERP
  agree on 6w7 where they say anything about the Enneagram at all, and none of them argues from
  evidence; the MBTI labels they also carry answer a different question. Then let Type 8 carry the
  "competition" load, which it already does honestly in the next clause. Drop SunSigns and
  personalitylist unless a verification pass confirms them. **Net word-negative** — this is one of
  the funding cuts.
- **Reader benefit.** Replaces a false contest with a better one: the competing databases agree with
  us and still cannot show their work. Removes a credibility break in front of the exact reader most
  likely to scrutinize the call.
- **At risk.** The draft's real point ("none of them argues from evidence") is verified and must
  become the paragraph's conclusion rather than its aside.
- **Acceptance test.** No sentence in the article presents an MBTI type as an alternative to an
  Enneagram type; every external typology source named in the body appears in the packet's source
  ledger; the first appearance of ISTP or ESTP is preceded by the words Myers-Briggs.

### P0-10 — The same Ferriss episode is dated two ways, and a derived duration is wrong

- **Origin.** CRITIC-C5 (critic), FAN-C8 (fan), UNFAMILIAR-C6 (unfamiliar), ENN-C5 (enneagram). Four
  perspectives.
- **Location.** Intro L149 and §1 L192 date Ferriss #602 as **2022**; §1 L182, §3 L222 and §6 L289
  date Ferriss material as **2017**. The derived claim at L192: "Someone operating from genuine
  invulnerability does not spend **sixteen years** wincing at it."
- **Adjudicated problem.** Ferriss #602 is an interview **recorded in 2017** for the *Fear{less}* TV
  show, transcript published 2022-06-25 — the episode page says so plainly. Either convention is
  defensible alone; using both in one article is not. And the inconsistency is not cosmetic: "sixteen
  years" counts 2006→2022. On the interview date the correct figure is **eleven**. That wrong number
  sits inside the sentence that rebuts the strongest rival typing (Type 8), and it sits in the
  structure the article most invites readers to check.
- **Evidence and confidence.** Packet CLM-03, rated "**inconsistent**," with the Ferriss page quoted
  directly; source S-02. Confidence **high**.
- **Minimum repair.** Pick the interview year in prose (2017) and apply it to every Ferriss
  reference, keeping the transcript year in the citation if useful. Recompute "sixteen years" to
  eleven, or replace it with a formulation the date cannot destabilize ("does not still wince at it
  a decade later"). Word-neutral.
- **Reader benefit.** The one structure the article asks readers to check survives being checked.
- **At risk.** PROTECT-02. Note that the §1 three-tellings span itself is **fine** under the
  corrected dating — Ferriss #265 (2017) → THR (2022) → *Drop Dead Years* (2025) is genuinely eight
  years in three formats. Do not weaken the structure to fix the dating; only #602's two references
  and the derived number need to move. (The separate question of whether the third telling carries a
  safety clause is RQ-03, not this item.)
- **Acceptance test.** Every reference to a given Ferriss episode carries the same year, and every
  duration computed from a Ferriss date is arithmetically derivable from dates printed in the draft.

### P0-11 — The corpus statistics are unstamped, and publishing this page falsifies one of them

- **Origin.** FUTURE-R2 (future), CRITIC-C3 (critic), ENN-C4 (enneagram), UNFAMILIAR-C7
  (unfamiliar). Four perspectives, from four different angles.
- **Location.** §1, L194; echoed in the Rabbit Hole L372.
  > "Three of the 32 comedians profiled on 9takes are Sixes, 9.4% against a 10.7% baseline across
  > all 420 profiles… The field is what's strange: Type 7 takes 43.8% of the comedian set against
  > 14.3% corpus-wide, **the widest gap in any category we track.** Nearly half that room got into
  > this chasing the high."
- **Adjudicated problem.** Every figure is **exactly right** — I re-verified against
  `src/lib/data/corpus-stats.json` (generated 2026-08-19T04:46:01Z): 420 published, comedy n=32,
  Type 6 = 3 (9.38%), Type 7 = 14 (43.75%), delta +29.46pp, the largest of all 63 domain×type
  deltas. Three problems sit on top of accurate numbers. (a) **The sentence is falsified by its own
  publication.** Burr publishes as a comedian Six, making it 4 of 33. "Three of the 32 comedians…
  are Sixes" is wrong on the page of the fourth. (b) **Unstamped on a moving corpus.**
  `pipeline.avg_new_per_month: 25`, so "all 420 profiles" is off by roughly 40% within a year, and
  the superlative currently leads by only 3.01pp (comedy Type 7 +29.46 vs authors-thinkers Type 5
  +26.45) on denominators of 32 and 23 — publishing Burr alone cuts that lead to ~1.7pp. (c) **The
  inference outruns the sample.** "The field is what's strange" and "that room" read as claims about
  comedians; they are claims about which 32 comedians this site has chosen to profile and typed
  itself. The packet's own ledger warns that S-42 "describes the 9takes corpus only — it is a fact
  about this site's editorial choices, **not about comedians**."
- **Evidence and confidence.** Packet CLM-06 (figures **verified exactly**) plus the S-42 scope
  warning; my own re-read of `corpus-stats.json` this session. Confidence **high** on all three.
- **Minimum repair.** One as-of stamp governing the passage — the draft already uses this
  construction correctly in the FAQ ("58 as of August 2026"). Scope the inference in the sentence
  that draws it ("of the comedians we have profiled"). Cut the Type 6 baseline comparison entirely:
  the paragraph itself concedes it is a null result ("so Sixes are not scarce here"), it is the
  sentence publication falsifies, and cutting it removes the newcomer's stated abandonment point.
  Either drop or stamp the superlative. **Net word-negative** — this is the largest funding cut
  available.
- **Reader benefit.** The one genuinely novel statistical move on the page stops being its most
  attackable sentence, and the numbers age into "accurate then" instead of "wrong now."
- **At risk.** The Type 7 contrast is a good argument and the *reason* the paragraph exists (it
  pre-empts "aren't comedians all Sevens?"). Keep it and keep "Burr came looking for cover." Cut
  the null result, not the finding.
- **Acceptance test.** Every corpus-derived figure in the reader-visible body sits inside the scope
  of an explicit as-of date; no inference from those figures is stated as a fact about comedians in
  general; regenerate `corpus-stats.json` after publishing Burr and confirm no sentence contradicts
  it.

## P1 — accepted high-value improvements

### P1-01 — Name him a counterphobic Six

- **Origin.** ENN-C1 (enneagram), called "highest-value single change" in that lane.
- **Location.** §1 diagnosis (L188–190) and Rabbit Hole L370, where the word currently appears once,
  describing a category rather than the man.
- **Adjudicated problem.** The article argues counterphobia for 4,500 words without claiming it.
  9takes' own Type 6 page names the counterphobic Six as one who "challenges authority publicly,"
  "becomes the whistleblower," "pushes back against bad ideas even when it's politically stupid" —
  and further notes that most Sixes are counterphobic in some domains and phobic in others. That is
  precisely the draft's own architecture: counterphobic in public (Philadelphia, SNL, Riyadh, the
  clap-back) and phobic in private (the avoided MRI, the friend who had to push him, the dry mouth,
  the half-point gauge). The article assembles both halves and never hands the reader the frame that
  unifies them.
- **Evidence and confidence.** `src/blog/enneagram/enneagram-type-6.md`, verified consistent by the
  Enneagram perspective against three further canon files. Confidence **high**.
- **Minimum repair.** One glossed sentence in §1 claiming the term, and one clause in the Rabbit Hole
  applying the by-domain split. Fund by cutting "and each runs the other way once you know what set
  it off" (L192), which the sections themselves demonstrate.
- **Reader benefit.** Resolves the page's central apparent paradox explicitly, gives the reader a
  portable concept, and adds an internal link to a pillar page.
- **Tradeoff at risk.** Directly in tension with P1-02 (the newcomer's jargon load). Resolved in
  *Conflicts*: introduce **one** new term, immediately glossed in plain English, and move two
  existing unglossed terms out of the lead sentence. Net jargon in §1 goes down, not up.
- **Acceptance test.** A reader who finishes the article can say "counterphobic Six" and explain that
  Burr is counterphobic in public and phobic in private, citing one example of each — without opening
  the Rabbit Hole.

### P1-02 — Take the Enneagram vocabulary and every Enneagram link out from behind the "skip this" door

- **Origin.** UNFAMILIAR-C1 (unfamiliar), rated its highest-priority concern.
- **Location.** §1 first sentence (L176) against the Rabbit Hole preamble (L352): "For the Enneagram
  nerds. Skip if you're not deep into the system."
- **Adjudicated problem.** I verified this in the frozen file: **all three** Enneagram links —
  `/enneagram-corner/enneagram-wings-complete-guide`,
  `/enneagram-corner/enneagram-instinctual-subtypes`, `/enneagram-corner/enneagram-type-6` — sit
  inside a collapsed block that opens by telling the reader not to read it. The only links in the
  open body are two personality-analysis cross-links. Meanwhile the sentence a search visitor lands
  on carries three unglossed terms ("Type 6, self-preservation dominant, with a 7 wing"), exactly one
  of which gets a gloss, arriving second. A newcomer who finishes the article curious about the
  system has no exit anywhere in the open body. That is both a comprehension failure and an
  internal-linking failure on a page whose job is to route readers into the Enneagram corner.
- **Evidence and confidence.** Unaided newcomer read, confirmed by my own grep of the frozen draft.
  Confidence **high**.
- **Minimum repair.** (a) Link "Enneagram Type 6" on first use in §1 to the Type 6 primer — markup
  only, word-neutral. (b) Move "self-preservation dominant, with a 7 wing" out of the lead sentence
  into the Rabbit Hole, where both terms are already explained. Word-negative in the body.
- **Reader benefit.** The page's most-read sentence stops opening on undefined terms, and the curious
  newcomer gets a route into the system instead of none.
- **Tradeoff at risk.** See P1-01. Also note §8 already contains the best one-line definition on the
  page — "Type 6 is the type that organizes itself around who can be trusted with power" — arriving
  3,000 words after it would have done the most good; the editor may promote it, but that is P2-04
  territory, not required here.
- **Acceptance test.** A reader who never opens the Rabbit Hole meets no Enneagram term the open body
  fails to gloss or link, and §1's first sentence contains at most one unglossed term.

### P1-03 — Fix the six constructions that go wrong inside twelve months

- **Origin.** FUTURE-R3, FUTURE-R4, FUTURE-R5, FUTURE-R7 (future).
- **Location and repair.** All word-neutral or shorter:

  | Location | Current | Repair |
  | --- | --- | --- |
  | L151 | "Bill Burr is 58 now" | "turned 58 in 2026" (he is 59 on 2027-06-10) |
  | L153 | "For nineteen years, more than a thousand episodes deep" | "Since 2007, more than a thousand episodes deep" |
  | L356 | "for nineteen years" | fixed endpoint |
  | L297 | "That was 2017, and nine years on the machinery still runs" | "That was 2017, and the machinery still runs" |
  | L383 heading + L86 FAQ | "The part Bill Burr plays in October" / "What is Bill Burr in **next**?" | year the heading; change the FAQ to a durable question ("What movie is Bill Burr in?") |
  | L86 FAQ | "touring through 2026" | "as of August 2026" or "continues to tour" |

- **Adjudicated problem.** Every one of these is correct today and wrong inside the twelve-month
  window. The heading is the worst of them: it renders in the TOC, in the FAQ anchor and potentially
  in SERP snippets stripped of context, pointing at an October with no year attached, and the FAQ
  answers "what is he in next" with a film that will be ten months in the past.
- **Evidence and confidence.** Birth date 1968-06-10; MMP launched 2007-05; Ferriss #265 published
  2017-09-17 — all from the packet timeline. Confidence **high**.
- **Reader benefit.** The page reads as accurate rather than stale in August 2027, and the refresh
  list shrinks from nine items to three.
- **Tradeoff at risk.** None. The draft already uses the fixed-endpoint technique well in "three
  times over eight years"; this just applies it consistently.
- **Acceptance test.** Read the page as if it were 2027-08-19. No reader-visible sentence states his
  age incorrectly, describes a past event as forthcoming, or contains a duration computed against the
  publication year rather than between two stated dates.

### P1-04 — Stop mis-describing the primary source the whole page rests on

- **Origin.** FAN-C3 (fan), ENN-C8 (enneagram), SUBJ-I7 (subject).
- **Location.** Rabbit Hole L356 ("**ninety minutes** of associative riffing"); intro L151 ("The
  Monday Morning Podcast **almost every week** since May 2007").
- **Adjudicated problem.** The two episodes the draft itself cites run **67** and **56** minutes;
  Wikipedia describes MMP as a one-hour show. Ninety minutes overstates by 30–60%, and it is doing
  theory work — it is the evidence for the 7-wing "no destination" read, so an inflated figure
  weakens a type claim for no gain. Separately the show is now released **twice weekly** (1,364
  episodes as of August 2026), so "almost every week" undersells it. For the reader most likely to
  notice — the weekly listener the page is written for — both are outsider tells on the exact claim
  the article's authority rests on.
- **Evidence and confidence.** Packet CLM-35 (rated **overstated**) and CLM-36 (rated "verified, and
  understated"); sources S-01, S-07, S-36. Confidence **high**.
- **Minimum repair.** "ninety minutes" → "an hour." "almost every week" → "twice a week now, every
  week since 2007" (pairs with the P1-03 fix on the same line). Word-negative.
- **Reader benefit.** Removes two outsider tells from the source that is the page's whole competitive
  advantage.
- **Tradeoff at risk.** None. Frees words for P0-03.
- **Acceptance test.** No stated MMP runtime exceeds the runtime of the episodes cited; the cadence
  claim matches the current schedule.

### P1-05 — Give "his people" a face: name Patrice O'Neal

- **Origin.** FAN-C1 (fan), rated the loudest silence in the piece.
- **Location.** §4 L244 (the wings list) and §4 L256 ("people he has decided are his"); Rabbit Hole
  L360 (the loyalty-structures sentence).
- **Adjudicated problem.** The article's thesis is that Burr's aggression is protection of chosen
  people, and it never names one. O'Neal was on the September 9, 2006 Traveling Virus bill at the
  Tweeter Center alongside Burr, Irrera, Norton, Vos and Morgan; the packet's own Vice source (S-12)
  lists him and the draft does not use it. Burr calls him "one of the great friends that I've had in
  life," and has co-produced an annual benefit for O'Neal's family for roughly a decade. For a page
  arguing that he swings when the room turns on his people, leaving out the man he has most visibly
  chosen is leaving the best exhibit in the evidence room. Note this also feeds ENN-C2's observation
  that the draft's spine is alliance-shaped.
- **Evidence and confidence.** Confidence **high** on the facts (Wikipedia Traveling Virus lineup;
  Boston Globe 2021; packet S-12); **medium** on placement being the best use of the words.
- **Minimum repair.** Two clauses inside existing sentences: name Patrice in the wings list in §4, and
  append the benefit to the Rabbit Hole loyalty sentence. ~12 words.
- **Reader benefit.** Converts the piece's weakest abstraction into its most concrete proof, and
  closes the gap most likely to make a fan say "this writer doesn't actually know him."
- **Tradeoff at risk.** Zero headroom; this is the P1 with the largest word cost. Fund from P0-11.
  Do **not** expand it into a paragraph — the fan asked for a name, not a section.
- **Acceptance test.** "Patrice" appears in §4 and the benefit appears once in the article; a reader
  of §4 can name at least one specific person Burr was defending.

### P1-06 — Make the §4 pull-quote claim a motive, not an outcome

- **Origin.** CRITIC-C4 (critic).
- **Location.** §4 L254 pull-quote: *"The most feared act of aggression in his career was a rescue."*
- **Adjudicated problem.** The section's most quotable line is its least defensible sentence. He did
  not extract anyone — the comics who had been booed were already off. He attacked a city and 10,000
  individuals, most of whom did nothing personally. His own account gives a dispositional cause
  alongside the protective one, and he grades the result as making things worse. "Rescue" is
  supported as *motive* and not as *act*. The draft's own prose two lines earlier already says
  "started as a defense of somebody else" — the pull-quote just needs to match the sentence it came
  from.
- **Evidence and confidence.** Packet CLM-09; source S-31. Confidence **high**.
- **Minimum repair.** Adjust to a motive claim ("started as a rescue" or equivalent). Word-neutral.
- **Reader benefit.** The most-shared line in the section becomes the most defensible one.
- **Tradeoff at risk.** PROTECT-07 sits three paragraphs later; this repair makes the two consistent
  instead of adjacent-and-contradictory. Pairs with P0-07.
- **Acceptance test.** The pull-quote claims a motive, not an outcome, and is consistent with the
  "threw gas on a fire" quote three paragraphs later.

### P1-07 — Three comprehension tags a newcomer needs and the piece can afford

- **Origin.** UNFAMILIAR-C3 and the unfamiliar reader's "What I expected" (unfamiliar).
- **Location.** §4 heading L240 vs first body sentence L244; L244 "Dom Irrera was one of them"; §5
  L262 "David Cross named Burr, Chappelle and Louis C.K. directly."
- **Adjudicated problem.** A section titled "Bill Burr's Philadelphia rant" opens in New Jersey, and
  "across the river" is the only bridge — it assumes the reader knows Camden and Philadelphia are one
  metro market. Two sentences later he is attacking "the city, its food, its teams, its heroes" and a
  reader outside the US Northeast cannot tell which city or why the crowd took it personally. That
  reader is lost for the remainder of the section the article itself calls the most famous twelve
  minutes of his career. Separately, two of the piece's three evidentiary names arrive unglossed:
  the force of "Cross has a real point and it deserves to stay on the table" depends partly on who
  Cross is, and the newcomer reported not knowing.
- **Evidence and confidence.** Unaided newcomer read; the venue facts themselves are correct (packet
  CLM-07 verifies date, venue, crowd size and the twelve-minute length), so this is a framing gap,
  not an error. Confidence **high**.
- **Minimum repair.** Identify the audience as well as the venue ("a Philadelphia crowd"); add
  two-word role tags to Irrera and Cross ("the comedian Dom Irrera," "the comedian David Cross").
  ~6 words, all inside existing sentence structure.
- **Reader benefit.** The article's central scene becomes legible to exactly the reader the section
  exists to serve, and its named-critic move lands with full force.
- **Tradeoff at risk.** None. Do not add a paragraph of geography — the reviewer asked for a clause.
- **Acceptance test.** A reader who does not know US regional geography can state, from the text
  alone, whose city was attacked and why the crowd took it personally.

### P1-08 — Archive the two YouTube sources carrying the page's best material

- **Origin.** FUTURE-R6 (future).
- **Location.** `citations` frontmatter: `https://www.youtube.com/watch?v=8NYGbY4Tmkc` and
  `https://www.youtube.com/watch?v=yHKqkVqa9mc`.
- **Adjudicated problem.** The Riyadh dry-mouth exhibit and the Rousey half-point catch — the two
  claims no competing page has — rest entirely on two uploads to a channel the subject controls, with
  no archival snapshot and no secondary reporting recorded for either utterance. If either is pruned
  or made private, the best material in the article becomes unverifiable exactly when a skeptical
  reader goes looking.
- **Evidence and confidence.** Packet source ledger S-07. Confidence **moderate** on the risk
  (back-catalogue removal is uncommon); **high** that the downside is concentrated on precisely the
  material the draft is proudest of.
- **Minimum repair.** Archive both URLs (Wayback / archive.today) and add the snapshot links
  alongside the existing citations. **Zero body words.**
- **Reader benefit.** The page's two most valuable claims stay checkable independent of the subject's
  own channel hygiene.
- **Tradeoff at risk.** None. This is the cheapest item on the list.
- **Acceptance test.** Every citation supporting a direct quote resolves to at least one source not
  controlled by the subject, or to an archival snapshot.

### P1-09 — Replace an unmeasurable superlative about Nia Renée Hill with the context that does work

- **Origin.** FAN-C5 (fan).
- **Location.** §7 L313: *"She is the subject of more of his stand-up than anyone alive."*
- **Adjudicated problem.** The claim is unmeasurable and reads as filler in a paragraph that is
  otherwise doing real work. Meanwhile the actual canonical fact about the marriage — that it is
  interracial, that Burr has built over a decade of material on it and on how people react to it —
  never appears, and it is the context every fan brings to the SNL fight in the very next section.
  The paragraph's own closing line ("a man whose operating system is the question of who stays when
  it goes wrong") is currently earned by assertion; the specific fact would earn it.
- **Evidence and confidence.** Confidence **high** that the superlative is unsupportable; **medium**
  on how much space the context deserves.
- **Minimum repair.** Swap the superlative for the specific: she has been a subject of his act for
  over a decade, including the material about how people react to the marriage. Word-neutral.
- **Reader benefit.** Trades an unfalsifiable claim for canon that pre-loads §8 — which, after P0-08,
  needs the setup.
- **Tradeoff at risk.** The second-pass notes record that Hill was deliberately given her own voice
  rather than functioning only as testimony; this repair extends that work rather than undoing it.
- **Acceptance test.** No unmeasurable "more than anyone alive"-class claim remains, and a reader
  reaching the SNL monologue has been given the marriage context first.

### P1-10 — Stop claiming privileged access to his self-knowledge in the Rousey passage

- **Origin.** SUBJ-I4 and SUBJ-M3 (subject).
- **Location.** §6 L299–301: *"The tell comes later in that same episode, **and he does not know he
  has it**… because somewhere in there a gauge is always running and he can read it to a
  half-point."*
- **Adjudicated problem.** Two things. "He does not know he has it" asserts a fact about his
  self-knowledge that nobody can hold — one section after the page's entire case rests on how
  accurately he narrates himself. And comic over-specificity is a craft technique before it is a
  symptom: "six and a half" is funny *because* the precision is absurd. A comedy writer can currently
  answer the sharpest catch in the article with "that's just how you write a specific joke," and the
  article has no reply.
- **Evidence and confidence.** Burr's verified statement that the misconception about him is people
  who "watch my act and take it literally" (THR 2022) gives this real weight. Confidence **high**.
- **Minimum repair.** Drop "and he does not know he has it." Concede the craft reading in a clause and
  keep the observation: the precision is a joke, and the joke required a scale to be sitting there
  already. Roughly word-neutral.
- **Reader benefit.** Acknowledging the obvious rebuttal is what makes the catch hold instead of look
  credulous.
- **Tradeoff at risk.** PROTECT-05. This is a repair *to protect* the piece's best original
  observation — three perspectives named it a hit. Do not trim the "Nobody asked. There was no scale
  in play" beat, which is what converts the quote into an argument.
- **Acceptance test.** A comedy writer reading the paragraph cannot answer it with "that's just how
  you write a specific joke."

### P1-11 — Say what the 2020 monologue argued before quoting its most inflammatory sentence

- **Origin.** UNFAMILIAR-C4 (unfamiliar).
- **Location.** §8 L329, immediately before the "Gucci-booted feet" quotation.
- **Adjudicated problem.** "The fence of oppression" and "the front of the line" presuppose the 2020
  racial-justice moment, which the article never names. "The woke movement" arrives in the following
  sentence and does not supply the missing referent. The newcomer reported this as the only paragraph
  they finished genuinely unsure what had been said — in the section that then asks them to accept it
  as one half of a two-part pattern.
- **Evidence and confidence.** Unaided newcomer read. Confidence **high** on the comprehension gap.
- **Minimum repair.** One clause before the quotation establishing what the monologue argued and whom
  it said the audience was wrongly fighting. ~10 words.
- **Reader benefit.** The quotation becomes parseable by a reader with no memory of October 2020.
- **Tradeoff at risk.** The editor is already inside these three sentences for P0-08 — **do both in
  one pass.** Take care that the added clause describes Burr's argument without endorsing it, which
  is the exact failure P0-08 exists to fix.
- **Acceptance test.** A reader with no memory of 2020 can state what the monologue argued before
  reaching the quotation.

## P2 — optional opportunities

- **P2-01 — Retitle §6.** (UNFAMILIAR-C5) "The helicopter Bill Burr learned to fly out of Los
  Angeles" promises a helicopter and delivers the helicopter, the money philosophy, the MRI, the
  Rousey scale, the *Mandalorian* casting, Broadway, Bertolina and the 2011 "I made it" line. On a
  scan path the heading gives no reason to enter the section holding the article's best evidence.
  Retitle to the organizing idea the section's own bridge already states — the reflex running with no
  target in the room. Word-neutral. **This is the highest-value P2 and the one the Revision brief
  authorises.**
- **P2-02 — Add HRW's October follow-up and Burr's substantive defence.** (CRITIC-C1, SUBJ-R2b,
  SUBJ-Q2) HRW's 2025-10-08 follow-up — that the participating comedians said nothing about detained
  activists — is the sharpest form of the case the draft says "deserves to stay on the table," and it
  is absent. So is Burr's own argument, "they're not gonna progress with isolation." Adding both makes
  the section's claim to leaving the ethics on the table true in *both* directions and makes the
  timing point stronger, not weaker: the defence arrived *alongside* the clap-back rather than instead
  of it. ~25 words; the section is already the longest on the page.
- **P2-03 — Place Gina Carano between SNL and the billionaires.** (CRITIC-C2) March 2021, in the same
  THR interview the draft mines for its central quote, Burr defended Carano and said "the liberals
  proved her point. They just use outrage because they don't like your politics." It is the
  most-covered political episode between the draft's two poles, it gives the continuity claim a third
  data point, and it complicates it honestly. Note the evidence packet also omits it. One sentence.
- **P2-04 — Move the object of the fear from harm to support.** (ENN-C9) "Type 6 runs on the
  management of fear" is true and under-specified: fear of being hurt does not pick a type out of
  nine. The Six's fear is of facing it with nobody at your back — which is why the draft's own best
  evidence (the club where he "fit in," the wife who is publicly on his side, All Things Comedy, the
  friend who pushed him into the MRI, the fifty comedians) is alliance-shaped while the framing is
  harm-shaped. One clause, word-neutral, and it turns ENN-C2's loose end into an asset.
- **P2-05 — Re-point TL;DR bullet 1 at the strategy, not the injury.** (ENN-C6) Being disarmed by
  bigger kids is not evidence of a type; every type has a driveway. The body is careful about this and
  argues from what he *built*. The skim block is not. Same length.
- **P2-06 — Name one earlier special that argues.** (FAN-C2) A stand-up profile that names one special
  and quotes zero jokes reads as psychology done on interview transcripts. *I'm Sorry You Feel That
  Way* (2014) is a title that is itself a non-apology — the draft's own "never concede an inch" thesis
  sitting there pre-written. One sentence that does argumentative work, not a credit-list entry.
- **P2-07 — Move the stress-arrow specimen to the twelve years.** (ENN-C7) One combative talk-show
  appearance is thin proof of disintegration to Three. §3 already contains the textbook sustained
  specimen — "I really started snapping about nothing for a good 12 years," alongside the appeasement
  strategy collapsing. Reference it (no re-quoting needed) and demote the Fonda to illustration.
  Word-neutral.

## Research required before deciding

### RQ-01 — What does Burr's character actually do in *The Social Reckoning*?

- **Unresolved question.** Is Charlie a mental-health counsellor or a crisis-communications handler?
- **Why it matters.** It decides whether P0-01's repair is a hedge or a rebuild. If Charlie is a
  comms adviser, the current closer is not merely unsupported but the wrong picture — and the adviser
  reading is arguably *more* on-thesis (telling a person they have misjudged how they are landing is
  the move the draft traces through Philadelphia, SNL and §8).
- **Source needed.** Sony/Columbia press kit or official character list; failing that, the film on
  2026-10-09. The Deadline and Rolling Stone trailer pieces are tollbit-blocked — try Yahoo/AOL
  syndication per the known workaround.
- **Decision rule.** **Do not block publication on this.** P0-01's minimum repair is safe under both
  readings. Carry RQ-01 onto the refresh list with a 2026-10-16 checkpoint.

### RQ-02 — Does "was a normal guy" exist in the *Fresh Air* broadcast audio?

- **Unresolved question.** The phrase appears in no retrieved text source (NPR web adaptation, NPR
  full page, both Ferriss transcripts).
- **Why it matters.** It is a direct quotation about a named living private individual in the abuse
  paragraph. If it exists, cite it and the sentence stands as written. If not, the quotation marks
  come off today.
- **Source needed.** WHYY/NPR *Fresh Air* broadcast audio, 2025-03-10.
- **Decision rule.** Resolvable cheaply and worth one attempt. If unresolved within one pass, execute
  P0-05's paraphrase — the protective gesture survives without the quotation marks.

### RQ-03 — Is the third telling verified, and does it carry a safety clause?

- **Unresolved question.** The *Drop Dead Years* soliloquy is second-hand (traced to reviews, not the
  special), and as quoted it contains **no safety clause** — "make everybody like me," standing alone,
  is equally at home in Two, Three or Nine. So "Three tellings. One motive. Safety." is currently
  carried by two of three exhibits.
- **Why it matters.** This is the page's headline evidence structure and PROTECT-02.
- **Source needed.** The special itself on Hulu, for the soliloquy's exact wording. Reviews carry a
  stronger, more type-discriminating line from the same soliloquy — "where's the place I have the
  least chance of being hurt?" — which would fix the leg outright if it verifies.
- **Decision rule.** Highest-value research item on this list. If the special can be checked, do it
  and use the stronger line. If not, either mark the *Drop Dead Years* line as reported by reviewers
  rather than quoted from the special, or substitute the verbatim-verified Ferriss #265 line ("I'm
  going to get on stage, show people that I'm a funny guy, and people will stop fucking with me") and
  restate the span honestly. **Do not dismantle the structure to fix the leg.**

### RQ-04 — Is fear-narration a standing MMP register rather than a Riyadh-specific disclosure?

- **Unresolved question.** Does Burr routinely narrate nerves about gigs he considers triumphs?
- **Why it matters.** It decides whether the two-date contrast is an *audience* artifact (the draft's
  claim) or a *topic* artifact (Conan asked about the controversy; the podcast recounted the
  performance). If it is a house register, §5 needs reframing rather than trimming, and the Rabbit
  Hole's falsification clause has partly fired.
- **Source needed.** Three or four more MMP episodes recounting big international gigs. A grep of the
  auto-transcripts for "nervous," "dry mouth," "scared" would settle it cheaply — exactly the kind of
  check the corpus tooling makes nearly free, and the cheapest high-leverage research on this list.
- **Decision rule.** P0-02's repair is safe either way (it narrows the claim to *register*, not
  *audience*). If the grep shows the pattern is routine, upgrade: say so in the Rabbit Hole and let
  the falsification clause do its work in public, which would be the single most credible move
  available to this page.

### RQ-05 — Does the Frank Murphy blockquote match the episode verbatim?

- **Unresolved question.** Only one clause is corroborated, on a fan wiki; the first three sentences
  and the ordering are unverified, yet it is set as exact script dialogue.
- **Why it matters.** It is the foundation of PROTECT-06 ("The son's name is Bill"), which two
  perspectives named the best beat in the piece. Lower stakes than a real-person quote — it is fiction
  he co-wrote — but the beat deserves a hard foundation.
- **Source needed.** Netflix closed captions, S1 "Bill Murphy's Day Off."
- **Decision rule.** Verify, or quote only the corroborated clause and paraphrase the rest. Cheap and
  worth doing before publish.

### RQ-06 — Is the David Cross quotation a composite?

- **Unresolved question.** "with unarguable talent" and "Clearly you guys don't give a shit about what
  the rest of us think" were not independently confirmed, and the clauses may not be adjacent in the
  original Instagram post.
- **Why it matters.** A named critic's charge against a named subject cannot be a stitched composite —
  and this quotation is load-bearing for PROTECT-01, the article's honesty anchor.
- **Source needed.** The original Instagram post; failing that, Variety and myTalk, which confirm
  "what, a fourth house? A boat? More sneakers?" and "how can any of us take any of you seriously ever
  again?"
- **Decision rule.** If the post cannot be retrieved, retain only the confirmed clauses or attribute as
  reported rather than quoted. Protects both men, costs nothing.

## Conflicts and editorial tradeoffs

**1. Zero word headroom against a P0 list that adds words.** The body is at ~4,510 against a
lint-gated 4,500 (`scripts/blog-lint.sh:354`), and the cohesion pass recorded "zero headroom
remains." Word-adding P0s: P0-02 (~+6), P0-03 (~+20), P0-04 (~+30), P0-08 (~net 0), plus P1-05
(~+12) and P1-11 (~+10). **Named funding cuts, in order:** P0-11's Type 6 baseline sentence (~25
words, and it is the sentence publication falsifies); P0-09's rewrite (~15 words net); P0-07's
deleted half-sentence (~8); "and each runs the other way once you know what set it off" at L192
(~13, per ENN-C1); "so this is no confession and no retraction" at L279 (~9, per ENN-R1); P1-04
(~3); P0-11's superlative if dropped (~9). That is roughly 80 words freed against roughly 80 added.
**The ceiling is satisfiable without touching a protected hit — but only if the editor takes the
cuts before making the additions.**

**2. Enneagram vocabulary vs. newcomer legibility (P1-01 vs P1-02).** The domain expert wants
"counterphobic Six" claimed; the newcomer wants fewer unglossed terms in the sentence a search
visitor lands on. **Resolution:** introduce exactly one new term, glossed in plain English at first
use, and move "self-preservation dominant, with a 7 wing" out of the lead sentence into the Rabbit
Hole where both are already explained. Net jargon in §1 goes *down* by one term while the article
gains the concept that resolves its central paradox. I am **rejecting** the Enneagram reviewer's
three other vocabulary asks (centers, projection, the Reactive harmonic group) on exactly this
ground — the reviewer explicitly said they were not asking for all four.

**3. Preserve the Riyadh table vs. narrow its claim.** Four perspectives attacked §5's framing and
three of the four volunteered, unprompted, that the table itself must survive. There is no real
conflict here, but it is the most likely place for an editor under word pressure to over-correct.
**Resolution:** the *form* is protected (PROTECT-03); the *interpretive overclaim* is P0-02. Adding
six words of triumph framing and swapping one clause about register is the entire repair.

**4. How to repair the closer: hedge (critic) or rebuild on the handler reading (future).** The
future reviewer argues the adviser reading is stronger on-thesis and would rebuild around it; the
critic, subject and unfamiliar readers prefer attribution plus removal of the staging.
**Resolution: hedge now, rebuild after RQ-01.** The handler reading is not verified either —
Wikipedia gives no occupation at all — so rebuilding on it swaps one unsupported reading for
another. The safe repair is available today and needs no research.

**5. How much comic register to concede.** The subject reviewer found four places where the draft
reads a bit as a symptom (helicopter, Rousey, driveway, "gauge is always running"). Conceding in all
four would gut the method, which is legitimately built on reading sincere interview statements as
data. **Resolution: concede once, where it is strongest** — the Rousey passage (P1-10) — mark the
helicopter elision and let the 2015 Philadelphia Inquirer corroboration carry that reading sincerely
(inside P0-04). Reject the page-wide hedge.

**6. Complicate the 2020↔2025 continuity claim (critic) vs. preserve it (fan).** The critic calls it
the thinnest argument in the piece; the fan calls it a genuinely new connection that explains
something about his audience the "conversion" takes never do. **Resolution:** both are right about
different things. The *pattern* claim is good and stays. The article's *endorsement* of Burr's
premise ("who is actually dangerous") and its assertion that the only difference was audience
agreement are the defects, and P0-08 removes exactly those. I am rejecting the critic's implied
larger remedy — dismantling the continuity reading — as out of proportion to the finding.

**7. "Three tellings" under two simultaneous pressures.** ENN-C3 says the third leg has no safety
clause; CRITIC-C5 says it is second-hand; P0-10 fixes the dating that makes the span checkable. Three
findings, one structure, and that structure is PROTECT-02. **Resolution:** P0-10 (dating) is
mandatory and does not touch the structure. The leg question is RQ-03 and must be resolved *before*
anyone rewrites the paragraph. Sequencing matters here — do not weaken the span in the same pass that
fixes the dates.

**Additional sourcing consulted: none.** Rule 10 permits up to three sources to adjudicate a concrete
conflict. Every conflict above resolved on the frozen draft, the evidence packet, or
`src/lib/data/corpus-stats.json` (which I re-read this session: comedy n=32, Type 6 = 3, Type 7 = 14
at +29.46pp, 420 published, generated 2026-08-19T04:46:01Z — all draft figures confirmed exact). The
three genuinely open questions (RQ-01, RQ-02, RQ-03) are not resolvable by additional web sourcing in
this pass — they need an unreleased film, broadcast audio, and a Hulu special respectively — so
improvising a repair from search snippets would violate rule 9.

## Rejected feedback

- **CRITIC: dismantle the 2020↔2025 continuity reading.** *Rejected as framed; the narrow defect is
  accepted as P0-08.* The pattern claim is the strongest original argument in §8 and the fan named it
  as such independently. Removing the article's unattributed endorsement fixes the trust problem
  without discarding the insight.
- **CRITIC: hedge the self-report method page-wide** ("nobody is grading him is an assertion about the
  medium"). *Accepted narrowly inside P0-02; rejected as a general hedge.* The Rabbit Hole already
  publishes a falsification criterion, which is the honest instrument here. RQ-04 is the way to settle
  it empirically rather than by adding qualifiers.
- **FAN: the act is missing — quote jokes, discuss the specials.** *Rejected at this scope; the narrow
  version is P2-06.* At zero headroom, a joke-quoting pass would cost 150+ words and displace verified
  evidence. Naming one special whose title argues the thesis is the version that pays for itself.
- **FAN: add *Old Dads* (2023).** *Deferred.* A real credit gap and on-theme, but the fatherhood thread
  is already carried by the therapy section and "that stuff dies with me." The fan ranked it lowest of
  eight and said to drop it first if the ceiling forbids. It does.
- **FAN: name Migs Mayfeld in the *Mandalorian* beat.** *Deferred.* Fan-recognition value is real but
  the beat's argumentative work (mocking Star Wars fans became the ticket in) does not need the
  character name.
- **UNFAMILIAR: add a plain marker of scale** (how big is he?). *Deferred.* The reviewer also wrote
  that a filmography dump, family tree, net worth and awards inventory are "correctly absent" and that
  the restraint is right. This piece is an argument, not a biography; adding stature inventory at the
  ceiling would trade verified evidence for résumé.
- **UNFAMILIAR-C9: the `inner-thought` callout may read as a quotation.** *Deferred to a rendering
  check, not a copy change.* The reviewer's own minimum repair is "none needed if `inner-thought`
  renders unmistakably differently from `blockquote`." That is a CSS question, not an editorial one.
  Verify on mobile and desktop; only add framing words if it fails.
- **ENNEAGRAM: name the centers, projection, and the Reactive harmonic group.** *Rejected.* Three more
  system terms would fight P1-02 directly, and the reviewer said explicitly they were not asking for
  all four. Counterphobic is accepted (P1-01) because it resolves the article's central paradox rather
  than decorating it.
- **ENN-C2: hedge the self-preservation subtype call.** *Deferred.* The observation is sharp — the
  draft's spine is protective and communal, which is evidence for the instincts it does not name
  dominant — but subtype is the least determinate layer of the system, the paragraph is in the Rabbit
  Hole where a nerd reader expects contestable calls, and the fix competes for words with P0 repairs.
  Drop "unusually concrete" if a free word appears.
- **SUBJECT: acknowledge page-wide that he is a professional joke-writer.** *Accepted once (P1-10);
  rejected as a standing hedge.* See Conflict 5.
- **SUBJECT-I1: add Burr's own "biggest misconception" quote near the top.** *Deferred, reluctantly.*
  It is a genuinely excellent idea — it would convert the article's premise from the writer's
  contrarian claim into the subject's own stated grievance, and it appears on no competing page. But
  it costs ~25 words at a ceiling where the P0 list already needs ~80, and P0-03 (which restores the
  *next* sentence of the same THR answer) is the higher-priority use of that interview. Revisit at the
  first refresh when the ceiling loosens.
- **FUTURE-R7 (Bertcast date).** *Deferred to the refresh list.* The packet bounds the episode at
  ≤2017-11-30 and instructs "attribute to the show, not a year," which the draft already does
  correctly. The second-pass notes flagged it as knowingly open. Nothing to repair; pin it if the
  episode is ever indexed.

## Protected hits

- **PROTECT-01 — The refusal to exonerate.** §5 L264 ("Cross has a real point and it deserves to stay
  on the table…") and L283 ("That is the reflex. It does not settle whether Cross is right about the
  money."). Named by critic, future and subject as the sentences the article's honesty lives in. Must
  survive **verbatim**. If the editor trims §5 for words, these two sentences are load-bearing, not
  decoration.
- **PROTECT-02 — The three-tellings evidence structure.** §1 L178–186. Named by all six perspectives.
  It is falsifiable, it is his own words, and no competitor on the SERP has anything like it. P0-10
  and RQ-03 touch its dates and its third leg; neither may dissolve the structure.
- **PROTECT-03 — The Riyadh two-date table, as a form.** §5 L268–277. The page's competitive
  advantage and, per the future reviewer, its most durable structure — the argument is carried by the
  *interval between two fixed dates*, a quantity that never changes. P0-02 narrows the claim above and
  below it. **Do not delete the table.**
- **PROTECT-04 — "The counterattack arrives before the verdict does."** §5 L281. The empathy turn, and
  the one interpretive line that explains the behaviour without excusing it or pathologising it.
- **PROTECT-05 — The Rousey half-point catch.** §6 L299–301, including the "Nobody asked. There was no
  scale in play" beat, which is what converts a quote into an argument. Three perspectives named it
  the sharpest single catch in the draft. P1-10 exists to protect it, not to trim it.
- **PROTECT-06 — "The son's name is Bill."** §3 L232–236. Complete payoff with no prerequisites —
  the newcomer needed no background, no Enneagram, and had not seen the show. P0-06 fixes a number in
  the same sentence; the beat and its final line stay untouched.
- **PROTECT-07 — Burr grading his own most famous win as a failure.** §4 L252 ("I wasn't a
  professional… I threw gas on a fire that was already going"). The article arguing against itself in
  public, and it buys real credit. P0-07 and P1-06 make the surrounding claims consistent with it.
- **PROTECT-08 — The Rabbit Hole's falsifiability clause and admitted residue.** L374 ("What would
  change our mind") and L376 ("What Type 6 does not fully explain"). Naming in advance what would
  defeat the thesis, and conceding that the type does not explain the subject's most famous twelve
  minutes, is the discipline typology writing almost never practises. Preserve both sections; RQ-04
  may strengthen the first.
- **PROTECT-09 — "He did not describe wanting the room. He described wanting the room to stand down."**
  §1 L188. The whole argument in two sentences, making no claim about his interior he has not made
  himself.
- **PROTECT-10 — "He does not present it as an accusation. He presents it as inheritance."** §3 L220.
  The sentence that keeps the childhood section fair to a named living parent. It sits inside the
  paragraph P0-04 edits — **verify it is intact after that repair.**

## Revision brief

Ordered and bounded. Do the cuts before the additions.

**Step 0 — Take the funding cuts first (word-negative, ~80 words freed).**
P0-11 (drop the Type 6 baseline sentence and the superlative), P0-09 (rewrite the database sentence
short), P0-07 (delete the negative half), P1-04 ("ninety minutes" → "an hour"), plus the two cuts
named in Conflict 1: L192 "and each runs the other way…" and L279 "so this is no confession and no
retraction."

**Step 1 — P0 items, in this order.**

1. **P0-06** — "Five seasons," "co-created." Four words, removes three reviewers' blocker.
2. **P0-01** — Hedge the closer, delete the invented staging, keep the driveway landing.
3. **P0-02** — Riyadh: add the triumph framing, swap the audience claim for a register claim.
4. **P0-04** — Restore the four de-escalations; the "empty threat" qualifier is non-negotiable.
5. **P0-03** — Print "from 23 to about 37" and answer it with the post-37 evidence.
6. **P0-05** — Restore "freaking"; paraphrase "was a normal guy" out of quotation marks unless RQ-02
   resolves first.
7. **P0-08** — Name an outlet, attribute the continuity reading, concede the disanalogy.
8. **P0-09** — Rewrite the database sentence (already cut in Step 0; write the replacement).
9. **P0-10** — One Ferriss dating convention throughout; fix "sixteen years."
10. **P0-11** — Stamp the remaining figures as of August 2026; scope the inference to profiled
    comedians.
11. **P0-07** — Confirm §4 and §5 are now mutually consistent.

**Step 2 — Research-required decisions that can be resolved safely now.**
**RQ-04** first (a grep of MMP transcripts for "nervous / dry mouth / scared" — cheapest, and it
either hardens or reframes the page's marquee section). Then **RQ-05** (Netflix CC for the Frank
Murphy quote) and **RQ-02** (Fresh Air audio). **RQ-03** if the Hulu special is reachable. **RQ-01**
and **RQ-06** carry to the refresh list; neither blocks publication because P0-01 and the
attribute-as-reported fallback are safe under every outcome.

**Step 3 — Accepted P1 items, highest value per word first.**
P1-08 (archive the sources — zero words), P1-03 (durability bundle — word-neutral), P1-02 (link and
de-jargon §1 — word-negative), P1-06 (pull-quote → motive), P1-10 (drop "he does not know he has
it"), P1-09 (Hill superlative → specific), P1-07 (three comprehension tags), P1-01 (counterphobic
Six), P1-11 (one clause of SNL context — do it in the same pass as P0-08), P1-05 (Patrice O'Neal —
largest word cost, do last), P1-04 (already taken in Step 0).

**Step 4 — One P2, only if the ceiling allows.**
**P2-01**, the §6 retitle. It is word-neutral and it is the only change that fixes the scan path into
the section holding the article's best evidence. Everything else in P2 waits for the next refresh.

**Step 5 — Protected-hit regression checks.** Before declaring done, confirm all ten:

| Check | Where | Pass condition |
| --- | --- | --- |
| PROTECT-01 | §5 | Both Cross sentences present, verbatim |
| PROTECT-02 | §1 | Three tellings, three formats, span derivable from printed dates |
| PROTECT-03 | §5 | The two-date table still exists as a table |
| PROTECT-04 | §5 | "The counterattack arrives before the verdict does" intact |
| PROTECT-05 | §6 | Rousey quote plus "Nobody asked. There was no scale in play" intact |
| PROTECT-06 | §3 | "The son's name is Bill" intact, now on a five-season credit |
| PROTECT-07 | §4 | "I wasn't a professional… threw gas on a fire" intact and no longer contradicted |
| PROTECT-08 | Rabbit Hole | Both "What would change our mind" and "What Type 6 does not fully explain" present |
| PROTECT-09 | §1 | "wanting the room to stand down" intact |
| PROTECT-10 | §3 | "He presents it as inheritance" intact after the P0-04 edit |

**Final gates.** `bash scripts/blog-lint.sh` returns 0 fail and body ≤ 4,500 words; re-run the source
audit and confirm no load-bearing quote is vague or untagged; after publish, regenerate
`corpus-stats.json` and confirm no sentence in §1 contradicts it.
