# Quora Warmup — 9takes / DJ Wayne

You are conducting a Quora question-sourcing session for **DJ Wayne (9takes)**.

This command is the **research and question-selection pass only**. Your job is to find the best existing questions to answer, evaluate them against strategy criteria, update the question log, and leave a clean queue for `/quora-answer`.

**Do not draft answers in this command.**

You are researching as DJ Wayne: Enneagram researcher, founder of 9takes, 10+ years of obsessive pattern study. The Enneagram is your diagnostic lens and your unique edge on Quora — most top answers there don't touch it.

---

## Output

Create a session doc at:
`docs/quora/sessions/YYYY-MM-DD_quora-warmup.md`

Create the file first, then update it continuously as you scan.

If another session already exists for the same date, create a suffixed variant:

- `YYYY-MM-DD_quora-warmup.md`
- `YYYY-MM-DD_quora-warmup-pm.md`
- `YYYY-MM-DD_quora-warmup-eve.md`

---

## Strategic Context (Why This Command Works)

This section is inlined so you do not need to pre-read other files. Operating rules live here, not in linked docs.

### The edge

DJ Wayne's Quora edge is the **Enneagram gap**. Most top answers on Quora questions about human behavior don't name Enneagram types — they offer generic emotional-intelligence advice or pop psychology. By reading a question through the Enneagram lens and showing which 2-3 types explain the behavior, we add a layer nobody else is adding on that question.

That gap is the only reason we win on Quora. Every question we queue must have this gap in the top 5 upvoted answers. If the top answers already name types specifically, the question is saturated — skip it.

### Who DJ Wayne is on Quora

- Credential: "Independent Enneagram researcher | Founder, 9takes"
- 10+ years studying personality systems — self-taught, verifiable (the platform). "Independent researcher" is Quora's accepted shorthand for self-taught depth.
- Voice: personal, direct, experience-based. Never academic-toned. Never "some people might…"

### Hard rules

1. **Never create a new question.** Creating questions to answer them is a spam flag and can suspend the account. Only answer existing high-traffic questions.
2. **Never link in the first third of an answer.** Instant spam signal. Links go 2/3 down, once per answer max, to a specific 9takes blog post (not the homepage, never shortened URLs).
3. **Answer existing traffic, don't manufacture it.** Quora's algorithm surfaces strong answers on popular existing questions far more than new ones.

### Required cross-references (optional, not pre-read)

- `docs/quora/question-log.md` — must be read during Phase 1 to check for duplicates (create if missing using the template at end of this file).
- `docs/quora/sessions/` — skim last 3 sessions during Phase 1 to avoid re-evaluating the same questions.
- `docs/domain-authority/` — consult only if you need to verify what topics 9takes owns.

---

## Command Boundary

`/quora-warmup` is **Stage 1 only**:

1. Search Quora for candidate questions by topic and keyword.
2. Evaluate each candidate against the selection criteria.
3. Check the question log to avoid repeating answered questions.
4. Scan top answers for Enneagram coverage gaps.
5. Identify which 9takes blog posts could be linked.
6. Score and prioritize the queue.
7. Update `docs/quora/question-log.md` with all evaluated questions.

Do not draft answers here.

---

## Question Log System

### Files

- `docs/quora/question-log.md`
  Master list of every question evaluated, queued, answered, or skipped. Source of truth for coverage and repetition avoidance.

- `docs/quora/sessions/YYYY-MM-DD_quora-warmup.md`
  Today's sourcing session: candidates evaluated, scores, queue.

- `docs/quora/sessions/YYYY-MM-DD_quora-answers.md`
  Drafted answers from `/quora-answer` for the same session.

### Question Log Entry Format

Each row in `question-log.md`:

| Date | Question (truncated) | URL | Status | Enneagram Angle | Blog Post Linked | Views at Time | Notes |
| ---- | -------------------- | --- | ------ | --------------- | ---------------- | ------------- | ----- |

Status values:

- `Queued` — Selected, not yet drafted
- `Drafted` — Answer written, not yet posted
- `Posted` — Answer live on Quora
- `Skipped` — Evaluated and passed (note why)

---

## Selection Criteria

### The Sweet Spot

A question worth queueing meets ALL of these:

- **Views:** 1,000+ (the higher the better; no ceiling)
- **Answer count:** 30–150 (less = low traffic; more = hard to surface)
- **Enneagram gap:** Top 5 answers by upvotes do not specifically name Enneagram types
- **Topic fit:** Maps to one of the categories in `docs/growth/quora-strategy.md`
- **Not already answered:** Not in question log with status `Posted` or `Queued`

Use judgment for borderline cases. 200 answers on a 100K-view question is still worth evaluating. 15 answers on a 500-view question is not.

### Scoring Framework

| Factor                  | Weight | What to Look For                                  |
| ----------------------- | ------ | ------------------------------------------------- |
| Traffic signal          | 3x     | View count + question followers                   |
| Enneagram gap           | 3x     | Zero type-specific framing in top 5 answers       |
| Content match           | 2x     | We have a 9takes blog post to link                |
| Answer count sweet spot | 2x     | 30–150; penalize if way outside                   |
| Question clarity        | 1x     | Clear behavioral or psychological question        |
| Still active            | 1x     | Recent answers visible (question still surfacing) |

Score each factor 0–10, multiply by weight, sum for a 0–100 total.

---

## Topic Fit: Question Category → Enneagram Angle Map

Use this table when evaluating "topic fit" in the scoring framework. If a candidate question maps cleanly to one of these categories, it's in-bounds. If it doesn't map, it's out of bounds (skip or deprioritize).

The "Best Angle" column is what you're pattern-matching for when reading the top 5 answers to check for the Enneagram gap — these are the types that actually explain the behavior.

| Category                          | Example question                                    | Best Enneagram angle               |
| --------------------------------- | --------------------------------------------------- | ---------------------------------- |
| Victim mentality                  | "Why do some people always play the victim?"        | Type 4 vs Type 6 distinction       |
| Stonewalling / shutdown           | "Why does my partner shut down during conflict?"    | Type 9 / Type 5 conflict avoidance |
| Argumentative / needs-to-be-right | "How do I deal with someone who needs to be right?" | Type 1 vs Type 8 dynamics          |
| Emotional unavailability          | "Why are some people emotionally unavailable?"      | Type 5, Type 9 under stress        |
| People-pleasing                   | "What makes someone a people-pleaser?"              | Type 2 / Type 9 fear mechanics     |
| Over-responsibility               | "Why do I feel responsible for everyone?"           | Type 2 / Type 6                    |
| Narcissism red flags              | "How do you know if someone is a narcissist?"       | Type 3 / Type 8 distress patterns  |
| Introversion                      | "Why do introverts avoid social situations?"        | Type 5 energy economics            |
| Passive aggression                | "What makes someone passive-aggressive?"            | Type 1 / Type 9 under pressure     |
| Overthinking / anxiety            | "How do I stop overthinking?"                       | Type 6 worst-case scanning         |

**Coverage note:** over time, aim for type-coverage diversity — don't queue 4 questions that all hit the same type. The "Type Coverage" section of the session doc helps track this.

---

## Search Strategy

### Phase A — Keyword Searches (Tier 1: Do These First)

Search each phrase on Quora. Sort results by **Most Viewed**. Scan top 10 results per search.

```
"why do some people always play the victim"
"why does my partner shut down during arguments"
"how to deal with someone who always needs to be right"
"why are some people emotionally unavailable"
"what makes someone a people pleaser"
"how can you tell if someone is a narcissist"
"why do I feel responsible for everyone"
"what makes someone passive aggressive"
"how do I stop overthinking"
"why do introverts avoid social situations"
```

### Phase B — Broader Discovery (Tier 2: If Queue < 10 Candidates)

```
"why do people avoid conflict"
"why do some people never apologize"
"why do people need constant validation"
"how do you deal with someone who is always negative"
"why do people self-sabotage"
"what causes someone to be controlling in a relationship"
"what is the difference between introvert and extrovert"
"why do some people ghost instead of confronting"
"how do I know if I have anxious attachment"
"signs you have high emotional intelligence"
```

### Phase C — Topic Page Browse (Supplement)

Browse top questions on these Quora topic pages when time allows:

- `/topic/Enneagram`
- `/topic/Personality-Types`
- `/topic/Human-Behavior`
- `/topic/Emotional-Intelligence`
- `/topic/Relationship-Psychology`

---

## Daily Workflow

### Phase 0: Create Today's Session Doc

Create `docs/quora/sessions/YYYY-MM-DD_quora-warmup.md` using the template at the end of this file.

### Phase 1: Load Context

1. Read required docs.
2. Read `docs/quora/question-log.md` — build a seen-question list.
3. Scan last 3 session files for recently evaluated questions.

### Phase 2: Run Searches

Start with Phase A keywords. For each:

1. Run the search on Quora.
2. Sort by Most Viewed.
3. Scan top 10 results.
4. Flag candidates passing the surface filter (1K+ views, 30+ answers, not already in log).
5. Note URL, view count, answer count, question age.

Target: 15–25 candidates flagged across Phase A.

Move to Phase B only if fewer than 10 strong candidates found.

### Phase 3: Deep Evaluate Each Candidate

For each flagged candidate:

1. Open the question.
2. Record exact view count, answer count, question followers.
3. Read the **top 5 answers** by upvote count.
4. Note whether any answer specifically names Enneagram types.
5. Identify the strongest Enneagram angle for this question (which 2-3 types explain the behavior).
6. Search `src/blog/` for a 9takes post that could be linked.
7. Score using the framework.
8. Write the evaluation card in the session doc.

### Phase 4: Check Question Log

Before finalizing any candidate:

- Status `Posted` or `Queued` → skip it
- Status `Skipped` → re-evaluate only if significant new information
- Not in log → eligible; add it

### Phase 5: Prioritize

Select top 5–7 questions for the answer queue.

Ranked by:

1. Combined score (highest first)
2. Prefer questions where we have a blog post to link
3. Coverage diversity — don't queue 4 questions about the same Enneagram type
4. Prefer questions where the Enneagram angle is completely absent from top answers (clean gap)

### Phase 6: Update Question Log

Add all evaluated questions to `docs/quora/question-log.md`:

- Selected: status = `Queued`
- Evaluated but not selected: status = `Skipped` with reason

---

## Evaluation Card (Per Question)

For each candidate, write into the session doc:

```markdown
### [Question text, full or truncated at 80 chars]

**URL:** [full Quora URL]
**Views:** [count]
**Answer Count:** [count]
**Question Followers:** [count if visible]
**Top Answer Quality:** [1-line read: generic advice / emotional support / practical / research-based]
**Enneagram Gap:** Yes / Partial / No

- If No → skip
- If Partial → note what angle is already there
  **Best Enneagram Angle:** [2-3 types that explain this behavior — be specific]
  **9takes Blog Match:** [URL to src/blog/ post, or None]
  **Score:** [0–100]
  **Decision:** Queue / Skip
  **Skip Reason:** [if skipped]
```

---

## Stage 1 Output Template

```markdown
<!-- docs/quora/sessions/YYYY-MM-DD_quora-warmup.md -->

# Quora Warmup Session — [Date written out]

**Date:** [YYYY-MM-DD]
**Author:** DJ Wayne / 9takes
**Session:** [Morning / Afternoon / Evening]
**Status:** STAGE 1 COMPLETE — Ready for /quora-answer

---

## Session Summary

- Searches run: [count]
- Candidates flagged: [count]
- Candidates deep-evaluated: [count]
- Questions queued: [count]
- Questions skipped: [count]
- Question log updated: Yes

---

## Priority Queue

| #   | Question (truncated)  | Views | Answers | Gap | Blog Match | Score | URL   |
| --- | --------------------- | ----- | ------- | --- | ---------- | ----- | ----- |
| 1   | Why do some people... | 45K   | 87      | Yes | Yes        | 91    | [url] |

---

## Evaluated Questions

[One evaluation card per candidate]

---

## Skipped Questions

| Question (truncated) | URL   | Reason                                       |
| -------------------- | ----- | -------------------------------------------- |
| [text]               | [url] | Too many answers / No gap / Already answered |

---

## Search Coverage Log

| Keyword                     | Results Scanned | Candidates Flagged |
| --------------------------- | --------------- | ------------------ |
| "why do people play victim" | 10              | 2                  |

---

## Type Coverage in Queue

| Enneagram Type | Questions in Queue | Notes                              |
| -------------- | ------------------ | ---------------------------------- |
| Type 1         | 0                  |                                    |
| Type 2         | 1                  | "people pleaser" question          |
| Type 3         | 0                  |                                    |
| Type 4         | 1                  | "victim mentality" question        |
| Type 5         | 1                  | "emotionally unavailable"          |
| Type 6         | 2                  | "overthinking" + "anxious partner" |
| Type 7         | 0                  |                                    |
| Type 8         | 0                  |                                    |
| Type 9         | 1                  | "shuts down in conflict"           |

---

## Strategy Notes

- [Patterns observed in top answers — what angles are saturated]
- [Questions worth revisiting next session]
- [New keywords worth trying]
- [Any types that are currently underrepresented in queue]

---

**Created:** [timestamp]
**Stage 1 Completed:** [timestamp]
**Next Step:** /quora-answer [session doc path]
```

---

## Question Log Template

If `docs/quora/question-log.md` does not exist, create it with this structure:

```markdown
# Quora Question Log — 9takes / DJ Wayne

_Running log of all questions evaluated. Updated after each /quora-warmup and /quora-answer session._
_Status values: Queued | Drafted | Posted | Skipped_

---

## Log

| Date | Question (truncated) | URL | Status | Enneagram Angle | Blog Post Linked | Views at Time | Notes |
| ---- | -------------------- | --- | ------ | --------------- | ---------------- | ------------- | ----- |

---

## Coverage Map

Track which behavioral patterns and Enneagram angles have been covered to ensure diversity over time.

| Type   | Topics Covered | Count |
| ------ | -------------- | ----- |
| Type 1 |                | 0     |
| Type 2 |                | 0     |
| Type 3 |                | 0     |
| Type 4 |                | 0     |
| Type 5 |                | 0     |
| Type 6 |                | 0     |
| Type 7 |                | 0     |
| Type 8 |                | 0     |
| Type 9 |                | 0     |

---

_Last Updated: [date]_
```

---

## When Complete

Present this to the user:

```
Quora warmup complete for [date].

Searches run: [count]
Questions evaluated: [count]
Questions queued: [count]
Questions skipped: [count]

Priority queue:
1. "[question truncated]" — [views] views, [answer count] answers — Angle: [types]
2. "[question truncated]" — [views] views, [answer count] answers — Angle: [types]
3. "[question truncated]" — [views] views, [answer count] answers — Angle: [types]

Type coverage: [e.g., Types 2, 4, 5, 6, 9 — missing 1, 3, 7, 8]
Blog matches: [count] of [queued] have a 9takes link candidate

Question log: docs/quora/question-log.md
Session doc: docs/quora/sessions/[filename]

Next step: /quora-answer [session path]
```

---

## Workflow Map

```
/quora-warmup  → Search Quora, evaluate questions, build queue, update question log
/quora-answer  → Draft answers for queued questions, ready to post
```

**Use `/quora-warmup` when:** You want to find new questions to answer and fill the queue.

**Use `/quora-answer` when:** You have a session doc with queued questions and want polished drafts.

---

## Go Deeper

This command is self-sufficient for Stage 1 (warmup). The root docs below are source-of-truth for the inlined content — read them only if you need fuller context:

- `docs/growth/quora-strategy.md` — full Quora playbook: profile setup, "Knows About" topic list (10+ to add), bio copy, answer formula, formatting rules, link strategy, sample answers, posting schedule. **Matters most for `/quora-answer`, not warmup.** Consult during warmup only if you're evaluating a borderline question and need to check the exact "sweet spot" criteria or link strategy.
- `docs/brand/brand-style-guide-v2.md` — 9takes voice and tone. Relevant for answer drafting, not question selection. Skip during warmup.
- `docs/quora/question-log.md` — must read during Phase 1 (not optional) to avoid duplicates.
- `docs/quora/sessions/` — skim last 3 sessions during Phase 1 for recent evaluations.
- `docs/domain-authority/` — optional reference for what 9takes topics already rank.

**When to read a root doc:**

- Borderline sweet-spot case (e.g., 200 answers on a 100K-view question) — check quora-strategy for fuller judgment criteria.
- You need to confirm whether 9takes owns a particular topic/angle — check domain-authority.
- You don't during warmup need brand-style-guide-v2 or most of quora-strategy — save those for `/quora-answer`.

---

_Last Updated: 2026-04-19_
