<!-- docs/taskers/T-17-9takes-audience-to-revenue-research.md -->

# Tasker: Turn 9takes attention into reachable users and revenue

**For:** Research and growth agent
**Owner:** DJ
**Created:** 2026-08-02
**Status:** Ready for research
**Related:** `docs/growth/growth-log.md`, `docs/monetization/2026-05-02_decode-a-person-offering.md`, `docs/monetization/2026-05-04_decode-session-pilot-plan.md`, `docs/data/gsc/latest.json`

## 0. What and why

DJ needs approximately $4,000 in monthly cash soon. He currently has no reliable recurring income, is close to taking on debt, is interviewing for full-time roles, and is pursuing client work through Tacemus. A full-time role is the most credible primary path to stability. Tacemus is the most plausible short-term bridge. 9takes is strategically interesting, but it is not allowed to become an open-ended research, content, or product-building project while cash is urgent.

This task must determine the smallest credible 9takes plan that can either:

1. generate near-term revenue through a paid, non-clinical personal decoding session;
2. convert existing organic attention into reachable and returning people;
3. establish whether short-form founder-led content, especially TikTok, can attract the audience DJ actually wants; or
4. produce clear evidence that 9takes should remain a low-time side bet while DJ prioritizes employment and client revenue.

The output is a decision-ready research memo and a bounded 30-day experiment plan. This is not an authorization to rebuild the product, publish a large content batch, launch paid services, contact people, or spend money.

### The product and worldview as they exist now

9takes is an Enneagram-informed platform built around the idea that one situation can produce nine different emotional reads. Its strongest product expression is the Chorus or mirror moment: a person contributes their own take, then sees how people with different Enneagram patterns interpreted the same situation. The site also contains:

- a large SEO surface of personality analyses and Enneagram articles;
- anonymous, give-first question and comment mechanics;
- a small email and profile system;
- a coaching or decoding-session waitlist;
- a founder with a distinct point of view, but limited public trust and relationship with the current audience.

Do not assume that the worldview needs to be fully expanded before 9takes can grow. Treat "the worldview is not fleshed out enough" as a hypothesis to test. The current promise may already be sufficient if it is expressed clearly and attached to a useful action.

### What is known as of the latest recorded audit

Keep observed facts, inferences, and hypotheses separate. Revalidate every metric before using it as a current baseline.

Observed in the 2026-07-27 growth audit:

- The completed week of 2026-07-20 brought 3,868 new visitors.
- It produced a record 14 comments from 10 distinct people.
- The masking prompt on question 567 converted 7 of 45 gated fingerprints, about 15.6 percent.
- Its homepage placement converted 6 of 32 gated fingerprints, about 18.8 percent.
- Nine of the ten contributing people were anonymous fingerprints. No email was captured from them.
- The only person who returned on a later day was a registered profile.
- Personality-analysis pages held about 64 percent of traffic and produced one buried Chorus contribution.
- Signups were at zero for four straight weeks and the coaching waitlist had received zero additions for nine weeks.
- A dormant-user reactivation sequence finally launched, but the early read was 51 sends, 12 opens, 0 clicks, and 1 unsubscribe.

Observed in the current repository:

- A decode-session offer and pilot plan already exist in `docs/monetization/`.
- `/book-session` is still framed as a 1-on-1 coaching waitlist, not a confirmed paid booking and payment flow.
- `src/lib/components/blog/callouts/BookSessionCTA.svelte` exists. It currently uses booking language while linking to a waitlist destination.
- Work on `BookSessionCTA.svelte` is already staged in DJ's worktree. Treat that file and every unrelated dirty file as parallel work. Inspect before recommending anything and never overwrite it.
- The freshest Search Console export is `docs/data/gsc/latest.json`, run 2026-08-01 for the 2026-05-01 through 2026-07-30 window.

### Current hypotheses, not settled conclusions

1. A paid 1-on-1 "decode a person or pattern" session is the fastest plausible 9takes revenue offer because it can be sold before building a subscription product.
2. Existing personality-analysis traffic can be converted if the Chorus, a relevant question, or a session offer appears before the attention cliff and matches the visitor's intent.
3. Post-contribution identity capture is the highest-leverage retention move because the contribution mechanic now creates engaged anonymous people who immediately disappear.
4. Founder-led TikTok content may build trust and attract people interested in understanding themselves, relationships, and conflicting interpretations.
5. More worldview development may help positioning and content, but it should not be used as a prerequisite for testing a concrete offer.

### Unknowns this research must resolve

- What are visitors actually hiring the personality-analysis pages to do: entertainment, self-identification, relationship decoding, conflict interpretation, celebrity curiosity, or something else?
- Which landing-page clusters, queries, sources, and page behaviors correlate with contribution, email capture, return visits, or session intent?
- How many visitors actually see and click the Chorus and session CTAs? Do not infer conversion from page totals without impression and click events.
- Does a working paid checkout and scheduling path exist? If not, what is the minimum safe path?
- What exact problem would a buyer pay DJ to help decode?
- Which positioning is clearest and safest: relationship pattern decoding, difficult-person decoding, Enneagram typing, communication coaching, or another narrow job?
- What session length, price, deliverable, boundary language, and proof would make the offer credible without implying therapy, diagnosis, or guaranteed outcomes?
- Is lack of founder trust the main sales barrier? What evidence, sample analysis, testimonial, or public body of work would reduce it?
- Can TikTok generate qualified site actions and bookings, not just views? Which repeatable formats fit 9takes' worldview and DJ's voice?
- What happens immediately after an anonymous contribution? What identity-capture rate and return rate are technically measurable today?
- What evidence would justify expanding the worldview, and what content would merely be productive-looking delay?

## 1. Required reading

Read these completely before researching or recommending work:

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/growth/growth-log.md`, starting with the newest entries
4. `docs/monetization/2026-05-02_decode-a-person-offering.md`
5. `docs/monetization/2026-05-04_decode-session-pilot-plan.md`
6. `docs/data/gsc/latest.json` and the three CSV files it names
7. `src/routes/book-session/+page.svelte`
8. `src/routes/book-session/+page.server.ts`
9. `src/lib/components/blog/callouts/BookSessionCTA.svelte`
10. `src/routes/personality-analysis/[slug]/+page.svelte`
11. The code and analytics definitions for `give_first_funnel_events`, `nine_user_takes`, `coaching_waitlist`, `signups`, `comments`, page visits, and page sessions

Before any recommendation, run `git status --short` and inspect relevant diffs. Never assume an existing idea is unimplemented just because an older document says so.

## 2. Refresh the evidence and map the live funnel

Create a dated baseline using the freshest available production data. At minimum, map:

`search or social impression -> landing page -> prompt/CTA impression -> click or gate -> contribution -> identity capture -> return -> session interest -> booking -> payment`

For each step, report:

- the event or table that measures it;
- the current count and conversion rate;
- the date window and denominator;
- whether the number is observed, inferred, or currently unmeasurable;
- the largest instrumentation gap;
- the smallest instrumentation change needed to make the next experiment readable.

Segment the analysis by personality-analysis pages, Enneagram articles, homepage, questions, Chorus placements, and session surfaces. Use the 2026-08-01 Search Console export for acquisition demand and current production analytics for behavior. Do not mix query impressions, visits, people, sessions, and fingerprints as if they were interchangeable.

Resolve the apparent mismatch between a working contribution prompt and dead signup or waitlist capture. Determine whether this is primarily a visibility problem, value-proposition problem, identity-request problem, trust problem, technical problem, or some combination.

## 3. Research the smallest paid offer

Research current alternatives and comparable offers for non-clinical personality, relationship-pattern, Enneagram, communication, and "decode a person" sessions. Use recent primary sources, live offer pages, platform policies, and credible operator examples. Record URLs and access dates. Do not rely on generic market-size summaries or unsourced pricing roundups.

Answer:

1. Who buys these sessions, in what moment, and what outcome are they seeking?
2. What language creates urgency without making clinical or deterministic claims?
3. What are the current price, length, format, deliverable, and proof patterns across credible comparable offers?
4. Where does DJ have a believable advantage: the nine-read framework, a written analysis artifact, conflict translation, founder access, or something else?
5. What can be sold manually in 7 days without new product infrastructure?
6. What would make the offer ethically unsafe or likely to disappoint?

Recommend one primary beta offer and, only if the evidence strongly supports it, one alternate. Specify:

- exact buyer and trigger moment;
- one-sentence promise;
- what happens before, during, and after the session;
- session length and recommended beta price range;
- a concrete take-home artifact;
- boundaries and non-clinical disclaimer;
- proof required before asking strangers to buy;
- a maximum number of beta slots;
- payment, scheduling, cancellation, and follow-up requirements;
- a pass/fail threshold for the first 30 days.

Do not launch it in this task. Draft the offer and the test. DJ must approve external publication, pricing, outreach, and payments.

## 4. Research trust, audience, and TikTok as a measurable channel

Treat TikTok as one possible trust and distribution channel, not as the strategy itself. Research current TikTok discovery and search behavior using official platform materials where available, plus recent examples of creators who turn psychology, personality, relationship, or point-of-view content into an owned audience or service business.

The strongest starting creative hypothesis is the core 9takes format: one concrete situation, nine emotionally different reads. Test whether it can be translated into repeatable short videos such as:

- "The same text message, interpreted nine ways";
- "Why this person went quiet, according to nine patterns";
- a timely public moment decoded without diagnosing the person;
- a viewer-submitted situation with several plausible reads;
- a short founder explanation that leads to a full Chorus prompt or session offer.

Produce a 30-day TikTok pilot, not a permanent content calendar. It must include:

- two or three repeatable formats;
- a sustainable posting cadence with an estimated time cost;
- the role of DJ on camera and a lower-production fallback;
- one primary call to action for the entire pilot;
- a trackable landing path and attribution method;
- hooks, proof points, and guardrails against typing strangers as fact;
- leading indicators such as qualified profile visits and site clicks;
- business outcomes such as contributions, captured emails, session inquiries, and paid bookings;
- stop, continue, and expand thresholds after 30 days.

Views and follower count are not sufficient success criteria. Compare TikTok against at least one lower-effort distribution option, such as publishing the same format on an existing network or using the current SEO audience more effectively.

## 5. Turn research into a ranked 30-day decision

Score every serious option on:

- time to first dollar;
- probability of generating meaningful evidence in 30 days;
- required DJ hours per week;
- implementation effort;
- dependence on new traffic;
- reversibility;
- fit with the existing 9takes worldview;
- risk of distracting from job interviews and Tacemus sales.

The final recommendation must choose a sequence, not a pile of parallel initiatives. Default to no more than:

1. one revenue experiment;
2. one existing-traffic conversion experiment;
3. one bounded distribution experiment.

Each experiment must have a named owner, exact audience, hypothesis, smallest implementation, instrumentation, start and end date, success threshold, guardrail, time budget, and decision at the end. Include a weekly hour ceiling for 9takes while cash remains urgent.

Explicitly compare these three candidate bets:

- paid decode-session beta;
- post-contribution identity capture plus an above-fold personality-analysis prompt;
- 30-day TikTok trust and distribution pilot.

If the evidence says one or more should wait, say so plainly. The memo must end with the exact next three actions DJ should take, ordered by dependency and expected value.

## 6. Deliverables

Create `docs/research/2026-08-02_9takes-audience-to-revenue-research.md` containing:

1. an executive decision in no more than 300 words;
2. a known, inferred, unknown, and contradicted evidence table;
3. the refreshed funnel with denominators and instrumentation gaps;
4. audience and visitor-intent findings;
5. current comparable-offer research with citations;
6. the recommended paid beta offer;
7. the 30-day TikTok pilot and lower-effort comparison;
8. a ranked decision table;
9. a 30-day operating plan with weekly hour ceiling;
10. measurement queries or event definitions;
11. the exact next three actions;
12. open questions that require DJ's judgment rather than more research.

After DJ approves the strategy, write separate implementation taskers for any selected product or funnel changes. Do not mix implementation into this research task.

## Verification checklist

- [ ] `git status --short` was recorded before work, and no unrelated changes were modified.
- [ ] `jq . docs/data/gsc/latest.json` succeeds and the referenced CSV files were used.
- [ ] The newest growth-log baseline was revalidated instead of copied as current fact.
- [ ] Every numeric claim includes a window, denominator, and observed/inferred/unmeasurable label.
- [ ] Current `/book-session` behavior and CTA integration were inspected in code and, if available, production.
- [ ] The research memo cites current sources and records access dates.
- [ ] Paid-offer recommendations avoid therapy, diagnosis, mental-health treatment, and guaranteed outcomes.
- [ ] TikTok success criteria extend beyond views and followers to owned or paid actions.
- [ ] The 30-day plan respects the cash emergency and includes a firm weekly time ceiling.
- [ ] No source code, live pricing, payment state, content, outreach, or production configuration was changed.
- [ ] `rg -n $'\u2014' docs/taskers/T-17-9takes-audience-to-revenue-research.md docs/research/2026-08-02_9takes-audience-to-revenue-research.md` returns no matches.

## Risks and gotchas

- The repository is edited in parallel. Never stash, reset, or rewrite unrelated files. In particular, preserve the staged `BookSessionCTA.svelte` work.
- Older strategy documents may describe features or bugs that have since changed. Code and live behavior win.
- Current comment volume is encouraging but small. Do not extrapolate a record week into product-market fit.
- Anonymous fingerprints are not automatically durable identities or unique humans across devices.
- Search traffic and TikTok attention can be low-intent. Optimize for qualified actions, not reach alone.
- The coaching waitlist is not proof of a purchasable offer. Verify checkout, scheduling, delivery, and boundaries separately.
- The Enneagram can be useful as a pattern language, but do not type, diagnose, or make mental-health claims about people as fact.
- Do not use a lack of a complete worldview as permission for a brand rewrite. Research only what changes the next decision.
- Do not manufacture testimonials, customer outcomes, scarcity, or demand.
- Do not modify any `lastmod` field. Do not use em dashes in taskers or published content.

## Definition of done

This task is done when DJ can answer, from one evidence-backed memo:

1. whether 9takes deserves a tightly bounded 30-day push now;
2. which one offer should be tested first and with whom;
3. which existing traffic leak should be fixed first;
4. whether TikTok is worth a 30-day trial and how it will be judged;
5. how many hours per week 9takes may consume while cash is urgent;
6. what specific evidence will cause DJ to continue, change direction, or pause.

The memo must make uncertainties explicit, recommend a sequence, and leave no unverified claim presented as known.
