# Council

Convene DJ's council. Each person on the roster gives counsel on a personal situation. Each response is written in complete isolation.

---

## Input

- **With args (`$ARGUMENTS`)**: treat as DJ's question.
- **Without args**: ask _"What do you want to ask the council?"_ and wait for the next message. Use that message as the question verbatim. If DJ includes context across multiple paragraphs, pass all of it.

Do not paraphrase or tighten. The participants see the question as written.

---

## Workflow

### 1. Build the session folder

- Today's date: `YYYY-MM-DD`
- Slug the question: lowercase, kebab-case, strip punctuation, collapse whitespace, max 60 chars, trim to word boundary
- Folder: `docs/council/YYYY-MM-DD_<slug>/`

### 2. Write `question.md`

```markdown
# Council Question — <YYYY-MM-DD>

**Asked:** <ISO timestamp>
**Slug:** <slug>

## The Question

<DJ's full question, verbatim>
```

### 3. Discover the roster

List all files in `.claude/people/` matching `*.md` (skip anything starting with `_` or `.`). For each file, derive:

- **Display name**: filename without `.md`, replace hyphens with spaces (e.g., `Tim-Ferriss.md` → "Tim Ferriss")
- **Kebab name**: filename without `.md` (e.g., `Tim-Ferriss`)

### 4. Spawn all participants in **one parallel batch**

Send a single message containing one `Agent` tool call per person. Use `subagent_type: general-purpose`. They must run concurrently.

For each person, use this prompt (substitute `{NAME}`, `{NAME_KEBAB}`, `{QUESTION}`, `{OUTPUT_PATH}`):

```
You are roleplaying {NAME} for a private council conversation with DJ Wayne (the founder of 9takes). This is not parody, not a performance, and not a Wikipedia summary. It is counsel delivered from this specific person's character — their frameworks, their wounds, their strengths, their voice.

READ, IN THIS ORDER, BEFORE RESPONDING:
1. `.claude/people/{NAME_KEBAB}.md` — your person profile. Who you are, your voice, your domains, your signature frameworks, your patterns and tendencies, your gut checks.
2. `.claude/flows/council.md` — the flow behavior layer. How to respond in the council flow. Response structure, voice rules, flow principles, how to use your patterns in this flow.
3. `.claude/people/dossiers/{NAME_KEBAB}.md`, if it exists — your deeper memory map. Read it as a retrieval map, not as material to summarize. Pull from it only when a life event, body-of-work artifact, obvious/non-obvious signal, relationship, quote, or framework materially clarifies how you would respond. Use obvious anchors to stay recognizable and non-obvious signals to avoid caricature. Do not name-drop biography as decoration. Do not summarize the timeline.
4. The "Source material" path listed in your person profile (usually `src/blog/people/drafts/{NAME_KEBAB}.md`). If the profile says no deep-source blog exists, skip this step.

DJ's question:
"""
{QUESTION}
"""

You do not know who else is on DJ's council, and you do not know what any other advisor said. Write alone. Do not speculate about or imply who else might be advising him.

Write your response to:
{OUTPUT_PATH}

Follow the council flow's response structure and rules exactly. When finished, report back a single line: "{NAME} council response written to {OUTPUT_PATH}."
```

**Output path**: `docs/council/<session>/{NAME_KEBAB}.md`

### 5. Wait for all to finish, then report back to DJ

Show:

1. Session folder path
2. List of participants with their output file paths and a one-line preview pulled from each participant's First Impressions section
3. Suggested reading order — reframers first, executors last. Adapt to the specific responses.
4. Reminder that a new `/council` starts a fresh session (no cross-session persistence yet)

Do not summarize the full responses. DJ reads them himself.

---

## Rules

- **Never edit a participant's response after the fact.** If one violates the structure, report and offer to rerun just that one.
- **Never skip a participant.** If one fails, report and offer to rerun only the failure.
- **Never let one participant reference another's output.** They ran in isolation. Keep it that way.
- **Do not create additional files** in the session folder beyond `question.md` and the participant responses.
- **If the question is clearly low-stakes** (e.g., "what should I have for lunch"), ask whether DJ wants the full council or a quicker single response.

---

## Example session structure

```
docs/council/2026-04-24_should-i-rebuild-the-blog-engine/
├── question.md
├── Tim-Ferriss.md
├── Robert-Greene.md
├── Neil-Strauss.md
├── Michael-Seibel.md
└── Peter-Thiel.md
```

---

_Last updated: 2026-04-24_
