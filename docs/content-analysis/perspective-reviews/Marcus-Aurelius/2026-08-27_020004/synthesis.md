---
artifact: perspective-synthesis
schema_version: 1
subject: Marcus-Aurelius
draft_sha256: ae7bb1e099eb106f3632101f66368088b49c3b66fd20073a3b5edbb109c9a645
synthesis_status: complete
delight_target: fan
p0_open: 9
p1_accepted: 11
research_required: 3
protected_hits: 14
requires_revision: true
synthesized_at: 2026-08-27T07:35:42Z
path: docs/content-analysis/perspective-reviews/Marcus-Aurelius/2026-08-27_020004/synthesis.md
---

## Executive verdict

The article is good and it is not yet publishable. Four of six perspectives return `trust: strained`,
two return `intact`, and all six return `value: high` or `useful` with `delight: clear_hit`. That split
is accurate. The thesis is real, the cold open is the best in recent people drafts, the Book 1
debt-ledger explanation of the beach is an original synthesis, and the refusal to convert that
explanation into an acquittal is the single best editorial decision on the page. None of the nine P0s
below touches any of it.

What the jury actually found, and what my own re-reading of the cited passages confirms, is a **single
recurring failure mode with two faces**.

**Face one: truncation with a direction.** Three load-bearing citations each stop one clause before the
complication, and every one of the omitted clauses cuts the same way. _Med._ 8.1 is quoted from
mid-sentence and framed as a fixed verdict, when the passage turns to "throw away the thought, How thou
shalt seem to others, **and be content**." _Med._ 5.9 is cut at "return back again," dropping "**and be
content if the greater part**." HA 21.4's five days of mourning stops immediately before HA 21.5's own
explanation — the games of Jupiter were running. This is the page doing a more careful version of the
thing it condemns the Stoicism industry for doing. It is also the most repairable class of defect here,
because every restored clause makes the article _more_ interesting: a man who writes down both the
shortfall and the permission to let it go, for ten years, and keeps needing to write both, is a better
subject than a man with a fixed verdict.

**Face two: attribution that does not survive a citation check.** The designated hostile witness is one
sentence welded from two _Historia Augusta_ documents, two speakers and thirteen years apart, with the
colourful half spoken by a man five years dead at the event the draft dates it to, inside a vita whose
letters are generally judged forgeries written to _praise_ Marcus. The origin claim — how Marcus reached
Stoicism at all — never names Junius Rusticus and hands the credit to Fronto by referent. The gravest
charge on the page describes a contemporary document as late hearsay and omits the most damaging
sentence in it. Nine of the ten reviewer blockers reduce to these two faces.

The Enneagram lane returns a separate and correct verdict: Type 1 is right, and the sentence announced
as decisive — "the marking continues in an empty room" — describes an exercise Marcus was _assigned_.
I verified the Epictetus locus independently. As printed, the clincher types the school, not the man.
The repair the reviewer proposes is better than the argument it replaces and costs nothing.

**The binding constraint on all of this is length.** I measured the draft with the repo's own linter:
**4,494 body words against a 4,500 ceiling — six words of headroom.** Roughly +85 words of P0 repair is
required. The revision brief below therefore ships with a word ledger and named funding cuts. An editor
who works this list top-down without cutting will fail the build lint. An editor who cuts the
edition-of-record attributions to make room will destroy the page's single most durable asset. Both
failure modes are called out in Protected hits.

`requires_revision: true`. The type call does not change. Nothing in this brief asks for a rewrite.

---

## P0 — mandatory red-flag repairs

### P0-01 — The designated hostile witness is one quotation welded from two documents, two speakers, and two dates

- **Origin:** CRITIC-R2 (critic, blocker), SUBJECT-R2 (subject, blocker), FAN-R1 (fan, blocker). Related:
  UNFAM-C5 (unfamiliar, name collision).
- **Location:** "Why Marcus Aurelius Could Not Enjoy a Holiday"; also TL;DR bullet 7 and TESTIMONY LEDGER
  item 5.
  > "During his 175 revolt, the general Avidius Cassius reportedly called Marcus 'a philosophical old
  > woman' who 'wishes to be called merciful and hence suffers to live men whose manner of life he cannot
  > sanction.'"
- **Adjudicated problem:** presented as one man's remark on one occasion, it is two quotations from two HA
  documents. "Wishes to be called merciful" is _Avidius Cassius_ 14.3, a letter attributed to Cassius in
  175 — correct. "A philosophical old woman" is _Avidius Cassius_ 1.8, inside a passage headed "Extract
  from the letter of **Verus**," in which Lucius Verus reports Cassius's insults to Marcus. **Verus died in
  early 169 and cannot be speaking during a 175 revolt.** The draft's hedge ("the Historia Augusta, which
  puts speeches in mouths") covers reliability but not speaker or date. Aggravating: the vita's letters are
  generally judged forgeries produced to praise Marcus's clemency, so an article arguing that Marcus's
  reputation outruns his record is resting its adverse testimony on ancient PR.
- **Evidence and confidence:** packet CLM-01 / TP-5, both loci verified verbatim on LacusCurtius; the
  dating contradiction is arithmetic. Three independent perspectives reached it separately. **High.**
- **Minimum repair:** take the critic's option 2. Drop "a philosophical old woman" and replace it with the
  other half of 14.1–3 — Marcus "philosophizes and meditates on first principles, and on souls and virtue
  and justice, and **takes no thought for the state**." Same document, same date, correctly attributed, and
  a harder charge for this article to absorb. Keep the existing 14.3 clause and its hedge. Update TESTIMONY
  LEDGER item 5 and the TL;DR bullet to match. Use "Avidius Cassius" in full at every mention, including
  the Rabbit Hole's bare "Cassius' death," so the general is never confused with Cassius Dio (UNFAM-C5).
  Roughly length-neutral.
- **Reader benefit:** the critic beat survives a citation check, and the charge that lands is one that
  actually engages the thesis rather than one the next paragraph absorbs.
- **At risk:** PROTECT-11 is untouched. The TL;DR loses a colourful bullet; replace it, do not delete it,
  or the "what Rome thought of it" beat goes thin.
- **Acceptance test:** no sentence attributes "philosophical old woman" to Avidius Cassius in 175 (or the
  phrase is absent); every hostile quotation names its document, speaker of record and date; a reader
  opening HA _Avidius Cassius_ 1 and 14 finds the page's attributions matching the text's own headings.

### P0-02 — The origin claim never names Rusticus, and the referent chain delivers Fronto

- **Origin:** FAN-R2 (fan, blocker), SUBJECT-C1 (subject), UNFAM-C1 (unfamiliar, highest-priority concern —
  the reviewer explicitly invites escalation).
- **Location:** "Who Marcus Aurelius Was, and How Rome Picked Him Twice."
  > "He got twenty-three years to prepare, educated chiefly in rhetoric under Marcus Cornelius Fronto…
  > Somewhere in there the training took a turn Fronto never fully forgave. Marcus found the Stoics,
  > through the man he thanks for it in his notebook: 'I am indebted to him for being acquainted with the
  > discourses of Epictetus…'"
- **Adjudicated problem:** the sentence states no falsehood and reliably installs one. Fronto is named
  twice in the two preceding sentences; "the man" is never named; there is no other candidate on the page.
  Med. 1.7 is the entry headed "**From Rusticus**." Fronto's own entry, 1.11, says something else entirely.
  This sits inside the page's origin claim — the precondition for everything the article argues — and
  nothing later corrects it, because Rusticus never appears. The unfamiliar reviewer confirms the failure
  empirically: they attached "the man" to Fronto on first read and could not resolve it. That the reader
  most likely to be misled is the one least able to detect it is what makes this a P0 rather than a
  concern.
- **Evidence and confidence:** packet CLM-02, Med. 1.7 verified verbatim; HA _Marcus_ 3.2–3 corroborates
  ("he received most instruction from Junius Rusticus… whose disciple he became"). **Certain on the fact,
  high on the misreading risk.**
- **Minimum repair:** name him. "Marcus found the Stoics through a different teacher, Junius Rusticus, who
  lent him his own copy of Epictetus" — then the quotation. **+3 words.**
- **Reader benefit:** removes a reversed fact from the sentence that licenses the article, and does it on a
  page whose moral argument is that Marcus credited others by name with everything he had.
- **At risk:** none. Do **not** import the Rusticus–Justin Martyr connection here (see P2-01 and RQ-03);
  that is a separate decision with its own guardrail.
- **Acceptance test:** the name "Junius Rusticus" appears adjacent to the Med. 1.7 quotation, and no reader
  tracing the referent can land on Fronto.

### P0-03 — The closing beat cites the passage in which the verdict is revised

- **Origin:** SUBJECT-R1 (subject, blocker), CRITIC-C2 (critic), FAN-C9 (fan). Packet CLM-03.
- **Location:** "The Book He Never Meant Anyone to Read," final paragraph; also the c. 175 timeline entry,
  TL;DR bullet 2, FAQ 1; and the diagnosis section's use of Med. 5.9.
  > "That reader had already decided, and never revised, and the verdict is right there in the first line
  > of Book 8: it is plain to everyone, including you, how far you are from it."
- **Adjudicated problem:** the quoted words are accurate and the framing inverts them. Long's 8.1 opens
  "**This reflection also tends to the removal of the desire of empty fame**, that it is no longer in thy
  power…" and turns at "throw away the thought, How thou shalt seem to others, **and be content** if thou
  shalt live the rest of thy life in such a way as thy nature wills." Read whole, 8.1 is a therapy against
  vanity that uses the shortfall instrumentally. The article's last word on the man is that his self-verdict
  never changed, cited to the passage where it changes. The same cut recurs at 5.9: "when thou hast failed,
  return back again" drops "**and be content if the greater part of what thou doest is consistent with man's
  nature**," which is what the gloss "all it bought him was a faster recovery" is resting on. Separately,
  "everyone could see it" is broader than Long's "both to many others and to thyself," and the timeline's
  "Book 8 opens:" begins mid-sentence.
- **Evidence and confidence:** packet CLM-03 and the _Meditations_ table, verified verbatim; the subject
  reviewer re-verified both continuations against the Standard Ebooks Long text. Detected independently by
  three perspectives. **High.**
- **Minimum repair:** carry 8.1's frame and turn at **one** appearance — the closing, which is the load-bearing
  one. The ending survives and sharpens: he wrote down the shortfall _and_ the permission to stop caring who
  saw it, for ten years, and kept needing to write both. Restore 5.9's "be content if the greater part" clause
  **or** drop the "faster recovery" gloss. Change the timeline's "Book 8 opens" to "Book 8 turns," and
  "everyone" to "others" wherever it stands unqualified. **~+15 words at the closing, −8 from the "never
  revised" clause it replaces.**
- **Reader benefit:** removes the page's one self-inflicted wound — a misquotation charge on a page whose
  thesis is that this man is misquoted — and buys a genuinely non-obvious final image.
- **At risk:** PROTECT-14 and the closing line "He was fifty-four, and he had been at it since he was
  twenty-five, and he was still marking the same paper" (unfamiliar preserve #11, future preserve #6). The
  repair must land _before_ that sentence, not replace it.
- **Acceptance test:** a reader who opens Long 8.1 and 5.9 immediately after finishing the article finds
  nothing in either section that contradicts how the article characterized it; no instance describes 8.1 as
  a standalone self-verdict; the word "everyone" does not stand unqualified against "both to many others and
  to thyself."

### P0-04 — The five-days-of-mourning quotation stops one clause before its own source's explanation

- **Origin:** CRITIC-R3 (critic, blocker), SUBJECT-R3 (subject, blocker). Packet CLM-10 / TP-4.
- **Location:** "Marcus Aurelius, Faustina, and the Children He Buried"; also TL;DR bullet 6 and FAQ 5.
  > "'For no more than five days did he mourn him,' the biographer writes, 'and even during this period,
  > when consulted on public affairs he gave some time to them.' The source is unreliable and the number may
  > be invented. The behavior it describes is the behavior Fronto had been complaining about for twenty
  > years."
- **Adjudicated problem:** the quotation is verbatim and ends exactly where HA 21.5 begins: "**And because
  the games of Jupiter Optimus Maximus were then in progress and he did not wish to have them interrupted by
  public mourning**, he merely ordered that statues should be decreed for his dead son…" On the source's own
  account the brevity of _public_ mourning is a ceremonial decision about not halting a religious festival.
  The draft hedges the number but not the interpretation, then converts the truncated fact into character
  evidence in the next sentence — which neutralises the disclaimer it just issued. This is the page's most
  emotionally weighted claim and it is falsifiable by the next clause of its own citation, four lines down.
- **Evidence and confidence:** HA 21.3–5 verified verbatim in the packet, which states the point explicitly:
  "On the source's own account the brevity is a public-ceremonial decision, not (or not only) a temperamental
  one." **High.**
- **Minimum repair:** carry the 21.5 clause and demote the inference to a reading. One sentence: the
  biographer supplies his own reason — the games of Jupiter were running and he did not want them stopped for
  public mourning — which makes five days a ceremonial figure at least as much as a personal one. The
  paragraph still lands, because what the games explanation does **not** cover is that he transacted public
  business during those days. Add the source hedge to the TL;DR bullet, or soften "took meetings during
  them," which is the article's compression rather than the source's language. **~+20 words.**
- **Reader benefit:** the page stops making its harshest characterological inference on a truncated
  sentence, and the surviving inference is stronger for being narrower.
- **At risk:** the section's emotional force. It survives — the arithmetic of seven buried children, Book
  1.17 "not been stupid nor deformed in body," and "That is a man counting what was left" are untouched.
- **Acceptance test:** HA 21.5's games clause appears on the page in some form, and no sentence describes the
  five-day figure as straightforwardly "the behavior Fronto had been complaining about" without that
  qualification in view.

### P0-05 — The Lyon paragraph misdescribes its own source and omits the most damaging item, inside a promise not to smooth over

- **Origin:** CRITIC-R1 (critic, blocker), SUBJECT-C8 (subject), FAN-C8 (fan). Packet CLM-07 / S-07 / S-12 /
  S-14, Disputes item 1.
- **Location:** "Why Marcus Aurelius Could Not Enjoy a Holiday."
  > "How much he knew or ordered is contested: the only detailed account is Eusebius, writing more than a
  > century later, and Tertullian, alive at the time, called Marcus a protector of Christians rather than a
  > persecutor. What nobody disputes is that these deaths sit inside the reign of the philosopher on the book
  > covers. It does not resolve, and it should not be smoothed over."
- **Adjudicated problem:** three moves compound in one direction. (1) The source description is **wrong**:
  the detailed account is not Eusebius's composition but a **contemporary letter from the churches of Lyon
  and Vienne to the churches of Asia Minor**, written c. 177 and quoted at length by Eusebius at _EH_ 5.1.
  "Writing more than a century later" transfers Eusebius's date onto a document a century older, making the
  inculpatory evidence sound like late hearsay. (2) The strongest inculpatory item is **absent**: that same
  contemporary letter reports an imperial rescript at 5.1.44 ("concerning whom he had written to Cæsar, and
  whose answer he was awaiting") and 5.1.47 ("**For Cæsar commanded that they should be put to death, but
  that any who might deny should be set free**"). (3) The counterweight offered is the exculpatory one only,
  and Tertullian arrives with a proximity marker and no caveat, though the rescript he leans on is itself
  widely disputed as spurious — the same doubt the page applies freely to the HA elsewhere. A reader who
  follows the citation finds a contemporary document reporting that the emperor ordered the executions, in a
  paragraph that told them the record was thin and remote. The sentence "it should not be smoothed over"
  converts an omission into a broken assurance.
- **Evidence and confidence:** packet CLM-07, both Eusebius loci verified verbatim by the packet compiler;
  independently reached by three perspectives. **High on the facts; high on severity — the draft itself calls
  this "the objection that outlasts all of those."**
- **Minimum repair:** rewrite the source description accurately and let both sides carry their strongest item,
  then keep the existing refusal to resolve verbatim. Name the account as a letter written at the time by the
  churches of Lyon and Vienne and preserved by Eusebius; carry 5.1.47's reported order in a clause; then the
  counterweights in the same breath — no other contemporary source records the episode, Irenaeus in Lyon is
  silent three years later, the letter names no emperor personally, Marcus was weeks' march away, and the
  document Tertullian relies on is itself contested. **Do not adjudicate it.** The packet declines to and so
  must the page. **~+35 words** — the single largest addition in this brief, and the reason the funding cuts
  below are mandatory rather than optional. S-14 (Robertson) is explicit advocacy by a sympathetic
  biographer: use it to locate arguments, never to settle the question.
- **Reader benefit:** the page's gravest charge stops being answerable by a reader with one browser tab, and
  "it should not be smoothed over" becomes true instead of aspirational. The paragraph converts from the
  draft's weakest critic-handling into the one place on the page that shows both sides of a genuinely
  unresolved question.
- **At risk:** PROTECT-10 — "It does not resolve, and it should not be smoothed over" is future preserve #2
  and must survive as the closing stance. Any pass that turns this paragraph into a verdict in either
  direction fails the repair.
- **Acceptance test:** the words "the only detailed account is Eusebius, writing more than a century later"
  no longer appear; the page contains either the 5.1.47 order or an explicit statement of why it is not used;
  a reader who opens _EH_ 5.1 finds nothing more damaging than the paragraph prepared them for, and nothing
  that contradicts its description of who wrote the account and when. RQ-01 does **not** block this repair.

### P0-06 — The stated clincher describes a prescribed Stoic exercise, not a personality signature

- **Origin:** ENN-R1 (enneagram, blocker — domain owner). Corroborated by SUBJECT-C9 and CRITIC-C1 as the
  structural objection the page never faces.
- **Location:** "What is Marcus Aurelius's personality type?"; reinforced at the closing and FAQ 1.
  > "That last part is what settles it. Plenty of people hold high standards. What marks a [Type 1] is the
  > machinery underneath: the standard measures whether you are good at the root, and the marking continues
  > in an empty room. With Marcus the room was always empty."
- **Adjudicated problem:** a Stoicism-literate reader reaches "the marking continues in an empty room" and
  thinks _so did Seneca, so did every student Epictetus ever taught_. The sentence announced as decisive
  fails to the exact objection that reader arrives holding, and the page then reads as having typed a
  doctrine rather than a man. The draft supplies the link itself: Marcus's entry into Stoicism was being
  handed the _Discourses_ (Med. 1.7).
- **Evidence and confidence:** **I verified this independently.** Epictetus, _Discourses_ 3.10.2–3 (Perseus,
  Long) quotes the Golden Verses as the practitioner's standing instruction: "Let sleep not come upon thy
  languid eyes / Before each daily action thou hast scann'd; / What's done amiss, what done, what left
  undone; / From first to last examine all, and then / **Blame what is wrong, in what is right rejoice.**"
  Packet dispute #11 states the generic form of the objection; the Epictetus locus makes it specific and
  therefore answerable. **High on the defect; high on the repair.**
- **Minimum repair:** keep the definition sentence — it is PROTECT-14, the page's only jargon-free
  operational definition — but stop claiming the empty room is what settles it. Replace the _clincher_ with
  the asymmetry the same prescribed exercise exposes: the exercise he was taught ends "blame what is wrong,
  in what is right rejoice"; Book 1 is seventeen entries of rejoicing with every line credited to somebody
  else and not one to himself. He ran the debit column for thirty years and never opened the other one. Fund
  it with the ~60 words of Ariston re-narration two paragraphs above ("Watch the sequence in it… He reads a
  philosopher. The philosopher shows him…"), which restates a letter the timeline has already printed
  verbatim and which UNFAM-C6 independently wants cut. **Word-neutral to word-negative.**
- **Reader benefit:** converts the page's largest vulnerability into its strongest argument, promotes Book 1
  from illustration to evidence, and makes the thesis and the diagnosis argue the same thing for the first
  time.
- **At risk:** PROTECT-03 (the Book 1 debt-ledger beat in the holiday section) must not be cannibalised —
  Book 1 can carry both jobs, but the holiday section's version stays intact. PROTECT-14 must survive as the
  definition even though it stops being the clincher. PROTECT-13: this repair adds no type vocabulary to the
  narrative body; keep it inside the diagnosis section.
- **Acceptance test:** a reader who knows Stoics practised daily self-examination can state, after reading
  the diagnosis section, what Marcus did that other Stoics did not. If the honest answer is still "he did the
  exercise," the repair has not landed.

### P0-07 — The only alternative-type test in the body is declared "clean" on a stimulus its own source contradicts

- **Origin:** ENN-R3 (enneagram, blocker), SUBJECT-C6 (subject). Packet CLM-06 / FP-3.
- **Location:** diagnosis section and FAQ 2.
  > "The 143 Senate letter is the test case, and it fails the Six read cleanly. A Six under that pressure
  > seeks reassurance and takes it when it arrives."
  > FAQ 2: "immediately after receiving a letter of lavish praise from Fronto that he acknowledged and set
  > aside."
- **Adjudicated problem:** a reader who opens Loeb vol. 1 p. 109 finds Marcus's own first sentence describing
  the letter as a deliberate mix of praise **and abuse**: "not being able to win credit for your praise of me
  by reason of your signal partiality in my case you sought to make it credible by throwing in some abuse."
  Part of his reply is announcing he has seen through the technique. "Lavish praise… acknowledged and set
  aside" is not what happened, and a Six seeing through offered reassurance is textbook Six scepticism — so
  the test as framed does not exclude the rival it was built to exclude. FAQ 2 is the surface a search result
  or an assistant will lift verbatim.
- **Evidence and confidence:** packet CLM-06, Loeb vol. 1 p. 109 verified verbatim. **High.**
- **Minimum repair:** delete "cleanly." In FAQ 2 replace "a letter of lavish praise" with "a letter of praise
  he had just called a rhetorical device." Rest the discriminator explicitly on the stake rather than the
  sequence — the page's own next sentence already does the work. **Net −10 words.**
- **Reader benefit:** the discriminator survives verification instead of collapsing on it, and the section's
  strongest sentence becomes its load-bearing one.
- **At risk:** PROTECT-04. This repair exists to protect "His worry is not that something bad will happen to
  him. It is that he may not deserve his own teacher." That sentence must survive verbatim.
- **Acceptance test:** the paragraph's claim is checkable against Loeb vol. 1 p. 109 without the reader
  finding a contradiction in the letter's opening sentence, and the Six exclusion rests on
  desert-versus-danger rather than reassurance-offered-and-refused.

### P0-08 — The 1w2 call is argued on an axis the site's own linked definition does not use, and contradicts the article's thesis sentence

- **Origin:** ENN-R2 (enneagram, blocker — domain owner).
- **Location:** Rabbit Hole → "Marcus Aurelius's Wing: 1w2"; asserted unhedged there and stated in TL;DR
  bullet 1, FAQ 1 and `keywords`.
  > "The wing call is 1w2 rather than 1w9, and the evidence is his warmth under conditions where a 1w9 would
  > go cold and withdraw. The 1w9 idealist tends toward the detached corrector: standards aimed at systems,
  > anger running quiet, people held at a distance."
- **Adjudicated problem:** the paragraph hyperlinks the wings guide. **I verified the linked definitions
  in-repo.** `src/blog/enneagram/enneagram-type-1.md:140` defines 1w2 as "The Advocate… More interpersonal,
  teaching-oriented. Their perfectionism extends outward as help… The judge who leaves the bench to fix your
  case personally." Line `:138` defines 1w9 as "The Idealist… More withdrawn, philosophical, measured. Their
  perfectionism turns inward… Less likely to correct you." The discriminating axis in the site's own words is
  the **direction of the correcting impulse**, not capacity for affection. The article's intro reads "Marcus
  Aurelius taught nobody, built no school, published no doctrine," and its Counterarguments section reads "he
  held unlimited power to correct everyone in the empire and pointed the standard almost entirely at himself."
  The page argues 1w9 in the body and asserts 1w2 in the Rabbit Hole, on warmth, which the definition does not
  make the axis. The clause "people held at a distance" appears in neither definition and is doing the work of
  making 1w9 fail.
- **Evidence and confidence:** the two in-repo definitions, verified. **High that the current argument
  contradicts the linked definition; medium on which wing survives a fair test** — which is why the repair is
  "test it," not "change it."
- **Minimum repair:** rebuild on the deciding axis and hedge the confidence to match. Concede in one clause
  that his correcting impulse ran inward, which is the 1w9 signature. Then argue, if the page still wants 1w2,
  that his _obligations_ ran to named people rather than to principles — the Verus co-rule, the Cassius pardon,
  the Faustinian girls, Book 1 as an inventory of debts to named people — rather than leading with Fronto
  warmth. Replace "the evidence is his warmth" with language admitting this is the least certain call on the
  page. **Word-neutral.**
- **Reader benefit:** removes a self-contradiction a reader can verify in one click, and the rebuilt argument
  is stronger than the one it replaces.
- **At risk:** **PROTECT-12.** Do not drag "he mostly declined to correct others" back into the wing paragraph
  as 1w2 evidence — that laundering is exactly what the second pass already removed, and the fan preserve list
  names it explicitly. The concession stays in Counterarguments.
- **Acceptance test:** the wing paragraph names the axis (does the correction aim at people or at ideals?),
  concedes the fact that cuts against it, and does not lead with warmth. A reader clicking through to the
  wings guide finds the page consistent with what they read there.

### P0-09 — "Four of them before he was ever emperor" is unsupported, in the passage that tells the reader to check the arithmetic

- **Origin:** CRITIC-C8 (critic), FAN-C1 (fan), SUBJECT-C7 (subject). Packet CLM-13.
- **Location:** "Marcus Aurelius, Faustina, and the Children He Buried."
  > "Do the subtraction. He buried at least seven of his own children, most of them small, and four of them
  > before he was ever emperor."
- **Adjudicated problem:** "at least seven" is safe on either the 13- or 14-child count. "Four" is not. On the
  conventional list, deaths before March 161 are Domitia Faustina (d. 151), the two 149 twins, Tiberius Aelius
  Antoninus (d. before 156) and the unknown child (d. before 158) — **five**, with Hadrianus a possible sixth.
  The packet located no source supporting exactly four. The damage is disproportionate to the size of the
  error because the sentence immediately before it instructs the reader to do the subtraction.
- **Evidence and confidence:** packet CLM-13 and "The family, in numbers" with the dated child list from S-09.
  Three independent perspectives. **High that "four" is unsupported; medium on whether the replacement should
  be "five,"** since one entry is undated.
- **Minimum repair:** "**most of them** before he was ever emperor" — the non-numeric form, which the packet
  flags as the more defensible choice given the undated entries. "At least five" is acceptable. **0 words.**
- **Reader benefit:** removes a one-click factual error from the passage most likely to be quoted elsewhere.
- **At risk:** none. "Do the subtraction" and "That is a man counting what was left" both survive.
- **Acceptance test:** the stated pre-161 count is either five or non-numeric and is derivable from the
  packet's child list without assuming a different one.

---

## P1 — accepted high-value improvements

Ordered by value per word. Items P1-01 and P1-02 are the only substantial additions; everything below
P1-04 is cheap or word-negative.

### P1-01 — Face the genre objection, and give the page a falsification clause that can fail

- **Origin:** CRITIC-C1 (critic, highest-priority concern), ENN-C1 (enneagram), SUBJECT-C9 (subject). Three
  perspectives, independently. Packet "Evidence against… Type 1" item 5: "the single strongest structural
  objection available to a skeptic… applies to every item in the 'for' list."
- **Location:** Rabbit Hole → Counterarguments, closing line.
  > "What would change our minds: evidence that the self-criticism was situational. The two archives close
  > that door, thirty-three years apart, saying the same thing."
- **Adjudicated problem:** a rhetoric student's letter to his tutor and a Stoic's _hypomnemata_ are both
  genres whose convention **requires** the self-scrutiny being read as diagnostic. Two documents in the same
  self-examining mode are not two independent measurements if the mode produces the signal. The falsification
  clause names a condition its evidence base structurally cannot produce, then declares it satisfied — the
  argument grading its own homework, in the one section whose job is honesty.
- **Evidence and confidence:** packet dispute #11 and the "Evidence against" list. **High.**
- **Minimum repair:** name the objection plainly (both archives are self-examination genres), then answer it
  with the non-self-report evidence the page already owns: Fronto's outside testimony, the _De Feriis_ comic
  essay whose entire premise is a third party observing that he would not rest, and Dio on the eating. Then
  narrow the falsification clause to something a document could have met and did not — outside testimony
  describing him as relaxed, unbothered by his own standards, or self-forgiving. **~+55 words.** If budget
  allows a further ~35, fold in FAN-I1: HA _Marcus_ 2.6, the boy at twelve in a rough Greek cloak sleeping on
  the ground until his mother talked him onto a couch of skins. That is a third-party behavioural datum from
  **six years before Fronto and twenty-three before the throne**, which closes the "the austerity was the job"
  reading and is the strongest single answer to this objection available. Flag it with the same HA caveat the
  page already applies twice.
- **Reader benefit:** converts the page's most obvious skeptical entry point into a demonstration of method,
  and replaces a decorative falsification clause with a real one.
- **At risk:** **REJECT the subject reviewer's supporting clause** "the same exercise did not make Epictetus
  or Seneca write like this." It is unverified and contestable — Seneca's letters are saturated with
  self-examination. Do not include it. PROTECT-13: keep this inside the Rabbit Hole; do not seed type theory
  into the narrative body.
- **Acceptance test:** the Rabbit Hole explicitly states that both first-person archives belong to
  self-examining genres, and the "what would change our minds" line names a condition that could in principle
  be met by a surviving document.

### P1-02 — Surface Marcus's own verdict on self-reproach, from the passage the page already cites

- **Origin:** CRITIC-C6 (critic), ENN-C3 (enneagram), SUBJECT-C4 (subject). Three perspectives. Packet
  CLM-15 and the _Meditations_ table.
- **Location:** anger section (which quotes Med. 11.18's numbered protocol) and Rabbit Hole →
  Counterarguments.
- **Adjudicated problem:** Med. 11.18 closes by naming four aberrations of the ruling faculty, the fourth
  being "when thou shalt reproach thyself for anything, for this is an evidence of the diviner part within
  thee being overpowered and yielding to the less honourable part." The subject explicitly named the habit
  the article makes his signature, and called it a fault — in the same section the article already cites, and
  stops just short of. Taken with P0-03 and P0-04, that is three load-bearing citations each stopping one
  clause before the complication, all in the same direction. A reader who finds it independently reads the
  omission as avoidance.
- **Evidence and confidence:** packet-verified verbatim; the packet calls it "the best single discriminator
  not currently on the page." **High on the omission; high that the answer holds.**
- **Minimum repair:** put it in the Rabbit Hole counterargument block, adjacent to P1-01's genre paragraph,
  and answer it in the same breath: an instruction to stop reproaching yourself, filed privately among nine
  other corrections, is another correction. He is marking himself for marking himself. The packet notes it can
  be read either way; the page does not need to win the point, it needs to have made it. **~+40 words**, and
  the Rabbit Hole is the cheapest place on the page to spend.
- **Reader benefit:** an article that surfaces the best line against itself is far harder to attack than one a
  reader discovers withheld it.
- **At risk:** none. PROTECT-05 ("Nobody writes a numbered protocol for a problem they do not have") stays
  where it is; this belongs in the Rabbit Hole, not in the anger section.
- **Acceptance test:** Med. 11.18's self-reproach clause appears on the page and is engaged rather than
  mentioned.

### P1-03 — Reconcile the two-archive span to one figure everywhere

- **Origin:** FAN-C3 (fan), UNFAM-C2 (unfamiliar). Packet CLM-14.
- **Location:** H2 "Two Archives, One Emperor: Marcus Aurelius at 22 and at 55"; body "Thirty-three years,
  two languages, two readers, one report"; TL;DR and FAQ 1 "Thirty years later"; timeline "age ~54"; closing
  "He was fifty-four."
- **Adjudicated problem:** the page's signature structure is defined by a span and the span is stated four
  ways. The heading advertises an age (55) that the timeline and the closing line both contradict (54). The
  unfamiliar reader reports trying to hold the number, failing, and then discounting the precision of every
  smaller figure around it.
- **Evidence and confidence:** 143 (age 22) to c. 175 (age ~54) is 32 years; _Meditations_ is not internally
  datable beyond the c. 170–180 convention, so no exact span is recoverable. **High.**
- **Minimum repair:** heading to "at 22 and at 54"; both prose statements to "more than thirty years." Prefer
  the approximate form since the composition date is a convention, not a fact. **Word-neutral.**
- **Reader benefit:** the centrepiece stops undermining itself arithmetically and the page's other precise
  figures inherit the credibility.
- **At risk:** **direct conflict with future preserve #3**, which lists "Thirty-three years, two languages,
  two readers, one report" as must-survive. Resolved in Conflicts below: the sentence's form and durability
  argument survive intact as "More than thirty years, two languages, two readers, one report." Resolve the age
  in favour of the closing line (54), not the heading (55) — unfamiliar preserve #11 is explicit on this.
- **Acceptance test:** heading, timeline, body, TL;DR and FAQ 1 all state the same span, and it matches the
  timeline's own endpoints.

### P1-04 — The word-negative precision cluster

Seven word-level edits, grouped because each is independently cheap and collectively they fund the P0
additions. **Net ≈ −5 words.**

- **Origin:** FUTURE-C1, C3, C4, C5, C6 (future); CRITIC-C7, C9 (critic); FAN-C2 (fan); ENN-C4 (enneagram).
- **The edits:**
  1. **Corpus counts (FUTURE-C1, high confidence, −5 words).** "Type 1 is also the rarest read in the 9takes
     corpus, 26 of 426 published profiles ([corpus stats](/corpus-stats))" → drop the raw counts, keep the
     claim and the link. **I verified `src/lib/data/corpus-stats.json`: 426 published, Type 1 = 26.** The file
     regenerates from Supabase on every Vercel deploy, and publishing _this page_ makes it 27 of 427 — the
     sentence is off by one on day one. Live precedent: `Benny-Blanco.md` is published with three wrong
     numbers. Use the numberless construction already in `Liang-Wenfeng.md`. Consider "among the rarest," since
     the T1/T2 margin is only 3.
  2. **Plague de-hedge (CRITIC-C7 + FUTURE-C3, −2 words).** "the plague is killing five million of the people
     he was handed" → "millions." The spine hedges correctly; the empathy turn drops the hedge at the exact
     point where the figure does mitigating work, on a scholarly range spanning an order of magnitude.
  3. **"The whole explanation" (CRITIC-C7).** A monocausal absolute in an article whose argument is that
     monocausal readings of this man are wrong. → "That is the explanation of the beach."
  4. **PolitiFact absolute (FUTURE-C4, −1 word).** "appears nowhere in the book" → "that no one has been able
     to find in the book." The fact-check itself hedges: the author "didn't find the quote searching an online
     version," and a philosophy professor calls a creative-paraphrase origin "just vaguely possible."
  5. **Two unsourced superlatives (FUTURE-C5 + CRITIC-C9, +3 words).** "the most durable self-help text in the
     Western canon" and "The most reproduced philosophy book in the world" → "one of the most…". Packet CLM-18:
     no sales, print-run or circulation data located. An article arguing that this man's reputation outruns his
     record should not inflate his book's standing in the same breath.
  6. **"Locked cabinet" → "holy" (FAN-C2 + CRITIC-C3, 0 words).** HA 17.4 reads "a particularly **holy**
     cabinet of Hadrian's." "Locked" is not in the source, and it is an invented detail inside the passage the
     draft prizes for being "specific." "Holy" is the better fact anyway: he sold consecrated objects to fund a
     war.
  7. **"Which are the bulk of the book" (ENN-C4 + CRITIC-C9, 0 words).** An unquantified premise the packet
     flags as unestablished → "which recur throughout it."
- **At risk:** PROTECT-08. None of these seven touches an edition-of-record attribution. Do not "find" further
  words there.
- **Acceptance test:** `grep -nE '[0-9]+ of [0-9]{3} published profiles'` returns nothing while the sentence
  still contains `(/corpus-stats)`; no in-body plague figure is more certain than the spine's; the word
  "whole" no longer governs a psychological explanation; no bare "the most X in the world/canon" about
  _Meditations_ remains; the adjective on Hadrian's cabinet appears in HA 17.4; `Gladiator` carries (2000).

### P1-05 — The most flattering section gets its counterweight and its correct occasion

- **Origin:** CRITIC-C3 (critic). Packet CLM-08, CLM-09, TP-3.
- **Location:** "How Marcus Aurelius Paid for a War He Could Not Win Quickly."
  > "Dio records the principle behind it in the plainest sentence Marcus ever aimed at the Senate: 'As for us,
  > we are so far from possessing anything of our own that even the house in which we live is yours.'"
- **Adjudicated problem:** Dio attaches that line to a **later, different** occasion — c. 178, the Scythian
  crisis, in which Marcus **is asking the senate for money** — whereas the auction fragment stresses that he
  "neither devised any new tax nor brought himself to ask anyone for money." Calling it "the principle behind
  it" asserts a documentary link Dio does not supply, across an occasion whose facts partly cut the other way.
  Separately, this is the only section on the page carrying no adverse fact, in an article premised on
  reputation outrunning record — while Dio 72.32.3, in the same book of the same source the draft quotes four
  times, records: "I am surprised to hear people even to-day censuring him on the ground that he was not an
  open-handed prince."
- **Evidence and confidence:** packet CLM-09 grades the bridge "interpretation," risk "low-moderate"; the
  quotation itself is verified verbatim. **High on the occasion mismatch; medium on how much it costs the
  reader** — which is why this is P1 and not P0.
- **Minimum repair:** soften four words — "Dio records him telling the senate, on another occasion, that…"
  Add a half-clause noting Dio corroborates the auction independently (this makes the section's best story
  _better_ attested, not worse). If budget permits, one clause carrying Dio 72.32.3. **~+15 words for the
  first two; +12 for the third.**
- **Reader benefit:** the page's most admiring section becomes its best-sourced one and stops being the place
  a skeptic points to when arguing the article only pressure-tests where pressure is cheap.
- **At risk:** PROTECT-02-adjacent — the yard-sale narrative unit is named by three perspectives as the best
  on the page. The inventory, the two months, and the refund offer are untouchable.
- **Acceptance test:** no sentence asserts that Dio 72.33.2 states the principle of the auction; Dio's
  independent corroboration appears; at least one adverse contemporary judgment appears in the section.

### P1-06 — Restore Fronto's "Time was" frame on the temper quotation

- **Origin:** SUBJECT-C5 (subject). Packet CLM-05 / TP-1.
- **Location:** "Why Marcus Aurelius Kept Writing Reminders About Anger."
  > "'I would call you an austere and unreasonable, even at times, stung by anger, a disagreeable sort of
  > person.' That is the person closest to him, describing a young man with a temper he was already learning
  > to keep off his face."
- **Adjudicated problem:** this is the **only outside description of his temperament on the page**, and it is
  the second of three "trifles" Fronto offers to prove that he loves Marcus. It opens "**Time was I did
  this**" and is immediately followed by Fronto saying he could not bear to hear the same criticism from
  anyone else. The draft's first use of the neighbouring letter keeps "Time was"; this second use drops the
  frame and presents an affectionate retraction as testimony against him.
- **Evidence and confidence:** packet CLM-05, Loeb vol. 1 p. 207, verified verbatim. **High.**
- **Minimum repair:** keep "Time was" or one clause of frame. **~+4 words.**
- **Reader benefit:** the page's one piece of outside temperament evidence stops being overweighted, which
  matters more after P1-01 promotes outside testimony to load-bearing status.
- **At risk:** P1-01 leans on this same quotation as non-self-report evidence. The two are compatible — Fronto
  is still describing a real temper — but the framing must be teasing intimacy, not indictment.
- **Acceptance test:** the reader can tell the quotation comes from a declaration of affection.

### P1-07 — Name the Ariston letter's occasion once, and let Dio carry the austerity

- **Origin:** SUBJECT-C3 (subject). Packet CLM-04, which grades diagnostic weight "interpretation."
- **Location:** diagnosis section ("A full behavioral cascade… by a young man who assumed he was writing to
  one friend") and Rabbit Hole → subtype ("The Ariston letter ends its penances with 'starve myself'").
- **Adjudicated problem:** the letter's occasion is an apology for not writing an exercise Fronto assigned;
  the penance passage is the excuse offered; and Marcus closes by resolving to set Ariston aside and read
  Cicero. The reader is his rhetoric tutor — the man grading his prose — in a genre that prized vivid
  self-presentation. The draft reads it as a behavioural record and spends "starve myself" as literal evidence
  for the self-preservation instinct. The packet is careful here: "testimony about his self-description, not a
  behavioural record."
- **Evidence and confidence:** packet CLM-04, risk graded moderate — "the quotation is solid; only its weight
  is arguable." **High on the omission; medium on materiality**, which is why it is P1.
- **Minimum repair:** one clause naming the occasion at the diagnosis (**not** in the epigraph, which stays
  clean), and let Dio 72.6 carry the austerity claim in the subtype paragraph since it is independent
  testimony. **~+12 words**, and much of it is already funded by P0-06's cut of the re-narration.
- **Reader benefit:** a reader who opens the letter is not surprised by what surrounds the quoted lines.
- **At risk:** the epigraph. Do not qualify it there — it is the page's opening voice.
- **Acceptance test:** the diagnosis names the occasion once, and the subtype paragraph's austerity claim
  rests on outside testimony rather than solely on the letter.

### P1-08 — Commodus was designated heir in 166, aged five

- **Origin:** CRITIC-C4 (critic). Not in the packet — the critic sourced it independently and flagged it as an
  addition the compiler should be told about.
- **Location:** "Marcus Aurelius and Commodus: The Correction He Never Made."
  > "Whether Marcus had a real alternative is genuinely disputed. A living adult son had never been passed
  > over for an adopted heir, and doing it would likely have meant the civil war he had narrowly avoided in
  > 175."
- **Adjudicated problem:** the paragraph frames the succession as a dilemma faced **in 177**. Commodus was made
  Caesar on 12 October 166, aged five, alongside his brother Annius Verus — eleven years earlier, at an age
  when no assessment of his character was possible. That does not settle the debate (the constraint argument
  still has force by 177) but it relocates the decision to a point where the constraint had not yet formed. As
  written, the sentence presents a defence as the content of a dispute, and it is the defence that shields the
  subject.
- **Evidence and confidence:** multiple independent sources per the critic's research log. **High on the 166
  date; medium on weighting**, since the historiographical debate is genuinely live.
- **Minimum repair:** one clause — the dynastic path was set in 166, when Commodus was five, and the 177
  elevation confirmed it. Keep the constraint argument; let the reader see the constraint was partly
  self-created. **~+15 words.**
- **Reader benefit:** this is the rare repair that sharpens the page's best critical sentence. "Applied none of
  that scrutiny to the one decision that outlived him" becomes materially stronger once the reader knows the
  decision was locked in when the subject was a small child.
- **At risk:** PROTECT-07. The section's refusal to resolve and the sickroom close must survive untouched.
- **Acceptance test:** the section states when Commodus was first made Caesar, and no sentence implies the
  succession question first arose in 177.

### P1-09 — "Built no school" is imprecise in the sentence that licenses the thesis

- **Origin:** SUBJECT-C2 (subject). Not in the packet.
- **Location:** intro.
  > "Marcus Aurelius taught nobody, built no school, published no doctrine, and addressed his notebook to a
  > single reader."
- **Adjudicated problem:** **I verified this independently.** Marcus endowed four chairs of philosophy at
  Athens in 176 — Platonic, Peripatetic, Stoic and Epicurean — including for schools he did not belong to. The
  sentence is defensible in its idiomatic sense (he founded no doctrine of his own) but it erases the one
  public act by which he supported philosophy for anyone but himself, and it sits in the sentence that rules
  hypocrisy out and licenses the whole argument. An informed fan who knows the Athens endowment snags on it.
- **Evidence and confidence:** verified via web search 2026-08-27 (multiple sources, incl. the Internet
  Encyclopedia of Philosophy entry on Marcus Aurelius). **High on the fact; medium on materiality** — the
  article's actual argument survives intact, which is why this is P1.
- **Minimum repair:** "built no school **of his own**." **+3 words.** The subject reviewer's richer form
  ("founded chairs for other men's schools and none for a doctrine of his own") is a better sentence and costs
  ~10; take it only if budget allows.
- **Reader benefit:** the no-audience claim survives a reader who knows about the Athens endowment, and the
  richer form actively reinforces the point.
- **At risk:** **PROTECT — "The easy version of this story would be hypocrisy, and it is not available."** Two
  reviewers name this sentence as must-keep. Fix the sentence that follows; do not touch this one.
- **Acceptance test:** a reader who knows Marcus funded the Athens chairs does not find the intro contradicted.

### P1-10 — Say what the "hotter register" dispute is about, and adjudicate nothing

- **Origin:** UNFAM-C3 (unfamiliar), FAN-C5 (fan).
- **Location:** "Two Archives, One Emperor."
  > "The register runs hotter than that in places, and what it meant is contested scholarly ground. What
  > matters here is the temperament the discipline was applied to."
- **Adjudicated problem:** this is the only sentence on the page that withholds rather than explains, and the
  shift is audible. A newcomer cannot tell what is hotter, what the dispute is, or why they are being told a
  dispute exists if they are not to be told its subject — which reads as insinuation, a worse outcome than
  plain statement. Meanwhile the page banks the warmth twice as diagnostic evidence (here and in the wing
  paragraph) while declining to characterise it. The reticence itself is **correct** — the packet imposes a
  binding handling rule: no romantic or sexual claim in either direction.
- **Evidence and confidence:** packet disputes item 6 and the handling rule. **High on the reader effect; high
  that the repair is compatible with the rule.**
- **Minimum repair:** name the _subject_ of the dispute in one clause while adjudicating nothing — the early
  letters use intensely affectionate physical language, and scholars disagree about how to read such language
  between a Roman student and his tutor. Then keep the existing pivot verbatim; it is a good exit. **~+15
  words.**
- **Reader benefit:** converts a closed door into a named, unresolved question — the register the rest of the
  page already uses well on Lyon, the death location and Commodus.
- **At risk:** the handling rule. A reader must not be able to state which side the article takes.
- **Acceptance test:** a reader asked "what were scholars arguing about?" can answer in one sentence, and
  cannot state the article's position.

### P1-11 — Stop instructing the general reader to skip the counterarguments

- **Origin:** UNFAM-C4 (unfamiliar).
- **Location:** `<details class="enneagram-rabbit-hole">` summary — "For the Enneagram nerds. Skip if you're
  not deep into the system. The rest of the analysis stands on its own."
- **Adjudicated problem:** the counterarguments, the alternative types, the strongest objection to the thesis
  and the falsification test all live behind a label that tells a general reader to skip them. The unfamiliar
  reviewer followed the instruction and skipped exactly the material that would most have increased their
  confidence. The main body pressure-tests one alternative in one paragraph, so a reader who obeys the label
  sees the thesis defended once and never seriously attacked. After P1-01 and P1-02 land, the accordion will
  hold even more of the page's honesty.
- **Evidence and confidence:** structural, verifiable in the file. **High on the effect; medium on the ideal
  placement.**
- **Minimum repair:** **take the cheap version.** Amend the summary line so it no longer tells a general reader
  to skip counterarguments — e.g. "Wings, subtypes and the case against this read." **Word-neutral.** Do
  **not** move the counterargument block into the body: that costs words the page does not have and violates
  PROTECT-13, the one-paragraph cap on type theory in the narrative.
- **Reader benefit:** the page's most under-delivered asset — its intellectual honesty — stops being
  self-suppressed.
- **At risk:** PROTECT-13. The body's type-theory budget is one paragraph and must stay there.
- **Acceptance test:** the accordion's summary line does not instruct a general reader to skip the
  counterarguments.

---

## P2 — optional opportunities

Ranked. Given six words of headroom, expect **none** of these to be affordable until every P0 lands and the
funding cuts are taken. P2-01 is the only one I would argue pays for itself.

- **P2-01 — Junius Rusticus and the trial of Justin Martyr (FAN-I2).** The teacher who handed Marcus his copy
  of Epictetus served as urban prefect of Rome 162–168 and in that role presided over the trial that ended in
  Justin Martyr's execution, probably in 165. **I verified the identification is treated as settled in the
  standard reference works.** The article already covers both halves — how Marcus reached Stoicism, and
  Christians dying under his reign — and never notices that the same man sits at both ends. This is the
  strongest delight beat available for the informed fan: a fact known in pieces and never assembled. **~+25
  words. Guardrail: no causal claim about Marcus, and it must not be phrased so as to imply one — see RQ-03.**
  Do not place it inside the Lyon paragraph, which P0-05 is already reworking; put it at the Rusticus naming
  or as a standalone juxtaposition.
- **P2-02 — Med. 1.11 closes the braid (FAN-I3).** Twenty-five years of the warmest correspondence in Latin
  literature reduce, in the private ledger, to "From Fronto I learned to observe what envy, and duplicity, and
  hypocrisy are in a tyrant." That is the second archive's verdict on the first, in the edition the page
  already quotes, and it ends "Two Archives" on a payoff instead of a restatement. ~+25 words.
- **P2-03 — Med. 3.2 is about beauty in imperfection, not generic delight (ENN-C7).** Bread split at the
  surface, figs gaping, olives most beautiful near rottenness — for a Type 1 that is the growth edge itself,
  not a Seven-ish footnote. Add one clause in the holiday section noting that unearned rest is precisely what
  the pattern makes hardest. ~+25 words. **Note:** the second pass already rejected moving the figs/olives beat
  out of the Rabbit Hole; this is the cheaper reframe, not the move.
- **P2-04 — Name a real famous line beside the fake (FAN-C6).** The reception beat asserts an industry and
  evidences it only with a forgery. Med. 5.20 — the source text behind the best-selling modern Stoic book — is
  the obvious missing item. **Gated on RQ-02.**
- **P2-05 — The equestrian statue mistaken for Constantine (FAN-I4).** Two accidents of the same shape: the
  notebook survives because a Byzantine bishop owned a crumbling copy; the face survives because Christians
  mistook him for one of their own. Must be phrased as the conventional explanation, not documented fact.
  ~+30 words.
- **P2-06 — Thin the on-ramp and gloss the notation (UNFAM-C7, C8, and C1's gloss half).** Compress "Parthia
  invaded Armenia" to "war in the east"; gloss "1w2" in the TL;DR with three or four words of apposition; add
  ~8 words of gloss on what the Stoics actually hold at the Rusticus repair. **See Conflicts: do not take the
  Vindobona/Sirmium cut.** Gloss the notation rather than dropping it — "Marcus Aurelius 1w2" is a target
  keyword in frontmatter.
- **P2-07 — State the HA criterion, and name the Faustina exclusion in the body (CRITIC-C5).** HA 28.10 is
  dismissed as invention and HA 28.8, two sentences earlier, is accepted — with no criterion offered. Half a
  clause fixes it. One clause in the Faustina section noting the hostile late tradition exists and is not used
  here would move what the FAQ already says into the body, where a skeptic reads. ~+25 words.
- **P2-08 — Rebuild the instinct call on worry, and test one alternative (ENN-C2).** The house definition of
  the SP One is worry-led — "anger… converted into anxiety, foresight, and relentless self-improvement" — and
  the page owns abundant worry evidence it spends nowhere here. Also stops "warmth" doing double duty for both
  the wing and the subtype. Word-neutral if it replaces the food-only argument.
- **P2-09 — "How Rome Picked Him Twice" delivers one pick (FAN-C7).** Hadrian nicknamed the boy _Verissimus_.
  Either supply the first pick or change the heading. The heading is on unfamiliar's preserve list, so prefer
  supplying the pick — but it costs ~20 words. Low priority.
- **P2-10 — One sentence on Long's Victorian English (FAN-C4).** The English most readers know is Hays's; Long's
  "thou/thy/wroth" renders private camp notes as scripture, which is the marble-bust register the page is
  dismantling. **Accept only the one-sentence acknowledgment; reject the inline-modern-gloss variant** (word
  cost plus a second unverified translation on a page whose whole discipline is edition-of-record citation).

---

## Research required before deciding

- **RQ-01 — Is the imperial rescript at Eusebius _EH_ 5.1.47 regarded by mainstream Roman historians as
  authentic and as evidence of Marcus's personal decision, or as a formulaic governor's-inquiry response?**
  _Why it matters:_ it determines how much weight the P0-05 paragraph should give the rescript relative to its
  counterweights. _Best sources:_ Birley, _Marcus Aurelius: A Biography_, on the Christians; the standard
  commentary on _EH_ 5.1; Robertson's survey read for what it does **not** claim (packet S-14, explicit
  advocacy — locate arguments with it, never settle with it). **Does not block P0-05.** The minimum repair
  reports what the letter says and lists the counterweights without adjudicating, which the packet fully
  supports. Resolve RQ-01 only if a later pass wants to weight the paragraph.
- **RQ-02 — Does George Long's Med. 5.20 carry the "obstacle becomes the way" sense, or does the famous
  phrasing belong only to modern translators?** _Why it matters:_ it gates P2-04 entirely. If Long renders it
  flatly, the repair must gloss the modern wording or name the industry without quoting — and quoting Long's
  5.20 from memory would be exactly the error the page condemns. _Best source:_ the Standard Ebooks Long text
  the page already uses (packet S-03), section 5.20, read whole.
- **RQ-03 — Is there any evidence that Marcus knew what Rusticus did to Justin?** _Why it matters:_ it
  determines whether P2-01 can be more than a juxtaposition. The honest answer is probably "no evidence," in
  which case the beat must be written as a bare juxtaposition with the causal question explicitly left open.
  If any source connects them, it becomes a much larger beat. _Best sources:_ the _Acts of Justin_ recensions;
  Robertson, "Did Marcus Aurelius Persecute the Christians?" (with its advocacy caveat). **Do not write P2-01
  before answering this.**

Deliberately **not** classified research-required: the pre-161 child count (P0-09 has a safe non-numeric form
the packet supports), and whether any secondary source repeats the 175 misdating of "philosophical old woman"
(CRITIC-Q1 — interesting, but the P0-01 repair works either way).

---

## Conflicts and editorial tradeoffs

**1. The word ceiling versus everything else.** I measured the draft with `scripts/blog-lint.sh`:
**4,494 body words against a 4,500 ceiling.** The P0 set is roughly +85 gross. This is the governing tradeoff
and it is why the brief carries a word ledger. Named funding cuts, in order of safety:

| Cut                                                                                         | Source                          | Words      |
| ------------------------------------------------------------------------------------------- | ------------------------------- | ---------- |
| Ariston re-narration in the diagnosis ("Watch the sequence in it… He reads a philosopher…") | ENN-R1 + UNFAM-C6, both want it | −60        |
| Stress-arrow re-quote of the same Ariston fragment → a reference                            | UNFAM-C6                        | −20        |
| "never revised" clause at the closing                                                       | P0-03 replaces it               | −8         |
| "cleanly" + FAQ 2 rewording                                                                 | P0-07                           | −10        |
| Corpus counts, plague hedge, PolitiFact absolute                                            | P1-04                           | −8         |
| **Available**                                                                               |                                 | **≈ −106** |

That funds the P0 set (+85) with ~21 words spare — enough for one of P1-06/P1-08/P1-09, not for P1-01 and
P1-02 together. **Decision: P1-01 and P1-02 are worth an explicit ceiling exception** (`BLOG_LINT_WORD_CEILING`
raised for the run, with the reason recorded in-file), because they are the three-perspective items and
because together they are the page's answer to its own strongest objection. That is DJ's call to make, not the
editor's — flag it rather than silently exceeding.

**2. "Thirty-three years" — future preserve #3 versus fan/unfamiliar arithmetic.** Future lists the sentence as
must-survive because it depends on nothing after 1920. Fan and unfamiliar both show the number contradicts the
page's own timeline. **Resolved:** the durability argument is about the sentence's _form_, not its digit.
"More than thirty years, two languages, two readers, one report" satisfies future completely and fixes the
arithmetic. Resolve the age toward 54 (the closing line and the timeline), not 55 (the heading) — unfamiliar
preserve #11 is explicit.

**3. "The marking continues in an empty room" — unfamiliar preserve #3 versus ENN-R1.** Unfamiliar calls it the
page's only jargon-free definition of the type and says the page's accessibility depends on it. Enneagram calls
it a clincher that types the school. **Resolved:** both are right about different jobs. The sentence stays as
the _definition_; what changes is that it stops being what "settles it." The discriminator that settles it
becomes the credit-column asymmetry (P0-06). No accessibility is lost and the Stoicism-literate objection is
answered.

**4. Vindobona/Sirmium — unfamiliar's on-ramp cut versus future preserve #1.** Unfamiliar wants three proper
nouns cut to reduce newcomer load. Future calls that exact sentence "the model sentence for the whole corpus"
because it cannot be falsified. **Resolved in future's favour.** Keep the death-location sentence verbatim; it
is also the standard P0-05 is held to. Take the on-ramp relief from Parthia/Armenia instead (P2-06).

**5. Warmth is being spent twice.** ENN-C2 notes the same datum funds both the 1w2 wing and the SP subtype.
P0-08 removes warmth from the wing argument, which is the correct order of operations — do P0-08 before P2-08,
or the subtype paragraph will inherit an argument that has just been vacated.

**6. P1-06 versus P1-01.** P1-01 promotes Fronto's outside testimony to load-bearing status; P1-06 restores the
frame that softens it. These are compatible — Fronto is still describing a real temper, offered as teasing
intimacy. But the editor must land them together, or P1-01 will be resting on a quote P1-06 has just qualified.

**7. Historia Augusta usage.** P1-01's optional HA 2.6 addition, P0-04's HA 21.5 clause, and P0-01's HA
handling all draw on a source the page correctly flags as unreliable. CRITIC-C5 (now P2-07) asks for a stated
criterion. If the editor takes the HA 2.6 addition, P2-07 rises from optional to advisable — three new HA
citations without a stated rule sharpens the movable-standard charge.

---

## Rejected feedback

- **UNFAM-P1 — "The Loeb Classical Library edition is cited twice inside the first 120 words."** Rejected. The
  reviewer records it as taste and notes the tension themselves. Inline edition-of-record attribution is a
  pipeline requirement (the second pass took the page from 3 vague / 3 untagged to 6 inline / 0 vague), and it
  is PROTECT-08. Cutting it is the exact wrong way to find words.
- **UNFAM-P2 — "Seed the PolitiFact fake earlier."** Deferred, not accepted. The reviewer records it as a
  preference and says the ending works. There is no budget, and moving the reception beat forward would
  weaken the closing section, which four perspectives protect.
- **UNFAM-P3 — "The one-line paragraph drop fires about once per section."** Rejected as preference. The second
  pass already merged two of them. Further reduction trades a working house rhythm for nothing measurable.
- **FAN-C4's inline-modern-gloss variant.** Rejected; the one-sentence acknowledgment survives as P2-10. Adding
  a second, unverified translation to a page whose entire source discipline is edition-of-record citation
  buys a reader comfort at the cost of the thing that makes the page checkable forever.
- **SUBJECT-C9's supporting clause "the same exercise did not make Epictetus or Seneca write like this."**
  Rejected inside an otherwise accepted item (P1-01). It is unverified and contestable — Seneca's letters are
  saturated with self-examination. The genre paragraph is accepted; this specific evidentiary claim is not.
- **UNFAM-C4's stronger form — move the counterargument block into the body.** Rejected in favour of the cheap
  version (P1-11). It costs words the page does not have and breaches PROTECT-13.
- **UNFAM-C8's "drop the notation from the TL;DR" option.** Rejected in favour of glossing (P2-06). "Marcus
  Aurelius 1w2" is a declared target keyword; dropping it from the TL;DR while keeping it in `keywords`
  creates a mismatch the FAQ then has to carry alone.
- **UNFAM-C7's Vindobona/Sirmium cut.** Rejected — see Conflicts item 4.
- **Fan requests for praise, critic requests for condemnation, subject-proxy demands for approval,
  unfamiliar demands for full biography, Enneagram demands for more jargon:** none present. This jury was
  unusually disciplined about staying in lane — the enneagram reviewer actively protects the no-jargon rule,
  the subject reviewer flags the Lyon soft-pedal _against_ the subject's short-term interest, and the critic
  explicitly declines to ask for the Faustina rumours to be admitted. Recorded because the absence is notable,
  not to fill the section.

---

## Protected hits

- **PROTECT-01 — "That still made him hard to be around, and Fronto was right to push. Rome spent nineteen
  years reading the ledger as arrogance."** Named by critic (#1, "if one sentence survives revision, this
  one"), subject, unfamiliar (#4) and enneagram (#3). **The most important protected hit on the page.** It
  must stay adjacent to the debt-ledger paragraph — separating them turns an explanation into an excuse. This
  is what keeps the empathy turn from becoming motive laundering.
- **PROTECT-02 — The Alsium cold open in full, including Fronto's polecat sentence,** and **"His own teacher
  could not talk him into a beach."** All five content perspectives name it. It is the only zero-prerequisite
  entry point on the page and it does the thesis work before the thesis is stated.
- **PROTECT-03 — The Book 1 debt-ledger explanation of the beach:** "A man who believes every good thing in him
  is borrowed experiences rest as spending money he did not earn, while the lenders are dead and cannot be
  repaid." Fan calls this the article's actual contribution and the reason it is worth publishing. P0-06 also
  draws on Book 1; it must not cannibalise this passage.
- **PROTECT-04 — "His worry is not that something bad will happen to him. It is that he may not deserve his own
  teacher."** The only motivation-level discriminator on the page. **P0-07 exists to protect this sentence** —
  it must survive verbatim and become the load-bearing form of the Six test.
- **PROTECT-05 — "Nobody writes a numbered protocol for a problem they do not have."** Fan, unfamiliar and
  enneagram all name it. Verified exactly against Med. 11.18. P1-02 adds to the Rabbit Hole, not here.
- **PROTECT-06 — The yard-sale narrative unit:** "He held a yard sale instead," the two months, the specific
  inventory, the refund offer, and the Book 6 "not made into a Caesar" turn. P1-05 edits the framing around it;
  the narrative itself is untouchable.
- **PROTECT-07 — The Commodus section's refusal to resolve,** the rejection of the HA's retrospective prophecy,
  and the sickroom close (admitted only Commodus, then sent him out). Named by critic, subject and unfamiliar.
  P1-08 strengthens the indictment; nothing may weaken the ambivalence.
- **PROTECT-08 — Edition-of-record attribution.** "In George Long's 1862 translation," "printed at page 217 of
  the 1919 Loeb Classical Library edition," "Loeb Classical Library vol. 1, 1919." Future preserve #4 warns
  these are exactly what a later editor tightening prose will cut as clutter. **Given that this revision is
  word-starved, this is the single highest-risk protected hit in the brief.** They are the opposite of clutter:
  they are why every quotation on this page is independently checkable forever.
- **PROTECT-09 — The refusal to carry the Faustina allegations, and the FAQ sentence that states it.** Critic
  (#8), subject and fan all name it. P2-07 asks for one clause acknowledging the excluded tradition exists —
  **it does not ask for the rumours to be admitted, and must not be read that way.**
- **PROTECT-10 — Unresolved questions reported as unresolved:** "Ancient sources disagree about whether it was
  at Vindobona… and the dispute has never been settled" (future preserve #1, the corpus's model sentence) and
  "It does not resolve, and it should not be smoothed over" (future preserve #2). P0-05 must keep the second
  verbatim as its closing stance.
- **PROTECT-11 — "A Five builds. This rehearses."** and the concession that precedes it ("Meditations does
  carry real cosmological argument, on flux, on the view from above, on the whole and the part"). Critic (#6),
  enneagram (#4) and fan (H7). P1-04's quantifier edit repairs the premise around the line without touching it.
- **PROTECT-12 — The non-corrector counterargument** — "he held unlimited power to correct everyone in the
  empire and pointed the standard almost entirely at himself… That narrows the type instead of breaking it."
  Critic (#7), subject and fan all name it, and fan is explicit: **do not soften it back into wing evidence.**
  Directly at risk from P0-08.
- **PROTECT-13 — The one-paragraph cap on type theory in the narrative body** (enneagram #6, and the draft's own
  DISTRIBUTION LEDGER). Every repair in this brief must be paid for out of the Rabbit Hole or existing
  repetition, never by seeding type language into the narrative. At risk from P1-11 and P0-06.
- **PROTECT-14 — "the standard measures whether you are good at the root, and the marking continues in an empty
  room."** Unfamiliar's H3: the page's only jargon-free operational definition of Type 1, and the moment the
  newcomer stops fearing a taxonomy lesson. It survives P0-06 as the _definition_; only its status as the
  clincher changes.

Also on the preserve lists and not to be lost: "Everything you can buy at an airport with his face on it
descends from that accident"; "The most reproduced philosophy book in the world has a war for a return address"
(subject to P1-04's superlative softening, which keeps the sentence's rhythm); the Epictetus kiss-your-child
line and "He did not have to imagine that"; "The easy version of this story would be hypocrisy, and it is not
available"; and the closing paragraph, "He was fifty-four, and he had been at it since he was twenty-five, and
he was still marking the same paper."

---

## Revision brief

Ordered and bounded. Work top-down and stop when the budget is gone, except that steps 1–9 are mandatory.

**Before anything: take the cuts.** Do not add a word until the ledger in Conflicts item 1 is banked
(≈ −106 words). The two Ariston repetitions are the main source and two perspectives independently want
them gone.

**Step 1 — P0 repairs (mandatory, ~+85 gross).**

1. **P0-09** — "four of them" → "most of them." _(0 words. Do it first; it is free.)_
2. **P0-07** — delete "cleanly"; fix FAQ 2's "lavish praise." _(−10)_
3. **P0-02** — name Junius Rusticus at the Med. 1.7 quotation. _(+3)_
4. **P0-08** — rebuild the wing paragraph on direction-of-correction; hedge it; do not import PROTECT-12.
   _(word-neutral)_
5. **P0-06** — replace the clincher with the credit-column asymmetry, funded by the Ariston re-narration cut.
   Keep PROTECT-14 as the definition. _(word-neutral)_
6. **P0-01** — split the Cassius quotations; take the "takes no thought for the state" swap; update the
   TESTIMONY LEDGER and the TL;DR bullet; use "Avidius Cassius" in full everywhere. _(≈0)_
7. **P0-03** — carry 8.1's frame and turn at the closing only; restore 5.9's "be content" clause or drop the
   gloss; "Book 8 opens" → "Book 8 turns"; "everyone" → "others." _(+15 / −8)_
8. **P0-04** — carry HA 21.5's games clause; demote the inference to a reading; hedge the TL;DR bullet. _(+20)_
9. **P0-05** — rewrite the Lyon source description; carry 5.1.47; carry the counterweights; keep "It does not
   resolve, and it should not be smoothed over" verbatim. _(+35)_

**Step 2 — safely resolvable research.** None of RQ-01/02/03 blocks Step 1. **Do not attempt P2-01 or P2-04
in this pass** — RQ-03 and RQ-02 gate them and both would be improvisation without answers. RQ-01 is a
refinement of P0-05, not a precondition.

**Step 3 — accepted P1, in this order.** Take them until the budget is exhausted.

10. **P1-04** — the word-negative precision cluster. _(−5, so take it early)_
11. **P1-03** — reconcile the span everywhere. _(0)_
12. **P1-11** — reword the accordion summary. _(0)_
13. **P1-09** — "built no school of his own." _(+3)_
14. **P1-06** — restore Fronto's "Time was" frame. _(+4)_
15. **P1-07** — name the Ariston occasion; let Dio carry the austerity. _(+12)_
16. **P1-05** — soften "the principle behind it"; add Dio's corroboration. _(+15)_
17. **P1-08** — Commodus made Caesar in 166, aged five. _(+15)_
18. **P1-10** — say what the "hotter register" dispute is about. _(+15)_
19. **P1-01 and P1-02** — the genre objection, a falsification clause that can fail, and Med. 11.18's
    self-reproach line. **~+95 together.** These are the three-perspective items and the page's answer to its
    own strongest objection. They will not fit under 4,500. **Escalate to DJ for a ceiling exception rather
    than shipping without them or silently exceeding.** If the answer is no, take P1-02 alone (~+40, the
    Rabbit Hole is the cheapest place to spend) and log P1-01 to the backlog with this synthesis as the
    reference.

**Step 4 — highest-value P2, only if it pays for itself.** **P2-01** (Rusticus → Justin Martyr) is the one
worth arguing for: ~25 words for the page's best informed-fan payoff. It is gated on RQ-03 and carries a
hard no-causal-claim guardrail. Everything else in P2 waits for the next refresh. Also move the Ryan Holiday
cross-link to-do out of the in-file REVIEWER NOTES comment and into
`docs/content-analysis/entity-gaps/` or the backlog queue (FUTURE-C2), so it gets done when Holiday ships
rather than when someone rereads a comment.

**Step 5 — protected-hit regression checks.** Before declaring done, confirm each of these by grep or eye:

- PROTECT-01 still sits immediately after the debt-ledger paragraph.
- PROTECT-04 survives verbatim and is now the load-bearing form of the Six test.
- PROTECT-08 — every edition-of-record attribution is still present. **Check this one twice**; it is the
  likeliest casualty of a word-starved pass.
- PROTECT-10 — the Vindobona/Sirmium sentence and "It does not resolve, and it should not be smoothed over"
  are both verbatim.
- PROTECT-12 — the non-corrector concession is still in Counterarguments and has **not** migrated into the
  wing paragraph.
- PROTECT-13 — `grep` confirms type-theory paragraphs outside the diagnosis section and Rabbit Hole is still
  1, and update the DISTRIBUTION LEDGER if it moves.
- PROTECT-14 — the "empty room" definition survives even though it no longer settles the argument.
- PROTECT-02, 03, 05, 06, 07, 09, 11 — spot-check each passage is intact.
- Re-run `bash scripts/blog-lint.sh` and `scripts/same-type-similarity.mjs Marcus-Aurelius --n 8`. The
  similarity scan was CLEAR at 0.040 against a 0.040 threshold — a thin margin, and P0-06/P0-08 introduce new
  Type 1 vocabulary into the diagnosis and wing paragraphs. Re-check it. Per the known false-positive pattern,
  a `shared_phrases` value that is only `"marcus marcus"` is the mandated H3 heading, not a Gate 6 blocker.
- Update the TESTIMONY LEDGER (item 5), the HEADING MIX LEDGER if any H2 changes, and the FORMULA FINGERPRINT
  LEDGER's same-type-similarity line with the re-run result.

---

_Sources consulted for adjudication (3 of 3 permitted, all logged in the items they settled):_
[Epictetus, Discourses 3.10 (Perseus)](http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0236%3Atext%3Ddisc%3Abook%3D3%3Achapter%3D10) — P0-06;
[Internet Encyclopedia of Philosophy, "Marcus Aurelius"](https://iep.utm.edu/marcus-aurelius/) — P1-09;
[Wikipedia, "Junius Rusticus"](https://en.wikipedia.org/wiki/Junius_Rusticus) — P2-01 / RQ-03.
Repo files verified directly: `src/blog/enneagram/enneagram-type-1.md` (:138, :140), `src/lib/data/corpus-stats.json`, `scripts/blog-lint.sh`.
