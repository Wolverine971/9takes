# People-blog pipeline audit — September 9, 2026

The pipeline has strong editorial instincts, but too many of its stages compensate for problems introduced upstream. The best improvement is to strengthen the evidence and type hypothesis before drafting, reduce repeated editing, and give every hard requirement one authoritative implementation.

The desired outcome is a memorable, evidence-rich psychological profile that remains useful for years. That calls for rigor about what we know, freedom in how we tell the story, and an Enneagram argument that survives counterevidence.

This is an audit and proposed redesign. No production scripts, prompts, articles, queue entries, publishing settings, or database records were changed.

## Scope and evidence

Reviewed the 735-line runner; all invoked writing/review/grading commands; the entity-gap command; research and writing frameworks; editorial standards; the grading rubric; lint, source, quality, similarity, and perspective checks; and the adjacent nightly, watchdog, production, and publishing paths. The 14 principal editorial command files alone contain 4,161 lines, excluding the entity-gap command and their supporting references.

Inspected 91 saved run summaries, with a closer look at the 29 summaries dated August 13–September 1. These include retries and manual runs, so they are not 29 independent subjects or a controlled quality experiment. Reviewed representative review artifacts, the full current Ryan Holiday body, and selected passages from other profiles. This was not an external fact-check of the sampled biographies.

Within that recent group:

| Observation | Count |
| --- | ---: |
| Runs marked `completed: true` | 26 |
| Completed runs that used revision | 19 |
| Completed runs with stage warnings | 21 |
| Completed runs with no final overall grade | 4 |
| Completed runs with a recorded non-passing perspective status | 8 |
| Completed runs whose initial similarity scan exited nonzero | 15 |
| Completed runs whose post-revision similarity scan exited nonzero | 12 |

These are operational outcomes, not judgments that the articles are bad. They show how often the pipeline enters repair or needs human interpretation.

Read-only verification included shell syntax checks, a fresh similarity scan, isolated source-audit and revision-branch probes, and a grade-arithmetic scan. Of 157 local rubric-v2 records containing all six numeric dimensions, one differed from the documented weighted calculation by 0.1. Arithmetic is worth automating, but it is not the main observed grading problem.

## What to preserve

- **The refresh admission test.** News earns space only when it deepens or complicates the personality analysis. This is the best concise statement of the product in the system. Apply it to creation too. [Refresh rules](/Users/djwayne/9takes/.claude/commands/blog_refresh_people.md:29)
- **First-person material and named testimony.** The archive/transcript emphasis is valuable. The Ryan Holiday profile's use of his 2011 essay illustrates the payoff: a specific earlier account gives the later interpretation something concrete to answer to.
- **Independent scrutiny.** The subject, critic, and Enneagram perspectives ask necessary questions about fairness, causality, and alternative explanations. Do not replace these with writer self-certification.
- **Protected passages and acceptance tests.** Preserve strong details while fixing problems; verify repairs against specific findings.
- **Version-bound verification.** The perspective hash includes the body and selected editorial metadata, so a passing review cannot silently cover rewritten copy. Preserve this mechanism. [Hash implementation](/Users/djwayne/9takes/scripts/lib/perspectiveReview.js:16)
- **A bounded repair loop and a word ceiling.** Both prevent endless polishing and accretion. Keep them, while improving what triggers repair and what happens when repair fails.

## Findings, ranked by importance

### 1. The system needs one definition of an editorial blocker

The creator says uncertain typing or failed testimony gates can set `production_pretext.status: blocked`. Its ordinary handoff requires reviewed/ready state. But the runner checks that a draft exists after creation, then proceeds without inspecting those blockers. The publisher's candidate check does not inspect `production_pretext` either.

There are further differences:

- Pipeline source auditing fails on **any** untagged quote in its selected load-bearing slots; publication checks only the epigraph/cold-open subset.
- Publication does not run blog lint, enforce its maximum word count, or consume the final similarity result.
- Revision checks overall, discoverability, lint, and report failures; it does not directly inspect active grade caps, `needs_review`, or creator blockers.
- Live updates have the perspective gate, but do not use the same complete editorial eligibility predicate as a new publication.

The publisher does have real safeguards: grades, caps, source availability, perspective verification, article completeness, and images. This finding is about gaps between the contracts, not the absence of a release gate.

**Change:** implement one reusable local eligibility check with named unresolved issues. Call it from finalization, nightly reconciliation, publishing, and relevant refresh/update paths. Separate editorial eligibility from the user's chosen release authorization policy; make that policy explicit in one place. A creator blocker must be deliberately resolved, never lost because later scores are high.

References: [post-create continuation](/Users/djwayne/9takes/scripts/run-blog-pipeline.sh:502), [publication checks](/Users/djwayne/9takes/scripts/personBlogParser.js:1065), [production contract](/Users/djwayne/9takes/.claude/commands/blog_content_production_people.md:90), [live-update gate](/Users/djwayne/9takes/scripts/personBlogParser.js:1761).

### 2. Type selection contains a direct contradiction and starts too early

The creator's unattended defaults say to pick the leading type and proceed when ambiguous. Its later type-challenge rule says to stop before drafting when confidence is low or there is no tiebreaker. These instructions can produce different outcomes for the same evidence. [Auto-proceed default](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people_v2.md:73), [type challenge](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people_v2.md:806).

The workflow also performs Enneagram analysis before its mandatory transcript gather. The supporting analysis framework begins with an assigned type and asks how childhood echoes that type's wound. It permits wings, stress, and growth to explain mismatches. This encourages fitting later evidence to an already attractive story. The subsequent jury challenges that story, but only after several drafting/editing passes. [Analysis framework](/Users/djwayne/9takes/docs/blogs-famous-people/prep-prompt-2.md:14).

**Change:** complete substantive source collection first. Then write a short type hypothesis with evidence for, evidence against, the strongest alternative, a discriminating observation, and what remains unexplained. Permit `insufficient_evidence`. Distinguish core-type confidence from wing/subtype confidence. Let ordinary professional incentives, public performance, circumstances, and learned practices compete with the type explanation.

The useful question is: **What does this person repeatedly protect or pursue, especially when it costs them something, and why does this type explain that better than the alternatives?** A dramatic anecdote alone should not settle it.

### 3. Some writing requirements push psychological depth toward invented certainty

The creator asks for confident analysis because a bottom disclaimer handles speculation. It also requires a childhood-to-adult thread, emotional thesis, empathy turn, and interior beat; its furniture table explicitly invites imagining what the person was thinking. Later subject reviewers must catch unsupported interiority and reduction of a life to one wound. [Confidence rule](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people_v2.md:135), [emotional layer](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people_v2.md:885), [fairness review](/Users/djwayne/9takes/.claude/commands/blog_perspective_review_people.md:63).

This is visible in the Ryan Holiday sample: an explicitly reconstructed first-person poolside monologue sits alongside sourced quotations. Its recurring courtroom metaphor gives the article coherence, but also makes many different behaviors serve the same psychological explanation. This is an editorial concern, not a finding that its reported events are false.

**Change:** use a sourced self-description for the interior beat. Explain inferred motives as interpretations at the point where the inference occurs. A short phrase such as “One reading of that choice…” can do this without hedging every sentence. Do not require childhood causation when the evidence only supports an adult pattern. Preserve some material that complicates the thesis: pleasure, competence, affection, change, or behavior it does not explain.

The goal should be **one organizing question, with room for competing causes**, rather than one explanation that absorbs every part of a life.

### 4. The evergreen goal conflicts with mandatory recency

The creator requires a last-24-month anchor for living/current figures. The rubric caps originality when it is absent. The future reviewer tests twelve-month durability, while the creator's final checklist asks whether the piece is valuable five years from now. [Recency requirement](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people_v2.md:271), [rubric cap](/Users/djwayne/9takes/docs/content-analysis/blog-grading-rubric.md:170), [future reviewer](/Users/djwayne/9takes/.claude/commands/blog_perspective_review_people.md:144).

A recent event can be excellent evidence. Requiring one in every profile also encourages temporary job titles, controversies, project counts, and news hooks that create maintenance work without deepening the analysis.

**Change:** require a current accuracy check, not mandatory current-event prose. Use the refresh command's deepens/confirms/neither test during creation. Date events absolutely. Keep a sidecar list of time-sensitive claims and review triggers. Apply a five-year removal test: if the latest event disappears, does the central insight still hold?

### 5. The similarity gate has reproducible false positives

A fresh run of `node scripts/same-type-similarity.mjs Demis-Hassabis --n 8 --json --fail-on-trip` flagged the ordinary type-answer sentence against Naval Ravikant and Yang Zhilin at **1.000**. The “informative” shared phrases were `subj subj` and `subj subj is`. It also flagged `August 2026` as shared phrasing.

The scanner already removes Markdown headings. The remaining problem includes the required extractable answer in prose and the treatment of normalized name placeholders/dates as meaningful argument overlap. This is more precise than saying it simply compares headings.

The Demis run on August 29 failed this check before and after revision. Similar failures recur in the recent logs, although not every similarity failure was individually adjudicated as false.

**Change:** exclude neutral type-answer boilerplate, entity placeholders, and date-only overlaps from informative features. Use labeled true/false examples to calibrate a gate before allowing it to demand edits. Route uncertain similarity findings to editorial review. Do not make writers rewrite required identity sentences to appease the scanner.

References: [feature filter](/Users/djwayne/9takes/scripts/same-type-similarity.mjs:388), [trip decision](/Users/djwayne/9takes/scripts/same-type-similarity.mjs:458), [historical scan](/Users/djwayne/9takes/docs/content-analysis/pipeline-logs/2026-08-29_021004_demis-hassabis/6.8_same_type_similarity.log).

### 6. Attribution lint is doing work that needs a claim-to-source record

The source audit classifies quotation windows using recognized outlet names, years, and venue words. It does not open the source or establish that the quote occurs there. Its five selected regions are also not a complete inventory of the article's factual and psychological claims. The empathy detector searches for the negative-parallelism construction that the writer is instructed to eliminate. [Attribution classifier](/Users/djwayne/9takes/scripts/blog-source-audit.mjs:659), [empathy extraction](/Users/djwayne/9takes/scripts/blog-source-audit.mjs:804).

An isolated fictional fixture with an invented quotation attributed to “The Guardian, 2020” classified that quotation as `inline`. This is expected for an attribution heuristic; it demonstrates why its result must not be interpreted as verified evidence. The same fixture produced an untagged later quotation while leaving `untagged_in_epigraph_or_cold_open: false`, illustrating the pipeline/publisher subset difference.

**Change:** reuse and extend the existing durable research file and `CLM-*` inventory. Give every load-bearing claim a source ID, source location, relevant excerpt/context, claim class, and verification status. The checker validates references and coverage; an independent reviewer verifies meaning and context. Track what a quotation **cannot** establish about motive as carefully as what it supports.

The creator already persists research, which is a strong foundation. Later passes should append their new evidence to the same record; the second pass currently edits only the draft, leaving the later packet builder to rediscover some sourcing.

### 7. Editorial ceremony is much larger than the article

A normal successful create path launches **18 top-level Claude sessions**; the revision path launches **21**. Refresh saves one by skipping second-pass. These counts exclude tool calls and any work nested inside those sessions.

Several calls overlap: fresh eyes identifies omissions/repetition, second-pass repairs them, cohesion adjusts structure, the jury rediagnoses the draft, the editor can perform structural edits, and the grader can request another repair. The writer itself already runs a multistep research/draft/self-review workflow.

One concrete example: the Marcus Aurelius review directory contains approximately **37,968 words across six reviews**, an **11,920-word evidence packet**, and a **12,413-word synthesis**. Ryan Holiday has about 36,673 review words and a 13,493-word synthesis. These are whitespace counts of Markdown artifacts, including metadata/tables, not body-prose counts or token usage. The large syntheses show that deduplication is not producing a small editor worklist.

**Change:** first merge fresh-eyes/second-pass/cohesion responsibilities into one editorial cycle. Give reviews a bounded high-value worklist, with no limit that forces material factual errors to be omitted. Put supporting research behind source IDs. Then pilot two independent reviews on ordinary profiles, retaining the full six-perspective process for cases that need it. The current editorial standard mandates six, so reducing that requirement is a coordinated policy change, not a runner-only deletion.

### 8. Anti-formula instructions coexist with an extensive mandatory formula

The writer is told to be distinctive, yet must include an epigraph, scene hook, TL;DR, paired type headings, childhood thread, critic pressure, empathy turn, interior beat, bespoke section, recent anchor, cut-to-black ending, and a 400–700-word Rabbit Hole with wing, subtype, arrows, and counterarguments.

The Rabbit Hole even requires a subtype “best guess.” Meanwhile the rubric's top evidence band says 90%+ should be the subject's own words or testimony; the writing reference suggests 60–80%. Neither is a useful universal measure of a good original analysis. [Required elements](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people_v2.md:855), [Rabbit Hole](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people_v2.md:1075), [quote targets](/Users/djwayne/9takes/docs/blogs-famous-people/writing-prompt-1.md:83).

**Change:** keep outcome requirements—clear orientation, specific evidence, a consequential insight, a supported type argument, counterevidence, readable pacing. Make most presentation devices optional. Advanced typology earns space when supported; “not enough evidence to distinguish” is acceptable. Put a short explanation of the strongest alternative beside the main type claim, with optional technical detail in the accordion. Replace quote percentages with evidence coverage, source independence, contextual fidelity, and contribution to the argument.

### 9. Metadata can become stale, and one instruction manufactures precision

Enrichment is additive and explicitly preserves substantive existing FAQs unchanged. That conflicts with deriving FAQs from the final analysis during refresh. Revision happens after enrichment, so changes to body claims or anchors also require metadata reconciliation. The perspective hash correctly includes FAQs, but a matching hash is not proof that an old answer still agrees with a new body.

More directly, enrichment says to turn a known birth year into `YYYY-01-01` when the day is unknown. That creates a specific birthday unsupported by the source. [FAQ preservation](/Users/djwayne/9takes/.claude/commands/blog_content_frontmatter_enrich_people.md:82), [birth-date rule](/Users/djwayne/9takes/.claude/commands/blog_content_frontmatter_enrich_people.md:141).

**Change:** preserve unchanged facts, but regenerate affected derived fields when their supporting claims change. Permit unknown/partial dates where the schema supports them; otherwise omit the full date. Finish substantive editing before generating final FAQs and citations, then verify body and metadata together.

### 10. “Completed” and “ready” need distinct machine-readable outcomes

`run_stage` deliberately records failures and returns success, and the runner ends with `write_summary true`. The nightly wrapper subsequently checks publication readiness and stage warnings, which helps. Running the pipeline directly, however, does not produce a single authoritative final eligibility result.

The Rebecca Yarros run exhausted usage, failed reviews/editor/enrichment/grading, and still has `completed: true`. This can reasonably mean “attempt finished,” but consumers must not infer success from it. The Cara Delevingne run recorded a final 8.6 alongside `fail_after_revision`.

When the grade is missing, `revision_needed` returns false immediately—even with lint/report failures. The revision prompt separately requires a grade sidecar and stops without it. Also, historical `REPORT_WARNINGS` stay set even after an issue was fixed, so resolved intermediate failures can trigger more work. [Stage result handling](/Users/djwayne/9takes/scripts/run-blog-pipeline.sh:185), [revision predicate](/Users/djwayne/9takes/scripts/run-blog-pipeline.sh:423), [final summary](/Users/djwayne/9takes/scripts/run-blog-pipeline.sh:729).

**Change:** report `run_status` separately from `editorial_status`, with current unresolved findings and an exit code that reflects operational failure. Continue independent diagnostics when useful; stop dependent LLM calls on exhausted quota or missing prerequisites. Retry a missing grade as an operational step, and allow evidence/lint repair to proceed from explicit findings without pretending a grade exists. Preserve historical failures as history, not current blockers.

### 11. Resume, timeout, and observability can be much simpler

`--resume` skips creation but repeats the entity-gap pass and everything from fresh eyes onward. It is not a stage checkpoint. There is no stage timeout. The August 29 Demis run recorded **37,676 seconds—10 hours 28 minutes—for the advisory entity-gap stage**. The log establishes duration, not why it took that long. [Stage timings](/Users/djwayne/9takes/docs/content-analysis/pipeline-logs/2026-08-29_021004_demis-hassabis/stage-summary.tsv:1).

The runner computes `REPO_ROOT` but never changes to it, while passing relative paths to tools and Claude. The nightly launcher likewise depends on its caller's working directory. Independent reviewer durations are recorded when the parent waits in sequence, so individual role timings can include time already spent waiting for another role.

**Change:** validate inputs and working directory before advisory research; add stage-specific time/tool budgets and cleanup of child processes; persist input/output hashes and stage outcomes; resume only invalidated stages. Cache the single-person intent packet and keep broad candidate discovery outside the article-writing path. Record model/configuration, prompt versions, real stage timestamps, and token/cost data when available.

### 12. Grading needs to measure the stated product

The rubric deliberately downweights the hook because of its weak correlation with traffic, while discovery has 1.5× weight and Enneagram integration 1×. Arrival volume is not the same outcome as engagement, insight, or durability. The current rubric is more explicit about news recency than five-year usefulness. [Rubric rationale](/Users/djwayne/9takes/docs/content-analysis/blog-grading-rubric.md:15).

The grader's strongest anti-inflation controls—rank ordering, spread, distribution checks—apply to batches. The runner grades one person at a time. Its calibration examples are mutable live drafts named alongside historical score bands. Mandatory regrading may measure repeatability, but agreement between the same instructions is not independent evidence that a claim or interpretation is correct.

**Change:** keep discovery/metadata readiness as a separate gate. Evaluate evidence integrity, explanatory value, distinctiveness, reader experience, and durability with concrete passage-level reasons. Use frozen, versioned anchor excerpts. Physically give graders a clean reader view rather than asking them to ignore embedded self-praise. Calculate scores in code and store every assessment against the reviewed content hash instead of replacing the sole grade sidecar. Use blind second grades for calibration samples or disputed decisions; preserve independent factual verification on every article.

## Smaller inconsistencies worth cleaning up together

| Area | Conflict or drift | Resolution |
| --- | --- | --- |
| Authority | Editorial skill calls itself the overriding source of truth; creator calls its inline bans canonical; cohesion copies a ban list | One editorial standard, with explicit people-profile exceptions; thin task-specific prompts |
| Ending | General standards use “Hook → Insight → Action step” and permit a CTA; people rules ban body CTAs | State the profile exception once and keep product interactions in the page template |
| Quotations | Creator says direct quotes are never altered; em-dash lint exempts attribution lines but not all quoted speech | Preserve quoted text exactly; distinguish quotation content from author prose in lint |
| Verification hash | Verify prompt says frontmatter is ignored; implementation includes titles, type, person, description, FAQs | Document the actual review surface consistently |
| Ledgers | Lint checks ledger-name presence, not accuracy; intermediate edits can leave them stale | Generate mechanical inventories from the final draft; keep judgment/evidence in sidecars |
| Publishing | Manual publish command requires a subsequent Chorus attachment; daily publisher invokes only the parser | Make release completeness consistent; prepare required engagement material before release |
| Prompt maintenance | Historical audit narratives and near-duplicate checklists are embedded throughout prompts | Move rationale/history to docs; keep runtime instructions short and current |

The parser already strips HTML comments before storing article content. The embedded-ledger concern here is stale state and grading contamination, not a claim that this publishing path exposes those comments to readers.

## Proposed ordinary-profile workflow

This design has six mandatory top-level model calls, with two more only if final verification identifies a repair. It is a proposal to pilot, not a claim of measured equal quality or proportional cost savings.

| Phase | Work and artifact | Model calls |
| --- | --- | ---: |
| 1. Research and challenge | Verified evidence record, chronology, uncertainty, strongest type/alternative, bounded intent notes | 1 |
| 2. Write | One reader-led draft plus initial metadata; use the evidence record and a short editorial standard | 1 |
| 3. Independently review | Evidence/type/fairness review; separate reader/editorial/durability review, both on the same clean snapshot | 2 |
| 4. Edit and package | One adjudicated worklist; substantive repairs, prose, final FAQs/citations, protected passages | 1 |
| 5. Verify and decide | Check accepted repairs, new claims, metadata agreement, preserved strengths; machine checks evaluate final artifacts | 1 |

Run cheap structural checks after drafting and after edits, before spending another full review call. If verification fails on a repairable issue, allow one targeted repair plus reverification. If evidence is inadequate, hold the profile with a concrete research task instead of polishing around the gap.

Retain the expanded six-role jury for high-risk allegations, sharply contested typing, difficult historical sources, major thesis changes, and periodic calibration. Make escalation criteria explicit. Do not eliminate that process until a pilot demonstrates that the smaller path retains its useful catches.

Use a small set of durable artifacts: evidence record, draft, review findings, and run manifest. Distinguish the neutral evidence from the writer's hypothesis. Keep optional author notes as a hypothesis/input whose supporting evidence still needs checking.

## A compact evidence contract

For each important passage, the working record should answer:

| Field | Purpose |
| --- | --- |
| Claim ID and draft location | What assertion are we assessing? |
| Class | Observed fact, self-report, third-party report, interpretation, disputed, unknown |
| Source and locator | URL/document, speaker, date, page or timestamp |
| Context | What was actually said/done, and under what circumstances? |
| Inference | What motivational reading does this support, and how strongly? |
| Alternative/counterevidence | What else could explain it? What weakens this reading? |
| Durability | Stable event, changing status, or unresolved matter; when does it need review? |

Require this coverage for the claims that carry the thesis. Do not turn every harmless transition into a research form. The public article should make the argument readable; the working record should make it auditable.

## Recommended implementation order

1. **Correct the reliability defects first:** similarity false positives, invented January 1 birthdays, ignored creator blockers, missing-grade handling, consistent final eligibility, working directory, and bounded advisory research. These do not require redesigning the writing voice.
2. **Reconcile editorial policy:** one uncertainty rule; source-gathering before type synthesis; optional childhood causation/interior monologue/advanced typology; accuracy checks instead of compulsory recency; clear quotation fidelity rules.
3. **Consolidate without removing independent scrutiny:** merge the early reader/revision/cohesion cycle; reuse the evidence record; generate mechanical ledgers; bound review and synthesis output; reconcile metadata after substantive edits.
4. **Pilot the smaller review path and grading changes:** use ordinary and difficult subjects, including a sparse-source person and a historical figure. Give both workflows equivalent source access and freeze the versions being compared.

Judge the pilot with blind editorial comparisons: what did the reader learn, what specific insight do they remember, does the type claim beat its alternative, what important claim remains unsupported, and what would need rewriting in five years? Also record time, token use, false-positive checks, repair count, and meaningful misses caught by each reviewer. Compare engagement after publication separately from demand and search acquisition; do not use the pipeline's own higher grade as proof that the redesign worked.

The first simplification should be fewer competing instructions and fewer repeated edits. The evidence, independent challenge, and distinctive passages are the parts to protect.
