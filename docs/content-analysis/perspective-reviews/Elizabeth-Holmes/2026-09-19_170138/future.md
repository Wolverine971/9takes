---
artifact: perspective-review
schema_version: 1
subject: Elizabeth-Holmes
perspective: future
draft_sha256: a6a1c2033f6a9a8bfb8cfc1a5e232e457e2d00381e0078d89974b2308241d275
review_status: complete
trust: strained
value: high
delight: clear_hit
recommendation: revise
blockers: 2
concerns: 7
reviewed_at: 2026-09-19T22:20:50Z
path: docs/content-analysis/perspective-reviews/Elizabeth-Holmes/2026-09-19_170138/future.md
---

## Bottom-line verdict

Reading this as the September 2027 reader: the argument survives, the news packaging does not.

The Type 3 case is built almost entirely on 2003–2022 material that cannot decay — Kissinger's "Others will judge the technical aspects" line, Gardner's objection, the November 2014 "disaster zone" text and the Murdoch binder it stayed out of, the logos, Tyler Shultz, Erika Cheung, the four-beat unraveling chronology. Delete every sentence about _You Can See Everything_ and the article still stands up and still earns its thesis. That is the single most important durability property a news-pegged personality piece can have, and this draft has it.

What fails is the wrapper. The film is described in the present tense as forthcoming ("the documentary A24 puts in theaters in October") in five places including an FAQ answer, with no year attached. That sentence has a 28-day shelf life from the review date, and the draft is `production_pretext.status: blocked` with an unknown ship date — so it may publish already wrong. Alongside it, the article discloses that "nobody writing here has seen" the film, undated, while nominating that same film as the test of its central hypothesis. Twelve months out, a reader who has seen the film finds an article that promised to test something against evidence it declined to look at, and cannot tell from the page whether that was reasonable in 2026 or negligent since.

Nothing in the draft is false today. Every defect I found is prospective, and every repair I propose is small. The date hygiene elsewhere is genuinely better than most news-pegged content I would expect to audit — "a date that can move" and "which is a filing and not a grant" are the constructions that make a page survive a year. The problem is that the care is distributed backwards relative to risk: the draft hedges a trade-confirmed release date against A24's own unupdated marketing field, then prints an unverifiable paywalled quotation inside quotation marks.

Recommendation is `revise`, not `hold_for_research`. No new research is required to fix either blocker.

## What landed

**FUTURE-H1 — The thesis does not depend on the newest event.**

The film is a doorway, not a load-bearing wall. Strip the documentary H2 entirely and the spine — "what happens when protecting your identity as a successful founder takes priority over correcting the story your company tells?" — is still carried by the endorsements section and the unraveling chronology.

> "Then the court record puts a date on what she knew. Around November 2014, Balwani described the lab to Holmes as a **"disaster zone."** Within weeks the two of them were discussing an investment binder for Rupert Murdoch."

**Must survive revision because:** this is the sentence the whole argument rests on, it is sourced to a court order with a page anchor, and it will read identically in 2030. Any post-release rewrite that promotes the film to the spine would trade a permanent asset for a perishable one. Protect the current load-bearing order.

**FUTURE-H2 — The BOP sentence is a model of durable construction.**

> "As of September 19, 2026, the Bureau of Prisons listed her at FPC Bryan with a projected release date of February 22, 2030, a date that can move."

**Must survive revision because:** observation date + naming the source as the source of the _listing_ rather than the fact + an explicit volatility hedge. This sentence cannot become false — only stale — and a 2027 reader knows exactly what to re-check and where. Preserve the form, not just the content; it is the template the rest of the page's dated claims should be held to.

**FUTURE-H3 — "which is a filing and not a grant."**

Five words that pre-empt the most likely future misreading of the page. Clemency petitions get summarized as momentum; this clause refuses to let that happen. It will be doing work in 2027 whether or not the petition has been decided.

**FUTURE-H4 — The four-beat chronology H2 is the most durable section in the piece.**

Every beat opens with an absolute date in bold: **October 2015**, **December 2015**, **June 2016**, **2017**. No relative language anywhere in the section. A 2027 reader can verify all four independently.

**Must survive revision because:** it is also the section that makes the article useful after the news cycle moves on — it is the part a reader arriving from a 2027 search for "what actually happened at Theranos" can use.

**FUTURE-H5 — The ending has zero temporal dependency.**

> "Both shortcuts let us stop looking. The blood test needed evidence. So does the story we tell about the woman who promised it."

**Must survive revision because:** it closes on a standard rather than a status. It works the same in 2027, in 2030, and after any documentary, verdict, or clemency decision. Do not attach a news hook to it during a refresh.

## What missed

**FUTURE-M1 — The film is promised, not delivered, and the promise is undated.**

The diagnosis section writes a check: "That ordering matters for Holmes, and the film opening in October is where it gets tested." The documentary section declines to cash it: "That is a critic's reading of a film nobody writing here has seen." Today that is honest. Twelve months on, with the film released, reviewed, and almost certainly streaming, the effect inverts: the article nominated a test, the test happened, and the article is still standing where it was. Covered as a blocker at FUTURE-R2.

**FUTURE-M2 — The release-date hedge weights the wrong source.**

> "its teaser promises October; the studio's film page still listed the specific date as to be determined on September 19, while reporting gives October 16"

A distributor's marketing page with an unupdated release field is not counter-evidence against trade confirmation. Deadline ran a dedicated "Here's When A24 Is Releasing Documentary" piece and World of Reel reported the NYFF premiere plus the October 16 date on September 10 — nine days before the review date. The draft spends a full clause manufacturing uncertainty about a date the trades had settled, and that clause is the part of the sentence that expires first. Covered at FUTURE-C2.

**FUTURE-M3 — The reader is never told when the page was checked.**

Every "as of" date lives in body prose or in HTML comments the reader cannot see. The frontmatter dateline says `2026-05-07`. A 2027 reader has no visible signal that the custody and clemency facts were verified on September 19, 2026, so the freshest, most carefully-verified material on the page presents as four months older than it is. Covered at FUTURE-C7.

## What I expected

A durability review expects four things from a page built on a live news peg. The draft delivers two.

**Delivered:** absolute dates on nearly every factual claim, and explicit volatility hedges on the two facts most likely to move (BOP projection, clemency status). This is better than the baseline.

**Not delivered — a visible last-verified signal.** The page has no reader-facing "checked on" line. The pipeline knows; the reader does not. For a page whose value proposition includes current custody status, that is the difference between a stale-looking page and a maintained one.

**Not delivered — tense discipline on forward-looking events.** Five instances of "October" describing a future release, none carrying a year, in the intro, the TL;DR, the diagnosis section, the documentary section, and an FAQ answer. Covered at FUTURE-R1.

**Not delivered — an acknowledgment that the well-sourced number disagrees with the popular one.** The draft's February 22, 2030 is first-party-correct. It is also isolated: Wikipedia and 2025-era reporting say 2032, and a September 2026 search summary returns "December 2031." The draft is right and says nothing about being outnumbered. Covered at FUTURE-C3.

## What surprised me

**Welcome:** the epistemic care in the prison paragraph. "A date that can move" and "a filing and not a grant" are not phrases a draft writes by accident; they are phrases a draft writes after someone thought specifically about being read later. That thinking is present and it works.

**Jarring:** the same draft distributes that care backwards elsewhere. It hedges a date confirmed by two trades against a marketing-page field, and in the very next section prints **"the epic nature of her willingness to lie to herself"** inside quotation marks — a string the evidence packet marks as its "highest-risk item," never retrieved, character-unverified, behind a tollbit paywall returning HTTP 402. Maximum hedging on a low-risk fact; direct quotation on the one string nobody could confirm. For a twelve-month reader, the paywalled quote is the more dangerous of the two, because it is the one that cannot be checked by anyone later either.

**Also unexpected, in the draft's favor:** the ending survives the strongest test I could put to it. I tried to imagine the twelve-month scenarios that would embarrass this page — the film lands and is sympathetic; the film lands and is damning; a commutation is granted; the BOP date moves. The closing section holds under all four, because it commits to a standard rather than a prediction. Only the commutation scenario leaves a gap, and that gap is a one-clause fix (FUTURE-C6).

## Red flags

### FUTURE-R1 — BLOCKER — Present-tense, year-less "October" for a release that expires 28 days after review

**Passages (five locations):**

- Intro: "In the teaser for _You Can See Everything_, the documentary A24 **puts in theaters in October**, Nathan Fielder asks her…"
- TL;DR list item: "**The October test:** _You Can See Everything_ films her insisting she is real…"
- Diagnosis section: "That ordering matters for Holmes, and **the film opening in October** is where it gets tested."
- Documentary H2: "its teaser promises October; the studio's film page still listed the specific date as to be determined on September 19, while reporting gives October 16"
- FAQ 5, question and answer: "What is the **new** Elizabeth Holmes documentary?" … "A24's teaser says October and its film page **still listed the specific date as to be determined** on September 19; reporting gives October 16."

**Reader effect / trust problem:** From October 17, 2026 onward, the article's first screen describes a released film as forthcoming. The FAQ answer is worse than the body, because FAQ text is extracted into rich results and AI summaries stripped of page context — a 2027 extraction asserts that a year-old film's release date is "to be determined." A reader who notices this discounts every other date on the page, including the custody dates that are actually well-verified.

**Evidence:** A24 theatrical release October 16, 2026, reported by Deadline in a dedicated release-date article and by World of Reel (NYFF premiere + October 16) on September 10, 2026 — nine days before this review. The draft additionally carries `production_pretext.status: blocked` with `six_perspective_review_missing` and `external_claude_pipeline_approval_pending`, so ship date is unknown and may fall after October 16; the claim can therefore be wrong on the day it publishes, not only twelve months later.

**Minimum viable repair:**

1. Every instance gets a year: "October 2026."
2. Intro and diagnosis convert to release-agnostic tense — "the documentary A24 released in October 2026" / "the film released in October 2026 is where it gets tested" — so the sentences read correctly before and after the date.
3. TL;DR label: "The October 2026 test."
4. FAQ 5: drop the A24-page-TBD clause entirely and state "A24 released it theatrically on October 16, 2026," or, if shipping before that date, "A24 has it scheduled for October 16, 2026." Change the question to "What is the Elizabeth Holmes documentary _You Can See Everything_?" so "new" does not age.

**Expected benefit:** removes the page's only claims that are guaranteed to become false, and protects the FAQ from propagating a wrong date into extracted contexts where the page's own hedging is invisible.

**Confidence:** high.

**Acceptance test:** `grep -n "in October" draft.md` returns no instance lacking a year; no reader-visible sentence describes the film with a future-tense verb; the FAQ 5 answer contains no reference to A24's page showing TBD; and the FAQ 5 question contains no relative adjective ("new," "latest," "upcoming").

---

### FUTURE-R2 — BLOCKER — Undated "nobody writing here has seen" attached to a hypothesis the article says the film will test

**Passages:**

- Diagnosis H2: "That ordering matters for Holmes, and the film opening in October is where it gets tested."
- Documentary H2: "That is a critic's reading of **a film nobody writing here has seen**, and the jury's finding about what she knew stands untouched by it."

**Reader effect / trust problem:** The pairing sets up a test and then discloses that the tester did not look. In September 2026 the disclosure is obviously reasonable — the film is unreleased. The disclosure carries no date, so in September 2027 it reads as a standing admission that the article analyzes a film it never watched. The reader cannot distinguish "unreleased at time of writing" from "did not bother," and the natural inference is the second. That inference then contaminates the prison and custody material, which is the best-verified content on the page.

**Evidence:** The packet's own cutoff note — "The film had not been watched by anyone contributing to this packet or the draft; all statements about its contents derive from A24's synopsis, A24's teaser, reporting, and published reviews" — establishes that the limitation is a snapshot property of a specific date. The draft transmits the limitation without the date that justifies it.

**Minimum viable repair:** Anchor the disclosure to the writing date and to the release, in one sentence. For example, replace "a film nobody writing here has seen" with "a film that had not yet been released when this was written in September 2026." No new research, no new sourcing, one clause. Optionally pair with a refresh note (FUTURE-C7) so the 2027 reader can see whether a post-viewing update exists.

**Expected benefit:** converts an aging admission into a dated limitation, which is what it actually is. Preserves the draft's honesty — which is real and worth keeping — without letting it curdle.

**Confidence:** high.

**Acceptance test:** no reader-visible sentence states that the film is unseen without an adjacent date or release-relative anchor; and the diagnosis section's "where it gets tested" clause either carries the same anchor or is rephrased so it does not promise a test the page has not performed.

## Specific improvements

### FUTURE-C1 — "The Justice Department's September 1 update" carries no year, on the page's most volatile fact

**Passages:** Prison H2 — "The Justice Department's **September 1** update listed her 2025 commutation petition as pending, which is a filing and not a grant." FAQ 4 — "DOJ's **September 1** update listed her 2025 commutation petition as pending."

**Reader effect / trust problem:** A bare "September 1" on a page read in September 2027 is ambiguous between 2026 and 2027, and it resolves to the wrong one by default — a reader assumes recency. That makes a year-old status read as current on the exact fact most likely to have changed.

**Evidence and reasoning:** The petition is not a dormant dataset row. Holmes asked Trump directly to commute her sentence in January 2026 (CNN, January 21, 2026; Fox Business; Fortune, January 23, 2026), and it was still publicly live as of September 8, 2026, when Forbes framed the A24 film as arriving "as she seeks clemency from Trump." Clemency is decidable by one person at any time with no docket and no notice. Of every fact on this page, this is the one most capable of being overturned between publication and a reader's arrival.

**Minimum viable repair:** "September 1, 2026" in both locations. Add one clause giving the petition's age so the reader can gauge it: "her commutation petition, filed in 2025 and pressed publicly to President Trump in January 2026, was listed as pending."

**Expected benefit:** removes a year-ambiguous date from the highest-volatility claim, and tells the reader this is a live request rather than an archival filing — which is what makes the "filing and not a grant" clause land properly.

**Confidence:** high on the missing year; medium on the January 2026 addition (CNN and Fortune both 403/451 from this session; established via search-result titles and summaries, not fetched text — verify before adding).

**Acceptance test:** no reader-visible date on the page lacks a year; and the clemency sentence identifies the petition as actively pressed rather than merely filed.

---

### FUTURE-C2 — The release-date hedge treats an unupdated marketing field as counter-evidence

**Passage:** Documentary H2 — "its teaser promises October; **the studio's film page still listed the specific date as to be determined on September 19**, while reporting gives October 16."

**Reader effect / trust problem:** The clause is the most perishable sentence-fragment in the article — it describes the state of a webpage field on one day. It also mis-weights: it elevates A24's un-updated marketing page over dedicated trade reporting, so the reader is told the date is unsettled when it was not.

**Evidence:** Deadline published a standalone release-date story; World of Reel reported the NYFF premiere and the October 16 A24 release on September 10, 2026. The packet itself records the date as "reported for October 16, 2026 theatrical release by A24" and separately flags this as "the kind of claim that can go stale between packet and publication."

**Minimum viable repair:** Delete the A24-page-TBD clause. State the date once with its source: "A24 released it theatrically on October 16, 2026" (or "has it scheduled for," if shipping earlier), citing Deadline rather than the A24 film page.

**Expected benefit:** removes a fragment with a nine-day useful life and stops the page from being less certain than the record.

**Confidence:** high.

**Acceptance test:** the phrase "to be determined" does not appear in reader-visible text; the release date is attributed to trade reporting, not to the absence of a date on a distributor page.

---

### FUTURE-C3 — The 2030 release projection is correct and outnumbered, and the draft never says so

**Passages:** Prison H2 — "a projected release date of February 22, 2030, a date that can move." FAQ 4 — "a projected release date of February 22, 2030, which can change."

**Reader effect / trust problem:** The draft's figure comes from a first-party BOP query and is right. The secondary record disagrees loudly and persistently: Wikipedia and 2025-era reporting give 2032, ABC7's report on the PEOPLE interview repeats 2032, and a September 2026 search summary returns "December 2031." As the September 19, 2026 anchor recedes, a checking reader — or an AI summarizer reconciling sources — encounters 2032 everywhere and 2030 only here, and concludes this page is the error. The hedge protects against the date _moving_; it does not protect against the date being _disbelieved_.

**Evidence:** Packet S-01L (direct BOP locator query, `projRelDate 02/22/2030`), S-24 (Wikipedia, flagged: "Its 2032 release date is wrong against BOP"), S-16 (ABC7, flagged: "Repeats the stale 2032 release date"). Independently reproduced in my own September 19, 2026 search, which returned both 2032 and December 2031.

**Minimum viable repair:** One clause naming the divergence and the reason the draft's figure governs: "…February 22, 2030 — earlier than the 2032 date still carried in much reporting, because the Bureau's own record reflects the reduced term and credits — a date that can move."

**Expected benefit:** converts an apparent error into a visible correction, which is the more valuable and more linkable thing for a page competing on a factual question. Also inoculates the number against being "fixed" by a future editor working from secondaries.

**Confidence:** medium-high. The mechanism (2030 vs 2032 divergence) is confirmed; the causal explanation for the gap should be verified against the March 2026 reduction order before the clause is written as stated.

**Acceptance test:** a reader who arrives having seen "2032" elsewhere can tell from this page alone why 2030 is the better figure, without leaving the page.

---

### FUTURE-C4 — A present-tense H2 over a February 2025 snapshot

**Passage:** H2 — "What Elizabeth Holmes **does** in prison," followed by "In her first prison interview, published by PEOPLE in February 2025…"

**Reader effect / trust problem:** The heading asserts a current state. The evidence under it is a single interview that will be two and a half years old at the review horizon and is the sole source for the reentry-clerk role, the 31 cents an hour, the medical-invention work, and the innocence claim. Prison jobs, facilities, and programming change; nothing on the page tells the reader the portrait is a snapshot. The body's own framing — "Inside, her days **had** a fixed shape" — is already in past tense, so the heading and the prose disagree.

**Evidence:** Packet S-16/S-23, CLM-28, all dated to the February 2025 PEOPLE interview; packet notes `people.com` 403s and the quotation rests on the headline plus ABC7 syndication.

**Minimum viable repair:** Retitle to "What Elizabeth Holmes's prison years look like" or "What Elizabeth Holmes said about prison," and add the vintage inline: "As she described it in February 2025, her job was reentry clerk…"

**Expected benefit:** the section stops making a currency claim it cannot support, and stops aging faster than its evidence.

**Confidence:** high.

**Acceptance test:** the heading contains no present-tense assertion of ongoing activity, and the reentry-clerk details carry their source date in the same sentence.

---

### FUTURE-C5 — Load-bearing quotations resting on unfetchable or proxy sources

**Passages:**

- Documentary H2 — **"the epic nature of her willingness to lie to herself"** attributed to "Variety's reviewer," linked to variety.com.
- Voice H2 — the Chozick persona account, cited to `uproxx.com` as "Contemporary coverage reproducing the account."
- Documentary H2 — Chozick's "impossible not to believe her," cited to `thewrap.com`.
- Four separate citations to `abcnews.com`, which reaches the article only via cross-host redirect to `abcnews.go.com`.

**Reader effect / trust problem:** These are the page's most checkable-looking and least checkable claims. The Variety string is the sharpest: the packet marks it "the largest unresolved evidence gap" and "UNRESOLVED — highest-risk item," never retrieved at character level (307 → tollbit.variety.com → HTTP 402). It is printed inside quotation marks. A future reader who clicks hits the same paywall and cannot verify; a future editor has no way to correct it. The uproxx and TheWrap proxies carry the two most important quotations about Holmes's self-presentation while the primary (nytimes.com) is never cited at all, so if either aggregator drops the piece the claims lose their only reachable support. The abcnews.com redirect works today and is exactly the kind of thing that stops working.

**Evidence:** Packet S-30 ("**NOT RETRIEVED.** 307 → tollbit.variety.com → **HTTP 402**. Quotation unverified at character level"); packet access-limits note listing Condé Nast, people.com, cnbc.com, variety.com and nytimes.com as hard-blocked this session; draft's own second-pass note: "Variety's review line came from search snippets."

**Minimum viable repair:**

1. Variety — before ship, verify against a fetchable copy, or demote from direct quotation to attributed paraphrase ("reviewers at Telluride described a portrait of sustained self-deception"). Do not print an unverified string in quotation marks on a page whose thesis is about the difference between a claim and its evidence.
2. Add the canonical `nytimes.com` URL for the Chozick profile to `citations` and alongside the uproxx/TheWrap links, marked as the primary even though it was not fetchable, so the claim has a durable anchor.
3. Rewrite the four `abcnews.com` URLs to their resolved `abcnews.go.com` targets.

**Expected benefit:** the page's checkable claims stay checkable after the aggregators and redirects move, and the one string nobody can verify stops being presented as a verbatim quotation.

**Confidence:** high on the Variety and abcnews items; medium on the NYT-canonical addition (a deliberate earlier decision removed nytimes.com when the unverified 2026 dispute was cut — re-adding it as a citation for the 2023 profile only should be checked against that reasoning).

**Acceptance test:** every quotation mark in reader-visible text encloses a string verified at character level from a source the reader can reach, or the passage uses paraphrase; no citation URL depends on a cross-host redirect.

---

### FUTURE-C6 — The ending sets a standard that a commutation would bypass, and has no hook for it

**Passage:** Final H2 — "That sets a hard standard for any next chapter. New clothes, a sympathetic profile, a film that asks whether she is real: none of them can establish change. Specific responsibility would."

**Reader effect / trust problem:** The section enumerates what would count as change — correcting a claim, accepting a limit, doing uncredited work — and implicitly treats the next chapter as something Holmes authors. There is a live route to a next chapter that requires none of it: an executive commutation, actively sought and publicly reported. If clemency is granted inside the twelve-month window, the ending does not become false, but it becomes naive in a way a reader will notice: the article listed every door except the one she actually used.

**Evidence:** Commutation petition filed 2025, pressed publicly to Trump in January 2026 (CNN, January 21, 2026; Fortune, January 23, 2026), listed `Pending` with a blank final-action date in DOJ's case file as of the September 1, 2026 stamp (packet S-18, row C335361), and characterized as live by Forbes on September 8, 2026. No decision timeline exists, which is precisely what makes it a twelve-month risk.

**Minimum viable repair:** One sentence, in the prison section or as the penultimate beat of the ending: note that release could arrive by executive act rather than by the standard the section describes, and that an early exit would settle nothing about the question the page is actually asking. This _sharpens_ the thesis — it restates that the standard is behavioral, not custodial — rather than diluting it.

**Expected benefit:** the ending survives the one twelve-month scenario it currently does not anticipate, and gains a line that works equally well whether or not clemency lands.

**Confidence:** medium-high. The editorial logic is sound regardless; the sourcing for the January 2026 petition should be fetched and confirmed before any date is stated.

**Acceptance test:** a reader who arrives the week a commutation is granted finds the ending still coherent and still making its point, with no sentence that a grant would falsify.

---

### FUTURE-C7 — No reader-visible freshness signal, and the dateline predates the content

**Passage:** Frontmatter — `date: '2026-05-07'`, `lastmod: '2026-05-07'` — against body content verified on September 19, 2026 ("As of September 19, 2026, the Bureau of Prisons listed…") and a documentary that premiered September 6, 2026.

**Reader effect / trust problem:** The page's most carefully verified material is its custody and clemency status, and the page presents as four months older than that verification. Every "as of" anchor lives in body prose or in HTML comments the reader cannot see, so there is no scannable signal that this page is maintained. Twelve months out, a maintained page and an abandoned page look identical from the top of the screen.

**Evidence:** Frontmatter lines 7–8 of the snapshot against body and FAQ content dated 2026-09-19. The five `citations` entries dated September 2026 further confirm the content postdates the dateline.

**Minimum viable repair:** Add a reader-visible verification line near the prison section or above the closing rule — "Custody and clemency status verified September 19, 2026" — which is independent of frontmatter and can be updated by whoever does the ship-day recheck the pipeline already requires.

**Confidence on the repair:** high. **Explicit deference:** `lastmod` is DJ-managed by standing rule, so I am not proposing any change to the frontmatter field. This finding proposes a body-text line only; whether the dateline itself moves is DJ's call, and I flag the mismatch for awareness rather than as an editorial repair.

**Expected benefit:** gives the twelve-month reader a visible, specific freshness anchor, and gives a future refresh pass a single line to update rather than five scattered "as of" clauses.

**Acceptance test:** a reader can determine, without reading the prison paragraph in full, the date on which the page's volatile facts were last checked.

---

### Twelve-month refresh list

Concrete maintenance schedule from the review date. Each row names the trigger, the exact passage that changes, and the source to check. Rows 1–3 are not optional; they are the difference between a maintained page and a page that quietly goes wrong.

| #   | Trigger / when                                        | What changes in the draft                                                                                                                                                                                                    | Source to check                                                                    |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | **Ship day, whenever that is**                        | Every "October" instance (FUTURE-R1); the A24-page-TBD clause (FUTURE-C2); the BOP line and FAQ 4; the DOJ September 1 stamp. If ship day falls after October 16, 2026, the intro is wrong on arrival, not in twelve months. | A24 film page; Deadline; BOP locator reg. `24965-111`; DOJ case file row `C335361` |
| 2   | **Week of October 16, 2026**                          | Convert all release language to past tense. Retire "a film nobody writing here has seen" or date it (FUTURE-R2). Replace the unverified Variety quotation with a verified one or a paraphrase (FUTURE-C5).                   | The film; Hollywood Reporter and Deadline reviews (both fetchable)                 |
| 3   | **Within ~8 weeks of release**                        | Pay the diagnosis section's promise: state what the film did or did not show about the self-deception hypothesis (FUTURE-Q1). Keep it to the documentary H2 — do not let it migrate into the spine.                          | The film                                                                           |
| 4   | **Quarterly: Dec 2026, Mar 2027, Jun 2027, Sep 2027** | BOP facility and projected release date; DOJ clemency row status and final-action date. Update the "as of" date in the prison paragraph and FAQ 4 even when nothing has moved — the anchor date is the claim.                | BOP locator; DOJ Office of the Pardon Attorney case file                           |
| 5   | **On any clemency news**                              | Prison H2, FAQ 4, and the ending's framing (FUTURE-C6). A grant falsifies the custody paragraph the same day.                                                                                                                | DOJ case file; wire reporting                                                      |
| 6   | **If a cert petition is docketed or denied**          | "Her legal position has moved only at the margins."                                                                                                                                                                          | Supreme Court docket search — and note `25A1162` is an unrelated Holmes case       |
| 7   | **When a streaming/VOD date is announced**            | Nothing factual, but this is when search traffic returns and the page is read fresh by people who have just watched the film. Best moment to confirm rows 2 and 3 are done.                                                  | A24; trade reporting                                                               |
| 8   | **Any refresh pass, standing check**                  | Re-run link checks on the four `abcnews.com` redirects, the `uproxx` and `thewrap` proxies, and `people.com`. These are the page's proxy-sourced load-bearing quotations (FUTURE-C5).                                        | Link checker                                                                       |

**What remains valuable if the newest event is removed entirely:** the greatness-story section, the voice section, the endorsements section, the employees section, the four-beat unraveling chronology, the Balwani section, and the closing standard — roughly three quarters of the reader-visible body, and all of the material the thesis rests on. That is the answer to the durability question the whole review exists to ask, and it is a good one.

## Follow-on questions

**FUTURE-Q1 — Does the released film corroborate or undercut the self-deception hypothesis?**

_What the answer changes:_ everything about the documentary H2 and the diagnosis section's "where it gets tested" clause. If the film shows sustained self-deception, the section becomes the page's strongest payoff and the Variety quote can be replaced with the article's own observation. If the film shows calculated performance, the hypothesis needs to be restated as considered-and-weakened, and the diagnosis clause must be rewritten rather than left as an unpaid promise.

_Best source:_ the film itself after October 16, 2026. Secondarily, the Hollywood Reporter and Deadline reviews — both were fetchable in this session, unlike Variety, which makes them the better durable citations regardless.

**FUTURE-Q2 — Is the commutation decided within twelve months?**

_What the answer changes:_ the prison H2, FAQ 4, and the ending's framing (FUTURE-C6). A grant would make the page's custody paragraph wrong and its ending incomplete on the same day.

_Best source:_ DOJ Office of the Pardon Attorney downloadable case file, row `C335361`, re-pulled; the `Pending` value and blank final-action date are the two fields to watch.

**FUTURE-Q3 — Is a certiorari petition filed, and is it disposed of?**

_What the answer changes:_ "Her legal position has moved only at the margins." A cert denial would strengthen the sentence; a grant would falsify it outright.

_Best source:_ Supreme Court docket search for a Holmes petition. Note for whoever follows this up: application `25A1162`, which surfaces in searches pairing Holmes with the Supreme Court, is an unrelated domestic case (`HOLMES, C. V. HOLMES, JAMES KEVIN`, June 1, 2026 order list) — I confirmed this by extracting the order-list PDF. Do not treat it as an Elizabeth Holmes docket entry.

**FUTURE-Q4 — Does the BOP projection move?**

_What the answer changes:_ the February 22, 2030 figure in the prison H2 and FAQ 4, and the strength of the FUTURE-C3 repair.

_Best source:_ BOP inmate locator, reg. `24965-111`. The locator's own warning that First Step Act and Federal Time Credit recalculations can leave displayed dates stale is the reason the draft's "a date that can move" hedge must stay no matter what the number becomes.

**FUTURE-Q5 — Is the Variety phrase accurate at character level?**

_What the answer changes:_ whether the string can remain inside quotation marks at all (FUTURE-C5).

_Best source:_ a syndicated or database copy of Owen Gleiberman's Telluride review that does not route through tollbit — a library database or a print-edition reproduction. If none surfaces, the answer is to paraphrase.

## Preserve list

Ranked by how much durability would be lost if a refresh pass overwrote them.

1. **The load-bearing order of the argument.** Endorsements section and unraveling chronology carry the thesis; the film is a doorway. A post-release update will be tempted to promote the film to the spine because it will finally have something to say about it. Do not. The current order is why this page survives 2027.
2. **"As of September 19, 2026, the Bureau of Prisons listed her at FPC Bryan with a projected release date of February 22, 2030, a date that can move."** Preserve the construction — observation date, source-as-lister, volatility hedge — and apply it to any new dated claim.
3. **"which is a filing and not a grant."** Do not trim as redundant during a length pass. It is doing future work.
4. **The four dated beats of "How the Theranos story came apart."** The bolded absolute dates are the format, not decoration.
5. **The closing two sentences.** "The blood test needed evidence. So does the story we tell about the woman who promised it." Zero temporal dependency. Do not attach a news hook.
6. **"The ambition arrived inside a child's effort to reassure a parent."** The one passage in the piece that could have been written in 2015 or 2035 without changing a word.
7. **"Nobody has to plan a move like that for it to be exactly the move this reading predicts."** A Type 3 claim that needs no current event to work — the model for how the rest of the type material should be anchored.
8. **The Balwani section's refusal to resolve.** "Anyone who needs Holmes to be only a mastermind, or only a victim, has to leave out sworn testimony to get there." Unresolved-by-design claims do not decay; this one will read the same after any documentary or clemency decision.

## Research log

Snapshot integrity checked first. `shasum -a 256` on the live draft (`src/blog/people/drafts/Elizabeth-Holmes.md`) returns `a6a1c203…8241d275`, matching both `context.json` and the supplied `--draft-sha` exactly. The snapshot file `draft-reviewed.md` hashes differently (`321f0998…`); a normalized diff shows the difference is entirely Prettier emphasis-marker rewriting (`*x*` → `_x_`), YAML quote style on `description`, and the `path:` label-paths field pointing at the snapshot location. Reader-visible content is identical. Audited the snapshot only.

Packet read before role-specific research, per protocol. It answered more than I expected and I reused it rather than re-searching: the October 16 reporting (line 14), the packet cutoff and unwatched-film disclosure (line 16), the BOP and DOJ live observations (lines 161–163), CLM-24/26/28/30/31, the "two dated facts will drift" note (line 323), and the access-limits inventory (line 315). The packet had already identified the release-date and BOP/DOJ drift risks; my contribution is locating where the draft's _prose_ fails to carry that awareness to the reader.

**RQ-1: Is October 16, 2026 settled, and is the draft's TBD hedge already behind the record?** Searched A24 release date. Deadline ran a dedicated "Here's When A24 Is Releasing Documentary" piece; World of Reel reported the NYFF premiere and October 16 A24 release on September 10, 2026 — nine days before the review date. _Decision affected:_ FUTURE-C2 (the hedge mis-weights a marketing field against trade confirmation) and the severity of FUTURE-R1 (the date is settled, so the only live problem is tense and the missing year).

**RQ-2: Is there a Supreme Court track or other scheduled legal event that would falsify "moved only at the margins"?** Searched cert/Ninth Circuit/restitution. Results confirmed the May 2025 rehearing denial and generic commentary that cert is the remaining route, with no petition identified. The search surfaced a June 1, 2026 Supreme Court order list containing `25A1162`; I fetched it, found WebFetch could not parse the PDF, extracted it with `pdftotext`, and confirmed the only Holmes entry is `HOLMES, C. V. HOLMES, JAMES KEVIN` — an unrelated case. _Decision affected:_ did **not** raise a finding against "moved only at the margins," which is accurate; recorded the false-positive docket number in FUTURE-Q3 so the next reviewer does not repeat the trail.

**RQ-3: How volatile is the clemency petition, and is it a live matter or an archival row?** Searched commutation/Trump/clemency. Established that Holmes asked Trump directly in January 2026 (CNN January 21, 2026; Fox Business; Fortune January 23, 2026), that no decision had issued as of September 2026, and that Forbes on September 8, 2026 framed the A24 film as arriving while she seeks clemency. _Decision affected:_ FUTURE-C1 (upgraded from "missing year" to "missing year on a live, publicly pressed petition") and FUTURE-C6 (the ending's unanticipated scenario).

Attempted and failed: `forbes.com` September 8 piece (HTTP 403) and `cnn.com` January 21 piece (HTTP 451). Both are consistent with the packet's recorded access limits. Consequence: the January 2026 petition detail and the Forbes framing rest on search-result titles and summaries, not fetched text. I have marked both FUTURE-C1 and FUTURE-C6 as requiring verification before any date is written into the draft, and neither finding's core repair depends on them — the missing year and the ending's gap stand on their own.

Incidental confirmation for FUTURE-C3: my own searches returned "August 16, 2032" and "December 2031" as Holmes's projected release date, independently reproducing the divergence the packet flagged against BOP's `02/22/2030`. Three different dates in general circulation is a stronger case for the acknowledgment clause than the packet's two.

Six sources consulted beyond the packet (four searches/fetches successful, two blocked). Fan and community discussion not used; no fact in this review rests on it.

## Limits of this review

I am a twelve-month durability proxy, not a forecaster. I have not invented future events, and every scenario I weigh against the draft is one the public record already establishes as open: a scheduled release, a pending petition, a projection the issuing agency itself calls provisional, an appellate route that exists on paper. Where I could not fetch a source, I have said so and kept the finding's repair independent of it.

This review audits temporal durability only. I did not grade the Type 3 reasoning, the fairness of the portrait, the accessibility of the Enneagram material, or the quality of the prose except where a passage's shelf life was at issue. Several things I flagged as durable — the endorsements section, the Balwani handling, the ending — may have problems another standpoint will find; my finding that they _survive twelve months_ is not a finding that they are correct.

Two structural limits on the horizon itself. First, the film is the dominant uncertainty and I cannot resolve it: I do not know what _You Can See Everything_ shows, so FUTURE-Q1 is genuinely open and FUTURE-R2's repair is deliberately scoped to dating the disclosure rather than to what the article should eventually say about the film. Second, the ship date is unknown — the draft is production-blocked on this very review — so I have assessed durability from the review date rather than from publication. If publication slips past October 16, 2026, FUTURE-R1 is not a twelve-month problem but a day-one error, and its priority rises accordingly.

I did not read `subject.md`, `fan.md`, `critic.md`, `unfamiliar.md`, `enneagram.md`, or `synthesis.md`, and I did not consult the prior grades, the fresh-eyes notes' conclusions, or the second-pass notes as authority. I did read the draft's embedded ledgers and pipeline comments, because they are part of the frozen snapshot and because the second-pass notes' own "Still open" list is direct evidence about which citations the draft knows are fragile — I have treated those as the draft's self-reported provenance, not as review findings to defer to. Where the draft's notes and my own checks disagreed, I recorded my check.
