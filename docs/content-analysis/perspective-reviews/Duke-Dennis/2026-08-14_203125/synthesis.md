---
artifact: perspective-synthesis
schema_version: 1
subject: Duke-Dennis
draft_sha256: d5bce426b94be999eaf53dde0ccba793f0041d9f946910448938ed294749ae93
synthesis_status: complete
delight_target: fan
p0_open: 6
p1_accepted: 16
research_required: 4
protected_hits: 14
requires_revision: true
synthesized_at: 2026-08-15T01:30:35Z
path: docs/content-analysis/perspective-reviews/Duke-Dennis/2026-08-14_203125/synthesis.md
---

## Executive verdict

All six evaluators returned `trust: strained`, `value: high`, `delight: clear_hit`. That is a coherent
verdict, not a split one: the piece's insight and its fairness architecture are working, and its
evidentiary discipline breaks in a small number of specific, locatable places.

I re-read every cited passage against the frozen snapshot before accepting anything. The pattern that
emerges is narrower than the raw finding count suggests. Four of the six mandatory repairs are the same
failure mode — **a claim rendered one notch stronger than the source that carries it**:

- Speedy's quote is trimmed at the exact clause where he names two exceptions (fan, subject, critic, enneagram)
- "Duke declines it" is contradicted on tape by the same interview quoted twelve times (critic, enneagram)
- Two quotes are attributed to one outlet that carries only one of them (subject, critic, future)
- The San Antonio paragraph reports a resolved matter as open and omits a live suit that names him (critic, future)

The other two are the piece's two constructed passages: one invented interior monologue that imputes
status resentment toward six named living friends (subject, unfamiliar, fan, critic), and one closing
image that assumes an aunt is alive and askable when the public record contains a reason to doubt it
(subject, future, packet UNRES-01).

None of this touches the type call. The Enneagram evaluator's verdict is that the Type 8 evidence is
**better than the draft's own presentation of it**, and I agree after checking the transcript citations
independently. Nothing in this synthesis asks for a retype, a softer type, or more system vocabulary.

The one durability finding I want named separately, because it will reproduce on the next subject:
FUTURE-C7 established that the pipeline verified the pending civil suit and used that knowledge only to
_delete_ a sentence, never to inform the reader. Current-status facts entered the process and exited as
subtraction. That is a process defect, and it is why P0-01 exists.

Word budget is the binding constraint. Body sits at ~4,494 against a 4,500 ceiling. Six of the sixteen
accepted P1s are net-zero or negative; the rest must be paid for. The Revision brief names the payers.

## P0 — mandatory red-flag repairs

### P0-01 — The San Antonio paragraph reports a closed criminal matter as open and omits the live civil action that names him

- **Originating:** CRITIC-B1 (critic, blocker), FUTURE-R1 + FUTURE-R2 (future, blockers), absorbs CRITIC-B2 (critic, blocker)
- **Location:** line 245, "Why AMP will never add a seventh member," paragraph beginning "The next bill was his own."
- **Passage:** "San Antonio police arrested Duke at the Shops at Rivercenter on the night of August 2, 2025, after a hide-and-seek shoot ran past closing, and booked him the next day on criminal trespassing and evading arrest, per NBC News and Spectrum News. Kai was there and was not arrested. **No conviction has been reported.** Duke returned to stream on August 17, called it a misunderstanding..."
- **Adjudicated problem:** Three defects in one paragraph, and they compound. (a) "No conviction has been reported" is literally true and materially misleading: the misdemeanor charges were **dismissed after he completed a pretrial diversion program**, which is a better outcome for the subject than the sentence implies and leaves a real person under a cloud the record has lifted. (b) A civil suit filed in Texas state district court in June 2026 by security officer **Don White**, seeking over $1 million, names **Duke Dennis** among the defendants alongside Kai Cenat, AMP Entertainment, producer Henry Wolf, content manager Joshua Pujols, and **Lavoune Clarke** — and the alleged punch is attributed to Clarke, identified as AMP security, **not to Duke**. (c) The section's own architecture ("The bills come due in public… The next bill was his own") promises a full ledger and delivers a partial one, then closes on the subject's unrebutted self-exculpation. A reader who searches "Duke Dennis lawsuit" finds all of this in thirty seconds.
- **Evidence and confidence:** Verified this pass by search — Yahoo (syndicating the San Antonio Express-News court-record reporting), Dexerto (2026-06-17, fetched directly by the critic), Hoodline, The Express Tribune, win.gg. The evidence packet does **not** contain the suit, so this is new material relative to the shared floor; the draft's own editor-pass notes independently confirm the pipeline already knew of "a pending civil suit naming AMP." Confidence **high** that the suit exists and names him; confidence **high** on the diversion dismissal (four independent outlets); confidence **medium** on exact filing date, cause number and current posture — hence RQ-01 and RQ-02.
- **Minimum repair:** Replace "No conviction has been reported" with the disposition, dated. Add **one** allegations-only sentence: a security officer's civil suit arising from the same night names Duke among several defendants, the alleged assault is attributed to a member of AMP's security team rather than to Duke, and the matter was pending as of the stated date. This single sentence also supplies the counter-pressure CRITIC-B2 asked for — the mall's account differs from "a misunderstanding" — which is why B2 is folded here rather than given its own repair. Do **not** narrate the punch as fact, do not adjudicate, do not import Clarke's separate felony trial into Duke's paragraph. **If RQ-01/RQ-02 cannot be resolved against a primary or top-tier record before publish, the fallback is mandatory, not optional: stamp the existing sentence "As of August 2026, no conviction has been reported."** A bare unstamped legal status must not ship.
- **Expected reader benefit:** The ledger becomes true. The reader who arrives from the lawsuit coverage finds nothing the page failed to tell them, and the subject stops being left under a cloud the record already lifted.
- **Protected hit / tradeoff at risk:** SUBJ preserve #5 protects the paragraph's **charges-only construction** and explicitly warns against narrativizing it. This repair must stay in that register: facts, dates, named outlets, allegations marked as allegations. Also at risk is the section's balance — it will now carry three legal beats, which is why CRITIC-C1 (Union Square asymmetry) is deferred rather than accepted.
- **Acceptance test:** Grep the section for any legal-status assertion with no year attached; count must be zero. Remove Duke's two quotes and the paragraph's factual account still stands unchanged. No sentence attributes the alleged assault to Duke Dennis.

### P0-02 — The source card elides the two exceptions Speedy names on tape, and the body overclaims on the same evidence

- **Originating:** FAN-R1 (fan, blocker), SUBJ-C6 (subject), CRITIC-C4 (critic), ENN-C5 (enneagram)
- **Location:** the `<div class="source-card">` in "What stress does to Duke Dennis" (line 299); dependent claims at line 297 ("He gave it no interview a journalist could book"), line 191 ("Seven years of fame without a sit-down interview"), FAQ line 65, Rabbit Hole line 344.
- **Passage:** "Speedy Morman, who researched the episode: 'You don't have many interviews out there**...** sit-down interviews, I couldn't really find anything like that.'"
- **Adjudicated problem:** Both fragments are verbatim Speedy, so this is elision rather than fabrication — but the ellipsis sits exactly where Speedy hedges ("maybe one of your first **big** interviews") and names **two** exceptions: a podcast appearance and Duke's Complex _Sneaker Shopping_ episode, published 2023-05-29, nine months inside the claimed seven-year gap, **from the same publisher the draft is quoting**. The qualifier exists only inside the collapsed Rabbit Hole. This is the piece's most-repeated structural claim and its primary anti-Type-3 evidence, and the proof card looks like the counterevidence was edited out. Four evaluators reached this independently; the fan rates it the one thing a knowledgeable reader is uniquely positioned to catch.
- **Evidence and confidence:** Repo transcript `youtube-transcripts/duke-dennis-360-with-speedy-2024.md`, verified by grep by three separate evaluators; packet CLM-08 records one exception, the tape carries two plus a hedge. Complex's own episode page dates _Sneaker Shopping_ to 2023-05-29. Confidence **high**.
- **Minimum repair:** Extend the source-card quote through "you've done sneaker shopping on complex but that's it," and name _Sneaker Shopping_ once in reader-visible body prose. Scope the body sentence at line 297 to "no **sit-down** interview" (net −5 words).
- **Expected reader benefit:** The claim survives and gets stronger, because the writer is visibly the person who knows about the exceptions rather than the person who missed them.
- **Protected hit / tradeoff at risk:** "What he withheld was never the story. It was the microphone." (FAN preserve #3) sits two sentences later and must not be lost while editing around it — it survives and improves under this repair. Do not weaken the diagnosis-section instance at line 191; it is load-bearing anti-3 evidence (see the UNFAM-C9 ruling under Conflicts).
- **Acceptance test:** A reader who has seen Duke's Complex _Sneaker Shopping_ episode finds it acknowledged in reader-visible body text, outside the collapsed accordion, before the end of the stress section. No quotation anywhere in the piece uses an ellipsis that removes a named counterexample to the sentence it supports.

### P0-03 — The counterarguments section cuts the single strongest piece of evidence against its own conclusion

- **Originating:** ENN-B1 (enneagram, blocker), CRITIC-B3 (critic, blocker)
- **Location:** line 344, Rabbit Hole → "Counterarguments: Why Duke Dennis Might Not Be Type 8"
- **Passage:** "But **Threes metabolize attention as fuel, and Duke declines it**: finished videos demoted to his live channel for missing his bar, seven years without a sit-down interview…"
- **Adjudicated problem:** The unqualified negative "Duke declines it" is refuted on tape in the same interview the draft quotes twelve times. Asked what his favorite part of the internet is right now, Duke answers: "it's like compliments… like seeing like compliments about yourself… it's like refreshing to see like compliments and not seeing like trolls 24/7," then describes his audience shifting from 90% male to roughly 50/50. The evidence packet independently rates this "the strongest single piece of pro-3 evidence in the corpus," and the draft's own SECOND PASS NOTES record that the beat was cut **for word budget**. A section whose entire job is to face the incumbent public typing (3w2 on Personality Database and mbtilounge) has removed the incumbent's best exhibit while asserting its opposite. This is the sentence a skeptical reader checks first, because it is the one doing the most work.
- **Evidence and confidence:** Direct grep of the repo transcript by two evaluators independently, plus the packet. Confidence **high** — falsifiable by anyone in one grep.
- **Minimum repair:** Concede the compliments line inside the counterarguments paragraph, then discriminate. The claim that survives the tape is not that he declines attention but that he declines **authored** attention — the sit-down, the format where someone else sets the questions. His own gloss does the work: what he calls refreshing is the _absence of trolls_ and a changed audience ratio, not being celebrated. Roughly 35 words; narrow the verb from "declines it."
- **Expected reader benefit:** Engaging the best pro-3 evidence and surviving it is worth more than never naming it. The discriminator gets sharper, not weaker.
- **Protected hit / tradeoff at risk:** The falsifier clause must remain **last** in the paragraph (PROTECT-05). The corpus-departure disclosure and the 9w8 hearing must both survive the insertion. Do not let this repair push the four-year-stay concession out of the paragraph.
- **Acceptance test:** A reader who watches the full _360 With Speedy_ episode cannot name a pro-Type-3 statement from it that the page has neither used nor explicitly accounted for.

### P0-04 — The second inner-thought beat imputes unevidenced status resentment toward six named living friends

- **Originating:** SUBJ-R2 (subject, blocker), UNFAM-B1 (unfamiliar, blocker), FAN-C6 (fan), CRITIC-C6 (critic, partial)
- **Location:** line 315, "Why Duke Dennis bought his mother a house first," final line
- **Passage:** `<p class="inner-thought">Everybody in this house got bigger than me. I'm still the one who says who comes through the door.</p>`
- **Adjudicated problem:** This is the only place in the draft that tells the reader what the subject privately feels rather than showing what he did, and the feeling it asserts is contradicted by the article's own evidence two paragraphs earlier — his unmixed, ego-free praise of Kai ("He's bigger than everybody and the group itself… Kai doesn't have an ego"). It is also **false on its literal terms**: per packet S-01/S-11 he is at 3.6M YouTube / 3.3M Twitch, which is not smaller than every AMP member; the claim holds for Kai alone. And it plants status anxiety in a man the Rabbit Hole spends a paragraph arguing is not organized around status. Three evaluators reached it independently; the critic reached the same passage from a different direction (the authority upgrade). The subject-fairness evaluator's standard is the right one: every other interior move in the piece is built from something he narrated on tape.
- **Evidence and confidence:** Draft-internal contradiction, verifiable; packet UNRES-02 records that **zero** third-party testimony about his interior life exists, so nothing corroborates it. The unfamiliar evaluator verified the rendering at `src/scss/blog.scss:592` — an italic panel with a thought-bubble icon and **no text label**, so a newcomer cannot distinguish it from reporting. Confidence **high**.
- **Minimum repair:** Cut the beat. The prose sentence immediately above already carries the idea on verified facts: "He watched a younger man in that house become the biggest streamer alive, and he is still the one who says out loud that nobody else gets in." If a present-located interior beat is still wanted, rebuild it from the role rather than the feeling — the door policy alone, with no comparison. Do **not** add a disclaimer sentence; that fixes the epistemics and kills the prose.
- **Expected reader benefit:** Removes the piece's only imputed private emotion about a living person and six named third parties, at zero factual cost. Frees ~20 words toward the ceiling.
- **Protected hit / tradeoff at risk:** The **reception-night** interior beat (PROTECT-10) must survive — it passes the same test this one fails, because every element is on tape. This repair also reverses a change the 2026-08-14 fresh-eyes pass explicitly requested (a second interior beat located in the present); that request is superseded here, and the editor should not re-add one built from inference.
- **Acceptance test:** No first-person interior text asserts a comparison between his standing and his housemates'. Every interior beat in the draft maps to something he narrated on tape.

### P0-05 — The closing beat asserts that the aunt is alive and askable; a named outlet reports he grieved an aunt's death in July 2025

- **Originating:** SUBJ-R1 (subject, blocker), FUTURE-C5 (future), FAN-Q1 (fan), packet UNRES-01 (rated the highest-risk claim in the draft)
- **Location:** line 357, final paragraph of "The name he never asked about"
- **Passage:** "**Somewhere in South Carolina there's an aunt who knows exactly what 'Duke' means.** He has had three decades to ask. He hasn't, and **there's no sign he ever will.**"
- **Adjudicated problem:** Two defects stacked in the piece's most-remembered position. (a) The present-tense sentence asserts that asking remains available; on the 2025-08-17 return stream Duke told viewers his aunt died in July 2025 and that he attended the funeral and went straight back to streaming. If it is the same aunt, the article's final movement chides a bereaved man for not asking a question of someone buried thirteen months before publication. If it is a different aunt, the line still reads as tone-deaf to every viewer who watched that stream, and the piece shows no awareness that any aunt died. (b) "There's no sign he ever will" is a forward prediction about a living person's future behavior — the least durable sentence class there is — sitting last, and falsifiable by him simply answering the question on stream.
- **Evidence and confidence:** Vibe (Preezy Brown, 2025-08-18) via Yahoo syndication, in the packet as S-10 and independently re-confirmed by the subject evaluator. Confidence **high** that the death is real, publicly stated, and known to his audience; **high** that the draft cannot support the availability claim. **Unresolvable** whether it is the same woman (RQ-03) — which is precisely why the repair below is branch-safe and does not wait on it.
- **Minimum repair:** Keep the verified fact (an aunt named him; he never asked why) and delete the availability implication and the forecast. Cut the "Somewhere in South Carolina…" sentence and the "no sign he ever will" clause; the two sentences that follow already land the close. **Do not introduce the death** — nothing links it to the naming aunt, and adding it would manufacture the exact connection the draft is right to refuse.
- **Expected reader benefit:** The ending stops depending on an unverifiable fact about a private family member, survives both branches of the identity question, and keeps its best line.
- **Protected hit / tradeoff at risk:** This is the most delicate repair in the brief. **"A definition is just instructions for what to be. He'd rather keep the name the way she left it: a sound with no orders inside." must survive byte-identical** (PROTECT-11) — it is on the unfamiliar evaluator's preserve list and passes the swap test. The ending must still resolve the title and reframe the label inventory; if the trimmed version reads abrupt, pay for one connective clause from elsewhere rather than restoring the cut material.
- **Acceptance test:** The final paragraph contains no assertion or implication that the aunt is alive, reachable, or still askable, and no assertion about what the subject will or will not do in future. A reader who watched the 2025-08-17 stream can read the close without hitting a false note.

### P0-06 — A load-bearing quote is attributed to an outlet that does not appear to carry it

- **Originating:** SUBJ-C2 (subject), CRITIC-C9 (critic), FUTURE-Q6 (future), packet CLM-11b
- **Location:** line 245, "Why AMP will never add a seventh member"
- **Passage:** "'Jail isn't a place that I would wish on anybody,' he told viewers, **per Vibe**, and: '**I'm not the type of content creator that's going to like risk my freedom for the content.**'"
- **Adjudicated problem:** The construction attributes both sentences to Vibe. Per packet CLM-11b the Vibe/Yahoo text carries "Content ain't that deep for me…" and the jail line, **but not the freedom sentence**, which surfaces in search summaries and in a Hollywood Unlocked headline. This is the paragraph most likely to be quoted back at the subject, and the misattributed sentence is the **third link in the freedom-vocabulary chain** the entire type argument rests on. A wrongly attributed load-bearing quote is the cheapest possible way to lose an argument.
- **Evidence and confidence:** Packet CLM-11b performed the fetch; three evaluators flagged it independently and none could re-fetch Vibe directly (the original 307-redirects to a tollbit host). Confidence **medium-high** — there is a small chance the sentence is in the original and the syndicated copy trimmed it, which is what RQ-04 resolves.
- **Minimum repair:** Attribute the freedom sentence to the outlet that actually published it (try Hollywood Unlocked 2025-08-18, then HotNewHipHop / Bryson Paul 2025-08-18, which the draft's own notes already cite as independent corroboration). If RQ-04 comes back empty, drop the sentence and let the Vibe-verified jail line carry the beat — but attempt re-attribution first, because the freedom vocabulary is doing thesis work.
- **Expected reader benefit:** The one paragraph carrying legal material becomes fully checkable.
- **Protected hit / tradeoff at risk:** The freedom-vocabulary chain (2018 "it felt like I got out of jail" → 2024 "one of the most slept-on freedoms" → 2025 "risk my freedom for the content") is the strongest cross-year evidence in the piece. Dropping the third link costs the chain its most current instance; re-attribution keeps it whole.
- **Acceptance test:** Every quoted sentence in the arrest paragraph appears verbatim in the outlet named beside it, in a source someone can open.

## P1 — accepted high-value improvements

Ordered by value per word. Net word cost is stated for each; six are free or negative.

### P1-01 — The Dee / DeeBlock sentence is contradicted by its own cited source (net −8)

- **Originating:** FAN-C1 (fan, "highest priority"), SUBJ-C1 (subject), packet DISP-03
- **Location:** line 321 — "Readers reliably connect that name to DeeBlock… **No public source establishes the link**, and he has never addressed it."
- **Adjudicated problem:** Sportskeeda — the draft's own citation for this beat — reports the shirt bore the cousin's face **with the word "DeeBlock" written on it**. A public source therefore does place both names on one object. What is unestablished at Tier 1–3 is the narrower question of whether the _block was named for_ the cousin (Tier 4 only: Urban Dictionary, TikTok). Separately, "he has never addressed it" is an unverifiable negative about a living person's speech regarding a dead relative, softly contradicted by widely circulated clips titled around him explaining how his cousin died. And "Readers reliably connect that name" asserts a reader behavior as fact in order to license raising a connection the sentence then refuses to support. I am not promoting this to P0 because the fan evaluator, who owns the finding, explicitly declined to — read narrowly, "the link" means the naming question, and the caution is defensible even though the sentence is imprecise.
- **Minimum repair:** Two options, both acceptable. Precise version: state what the cited source states (the shirt carried both his cousin's likeness and "DeeBlock") and confine any "no public source establishes" language to the naming-of-the-block question. Subtractive version: delete the connective sentence entirely and let the beat stand on verified facts. The subtractive version is always safe and needs no further fetching; take it if a direct Sportskeeda fetch fails again (it has 405'd for every prior pass).
- **Expected reader benefit:** Converts a hedge that reads as ignorance into a precision that reads as care, on the most emotionally loaded fact in the record.
- **Protected hit at risk:** UNFAM-H5 preserves this exact sentence as a trust move ("they tell me the writer stops where the record stops"). See Conflicts. The neighboring "What became of Deo he has never said on record" (PROTECT-14) must not be touched — it is the correct version of the same device.
- **Acceptance test:** Every sentence in the paragraph traces to the cited report. No claim about what readers connect; no unqualified claim about what he has never addressed.

### P1-02 — "He paid it" asserts an individual act the record does not establish (net 0)

- **Originating:** CRITIC-C2 (critic), UNFAM-C4 (unfamiliar), packet UNRES-03
- **Location:** line 243 — "It took until May 2024, a public apology, and a restitution check before prosecutors dropped the case… **He paid it.**"
- **Adjudicated problem:** The reported restitution exceeding $57,000 is a **combined** figure across three defendants, and the only documented public apology is Cenat's, posted to Snapchat. No individual apology by Duke Dennis is documented in any source in the packet. With no owner attached and Duke as the paragraph's subject, an unfamiliar reader supplies him as the owner of both — producing precisely the attribution the packet records as undocumented. Exculpatory inference stated as fact is the failure mode this section otherwise avoids.
- **Minimum repair:** Make the collectivity visible inside the existing sentence — apology and restitution as the group's terms. Replace the bare "He paid it" with the sourced version or drop it.
- **Expected reader benefit:** Removes the one unearned exoneration in an otherwise careful legal passage, without softening accountability.
- **Protected hit at risk:** **"The arithmetic is his all the same: he was part of the draw that pulled that crowd into that square, and the crowd is the whole product."** (PROTECT-04 companion; CRITIC preserve #3) must survive verbatim — it is the model the San Antonio paragraph is being asked to copy in P0-01.
- **Acceptance test:** A reader asked "who apologized?" answers "the group / Cenat," and still answers "yes" to "was Duke accountable?" No sentence attributes an individual payment or apology to Duke without a source that names him.

### P1-03 — The 8w9 wing's lead example runs the other way on tape (net 0)

- **Originating:** ENN-C1 (enneagram), CRITIC-C5 (critic), incorporates ENN-I3
- **Location:** line 332, Rabbit Hole → "Duke Dennis's Wing: 8w9"
- **Adjudicated problem:** The draft uses the RDC defusal line ("we all on the same side anyway") to establish "long silence, one unmistakable conversation, file closed," and to rule out 8w7 because "an 8w7 would have kept the friction running." On the tape the defusal is immediately followed by sustained needling — "they suck at everything," "I don't see nothing they can beat us in nothing across the board," a Family Feud jab, a 40-point story — plus an explicit statement that the trash talk "will never cease." The quote is accurate; the characterization built on it is not. Two evaluators verified this by independent grep.
- **Minimum repair:** Use the better reading the tape actually supports: he refuses to let the banter be read as **real conflict** while cheerfully keeping the banter — territory defended, war declined. That is a sharper 8w9 discriminator than the one it replaces and costs no words. While in the paragraph, add ENN-I3's half-sentence marking the wing as the weaker call than the type — the subtype paragraph already does this correctly for the third instinct.
- **Expected reader benefit:** The wing stops being falsifiable by the same interview it cites, and the Rabbit Hole's certainty register matches its evidence.
- **Protected hit at risk:** The aura-farming discharge is the wing's second example and must stay (CRITIC preserve #7). Do not let the certainty marker leak upward into the type call, which is proportionately certain as written.
- **Acceptance test:** Every clause of the wing paragraph remains true when read against the full RDC passage, not the single sentence extracted from it.

### P1-04 — Promote the null hypothesis and the strongest objection out of the collapsed accordion (net +18)

- **Originating:** SUBJ-C3 (subject), CRITIC-C3 (critic)
- **Location:** line 297 (Germany claim in body) and line 191 (the Type 3 deferral sentence)
- **Adjudicated problem:** Everything that makes this piece intellectually honest is opt-in. `<details>` renders collapsed; most readers never open it. As shipped, the reader-visible article converts one lonely overseas posting into a lifelong psychological mechanism while the honest alternative — "a twenty-year-old with no friends, no car, and no language stays in his room for ordinary reasons" — sits behind a click. Same for the Type 3 case: the body dismisses and defers to a page that is closed by default.
- **Minimum repair:** Two small moves. (a) Move the null-hypothesis clause into the body beside the Germany claim — one sentence, no restructuring. (b) Rewrite the deferral sentence at line 191 so it **names** the strongest objection rather than promising a hearing (net 0).
- **Expected reader benefit:** The piece's best epistemic moves reach the readers who actually form an impression of him.
- **Protected hit at risk:** The Rabbit Hole must remain collapsed and the type mechanics quarantined (PROTECT-12 — the unfamiliar evaluator calls this the single best structural decision in the piece). This repair promotes two sentences; it does not open the accordion or move wings/subtypes/arrows into the body. Keep the DISTRIBUTION LEDGER at 1.
- **Acceptance test:** A reader who never opens the accordion can state the strongest objection to the Type 8 call and can state the ordinary explanation for the Germany isolation.

### P1-05 — Newcomer orientation package: scale, "rizz," the Enneagram, and the NBA 2K gloss (net +22)

- **Originating:** UNFAM-C1, UNFAM-C2, UNFAM-C3, UNFAM-C6 (unfamiliar). Bundled because they are one class of repair at one location cluster and share a budget.
- **Adjudicated problem:** The largest audience figure attached to Duke anywhere in the body is **100,000 subscribers, from 2018** — a 4,500-word profile that actively understates its subject to a stranger. "Rizz" is never defined despite carrying the meta title, and the draft gestures at the dictionary fact twice without stating it. The Enneagram is never introduced as a system, so a newcomer has no way to judge whether it is a serious framework. NBA 2K is used in the intro and glossed two sections later, which is backwards. The TL;DR that would have oriented them is inside a bare `<details>` and renders collapsed (verified: no `open` attribute, no CSS forcing it).
- **Minimum repair:** (a) One as-of-stamped clause in the intro's third paragraph carrying present-day scale — 3.6M main channel / 2.0M gaming channel / 3.3M Twitch are all verified in the packet (S-01, S-11, live yt-dlp 2026-08-15). (b) Replace "a dictionary word" with the actual fact: the 2023 Oxford word of the year, clipped from the middle of _charisma_ — which also converts the adjacent "shorthand for charisma itself" from assertion into visible wordplay. (c) One appositive at first use naming the Enneagram as a nine-type map of core motivation. (d) Move the existing three-word NBA 2K gloss to first use and delete it from section 3 (net zero).
- **Expected reader benefit:** Answers "why should I read 4,500 words about this man" in the first screen, where a stranger decides.
- **Protected hit at risk:** UNFAM-H2 protects the jargon-free Type 8 definition — the Enneagram appositive must not make that sentence more technical. The cold open (PROTECT-01) is upstream and untouched.
- **Acceptance test:** A reader who stops after the intro can state Duke's audience size within an order of magnitude, can define "rizz," and can say what kind of thing the Enneagram is. No proper noun in the body is used more than once before it is glossed.

### P1-06 — The FAQ compresses his rizz estimate into a range he never gave (net 0)

- **Originating:** SUBJ-C4 (subject)
- **Location:** frontmatter FAQ line 71 — "Duke estimated that **80 to 100 percent** of the men who approach him say something rizz-related."
- **Adjudicated problem:** On tape the figures are distinct: 80% for men generally, 100% on one Aspen trip (and 90% attached specifically to white fans). "80 to 100 percent" presents a base rate and a single anecdote as one elastic estimate. The body renders it correctly; the FAQ does not — and FAQ answers are reader-visible and search-snippet eligible, so this is the version most likely to be quoted.
- **Minimum repair:** Mirror the body: 80 percent generally, 100 percent on the Aspen trip.
- **Expected reader benefit:** His own numbers survive intact in the most-syndicated part of the page.
- **Protected hit at risk:** None. Do not add the 90%/white-fans figure here — the body's omission of it protects rather than harms him and is a separate editorial call.
- **Acceptance test:** No FAQ answer states a statistic in a form he did not state.

### P1-07 — One spelling for DeeBlock (net 0)

- **Originating:** SUBJ-C5 (subject), UNFAM-C7 (unfamiliar)
- **Location:** line 197 — "a neighborhood he calls **DeeBlock**" … three sentences later, "'**D-Block** is not a place that you want to stay forever.'"
- **Adjudicated problem:** Reads as two different places, and it undercuts the later Dee/DeeBlock beat, where the spelling relationship is the whole point the reader is invited to notice. The 2018 source is a garbled auto-transcript that renders it both "deep block" and "d-block," so the quote's spelling is a transcription artifact rather than his choice.
- **Minimum repair:** Standardize narration on **DeeBlock** and either bracket the term inside the quote or normalize it, given the underlying source is a machine transcript rather than a written statement. The two evaluators split on whether to touch quoted text; either resolution passes, and neither may present two spellings as two places.
- **Expected reader benefit:** His own place name is rendered the way he renders it, and the shirt beat keeps its force.
- **Protected hit at risk:** The draft's omission-marker discipline (PROTECT-09 family) — do not silently "clean up" any other quoted speech while here.
- **Acceptance test:** One spelling throughout the draft. A reader never has to decide whether DeeBlock and D-Block are the same place.

### P1-08 — The Speed callout has no outlet in text and no packet claim ID (net +6)

- **Originating:** FAN-C4 (fan)
- **Location:** line 251 — "Duke spent it on stream asking about the omission: 'Where is Speed, bruh? Why was Speed not one, two, three, four, or five?'"
- **Adjudicated problem:** The quote is accurate — the fan evaluator verified it against Sportskeeda's headline article ("Where is Speed bruh? Like why was Speed, not one, two, three, four, or five?") and a second outlet covering the same moment — but it is the **only major quote in the article with no outlet named in text** and it has no entry anywhere in the evidence packet. It carries weight in three places: the AMP section, the sp/so subtype argument, and the anti-Type-3 case. A downstream verification pass could strike an accurate, load-bearing, fan-beloved beat as unsourced.
- **Minimum repair:** Name the outlet and month in text, as the draft does everywhere else, and add the Sportskeeda URL to the `citations:` frontmatter list.
- **Expected reader benefit:** Closes the one attribution inconsistency in a piece where every other quote is dated and attributed.
- **Protected hit at risk:** The beat itself (FAN preserve #7) — this repair exists specifically to protect it from a later cut.
- **Acceptance test:** The Speed quote carries a named outlet and date in reader-visible text, and its URL appears in `citations:`.

### P1-09 — "Fame arrived in 2017, 2018, 2019" is refuted by the next paragraph (net 0)

- **Originating:** FAN-C3 (fan)
- **Location:** line 297 — "Fame arrived in 2017, 2018, 2019. He gave it no interview a journalist could book."
- **Adjudicated problem:** The draft supplies its own refutation one paragraph later: "The Army story time went up in February 2018, at 83,000 subscribers by his own count on tape." Eighty-three thousand subscribers is not a level of fame at which journalists are being turned away. The sentence converts an **absence of demand** into an **act of refusal** — exactly the inference the section needs and has not earned for those years.
- **Minimum repair:** Scope it to the era when press demand actually existed (the AMP/Kai era, 2020 onward), or reframe as the audience arriving years before the press did. Combines naturally with P0-02's scoping of the same sentence.
- **Expected reader benefit:** The withheld-microphone argument stops overclaiming, and its strongest version — he had a real platform and still gave no sit-downs — becomes checkable rather than assumed.
- **Protected hit at risk:** "What he withheld was never the story. It was the microphone." (PROTECT-08) is the payoff of this passage and must survive.
- **Acceptance test:** No sentence asserts press-level fame in a year the article elsewhere characterizes as sub-100K.

### P1-10 — Scope the AMP door claims: affiliate tier and "enforces" (net +14)

- **Originating:** FUTURE-C1 (future, "highest-priority concern"), CRITIC-C6 (critic)
- **Location:** H2 line 233; body line 239 "Six is the number Duke says is final"; FAQ line 80 "sealed in both directions"; FAQ line 65 "the no-additions rule **he enforces** for AMP"; TL;DR line 172
- **Adjudicated problem:** Two related overreaches. (a) Nothing here is false — the core six are intact and the quote is his — but AMP maintains a separate **affiliated-member** tier (Rayasianboy 2024, 2xRakai 2025, Tota Mc 2025). A reader who checks AMP's roster sees nine names against an article promising six across an H2, an FAQ, and a TL;DR bullet. A single promotion inside the review window converts this into a blocker that falsifies all three surfaces at once. (b) On tape the policy is an answer to a direct question, hedged ("I feel like if you move or add anybody…"); nothing shows he authored it, enforces it, or holds a veto. He is the member who **states** it. The draft's own history also shows the door opened twice after founding (Kai 2020, Chrisnxtdoor 2021), so the seal is a recent state rather than a standing trait.
- **Minimum repair:** One clause distinguishing full membership from the affiliate tier — the circle Duke seals is the six-man core, and AMP has since brought people into orbit without opening that door. Scope the FAQ's "sealed in both directions" to core membership and change "enforces" to "states." Leave the H2 alone; it targets a real query and Duke's rule is genuinely about membership.
- **Expected reader benefit:** This **strengthens** the observation rather than hedging it. A door policy with a porch is a sharper Eight reading than one without: he found a way to grow the operation without letting anyone through the door he guards.
- **Protected hit at risk:** The sealed-six TL;DR bullet is attributed to Duke's rule and should stay attributed. Do not weaken "Nobody else can join…" — that is his verbatim quote.
- **Acceptance test:** A reader who looks up AMP's roster and counts nine names finds the article already accounted for the gap. No sentence claims decision authority over AMP membership that a reader could not verify from a quote.

### P1-11 — Durability stamps: body age, "twice," and the unbounded interview status (net +6)

- **Originating:** FUTURE-C2, FUTURE-C3, FUTURE-C6 (future)
- **Locations:** line 311 "which **makes him 32**"; line 271 "Professor is the one he took, **twice**"; line 340 "the interview-free years **never did** [end]"
- **Adjudicated problem:** Three self-invalidating constructions in a draft that is otherwise unusually disciplined about tense. The body age is unstamped under the one H3 whose entire job is to answer that query, and it goes wrong on 2027-02-26 — while the FAQ version at line 74 is correctly stamped "32 as of August 2026," making this a straight internal inconsistency. "Twice" is a cardinal count of participation in an annual program whose faculty is announced ~2 months ahead; a 2027 session falsifies the piece's best ironic beat. And "the interview-free years never did [end]" is an unbounded present-tense claim about ongoing press behavior that erodes with every appearance, while the body elsewhere correctly bounds the same evidence as "2017 to 2024."
- **Minimum repair:** Stamp the body age to match the FAQ (three words). Make the count open-ended — "every time it has run," "again," "each session so far" — which preserves the irony, which is what the sentence is for. Bound the arrow claim to the 2017–2024 stretch, which is the actual argument (baseline, not arrow) and also resolves the tension the cohesion pass explicitly left for a human.
- **Expected reader benefit:** The page stops carrying three facts with a known expiry date.
- **Protected hit at risk:** Do not touch the _I Turned 32_ sentence — an upload title with a March 2026 date is permanently true and does the same work. Do not disturb "Professor is the one he took" — only the count changes.
- **Acceptance test:** No unstamped present-tense age in body, FAQ, or TL;DR. No cardinal count of recurring participation. No unbounded present-tense claim about his current press behavior.

### P1-12 — The stress link points at a page that describes the opposite behavior (net 0)

- **Originating:** ENN-C3 (enneagram)
- **Location:** line 297 — "he shrinks the perimeter to what he can hold alone. The pattern is laid out in [how each type falls apart under stress](/enneagram-corner/enneagram-types-in-stress)."
- **Adjudicated problem:** **Verified directly this pass.** `src/lib/data/enneagramStressLoops.ts` (type 8) gives the Eight's defense as "Become strong, confront, resist, and take control," with all three worked examples resolving to confrontation. It never describes withdrawal. The behavior the draft is describing is documented on a different internal page: `enneagram-connecting-lines.md` renders the 8→5 move as "**the sealed bunker: no explanation, no support, and no information given away**" — a near-verbatim match for both Germany and the interview-free years. This is the piece's one invitation into the system in reader-visible prose, and it opens onto the wrong room.
- **Minimum repair:** Change the target to `/enneagram-corner/enneagram-connecting-lines` and adjust the anchor text. A swap, not an addition, so it does not worsen the pre-existing internal-link WARN (7 against a 2–5 spec).
- **Expected reader benefit:** The reader who clicks to verify finds confirmation instead of contradiction.
- **Protected hit at risk:** None. Do not add a second link while here — the link count is already over spec.
- **Acceptance test:** Clicking every internal Enneagram link in the piece lands on a page that supports the specific claim it is attached to.

### P1-13 — Promote "on call 24/7" as the discriminating quote, and name Type 7 once (net +30)

- **Originating:** ENN-I1 and ENN-C2 (enneagram). Bundled because one quote resolves both.
- **Location:** diagnosis section (line 185, after the anti-authority triple) and the counterarguments paragraph (line 344)
- **Adjudicated problem:** The diagnosis rests on "I don't like being told what to do," repeated three ways. Repetition establishes salience, not type — the same sentence is available to a counterphobic Six, a constrained Seven, or a defiant Four, and the evidence packet makes exactly this objection. Meanwhile, on tape and entirely unused: "the Army is a regular 9 to 5 except like the working out in the mornings… **the being on call 24/7 is what makes the Army like unbearable for me.**" He volunteers that the schedule was survivable and names _perpetual availability to someone else's command_ as the unbearable part. That is the Eight's non-domination motive stated as **motive** by the subject. Separately, the draft cites its own corpus stat naming Sevens as the modal creator type (22 of 90 — verified against `corpus-stats.json` this pass) and then never addresses Seven in a counterargument set that faces 3, 6, and 9w8. Leaving the corpus's most likely competitor unnamed reads as avoiding the matchup.
- **Minimum repair:** One sentence plus the quoted clause in the diagnosis, placed where the triple currently ends, paid for with one of the three repetitions (near-wash). Then one clause in the counterarguments naming Seven and dismissing it on the discriminator the same quote supplies: every one of Duke's freedom statements is freedom-_from_, not freedom-_to_, and his pressure response is sealing the perimeter rather than escaping into options.
- **Expected reader benefit:** The diagnosis moves from "he says he hates being bossed" to "he specifies which part of being bossed was unbearable, and it is the type's exact axis." The enneagram evaluator calls this the single cheapest quality gain available in the draft.
- **Protected hit at risk:** The anti-authority triple is a protected passage from the 2026-08-07 pass; keep at least two of the three repetitions and the 2018 dating argument (PROTECT-06), which is the piece's best structural defense.
- **Acceptance test:** The diagnosis section contains at least one first-person quote that a well-informed reader could not equally attribute to a Six, Seven, or Four. A reader who knows the corpus leans Seven can state why this subject is not one.

### P1-14 — The corpus disclosure cites the reference class that flatters the call (net +12)

- **Originating:** CRITIC-C8 (critic)
- **Location:** line 344 — "across 409 people profiled on 9takes as of August 2026, the creator category leans Seven and Three while Eights sit at baseline, 11 of 90"
- **Adjudicated problem:** The number is exactly right (verified: 409 published; creator-media n=90 with 7s=22, 3s=21, 8s=11) and the instinct is admirable. But the relevant comparison set for a bias check is the streamer cluster this page was commissioned to complete, and **two of the four suggested neighbors are already typed 8 on this site** — verified this pass: IShowSpeed `enneagram: 8`, Druski `enneagram: 8` (Kai Cenat 7, Adin Ross 3). Citing the wide class to claim independence from house bias while the narrow class points the other way is the same selective-denominator move the piece would criticize elsewhere.
- **Minimum repair:** One clause disclosing the cluster: Eights sit at baseline across creators, though two of his nearest neighbors on this site are already typed 8.
- **Expected reader benefit:** Turns a rhetorical bias check into an actual one — a rare credibility asset, and the kind of thing that makes an informed reader trust the rest.
- **Protected hit at risk:** The corpus-departure disclosure existing at all (PROTECT-07) — do not let this repair soften or remove the departure claim, only complete it. The falsifier stays last.
- **Acceptance test:** The disclosure names the reference class that is least favorable to the call.

### P1-15 — The secondary-instinct evidence is baseline core-type behavior (net 0)

- **Originating:** ENN-C4 (enneagram)
- **Location:** line 336 — "The social instinct runs second as group guardianship: enforcing AMP's no-additions policy, auditing award lists for excluded friends, professor duty at Streamer University."
- **Adjudicated problem:** Instinct evidence has to discriminate from the core type or it is the type counted twice. All three items are what 9takes' own Type 8 page lists under the Eight's baseline operating system ("Protect the people who can't protect themselves"), and would look identical in an sp/sx Eight. The internal subtypes page defines SO as community, status, and contribution.
- **Minimum repair:** Swap one item for something on the **status/belonging** axis — the paragraph's own next sentence already supplies the better example ("'rizz' is a label the group hangs on him, evidence about his standing in a crowd"). Or state plainly that the second instinct is the weaker call. Zero-to-low word cost. Note "enforcing" here is also caught by P1-10.
- **Expected reader benefit:** The stacking claim becomes checkable rather than decorative.
- **Protected hit at risk:** "The third instinct the public record cannot honestly rank" must stay — it is the model of proportionate certainty this repair extends one level up.
- **Acceptance test:** Each cited instinct behavior would look different in an Eight with a different second instinct.

### P1-16 — The murder-hoax beat rests on the most deletable citations on the page (net −2)

- **Originating:** FUTURE-C4 (future)
- **Location:** line 355 — "an account on X recycled his San Antonio mugshot… the post **cleared two million views** before Primetimer debunked it."
- **Adjudicated problem:** The beat is well-built and correctly dated, and it is the most legally sensitive sentence in the closing section. Its supports are the weakest on the page: X posts get deleted or locked, and Primetimer returned 405 to the packet's own fetch. "Two million views" is a snapshot that was stale the day it was written.
- **Minimum repair:** Archive both the originating post and the Primetimer debunk to a durable snapshot and cite the archived copies; soften the count to "more than two million" so growth cannot falsify it. **Do not cut the beat** — it is the strongest illustration of the meaning industry and the most current item in his record.
- **Expected reader benefit:** The most inflammatory sentence on the page retains verifiable support after its sources rot.
- **Protected hit at risk:** The layered label inventory (rizz → Unc → aura → 1987 → hoax) must keep its sequence structure (PROTECT-13); collapsing it to a single-label essay would trade durability for tidiness.
- **Acceptance test:** Every claim in the closing label inventory resolves to a source that still loads twelve months out.

## P2 — optional opportunities

- **P2-01 — Give the 2K era one rendered beat (FAN-C2).** The audience that built him is named four times and shown zero times, while the IRL era gets a dated, delightful inventory. "The appeal was never the jump shot" is asserted rather than earned because the piece never showed the jump shot. The method is already proven in this draft: `yt-dlp` against `UCspFcBk0XKaSJjZccJkPqnQ` (Duke Dennis Gaming, 2.0M) yields an equivalent dated inventory. **This is the highest-value P2 and the only one I would consider paying for**, because it converts the fan evaluator's biggest miss into the same kind of hit as the travel paragraph. Cost ~40 words; it does not pay for itself at the ceiling. Deferred across four passes for exactly this reason.
- **P2-02 — Add his own statement of how he wants to be seen (SUBJ-M3).** In the interview the draft mines for eight other things he volunteers, unprompted, "I would want them to look at me as like balance," alongside advocating that young people go outside. An article whose whole thesis is _other people keep assigning him meanings he did not choose_ omits the one meaning he chose for himself. Verified in the transcript. ~25 words.
- **P2-03 — Move the syllabus's self-portrait framing ahead of the units (UNFAM-C8).** Units 1–3 read as practical advice to a non-creator, and attention drops hardest there. **Do not move the existing "Unit 4 is where he hides the self-defense" sentence** — it is the protected Unit-3→Unit-4 bridge. Add a short signal in the section's existing lead-in instead. ~6 words.
- **P2-04 — Give the vulnerability half of the type a second beat (ENN-I2).** Germany is currently used only as arrow evidence; on tape it is also a refusal to be seen needing anything, which is the Type 8 page's second operating rule. One clause inside the existing paragraph makes it do double duty. Near-zero word cost, but it competes with P1-04 for the same sentence.
- **P2-05 — Add a current-status sweep to the people pipeline (FUTURE-C7).** Not a draft edit. For every legal, membership, or status claim, resolve to either a disposition or an explicit as-of stamp before publish, and require that any fact strong enough to _delete_ a claim be evaluated for inclusion _as_ a claim. Applies to all 400+ people pages. Route to the pipeline backlog, not to this revision.

## Research required before deciding

### RQ-01 — The exact disposition and date of the San Antonio criminal case

- **Unresolved question:** Were the misdemeanor trespassing and evading-arrest charges dismissed after Duke completed a pretrial diversion program, and on what date?
- **Why it gates:** It determines whether P0-01 ships the disposition or the mandatory as-of-stamped fallback.
- **Source needed:** Bexar County court records, or the San Antonio Express-News reporter who reviewed them. Do **not** print from a search summary or from this synthesis.
- **Status:** Corroborated this pass across Yahoo (syndicating Express-News-derived reporting), Dexerto, Hoodline, The Express Tribune and win.gg. Confidence high on the fact, medium on the date. **P0-01 is not blocked by this** — the fallback ships if it cannot be resolved.

### RQ-02 — Filing date, cause number, and current posture of the security officer's civil suit

- **Unresolved question:** In _White v. AMP Entertainment et al._, what is the filing date and cause number, is Duke Dennis still a named defendant, and in what capacity?
- **Why it gates:** If the suit is dismissed as to Dennis before publication, P0-01's repair shrinks to the disposition correction alone. If active, the clause is required. The distinction between Duke as a named defendant and Lavoune Clarke as the alleged assailant is load-bearing and must not blur.
- **Source needed:** Bexar County district clerk's docket, or the Express-News reporting on the filing.
- **Status:** Two independent evaluators plus my own search agree on defendants, amount, and allegations. Verify before printing legal language.

### RQ-03 — Is the aunt who died in July 2025 the aunt who named him?

- **Unresolved question:** Exactly as stated. No source — first-party or otherwise — connects or separates them.
- **Why it gates:** If they are the same person, the closing movement must be **rebuilt** rather than trimmed, and the piece probably owes the death a sentence. If different, the trimmed close in P0-05 stands as written.
- **Source needed:** The full 2025-08-17 return VOD or complete clips of it, where he speaks about her directly; or the Greenville-area obituary record cross-referenced against the Dennis family. Neither is reachable from the aggregator layer.
- **Status:** **Not resolvable from the public record; this is a human decision, not a search.** P0-05's repair is deliberately branch-safe and does **not** wait on this. Do not introduce the death under either branch.

### RQ-04 — Which outlet actually published "risk my freedom for the content"?

- **Unresolved question:** Is that sentence in the original Vibe piece, or only in Hollywood Unlocked / HotNewHipHop?
- **Why it gates:** Determines whether P0-06 re-attributes or drops the quote. Re-attribution is strongly preferred — the sentence is the most current link in the freedom-vocabulary chain.
- **Source needed:** Hollywood Unlocked's 2025-08-18 item; HotNewHipHop (Bryson Paul, 2025-08-18); or a cached copy of the stream clip. The Vibe original 307-redirects to a tollbit host, so the Yahoo syndication is the only reachable version and it lacks the sentence.

## Conflicts and editorial tradeoffs

**1. The Dee/DeeBlock hedge: preserve versus repair.** UNFAM-H5 preserves "No public source establishes the link, and he has never addressed it" as one of the two sentences that most earned a stranger's trust. FAN-C1, SUBJ-C1 and packet DISP-03 show the sentence is contradicted by its own citation. _Resolved for repair._ The unfamiliar reader is responding to the **shape** of the move — the writer stopping where the record stops — not to its wording, and the precise version delivers that shape better than the imprecise one. Precision is the version that survives a fan checking the source.

**2. The close: preserve versus trim.** UNFAM-H6 preserves "the final three sentences," which includes "He hasn't, and there's no sign he ever will." SUBJ-R1 and FUTURE-C5 both require removing the availability implication and the forecast. _Resolved for the trim, narrowly scoped._ The payoff the unfamiliar reader is protecting lives in the last two sentences ("A definition is just instructions for what to be…"), which P0-05 leaves byte-identical. The forecast clause is not carrying the ending; it is exposing it.

**3. The arrest paragraph: add counter-pressure versus do not narrativize.** CRITIC-B2 wants a clause of counter-pressure before Duke's quote. SUBJ preserve #5 protects the charges-only construction and warns against narrativizing. _Resolved by folding B2 into P0-01._ The civil-suit sentence supplies the counter-pressure as a **fact with a named source**, which is inside the charges-only register rather than outside it. No separate editorializing clause is authorized.

**4. The cold open: "sleep took him where he sat."** CRITIC-C10 (own severity: low) says the tape's "I almost fell asleep" is softer than the draft's staging. The subject evaluator specifically investigated this, checked the fuller quote — "I almost fell asleep in front of the machine **and I woke up pretty much like catching myself**" — and **dropped it as a finding**, concluding the staging is his own account. Packet CLM-04 rates the wobble low. _Resolved for the draft._ No change. The cold open is on four preserve lists and the discrepancy is a paraphrase inside the subject's own two-clause description of one event.

**5. Repetition versus load-bearing evidence.** UNFAM-C9 asks to drop the diagnosis-section instance of the interview claim as the softest of four. CRITIC-C3 asks to make the body's Type 3 engagement **stronger**, and that instance is the body's only anti-3 evidence pointer. _Resolved against the drop._ P0-02's scoping already removes the overclaim, and P1-04 rewrites the deferral sentence around it. Budget comes from elsewhere (see the brief).

**6. Quote fidelity versus place-name consistency.** SUBJ-C5 would normalize "D-Block" inside the quote because the source is a machine transcript; UNFAM-C7 says do not alter his speech, bracket instead. _Either resolution passes P1-07._ The binding requirement is that the page must not present two spellings as two places; the editor picks the mechanism.

**7. The unavoidable tension: word ceiling versus honesty repairs.** Six P0s and sixteen P1s against ~6 words of headroom. The draft has already paid for three prior passes with restatement rather than beats, and that well is shallower each time. **If the ceiling forces a choice, P0s win outright, then P1-01 through P1-12, and the editor should say plainly in the pass notes what was left undone.** Do not cut a protected beat to fund an accepted item — take the item to the next pass instead.

## Rejected feedback

- **CRITIC-C7 — hedge the intro's thesis sentence to absorb the four-year stay.** _Rejected._ The draft states its thesis, then breaks it in the open two sections later ("Nothing in the type explains this"), which every one of the six evaluators named as the piece's credibility hinge. Pre-hedging the intro trades that structural reveal for a defensive clause and spends words to make the piece _less_ surprising. The anomaly is already conceded twice in reader-visible text and once in the accordion.
- **CRITIC-C10 — soften the cold open's "sleep took him where he sat."** _Rejected._ See Conflicts #4. Investigated and dropped by the subject evaluator against the fuller transcript; rated low severity by its own author.
- **CRITIC-C1 — add the Union Square disposition asymmetry (65 arrested, 30 minors).** _Deferred, not accepted._ The point is real and would be one of the strongest sentences in the piece, but the section will now carry three legal beats after P0-01, and the dispositions of the 65 are not in the record (CRITIC-Q2 would have to be answered first to write it narrowly enough to be fair). Revisit if a future pass frees section budget and the DA record is available.
- **FAN-C5 — add one externally reported instance of the rizz phenomenon.** _Deferred._ Medium confidence by its own author, costs words at a hard ceiling, and the adjacent aura-farming beat already supplies the section with a dated, externally sourced, on-the-record instance of the same machine.
- **UNFAM-C5 — thin the AMP proper-noun wall.** _Deferred._ Medium confidence, single perspective. The roster substantiates "six-man," which the sealed-circle argument needs, and P1-10 is already editing that claim family — two edits to the same sentences in one pass risks damage for a cognitive-load gain.
- **UNFAM-C9 — drop the diagnosis-section interview repetition.** _Deferred._ See Conflicts #5.
- **SUBJ-M2 — the man is not funny here.** _Deferred._ A real observation about register, but not a discrete repair, and the closest available version (the Renaissance fair / Juggalos inventory) is already in the piece and protected. Chasing it at a hard ceiling would cost a beat that is doing more work.
- **The unfamiliar reader's "won't print here" tic note** (recorded by its author as a preference, not a finding) and the **fan's idiolect-cleanup note** (recorded as taste). _Rejected as out of scope._ Both are voice preferences; the omission markers are on the subject evaluator's preserve list as visible restraint.
- **The entity-gap packet's content requirement #5 (Streamer University "student in the inaugural 2025 class").** _Rejected, and flagged for enforcement._ This is **false** — his own channel published "Being A Professor At Streamer University" (2BbLkW5piSc, 2025-05-23) and Part 2 (ybktw-KV_s0, 2025-05-26). Packet DISP-01 resolves it against the entity-gap packet; the fan evaluator independently protects the current text. No pass may "correct" this to student. See PROTECT-03.

## Protected hits

Each must survive revision. Regression checks are in the brief.

- **PROTECT-01 — "Then the strangest fact in his biography: he stayed… Nothing in the type explains this. He has never explained it either." plus "His mother's sentence outlasted his own."** Named by all six perspectives; the subject evaluator requires it byte-for-byte. **This is the single most important passage in the draft** — it is the piece's refusal to totalize, and the moment each evaluator independently reports deciding the writer was being straight with them.
- **PROTECT-02 — The cold open through "The factory got twenty-nine days."** Requires zero prior knowledge and dramatizes the thesis before stating it. Untouched by every accepted item.
- **PROTECT-03 — "He had taught the inaugural session too, and posted the proof to his own channel: 'Being A Professor At Streamer University,' May 2025."** First-party upload evidence outranks the ambiguous roster copy that misled the entity-gap packet. A later pass "fixing" this injects a false claim into the one section built on a first-party fact.
- **PROTECT-04 — The Rolling Stone self-concession, ending "He profits from the legend daily, and he knows it," and the Union Square arithmetic sentence.** The two places the piece prices its own sympathy. The arithmetic sentence is also the model P0-01 must copy.
- **PROTECT-05 — The falsifier clause, last in the Rabbit Hole.** P0-03 and P1-14 both edit that paragraph; the falsifier stays in final position.
- **PROTECT-06 — The 2018 dating argument and the anti-authority triple.** That he stated the anti-control motive three ways, unprompted, six years before anyone typed him, neutralizes the standard objection to celebrity typing. P1-13 may spend one repetition, not the argument.
- **PROTECT-07 — The corpus-departure disclosure and the arrow discipline** ("Arrow behavior arrives under pressure and leaves with it" plus the null hypothesis). P1-14 completes the disclosure; P1-04 promotes the null hypothesis into the body. Neither may weaken either.
- **PROTECT-08 — The shift-bell paragraph, byte-identical, ending "What he hears is a shift bell," and "What he withheld was never the story. It was the microphone."** The article's central act of translation and its best reframe. P0-02 and P1-09 edit adjacent sentences.
- **PROTECT-09 — The gossip discipline and the omission markers.** No net worth, parents, siblings, or partner; "The opening clause won't be printed here." Nothing in this synthesis is license to restore any of it, least of all P0-01.
- **PROTECT-10 — The reception-night interior beat.** Every element is on tape. It is the standard the beat cut in P0-04 fails, and it must not be cut alongside it.
- **PROTECT-11 — "A definition is just instructions for what to be. He'd rather keep the name the way she left it: a sound with no orders inside."** Byte-identical. P0-05 trims around it, never into it.
- **PROTECT-12 — The travel/subculture paragraph, the syllabus section with its Unit-3 bridge and pull-quote, and the Rabbit Hole's collapsed opt-in status.** The fan evaluator's best-insight beat, the piece's most bespoke section, and the newcomer's most-valued structural decision.
- **PROTECT-13 — The layered structure of the closing label inventory** (rizz → Unc → aura → 1987 → the murder hoax). The section states the mechanism that generates the next label, which is why the piece reads as prescient rather than dated when "rizz" decays. Collapsing it back to a single-label essay would trade durability for tidiness. P1-16 edits inside it.
- **PROTECT-14 — "What became of Deo he has never said on record, and no reporting has filled it in."** The correct version of the stop-where-the-record-stops device, and the model P1-01 should render the Dee sentence against. A stated absence of explanation cannot rot; it can only be closed.

## Revision brief

Ordered and bounded. Everything below is scoped; nothing here authorizes a rewrite.

**Stage 1 — P0s, in this order (all six mandatory):**

1. **P0-04** — cut the second inner-thought beat. Do this first; it frees ~20 words and is pure subtraction.
2. **P0-05** — trim the closing availability implication and forecast. Subtractive. Protect the final two sentences byte-identical.
3. **P0-02** — extend the source-card quote through the _Sneaker Shopping_ clause; scope the body claim to "sit-down"; name the episode once in reader-visible prose. Combine with **P1-09** — same sentence.
4. **P0-06** — re-attribute or drop the "risk my freedom" quote (see RQ-04).
5. **P0-03** — restore and answer the compliments line in the counterarguments. ~35 words; combine with **P1-14** and **P1-03**, same paragraph, single visit.
6. **P0-01** — the San Antonio disposition and the civil-suit clause (see RQ-01, RQ-02). Do this last among the P0s so the resolved research lands in one edit. **The as-of stamp is mandatory if the research does not resolve.**

**Stage 2 — research-required decisions that can be safely resolved:**

- **RQ-04** first — it is the cheapest and it unblocks P0-06 cleanly.
- **RQ-01 and RQ-02** against the Bexar County docket or the Express-News reporting, not against a search summary and not against this document. Both are corroborated across four-plus outlets; what is missing is the primary record.
- **RQ-03 is not resolvable and must not be attempted by search.** P0-05 is branch-safe by design. If DJ or new reporting later settles it against the draft, the closing movement needs a rebuild, not a trim.

**Stage 3 — accepted P1s, in value order:**

P1-01, P1-02, P1-03, P1-04, P1-05, P1-06, P1-07, P1-08, P1-10, P1-11, P1-12, P1-13, P1-15, P1-16.
(P1-09 folds into step 3 of Stage 1; P1-14 folds into step 5.)

Six of these are net-zero or negative: P1-02, P1-03, P1-06, P1-07, P1-09, P1-12, P1-15. Do those regardless of budget.

**Budget ledger.** Accepted net cost is roughly **+108 words** against ~6 words of headroom, after ~30 words freed by P0-04 and P0-05. Named payers, in order of preference — all restatement, no beats:

- the Rolling Stone No. 5 ranking is still told twice (the AMP-section telling and the rizz concession); one telling can carry the number
- the stress-section restatement of the interview claim, once P0-02 has scoped it
- the third statement of "nothing explains the four-year stay" (FAQ echo at line 68) — the fresh-eyes review already identified this as the one that downgrades the other two into a disclaimer; the Army-section statement and the counterarguments' reuse both stay
- line-level tightening in the Rabbit Hole, which is where four accepted items land

If the ledger still does not close, drop from the tail of Stage 3 and say so in the pass notes. **Do not cut a protected beat to fund an accepted item.**

**Stage 4 — the one P2 worth considering:** **P2-01** (a rendered 2K-era beat, ~40 words, `yt-dlp` against `UCspFcBk0XKaSJjZccJkPqnQ`). It does **not** pay for itself at the ceiling. Take it only if Stage 3's payers overshoot, or if a future pass frees a section. Deferred four times for this exact reason; deferring again is an acceptable outcome, silently dropping it is not.

**Stage 5 — protected-hit regression checks.** Before declaring the pass complete, confirm each by grep or direct read:

1. "Nothing in the type explains this. He has never explained it either." and "His mother's sentence outlasted his own." — byte-identical.
2. Cold open through "The factory got twenty-nine days." — byte-identical.
3. "Being A Professor At Streamer University," May 2025 — still **professor**, never student.
4. Rolling Stone concession and the Union Square arithmetic sentence — intact (the arithmetic sentence survives P1-02).
5. The falsifier clause — still the last sentence in the counterarguments paragraph after P0-03, P1-13 and P1-14.
6. The shift-bell paragraph — byte-identical; "It was the microphone." intact after P0-02 and P1-09.
7. Reception-night interior beat — present; total inner-thought count in the draft is now **one**.
8. Final two sentences of the piece — byte-identical after P0-05.
9. Zero mentions of net worth, parents, siblings, or partner anywhere, including in the new legal sentence.
10. Rabbit Hole still `<details>`, still collapsed, DISTRIBUTION LEDGER still at 1 after P1-04's two promotions.
11. Travel/subculture paragraph and the syllabus Unit-3→Unit-4 bridge — intact.
12. Internal link count unchanged at 7 (P1-12 is a swap, not an addition).
13. Closing label inventory still runs rizz → Unc → aura → 1987 → hoax as a sequence after P1-16.
14. "What became of Deo he has never said on record, and no reporting has filled it in." — intact.

Then re-run `scripts/blog-lint.sh`, the same-type similarity scan, and the source audit, and update the TESTIMONY, HEADING MIX, DISTRIBUTION and FORMULA FINGERPRINT ledgers to match the revised text.
