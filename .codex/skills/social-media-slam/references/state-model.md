<!-- .codex/skills/social-media-slam/references/state-model.md -->

# Social Media Navigation State Model

Read this reference when creating a durable account snapshot, updating an existing social-media state, or comparing two checkpoints. Adapt the representation to the project's existing format; the fields are the contract, not a required file type.

## Evidence labels

Label consequential inputs with one of these states:

- `observed`: directly supported by analytics, account content, or a cited source;
- `owner-stated`: supplied by the account owner as intent, constraint, or context;
- `inferred`: a reasoned interpretation of observed or owner-stated inputs;
- `unknown`: important but not yet supported.

Time-sensitive observations need an `as_of` time or evidence window. Add `confidence: low | medium | high` when uncertainty could change a decision.

## Snapshot

Record enough identity and provenance to make later comparisons meaningful:

| Field                  | Purpose                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `snapshot_at`          | When this state estimate was made                                                                          |
| `platform` / `account` | Exact surface being assessed                                                                               |
| `region` / `language`  | Context that can change the terrain                                                                        |
| `evidence_window`      | Period represented by metrics and posts                                                                    |
| `sources`              | Analytics exports, account URLs, screenshots, interviews, or research links                                |
| `onboarding_baseline`  | Approved dossier or equivalent context, including its version or approval time                             |
| `decision_context`     | The question this snapshot is meant to support                                                             |
| `state_path`           | Existing durable location to update when one is authorized; omit when returning state only in the response |

Load identity, destination, strategic posture, committed decisions, constraints, hypotheses, and watchlist from the onboarding baseline. Reference the baseline rather than duplicating it wholesale, then record only observed changes, invalidated assumptions, and operating decisions in later snapshots.

## Current coordinates

Capture only dimensions relevant to the decision, choosing from:

- **Brand:** identity, promise, positioning, voice, topics, proof, offers, boundaries.
- **Audience:** intended audience, observed audience, follower or engager clusters, relationship quality.
- **Audience states:** activating situations, live tensions, current beliefs, intended shifts, trust requirements, and reasons people save, share, reply, participate, follow, return, or act.
- **Relationship graph:** followed accounts, public or authorized follower patterns, mutuals, peer clusters, and important connectors.
- **Scale and trajectory:** followers, reach, profile visits, direction, rate of change, volatility.
- **Content system:** cadence, consistency, topic mix, format mix, hooks, calls to action, series, reuse.
- **Return promise:** the stable expectation that gives people a reason to follow and whether subsequent artifacts fulfill it.
- **Performance:** goal-relevant outcomes by topic, format, audience, and funnel stage; repeatable wins and misses.
- **Pipeline:** ideas, drafts, scheduled posts, reusable assets, events, launches, blockers.
- **Conversion path:** profile promise, links, landing path, offer, attribution, and tracking gaps.
- **Capacity:** available time, skills, collaborators, budget, tooling, and sustainable production pace.
- **Active beliefs:** current strategy, assumptions, experiments, and known contradictions.
- **Compounding edges:** current audience intelligence, creative judgment, relationship access, operating memory, and retained trust or demand, including gaps worth building.

Prefer rates, direction, and comparisons over isolated totals. Do not blend metrics from different platforms or incompatible time windows without saying so.

## Terrain map

Bound the terrain before collecting it. State which audience, niche, platform, account-size band, region, or strategic analogy makes an actor relevant.

### Actors

For each material account or cluster, record:

- role: `peer | aspirational | adjacent | collaborator | curator | customer | substitute | source`;
- audience overlap or strategic relevance;
- distinctive topics, formats, positioning, and cadence;
- evidence links and observation time;
- what is transferable versus dependent on that account's scale, authority, access, or persona.

### Discourse and content patterns

Record:

- repeated audience questions, tensions, objections, desires, and vocabulary;
- common and emerging topics or narratives;
- common hooks, structures, templates, media formats, calls to action, and interaction patterns;
- saturation, sameness, gaps, contrarian openings, and credible whitespace;
- platform mechanics or cultural norms that change how the pattern works.

### Channel opportunity or dependency

Do not record a platform name as though it were a route. For a material opportunity or dependency, record:

| Field                          | Question                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `priority_audience_state`      | Which people in which activating situation are reachable?                                                                     |
| `surface`                      | Which exact feed, search behavior, reply graph, collaboration path, community, recommendation surface, or other access point? |
| `tactic_and_artifact`          | What interaction mechanism and audience-facing artifact use that surface?                                                     |
| `message_or_reframe`           | What should the audience recognize, understand, feel, or do differently?                                                      |
| `credibility_basis`            | Why should this account be believed here?                                                                                     |
| `sharing_or_participation_job` | What does passing, replying to, or using the artifact do for the audience member?                                             |
| `timing_condition`             | Which audience, discourse, competitive, or platform condition makes the opening usable now?                                   |
| `enabling_edges`               | Which knowledge, judgment, relationships, operating ability, or retained demand make the route plausible for this account?    |
| `dependency`                   | Which person, event, platform behavior, cost, or external condition could make the route brittle?                             |
| `decay_indicators`             | What early evidence would suggest saturation or deterioration, and at which layer?                                            |
| `confidence`                   | How strong and representative is the evidence?                                                                                |

Diagnose decay at the correct layer: `platform | surface | tactic | format | message | audience segment | relationship path | cost structure | conversion path`. Preserve durable audience needs, relationships, and assets when one layer weakens.

### Trend record

For a claimed trend, record:

| Field           | Question                                                           |
| --------------- | ------------------------------------------------------------------ |
| `pattern`       | What exactly is recurring?                                         |
| `evidence`      | Which independent observations support it?                         |
| `stage`         | Emerging, accelerating, saturated, durable, declining, or unknown? |
| `context`       | Which platform, audience, region, and account scale?               |
| `brand_fit`     | Why would participating strengthen rather than blur this brand?    |
| `usable_window` | How quickly would action need to happen?                           |
| `confidence`    | How strong and representative is the evidence?                     |

Do not collapse these categories:

- **Trend:** time-sensitive acceleration or change.
- **Pattern:** recurring behavior that may be durable.
- **Template:** a repeatable content form.
- **Topic:** subject matter, whether or not it is trending.
- **Outlier:** an isolated high-performing example.

## Destination

Keep the destination connected to a real outcome:

| Field                   | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `primary_outcome`       | The business, creative, or community result              |
| `social_contribution`   | How social activity is expected to help                  |
| `audience` / `platform` | Who and where the route is for                           |
| `baseline`              | Starting value or qualitative condition                  |
| `target_direction`      | Target value or explicit desired movement                |
| `horizon`               | Time window                                              |
| `leading_signals`       | Early evidence that the route is working                 |
| `outcome_signals`       | Evidence that the destination is actually closer         |
| `guardrails`            | Brand, ethical, budget, capacity, or channel constraints |
| `non_goals`             | Metrics or outcomes not being optimized                  |

If awareness, follower growth, clicks, leads, sales, authority, or community all matter, rank them. Do not pretend one next action can optimize all of them equally.

## Action hypothesis

Use this record for the primary next move:

- `action`: concrete behavior, deliverable, platform, owner, and scope;
- `why_now`: the account-state, terrain, and destination facts it connects;
- `audience_state`: activating situation, live tension, current belief, and intended shift when relevant;
- `resonance_mechanism`: recognition or reframe, credibility basis, consequence, and personal or social utility when relevant;
- `distribution_bet`: priority audience, exact surface, tactic or format, message, timing condition, sharing or participation job, and next step when relevant;
- `signal_stage`: the earliest stage expected to move: exposure, attention, recognition, trust, consequence, transmission, relationship, conversion, or destination outcome;
- `prediction`: expected observable change;
- `leading_signal`: earliest useful signal;
- `outcome_signal`: goal-level result;
- `effort`: time, cost, assets, dependencies;
- `risk`: likely downside, brand risk, and reversibility;
- `checkpoint`: date, event, or sample size for review;
- `contingency`: next diagnosis or action if the result differs;
- `confidence`: confidence plus the evidence or assumption driving it.

Rank alternatives qualitatively using:

`destination movement x evidence strength x learning value x brand fit`, discounted by `effort x downside x irreversibility`.

The expression is a decision aid, not a demand for fake numerical precision.

Every action should satisfy at least one purpose:

- move the account toward its stated destination; or
- reduce an uncertainty that could materially change the route.

For a learning action, name the decision it is expected to improve. Volume without destination movement or decision-relevant learning is not a valid experiment.

## Experiment and update log

Use one durable log per account or strategy scope when the project has an authorized storage convention. Append records and reference the applicable baseline and prior hypothesis. Do not overwrite misses, surprises, rejected explanations, or earlier confidence; they are operating memory. If no storage path is authorized, return the record in the response for the user to place.

Append rather than overwrite:

| Field                            | Purpose                                                                                                                                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicted`                      | What the prior state model expected                                                                                                                                                                               |
| `action_taken`                   | What actually happened, including deviations                                                                                                                                                                      |
| `observed_result`                | Results and measurement limitations                                                                                                                                                                               |
| `signal_chain`                   | Evidence by stage: qualified exposure, attention, recognition/reframe, trust, consequence, transmission, relationship/retention, conversion, and outcome; omit unavailable stages rather than inventing precision |
| `audience_quality`               | Which audience responded and whether it fits the destination and desired community                                                                                                                                |
| `interpretation`                 | Best causal explanation, credible alternatives, confidence, and what evidence distinguishes them                                                                                                                  |
| `enabling_conditions`            | Timing, source credibility, relationships, paid support, external events, offer, production choices, or other conditions required for the result                                                                  |
| `repeatability`                  | What appears portable or repeatable versus dependent on a person, event, or platform condition                                                                                                                    |
| `replication_or_correction_test` | Smallest test that could confirm the presumed mechanism or repair the earliest weak stage                                                                                                                         |
| `decay_watch`                    | Dependency, saturation, or deterioration signal worth monitoring                                                                                                                                                  |
| `state_update`                   | What changed about the account position                                                                                                                                                                           |
| `map_update`                     | What changed about the environment model                                                                                                                                                                          |
| `edge_update`                    | Audience knowledge, creative judgment, relationship access, operating memory, or retained demand gained or weakened                                                                                               |
| `route_update`                   | Continue, adapt, stop, or gather more evidence                                                                                                                                                                    |
| `next_checkpoint`                | When the next observation should occur                                                                                                                                                                            |

Preserve surprises, negative results, and rejected hypotheses. They prevent the skill from repeatedly recommending the same attractive but disproven move.

## Exploration queue

When a working route has meaningful concentration or decay risk, maintain a small queue of plausible adjacent tests:

| Field              | Purpose                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- |
| `candidate_route`  | Audience state, surface, mechanism, and next step to test                           |
| `why_plausible`    | Terrain evidence, analogy, relationship access, or unresolved belief                |
| `learning_value`   | Which decision-relevant uncertainty the test can reduce                             |
| `edge_value`       | Which compounding capability or portable asset remains even without immediate reach |
| `budget_or_limit`  | Capacity boundary that protects the working route                                   |
| `promotion_signal` | Evidence that would justify making the route primary or expanding the test          |

Do not require exploration when capacity is too constrained, dependency risk is low, or it would undermine the primary route.

## Watchlist

Track only signals that could change a decision:

| Field                | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| `signal`             | Account metric, actor, topic, template, platform change, or assumption to watch |
| `why_it_matters`     | Which destination or route decision it can affect                               |
| `source`             | Where the next observation should come from                                     |
| `cadence_or_trigger` | When to check, based on signal speed and consequence                            |
| `decision_threshold` | What change would justify continuing, adapting, or stopping                     |

Do not turn the watchlist into indiscriminate trend collection. Every recurring scan should have a decision it can inform.

## Minimal checkpoint diff

For a pulse check, report only:

1. What changed in the account.
2. What changed in the terrain.
3. Whether the destination changed.
4. Which prior belief was strengthened or weakened.
5. Which signal-chain stage or channel layer changed.
6. What was learned about a compounding edge or dependency.
7. Whether to continue, adapt, stop, replicate, or run a learning experiment.
