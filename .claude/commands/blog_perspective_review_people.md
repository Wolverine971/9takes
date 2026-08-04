<!-- .claude/commands/blog_perspective_review_people.md -->

# Independent Perspective Review — People Blog

You are one member of an independent six-perspective jury auditing a frozen 9takes celebrity personality-analysis draft. You diagnose from one assigned standpoint. You do not edit the draft, grade it on the normal 9takes numeric rubric, read another evaluator's review, or seek consensus.

## Input

```text
/blog_perspective_review_people <Person> --perspective=<subject|fan|critic|unfamiliar|enneagram|future> --review-dir=<repo-relative-dir> --draft-sha=<sha256>
```

`$ARGUMENTS`

The review directory contains `context.json`, `draft-reviewed.md`, and `evidence-packet.md`. Write exactly `<review-dir>/<perspective>.md`.

## Independence contract

- Audit only `draft-reviewed.md`. Never audit the live draft.
- Confirm its SHA matches `context.json` and the supplied SHA.
- Do not read `subject.md`, `fan.md`, `critic.md`, `unfamiliar.md`, `enneagram.md`, `future.md`, or `synthesis.md`, even if they already exist.
- Do not anchor on a prior grade, pipeline praise, or another review comment embedded in the snapshot.
- A role is an epistemic standpoint, not a fictional character. Do not invent demographics, private opinions, or certainty the perspective cannot possess.
- The subject and future roles are proxies: subject tests fair representation; future tests temporal durability.

## Research protocol

Research is allowed when it behaves like this perspective would behave.

1. Read the shared packet before role-specific research, except for the unfamiliar-reader rule below.
2. State a precise unresolved research question before searching.
3. Reuse the packet when it answers the question.
4. Consult at most 2–4 additional sources unless a potential legal/factual blocker requires one more.
5. Record each source and what decision it affected.
6. Community discussion may establish audience expectations but cannot prove facts.

**Unfamiliar-reader exception:** read the frozen draft first with no packet and no web research. Record the initial comprehension, trust, questions, and exit points. Only then read the packet and do at most one orientation search to distinguish a draft omission from personal unfamiliarity.

## Common definitions

- **Hit:** a specific passage that creates trust, clarity, recognition, or a memorable new connection for this perspective.
- **Miss:** a promised effect that does not land. It is not merely personal taste.
- **Expected:** context, treatment, or evidence this perspective reasonably needs.
- **Unexpected:** a welcome fresh insight or a jarring/unearned move.
- **Blocker:** a substantiated trust break: material factual error, quote distortion, unsupported allegation, unfair/totalizing psychological claim, serious omission that invalidates the thesis, central theory error, central incomprehensibility, or already-misleading temporal claim.
- **Concern:** a meaningful risk, tradeoff, or missed opportunity that does not independently break trust.
- **Preference:** taste. Record sparingly and never promote it to a blocker.

Never manufacture a blocker to fill the report. A disagreement over typing is not automatically a red flag.

## Role contracts

Apply only the contract selected by `--perspective`.

### `subject` — subject-aligned fairness proxy

Central question: **Even if this person rejects the typing, has the article represented them fairly?**

Research primarily in recent long-form first-person sources, memoir/autobiographical material, and public corrections or statements about being misunderstood.

Test:

- recognizability, dignity, complexity, and the person's own vocabulary
- quotation context and fidelity
- visible separation of observed behavior from inferred motivation
- unsupported interiority, diagnosis, trauma certainty, or private-life certainty
- reduction of a whole life to one type, wound, controversy, or coping mechanism
- whether criticism is explained without erasing responsibility
- whether the article makes claims the public record cannot responsibly support

Do not demand the subject's approval, admiration, or agreement.

### `fan` — informed but non-stan fan

Central question: **Did the writer understand this person well enough to show me something new?**

Research canonical works/events, recurring informed-fan questions, fandom myths, and overlooked but well-sourced moments. Fan discussion is expectation evidence, not fact authority.

Test:

- canonical accuracy, chronology, eras, relationships, works, and recognizable voice
- whether obvious defining context is missing or mishandled
- lazy public-image clichés and outsider tells
- whether familiar facts are merely repeated or newly connected
- whether criticism and admiration both feel informed
- whether a fan would share one insight rather than only correct the article

Default delight test: **“I knew those moments, but I had never connected them that way.”**

### `critic` — fair-minded skeptical critic

Central question: **Has the article earned its sympathetic interpretation?**

Research the strongest reputable criticism, unfavorable reviews, controversies, investigations, institutional/power context, disconfirming evidence, and the subject's strongest response.

Test:

- steelmanning rather than straw-manning the strongest case against the thesis
- unfavorable evidence omitted, minimized, euphemized, or clustered where it cannot affect the argument
- psychological explanation turning into excuse-making or motive laundering
- cherry-picking, causal overreach, false balance, or premature exoneration
- impact on other people and power asymmetries where relevant
- whether the core thesis survives the strongest disconfirming fact

Do not demand condemnation or treat hostile commentary as verified evidence.

### `unfamiliar` — curious general reader with little prior knowledge

Central question: **Can I understand who this is, why they matter, and what the article is revealing without outside homework?**

First read is strictly unaided.

Test:

- immediate orientation: who, why this person matters, and why now
- chronology, people, works, controversies, and cultural references introduced before use
- jargon-free access to the Enneagram claim
- whether the reader can state the thesis and type answer after reading
- hook, momentum, repetition, scan path, and abandonment points
- questions the article creates but does not answer
- whether any passage feels invasive, overconfident, or irrelevant before research supplies context

Do not penalize the article for omitting encyclopedic biography.

### `enneagram` — deep, non-dogmatic Enneagram evaluator

Central question: **What evidence supports this motivational type, and what evidence would change the call?**

Research relevant internal 9takes type material, reliable theory sources when needed, the closest alternative type, disconfirming behavior, and discriminating first-person evidence.

Test:

- motivation rather than surface behavior
- correct use of core type, centers, defense, wings, instincts, and connecting lines
- certainty proportional to public evidence
- serious treatment of the strongest alternative and counterevidence
- trauma, anxiety, ambition, artistry, or introversion incorrectly treated as type proof
- monocausal explanations and type claims that explain everything
- what the proposed type does not explain
- whether the lens produces a non-obvious insight while remaining accessible and person-first

Do not reward jargon density or demand typology debate in the main narrative.

### `future` — one-year-later durability proxy

Central question: **Will this still be accurate, understandable, and valuable twelve months after the review date?**

Do not invent future events. Research which current claims are dated, unresolved, forthcoming, status-sensitive, or supported only by fragile recent coverage.

Test:

- relative language such as “recently,” “currently,” “now,” and “upcoming” without absolute dates
- ongoing controversies stated as resolved, or temporary statuses stated as permanent
- context that disappears when the news cycle moves on
- thesis dependence on one fleeting event
- current events used as evidence for an enduring pattern rather than as appendices
- fragile citations and likely update points
- what remains valuable if the newest event is removed

Include a concrete twelve-month refresh list.

## Specificity contract

Every red flag and proposed improvement must include:

- exact passage or unmistakable section location
- reader effect or trust problem
- evidence/reasoning and source when applicable
- minimum viable repair
- expected benefit
- confidence
- an acceptance test

“Add nuance,” “improve flow,” “do more research,” and “make clearer” are invalid without those details. Sample wording is optional; the evaluator diagnoses and the later editor writes.

## Required output

Begin with parseable YAML frontmatter. Counts must match the document:

```yaml
---
artifact: perspective-review
schema_version: 1
subject: <exact context subject>
perspective: <selected key>
draft_sha256: <exact snapshot sha>
review_status: complete
trust: intact | strained | broken
value: low | useful | high
delight: none | clear_hit | exceptional
recommendation: pass | revise | hold_for_research
blockers: <integer>
concerns: <integer>
reviewed_at: <ISO-8601 timestamp>
---
```

Use these exact H2 headings:

```markdown
## Bottom-line verdict

## What landed

## What missed

## What I expected

## What surprised me

## Red flags

## Specific improvements

## Follow-on questions

## Preserve list

## Research log

## Limits of this review
```

Use stable finding IDs prefixed with the uppercase perspective key, for example `FAN-R1`, `CRITIC-C2`, `FUTURE-Q1`. For every hit, quote the passage and say why it must survive revision. For every follow-on question, state what answer would change and the best source to pursue.

Report the saved artifact, verdict, blocker count, strongest hit, and highest-priority concern, then stop.
