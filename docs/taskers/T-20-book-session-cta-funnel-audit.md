<!-- docs/taskers/T-20-book-session-cta-funnel-audit.md -->

# Tasker: Audit the Book Session CTA and Founder-Led Offer Flow

**For:** Product, growth, research, and conversion-design agent
**Owner:** DJ
**Created:** 2026-08-13
**Status:** Ready for audit. No external launch or implementation authorized.
**Related:** `docs/taskers/T-17-9takes-audience-to-revenue-research.md`, `docs/monetization/2026-05-02_decode-a-person-offering.md`, `docs/monetization/2026-05-04_decode-session-pilot-plan.md`, `src/routes/book-session/`, `src/lib/components/blog/callouts/BookSessionCTA.svelte`, `docs/growth/growth-log.md`

## 0. What and why

9takes needs context-matched calls to action, not more buttons. A good CTA bridges the value a reader just experienced to one natural next action. The current book-session destination is described in repository evidence as a future coaching waitlist, while the stronger direction is a founder-led offer centered on one person, conflict, conversation, or recurring pattern the reader cannot make sense of.

Audit the complete flow before changing site-wide CTA placement:

`qualified page -> CTA impression -> click -> offer comprehension -> trust -> scheduling -> payment -> intake -> session -> take-home artifact -> follow-up`

The output must decide what is ready, what is missing, which pages have matching intent, and what smallest implementation could test demand without implying therapy, diagnosis, certainty about a third party, or a broader coaching organization than currently exists.

This is a focused current-flow audit. Do not repeat the full market research already assigned in T-17 unless current evidence is missing.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/taskers/T-17-9takes-audience-to-revenue-research.md`
4. `docs/monetization/2026-05-02_decode-a-person-offering.md`
5. `docs/monetization/2026-05-04_decode-session-pilot-plan.md`
6. Newest entries in `docs/growth/growth-log.md`
7. Freshest GSC pages and page-query exports
8. `src/routes/book-session/+page.svelte`
9. `src/routes/book-session/+page.server.ts`
10. `src/lib/components/blog/callouts/BookSessionCTA.svelte`
11. Current analytics endpoints and event definitions used by session CTAs, waitlist forms, scheduling, checkout, and attribution
12. The production `/book-session` page and at least five live source pages representing different visitor intents

Run `git status --short` and inspect relevant diffs first. The existing CTA component may contain staged or parallel work. Do not overwrite it.

Load the required Svelte skills before analyzing Svelte files. Use the `hyperplexed-audit` skill for the live CTA, offer-page hierarchy, and mobile flow. Use current primary sources for any external booking, payment, or platform-policy claim.

## 2. Questions the audit must answer

### Offer

- Who is the first buyer?
- What has just happened in their life that makes the offer timely?
- What single outcome can DJ credibly promise?
- Is the first product a live session, an asynchronous dossier, or a session plus a take-home map?
- What does DJ personally do before, during, and after it?
- What capacity, price range, turnaround, cancellation policy, and beta limit are credible?
- What is explicitly outside scope?

### Trust

- Does the destination clearly show that the buyer works with DJ?
- Which reasoning-card examples, sample deliverable, founder video, qualifications, boundaries, or testimonials are needed?
- Does current copy imply a team, platform, or readiness level that does not exist?
- Does the page show enough evidence to justify payment?

### CTA fit

- Which page intents naturally lead to a personal situation or paid founder session?
- Which page intents should lead to a situation prompt, type discovery, educational material, or no conversion ask instead?
- At which earned moment should the action appear?
- What competing CTA should be removed or demoted at that moment?

### Operations

- Can a person currently schedule, pay, submit context, receive confirmation, reschedule, cancel, and receive a take-home artifact?
- Which steps exist but are not connected?
- Which steps are unmeasurable?
- What is the smallest safe manual path for five beta slots?

## 3. Required page-intent matrix

Evaluate at least these source groups:

| Source intent                       | Candidate next action to test                                              | Important guardrail                                        |
| ----------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Personality analysis                | Give your take, run a personal situation, or explore the founder-led offer | Do not assume celebrity curiosity equals buying intent     |
| Relationship or conflict guide      | Bring one real person, conversation, or recurring pattern                  | Avoid manipulation promises                                |
| Workplace or difficult-person guide | Map motives and communication possibilities                                | Do not claim certainty about another person's type         |
| Mental-health content               | Safe educational continuation or professional support resources            | Do not funnel diagnostic concern into personality decoding |
| Founder-led Reel landing            | Answer the exact situation from the Reel                                   | Keep one consistent action for the pilot                   |
| Post-contribution reveal            | Save identity, add type context, or deepen the situation                   | Do not interrupt the initial contribution                  |

For each group, produce:

- visitor job;
- earned moment;
- primary CTA copy;
- destination;
- competing actions to demote;
- impression, click, completion, and downstream success events; and
- ethical or expectation-setting guardrails.

## 4. Work steps

### Step 1: Map the live flow

Walk the current production experience on desktop and mobile. Record every promise, action, form field, redirect, confirmation, missing state, and point where vocabulary changes.

### Step 2: Reconcile code, data, and documents

Determine which parts of the older pilot are implemented, staged, obsolete, or still hypothetical. Code and live behavior outrank planning documents. Do not infer CTA exposure or conversion without impression data.

### Step 3: Define the smallest credible founder-led beta

Recommend one primary beta offer. Specify:

- exact buyer and trigger moment;
- one-sentence promise;
- session and take-home format;
- beta capacity;
- proposed price range;
- preparation and intake;
- boundaries and disclaimer;
- proof required before launch;
- payment, scheduling, cancellation, and follow-up requirements; and
- pass, revise, and stop thresholds.

Do not set live pricing or open slots.

### Step 4: Create the CTA system

Draft a small CTA matrix based on page intent. The goal is one primary next step per earned moment, not one universal CTA pasted everywhere.

Include exact draft copy for:

1. a personality-analysis situation prompt;
2. a personal-situation deepening prompt;
3. the founder-led paid offer;
4. post-contribution identity or type capture; and
5. a safe non-commercial continuation on mental-health pages.

### Step 5: Specify measurement

Map:

`CTA seen -> CTA clicked -> offer viewed -> form started -> inquiry submitted -> scheduled -> paid -> attended -> artifact delivered -> follow-up outcome`

For each step, identify the event or table, denominator, deduplication unit, attribution window, and missing instrumentation.

### Step 6: Produce a bounded implementation recommendation

Recommend the smallest pilot surface and a separate implementation tasker. Do not implement in this audit.

## 5. Deliverable

Create `docs/research/2026-08-13_book-session-cta-funnel-audit.md` containing:

1. executive decision in 250 words or fewer;
2. current-flow map;
3. observed, inferred, unknown, and contradicted evidence table;
4. source-page intent matrix;
5. recommended founder-led beta offer;
6. CTA copy and placement matrix;
7. trust and proof requirements;
8. operational gap list;
9. measurement plan;
10. smallest 30-day pilot with time ceiling; and
11. exact next three actions requiring DJ approval.

## 6. Verification checklist

- [ ] Current code, diffs, live pages, and current data were inspected.
- [ ] T-17 was used without duplicating its entire research scope.
- [ ] Every current numeric claim includes a date window and denominator.
- [ ] The offer is explicitly founder-led and does not imply unavailable staff or infrastructure.
- [ ] The flow supports scheduling, payment, intake, delivery, and cancellation, or marks each missing step.
- [ ] CTA recommendations vary by visitor intent.
- [ ] Mental-health pages are protected from diagnostic or exploitative conversion language.
- [ ] Third-party typing is framed as plausible interpretation, not fact.
- [ ] No pricing, availability, payment, page copy, source code, outreach, or production state was changed.
- [ ] `rg -n $'\u2014' docs/taskers/T-20-book-session-cta-funnel-audit.md docs/research/2026-08-13_book-session-cta-funnel-audit.md` returns no matches.

## 7. Risks and gotchas

- A prettier CTA cannot rescue an unclear or unavailable offer.
- End-of-article placement is not automatically an earned moment when most readers never reach it.
- Page traffic is not equivalent to buyer intent.
- Existing staged CTA work belongs to DJ or another active workflow.
- The strongest offer may require proof from the reasoning-card pilot before strangers will pay.
- Cash urgency does not justify overstating credentials, outcomes, certainty, or scarcity.

## 8. Definition of done

The task is done when DJ has a decision-ready audit of the current session flow, one credible founder-led beta offer, an intent-matched CTA matrix, a complete operational and measurement gap map, and a separately scoped smallest implementation pilot with no external or production changes made.
