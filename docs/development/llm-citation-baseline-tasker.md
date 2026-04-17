<!-- docs/development/llm-citation-baseline-tasker.md -->

# Tasker: LLM Citation Baseline via Chrome Browser

**For:** the agent assigned to run the LLM citation baseline in a real browser (Claude web, ChatGPT, Perplexity).
**Owner:** DJ
**Created:** 2026-04-17
**Companion doc:** `docs/development/rabbit-hole-baseline-snapshot.md` (where results land).

> **This runs in a new Chrome window DJ is opening specifically for this task.** Assume you have a fresh, logged-in-by-DJ browser session on Claude, ChatGPT, and Perplexity. Do not attempt to log in yourself.

---

## 0. Why this exists

We need a _pre-intervention_ baseline of what three major LLMs say when asked typology questions about the celebrities we've retrofitted (and a control set we haven't). In two weeks we'll re-run the same prompts and compare. This is the **only** measurement that isn't confounded by the URL case 301 redirect landing in parallel — GSC numbers will shift because of URL consolidation regardless of whether rabbit holes help, but LLM citation rates only move if the content changed.

The strategic goal behind the rabbit hole (per `9takes-strat.md` Part 4) is fan-out coverage: we want LLMs to cite 9takes for sub-queries like "What is Elon Musk's wing?" or "Is Pete Davidson a 4 or a 9?" We can only verify that by asking the models directly. That's this tasker.

---

## 1. What to use

**Recommended driver:** the `compound-engineering:agent-browser` skill (available in the Skills menu) — it's built for exactly this kind of work: open URLs, interact with forms, capture screenshots and text, scrape results. Alternatively the Playwright MCP if configured.

**Do NOT use:**

- Anthropic/OpenAI APIs directly. This tasker tests **public web UX** of those products — what an average user sees when Google sends them to an LLM. API responses differ from web UI responses (different system prompts, different retrieval/grounding behavior).
- WebFetch or the regular curl path — these won't render the JS-heavy chat interfaces.

---

## 2. The prompt set

**Same five queries** per target celebrity. Exact wording matters — do not paraphrase; reproducibility is the whole point.

```
Q1 (Primary type):  What is [Person]'s Enneagram type, and why?
Q2 (Wing):           What is [Person]'s Enneagram wing, and what evidence supports that reading?
Q3 (Subtype):        What is [Person]'s instinctual subtype (sp, so, or sx), and what behavior signals that?
Q4 (Arrows):         How does [Person] behave under stress versus in growth, in Enneagram terms?
Q5 (Counterargument):Could [Person] plausibly be typed as something other than [Type X]? What's the strongest alternate case?
```

Replace `[Person]` with the name, `[Type X]` with the 9takes-published type for that person.

---

## 3. Targets

Run all five queries against each of these nine pages, on each of three LLMs — **135 prompt executions total.**

### 3.1 Retrofit targets (rabbit hole live or newly-retrofitted)

| Person       | Published type | DB state                        | Notes                                                |
| ------------ | -------------- | ------------------------------- | ---------------------------------------------------- |
| Elon Musk    | Type 5         | ✅ Live with rabbit hole        | Primary datapoint                                    |
| Caleb Hearon | Type 7         | Draft-only (retrofit in draft)  | Measurement TBD after DJ pushes                      |
| Dario Amodei | Type 5         | Draft-only                      | Same                                                 |
| Johnny Depp  | Type 9         | DB-published; retrofit in draft | DJ to push; capture baseline BEFORE push if possible |

### 3.2 Controls (no retrofit, high GSC traffic — matched against Elon)

| Person          | Published type            | Notes                                                            |
| --------------- | ------------------------- | ---------------------------------------------------------------- |
| Dua Lipa        | Type 7 (verify from blog) | Closest traffic-match to Elon in Class B queue                   |
| Tom Hiddleston  | Type 9 (verify)           | Second-largest control                                           |
| Sydney Sweeney  | Type (verify)             |                                                                  |
| Gwyneth Paltrow | Type (verify)             |                                                                  |
| Jordi-Hays      | Type (verify)             | Anomaly case — 2.9% CTR already; does LLM citation reflect that? |

**Verify each control's published type** by loading `https://9takes.com/personality-analysis/[slug]` in Chrome before running their prompts. Don't trust the drafts folder on these — DB is source of truth.

---

## 4. Per-prompt workflow

For each (person × query × LLM) combination:

### Step 1 — Load the chat UI in a fresh conversation

- Claude: `https://claude.ai/new`
- ChatGPT: `https://chat.openai.com/` and click "New chat"
- Perplexity: `https://www.perplexity.ai/`

Use a **new conversation per query** to avoid context leaking between prompts. Yes, this is 135 new chats. This is the price of reproducibility.

### Step 2 — Paste the exact prompt, submit, wait for completion

Wait until the model finishes streaming (no "thinking" / "generating" indicator, no streaming cursor). On Perplexity, wait for the "Sources" panel to fully render.

### Step 3 — Capture

For each response, record in the results table (§6):

1. **Response text** — full answer, plain text. Strip to the core answer if the response is wordy; keep the typology claim verbatim.
2. **Did the model cite 9takes.com?** Yes / No. For Perplexity check the Sources panel. For Claude and ChatGPT with web access, look for inline citations / linked URLs in the response.
3. **If yes, which URL?** Full URL as shown. This tells us if they're citing the right page (canonical lowercase) or a stale title-case variant.
4. **Is the model's answer consistent with 9takes' published typing?** Yes / Partially / No.
5. **For Q2–Q5 specifically:** does the model's answer match what's inside the rabbit hole block on the 9takes page, or does it pull from elsewhere? This is the critical signal — if the rabbit hole is working, the model should be able to accurately answer Q2–Q5 and should cite 9takes when it does.
6. **Screenshot** the full response (page-level PNG). Save to `logs/llm-citation-baseline/2026-04-17/[llm]-[person]-Q[N].png` (create directories as needed).

### Step 4 — One-line summary per prompt

Write a single line in the results table per (person × query × LLM). Examples of good summaries:

- `Claude Q1 Elon: correct (Type 5). Cited 9takes.com/personality-analysis/elon-musk. Rabbit hole content not directly quoted.`
- `ChatGPT Q2 Dua Lipa: said "7w8" without sourcing. No 9takes citation. Our blog says Type 7 but we haven't published a wing.`
- `Perplexity Q5 Johnny Depp: proposed Type 7 as alternate, cited 3 sources, none were 9takes.`

---

## 5. Rate-limiting and hygiene

- **Work serially, not in parallel.** Triggering rapid new-conversation opens on Claude/ChatGPT looks like scripted abuse and will rate-limit you.
- **~5-second pause** between prompt submissions. Let the UI settle.
- **Rotate targets, not LLMs.** Do all five Elon queries on Claude, then all five on ChatGPT, then all five on Perplexity — one full sweep before moving to Caleb. This catches LLM-specific oddities (e.g., Claude's web access being off; ChatGPT routing to a reasoning model unexpectedly).
- **If a model refuses** ("I don't have information about private individuals' personality typing"), try once more with a one-sentence preamble: `I'm researching publicly documented personality-typing analyses. [original query]`. If it still refuses, mark as `REFUSED` and move on. Do not argue or jailbreak.
- **If a model hallucinates aggressively** (e.g., invents a 9takes URL that doesn't exist), flag in the summary line and capture the screenshot — this is itself useful data.
- **Don't edit messages.** One-shot only. We want the same surface area every time.

---

## 6. Output format

Append to `docs/development/rabbit-hole-baseline-snapshot.md` §2 as a structured table. Also dump a raw log at `logs/llm-citation-baseline/2026-04-17/results.md` in this format:

```markdown
# LLM citation baseline — 2026-04-17

## Elon Musk (Type 5, rabbit hole live)

### Claude

- **Q1 (Primary):** [verbatim core claim]. Cited: [URL or "none"]. Accuracy: [Yes/Partial/No].
- **Q2 (Wing):** ...
- **Q3 (Subtype):** ...
- **Q4 (Arrows):** ...
- **Q5 (Counterargument):** ...

### ChatGPT

(same shape)

### Perplexity

(same shape)

---

## Caleb Hearon (Type 7, retrofit in draft)

...
```

Keep the log file terse but complete. The screenshots are the authoritative record; the log is for skimmability.

---

## 7. Verification checklist (before reporting done)

- [ ] All 9 target pages verified against DB (not draft) for their published type before querying
- [ ] 45 prompts × 3 LLMs = 135 responses captured, one per fresh conversation
- [ ] 135 screenshots saved under `logs/llm-citation-baseline/2026-04-17/`
- [ ] `logs/llm-citation-baseline/2026-04-17/results.md` populated
- [ ] Summary table in `rabbit-hole-baseline-snapshot.md` §2 filled in
- [ ] Any refused/rate-limited/broken prompts explicitly flagged (not silently skipped)
- [ ] Note in the tracker with date stamped

---

## 8. Re-run plan (2026-05-01)

This same tasker runs verbatim in 2 weeks against the same 9 pages and same 5 queries. Save results to `logs/llm-citation-baseline/2026-05-01/` with the same structure. Delta analysis compares the two.

When re-running, **do not update the prompts**, even if they seem awkward or the models have changed behavior. Reproducibility > elegance.

---

## 9. Scope guards (do NOT do any of these)

- Do not test on fewer pages to "save time." The control set is what makes the experiment interpretable.
- Do not use multi-turn follow-ups. One prompt, one response, move on.
- Do not try to optimize prompts. If a prompt gets a refusal from one LLM, keep it — refusal rates are themselves a measurement.
- Do not hit the Anthropic/OpenAI APIs. This is specifically a test of web-UX citation behavior.
- Do not merge screenshots into a collage. One PNG per response; naming convention matters for the 2-week comparison.
- Do not let this run for more than one sitting. If it takes longer than ~2 hours of wall time, the state of the web (training cutoffs, index freshness, model versions) will have drifted. Start and finish in one session.

---

## 10. Definition of done

- [ ] 135 responses captured, saved, summarized
- [ ] Results table in baseline-snapshot doc populated
- [ ] Raw log + screenshots committed (or saved locally if not committing logs)
- [ ] Tracker updated with completion date and any anomalies worth noting
- [ ] Calendar reminder set for 2026-05-01 re-run
