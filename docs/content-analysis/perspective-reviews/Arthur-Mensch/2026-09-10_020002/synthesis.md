---
artifact: perspective-synthesis
schema_version: 1
subject: Arthur-Mensch
draft_sha256: f8e2e95751081adb0d92b6367ec97284bce5c59e5e2c880e2844069d468556f3
synthesis_status: complete
delight_target: fan
p0_open: 12
p1_accepted: 16
research_required: 5
protected_hits: 15
requires_revision: true
synthesized_at: 2026-09-10T07:19:52Z
path: docs/content-analysis/perspective-reviews/Arthur-Mensch/2026-09-10_020002/synthesis.md
---

## Executive verdict

**Revise. The interpretation is the best type work in this corpus. The record underneath it is not shippable.**

All six evaluators returned `trust: strained`, `delight: clear_hit`, `recommendation: revise`. That combination is unusual and it is diagnostic: nobody disputes the reading, everybody caught the same class of defect. The Type 6 call and its engine — non-revocability, the refusal to stand on ground someone else can withdraw — survives every repair below. The CNRS spine is unique in English and does real argumentative work. The fMRI-as-epistemology paragraph and the Mixtral torrent scene are the two best passages in the draft and neither is touched by a single finding.

Three failure patterns account for almost everything else.

**One: derived numbers were inherited, not computed.** He was 34 at the September 2026 round, not 33 — and that value is emitted as structured data answering "How old is Arthur Mensch?" Mistral was ~40 months old, not thirty — and that figure carries the intro's punchline and reappears as rhetoric. Four evaluators raised each independently; the packet had already graded both **CONTRADICTED** (CLM-01, CLM-02) and the draft shipped them anyway, under a self-reported "blog-lint: 0 fail, 0 warn." The marathon duration is contradicted one sentence after it is stated. This is a pipeline defect, not a research defect: no pass recomputes derived figures against dates already present in the same file.

**Two: adverse facts are admitted and then closed out by moves that do not answer them.** The worst month is resolved by a competition regulator that ruled on a different question in a different jurisdiction. The Rabbit Hole's own falsifier is resolved by an open-weights release that was research-and-non-commercial-only — the one release where Mistral kept exactly the switch the thesis says Mensch refuses to let anyone hold — while the fact that would actually settle it (Mistral Large 3, Apache 2.0, December 2025) appears nowhere in the article. The subject's own stated reason for a quotation is cut and replaced with the thesis's reason. As the critic put it: a reader who checks three things and finds three unearned resolutions concludes the writer was protecting the subject, and the damage is concentrated precisely in the sections built to prove that isn't happening.

**Three: the critic section is the weakest section, which is the opposite of what it needs to be.** Two of its five objections are factually wrong _against_ the subject (customer count, benchmark breadth), one is an aphorism that never becomes an argument, and the strongest available objection — the "owned" physical layer is leveraged bank debt running on a single American vendor's silicon — is absent. Overstating the case against someone is not the same as making it.

Two Enneagram blockers are internal-consistency failures I verified in the repo myself: the phobic/counterphobic payoff asserts as rare exactly what `enneagram-type-6.md:226` calls typical (published twice, including in FAQPage JSON-LD at :616), and the Five/Six tiebreaker's second half rests on "Fives work alone by preference" while the Hassabis page the same paragraph links to types him 5w6 and credits him with "the Six's instinct for alliances, institutions" and "a durable institution rather than a lone-genius practice." A curious reader finds both contradictions by following the site's own navigation.

One packet blocker is **discharged**: CLM-07, the "refuses to elaborate" quotation flagged as fabricated-quote exposure, was independently located by two evaluators as a real post by Eric Jang (2023-12-08). It still cannot ship as written — an unnamed attribution nobody in this pipeline has opened the permalink for — but the fabrication risk is retired.

Nothing here requires new reporting to fix. Every P0 is executable from sources already identified. The binding constraint is words, not facts: the body sits at ~3,893–3,924 in a 3,200–3,900 band, and the accepted repairs net-add roughly 230 words. The revision brief names where to fund that.

---

## P0 — mandatory red-flag repairs

### P0-01 — The subject's age is wrong in the opening sentence and in structured data

- **Origin:** SUBJ-B4, FAN-R1, UNFAM-B1, FUTURE-R1, CRITIC-C7 (5 perspectives). Packet CLM-01, **CONTRADICTED**, risk graded high.
- **Location / passage:** Intro (line 145): _"On September 8, 2026, a 33-year-old French researcher raised three billion euros."_ FAQ #2 (line 65): _"was 33 at the time of Mistral AI's September 2026 funding round."_
- **Adjudicated problem:** Born 1992-07-17; the round closed 2026-09-08. He turned **34** seven weeks earlier. It is the first checkable fact on the page and the most machine-checkable claim in the file, and FAQ #2 is emitted as structured data answering the literal query. The error traces to September 2025 French coverage ("Milliardaire à 33 ans") that was accurate when written and was copied forward through the entity-gap packet without recomputation.
- **Evidence / confidence:** Arithmetic on a verified birth date. Wikipedia's infobox, fetched by SUBJ, reads "(age 34)". **High.**
- **Minimum repair:** 34 in both places. Keep FAQ #2's event-anchored construction — "was 34 at the time of…" — which cannot decay again; do not restate age in a bare present tense anywhere.
- **Reader benefit:** The page stops failing on its own most-queried fact, in the two highest-visibility slots.
- **At risk:** Nothing. FUTURE-H5 protects the _sentence pattern_, not the integer.
- **Acceptance test:** `1992-07-17 → 2026-09-08` computes to 34; no reader-visible copy or FAQ answer contains "33" referring to his age; every surviving age reference names the dated event it is measured at.

### P0-02 — Mistral's age is wrong by ~10 months, twice, once as load-bearing rhetoric

- **Origin:** SUBJ-B6, FAN-R2, UNFAM-B2, FUTURE-R2, CRITIC-C7 (5 perspectives). Packet CLM-02, **CONTRADICTED**, risk graded high.
- **Location / passage:** Intro (line 145): _"a company that did not exist thirty months earlier."_ Electrician § (line 228): _"a thirty-month-old French company raising three billion euros to take on the largest firms in the United States."_
- **Adjudicated problem:** Founded April/May 2023 → 2026-09-08 is 41/40/39 months depending on the founding month. Under no reading is it thirty. Thirty months before the round is March 2024, by which point the draft's own narrative has Mistral shipping Mixtral and Mistral Large. A first-time reader catches this without leaving the page (UNFAM-B2). The second instance is the punchline of the phobic/counterphobic resolution, so the error is doing persuasive work — and it flatters him, which is the direction a subject least wants.
- **Evidence / confidence:** Arithmetic on the packet's verified founding window. The research file carries the same error as "~28 months," so it is inherited. **High.**
- **Minimum repair:** Replace the derived month-count with the endpoints or a year-scale age — "founded in the spring of 2023" / "a three-year-old French company." A month figure is wrong again every month the page sits; endpoints never decay. Correct the research file in the same pass so the next Mensch pass does not reproduce it.
- **Reader benefit:** Removes a false claim from the opening paragraph and a rhetorical peak; the young-company/large-raise contrast is fully preserved by the true number.
- **At risk:** The electrician section's contrast beat — preserved, because ~40 months is still extraordinary.
- **Acceptance test:** No reader-visible copy contains a derived duration between Mistral's founding and a later event; no instance of "thirty months"/"thirty-month" remains; the stated interval is consistent with the draft's own "left DeepMind May 2023."

### P0-03 — A quotation is truncated and the speaker's stated reason replaced with the thesis's reason

- **Origin:** CRITIC-B1, SUBJ-B1, SUBJ-M2 (2 perspectives, both blockers). Packet CLM-06, **TRUNCATED — gloss not supported by the full quote**.
- **Location / passage:** Close of "What Arthur Mensch does when the pressure lands" (line 285): _"Then there is the line that gives the game away about how he experiences a sales meeting. \"You're always in a weak position when you're the seller.\" The buyer is the one who can end it."_
- **Adjudicated problem:** The full sentence, verified first-party at École Polytechnique (2026-01-19, S-24) and re-fetched by CRITIC this run, is: **"You're always in a weak position when you're the seller because you're doing the work, you're getting tired, and you're facing criticism."** The quote is cut immediately before the because-clause and the writer supplies a _different_ cause, presented as what the line "gives away." This is the clearest instance in the draft of evidence being shaped to fit the thesis, and it is framed as the section's revelation. The section's own claim is that under pressure "he does not get louder, he gets more specific" — and its closing evidence deletes the three specifics he supplied to install a fourth he did not.
- **Evidence / confidence:** First-party source, re-verified this run; the divergence is not interpretive. **High.**
- **Minimum repair:** Cut the gloss "The buyer is the one who can end it." Either quote the sentence in full and drop the revocability reading, or delete the beat entirely. Do not paraphrase around the because-clause. (Deleting it also funds ~40 words toward the budget.)
- **Reader benefit:** Removes a distortion exposed by one click on the draft's own cited source.
- **At risk:** The section loses its closing beat. The cohesion pass added this gloss specifically to give the quote follow-through; the honest resolution is that the quote had no follow-through to give. The section's real spine is now the February 2024 narrative, which does not need it.
- **Acceptance test:** Search for "weak position." Either the full sentence including "because you're doing the work" appears, or the passage is gone. No sentence within 200 characters of that quote asserts termination, revocation or ending as the reason.

### P0-04 — The designated rebuttal to the article's own falsifier rests on a research-only licence, and the fact that would settle it is missing

- **Origin:** CRITIC-B2, FAN-R3, SUBJ-B... (SUBJ-C10, SUBJ-M3), ENN-C7, FUTURE-C1 (5 perspectives; 2 as blockers). Packet CLM-04, **MISLEADING AS FRAMED**, risk graded high.
- **Location / passage:** Pressure § (line 283): _"And that July, five months after shipping a closed flagship, Mistral published the weights of Mistral Large 2. **Nobody made it do that.**"_ Reused in the Rabbit Hole (line 312): _"the July that followed, when no regulator required anything of him and the weights went back out anyway."_ Also FAQ #5. Section heading (line 251): _"Why Mistral gives away the models it sells"_ — present tense.
- **Adjudicated problem:** Both halves of the exoneration fail. **(a)** Mistral Large 2 shipped 2024-07-24 under the **Mistral Research License** — research and non-commercial use only; commercial self-deployment required a separate paid licence (first-party S-15; Simon Willison the same day: "not as open as Llama 3.1"). A commercial customer could _not_ run it "on their own terms." Mistral retained exactly the switch the thesis says Mensch refuses to let anyone hold. **(b)** It was not unforced: Meta shipped Llama 3.1 405B on 2024-07-23, one day earlier and less restrictively, and contemporaneous coverage framed Large 2 as the answer. "Nobody made it do that" rules out competitive causation without argument. **(c)** The stronger fact exists and is unused: **Mistral Large 3, 2025-12-02, 675B sparse MoE, base and instruct, Apache 2.0** — permissive commercial use, no permission required. It is the flagship in force at publication and the reason the present-tense heading is true in 2026, and it appears nowhere in the article. The draft reached past its best evidence for a weaker one, in the exact place its credibility architecture depends on.
- **Evidence / confidence:** Licence terms verified first-party in the packet (S-15, S-21); Large 3 re-verified first-party by FUTURE this run; Llama 3.1 timing verified by CRITIC this run. **High.**
- **Minimum repair:** Delete "Nobody made it do that" and the line-312 clause. Keep Large 2 in the February 2024 chronology, but name its licence in the same sentence. Add one dated sentence on Mistral Large 3 (Apache 2.0, December 2025, flagship) where the section asserts a present-tense give-away, and let the Rabbit Hole falsifier resolve against _that_ release.
- **Reader benefit:** The falsifier test becomes genuinely stronger rather than weaker, the present-tense heading acquires present-tense evidence, and the piece stops looking like it is avoiding the licence question this audience cares most about.
- **At risk:** PROTECT-08 (the medium-high cap and the named falsifier) — the falsifier sentence stays; only the test changes. Word cost ~25; fund from P0-03's deletion.
- **Acceptance test:** No sentence asserts Mistral Large 2's release was unconstrained or uncaused. If Mistral Large 2 is named, "Mistral Research License" or "non-commercial" appears in the same paragraph. The open-weights section names a flagship released under a permissive commercial licence, with date. A reader can state Mistral's flagship licence as of 2026-09-10 from the article alone.

### P0-05 — A competition-law clearance is presented as resolving an ethics-and-lobbying charge it never addressed

- **Origin:** CRITIC-B3 (blocker), FUTURE-C5 (2 perspectives).
- **Location / passage:** Pressure § (line 283): _"The record then went quiet in his favor. Britain's competition regulator decided in May 2024 that the partnership did not qualify for investigation."_ Placed directly after line 277's Green MEP referral and Trojan-horses report.
- **Adjudicated problem:** The reader is handed an accusation about lobbying ethics, conflicts of interest and transparency addressed to the **European Commission**, and then an authority saying no — a **UK** merger-control finding that the arrangements conferred no material influence and did not qualify as a relevant merger situation (S-06, 2024-05-17). Different regulator, different jurisdiction, different question. The lobbying question was never adjudicated; "the record went quiet in his favor" implies it was. FUTURE searched for a published Commission decision and located none, while confirming the Commission said it would analyse the investment as part of its generative-AI market review.
- **Evidence / confidence:** Scope mismatch documented on both sides in the packet (S-06, S-07). **High** on the mismatch; **medium-high** that no Commission decision was published (negative evidence, worded to survive either answer).
- **Minimum repair:** One added clause. State what the CMA actually ruled, in its own terms, attribute it to the CMA alone, and say plainly that the lobbying and conflict-of-interest questions produced no ruling as of the publication date. Drop "went quiet in his favor" or any equivalent implying vindication.
- **Reader benefit:** Removes a false resolution any reader who follows EU tech policy catches — and the honest version ("never adjudicated") is more interesting than the false one. If the Commission acts later, the article is _updated_ rather than contradicted.
- **At risk:** PROTECT-07 (the February 2024 reporting) — repair the resolution, not the reporting. Word cost ~25.
- **Acceptance test:** The passage names the CMA's actual finding, and for every regulator named the article states either the outcome or that none was published as of a stated date. No jurisdiction's decision is used to characterise another's.

### P0-06 — A letter from named elected officials is escalated into a heavier allegation, in body copy and in structured data

- **Origin:** SUBJ-B2 (blocker), CRITIC-C4 (attribution half). Packet Disputes #2 and S-10.
- **Location / passage:** Pressure § (line 277): _"Green MEPs asked the European Commission to examine whether Mistral had served as a lobbying vehicle for Microsoft."_ FAQ #5 (line 74): _"Green MEPs asked the European Commission to examine whether Mistral had been used to soften EU AI Act rules it then benefited from."_ Same paragraph: _"Corporate Europe Observatory published a report calling European startups Trojan horses."_
- **Adjudicated problem:** "Served as a lobbying vehicle for Microsoft" is an allegation that he fronted for a foreign corporation against his own jurisdiction's interests. It is the single most damaging sentence in the article about him, it is sourced to identifiable elected officials, the two renderings do not even agree with each other, and the FAQ variant ships as structured data that answer engines can quote without context. The letter is reported as asking the Commission to examine the deal's **ethical side, possible conflicts of interest, and lobbying transparency** (S-07). Both draft renderings are materially sharper than that. Separately, the "Trojan horses" report is joint research by **LobbyControl, the Observatoire des multinationales and Corporate Europe Observatory** — the draft credits the single most dismissible of the three.
- **Evidence / confidence:** **High** on the mismatch between the draft and the reported contents; **medium** on the letter's exact wording, which is why the repair retreats to the reported version rather than asserting a new one.
- **Minimum repair:** Render the letter as reported — ethics, conflicts of interest, lobbying transparency — identically in the body and in FAQ #5. Credit all three organisations, or write "three European transparency groups." If the sharper characterisation is wanted, attribute it to Kim van Sparrentak's own on-record words and quote her; it is a different speech act from the letter.
- **Reader benefit:** Keeps February 2024 at full force — it is damaging enough on the verified facts — while removing an unsupported allegation about a living person from machine-readable output.
- **At risk:** PROTECT-07. Net word cost ~0.
- **Acceptance test:** Every characterisation of the MEP letter in body copy and in `faqs:` is traceable to a source describing the letter's contents, and the two renderings now say the same thing. No organisation is credited with another's work.

### P0-07 — A quotation in reader-visible copy is attributed to an unnamed person nobody in this pipeline has sourced

- **Origin:** SUBJ-B3 (blocker), packet CLM-07 **UNVERIFIED** (risk high). **Discharged in the draft's favour** by CRITIC-H4 and FAN-C7, independently.
- **Location / passage:** Open-weights § (line 261): _"One researcher wrote that Mistral \"releases 87GB torrent containing 8x 7B MoE model via tweet, refuses to elaborate.\""_
- **Adjudicated problem:** The packet could not locate the sentence across four search angles plus a direct read of the likeliest candidate, and graded it fabricated-quote exposure. Two evaluators then independently attributed it to **Eric Jang, on X, 2023-12-08** — FAN supplying the status ID `1733164335084814578` and the full post ("mistral's brand is already becoming one of my favorites in the AI space releases 87GB torrent containing 8x 7B MoE model via tweet, refuses to elaborate"). Two independent converging attributions with a specific permalink outweigh one pipeline's failure to locate it, so the fabrication charge is retired. What cannot ship is the current form: a quotation attributed to "one researcher," which reads as unsourceable, sits as the emotional payoff of the article's best scene, and throws away the recognition it was quoted to trigger. Neither evaluator opened the permalink.
- **Evidence / confidence:** **High** that the sentence is real and attributable; **medium-high** pending a single permalink check (RQ-01).
- **Minimum repair, two acceptable branches.** _Preferred:_ name Eric Jang and add the X permalink to `citations:` — after opening it once (RQ-01). _Fallback, if RQ-01 cannot be completed before publish:_ drop the quotation marks and the "one researcher" attribution entirely. The verified facts carry the scene unaided — a bare magnet link, 87 gigabytes, no blog post, no paper, no launch. Do **not** ship the current unnamed-attribution form under either branch.
- **Reader benefit:** Clears the only fabricated-quote exposure in the article without losing a word of the scene's force, and swaps a generic attribution for one the fan target recognises on sight.
- **At risk:** PROTECT-03 — the Mixtral scene must survive intact; only the attribution changes.
- **Acceptance test:** Every pair of quotation marks in reader-visible copy maps to a named source present in `citations:` or the research file. No quotation is attributed to an unnamed person.

### P0-08 — The customer base is understated by roughly an order of magnitude, inside the fairness section

- **Origin:** SUBJ-B5 (blocker), CRITIC-C5, FAN-C4, UNFAM-C6 (4 perspectives). Packet CLM-15, **CONTRADICTED by available counts**.
- **Location / passage:** Critic § (line 323): _"Its revenue is real and concentrated: … a business resting on a few dozen enterprise and government relationships feels every departure immediately."_
- **Adjudicated problem:** The record shows 100+ enterprise clients (FT), **125+ enterprises across 20 countries in Mistral's own Series D materials** — the very round this article is pegged to — and one tracker citing 1,031 high-value customers as of July 2025. The concentration argument may still hold revenue-weighted, but the stated fact does not. For an unfamiliar reader this is the _only_ concrete measure of Mistral's scale in 3,900 words, so it sets their entire sense of the company. And it runs harsh: an objection stated in a form a knowledgeable reader can refute in one press release is an objection that dies on contact, in the one section whose purpose is proving the article argues fairly against itself.
- **Evidence / confidence:** **High** that "a few dozen" is contradicted; **medium** on the revenue-weighted version, which is why the repair states exposure rather than a figure.
- **Minimum repair:** Re-anchor the argument on revenue rather than headcount — European concentration (~60% of revenue) and large government contracts, which the packet supports (S-30, S-33). If the objection does not survive removing the number, the objection _was_ the number.
- **Reader benefit:** The concentration risk, which is real, survives; the section stops being refutable by a single press release.
- **At risk:** Nothing. Net word cost ~0.
- **Acceptance test:** No customer or client count appears in the article unless it matches a cited source; the concentration argument reads correctly with the number removed.

### P0-09 — "Own the physical layer outright" omits the creditors and the vendor, in the load-bearing tiebreaker

- **Origin:** CRITIC-B4 (single perspective, in-lane, independently sourced). **Re-verified this run.**
- **Location / passage:** Diagnosis tiebreaker (line 184): _"He raised the largest round in European history to **own the physical layer outright**, and gave away the model weights so nobody could revoke them from his customers. Owning the wires and making the product non-confiscatable is a security architecture… it buys what withdrawal cannot: **nobody's permission**."_
- **Adjudicated problem:** This is the load-bearing claim of the entire Six-vs-Five tiebreaker, stated as accomplished fact in absolute terms. The record shows two live permissions in the exact place the article says there are none. **Verified independently for this synthesis:** Mistral raised **$830M in debt financing (March 2026) from a seven-bank consortium** — Bpifrance, BNP Paribas, Crédit Agricole CIB, HSBC, La Banque Postale, MUFG and Natixis CIB — to fund a **44MW** facility at **Bruyères-le-Châtel** specified around **~13,800 Nvidia GB300 GPUs**. Debt carries covenants and creditors by definition; the "owned" layer runs on a single American supplier's silicon; and Mensch has said his own chips "may come" and "should come at some point." The disconfirming material is already in the writer's hands — the draft's own opening paragraph names Samsung, BlackRock and Luxembourg, and its own `citations:` list carries the CNBC chips article — and it is coded throughout as achievement ("the French state, Brussels, Nvidia, ASML, Samsung") rather than ever as cost. I promoted this from a single review because the underlying facts check out across multiple independent outlets and because the word "outright" makes an absolute claim the record contradicts.
- **Evidence / confidence:** **High.** CNBC, TechCrunch, TNW, DataCenterDynamics (2026-03-30) converge on the amount, the seven banks, the GPU count and the site.
- **Minimum repair:** Qualify the absolutes in the diagnosis: he bought _more_ of the stack, not the stack "outright," and reduced revocability rather than eliminating permission. A qualified claim about _reducing_ revocability is true where an absolute one is not — which makes the surviving thesis more defensible, not less. (The critic-section objection this opens up is P1-01.) The closing section's absolutist framing is deliberately **not** included here; see RQ-03 and Conflicts #7.
- **Reader benefit:** Pre-empts the objection any informed AI-industry reader raises first, at the moment the article makes its biggest claim.
- **At risk:** The rhetorical force of the tiebreaker, and PROTECT-11 (the closing lines), which are untouched by this repair. Net word cost ~10.
- **Acceptance test:** The word "outright" at line 184 is removed or qualified, and no sentence in the diagnosis asserts that nobody holds a permission over Mistral's infrastructure.

### P0-10 — The phobic/counterphobic payoff contradicts the published 9takes Type 6 pillar, including its structured data

- **Origin:** ENN-R1 (blocker). Packet CLM-17, **CONTRADICTS the 9takes Type 6 pillar**. **Verified independently in the repo for this synthesis.**
- **Location / passage:** Electrician § (line 228): _"Those are the two faces of a Six… **Most Sixes lean one way. Mensch runs both:** the shy register in every room, and a thirty-month-old French company raising three billion euros…"_
- **Adjudicated problem:** `src/blog/enneagram/enneagram-type-6.md:226` states the opposite: _"Most Sixes contain both tendencies, shifting between them depending on domain. You might be counterphobic at work… but phobic in relationships… The core fear is identical. The coping strategy varies."_ The same claim is emitted again in the pillar's FAQPage JSON-LD at line 616 — so it is published as structured data, not just body copy. Standard Riso-Hudson and Naranjo treatments agree with the pillar. The draft manufactures distinctiveness out of what 9takes itself calls typical, as a section payoff, and a reader who follows the site's own Enneagram navigation lands on the contradiction.
- **Evidence / confidence:** **High.** Verified directly in the repo, twice, including in structured data.
- **Minimum repair:** Drop the rarity claim; keep the observation, using the pillar's own domain framing. Sixes run both registers; what identifies a given Six is _which domain gets which_. Mensch's split runs along the person/market seam — fear-management in the room, fear-confrontation in the capital markets.
- **Reader benefit:** The observation gets sharper, not weaker, and the page stops fighting its own pillar. (Note: this sentence also carries the P0-02 "thirty-month" error; fix both in one edit.)
- **At risk:** The section payoff — preserved, because the domain-split claim is more specific than the rarity claim it replaces.
- **Acceptance test:** The passage asserts no claim about how rare the dual register is; a reader clicking through to `/enneagram-corner/enneagram-type-6` finds the two pages in agreement.

### P0-11 — The Five/Six tiebreaker's second half is refuted by the page it links to

- **Origin:** ENN-R2 (blocker); packet Unresolved #5 raises the same weakness from the structural side. **Verified independently in the repo for this synthesis.**
- **Location / passage:** Diagnosis (line 186): _"The second half is who he does it with. **Fives work alone by preference**; Mensch is the most alliance-dense founder in frontier AI… **A Five reduces the number of people whose behavior he has to trust.**"_
- **Adjudicated problem:** Two paragraphs earlier the draft links to Demis Hassabis as a corpus Five. `src/blog/people/drafts/Demis-Hassabis.md:301` types him **5w6** and says the wing pairs the Investigator with _"the Six's instinct for alliances, institutions, and worst-case planning,"_ noting he _"built a durable institution rather than a lone-genius practice, negotiated an ethics board and a weapons ban into his own acquisition."_ Line 313 then rejects a Six reading for Hassabis on a **different** ground entirely — _"Hassabis keeps exiting authority structures once they stop serving the question"_ — not on alliance density. So alliance density cannot discriminate 6w5 from 5w6, the house has already said so in print, and the draft supplies the link that takes the reader to the refutation. Compounding it: no source distinguishes chosen coalition-building from the minimum viable partner set for a European frontier lab (RQ-05).
- **Evidence / confidence:** **High** on the internal contradiction, verified in the repo. **Medium** on the structural-necessity objection, which no source resolves.
- **Minimum repair:** Replace half (b) with the discriminator the house already uses and that Mensch's record answers better than Hassabis's: the relationship to authority structures. Hassabis exits them when they stop serving the question; Mensch's answer to CNRS-then-DeepMind was to build a structure no institution above it can dissolve. The draft already contains that sentence, in the CNRS section — promote it into the tiebreaker. **Leave half (a) untouched**; raise-and-own versus withdraw-and-minimize is a real motivational discriminator and it holds.
- **Reader benefit:** The tiebreaker survives a reader clicking the Hassabis link, and discriminates on motive rather than on a behaviour both types produce.
- **At risk:** PROTECT-04 and the co-founder material — Lample and Lacroix should stay in the paragraph as colour even once they stop carrying the discriminating weight (see P2-05). Net word cost ~0.
- **Acceptance test:** The tiebreaker's second half no longer asserts that Fives are alliance-sparse, and it names a behaviour the linked Hassabis page does not attribute to a Five.

### P0-12 — The diagnostic hinge makes a totalizing claim about a living person, and the only hedge is filed behind a "skip this" instruction

- **Origin:** CRITIC-C1, SUBJ-C1, ENN-M4/C1, UNFAM-C2 (4 perspectives); calibration half from UNFAM-C5, SUBJ-I3, ENN (Jarring). Packet: this move "is interpretation, and it is the hinge of the entire diagnosis."
- **Location / passage:** Diagnosis (line 176): _"As procurement advice this is unremarkable. As a description of what a person is afraid of, **it is the whole man**."_ Against the Rabbit Hole (line 312): _"Call the confidence medium-high, and treat the Five case as live"_ — inside a panel introduced _"Skip if you're not deep into the system."_
- **Adjudicated problem:** Four words undo several thousand words of careful complexity. The source is a CEO on a technology podcast making an enterprise-sales argument to buyers, and the packet is explicit that these quotes cannot support "that this vocabulary reflects a personal psychological fear rather than a procurement argument aimed at enterprise buyers." The draft converts the first reading into the second in one sentence and asserts totality. Compounding it: the body states the type flatly, calls one quote "the whole man," and presents the tiebreaker as decisive, while the article's only confidence hedge sits in the one section readers are explicitly told to skip. The reader least able to calibrate the claim is the reader most reliably steered away from the calibration. The draft's own working notes concede "medium-high, not high" and "flagged for human review"; the reader never sees that.
- **Evidence / confidence:** **High** that the phrasing overclaims and that the hedge is misplaced; the underlying reading remains reasonable and is not in dispute.
- **Minimum repair:** Two edits, both small. (1) Downgrade the totality without losing the insight — a claim about what he organises against, not about all of him. (2) Move one hedging clause into the body of the diagnosis: this is a reading of public evidence with a live Type 5 alternative, at medium-high confidence. Keep the detailed adjudication in the Rabbit Hole. (The objection itself is stated and answered in the critic section under P1-05.)
- **Reader benefit:** The certainty a reader takes away matches the certainty the evidence supports — which is the whole of what a living subject can reasonably ask of a typing.
- **At risk:** PROTECT-15 (the Rabbit Hole quarantine) — move the hedge _out_, keep the skip instruction. PROTECT-08 — do not lower confidence below medium-high either; ENN would accept lower, but the corpus convention and the draft's own position are medium-high. Word cost ~15.
- **Acceptance test:** No sentence claims a single quotation, fear or wound constitutes the whole person (search "whole man," "all of him," "everything about him"). A reader who skips the Rabbit Hole as instructed still learns the typing is a reasoned hypothesis with a live alternative.

---

## P1 — accepted high-value improvements

### P1-01 — Add the infrastructure and state dependency to the critic section as a real objection

- **Origin:** CRITIC-B4 (second half), CRITIC-C6.
- **Location / passage:** Critic § (line 325): _"A company whose deepest moat is the favor of European governments has a vendor too. It just holds elections."_
- **Adjudicated problem:** The state-dependency objection is asserted and closed in the same breath — no contracts named, no ministry, no revenue mix — and the closing clause quietly resolves it in his favour (a vendor that holds elections is a _better_ vendor). Meanwhile the strongest available objection is absent entirely: the "owned" wires are bank-financed and Nvidia-powered (see P0-09).
- **Evidence / confidence:** $830M seven-bank debt and ~13,800 Nvidia GB300s re-verified this run; French government contracts and the January 2025 armed-forces cooperation statement, plus ~60% European revenue, in the packet (S-30, S-33). **High.**
- **Minimum repair:** One combined dependency paragraph, ~50 words: the data centre is leveraged, the silicon is Nvidia's, the man whose argument is that no foreign entity should hold the switch took Korean-led capital to buy American chips on French bank debt and says his own chips "may come" — plus one concrete state relationship. Either cut "It just holds elections" or answer it; do not let it be the exit.
- **Reader benefit:** Closes the largest hole in the critic section and pre-empts the first objection an informed reader raises.
- **At risk:** Word budget (~50 added). Fund from P0-03's deletion and the deflation-inventory trim.
- **Acceptance test:** The critic section names Nvidia dependency or debt financing as a limit on the ownership claim, and names at least one concrete state relationship. Searching the draft for "Nvidia" returns an occurrence outside the alliance list and the Macron quote.

### P1-02 — Scope and date-bind the benchmark claim

- **Origin:** CRITIC-C5, SUBJ-C9, FAN-C5, FUTURE-C4 (4 perspectives). Packet CLM-22, **PARTIALLY SUPPORTED**.
- **Location / passage:** Critic § (line 323): _"Mistral's models trail the American labs on most public benchmarks, and Mensch concedes the gap rather than disputing it."_
- **Adjudicated problem:** Coverage converges on Mistral trailing on the hardest reasoning, research and advanced-maths benchmarks while remaining competitive with GPT-4o- and Claude-3.5-Sonnet-class models on many standard general-purpose ones. The flat formulation is harder on him than the evidence supports — and it is immediately cashed as a character credit, so an exaggerated weakness becomes evidence of his candour. It is also undated, in the fastest-decaying claim category in AI journalism.
- **Evidence / confidence:** **Medium-high** — the packet's supporting sources are Tier 3/4, used to qualify rather than establish. His own verified concession is "Mistral does not yet own the best language models."
- **Minimum repair:** Narrow to the hardest reasoning and maths benchmarks, add an as-of date, and attach the candour credit only to what he actually conceded.
- **Reader benefit:** A precise concession reads as informed; a vague one reads as ritual — and the sentence stops being falsifiable-on-sight.
- **At risk:** Nothing. Net word cost ~5.
- **Acceptance test:** The competitive-standing claim carries an as-of date and names the benchmark class; the sentence remains true if Mistral's standing improves.

### P1-03 — Quote only the verified half of the Mairal testimony

- **Origin:** SUBJ-C7, FAN-C6, ENN-C3/Q3, UNFAM-Q2, CRITIC-Q3 (5 perspectives). Packet CLM-10, **PARTIALLY UNVERIFIED**; Disputes #3.
- **Location / passage:** CNRS § (line 194) and critic § (line 329): Mairal, _"He is very scientifically honest. **That's a real difference from other AI entrepreneurs.**"_
- **Adjudicated problem:** The comparative clause does double duty — it praises him by denigrating unnamed competitors, and it closes the critic section as the article's final rebuttal. The only accessible reproduction of the Le Figaro profile pairs "Il est très honnête scientifiquement" with **"très pragmatique dans son discours"**, not with the comparative clause. If the clause is an artifact, the article has put a swipe at his industry peers into the mouth of a named Inria researcher and then leaned its fairness argument on it — a liability for Mairal, for the article and for the subject.
- **Evidence / confidence:** **Medium-high** that the clause is unconfirmed; it may well appear in the paywalled original. Le Figaro was not read at source by any artifact in this pipeline.
- **Minimum repair, conditional:** Unless RQ-02 resolves affirmatively before publish, quote only the verified clause ("He is very scientifically honest") in both locations. The critic-section rebuttal works on that alone; it does not need the comparison.
- **Reader benefit:** The strongest character endorsement in the piece stops being the weakest-sourced.
- **At risk:** The critic section's closing beat, which survives on the Chinchilla-dates argument (PROTECT-04). Word cost negative.
- **Acceptance test:** Both instances quote only clauses reproduced in an accessible source, or the paywalled original is read and logged in the research file.

### P1-04 — Narrow the Chinchilla rebuttal to what Chinchilla shows, and fix "American lab"

- **Origin:** CRITIC-C3, FAN-C3. Packet Disputes #1, CLM-14.
- **Location / passage:** Critic § (line 329): _"He co-authored Chinchilla in 2022, inside a **closed American lab**… Efficiency beating brute size was his scientific position before it was his commercial position."_ Deployed against line 323's self-serving-argument charge.
- **Adjudicated problem:** Two issues in one paragraph. **(a)** Chinchilla is a result about the optimal allocation of a _fixed_ compute budget between parameters and tokens; its practical consequence was that labs kept scaling compute while shifting the mix. It does not underwrite "spending does not decide the outcome," which is the objection on the table. He was also third of 22 authors, unmentioned while the finding is treated as his personal position. **(b)** DeepMind is London-headquartered and Alphabet-owned, and he worked in its **Paris** office — a fact the draft itself establishes at line 204. Flattening that to "American" in a piece about European sovereignty is a self-contradiction in the draft's strongest rebuttal paragraph.
- **Evidence / confidence:** **High** on both.
- **Minimum repair:** Limit the claim to the efficiency commitment being documented before he had a company needing it, and drop the implication that it establishes the commoditization thesis. Change "closed American lab" to "a US-owned lab" or "DeepMind." **Keep the concession clause verbatim** — it is what makes the paragraph work.
- **Reader benefit:** The move survives scrutiny from anyone with ML literacy, which is a meaningful share of this audience.
- **At risk:** PROTECT-04 — the concession clause is untouchable. Net word cost ~0.
- **Acceptance test:** The paragraph no longer asserts or implies that Chinchilla supports "spending does not decide the outcome"; the phrase "American lab" is gone and the sentence is consistent with "joining the Paris office in late 2020."

### P1-05 — State and answer the "this is sales positioning, not psychology" objection

- **Origin:** CRITIC-C1, UNFAM-C2; ENN-C1 supplies the strongest version of the answer.
- **Location / passage:** Critic §, as a new objection; paired with the P0-12 repair at line 176.
- **Adjudicated problem:** The critic section attacks whether his commoditization _claim_ is sincere. It never attacks whether the _inference from his sales vocabulary to his psychology_ is licensed. Those are different objections and only the weaker is answered. The skeptical reading — any open-weights vendor of any type produces this vocabulary — is never stated anywhere in the draft, so a skeptic dismisses the hinge rather than engaging it.
- **Evidence / confidence:** **High** that the objection is unaddressed; **medium-high** that the available counter suffices. The counter is already in the draft: the same vocabulary appears where no enterprise buyer is present — the defence-systems analogy, the Polytechnique talk to students, the Le Monde origin-story refusal. RQ-03 would upgrade this from adequate to strong.
- **Minimum repair:** Two sentences in the critic section: name the objection, answer it by citing at least one non-commercial context.
- **Reader benefit:** Converts the article's most exposed claim from an assertion a skeptic dismisses into an argument a skeptic has to engage — at the exact moment the thesis is introduced.
- **At risk:** Word budget (~50 added).
- **Acceptance test:** The critic section contains an objection of the form "this is sales positioning, not psychology," and a response citing at least one named non-commercial setting.

### P1-06 — Name one behaviour Type 6 does not explain

- **Origin:** SUBJ-I5, ENN-C8 (2 perspectives). Packet, "Behavior the type does not explain."
- **Location / passage:** Critic § or the Rabbit Hole counterargument block. Absent throughout.
- **Adjudicated problem:** The engine explains the open weights, the €3B raise, the deflation habit, the origin-myth refusal, the electrician frame, the CNRS arc, the marathon and the response to the Microsoft backlash. A type that explains everything has stopped being a diagnosis. The named falsifier is a different instrument — it asks what would overturn the call, not what the call leaves unexplained.
- **Evidence / confidence:** **High** that the omission exists; **medium** that February 2024 is the best candidate. The draft types his _response_ to the fallout, fairly and well; it never concedes that the underlying decision to ship a closed flagship first on an American hyperscaler is explained at least as economically by ordinary commercial opportunism, which no Six-specific prediction would have produced.
- **Minimum repair:** One or two sentences naming it, without immediately reabsorbing it.
- **Reader benefit:** Removes the strongest structural objection to any Enneagram profile — that the lens absorbs all evidence — at a cost of one sentence, and it is the concession most likely to earn a sceptical reader's respect.
- **At risk:** Word budget (~25 added).
- **Acceptance test:** The article states at least one Mensch behaviour that Type 6 does not uniquely predict.

### P1-07 — Rabbit Hole theory pass: arrows, the Type 8 test, and the instinctual stack

- **Origin:** ENN-C2, ENN-C3, ENN-C4, ENN-C5, ENN-C6. Verified against the pillar in the repo for this synthesis.
- **Location / passage:** Rabbit Hole (lines 300–306).
- **Adjudicated problem, four bundled defects.** **(a)** _One observable, two contradictory jobs._ His measured manner is assigned to phobic presentation (fear managed by staying small) in the body and to the Nine growth arrow (anxiety released) in the Rabbit Hole. Both cannot be true; the phobic reading is better supported. **(b)** _Growth-arrow evidence misfits the house definition._ The pillar defines the Nine arrow as inner calm as a state, trust in process and "internal authority that doesn't require external validation." Scientific honesty is not a Nine quality — and the Mairal sentence carrying it is P1-03's unverified clause, describing a doctoral student aged ~23–26, years before any pressure an integration reading responds to. **(c)** _Stress-arrow evidence does not discriminate._ Working through holidays in a startup's first four months and quoting ARR at a funding announcement describe every venture-backed founder of any type; the pillar's Three-arrow signature is specifically image management. And "the typing holds rather than collapsing into an actual Three" misstates arrow theory — movement along an arrow never converts a type. **(d)** _Type 8 is never tested_, and `enneagram-type-6.md:495-500` names Eight as _the_ mistyping risk for counterphobic Sixes (Five is not listed at all), while the body asserts a counterphobic register. **(e)** _The instinctual stack maps corporate policy onto personal instinct_ — "the capital-efficiency obsession" is a business decision, not a self-preservation instinct; the marathon is legitimate self-pres evidence and should carry it alone.
- **Evidence / confidence:** **High** on (a)–(d), verified against the pillar; **medium-high** on (e).
- **Minimum repair:** Cut the calm and the Mairal sentence from the growth-arrow paragraph, keeping the two items that fit the pillar (holding an unpopular position without escalating; conceding the benchmark gap). Either supply image-management evidence for the Three arrow — the February 2024 "creative interpretations" response is a plausible candidate — or say plainly the record is thin there, and drop the "collapsing into" clause. Add one or two sentences dismissing Eight on the pillar's own test: felt power versus felt vulnerability. Cut "the capital-efficiency obsession" from the instinct sentence.
- **Reader benefit:** The Rabbit Hole shrinks, gets stronger, stops leaning on an unverified quote, and becomes complete against the house's own risk list. The Eight dismissal doubles as another statement of the engine.
- **At risk:** PROTECT-13 (corpus differentiation) and the social-dominant subtype call, both untouched. Net word cost ~0 to negative.
- **Acceptance test:** His manner is assigned exactly one theoretical function in the article; every growth-arrow item maps to a named element of the pillar's integration description; stress-arrow evidence is image-management-specific or explicitly declared thin; no sentence implies a type could convert into its stress point; the counterarguments section addresses Eight; every instinctual-stack item describes something Mensch does with his own time, body, money or attention.

### P1-08 — Attribute the facts to him and the debt framing to the writer

- **Origin:** SUBJ-C4.
- **Location / passage:** TL;DR (line 163): _"The unpaid debt: … he says out loud that he owes them."_ CNRS § (line 206): _"He is one of the very few founders who says out loud what he owes the state: Mistral owes a great deal to France."_
- **Adjudicated problem:** Both present a confession of debt as something he says. What he verifiably says is flatter and different: that all three founders did their studies in the French public system, and — to students — "Do I choose to innovate, to contribute to the power of the country where I was born and educated?" No verified quotation uses the language of debt or obligation. "Owes," "unpaid debt" and "what he owes the state" are the article's framing, and they are exactly what the social-Six reading needs. Attributing the frame to his mouth removes the reader's ability to judge whether the inference is earned.
- **Evidence / confidence:** **High** — the divergence between the verified quotes and the attributed posture is plain in the packet's first-person section.
- **Minimum repair:** Attribute the facts to him and the frame to the writer, visibly as inference. The evidence stays; the reader can now see it is an inference.
- **Reader benefit:** Preserves the strongest social-instinct evidence while restoring the line between what he said and what the article concludes.
- **At risk:** Nothing. Net word cost ~0.
- **Acceptance test:** Every "he says" / "he says out loud" in the article is followed by something traceable to a quotation, not to a characterisation.

### P1-09 — Remove the unhedged wealth epithet from a paraphrased interview question

- **Origin:** SUBJ-C8.
- **Location / passage:** CNRS § (line 196): _"\"Not at all,\" Varoquaux said, asked whether **the future billionaire founder** was visible back then."_
- **Adjudicated problem:** Two problems in one clause. It asserts billionaire status as plain fact when the basis is a paper estimate of illiquid private stock in a company with no exit — a guardrail inherited from the entity-gap packet. And it characterises the question put to Varoquaux as being about wealth, when he was asked whether the _entrepreneurial talent_ was visible. The draft's own working notes claim net worth appears "explicitly as a reported estimate"; in reader-visible copy it appears as an unhedged epithet, and it is the one place the article's otherwise exemplary money discipline slips.
- **Evidence / confidence:** **High** on both counts; SUBJ verified the absence of any hedged net-worth sentence in the repo.
- **Minimum repair:** "asked whether the founder was visible in the doctoral student." Drops the wealth claim and restores what was asked.
- **Reader benefit:** Brings the one slip into line with the private-life discipline the rest of the article earns its credibility by maintaining.
- **At risk:** PROTECT-10 — repair toward that standard, not away from it. Net word cost negative.
- **Acceptance test:** No reader-visible sentence asserts personal wealth as fact without the estimate framing; no paraphrased interview question adds a subject the original did not contain.

### P1-10 — Cut the causal clause from the inner-thought panel

- **Origin:** SUBJ-C3. **See Conflicts #2** — this is the one item where an accepted repair touches a passage four evaluators preserve-listed.
- **Location / passage:** CNRS § (line 202): _"The letter says yes. It said no last year, and **nothing about me has changed since last year except that somebody else already decided I was worth hiring.**"_
- **Adjudicated problem:** The device itself is house-sanctioned, renders as a visibly imagined thought (verified in `src/scss/blog.scss:630` by two evaluators), and is not in question. Its content is. It has him conclude that CNRS's second decision was _caused_ by Google's interest — a cynical theory of a named public institution's selection process that no source supports and he has never expressed. And "nothing about me has changed since last year" is contradicted by the packet's own timeline: between applications he was a postdoc at ENS Paris and spent several months at NYU Courant with Joan Bruna.
- **Evidence / confidence:** **High** on the factual problem; **medium-high** on the imputation, which is a fairness judgement.
- **Minimum repair:** Keep the panel, its formatting, its placement and its first two beats. Cut the causal clause. SUBJ's proposed replacement preserves the felt moment while removing both the imputation and the false self-assessment.
- **Reader benefit:** The piece keeps its only interior beat — genuinely its most affecting passage — without inventing a grievance he has not voiced about an institution he has publicly said he owes.
- **At risk:** **PROTECT-01, directly.** The panel's form, voice, tone and placement are protected; only the causal clause changes. A revision that rewrites the panel wholesale is a net loss.
- **Acceptance test:** No imagined interior content asserts a cause for a third party's decision, or a fact about his own history the timeline contradicts. The panel is still one short first-person paragraph in the same location, in the same register.

### P1-11 — Say what Mistral makes, in one clause, in the first two paragraphs

- **Origin:** UNFAM-C1 (single perspective, squarely in-lane).
- **Location / passage:** Intro (line 145), and the article as a whole.
- **Adjudicated problem:** A reader is asked to care about a €21B company for 3,900 words without being told what it produces. "Model," "weights" and "the product he sells" carry the entire load; a grep returns zero instances of "assistant," "chatbot," "large language model" or any product name. This makes the sovereignty argument abstract, because the reader cannot picture the thing being made sovereign. UNFAM verified this is a genuine draft omission, not unfamiliarity — the packet does not name the product line either.
- **Evidence / confidence:** **High.**
- **Minimum repair:** One clause at first mention naming what the company makes. Keep it to the noun; this is orientation, not biography.
- **Reader benefit:** A novice can picture the product before being asked to care who controls it. This is the cheapest comprehension win available.
- **At risk:** Word budget (~20 added). **Note:** FAN-C8's related request — a consumer-product beat in the critic section — is **rejected** (see Rejected feedback); this item is orientation only.
- **Acceptance test:** A reader who has never heard of Mistral can, after the first two paragraphs, name one thing the company makes.

### P1-12 — Citation hygiene: add the load-bearing sources, drop the orphan

- **Origin:** FUTURE-C6.
- **Location / passage:** Frontmatter `citations:` (lines 48–59).
- **Adjudicated problem:** **Le Figaro (2025-09-21, Adrien Bez) is not in `citations:` at all** — yet it is the sole source for the CNRS spine, all three supervisors' quotes, the marathon and "almost shy," and the draft's own working notes call it "the key third-party source." The page's single most valuable and least reproducible asset ships pointing nowhere. Meanwhile `cnbc.com/2026/05/28/…design-chips…` remains listed although the second-pass notes record that the chips row was cut — a citation supporting a claim no longer in the body.
- **Evidence / confidence:** **High** — verified by reading the frontmatter against the packet's source ledger.
- **Minimum repair:** Add the Le Figaro profile and the Mistral Large 3 first-party announcement (`https://mistral.ai/news/mistral-3/`, required by P0-04). Record the accessible reproduction alongside Le Figaro in the research file as the mirror. Drop the orphaned chips citation — or keep it, if P1-01 reintroduces the chips dependency, in which case it is no longer orphaned.
- **Reader benefit:** The claims that could not be rebuilt if a source disappeared become the ones with recorded provenance.
- **At risk:** Nothing — frontmatter, not body copy, so no word cost.
- **Acceptance test:** Every claim the article could not reconstruct without one specific source has that source in `citations:`; no entry in `citations:` supports a claim absent from the body.

### P1-13 — Fix the marathon duration it contradicts one sentence later

- **Origin:** SUBJ-C11.
- **Location / passage:** Electrician § (line 224): _"he ran the Paris Marathon in under three hours thirty. … You post it by refusing to spend energy you have not budgeted, **for four hours**, while people who feel wonderful pass you early."_
- **Adjudicated problem:** The sentence explaining his result misstates it by half an hour, and the gap is precisely the achievement. It is his personal record, the article's only physical detail about him, and the kind of slip that makes a reader wonder whether the writer registered the number.
- **Evidence / confidence:** **High** — internal contradiction between two consecutive sentences. The time itself is single-sourced to Le Figaro and should stay hedged to that source.
- **Minimum repair:** "for three and a half hours."
- **Reader benefit:** A genuinely good observation stops undercutting the fact it is built on.
- **At risk:** PROTECT-14 — the observation is preserved; only the duration changes. Net word cost ~0.
- **Acceptance test:** Every elapsed-duration restatement matches the figure in the preceding sentence.

### P1-14 — Stop presenting an aggregator-sourced line as his own formulation

- **Origin:** SUBJ-C5. Packet CLM-20, **NOT PRIMARY-SOURCED**.
- **Location / passage:** Electrician § (line 218): _"He has since **put the ambition in one line**: Mistral wants to be the most capital-efficient company in AI, and that is the reason it exists."_
- **Adjudicated problem:** "Put the ambition in one line" promises his words. The line is unquoted, so it is not technically a quotation, but the construction invites the reader to hear it as one — and it is the article's crispest statement of his strategy. The packet could not trace it to a primary source; the research file attributes it to Contrary Research, an aggregator.
- **Evidence / confidence:** **High** that it is not primary-sourced; the underlying idea is well attested.
- **Minimum repair:** Use the verified Elad Gil quotation he did say — "We first focused on efficiency to be able to train models more efficiently than what was currently done" — or keep the capital-efficiency line and attribute it honestly as the company's positioning rather than his sentence.
- **Reader benefit:** Removes a near-quotation with no primary source from a passage about his intellectual honesty.
- **At risk:** Nothing. Net word cost ~0.
- **Acceptance test:** Any sentence introduced as his formulation, quoted or not, resolves to a primary source.

### P1-15 — Mark the ARR figure as the forecast it was

- **Origin:** FUTURE-C3. Packet CLM-16, "substantially true; attribution timing loose."
- **Location / passage:** Critic § (line 323): _"he told CNBC in September 2026 that Mistral **would pass** a billion dollars in annual recurring revenue before year end."_
- **Adjudicated problem:** The packet records his actual framing as explicitly conditional — he expects "to be beating" the figure "if everything happens as they are trending" — and notes CNBC returns HTTP 403, so the wording reached the draft only through a search summary. The draft renders a hedged projection as a flat statement of what he said, in the section that most needs to be scrupulous, and it resolves by December 2026.
- **Evidence / confidence:** **High.**
- **Minimum repair:** Mark it as a forecast made on a date, and let the realized trajectory (~$16M end-2024 → ~$312M Dec 2025 → ~$400M Jan 2026) carry the "revenue is real" claim, since past figures never expire.
- **Reader benefit:** The concession survives either outcome, and the article stops asserting a number a future reader can check against a result it does not know.
- **At risk:** Nothing. Net word cost ~5.
- **Acceptance test:** No forward-looking financial statement is phrased as established fact; the concentration argument reads correctly whether or not the $1B target was met.

### P1-16 — Fix the GAFAM sentence: attribution chain and gloss

- **Origin:** SUBJ-C6 (attribution), UNFAM-C4 (gloss). Packet CLM-23, Disputes #4.
- **Location / passage:** CNRS § (line 204): _"\"I did not want to develop opaque technology inside the GAFAM.\" (Translated from the French.)"_
- **Adjudicated problem:** Two problems in one sentence, best fixed together. **(a)** This is the sharpest thing the article has him say about his employer of two and a half years, and the parenthetical asserts a provenance that may be wrong: the packet verifies the sentence as printed in Le Figaro but records that **Le Figaro attributes it to the Wall Street Journal**. If the original was given to the WSJ in English, the article presents a back-translation as his phrasing while telling the reader it is a translation of his French. **(b)** GAFAM is a French coinage with essentially no English currency, sitting inside the quote that explains why he left the most prestigious job in his field — and the draft flags the sentence as translated while leaving untranslated the one word that most needed it.
- **Evidence / confidence:** **Medium-high** on the translation chain (the WSJ original was not located); **high** on the gloss.
- **Minimum repair:** Attribute as printed — as quoted in Le Figaro, citing the Wall Street Journal — and drop the translation flag unless the French original is confirmed as the original. Bracket the gloss inside the quote: "inside the GAFAM [the American tech giants]." If the WSJ wording can be retrieved, use it verbatim; this repair does not require that.
- **Reader benefit:** The article stops vouching for a translation chain it has not verified, on a quotation aimed at a named former employer — and a novice can parse the pivotal career turn.
- **At risk:** Nothing. Net word cost ~5.
- **Acceptance test:** Every "(Translated from the French.)" flag corresponds to a quotation whose French original is in the research file; GAFAM is glossed at first use.

---

## P2 — optional opportunities

- **P2-01 — Name Mistral 7B; the magnet link was a policy, not a one-off.** _(FAN-C1, FAN-C2.)_ The Mixtral scene is written as a singular gesture; it was the second. Mistral 7B went out the same way on 2023-09-27 — bare magnet link, no commentary — and it is the drop that made Mistral's name in this community. It appears nowhere in the draft. One clause converts a stunt into a pattern, which is what the argument actually needs, and signals to the fan target that the writer was there. Bundle with time-bounding "No blog post. No demo, no paper, no launch event" — the full write-up followed 2023-12-11 and the paper in January 2024, so "for three days, that was the entire announcement" keeps the effect and removes a falsifiable overstatement. **This is the highest-value P2** and the one the revision brief should take if the budget allows (~20 words).
- **P2-02 — Gloss the remaining jargon.** _(UNFAM-C4.)_ Single unglossed occurrences of MEP, hyperscaler and "foundation model"; AGI twice, never expanded. Expand MEPs at first use, replace "hyperscaler" with "cloud provider," expand AGI once. Four comprehension stumbles at negligible cost. (GAFAM is handled in P1-16.)
- **P2-03 — Date-bind the European record in the tiebreaker.** _(FUTURE-C2.)_ The intro and table instances are date-anchored; the diagnosis instance ("the largest round in European history") is not, and it is the one a reader meets as psychological evidence. Eight European startups closed $1bn+ rounds in H1 2026 alone, and Mistral's own September cadence makes it the likeliest breaker. The tiebreaker needs the size and purpose of the raise, not the record. **Word-neutral.**
- **P2-04 — Drop the corpus count, keep the names.** _(FUTURE-C7.)_ "Three of the four other frontier-AI founders profiled on 9takes read as Fives… Only Alexandr Wang sits outside it" is arithmetic about 9takes' own inventory sitting inside the tiebreaker. Publishing a fifth frontier-builder — the pipeline's ordinary output, driven by the repo's own `find-emerging-entity-gaps` and `find-surging-people` commands — silently falsifies it. Naming Hassabis, Amodei and Liang Wenfeng with Wang as the exception stays true as the corpus grows. **Word-negative, so it rides free.**
- **P2-05 — Give the two co-founders one sentence of their own.** _(SUBJ-I1, FAN's expectation.)_ Lample and Lacroix appear once as tiebreaker evidence, and the CNRS section says "all three of its founders were educated entirely inside the French public system" before the reader knows who the other two are. One sentence on what they left — both departed Meta's LLaMA team — makes the alliance material a story about three people rather than an assertion about one. Lower priority once P0-11 moves the discriminating weight off alliance density, but the colour still pays.
- **P2-06 — Thin the surplus revocation-motif restatements in the last third.** _(UNFAM.)_ Nineteen instances of the revocation family across the body; most are earned, since it is the spine, but the closing-stretch repetitions tell the reader something understood five sections earlier. **This is a funding source for the budget, not a cost.**
- **P2-07 — Fix the agency inversion at the decisive moment.** _(CRITIC-C2.)_ "That is a man watching the thing he warns everyone else about get attached to his own name" makes Mensch the observer of an event he authored, sitting immediately after the MEP referral — exactly where the reader is deciding whether the writer will hold the subject responsible. One sentence in active voice, naming the choice before the fallout. The critic itself demoted this to a concern because a defender has an available counter-reading; it costs nothing and buys the section standing.

---

## Research required before deciding

**RQ-01 — Open the Eric Jang permalink.**
_Exact question:_ Does `x.com/ericjang11/status/1733164335084814578` resolve to a post dated 2023-12-08 containing "releases 87GB torrent containing 8x 7B MoE model via tweet, refuses to elaborate"?
_Why it matters:_ Selects between P0-07's two branches. If it resolves, name Eric Jang and add the permalink to `citations:` — the stronger outcome, since the line is recognisable to the fan target. If it cannot be opened, take the fallback and drop the attribution.
_Source:_ the permalink itself. CRITIC and FAN converged on this independently; neither opened it.

**RQ-02 — Read the full Le Figaro profile at source (2025-09-21, Adrien Bez).**
_Exact question:_ Does the printed text contain Mairal's "C'est une vraie différence avec d'autres entrepreneurs de l'IA," or does it pair "Il est très honnête scientifiquement" with "très pragmatique dans son discours"?
_Why it matters:_ Resolves P1-03. It is also the sole source for the CNRS spine, the marathon, "presque timide" and the GAFAM chain, and it has never been read directly by any artifact in this pipeline across three passes. **This is the highest-value single source remaining** — one read closes four open items and puts the page's most valuable and least reproducible material on the record (see P1-12).
_Source:_ Le Figaro print/paywalled original, not the Ambition France republication.

**RQ-03 — Mine the National Assembly compte rendu of 2026-05-12.**
_Exact question:_ What did he say, verbatim, before the commission of inquiry into structural digital dependencies — specifically about (a) dependency and vendor control in a room with no buyers in it, and (b) democratic authority over military use of his technology?
_Why it matters:_ Three evaluators found this independently (SUBJ-C2/Q4, ENN-C1/Q1, FUTURE-Q5) and none read the primary. It is the highest-leverage unexploited source in the file. **(a)** upgrades P1-05's answer from adequate to strong by supplying the revocability vocabulary in a non-selling context — the exact confound the diagnostic hinge needs cleared. Reported formulations run sharper than anything the draft uses ("you have no leverage… a vassal state position"). Honest caveat that belongs in any use: a parliamentary hearing is not commercially neutral, since he is addressing the body that regulates him — but it is a context with no customers in it. **(b)** bears on whether the closing section's absolutist framing ("a company whose fate no institution above it can decide," "nobody's permission") needs qualifying: secondary accounts report him saying "The army is sovereign, it has a democratic legitimacy that we do not have," claiming a duty to advise but no right of oversight. If accurate, the sharper version is both more precise and _more_ flattering — he objects to a foreign commercial vendor holding the switch and concedes democratic authority — and it strengthens rather than weakens the Type 6 reading, since a complex relationship with legitimate authority is nearer the house definition than blanket authority-aversion. **Do not quote any of this without the primary.** The hearing may also settle FAN-Q1 (whether the magnet-link distribution was Mensch's own decision, which determines whether the Mixtral scene is company evidence or character evidence) and the CLM-06 truncation.
_Source:_ Assemblée nationale video and the commission's published compte rendu. The repo's quote-pinning method (`yt-dlp` + `youtube-transcript-api`) applies; nothing is currently mined for Mensch in `docs/content-analysis/youtube-transcripts-people/`.

**RQ-04 — Did the European Commission ever respond to the Green MEP letter?**
_Exact question:_ Is there a published Commission answer or decision on the Microsoft–Mistral investment or the March 2024 referral?
_Why it matters:_ Sharpens P0-05 from "never adjudicated" to a stated outcome. If the Commission declined to act, the passage gets a real ending. If it responded adversely, the critic section needs a second adverse fact. FUTURE searched and located no closure; that is negative evidence, not proof.
_Source:_ European Parliament written-questions register (E-series, March 2024, van Sparrentak et al.) and the Commission's published answer; DG COMP case register.

**RQ-05 — Is alliance density temperamental or structurally compelled?**
_Exact question:_ Can a European frontier lab reach the frontier without the state, Nvidia and a hyperscaler-scale capital stack — i.e. is Mensch's partner list a description of him or of the industry?
_Why it matters:_ The packet marks this unresolved and both SUBJ-Q5 and ENN-Q2 name it as the load-bearing unknown under the original tiebreaker. **P0-11's repair sidesteps it** by moving the discriminator to the relationship with authority structures, so this is not blocking — but if a future pass wants to restore any alliance-density argument, this has to be answered first.
_Source:_ Comparative — the partner structures of Aleph Alpha, Stability, Cohere, Black Forest Labs and DeepL at equivalent stages; or a European AI-policy researcher. No source in the packet addresses it.

---

## Conflicts and editorial tradeoffs

**1. The word budget is the binding constraint, and it is already negative.** The body measures 3,893 (cohesion pass) to 3,924 (UNFAM's count) against a 3,200–3,900 band. Accepted P0+P1 repairs net-add roughly **230 words**: Mistral Large 3 (~25), the CMA/Commission clause (~25), the dependency objection (~50), the sales-positioning objection and answer (~50), what-Mistral-makes (~20), what-the-type-doesn't-explain (~25), the body hedge (~15), assorted (~20). **Funding sources, in order:** deleting the seller-quote beat (P0-03, ~40); the deflation inventory in the electrician section, which stacks five items where three would hit harder (fresh-eyes flagged this and it was not taken, ~40); the surplus revocation-motif restatements in the last third (P2-06, ~40); trimming the Five-versus-Six adjudication in the diagnosis (~50, see #3); P1-03, P1-09 and P2-04, all word-negative. That covers it with margin. **This is a real editorial decision and the editor should make it deliberately rather than blowing the band** — the ceiling has already become the target once in this pipeline.

**2. The inner-thought panel: preserved by four, edited by one.** FAN-H2 ("Preserve exactly"), UNFAM-H2, ENN (preserve "exactly as formatted") and FUTURE-H3 all protect this panel; SUBJ-C3 wants its content changed. **Resolution: both, precisely scoped.** The panel's existence, formatting, placement, length and register are protected under PROTECT-01 and must survive untouched. The single causal clause — which imputes to him a cynical theory of CNRS's selection process, and asserts "nothing about me has changed" against a timeline showing a postdoc and a stint at NYU Courant — is the only permitted edit. The three preserve-listers were protecting the _device and the moment_, not adjudicating an unsupported imputation; SUBJ was in-lane on fairness. A wholesale rewrite of the panel is a net loss.

**3. Where the Five/Six adjudication sits.** UNFAM-C3 identifies the 531-word diagnosis section as the abandonment point for a general reader — six unfamiliar proper names and a typology debate before the CNRS story that would buy their attention — and proposes moving the four-founder comparison out. **Resolution: reject the move, accept the trim.** The search-intent H2 must stay first (the heading-mix ledger is a house convention, and a reader arriving from "Arthur Mensch personality type" wants the answer immediately), and the entity-gap packet calls the four-way frontier-builder cross-link the page's most durable value, so the links stay. But UNFAM is right that the adjudication is long, and P0-11 and P0-12 both shorten it. Trimming here funds the budget; moving it would cost the page its stated job.

**4. Two errors run harsh on the subject, and "harsh" is not safe.** "A few dozen" customers (P0-08) and "most public benchmarks" (P1-02) both overstate the case _against_ Mensch. That is not the direction motive-laundering usually runs, and it is tempting to treat it as harmless. It is not: an objection stated in a form a knowledgeable reader can refute is an objection that dies on contact — and one of them is immediately converted into a compliment about his candour, so an exaggerated weakness becomes evidence of his character. In the section whose whole purpose is demonstrating the article argues fairly against itself, overstating against the subject is as much an accuracy failure as flattery.

**5. CLM-07: the packet and the reviewers disagree, and the reviewers win.** The packet graded the Mixtral quotation **UNVERIFIED** with fabricated-quote exposure after four search angles. CRITIC and FAN, working independently and without seeing each other, both attributed it to Eric Jang, with FAN supplying a specific status ID and the full post text. Two independent converging attributions with a permalink outweigh one artifact's failure to locate. **But neither opened the permalink**, so P0-07 ships a safe fallback alongside the preferred branch, and RQ-01 names the one check that settles it. This is the correct shape for a discharged blocker: the charge is retired, the verification is not yet done.

**6. Mistral Large 2 stays; the falsifier moves.** Five evaluators want Mistral Large 3 in the piece. ENN-C7 would also demote Large 2 out of the argument; CRITIC-B2 and FAN-R3 would keep it with its licence named. **Resolution: keep Large 2 in the February 2024 chronology, where it honestly does the job of showing he moved back toward openness, with its licence stated in the same sentence — and move the falsifier rebuttal to Large 3.** That preserves the narrative arc (closed Feb 2024 → research-only July 2024 → Apache 2.0 Dec 2025), which is a _better_ story than the current flat one, and rests the falsifier test on the fact that survives checking.

**7. The closing section's absolutism is deliberately left open.** P0-09 qualifies the diagnosis-level absolutes ("outright," "nobody's permission") because the disconfirming facts are verified. The closing section — "The wires nobody can lock him out of," "a company whose fate no institution above it can decide" — is **not** included, for two reasons. SUBJ both preserve-lists that sentence (H1, for its sequence-not-cause discipline) and asks for it to be qualified (C2), an unresolved tension inside one review; and the evidence that would justify qualifying it is the National Assembly testimony, which no evaluator verified against the primary. **Resolution: leave the closing intact in this revision and reopen it only if RQ-03 comes back with primary-verified testimony.** Do not qualify a protected closing on the strength of secondary blog accounts.

**8. Type confidence: hold at medium-high.** ENN rates the Type 6 call at _medium_ confidence and says it "would not object to the draft lowering its own stated confidence rather than raising its evidence." Every other evaluator protects the medium-high cap as-is. **Resolution: hold at medium-high and do not raise it.** P0-12 surfaces it in the body where readers actually are, which is the real problem; the number itself is defensible and lowering it mid-revision would be a change no evidence in this run compels.

---

## Rejected feedback

- **FAN-C8 — add a consumer-product beat (Le Chat) to the critic section's state-dependency paragraph.** _Rejected as an insertion._ FAN explicitly flags it as "an expectation, not a sourced fact" and asks an editor to verify the specifics first — and the paragraph is already getting its substance from P1-01, which supplies verified facts (bank debt, Nvidia, government contracts, revenue mix). Adding an unverified second instance to the section that most needs to be unimpeachable is exactly the wrong trade, especially at ~50 words in a negative budget. _(UNFAM-C1's orientation clause is accepted separately as P1-11; it is a different ask.)_
- **UNFAM-C3 — move the Five-versus-Six adjudication after the CNRS section.** _Rejected as a move, accepted as a trim._ See Conflicts #3. UNFAM itself grades this "a structural judgment, not a defect" and concedes a search-intent reader may want it early. The H2 order serves the page's stated job.
- **CRITIC's "who bore the cost of the AI Act lobbying."** _Deferred._ The point is fair — the softened foundation-model obligations affect every EU deployer and citizen, not just Mistral's brand — but expanding a personality profile into policy-impact journalism is scope the page does not have, in a budget that is already negative. The February 2024 section is being repaired on four fronts already (P0-05, P0-06, P1-01, P2-07); adding a fifth dimension turns a repair into a rewrite.
- **FUTURE's `changefreq: 'monthly'` observation.** _Rejected / no-op._ FUTURE offers it explicitly as a preference and declines to recommend it, and `lastmod` is user-managed in this repo by standing instruction. Nothing in the review depends on it.
- **Any demand to raise the type confidence, add Enneagram jargon, or resolve the Five case.** _Out of scope by rule._ ENN's own verdict is that the Five case is genuinely live and unresolved by anything found in this run. The hedge is doing real work on an unusually inference-heavy subject.
- **Any demand for condemnation or exoneration.** CRITIC states plainly it is "not asking the draft to conclude that Mensch is insincere"; SUBJ states plainly that a typing disagreement is not a red flag. Neither is asking to change the article's verdict, and no P0 above does.

---

## Protected hits

Ranked by convergence and by what a revision is most likely to damage.

- **PROTECT-01 — The CNRS spine and its inner-thought panel.** _(FAN-H1, SUBJ-H1/H6, UNFAM-H2, ENN, FUTURE-H3 — five perspectives.)_ **The single most important asset on the page.** Rejected, accepted a year later, already leaving; three named supervisors on the record; the only rendered interiority in the piece; closed 2018–2020 history that will still be uniquely valuable in twelve months, when the funding news is cold. Preserve the three-beat rhythm and **the paragraph break before "By then Google DeepMind had made him an offer"** — the break is doing the work. Preserve _"Both happened, in that order, and what he built afterward is a company whose fate no institution above it can decide"_ exactly as careful as it is: it asserts sequence, not cause, at the article's most sensitive inferential moment, and the fairness of the entire section depends on it. If a later pass tightens this into "and so he built," the piece loses its defensibility on its most sensitive claim. P1-10 touches one clause of the panel and nothing else.
- **PROTECT-02 — The depreciation rebuttal.** _(CRITIC-H1.)_ _"A rented cluster and an owned cluster lose value on the same schedule. Only one can be taken away from you."_ The critic's own words: the only passage that defeated an objection they actually held. **Must survive verbatim.** If any cut is needed in that section, take it from elsewhere.
- **PROTECT-03 — The Mixtral torrent scene.** _(ENN-H2, UNFAM-H3, FAN, SUBJ, FUTURE-H8.)_ _"A torrent has no owner. No console to log into and pull Mixtral down, no terms of service to revise, no vendor left to change its mind. He did not describe non-revocability that week. He shipped it."_ Non-revocability shown rather than asserted, including the concession that it reads as a stunt. Only the attribution changes (P0-07).
- **PROTECT-04 — The belief-before-incentive concession.** _(CRITIC-H2, SUBJ-H4, FAN-H4, UNFAM-H7, FUTURE-H4 — five perspectives.)_ _"That does not prove he is right. It does mean the belief arrived before the incentive, which is the most anyone in his position can offer."_ The cap is what makes the argument credible rather than promotional. Keep verbatim even while P1-04 narrows the Chinchilla claim around it.
- **PROTECT-05 — The core-fear formulation.** _(ENN-H1 and UNFAM-H1, both "verbatim.")_ _"The engine is not fear of failure. It is an intolerance for arrangements that can be withdrawn, and a drive to build ground that holds when the people above you change their minds."_ The load-bearing definition for every non-expert reader, and the sentence the whole diagnosis hangs from.
- **PROTECT-06 — The said-versus-signed architecture and the dated ledger table.** _(FUTURE-H1/H2, UNFAM-H4, FAN.)_ _"Everything he says makes the technology smaller. Everything he signs makes his position bigger."_ Outcome-independent — it survives Mistral tripling or collapsing — and the table is the only append-to-update structure in the article. **Keep the February 2024 row**, the one where the columns contradict rather than confirm; it is what stops the table reading as a highlight reel.
- **PROTECT-07 — February 2024 narrated at full length, in the body.** _(CRITIC-H3, FAN-H5.)_ The Brussels campaign, Cédric O's shareholding, France breaking the AI Act deal, the eleven-week gap, the MEP referral, the Trojan-horses report. Most sympathetic profiles would give this two hedged sentences. **Repair the closing moves (P0-05, P0-06); do not touch the reporting or its placement.**
- **PROTECT-08 — The medium-high confidence cap and the named falsifier.** _(CRITIC, ENN, FUTURE-H4.)_ Naming a falsifier is the right instinct even though the current test fails; keep the sentence and fix the test (P0-04). Do not raise the confidence in revision.
- **PROTECT-09 — The fMRI-as-epistemology paragraph.** _(FAN-H3, "highest-value paragraph in the draft.")_ _"…most of what looks like structure is noise and the win comes from a better estimator, never a bigger machine."_ Every other profile treats the doctorate as a credential; this one treats it as a way of seeing. Untouched by every finding in this synthesis.
- **PROTECT-10 — Private-life discipline.** _(SUBJ-H5.)_ No spouse, no children, no parents' occupations, no religion, no ethnicity, no net-worth paragraph. Repair P1-09 _toward_ this standard, not away from it.
- **PROTECT-11 — The closing lines.** _(FAN, FUTURE-H6, SUBJ-H2.)_ _"The weights are already on your machine. That was always the point."_ A property of distribution, not a status — it reads the same in 2027 regardless of what happens to Mistral, and it becomes _more_ true once Large 3 is in the piece. Also _"He took the finding, left the lab, and built the version nobody can shut off"_ — the closing argument made entirely from actions, with no claim about his interior life. See Conflicts #7 on the surrounding absolutism.
- **PROTECT-12 — The electrician frame, carried as his own words.** _(SUBJ-H3, UNFAM.)_ Using the subject's chosen self-description as the organizing metaphor, rather than a cleverer one the writer preferred, is what earns the article the right to disagree with him elsewhere.
- **PROTECT-13 — Corpus differentiation across the three published Sixes.** _(ENN-H5.)_ Thiel = escape hatch; Huang = perpetual preparation against extinction; Mensch = non-revocability. Three distinct engines, and a persona title that deliberately avoids "Vigilant," which both neighbours already use. This is an editorial constraint on any revision, not just a ledger note.
- **PROTECT-14 — The marathon as budgeted energy.** _(FAN-H6, SUBJ, UNFAM-H6.)_ _"You do not post that time by being fastest at kilometre five."_ A real observation, not decoration, and the only glimpse of him as a physical person. P1-13 changes one duration inside it and nothing else; keep the single-source attribution.
- **PROTECT-15 — The Rabbit Hole quarantine.** _(UNFAM-H5.)_ _"For the Enneagram nerds. Skip if you're not deep into the system. The rest of the analysis stands on its own."_ Wings, subtypes and arrows are exactly the material that loses a general reader. Move the confidence hedge **out** (P0-12); keep the skip instruction.

---

## Revision brief

Ordered, bounded worklist. Items 1–12 are mandatory. **Before starting, read the Protected hits section** — five of the twelve P0 repairs sit inside or beside protected passages.

**Stage 0 — arithmetic sweep (do this first; it is the cheapest and it closes a class).**
Recompute every derived figure from dates the file already contains; never copy one forward from a secondary source or a prior artifact. Then fix the research file too, so the next Mensch pass does not reproduce them.

1. **P0-01** — age 34, intro and FAQ #2; keep the event-anchored FAQ construction.
2. **P0-02** — remove "thirty months" from both instances; prefer endpoints or a year-scale age.
3. **P1-13** — marathon "three and a half hours" (same sweep).

**Stage 1 — quote and attribution integrity.** 4. **P0-03** — cut the seller-quote gloss or quote the sentence in full. _(Frees ~40 words for Stage 3.)_ 5. **P0-07** — resolve the Mixtral attribution: preferred branch after **RQ-01**, fallback otherwise. Never ship the current unnamed form. 6. **P0-06** — render the MEP letter as reported, identically in body and FAQ #5; credit all three organisations. 7. **P1-03** — Mairal, verified clause only, unless **RQ-02** resolves affirmatively. **P1-16** — GAFAM attribution and gloss. **P1-08**, **P1-09**, **P1-14** — the remaining attribution-precision fixes.

**Stage 2 — research-required decisions that can be safely resolved now.** 8. **RQ-01** (one permalink) and **RQ-02** (one paywalled read) are both cheap and both unblock items already in the list. Do them here. **RQ-02 is the highest-value source remaining** — one read settles P1-03, the GAFAM chain, and puts the CNRS spine on the record via P1-12. **RQ-03, RQ-04 and RQ-05 are explicitly out of scope for this revision**: RQ-03's payoff is real but every accepted repair has a form that does not need it, and nothing may be quoted from secondary accounts of the hearing. **RQ-04** would sharpen P0-05 but does not block it. Do not improvise around any of the three.

**Stage 3 — evidence and argument repairs (the ones that add words).** 9. **P0-04** — delete "Nobody made it do that," name Mistral Large 2's licence in the chronology, add Mistral Large 3 (Apache 2.0, Dec 2025), move the falsifier rebuttal onto it. 10. **P0-05** — state the CMA's actual finding and say the lobbying question was never adjudicated. **P0-08** — re-anchor concentration on revenue. **P1-02** — scope and date the benchmark claim. **P1-15** — mark the ARR figure as a forecast. **P1-01** — add the dependency objection. **P1-04** — narrow Chinchilla, fix "American lab." **P1-05** — state and answer the sales-positioning objection. **P1-06** — name one behaviour the type does not explain. 11. **P1-11** — one clause on what Mistral makes. **P1-12** — citations hygiene.

**Stage 4 — Enneagram theory repairs.** 12. **P0-10** (pillar contradiction — same sentence as P0-02, fix together), **P0-11** (tiebreaker half (b) → authority structures; leave half (a) alone), **P0-12** (downgrade "the whole man," move one hedge into the body), **P1-07** (Rabbit Hole: arrows, Type 8, instinctual stack).

**Stage 5 — the one P2, if the budget allows.** 13. **P2-01** — name Mistral 7B and time-bound "no blog post, no paper." It converts the article's best scene from a stunt into a policy, which is what the argument needs, and it is the fan target's native ground. **P2-04 is word-negative and should ride free.** Everything else in P2 waits.

**Budget discipline.** Net add is ~230 words against ~7 words of headroom. Fund from: P0-03's deletion (~40), the five-item deflation inventory in the electrician section trimmed to three (~40), the surplus revocation-motif restatements in the last third (~40), the Five-versus-Six adjudication trim (~50), plus the word-negative items (P1-03, P1-09, P2-04). **Cut before adding.** Do not let the 3,900 ceiling become the target again.

**Protected-hit regression checks — run all fifteen before sign-off. The five most likely to be damaged by this specific worklist:**

- **PROTECT-01** — after P1-10, is the inner-thought panel still one short first-person paragraph, same place, same register, with the CNRS paragraph break before "By then" intact? Is _"Both happened, in that order"_ still asserting sequence rather than cause?
- **PROTECT-04** — after P1-04 narrows the Chinchilla claim, does _"That does not prove he is right…"_ survive verbatim?
- **PROTECT-08 / PROTECT-15** — after P0-04 and P0-12, does the Rabbit Hole still name its falsifier, still say medium-high, and still carry the skip instruction — with the hedge now _also_ in the body?
- **PROTECT-02** — after the critic section absorbs P0-05, P0-08, P1-01, P1-02, P1-04, P1-05, P1-06 and P1-15, is the depreciation rebuttal still verbatim and still the section's strongest paragraph? This section is taking eight edits; it is the likeliest casualty.
- **PROTECT-07** — is February 2024 still narrated at full length, in the body, in the same section? Only its two closing moves were licensed for change.
