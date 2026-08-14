---
artifact: perspective-synthesis
schema_version: 1
subject: Michael-Jordan
draft_sha256: b820877f4502c36c8c40fd61bcbda228874d2011216551b503a32a5331198fd3
synthesis_status: complete
delight_target: fan
p0_open: 6
p1_accepted: 10
research_required: 3
protected_hits: 12
requires_revision: true
synthesized_at: 2026-08-14T07:06:31Z
path: docs/content-analysis/perspective-reviews/Michael-Jordan/2026-08-14_020004/synthesis.md
---

# Perspective Synthesis — Michael Jordan (snapshot 2026-08-14_020004)

Adjudicator verification performed before synthesis: draft SHA re-hashed and matched; every cited passage re-read in the frozen snapshot; the on-file HOF transcript grepped (hedge confirmed at [15:02–15:06]: "no matter what people may have said if it was a rumor I never took it as truth"; Jordan's own year-slip confirmed at [20:38]: "played Utah 96 I'm at the center circle"); the `inner-thought` class confirmed as a distinctly styled house device (`src/scss/blog.scss:592`, gradient panel + thought-bubble icon + italic) used across 10+ people drafts; one additional source consulted (logged in P0-04).

## Executive verdict

All six perspectives independently returned **revise** with **value: high** and **delight: clear_hit** — an unusual convergence that the piece is genuinely strong and every needed repair is surgical. Five of six rated trust **strained** for the same reason: the draft's signature discipline (check the story against the record) is broken in a handful of checkable places, most visibly the coin-toss shrug, which all six lanes flagged and the packet affirmatively contradicts. Nothing found threatens the Type 3 thesis; the critic explicitly confirmed every omission it surfaced is _consistent_ with the typing, and the enneagram lane called the case "the strongest this pipeline has produced." The repairs are six P0s (all sentence- or table-cell-level, no restructuring), ten accepted P1s (mostly clause-level, two small additions), three research questions, and one P2 worth its word count. A repeated pattern worth naming: in at least four P0/P1 items the _corrected_ fact is stronger evidence for the thesis than the error it replaces — the record is on this article's side.

## P0 — mandatory red-flag repairs

### P0-01 — The coin-toss shrug inverts a documented scene

- **Originating reviews:** FAN-B1, CRITIC-B1, SUBJECT-B1, ENNEAGRAM-B1, UNFAMILIAR-R5, FUTURE-R1 (all six perspectives; five as blocker).
- **Location / passage:** "What happened when Michael Jordan ran out of scoreboards": "Security guards roped into pitching coins for twenty-dollar bills, Jordan hitting them with the famous shrug when he won."
- **Adjudicated problem:** In the documented Last Dance scene (Ep 6), security guard John Michael Wozniak **won** the $20 quarters bet and did Jordan's shrug **at Jordan**. The draft reverses winner and gesture; no source exists for its version. "Roped into" adds unsourced coercion flavor (SUBJECT-I4).
- **Evidence / confidence:** Packet CLM-10 + Dispute #1; S-19 (NBC Sports), S-25 (Action Network). Confidence: high — the packet instructs evaluators to treat this as a factual error.
- **Minimum repair:** Rewrite the sentence to the documented scene — quarters with his security guards, one guard beating him and hitting him with his own famous shrug — and drop "roped into." The corrected version is stronger thesis evidence: he manufactured stakes real enough to genuinely lose, and his signature gesture came back at him over pocket change.
- **Expected reader benefit:** Removes the draft's only affirmatively contradicted fact, sitting in the paragraph that carries the stress-arrow argument, in front of the largest possible fact-checking audience (The Last Dance viewers).
- **Protected hit at risk:** The paragraph's close — "The stakes were never the money. The stakes were having stakes." — must survive unchanged; the correction feeds it rather than fighting it.
- **Acceptance test:** No sentence anywhere claims Jordan shrugged at guards when winning; the scene matches S-19/S-25 (Wozniak wins, shrug aimed at Jordan); no unsourced coercion framing.

### P0-02 — The 1994 ledger row puts Bryon Russell in the 1996 Finals

- **Originating reviews:** FAN-B2 (lone detection; valid inside the fan lane's canon domain, confirmed by my reading).
- **Location / passage:** Grievance ledger, 1994 row, output column: "Raised it at center circle in the 1996 Finals, then ended the 1998 Finals with a shot over Russell."
- **Adjudicated problem:** The Bulls played Seattle in the 1996 Finals — the draft's own Father's Day section says so — and met Russell's Jazz in 1997 and 1998. The error originates with Jordan himself: the on-file HOF transcript ([20:38]) has him saying "we played Utah 96 I'm at the center circle," and the draft repeated his misremembering as fact, in the article's voice, inside the table whose device is checking claims against the record.
- **Evidence / confidence:** S-01 transcript on file (verified this synthesis); draft-internal contradiction; packet timeline. Confidence: high.
- **Minimum repair:** Change "1996" to "1997." **Recommended one-clause upgrade (FAN-B2's better repair):** attribute the year-slip to Jordan's own 2009 retelling — the table catching its own narrator is the table's thesis performed live. Optionally note the center-circle exchange is known through his retelling (same standard the freeze-out row applies; packet classifies the gym remark as attributed-to-Jordan-only).
- **Expected reader benefit:** Restores canon accuracy in the signature device; the optional clause converts the error into the draft's best meta-evidence.
- **Protected hit at risk:** Table-cell brevity — the minimum repair is one character; do not let the upgrade balloon the row.
- **Acceptance test:** No sentence places Russell or Utah in the 1996 Finals; the row reads "1997 Finals" or explicitly attributes the "96" to Jordan's misremembered retelling.

### P0-03 — "Most decorated winner" is a countable claim that fails

- **Originating reviews:** FAN-C1.
- **Location / passage:** Frontmatter description: "the most decorated winner in sports history"; Bobcats paragraph: "the most decorated winner the sport has produced watched from an owner's suite."
- **Adjudicated problem:** "Decorated" reads as countable and Bill Russell's eleven championships falsify it inside basketball alone; across sports it collapses further. The description ships to the SERP. The draft already owns the defensible superlative ("The most celebrated competitor in the history of American sports").
- **Evidence / confidence:** Record-book bedrock; no search needed. Confidence: high.
- **Minimum repair:** Swap "decorated" → "celebrated" (or equivalent non-countable phrasing) in both places.
- **Expected reader benefit:** Removes a checkable false superlative from the meta description and from the thesis's hardest-test paragraph — exactly the "well, actually" bait the rest of the piece is disciplined enough to avoid.
- **Protected hit at risk:** None.
- **Acceptance test:** `grep -i decorated` on the draft returns nothing.

### P0-04 — The 2003 ledger row lets Jordan's press statement stand in for "the record" (and the firing's mechanics are never explained)

- **Originating reviews:** CRITIC-C1 + UNFAMILIAR-R4 (merged: one rewrite fixes both).
- **Location / passage:** Ledger 2003 row, middle column: "True, exactly as filed: 'shocked by this decision, and by the callous refusal to offer me any justification for it' (ESPN, 2003)"; plus the Charlotte paragraph's unexplained "fired him from the front office."
- **Adjudicated problem:** The middle column's contract is _what the record shows_; this cell quotes the offense. Adjudicator verification (1 additional source: ESPN wire id 1644360, fetched this synthesis) confirms Pollin publicly gave justification — "It was an atmosphere on edge. It was not a healthy atmosphere to produce a happy organization or a winning team" — plus unhappiness/dissension remarks. The firing is true; "callous refusal to offer me any justification" is the _filed_ version, contested by the record. The draft's own second-pass note ("the one entry where offense and record agree") was wrong. Separately, the draft never states Jordan held a Wizards front-office job (President of Basketball Operations) he expected to return to, so the unfamiliar reader stalls on how a player gets "fired" after his final game.
- **Evidence / confidence:** ESPN wire 2003 (verified); packet CLM-13 verifies only the quote's wording, not the row's framing. Confidence: high.
- **Minimum repair:** Rewrite the middle cell: firing verified; Pollin publicly gave reasons (unhealthy atmosphere, dissension); Jordan's "no justification" characterization is his filing, not the record. Add a half-sentence (row or Charlotte paragraph) establishing he ran the Wizards' basketball operations and had come down from the front office to play, expecting to go back up.
- **Expected reader benefit:** Restores the table's integrity at its one broken row — and sharpens the thesis: even his most real grievance got the editorial treatment on the way into the ledger. The comprehension stall closes for free.
- **Protected hit at risk:** The row loses its "offense and record agree" hook; the replacement point (a fifth offense-vs-record gap) is stronger, but the reviser must not soften the fact that the firing itself was real and brutal — that's what keeps the row's pathos.
- **Acceptance test:** The 2003 record cell contains at least one fact sourced to someone other than Jordan and no longer asserts the filing matches the record "exactly"; a first-time reader can say what job Jordan lost in 2003 and why that could happen weeks after his final game.

### P0-05 — The freeze-out row erases Jordan's own on-podium hedge

- **Originating reviews:** CRITIC-C4, SUBJECT-C1, ENNEAGRAM-C2 (independent three-lane convergence; FAN-Q2 and UNFAMILIAR-Q4 asked the same question).
- **Location / passage:** Ledger 1985 row: "Alleged; participants have denied it ever since | Cited it from the Hall of Fame podium 24 years later"; also the HOF section's bare "The freeze-out."
- **Adjudicated problem:** Verified on the on-file transcript this synthesis: "no matter what people may have said if it was a rumor I never took it as truth." The row implies he asserted a denied grievance as fact; the record shows him citing it as fuel _while disclaiming belief_. The omission is simultaneously unfair to the subject (harsher than the record) and a wasted asset — it is the strongest first-person corroboration the thesis has: he knowingly burns fuel he doesn't certify. Deceit as curation, not delusion.
- **Evidence / confidence:** S-01 transcript on file; packet Dispute #2. Confidence: high.
- **Minimum repair:** Add the hedge to the 1985 row's record column (e.g., "Participants deny it; Jordan himself said on the podium he 'never took it as truth'") or one clause in the HOF section. Phrase as the allegation's content, not its confirmation (UNFAMILIAR-Q4's caution).
- **Expected reader benefit:** Fairer portrait and a sharper thesis in the same clause — Jordan himself endorsing the middle column.
- **Protected hit at risk:** Cell length; the HOF section's grievance-list rhythm if placed there.
- **Acceptance test:** Reader-visible text acknowledges Jordan disclaimed certainty about the freeze-out while citing it as fuel.

### P0-06 — NASCAR facts: "teams that never wore his logo" is false, and the charter outcome understates its own permanence

- **Originating reviews:** CRITIC-C3 (factual half), FUTURE-R2; UNFAMILIAR-I2's gloss folds in.
- **Location / passage:** NASCAR section: "The charters he won belong to teams that never wore his logo"; "the two teams got their six charters back for 2026 (ESPN)"; ledger 2024 row: "settled in December 2025; six charters returned for 2026 (ESPN)."
- **Adjudicated problem:** Three of the six restored charters are 23XI's own — his team's — so "never wore his logo" is false as written and internally contradicted two sentences earlier. Separately, the settlement made charters effectively permanent ("evergreen") for all teams (packet S-10, first-party), so "for 2026" scopes a permanent outcome to one season; by 2027 the growth-arrow payoff reads as possibly lapsed. Also minor: "courts dismissed" — one federal court.
- **Evidence / confidence:** Packet CLM-16 + S-10. Confidence: high.
- **Minimum repair:** Recast as settlement outcome in body and row: charters restored and made effectively permanent for every team, his own included. Fix or drop the logo sentence — the true version still carries the beat ("the settlement he forced made every team's charter permanent, including teams that never wore his logo"). Fold in a three-word charter gloss ("a guaranteed spot") so the row is self-contained. Singularize "courts." ("With prejudice" is handled at RQ-02.)
- **Expected reader benefit:** The growth-arc evidence stops carrying a checkable falsehood and an implicit expiration date.
- **Protected hit at risk:** SUBJECT-H5's preserved generosity beat ("litigating other people's security into existence") — outcome framing keeps it truthful; do not delete it, correct its premise.
- **Acceptance test:** No sentence claims the won charters belonged only to non-23XI teams; neither the section nor the row scopes the charter outcome to a single season; permanence is stated with the settlement date.

## P1 — accepted high-value improvements

### P1-01 — Replace "the testimony converges" with the true witness split; name Horace Grant

- **Originating reviews:** CRITIC-C2 (part 1; part 2 → RQ-01).
- **Location / passage:** Teammate section: "Ask the men who shared his locker room and the testimony converges." (Evidence in section: Kerr and Perdue only.)
- **Adjudicated problem:** Both witnesses are the redemptive ones — punched, then publicly reconciled. Horace Grant (May 2020, multiple named outlets) called Jordan's Last Dance snitch claim "a downright, outright, completely lie" and the film a "so-called documentary" Jordan controlled — a grievance-ledger output that landed on a third party and was never forgiven. "Converges" is false about the full witness pool.
- **Evidence / confidence:** ESPN/UPI/SI verified by critic with quotes and URLs. Confidence: high.
- **Minimum repair:** One to two sentences: the men he punched forgave him; Grant, whom he named as the _Jordan Rules_ source, called him a liar and never did. Build on, not in place of, the existing judgment sentence.
- **Expected reader benefit:** The empathy turn — the piece's central sympathetic move — survives contact with the full witness list instead of a curated one.
- **Protected hit at risk:** PROTECT-04 — the empathy turn and "The cruelty was real, and Perdue's word for him stands" must remain verbatim; the addition sits beside them.
- **Acceptance test:** The section no longer claims convergence and names at least one witness without a redemptive coda.

### P1-02 — Calibrate the pluralized invention claims to the documented record

- **Originating reviews:** SUBJECT-C2 (upgrade path → RQ-03).
- **Location / passage:** Intro: "He told teammates about insults that were never spoken. He avenged compliments that never happened."; diagnosis: "some of the slights were composed from nothing"; frontmatter: meta_title "Why He Invented Enemies," description "keep inventing insults."
- **Adjudicated problem:** The record contains exactly one admitted invention (LaBradford Smith). The 1978 compression and the freeze-out rumor are manufacture-adjacent (inflation; burning fuel he disclaimed) but not invention from nothing. The packaging claims a documented habit where the record documents an instance plus a pattern of grievance-manufacture.
- **Evidence / confidence:** Packet CLM-02; draft's own ledger. Confidence: high on the count; medium on severity (Jordan has never disputed the characterization).
- **Minimum repair:** Ground the iteration honestly in the body — e.g., anchor the intro's plural to the admission ("at least once, by his own admission, from nothing") or recast the plural as the manufacture-pattern the article actually documents (invention, inflation, rumor-burning — the P0-05 hedge supplies the second documented case of burning a slight that wasn't real). Metadata: editor's choice — "Invented Enemies" is defensible as emblematic packaging once the body is calibrated; note it as the one place packaging knowingly outruns strict proof, or soften the description's "keep inventing."
- **Expected reader benefit:** The thesis engine becomes unimpeachable; the subject could no longer fairly say "I admitted one."
- **Protected hit at risk:** The intro's hook rhythm — the two-sentence pair is one of the draft's best openings; calibrate without flattening it.
- **Acceptance test:** Every body-level plural or iterative invention claim is either supported by ≥2 sourced instances, tied explicitly to the documented manufacture-pattern, or reworded to the admitted single case.

### P1-03 — Restore method symmetry on the growth arc (NASCAR motive)

- **Originating reviews:** CRITIC-C3 (interpretive half; factual half → P0-06).
- **Location / passage:** Rabbit Hole: "the 23XI antitrust fight was waged and settled for every team's charters"; NASCAR section's redemptive framing generally.
- **Adjudicated problem:** The sport-wide benefit was a settlement _outcome_, not a demonstrated _purpose_; Jordan's own stated motive was "it was personal." The article audits five decades of Jordan self-narration against the record, then builds its close on his 2025–26 self-narration with none of the same skepticism — on the article's own theory, a Type 3 delivering the perfect gracious quote is the performance.
- **Evidence / confidence:** Packet CLM-16, CLM-17. Confidence: high on the overstatement; medium on how much hedging the arc needs.
- **Minimum repair:** Reframe "waged... for every team's charters" as outcome; add one clause conceding the growth reading rests on Jordan's own account (the draft already owns the move — "exactly the vocabulary you would now predict" is the right instinct).
- **Expected reader benefit:** The growth-to-6 arc survives as an honest reading instead of an inflated claim.
- **Protected hit at risk:** SUBJECT-H5's preserved beats ("The most valuable asset I have is time"; the generosity observation) — hedge the reading, don't retract the beats. See Conflicts #4.
- **Acceptance test:** No sentence assigns altruistic purpose to the suit; at least one growth-arc claim is explicitly marked as resting on Jordan's own account.

### P1-04 — Describe the NBC role at verified scale; fix or contextualize the Wilbon line

- **Originating reviews:** FUTURE-R3, FUTURE-R4, FUTURE-I2.
- **Location / passage:** Intro: "settling into a broadcasting chair at NBC"; NASCAR section: "his first official basketball role since leaving the Hornets"; "Michael Wilbon reported that people at ESPN 'got panicky' when the rival network landed him (August 2026)."
- **Adjudicated problem:** The verified record (S-14; Wilbon coverage read in context) is segments cut from one pre-taped sit-down interview. Wilbon's actual point was that the panic was _overblown_ because the role is minimal — the draft deploys his quote to certify the magnitude its own source deflates. "First official basketball role since leaving the Hornets" is loose (NBC framing: first _broadcasting_ role; he reportedly retains a minority Hornets stake — FUTURE-Q3).
- **Evidence / confidence:** Packet CLM-18/S-14; Wilbon context verified by future lane across four outlets. Confidence: high on context; medium-high on scale risk.
- **Minimum repair:** Swap "settling into a broadcasting chair" for verified-scale phrasing (an interview series with Tirico, debuting October 2025); align to "first broadcasting role since retirement" (also sidesteps the Hornets-stake question); either cut the Wilbon sentence or keep it with its deflating context (panic at the name, deflated by the role's size — which reinforces the corrected framing). If kept, cite a durable pickup (Yahoo/Awful Announcing) rather than the HoopsHype rumor page.
- **Expected reader benefit:** The claim survives every plausible 2026–27 outcome, including the role quietly ending; removes the one sentence a hostile reader can check against its own source.
- **Protected hit at risk:** The intro's "why now" energy — keep Daytona + NBC as current anchors; only the implied scale changes. The "obligation to the game" quote (actual growth evidence) stands untouched.
- **Acceptance test:** No sentence implies an ongoing or expanding NBC seat; role description matches the pre-taped single-interview basis; any retained Wilbon reference no longer implies the panic was justified by the role's scale.

### P1-05 — Self-containment: define the freeze-out, identify Krause, fix the 1994 row's referent

- **Originating reviews:** UNFAMILIAR-R1, UNFAMILIAR-R2, UNFAMILIAR-R3.
- **Location / passage:** Ledger 1985 row + HOF section ("The freeze-out. The doubting reporters. Jerry Krause."); ledger 1994 row ("Said to a retired baseball player at a Chicago gym").
- **Adjudicated problem:** Three verified comprehension breaks for a reader without Bulls-era lore: "freeze-out" is used twice and never once described (veteran All-Stars allegedly denying rookie Jordan the ball at the 1985 All-Star Game); "Jerry Krause" is a bare name with no identifying clause anywhere; the 1994 row describes Jordan as "a retired baseball player" three sections before the article reveals the baseball chapter — a first-time reader genuinely thinks Russell taunted someone else. Tables are what skimmers read out of order.
- **Evidence / confidence:** Confirmed by my own reading of the frozen draft; unfamiliar lane's orientation search confirmed the freeze-out is insider lore, not general knowledge. Confidence: high.
- **Minimum repair:** One defining clause for the freeze-out at first use (phrased as allegation — coordinate with P0-05's hedge, which lands in the same row); a two-to-five-word appositive for Krause (the Bulls general manager he feuded with) or cut the name; make Jordan the explicit referent in the 1994 row.
- **Expected reader benefit:** The ledger and the HOF grievance list become fully self-contained; no dangling proper noun in the article's most emotionally important section.
- **Protected hit at risk:** Table-cell brevity and the HOF list's staccato rhythm.
- **Acceptance test:** A reader who has never watched an NBA game can say what allegedly happened in 1985, who Krause was, and who Russell taunted — from this article alone.

### P1-06 — Add the 1991 Pistons walk-off row with the 2020 iPad coda

- **Originating reviews:** FAN-C2.
- **Location / passage:** Grievance ledger — the table jumps 1994 → 2003 with no 1991 row.
- **Adjudicated problem:** The Pistons walk-off (no handshakes, 7.9 seconds left in the 1991 sweep) is the most famous _real_ grudge in Jordan canon, and its 2020 coda is the single best filmed demonstration of the table's thesis: producers handed Jordan an iPad with Isiah Thomas's explanation and he rejected the correction on camera, thirty years later. It is the only entry where the record column confronted him directly — and lost. Not a biography demand; a thesis-completing addition (~35 words) inside the word ceiling.
- **Evidence / confidence:** CBS Sports 2020 recap sourced by fan lane; walk-off details bedrock. Confidence: high.
- **Minimum repair:** One row: 1991 | Pistons walk off without handshakes, 7.9 seconds left | True — and in 2020 Isiah Thomas's explanation was handed to him on an iPad | Rejected the correction on camera, thirty years later. No profanity needed (house style censors even quoted profanity — see the Perdue quote).
- **Expected reader benefit:** Closes the one gap a fan will spot and completes the table's argument.
- **Protected hit at risk:** The ~4,240/4,500 word budget and the list-motif density; PROTECT-01 (table structure) is extended, never flattened.
- **Acceptance test:** The 1991 walk-off appears in the ledger section with the iPad rejection as its output; body stays under 4,500 words.

### P1-07 — The 63-point game was a loss; say so

- **Originating reviews:** FAN-C3.
- **Location / passage:** Bird paragraph: "In April 1986 he scored 63 playoff points in Boston Garden…"
- **Adjudicated problem:** It was a double-overtime loss (135-131, packet-verified). Omitting it reads as trimming an inconvenient fact, when the loss completes the paragraph's own argument: the greatest compliment of his life arrived with no win to file it under.
- **Evidence / confidence:** Packet timeline, verified. Confidence: high.
- **Minimum repair:** Three words: "…63 playoff points in a double-overtime loss at Boston Garden…"
- **Expected reader benefit:** Canon completeness plus a sharper close to the piece's best original paragraph.
- **Protected hit at risk:** PROTECT-03 — the "Praise has no shelf in the archive" close must be untouched.
- **Acceptance test:** The sentence carries the loss; the paragraph's closing two sentences are unchanged.

### P1-08 — Calibrate the stress-arrow paragraph's certainty

- **Originating reviews:** ENNEAGRAM-C1.
- **Location / passage:** Scoreboards section: "The Enneagram maps this exactly. Under stress, the Three slides toward the numbed autopilot of Type 9…"
- **Adjudicated problem:** The packet classifies the arrow mapping as interpretation; "maps this exactly" asserts certainty. The paragraph also argues against itself: "The stakes were having stakes" describes core-3 measurement-hunger (inventing scoreboards), not 9-style numbing, while the cleanest 9-arrow exemplar (the 1994 autopilot year) sits in the Rabbit Hole.
- **Evidence / confidence:** Packet Enneagram-hypothesis section; site's own stress-page canon checked by the enneagram lane. Confidence: medium-high.
- **Minimum repair:** Soften the register ("The Enneagram has a name for this slide") and add one clause dividing the labor — the detachment from anything worth measuring is the 9 pull; the inventing of substitute measurements is the 3 refusing to let go. Optionally promote the 1994 bus year into the main-body arrow sentence.
- **Expected reader benefit:** Certainty proportional to evidence exactly where the article is most theoretical; the loose thread for theory-literate skeptics disappears.
- **Protected hit at risk:** "The stakes were never the money. The stakes were having stakes." — untouched.
- **Acceptance test:** The main-body arrow claim reads as interpretation, and a reader can say which behavior belongs to the 9 pull versus the 3 engine.

### P1-09 — Name what the lens does not explain; soften two or three totalizing absolutes

- **Originating reviews:** ENNEAGRAM-C3 + SUBJECT-C4 (merged — one beat resolves both).
- **Location / passage:** Absence of any reader-visible limits sentence; plus "Jordan registered nothing else" (diagnosis), "his has always been crowd-issued" (Rabbit Hole), "the only unrehearsed thing he had done in years" (Father's Day), "cannot feel his own worth unless a witness is watching" (TL;DR).
- **Adjudicated problem:** The working memo concedes behavior the typing doesn't explain (the baseball year as tribute; the same-day Kerr apology — tenderness with no audience payoff) but no published sentence does. A totalizing frame with no stated limit is the "type explains everything" failure mode, and the draft documents its own counterexamples. The absolutes assert interior certainty the record can't supply.
- **Evidence / confidence:** Packet ("Behavior the hypothesis does not cleanly explain"); draft's own type-challenge memo. Confidence: medium.
- **Minimum repair:** One to two sentences conceding the remainder, most naturally in the Rabbit Hole counterarguments block or at the Father's Day close; soften two or three of the absolutes ("registered nothing else," "always") or attribute them to the type lens. The TL;DR thesis line may keep its rhetorical force once the limit beat exists elsewhere; the ending is already the theoretically correct internalized version and stays verbatim.
- **Expected reader benefit:** A typing that names its own remainder reads as diagnosis rather than prosecution — paradoxically more credible.
- **Protected hit at risk:** The hook strength of the TL;DR and diagnosis lines; the Father's Day section's preserved prose. Soften selectively, not globally.
- **Acceptance test:** A reader can quote one published sentence conceding something the Type 3 reading does not explain; the flagged absolutes are hedged, lens-attributed, or quote-supported in place.

### P1-10 — Durability touches: age anchor, ball-status, Kerr phrasing

- **Originating reviews:** FUTURE-R5.
- **Location / passage:** Final section: "He is 63 now, and he hasn't picked up a ball in years…"; teammate section: "Kerr, who now coaches the Warriors."
- **Adjudicated problem:** "63 now" silently misstates his age from 2027-02-17 until the next refresh, inside the emotional close; "hasn't picked up a ball" is narrator-voice present tense one viral clip voids; "now coaches" hard-couples a secure fact (Kerr extended through May 2026 signing) to the write date for no benefit.
- **Evidence / confidence:** Birthdate packet-verified; Kerr extension verified by future lane (NBA.com/SI). Confidence: high.
- **Minimum repair:** Re-anchor the age to an event or his own dated quote; tie "hasn't picked up a ball" to his on-record 2025 statement ("I haven't touched a basketball," S-02) rather than narrator voice; "who went on to coach the Warriors." Leave the year-counters ("forty-four years," "forty-eight years ago") as-is — they are refresh-list items, and the ending is protected.
- **Expected reader benefit:** The final movement stays factually clean between refreshes.
- **Protected hit at risk:** The closing paragraph's rhythm — re-anchor without deflating "He is 63 now, and he hasn't picked up a ball in years, except the once…," which is doing real work. The ending's last two sentences are untouchable.
- **Acceptance test:** No narrator-voice "now" attached to an age, job, or status; the ending's protected sentences unmodified.

## P2 — optional opportunities

- **P2-01 — Add Jordan's own post-speech defense to the HOF section** (SUBJECT-I3). One sentence: "I'll go to my grave thinking, I said what I wanted to say" or the Rashad "if you understood it from my perspective" line (NBA-TV interview with Ahmad Rashad; CBS Chicago coverage carries the quotes — pin date at revision). The subject lane verified the draft's "disclosing his fuel source" reframe independently matches Jordan's own account; this sentence converts the piece's boldest interpretive move from authorial generosity into subject-corroborated reading, and it moots the critic's preference-tier hedge on "He was not taking a victory lap." The one P2 that pays for itself.
- **P2-02 — Shame-register word in the intro** (ENNEAGRAM-I5, preference). "He ran on fear" → a dread-of-being-unproven register word would align the intro with the heart triad's actual affect (shame, not danger-fear). One word; taste; skip if the intro's rhythm resists.

## Research required before deciding

- **RQ-01 — The Wizards-era cruelty clause (blocks the second half of CRITIC-C2's repair).** Exact question: given Kwame Brown's reported 2021 defense of Jordan, can the Wizards-era clause be written only at pattern level (Leahy's _When Nothing Else Matters_ documents demeaning treatment generally) or should it be dropped? Sources: ESPN Page 2 Leahy excerpts; Brown's 2021 livestream remarks. Decision rule: pattern-level only if Leahy stands unrebutted at that level; no incident-level detail without weighing Brown's counter-statement. P1-01's Grant sentence proceeds regardless.
- **RQ-02 — "Courts dismissed the case with prejudice that February" (in-draft claim; must resolve before publish).** Exact question: was 23XI/FRM v. NASCAR formally dismissed with prejudice on 2026-02-03? Sources: the federal docket (PACER) or ESPN/Sportico's case-closing report. If confirmed, keep with a tier-1/2 citation; if not confirmable, soften to the verified settlement facts (settled December 11, 2025; case closed) and drop "with prejudice." (FUTURE-R6/Q2.)
- **RQ-03 — A second sourced invention instance (upgrades P1-02 from reword to cite-and-keep).** Exact question: is there a second documented case of Jordan inventing (not inflating) a slight? Sources: Last Dance episode recaps beyond Ep 7; teammate long-form interviews and memoirs from the 2020 press cycle. If found, the intro's plurals and the metadata stand as written with the new citation. (SUBJECT-FQ1.)

## Conflicts and editorial tradeoffs

1. **CRITIC-C5 vs. SUBJECT preserve — "It took thirty years for the conviction to outrank the sponsor."** The critic wanted "conviction" neutralized or 2020-context added; the subject lane preserves the sentence verbatim. Resolved for preservation: the closing clause ("the sponsor was named Jordan") already carries the skeptical read, and P1-03's method-symmetry hedge addresses the underlying concern once, where it matters most. Rejected below.
2. **Critic preference vs. SUBJECT-H2 — "He was not taking a victory lap."** The critic wanted a hedge word on an interior-state absolute; the subject lane's research found Jordan's own post-speech account says essentially the same thing, and preserves the line. Resolved for preservation; P2-01 makes the corroboration visible on the page.
3. **SUBJECT-C3 vs. FAN/UNFAMILIAR — the inner-thought device.** The subject proxy wanted the invented interiority rebuilt from recorded language; the fan called it a welcome move and the unfamiliar reader's escalation condition (not an established house device) fails — verified this synthesis: `.inner-thought` is a distinctly styled 9takes convention (gradient panel, thought-bubble icon, italics; `blog.scss:592`) used across 10+ profiles. Resolved: keep the device. The residual accessibility question (text-only rendering strips the styling) is a corpus-level template issue, not a this-article repair — logged in Rejected feedback.
4. **CRITIC-C3/P0-06 vs. SUBJECT-H5 — the NASCAR generosity beats.** The critic's accuracy demands and the subject's preserved beats touch the same sentences. Reconciled by outcome-framing: fix the false "never wore his logo" premise and mark the motive reading as Jordan's own account, while keeping the observation that the settlement produced other teams' security. Accuracy and generosity are not in conflict once the framing is outcome, not purpose.
5. **FAN-B2's "better repair" vs. minimum-repair discipline.** The year fix is mandatory; the meta-clause (Jordan's own retelling misdated it) is recommended because it converts an error into thesis evidence at one clause of cost — but it is optional, and the cell must not balloon.
6. **Packaging sharpness vs. subject fairness (SUBJECT-C5/C2).** Body-level calibration accepted (P1-02); persona_title kept (see Rejected). The metadata is the deliberate distinctiveness layer, and the body's earned complexity is the defense.

## Rejected feedback

- **SUBJECT-C5 — soften persona_title "Basketball's Grievance Machine" and the meta_title.** Rejected. The body's own protected line — "The machine files threats, and when inventory runs low, it prints more" — is the persona title's warrant; the packaging matches the piece's central metaphor rather than exceeding it. Softening the front-facing labels would trade documented distinctiveness (the delight target is the informed fan, and every lane rated delight a clear hit) for a fairness gain the body already secures. The meta description's "keep inventing" is reviewed under P1-02's calibration; the persona title stands.
- **CRITIC-C5 — neutralize "the conviction" in the 2020-pledge sentence.** Rejected per Conflicts #1: the sentence's own irony carries the skeptical read, the subject lane preserves it verbatim, and P1-03 restores method symmetry where the stakes are real. Changing a protected line for a medium-confidence concern fails the minimum-repair rule.
- **SUBJECT-C3 — rebuild the Father's Day inner-thought from recorded language.** Rejected as an article-level change per Conflicts #3: the device is verified house style, visually unmistakable, and two lanes experienced it as a hit. The legitimate residue — that CSS-stripped renderings (RSS, screen readers) present an invented first-person line — is a template-level question for the whole people corpus and should be filed there, not solved by deforming this draft.
- **Critic preference — hedge "He was not taking a victory lap."** Rejected per Conflicts #2; the record (Jordan's own post-speech account) supports the draft's reading, and P2-01 can surface that support.

Deferred (useful, not this revision): UNFAMILIAR-I1 (a one-clause bridge for the unnarrated 1998 retirement — resolvable by arithmetic today; add if a later pass touches the section); UNFAMILIAR-I3 (TL;DR compresses the suit at 61 and the King interview at 63 into one age — reviewer's own confidence was low); FUTURE-I1 (the ledger heading's end-year as a living value — a refresh-protocol item, carried by future.md's 2027 refresh list, not an article edit); ENNEAGRAM-I5 beyond the P2-02 word swap.

## Protected hits

- **PROTECT-01 — The grievance-ledger table and its "What the record shows" middle column** (all six lanes). The screenshot-and-share artifact and the article's credibility device. Repairs P0-02/P0-04/P0-05/P1-05/P1-06 operate _inside_ its contract; extend it, never flatten it.
- **PROTECT-02 — The ending's final two sentences, verbatim** (all six lanes): "The list went up in a North Carolina locker room forty-eight years ago. He is still walking past it to check for his name." Only permissible future touch: the annual year-count word at refresh.
- **PROTECT-03 — The Bird paragraph**, especially "Praise has no shelf in the archive. The machine files threats, and when inventory runs low, it prints more." (5 lanes; best original insight.) P1-07 adds three words upstream of it and nothing else.
- **PROTECT-04 — The empathy turn** — "every scrimmage like the roster was going up in the morning without him on it" — **with its judgment anchor** "The cruelty was real, and Perdue's word for him stands" (fan, critic, subject). P1-01 builds beside it, not over it.
- **PROTECT-05 — The Bobcats movement** (fan, critic, enneagram, subject): "he owned the wall the list hung on" through "refused him the only lever he ever trusted, himself." The thesis surviving its hardest disconfirming record.
- **PROTECT-06 — The Wojnarowski concession** (critic): "The criticism holds up. Leroy Smith gained nothing from being flown across the country as an exhibit in a case only one man was still litigating." The passage that licenses every reframe that follows.
- **PROTECT-07 — The cold open through "calculating the cost of disappointing a nine-year-old," the told-story attribution structure ("He told Mike Tirico, on NBC in October 2025…"), and the entity-disambiguation paragraph with its michael-b-jordan cross-link** (unfamiliar, future, fan). P1-04 adjusts only the implied scale of the NBC role, not the frame.
- **PROTECT-08 — The LaBradford Smith engine with the meme callback, the deceit gloss ("nothing to do with lying on your taxes… stories you tell yourself to keep the performance running"), and the two 3-vs-8 tiebreaker sentences** ("An Eight torches the sponsor and keeps the conviction. Jordan kept the sponsor." / "His aggression rented space inside a performance; an 8's aggression owns the building.") (enneagram, unfamiliar).
- **PROTECT-09 — "Mike was a person. Michael is a verdict, handed down by an audience…"** (fan, unfamiliar).
- **PROTECT-10 — The durability discipline** (future): every absolute date, "a Forbes-certified fortune" (never a dollar figure), and the exclusion discipline (no sister's-memoir material, no 1993 conspiracy, no addiction diagnosis, no tabloid marriage material).
- **PROTECT-11 — The HOF reframe pair** (subject): "He was not taking a victory lap. He was disclosing his fuel source, in front of the fire marshals, while crying." and "It took thirty years for the conviction to outrank the sponsor, and when it finally did, the sponsor was named Jordan." Both survived adjudicated challenges (Conflicts #1–2).
- **PROTECT-12 — The Rabbit Hole's structure and courtesy** (enneagram, unfamiliar): the "Skip if you're not deep into the system" note and the counterarguments block's priorities (8 taken seriously, 1 dismissed fast). P1-03/P1-09 edit sentences within it without reshaping it.

## Revision brief

Bounded worklist for the revision editor, in order. Body budget: ~4,240 of 4,500 words now; net additions below ≈ +165–200 words (less ~25 if the Wilbon sentence is cut) — it fits, but headroom after this pass is thin; trim only from unprotected connective tissue.

1. **P0-01** — Rewrite the coin-toss sentence to the documented Wozniak scene; drop "roped into."
2. **P0-02** — "1996" → "1997" in the 1994 ledger row; recommended one-clause attribution of the year-slip to Jordan's own retelling.
3. **P0-04** — Rewrite the 2003 record cell with Pollin's public reasons (ESPN wire id 1644360); add the half-sentence on his Wizards front-office job.
4. **P0-05** — Add the freeze-out hedge ("never took it as truth") to the 1985 row or HOF section, phrased as allegation content. Coordinate with the P1-05 freeze-out definition — same cell, write them together.
5. **P0-06** — NASCAR facts: charters restored and made effectively permanent for every team (body + row); fix or drop "never wore his logo"; singularize "courts"; fold in the three-word charter gloss.
6. **P0-03** — "decorated" → "celebrated" in the description and the Bobcats paragraph.
7. **RQ-02** — Verify or soften "dismissed with prejudice" (must resolve; the claim is live in the draft). Then, if cheap: **RQ-03** (second invention instance → determines P1-02's shape) and **RQ-01** (Wizards-era clause → determines P1-01's optional second sentence).
8. **P1-01** — Replace "the testimony converges"; add the Grant sentence (+ Wizards clause only per RQ-01).
9. **P1-05** — Self-containment: freeze-out definition (with item 4), Krause appositive, 1994-row referent.
10. **P1-06** — Add the 1991 Pistons/iPad ledger row.
11. **P1-07** — "in a double-overtime loss," three words.
12. **P1-02** — Calibrate invention plurals in intro and diagnosis (shape per RQ-03); metadata at editor's discretion.
13. **P1-03** — Growth-arc outcome framing + one on-his-own-account clause.
14. **P1-04** — NBC scale phrasing; "first broadcasting role"; Wilbon cut or kept-with-context (durable citation if kept).
15. **P1-08** — Stress-arrow register soften + 9-pull/3-engine labor split.
16. **P1-09** — Limits-of-the-lens beat + soften two or three absolutes (ending and TL;DR force preserved).
17. **P1-10** — Durability touches (age anchor, ball-status tied to his dated quote, Kerr phrasing).
18. **P2-01 only if word budget allows** — the one-sentence Rashad/NBA-TV post-speech quote in the HOF section (pin the citation date first).
19. **Protected-hit regression checks (run after all edits):**
    - `grep -i decorated` → 0 hits (P0-03).
    - Ending's final two sentences byte-identical to the snapshot (PROTECT-02).
    - "Praise has no shelf in the archive." and "The machine files threats, and when inventory runs low, it prints more." intact (PROTECT-03).
    - "The cruelty was real, and Perdue's word for him stands." intact (PROTECT-04).
    - "the only lever he ever trusted, himself" intact (PROTECT-05).
    - "The criticism holds up." intact (PROTECT-06).
    - Both tiebreaker sentences intact (PROTECT-08); disambiguation cross-link resolves (PROTECT-07).
    - No sentence anywhere claims Jordan shrugged at guards when winning (P0-01); no sentence places Russell or Utah in the 1996 Finals (P0-02).
    - Body word count ≤ 4,500; every ledger row's middle column contains record, not filing (P0-04's contract, table-wide).
    - The future lane's 2027 refresh list (future.md) is carried forward unmodified as the post-publish maintenance protocol.
