<!-- docs/content-analysis/2026-07-18_pop-culture-section-audit.md -->

# Pop-Culture Section Quality and Liability Audit

**Audit date:** 2026-07-18  
**Scope:** 32 published files in `src/blog/pop-culture`  
**Tasker:** `docs/taskers/T-15-pop-culture-section-audit.md`  
**Mode:** Diagnosis only. No published article, `published` flag, or `lastmod` field was changed.

## Executive verdict

The section needs a claims pass before a style pass.

- **Nine Tier A pages were audited for claims about named people.**
- **No Tier A page is safe as-is.** Five should be considered for temporary unpublishing until fixed; four are fixable in place after DJ reviews the proposed claim changes.
- **Five of the nine Tier A pages cite no external source at all.** Those five pages still make factual claims about health, addiction, contracts, employment conduct, relationships, money, and current events.
- **The Musk and Altman trial page is the most urgent problem.** It is still written as a prediction, but a jury ruled for OpenAI on 2026-05-18. Its strongest statements about Sam Altman's honesty and motives are unsupported personality assertions, not conclusions from the linked courtroom reporter.
- **The Epstein and Maxwell cluster has real sourcing, but reporting and interpretation are sometimes blended.** The most exposed passages convert emails, allegations, or an investigator's label into confident conclusions about living people.
- **No DOI appears anywhere in the published section.** The T-01 failure mode of a real DOI attached to a fabricated study was not found.
- **Citation plumbing is mostly intact.** The four cited Tier A pages contain 126 citation occurrences representing 107 unique external URLs. An automated resolution pass returned a normal 2xx or 3xx response for 94 unique URLs. Thirteen returned an anti-bot response (403, 406, or 429), not a 404. Eight of those thirteen resolved in a browser check; the remaining five were corroborated by search results and matching article titles, but should receive a normal human-browser click during remediation.
- **The quality debt is large but secondary:** 1,263 body em dash characters across 19 pages. Thirteen pages are already at zero.

This is an editorial risk assessment, not legal advice.

## Priority decision for DJ

| Priority | Page                                             | Recommendation                                       | Why                                                                                                                                                         |
| -------- | ------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | `musk-vs-altman-trial-personality-dynamics`      | **Unpublish until rebuilt**                          | The trial is over, the prediction is stale and wrong, and the article makes unsupported claims about Altman's honesty, motives, and likely testimony.       |
| P0       | `kardashian-family-enneagram-analysis`           | **Unpublish until claim-sourced**                    | Zero citations; extensive claims about living family members' mental health, addiction, relationships, motives, finances, and alleged exploitation.         |
| P0       | `alex-cooper-alix-earle-beef-enneagram-analysis` | **Unpublish until claim-sourced**                    | Zero citations; reports serious contract, workplace, threat, harassment, and relationship allegations as fact.                                              |
| P0       | `hollywood-heartthrobs-enneagram-analysis`       | **Unpublish until claim-sourced**                    | Zero citations; uses suicide, alcohol dependence, anxiety, stalking, family history, and relationship details as psychological evidence.                    |
| P0       | `epstein-psychology-part-2`                      | **Unpublish or hold behind an immediate legal edit** | Sources exist, but the page makes strong uncaveated conclusions about living people, including entitlement, procurement, hedonism, and hidden motives.      |
| P1       | `epstein-psychology-part-1`                      | **Fix in place after DJ review**                     | Substantial sourcing, but intelligence, blackmail, co-conspirator, and "mutual benefit" passages need tighter attribution and caveats.                      |
| P1       | `ghislaine-maxwell-psychology`                   | **Fix in place after DJ review**                     | Conviction facts are well sourced; childhood abuse, paranoia, espionage, and motive claims need clearer attribution and interpretive framing.               |
| P1       | `us-presidents-enneagram-analysis`               | **Fix in place immediately after DJ review**         | Zero citations, time-sensitive war copy is internally stale, and Trump is typed differently from the dedicated Trump/Biden page.                            |
| P2       | `trump-type-8-vs-biden-type-2`                   | **Fix in place after DJ review**                     | Zero citations and extensive mind-reading, childhood causation, and mental-health framing. It also conflicts with the Type 3 typing in the presidents page. |

## Method

1. Rebuilt the published inventory from frontmatter rather than trusting the tasker snapshot.
2. Counted body words and literal U+2014 characters after the closing frontmatter delimiter.
3. Extracted every external Markdown and HTML citation from the nine Tier A files.
4. Searched the full published section for DOI strings.
5. Resolved the 107 unique citation URLs with redirects enabled.
6. Checked anti-bot results through browser retrieval and search.
7. Compared citation targets with the claim beside each link.
8. Ran an adversarial second pass for:
   - diagnosis language;
   - claims of motive or inner state;
   - criminal, sexual, employment, contract, health, and substance-use claims;
   - current-event drift;
   - allegation-to-fact slippage;
   - source-tree editorial notes.
9. Used `docs/data/gsc/2026-07-06-pages.csv` only to help order the queue, not to excuse liability.

## Tier A summary

| Page                                             | Words | Body em dash | Citation occurrences / unique URLs | GSC clicks / impressions | Verdict               |
| ------------------------------------------------ | ----: | -----------: | ---------------------------------: | -----------------------: | --------------------- |
| `epstein-psychology-part-1`                      | 8,753 |          103 |                            71 / 66 |               10 / 2,758 | Fixable               |
| `epstein-psychology-part-2`                      | 4,680 |           61 |                            30 / 26 |                   No row | Unpublish until fixed |
| `ghislaine-maxwell-psychology`                   | 5,787 |           77 |                            22 / 21 |                 10 / 867 | Fixable               |
| `musk-vs-altman-trial-personality-dynamics`      | 3,846 |           53 |                              3 / 2 |                   No row | Unpublish until fixed |
| `kardashian-family-enneagram-analysis`           | 5,594 |           58 |                              0 / 0 |               16 / 1,594 | Unpublish until fixed |
| `alex-cooper-alix-earle-beef-enneagram-analysis` | 4,922 |           67 |                              0 / 0 |                   No row | Unpublish until fixed |
| `hollywood-heartthrobs-enneagram-analysis`       | 8,065 |          117 |                              0 / 0 |                  1 / 298 | Unpublish until fixed |
| `trump-type-8-vs-biden-type-2`                   | 4,097 |           26 |                              0 / 0 |                   No row | Fixable               |
| `us-presidents-enneagram-analysis`               | 4,698 |           95 |                              0 / 0 |                   No row | Fixable               |

## Citation resolution

### Section-wide result

| Test                                       | Result | Verdict                         |
| ------------------------------------------ | -----: | ------------------------------- |
| DOI strings in published pop-culture files |      0 | No fabricated-DOI pattern found |
| Citation occurrences in Tier A             |    126 | Concentrated in four pages      |
| Unique external citation URLs              |    107 | All inspected                   |
| Normal 2xx or 3xx response                 |     94 | Reachable                       |
| Automated anti-bot response                |     13 | Not evidence of a broken link   |
| Anti-bot URLs opened through browser       |      8 | Reachable and topic-matched     |
| Remaining title/search corroborations      |      5 | Human click still recommended   |
| Definite 404 or unrelated destination      |      0 | None found                      |

The remaining five access-limited URLs are the Britannica money explainer, three CNBC articles, and the Yahoo report about Maxwell's marriage. Their titles and indexed descriptions match the adjacent claims, but the remediation pass should click them in a normal browser before retaining the wording.

### `epstein-psychology-part-1`

**Verdict:** Fixable. The sourcing is broad and mostly topic-matched. The problem is not fabricated destinations; it is the confidence of the prose built on top of those sources.

| Claim cluster                                | Source actually resolves to                                     | Resolution verdict                                                                                          | Editorial verdict                                                                                                                                         |
| -------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Death in custody and jail failures           | DOJ OIG and AP/PBS reporting on custody failures and suicide    | Strong, primary plus reputable secondary                                                                    | Keep factual account; avoid suggestive sequencing that implies a different cause without evidence.                                                        |
| Eugenics and Harvard access                  | Guardian reporting and Harvard's institutional report           | Supports the reported "seed" plan and Harvard connection                                                    | Keep with attribution. Separate documented conduct from the Enneagram conclusion.                                                                         |
| Early life, Dalton, Bear Stearns, and wealth | Daily Beast, NPR affiliate, Britannica, Fox Business, CBS, WOSU | Topic-matched secondary reporting                                                                           | Keep only claims each source expressly supports. "Lucky breaks, lies and scams" must remain attributed.                                                   |
| Foreign passport and travel                  | NBC reporting                                                   | Directly supports the passport discovery                                                                    | Keep.                                                                                                                                                     |
| Intelligence connections                     | Middle East Eye, Anadolu, DOJ files, Breaking Points            | Resolves to allegations, source claims, records requests, and commentary, not a proven agency relationship  | Reframe every intelligence sentence as allegation or unresolved evidence. Cut rhetorical proof such as "why joke unless everyone assumed."                |
| Wexner relationship                          | Vanity Fair, WOSU, CNBC/CNN, NBC                                | Supports power of attorney, Wexner's statements, the FBI document label, deposition, and Giuffre allegation | Distinguish "named in an internal document" from a charge or finding. Preserve Wexner's denial and the document's limited-evidence note beside the claim. |
| Leon Black relationship                      | Air Mail, CBS, Senate Finance releases                          | Supports payments, email reporting, and the committee's questions                                           | "Potentially including blackmail" is a senator's stated concern, not a finding. Keep it in quotation and do not convert it into narrative fact.           |
| Maxwell conviction                           | Sentencing memo and SDNY case page                              | Strong primary record                                                                                       | Keep.                                                                                                                                                     |
| Epstein's intellectual persona               | Scientific American, Newsweek, reported interviews              | Supports the quoted opinions of named people                                                                | Keep as attributed opinions, not objective diagnosis.                                                                                                     |
| Custody psychiatric evaluation               | Linked evaluation PDF and NPR affiliate                         | Supports the quoted evaluation language                                                                     | Confirm provenance of the hosted PDF before relying on it as a primary record.                                                                            |
| Blackmail evidence                           | CNBC, LBC, CNN, NBC, House Oversight                            | Supports labeled CDs, reported cameras, Epstein's own claim, and Lutnick's quoted opinion                   | "Systematic operation to capture compromising material" is an inference. Label it as an inference and state what remains unproven.                        |
| Plea agreement and victims' rights           | Eleventh Circuit opinion and UPI                                | Supports the agreement and court history                                                                    | Keep with precise procedural language.                                                                                                                    |
| Institutional rehabilitation                 | MIT report, reporting on dinners and social contacts            | Supports donations and attendance                                                                           | Avoid implying misconduct by a person merely because they attended the same event.                                                                        |
| 2026 file fallout                            | DOJ, WOSU, AP/Reuters-level reporting, House Oversight          | Supports the release, arrests, depositions, and resignations                                                | Date-stamp the snapshot and distinguish arrest, investigation, allegation, and charge.                                                                    |

**Claims requiring a DJ-reviewed change**

- Lines 132 to 166 build an intelligence-service theory from reported associations, one former official's claim, records requests, and a joke in an email. **Action:** source each clause, add a clear "not established" sentence, and cut rhetorical certainty.
- Line 156 says Epstein operated above the people who made and enforced the law. **Action:** reframe as the author's thesis, not a discovered fact.
- Lines 223 to 227 discuss Wexner as a co-conspirator. **Action:** use "listed in an internal 2019 FBI document" every time; state that he was not charged and denies wrongdoing in the same paragraph.
- Line 249 reports a surveillance and intimidation proposal involving Leon Black's former partner. **Action:** keep only the email-supported wording and attribute it directly to CBS reporting.
- Lines 371 to 375 move from cameras and Epstein's boasts to a blackmail-system conclusion. **Action:** clearly label the conclusion as an inference.
- The ending says Wexner's arrangement looks like "mutual benefit." **Action:** cut or frame as a question unless a source establishes the claimed benefit.
- The statement that the 2008 immunity language is the primary legal barrier is legal analysis without a primary legal source. **Action:** source to the agreement and qualified legal analysis, or narrow it.

### `epstein-psychology-part-2`

**Verdict:** Unpublish until fixed, or place behind an immediate DJ-reviewed legal edit. The source links are real, but the article repeatedly turns documents into confident psychological conclusions about living people.

| Claim cluster                       | Source actually resolves to                                                    | Resolution verdict                                          | Editorial verdict                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Victim targeting and Maxwell's role | Government sentencing memo, ABC, NBC                                           | Strong court record and reported testimony                  | Keep with victim-centered attribution.                                                                                                 |
| DOJ document release                | DOJ press release                                                              | Primary source confirms nearly 3.5 million released pages   | Keep with date.                                                                                                                        |
| Musk emails                         | TIME and Fortune reports on released emails                                    | Supports the quoted exchanges and chronology                | Does not prove hedonism, a "pressure valve," hidden need, or the article's personality explanation. Reframe or cut those conclusions.  |
| Gates allegation                    | Guardian and Breaking Points coverage of an Epstein draft, plus Gates response | Supports the existence of the draft and the denial          | The page handles the truth-status caveat well. Keep the caveat immediately attached. Cut unsupported Type 5 mind-reading.              |
| Tisch emails                        | CBS Sports, Defector, NBC Sports                                               | Supports reported language, dates, and Tisch's response     | The emails warrant scrutiny, but "procurer," "entitlement," and "catalog" are conclusions. Attribute and frame them as interpretation. |
| Household manual and enablers       | Law and Crime plus the Maxwell trial record                                    | Supports the quoted manual                                  | Claims about every staff member's knowledge, pay, or silence need individual sourcing.                                                 |
| Harvard and MIT                     | CBS and MIT institutional report                                               | Supports donation totals and concealment history            | Keep.                                                                                                                                  |
| Mandelson and accountability        | Guardian, Breaking Points, Florida Bulldog, Mediaite, Intercept                | Supports the arrest, quotations, and reported plea language | "Bipartisan disincentive" and the full explanation of the US accountability gap are analysis, not established fact. Label or source.   |
| Darwinian worldview                 | The Nerve and quoted public remarks                                            | Supports a journalist's thesis and quoted comments          | Do not present the journalist's synthesis as the proven shared worldview of every named scientist or donor.                            |

**Claims requiring a DJ-reviewed change**

- Lines 142 to 177 present a universal four-stage hidden-camera trap as Epstein's established process. **Action:** distinguish documented tactics from the author's model.
- Lines 207 to 216 infer Musk's private needs and cast the emails as proof that he sought a hedonistic release. **Action:** retain the documentary chronology; remove or clearly label the motive theory.
- Lines 219 to 230 call Tisch's conduct procurement and reduce his motive to entitlement. **Action:** quote the reported emails, include his adult-women statement, and label the interpretation.
- Lines 240 to 243 imply a broad set of employees knowingly enabled trafficking. **Action:** source individuals separately and avoid group guilt.
- Lines 253 to 257 explain the absence of US prosecutions with legal and partisan conclusions. **Action:** source qualified legal analysis and mark political interpretation as interpretation.
- Lines 277 to 280 assign needs to Wexner, Gates, and Musk as the reason each stayed connected. **Action:** remove the factual voice.
- Lines 292 to 297 imply scientists in Epstein's orbit shared a master-race logic. **Action:** narrow to the quoted people and documented funding.
- The source contains three large internal review-note comments at lines 387 to 503. They are excluded from the live visible text, but are embedded in the compiled server chunk. **Action:** remove them during the approved fix; do not treat this as the same live `QUALITY_FEEDBACK` leak covered by T-10.

### `ghislaine-maxwell-psychology`

**Verdict:** Fixable. Conviction and trial facts are well sourced. The vulnerable areas are childhood causation, clinical-sounding labels, espionage framing, and inferred motives.

| Claim cluster                   | Source actually resolves to                                               | Resolution verdict                                                          | Editorial verdict                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Conviction and sentence         | Sentencing memo, SDNY, PBS/AP                                             | Strong primary and reputable secondary                                      | Keep.                                                                                                        |
| Childhood and household abuse   | Betty Maxwell memoir listing, Tom Bower report, Times of Israel interview | Secondary and family-biography material                                     | Attribute every claim. Do not convert it into a causal diagnosis.                                            |
| Grenade and security behavior   | Daily Beast report based on a former dog walker                           | Supports the reported anecdote                                              | "Paranoia" is a clinical-sounding conclusion. Replace with observable behavior or attributed wording.        |
| Robert Maxwell and intelligence | Times of Israel, MuckRock, Middle East Eye                                | Supports funeral facts, a classified FBI file, and reported allegations     | Does not prove a specific intelligence role for Ghislaine or Epstein. Keep allegations explicitly qualified. |
| Conduct in Epstein's homes      | ABC, CNN, Giuffre testimony, forensic psychologist commentary             | Supports testimony, conviction context, and a psychologist's interpretation | Attribute testimony and expert analysis. Avoid presenting one expert's model as clinical fact.               |
| Email relationship              | Bloomberg Law reporting                                                   | Supports the existence and reported texture of the correspondence           | Quote and attribute; do not infer inner state as fact.                                                       |
| Arrest and marriage             | NBC, SCMP, Yahoo-indexed report                                           | Supports property, arrest circumstances, and reported marriage history      | Keep reported facts; use "a report said" for the prison-call account.                                        |
| 2025 DOJ interview              | DOJ transcripts and PBS                                                   | Strong primary plus summary                                                 | Keep with precise immunity language.                                                                         |

**Claims requiring a DJ-reviewed change**

- The description says trauma, espionage, and pathological loyalty "created" Maxwell as a partner for a predator. **Action:** remove the causal certainty.
- Line 80 labels reported security behavior "paranoia." **Action:** describe the behavior without diagnosing it.
- Childhood material repeatedly treats family abuse as the direct cause of later conduct. **Action:** present it as context and explicitly reject causal certainty.
- Intelligence material uses proximity and family history to imply an operational connection. **Action:** distinguish documented relationships from allegations.
- "Identification with the aggressor," "hostage princess," and Type 6 claims should be presented as interpretive lenses, not findings.
- Lines 342 to 347 contain internal editorial notes. They are not visible in the live article text but remain in the server build artifact. **Action:** remove during the approved edit.

### `musk-vs-altman-trial-personality-dynamics`

**Verdict:** Unpublish until rebuilt.

| Claim cluster               | Source actually resolves to                               | Resolution verdict                                              | Editorial verdict                                                                                                  |
| --------------------------- | --------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Courtroom "vibes" reporting | The Rip Current home page and Jacob Ward's TikTok profile | General reporter destinations, not claim-level citations        | Inadequate for the article's detailed factual and psychological claims.                                            |
| Trial outcome               | AP and Reuters reporting published 2026-05-18             | Jury sided with OpenAI; the case was rejected as filed too late | The published article still predicts future testimony and predicts Altman will win on personality. It is obsolete. |

The current outcome is documented by [AP](https://apnews.com/article/0b9b0bfaffe96f2c930341f52dfe4f8c) and [Reuters](https://www.reuters.com/legal/litigation/view-california-jury-sides-with-openai-over-musk-lawsuit-2026-05-18/).

**Claims requiring a DJ-reviewed change**

- Lines 106 to 116 call Altman a liar, say he is "unburdened by the truth," and claim he creates a different self for every audience. **Action:** cut. A board statement that he was "not consistently candid" does not support this expansion.
- Lines 130 to 142 state what Altman will do, how the jury will feel, and why Musk sought control. **Action:** replace the prediction structure with a sourced post-verdict account.
- Lines 152 to 162 infer calculated woundedness from Altman's 2023 firing and tie Musk's stress to children, substances, feuds, and purchases. **Action:** cut unless each factual claim is sourced and the personality causation is clearly labeled as interpretation.
- Lines 172 to 207 script future testimony and predict the result. **Action:** remove. The trial is complete.
- The article cites the reporter generally but does not cite the court docket, filings, testimony, verdict, or the specific factual claims it makes.

**Rebuild brief**

1. Lead with what the jury and judge actually decided.
2. Separate the limitations defense from the underlying mission dispute.
3. Use primary court filings and direct testimony.
4. If Enneagram interpretation remains, confine it to communication style and label it as speculative.
5. Do not make claims about honesty, autism-related behavior, motive, substance use, or family life without direct, relevant sourcing.

### `kardashian-family-enneagram-analysis`

**Verdict:** Unpublish until claim-sourced.

| Claim cluster                        | Source actually resolves to | Resolution verdict | Editorial verdict                                                            |
| ------------------------------------ | --------------------------- | ------------------ | ---------------------------------------------------------------------------- |
| All factual and psychological claims | No external citation        | Unresolved         | The disclaimer does not cure unsupported facts or health and conduct claims. |

**Claims requiring a DJ-reviewed change**

- Net worth, company valuation, sale price, follower counts, and the Snapchat market-cap event need dated financial or reputable reporting.
- Claims that Kris exploited her children, spins crises, monetizes trauma, or experienced a transition as betrayal must be attributed or reframed as questions.
- Kendall's panic attacks, hospitalization, flight behavior, and panic-free period are health claims and need direct interview or reputable reporting.
- Rob's depression and weight history must be sourced to his own public account or removed.
- The table connecting Lamar Odom, Scott Disick, Tristan Thompson, Kanye West, and Travis Scott to addiction, mental-health crises, cheating, or relationship causation is high-risk and should be removed or rebuilt from sources.
- "Why men who date Kardashians spiral" is a causal allegation about multiple living people. Cut the frame.
- Kylie material mixes a reported comment about her lips, cosmetic procedures, private motives, and a claim that she disappears into partners. Keep only sourced facts and label the rest as interpretation.
- The "Kardashian curse" section assigns partners' outcomes to family personality dynamics. Cut.

### `alex-cooper-alix-earle-beef-enneagram-analysis`

**Verdict:** Unpublish until claim-sourced.

| Claim cluster                        | Source actually resolves to | Resolution verdict        | Editorial verdict                                                                |
| ------------------------------------ | --------------------------- | ------------------------- | -------------------------------------------------------------------------------- |
| All factual and psychological claims | No external citation        | Unresolved in the article | Reputable reports exist, but the published page does not connect claims to them. |

Public reporting confirms the broad feud timeline, including Cooper's 2026-04-13 public callout and Earle's later response, but the article still needs claim-level sourcing. Useful starting points include [NBC/TODAY](https://www.nbclosangeles.com/entertainment/entertainment-news/alex-cooper-calls-out-alix-earle-feud-rumors/3875290/), [Vanity Fair](https://www.vanityfair.com/story/alex-coopers-mean-girl-problem), and [People](https://people.com/why-are-alex-cooper-and-alix-earle-feuding-11948717).

**Claims requiring a DJ-reviewed change**

- The company, podcast, contract, IP, compensation, and SiriusXM figures need primary announcements or reputable business reporting.
- "Felt taken advantage of," the father's role, and the claimed contract structure must be attributed to named reporting and presented as allegations or reported accounts.
- The article states that Matt Kaplan threatened a worker's career, reduced someone to tears, became the source of workplace heat, and was the subject of formal complaints. These are serious workplace allegations. Cite the underlying reporting beside every sentence and include responses or denials.
- The account of TJ Earle's affair and family history needs sourcing and a clear reason for inclusion. Otherwise cut it as prejudicial background.
- The Boston University coach allegations, university response, and former-player defense need direct citations and balanced attribution.
- Personality claims such as Earle needing her father to mobilize her exit, Cooper converting controversy into the next thing, and either woman's private fear should be framed as the author's interpretation.
- The article's timeline is already moving. Earle has since said she will discuss the feud in an upcoming Netflix series, so the conclusion is not durable.

### `hollywood-heartthrobs-enneagram-analysis`

**Verdict:** Unpublish until claim-sourced.

| Claim cluster                        | Source actually resolves to | Resolution verdict        | Editorial verdict                                                      |
| ------------------------------------ | --------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| All factual and psychological claims | No external citation        | Unresolved in the article | The page uses many direct quotations without identifying their source. |

**Claims requiring a DJ-reviewed change**

- Pedro Pascal's refugee history, mother's suicide, anxiety interpretation, sibling role, and quoted interviews need direct sources. "Refugee nervous system" and "survival wiring" should not be presented as established psychology.
- Jacob Elordi fan-contact stories and motive claims need source links and a clear distinction between his words and the author's Type 4 interpretation.
- Robert Pattinson crowd incidents, dissociative coping, relationship surveillance, anxiety, and parenthood quotations need direct citations.
- Timothee Chalamet anxiety, ambition, body language, and strategic career-choice claims need direct sources. Do not infer an anxiety disorder from nervousness.
- Tom Holland's social-media break, alcohol dependence, sobriety, and mental-health statements are health and substance-use claims. Use his own interviews and do not diagnose beyond his words.
- Stalker, crowd-crush, and home-security anecdotes must be sourced individually.
- The opening restaurant scene reads as reported fact but appears constructed. Label it as a hypothetical scene or replace it with a documented incident.
- The page repeatedly claims fans have absent-father dynamics or that a crush reveals a psychological wound. Present those as hypotheses supported by research, not facts about the reader.

### `trump-type-8-vs-biden-type-2`

**Verdict:** Fixable.

| Claim cluster                        | Source actually resolves to | Resolution verdict | Editorial verdict                                                                                   |
| ------------------------------------ | --------------------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| All factual and psychological claims | No external citation        | Unresolved         | Public-record facts are sourceable, but mind-reading and childhood causation remain interpretation. |

**Claims requiring a DJ-reviewed change**

- The page states what Trump and Biden see, cannot understand, fear, and privately value. **Action:** recast as an Enneagram interpretation based on observable communication.
- Childhood sections treat parenting and early adversity as direct causes of adult political behavior. **Action:** source the biographies and remove causal certainty.
- The mental-health FAQ treats Enneagram stress movement as an answer about each man's mental health. **Action:** rename it to conflict behavior and add a non-clinical caveat.
- The page calls Trump a classic Type 8 while `us-presidents-enneagram-analysis` argues that this typing is wrong and calls him a Type 3. **Action:** choose one editorial position and cross-link the rationale.
- The FAQ schema includes stray `---` text and assertions not supported in the body. **Action:** repair during the content pass.

### `us-presidents-enneagram-analysis`

**Verdict:** Fixable, but time-sensitive claims should be corrected promptly.

| Claim cluster                        | Source actually resolves to | Resolution verdict | Editorial verdict                                                                 |
| ------------------------------------ | --------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| All factual and psychological claims | No external citation        | Unresolved         | Historical and current claims need sources; current-war copy is internally stale. |

The existence of the 2026 US-Iran conflict is well established. The issue is the page's unsupported detail and broken time frame. As of the audit date, AP was reporting renewed strikes and continued war activity, not a conflict in its fourth week. See [AP's 2026-07-18 report](https://apnews.com/article/179973cfe1fb3fa1b7ea7b816648ad9c) and the [American Presidency Project record of the 2026-03-20 military-operation statement](https://www.presidency.ucsb.edu/documents/statement-united-states-military-operations-iran).

**Claims requiring a DJ-reviewed change**

- The page is dated 2026-06-22 but says a war beginning 2026-02-28 is in its fourth week. That is internally impossible even before considering later events.
- The president table labels the Trump period "Iran War era (2025)" while the body dates the war to 2026.
- The claim of 225 executive orders in 2025, the claimed record since FDR, the strike counts, troop movements, official decision flow, Supreme Court tariff ruling, and changing war goals all need direct citations.
- The article states that Trump does not govern from ideology, fires people for brand protection, and cannot psychologically tolerate looking like a loser. **Action:** label as interpretation and remove clinical certainty.
- Biden's pardons and the article's institutional conclusion need primary sources and a clearer separation between fact and Enneagram interpretation.
- The article calls Trump a Type 3 and explicitly rejects Type 8, contradicting the dedicated Trump/Biden page.
- Historic claims about presidential motives, affairs, depression, war decisions, and AIDS policy need reputable historical sourcing.

## Section-wide quality audit

### Inventory and em dash counts

| Page                                             | Tier         |     Approx. words | Body em dash |
| ------------------------------------------------ | ------------ | ----------------: | -----------: |
| `alex-cooper-alix-earle-beef-enneagram-analysis` | A            |             4,922 |           67 |
| `breaking-points-enneagram-analysis`             | B            |             3,804 |            0 |
| `cancel-culture-enneagram-type`                  | B            |             2,340 |           33 |
| `comedy-kings-enneagram-analysis`                | B            |             4,438 |            0 |
| `dark-triad-meets-enneagram`                     | B            |             3,201 |            0 |
| `epstein-psychology-part-1`                      | A            |             8,753 |          103 |
| `epstein-psychology-part-2`                      | A            |             4,680 |           61 |
| `fallen-founders-enneagram-analysis`             | B            |             4,368 |            0 |
| `ghislaine-maxwell-psychology`                   | A            |             5,787 |           77 |
| `google-leadership-evolution`                    | B            |             6,334 |           82 |
| `hollywood-heartthrobs-enneagram-analysis`       | A            |             8,065 |          117 |
| `incel-blackpill-radicalization-enneagram`       | B            |             4,858 |           85 |
| `influencer-enneagram-types-instagram`           | B            |             3,332 |           33 |
| `kardashian-family-enneagram-analysis`           | A            |             5,594 |           58 |
| `masculinity-strength-and-the-enneagram`         | B            |             2,370 |           45 |
| `musk-vs-altman-trial-personality-dynamics`      | A            |             3,846 |           53 |
| `parasocial-relationships-enneagram-type`        | B            |             3,717 |           22 |
| `podcast-bros-enneagram-analysis`                | B            |             5,432 |           69 |
| `podcaster-personality-map`                      | B            |             7,128 |          135 |
| `psychology-of-public-shame`                     | B            |             5,087 |           67 |
| `reddit-moderators-type-1-internet`              | B            |             2,762 |            0 |
| `tbpn-john-coogan-jordi-hays-enneagram-dynamic`  | B            |             4,464 |            0 |
| `tech-titans-ai-wars`                            | B            |             5,153 |            0 |
| `tech-titans-disruptors`                         | B            |             2,097 |            0 |
| `tech-titans-enneagram-analysis`                 | B            |             1,422 |            0 |
| `tech-titans-founders-vs-stewards`               | B            |             3,779 |            0 |
| `tech-titans-leadership-styles`                  | B            |             6,566 |            0 |
| `tech-titans-platform-emperors`                  | B            |             4,180 |            0 |
| `trump-type-8-vs-biden-type-2`                   | A            |             4,097 |           26 |
| `twitter-x-personality-types-toxic`              | B            |             2,692 |           35 |
| `us-presidents-enneagram-analysis`               | A            |             4,698 |           95 |
| `what-enneagram-type-are-most-musicians`         | B            |             2,369 |            0 |
| **Total**                                        | **32 pages** | **about 142,335** |    **1,263** |

### Template sameness

- Twenty-nine of 32 pages use the same `QuickAnswer` opening mechanism.
- Eleven pages end with an H2 titled `Rabbit Holes Worth Exploring`.
- Six use the exact H2 `FAQs`.
- Three use the exact H2 `Questions This Blog Will Answer`.
- Many pages share the same sequence: high-drama cold open, type table, one section per person or type, predictable shadow section, FAQ, and internal-link list.
- The recurrent contrast pattern "not X, Y" and strings of short sentence fragments create an AI-generated cadence even when the underlying idea is good.
- The highest-density pages often convert the Enneagram from a lens into a universal causal answer. That is a substance issue, not merely a punctuation issue.

### Tier B de-AI order

After Tier A liability work is decided, apply the T-14 method to Tier B in this order:

1. `podcaster-personality-map` (135)
2. `incel-blackpill-radicalization-enneagram` (85)
3. `google-leadership-evolution` (82)
4. `podcast-bros-enneagram-analysis` (69)
5. `psychology-of-public-shame` (67)
6. `masculinity-strength-and-the-enneagram` (45)
7. `twitter-x-personality-types-toxic` (35)
8. `cancel-culture-enneagram-type` (33)
9. `influencer-enneagram-types-instagram` (33)
10. `parasocial-relationships-enneagram-type` (22)

The thirteen Tier B pages already at zero em dash still need substance tests for fake specificity, mind-reading, repeated template scaffolding, and generic conclusions. Zero punctuation debt is not proof of editorial quality.

## Approved-fix sequence

1. **DJ decision:** approve temporary unpublishing or an immediate legal edit for the five P0 pages.
2. **Rebuild Musk/Altman first:** replace the prediction with a sourced post-verdict article.
3. **Create a claim ledger for each remaining P0 page:** one row per factual claim, source, counterpoint, and final wording.
4. **Repair Tier A in descending exposure:** Kardashian, Alex/Alix, Hollywood, Epstein Part 2, then Epstein Part 1, Maxwell, presidents, and Trump/Biden.
5. **Resolve the Trump typing conflict** before editing either presidential article.
6. **Remove internal review-note comments** from Epstein Part 2 and Maxwell during their approved edits. Do not fold this into T-10's byte-sensitive QFB work.
7. **Run the Tier B de-AI pass** only after the liability queue is controlled.
8. **Verify every edited page:** zero U+2014 in visible body and metadata, unchanged `lastmod`, valid JSON-LD, preserved internal links and widgets, `pnpm check`, and `pnpm build`.

## What this audit did not do

- It did not make a legal determination.
- It did not unpublish or rewrite any article.
- It did not change `lastmod`.
- It did not count a same-event source as proof of a psychological inference.
- It did not treat disclaimers as a substitute for sourcing.
- It did not treat an anti-bot response as a broken citation.
- It did not hand Tier A directly to a bulk de-AI process.

## Completion state

T-15's diagnosis deliverable is complete. Remediation remains deliberately open and DJ-gated.
