<!-- docs/taskers/T-21-situations-and-interpretations-product-research.md -->

# Tasker: Define the Situations and Interpretations Product Moat

**For:** Product research, information architecture, UX, and data-model agent
**Owner:** DJ
**Created:** 2026-08-13
**Status:** Ready for exploration. No terminology migration or implementation authorized.
**Related:** `docs/taskers/T-12-strategic-question-cta.md`, `docs/taskers/T-17-9takes-audience-to-revenue-research.md`, `docs/taskers/T-22-reddit-situation-discovery-flow.md`, `docs/growth/growth-log.md`, `src/routes/questions/`, `src/lib/components/questions/`, `src/lib/server/nineTakes.ts`

## 0. What and why

The central 9takes product idea is simple:

> Show how different people interpret the same event.

The current site contains questions, comments, generated perspectives, user takes, categories, tags, and a give-first reveal. The user-facing mental model is less clear. The internal label `Chorus` does not resonate with DJ and should be treated as legacy terminology, not as the assumed future product name.

Explore and define a product centered on three plain-language objects:

1. **Situation:** what happened, including relevant context and relationships;
2. **Take:** what one person thinks, feels, assumes, or would do; and
3. **Interpretation:** the emotional logic or meaning assigned to the same event.

The potential moat is not nine generic AI responses. It is a growing, responsibly labeled corpus of real situations, real human takes, personality context, competing interpretations, and signals about which interpretations helped people understand or act differently.

This task must explore the product shape, terminology, navigation, search, data model, AI and human roles, and smallest testable version. It must not rename production code, migrate data, redesign the entire question system, or implement a speculative platform.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/taskers/T-12-strategic-question-cta.md`
4. `docs/taskers/T-17-9takes-audience-to-revenue-research.md`
5. Newest entries in `docs/growth/growth-log.md`
6. `docs/planning/2026-annual-strategy.md`
7. Current question, comment, category, tag, generated-perspective, and user-take routes, components, schemas, and server modules
8. Current analytics events for question views, gate exposure, contributions, generated reveals, identity capture, type capture, and return
9. A representative sample of live questions, category pages, personality-page prompts, and strategic-question pilots
10. `docs/taskers/T-22-reddit-situation-discovery-flow.md` and its output when available

Run `git status --short` before inspection. Load required Svelte skills before analyzing Svelte files. Use current production behavior and schemas rather than relying on old planning names.

## 2. Terminology contract

Do not use the legacy musical label as the default user-facing concept. Mention it only when identifying existing code, copy, events, tables, or documents that currently use the term.

Test plain alternatives through user comprehension, including:

- situation;
- takes;
- interpretations;
- perspectives;
- reads;
- how people saw it;
- what others thought was happening; and
- the same event, seen differently.

Do not choose a clever brand name before the object model and user job are clear.

The task must recommend:

1. canonical user-facing nouns;
2. canonical verbs and CTA language;
3. terms to retire;
4. internal identifiers that may remain temporarily to avoid risky migrations; and
5. a staged copy and code migration plan if renaming is later approved.

## 3. Questions the research must answer

### User job

- What situation brings someone to this product?
- Are they trying to be heard, compare reactions, understand themselves, understand another person, resolve a conflict, predict a reaction, or decide what to do?
- Which job should be primary in the first version?
- Which acquisition surfaces naturally lead into it?

### Core loop

- What minimum context makes a situation interpretable without turning submission into a long intake form?
- What must a person contribute before seeing others?
- What payoff appears immediately after contributing?
- When and how should type or identity be requested?
- How do real human takes and AI-generated interpretations coexist without confusing readers?
- What reason exists to return?

### Information architecture

- Should people primarily browse situations, topics, relationship contexts, emotional tensions, types, or interpretations?
- What belongs in a category versus a tag, facet, or generated theme?
- Can a person search in natural language for a situation similar to theirs?
- How should highly similar situations cluster without erasing important context?
- How should private or sensitive situations differ from public prompts?

### Data moat

- Which structured fields make each new contribution improve the product?
- Which fields are consensual, ethical, and reliable enough to store?
- How should self-identified type, inferred type, unknown type, and AI simulation be separated?
- Which outcome or helpfulness signals matter?
- What can be learned without pretending the dataset is representative of all people of a type?

## 4. Product models to compare

Evaluate at least these models. Recommend one primary model, one useful secondary mode if justified, and explicit non-goals.

### Model A: Situation library

People browse or search concrete situations such as being left on read, receiving criticism from a boss, or hearing a partner ask for space. They give a take, then compare interpretations.

### Model B: Personal situation interpreter

A person submits a real situation and receives multiple plausible emotional readings, then optionally invites human responses or deepens it with DJ.

### Model C: Perspective mirror

The product compares the user's initial take with other interpretations and helps identify assumptions, blind spots, or likely default lenses.

### Model D: Two-sided relationship comparison

Two participants separately describe the same event and see where their interpretations diverged. Treat privacy, consent, abuse risk, and misuse as first-order concerns.

### Model E: Public-figure or article prompt

A page asks what is driving a public figure or what a public event means. This can teach the mechanic and acquire contributions, but may not be the north-star product.

### Model F: Human take collection with AI bootstrap

AI provides clearly labeled simulated perspectives when human coverage is sparse. Human takes remain distinct and can gradually become the more valuable layer.

## 5. Search and discovery exploration

Design and compare at least three ways to find relevant material:

1. **Natural-language situation search:** `My boss praised me in public and criticized me privately.`
2. **Faceted browsing:** relationship, setting, event, emotion, ambiguity, conflict, decision, and response type.
3. **Interpretation-led exploration:** rejection, control, shame, abandonment, duty, competence, autonomy, belonging, or another emotional logic.

Explore whether the current question categories should become:

- broad life contexts;
- situation archetypes;
- relationship roles;
- emotional tensions;
- searchable tags;
- or a hybrid hierarchy.

Use real query and contribution language where available. Do not design the taxonomy from Enneagram theory alone.

Produce low-fidelity wireframes or flow diagrams for:

- search or browse;
- situation detail before contribution;
- give-first input;
- reveal of human takes and AI interpretations;
- personal comparison;
- identity and type capture;
- related-situation navigation; and
- return notification.

## 6. Current-system mapping

Map the proposed product concepts to current implementation without assuming a one-to-one match:

| Product concept     | Current candidates to inspect                                          |
| ------------------- | ---------------------------------------------------------------------- |
| Situation           | `questions`, subject slugs, prompt text, source page context           |
| Take                | `comments`, `nine_user_takes`, user-authored response fields           |
| Interpretation      | generated perspectives, type-grouped answers, editorial synthesis      |
| Context             | categories, tags, relationship roles, source path, structured metadata |
| Identity            | profile, anonymous fingerprint, signup email                           |
| Personality context | known type, self-selected type, unknown type, inferred guess           |
| Return loop         | replies, notifications, email, saved situations, related content       |

For each mapping, document:

- current schema and semantics;
- mismatches or overloaded fields;
- data-quality risks;
- whether a migration is necessary;
- smallest additive change; and
- what should remain untouched in the first experiment.

## 7. AI and human labeling rules

The product must never blur simulated and human material.

Define display and storage rules for:

- human-authored take from a known self-identified type;
- human-authored take from an unknown type;
- type guess accepted or rejected by the user;
- AI-generated interpretation using a personality lens;
- DJ-authored interpretation;
- community synthesis; and
- later corrections or removals.

Avoid claims such as `Type 5s think this` when the evidence is a small, self-selected sample. Prefer language such as `Here are several Type 5-associated readings` or `Three self-identified Type 5 contributors focused on...` when accurate.

## 8. Smallest experiment

Recommend one narrow 30-day product experiment. The default candidate is:

1. Select one high-attention personality page or founder-led Reel situation.
2. Ask one concrete interpretation question at an earned moment.
3. Require a short take before reveal.
4. Show clearly labeled human takes and simulated interpretations separately.
5. Offer lightweight type context at the reveal.
6. Ask for email only after value is delivered and only for a clear return reason.
7. Link to a small set of genuinely similar situations.

Define:

- audience;
- hypothesis;
- implementation boundary;
- instrumentation;
- success, revise, and stop thresholds;
- privacy and safety guardrails;
- time ceiling; and
- decision at day 30.

Do not implement the experiment in this task.

## 9. Deliverable

Create `docs/research/2026-08-13_situations-and-interpretations-product.md` containing:

1. executive product thesis in 250 words or fewer;
2. canonical object and terminology recommendation;
3. user jobs and ranked product models;
4. core-loop diagram;
5. search and information-architecture options;
6. current-system and schema mapping;
7. proposed structured situation and take fields;
8. AI and human labeling rules;
9. data-moat analysis, including what is not defensible;
10. safety, privacy, consent, and representativeness risks;
11. smallest 30-day experiment; and
12. exact decisions that require DJ's judgment.

## 10. Verification checklist

- [ ] Current schemas, routes, live flows, analytics, and recent data were inspected.
- [ ] The product is described with plain situation, take, and interpretation language.
- [ ] Existing legacy identifiers are distinguished from recommended user-facing copy.
- [ ] At least five product models were compared and ranked.
- [ ] Search and browse designs use real situation language rather than only Enneagram categories.
- [ ] Human, DJ-authored, and AI-generated material have distinct storage and display rules.
- [ ] The moat is defined as structured real-world contribution data and trust, not generic AI output.
- [ ] Type inferences and sample limitations are handled honestly.
- [ ] The smallest experiment is bounded and measurable.
- [ ] No copy migration, schema migration, code edit, outreach, production change, or data write occurred.
- [ ] `rg -n $'\u2014' docs/taskers/T-21-situations-and-interpretations-product-research.md docs/research/2026-08-13_situations-and-interpretations-product.md` returns no matches.

## 11. Risks and gotchas

- Renaming the mechanic without improving the payoff does not create a product.
- Nine generic AI answers are easy to reproduce and may reinforce stereotypes.
- Requiring a contribution before revealing value creates friction that must earn its keep.
- Type context is currently sparse and often unknown.
- Relationship situations can contain abuse, coercion, mental-health crises, or sensitive personal data.
- Search similarity can flatten context and offer dangerously generic advice.
- Existing database names may remain temporarily even after user-facing terminology changes.
- Do not create a large taxonomy before observing real situation language.

## 12. Definition of done

The task is done when DJ has a decision-ready product definition for situations, takes, and interpretations; a recommended search and discovery model; clear human and AI labeling; a defensible data-moat thesis; a mapping to current systems; and one bounded experiment ready to become a separate implementation tasker.
