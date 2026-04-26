# Poll

Ask one question of everyone on the roster. Each person gives a take, not counsel. Each response is written in complete isolation.

---

## Input

- **With args (`$ARGUMENTS`)**: treat as the poll question.
- **Without args**: ask _"What do you want to poll?"_ and wait for the next message. Use that message as the question verbatim.

Do not paraphrase. Participants see the question as written.

---

## Workflow

### 1. Build the session folder

- Today's date: `YYYY-MM-DD`
- Slug the question: lowercase, kebab-case, strip punctuation, collapse whitespace, max 60 chars, trim to word boundary
- Folder: `docs/polls/YYYY-MM-DD_<slug>/`

### 2. Write `question.md`

```markdown
# Poll Question — <YYYY-MM-DD>

**Asked:** <ISO timestamp>
**Slug:** <slug>

## The Question

<DJ's full question, verbatim>
```

### 3. Discover the roster

List all files in `.claude/people/` matching `*.md` (skip anything starting with `_` or `.`). For each file, derive:

- **Display name**: filename without `.md`, replace hyphens with spaces
- **Kebab name**: filename without `.md`

### 4. Spawn all participants in **one parallel batch**

Send a single message with one `Agent` tool call per person. `subagent_type: general-purpose`. All run concurrently.

For each person, use this prompt (substitute `{NAME}`, `{NAME_KEBAB}`, `{QUESTION}`, `{OUTPUT_PATH}`):

```
You are roleplaying {NAME} for a private poll answer from DJ Wayne (the founder of 9takes). This is not parody, not a generic op-ed, and not a Wikipedia summary. It is the answer this specific person would give to this specific question — including their real limits, evasions, brevity, humor, cadence, obsessions, and blind spots.

READ, IN THIS ORDER, BEFORE RESPONDING:
1. `.claude/people/{NAME_KEBAB}.md` — your person profile. Who you are, your voice, your domains, your signature frameworks, your patterns and tendencies, your gut checks.
2. `.claude/flows/poll.md` — the flow behavior layer. How to respond in the poll flow. Pay special attention to the private calibration, question handling, length, distinctness, and no-template rules.
3. `.claude/people/dossiers/{NAME_KEBAB}.md`, if it exists — your deeper memory map. Read it as a retrieval map, not as material to summarize. Pull from it only when a life event, body-of-work artifact, obvious/non-obvious signal, relationship, quote, or framework materially clarifies how you would respond. Use obvious anchors to stay recognizable and non-obvious signals to avoid caricature. Do not name-drop biography as decoration. Do not summarize the timeline.
4. The "Source material" path listed in your person profile (usually `src/blog/people/drafts/{NAME_KEBAB}.md`). If the profile says no deep-source blog exists, skip this step.

DJ's question:
"""
{QUESTION}
"""

You do not know who else was polled. Write alone. Do not speculate about or reference others.

Before writing, do the poll flow's private calibration silently:
- Would {NAME} actually answer this question, and how fully?
- How deep would {NAME} go?
- What source of authority applies here, if any?
- What response shape fits {NAME}: blunt verdict, story, joke, caveat, diagnostic question, list, refusal, narrow answer, or something else?
- What would {NAME} leave out?

Write your response to:
{OUTPUT_PATH}

Follow the poll flow's structure and rules exactly. Do not force a shared response template or a uniform length. When finished, report back a single line: "{NAME} poll response written to {OUTPUT_PATH}."
```

**Output path**: `docs/polls/<session>/{NAME_KEBAB}.md`

### 5. Wait for all to finish, then report back to DJ

Show:

1. Session folder path
2. List of participants with output paths
3. A **one-sentence preview** from each response — pull the first sentence of each take so DJ can scan positions before opening files
4. (Optional) Note any response that skewed unusually short or declined the question — that is data

Do not summarize the full responses.

---

## Rules

- **Never edit a participant's response after the fact.** If one violates the structure, report and offer to rerun just that one.
- **Never skip a participant.** If one fails, report and offer to rerun only the failure.
- **Never let one participant reference another's output.** Isolation is the mechanism.
- **Do not create additional files** in the session folder beyond `question.md` and the participant responses.

---

## Example session structure

```
docs/polls/2026-04-24_is-ai-replacing-writers/
├── question.md
├── Tim-Ferriss.md
├── Robert-Greene.md
├── Neil-Strauss.md
├── Michael-Seibel.md
└── Peter-Thiel.md
```

---

_Last updated: 2026-04-24_
