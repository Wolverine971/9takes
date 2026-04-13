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

## Required Context

Read these before starting:

- `docs/growth/quora-strategy.md`
- `docs/brand/brand-style-guide-v2.md`
- `docs/quora/question-log.md` (create if missing — use the template at end of this file)

Cross-reference as needed:

- `docs/quora/sessions/` (recent sessions, if any)
- `docs/domain-authority/` (understand what topics 9takes owns)

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

_Last Updated: 2026-04-13_
