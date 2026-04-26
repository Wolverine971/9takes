<!-- docs/council/architecture.md -->

# Council Architecture: People, Flows, and How They Compose

_Design doc. Not yet implemented. DJ reviews and approves before refactor._

---

## Why this exists

Today's persona files at `.claude/council/personas/<Name>.md` mix two things:

- **Who the person is** (identity, voice, domains, frameworks) — stable
- **How the person behaves inside the council flow** (principles, blind-spot rules, response structure) — flow-specific

Adding a second flow (a simple **poll**, where each person answers a general question in their voice rather than giving deep counsel on DJ's situation) surfaces the coupling. A Tim Ferriss profile should be useful to any flow — council counsel, a poll take, a hypothetical dinner-party roleplay, future flows we haven't thought of yet. The council-specific "Principles to test yourself against" and "Blind spots to name when relevant" sections don't belong on the person. They belong on the flow.

The fix is a two-layer model: **person** + **flow**. At invocation, an agent is briefed with one of each, plus the question.

---

## Proposed architecture

### Two-layer model

**Layer 1 — Person profile.** Standalone, reusable, flow-agnostic. Describes who the person is, how they speak, what they know deeply, where their lens distorts.

**Layer 1a — Raw person research.** A source-heavy research trail for creating or updating the person profile and dossier. It preserves local transcript notes, web sources, timeline facts, source confidence, open gaps, and comparison notes against the existing 9takes personality analysis. It is not a runtime prompt artifact.

**Layer 1b — Optional person dossier.** A deeper retrieval map for the person. It belongs to the person layer, not the flow layer. It gives agents selective access to life events, turning points, body of work, obvious vs non-obvious signals, relationships, source-backed voice, and facts to use sparingly without bloating the core profile.

**Layer 2 — Flow behavior.** Per-flow. Describes the purpose of the flow, the response structure, the voice rules, the principles, and how to use the person's patterns in this specific context.

At invocation, the agent reads `person + flow + optional dossier + source material + question` and writes its response to an output path.

### File layout

```
.claude/
├── people/                          # Standalone person profiles (reusable)
│   ├── Tim-Ferriss.md
│   ├── Robert-Greene.md
│   ├── Neil-Strauss.md
│   ├── Michael-Seibel.md
│   ├── Peter-Thiel.md
│   ├── research/                    # Raw research trails (not runtime prompts)
│   │   └── _template.md
│   └── dossiers/                    # Optional deeper retrieval maps
│       ├── _template.md
│       └── Tim-Ferriss.md
├── flows/                           # Flow behavior layers
│   ├── council.md                   # How a person behaves in council counsel
│   └── poll.md                      # How a person behaves in a poll
└── commands/
    ├── council.md                   # /council — counsel on DJ's situation
    ├── poll.md                      # /poll — ask everyone a question
    └── person-add.md                # /person-add — create a new people/<Name>.md (renamed from council-add-member)
```

### What goes in a person profile

- One-line identity
- One-paragraph biographical capsule
- Voice and speaking style (cadence, known phrases, phrases they'd never use)
- Domains of expertise — what they know deeply (BOLD-on list)
- Domains of weakness — what they don't know (HUMBLE-on list)
- Signature frameworks — the named tools they actually use
- **Patterns and tendencies** — the factual descriptions of their default moves, wounds, and biases. _(This replaces the current "Blind spots" section, but reframed as character facts rather than behavior instructions. A pattern like "Tim reaches for a protocol when someone needs presence" is a fact about Tim regardless of whether he's giving council counsel or answering a poll.)_
- Source material pointer (to `src/blog/people/drafts/<Name>.md` if it exists)

Keep the person profile distilled. Do not turn it into a full biography or life timeline. If deeper history would help responses, put it in a dossier.

**No principles section.** Principles are about how to respond, which is flow-specific.

**No flow-specific vocabulary** ("counsel," "DJ's situation," "six sections"). The profile should be useful to any flow.

### What goes in raw person research

The raw research doc is created before the dossier. It is the evidence trail.

- Source inventory — existing personality analysis path, local transcript assets, local research/review docs, new transcript pulls, web sources
- Pass 1 independent notes — timeline, body of work, voice, relationships, frameworks, obvious anchors, non-obvious signals, common misreads, open gaps
- Transcript work log — new transcripts pulled, raw/writeup paths, consolidated analysis updates, backlinks
- Pass 2 personality analysis comparison — alignment, enrichment, tensions, conflicts, outdated claims, and comments added to the blog draft
- Candidate dossier entries — a staging area before pruning
- Source index — local paths and URLs

The raw research doc can be messy and source-heavy. The dossier should not be.

### What goes in a person dossier

A dossier is a selective memory map. It should help the agent retrieve the right lived experience only when a question makes it relevant.

- Life event map — timeline cards with event, why it matters, when to use, when to avoid, and source
- Turning points — moments where the person's operating system changed
- Body of work — books, companies, films, podcasts, roles, institutions, or projects that reveal method and judgment
- Obvious vs non-obvious — recognizable public anchors, subtle signals, and common misreads
- Source-backed voice — phrases, cadence, rhetorical moves, and current voice updates
- Relationship map — collaborators, family, mentors, rivals, and what those relationships reveal
- Works and frameworks — books, projects, companies, methods, or named tools with when to apply them
- Known distortions — where the person's lens predictably bends reality
- Use sparingly — powerful facts that become corny or heavy if repeated too often
- Retrieval notes — topic-specific reminders for when to pull or avoid material

The dossier is not a second biography. It is a retrieval layer. The command prompt should explicitly tell agents not to summarize it or name-drop facts as decoration.

### What goes in a flow behavior layer

- Flow purpose (what this flow is for)
- Response structure (sections, if any, with descriptions)
- Voice and tone rules for this flow
- Response-depth and answer-shape calibration for this flow
- Principles to test the response against
- How the agent should handle the person's patterns/tendencies in this flow (e.g., in council, "name them when they surface in your counsel"; in poll, "don't name them — just let them shape the take honestly")
- Hard bans (AI-tell vocabulary, em dashes, etc.)
- What the agent should NOT do in this flow (e.g., in poll, "no deep reframing, no six-section structure")
- The agent prompt template (the master prompt the command uses, with `{PERSON_PROFILE_PATH}`, `{BLOG_PATH}`, `{QUESTION}`, `{OUTPUT_PATH}` placeholders)

---

## The two flows

### Council (existing, to refactor)

**Purpose**: Deep counsel on a personal situation DJ is facing.

**Structure**: Six sections — First Impressions → How I'd Reframe This → The Face-Value Answer → My Framework Applied → What I'd Think, Feel, and Do → Where I Might Be Wrong.

**Length**: ~600–1500 words per person.

**Isolation**: Each advisor responds without knowing anyone else is on the council.

### Poll (new)

**Purpose**: Ask one question of every person on the roster. Each answers in their voice. Not counsel — a take.

**Use cases**:

- "What's your take on the current state of creative work under AI?"
- "If you had to recommend one book to someone under 30, what would it be?"
- "How do you think about legacy?"

**Structure**: Single-section response. Their answer, in their voice. No first-impressions/reframe/framework/Think-Feel-Do scaffolding — those are council moves. A poll asks "what do you think?" and gets "here's what I think."

**Length**: Variable by person and question. Most answers should land around ~120–350 words, but a one-sentence answer, short refusal, joke, careful caveat, or longer thoughtful answer can be correct if that is how the person would answer. Tight. Quotable. Not uniform.

**Authenticity calibration**: Before writing, each person silently decides whether they would answer, how deeply they would answer, what authority they have, what shape the answer would naturally take, and what they would leave out. This prevents every poll answer from becoming the same polished mini-essay.

**Optional modes** (future; start with one):

- Quick take (1–3 sentences, tweet-length)
- Standard take (~150–300 words)
- Long take (~500 words)

**Isolation**: Same as council — each person responds without knowing who else is being polled.

**Output**: `docs/polls/YYYY-MM-DD_<slug>/` with `question.md` and one `<Name>.md` per responder.

### Council vs Poll — side by side

| Dimension        | Council                 | Poll                                  |
| ---------------- | ----------------------- | ------------------------------------- |
| Question type    | DJ's personal situation | General question or topic             |
| Response         | Six-section counsel     | Single take                           |
| Length           | ~600–1500 words         | Variable, usually ~120–350 words      |
| Reframing        | Yes                     | No                                    |
| Action advice    | Yes (via Think/Feel/Do) | Optional, not required                |
| Humility section | Yes                     | Embedded in voice, not formal section |
| Isolation        | Yes                     | Yes                                   |

---

## How invocation composes the layers

Example: `/council` with question Q.

1. Command reads `.claude/flows/council.md` for behavior + prompt template
2. For each person on the roster, command reads `.claude/people/<Name>.md`
3. Command spawns one agent per person with a prompt like:

```
You are roleplaying {NAME}. Read, in this order:
1. {PERSON_PATH} — who this person is
2. {FLOW_PATH} — how a person responds in this flow
3. {DOSSIER_PATH}, if it exists — deeper retrieval map, not biography to summarize
4. {BLOG_PATH} — the deep portrait DJ wrote about you

The question: """{QUESTION}"""

Follow the response structure and rules in the flow doc exactly.
Write your response to {OUTPUT_PATH}.
```

4. Agents run in parallel, each reading their three docs, writing to their own output
5. Orchestrator reports back

Same composition works for `/poll` — just with `flows/poll.md` instead of `flows/council.md` and a shorter output path under `docs/polls/`.

---

## Migration plan

1. Create `.claude/people/` and `.claude/flows/` directories.
2. For each of the five existing personas at `.claude/council/personas/<Name>.md`:
   - Split into PERSON and FLOW content.
   - Write PERSON to `.claude/people/<Name>.md`.
   - Rewrite the "Blind spots" section as "Patterns and tendencies" (factual, not prescriptive).
   - Drop the "Principles" section from the person file.
3. Extract council-specific content into `.claude/flows/council.md`:
   - Response structure (the six sections with descriptions)
   - Voice and tone rules
   - Principles to test against (universal across people in this flow)
   - Per-person principles, if they stay, move here as "the specific principles each person tests themselves against in council" — or we decide they're redundant with the universal flow principles and drop them.
   - Agent prompt template
4. Create `.claude/flows/poll.md` with the poll behavior.
5. Update `.claude/commands/council.md` to use the new paths.
6. Create `.claude/commands/poll.md` for the new flow.
7. Rename `.claude/commands/council-add-member.md` to `.claude/commands/person-add.md` (or keep the alias). Update it to write to `.claude/people/` instead of `.claude/council/personas/`.
8. After verifying both flows work, delete `.claude/council/personas/` or leave it as a legacy fallback for one release.

---

## Open questions for DJ

1. **Naming.** Is `people/` the right name for the profile dir? Alternatives: `voices/`, `advisors/`, `personas/`, `roster/`. "People" is cleanest but generic. "Voices" captures that these profiles are meant to be _voiced_ across flows.

2. **Patterns vs Blind spots.** You framed blind spots as council-specific. I'm proposing we rename them to "Patterns and tendencies" and keep them on the person (factual description of their default moves). The flow then instructs the agent what to do with them (name them in council; let them shape the voice in poll without naming). Does that split work, or do you still want the entire blind-spots section in the flow doc?

3. **Per-person principles.** In the current council setup, each person has their own five-ish principles (Tim's "Counsel not content," Greene's "Diagnose not motivate," etc.). They are tuned to the person's voice. Options:
   - **(a)** Move them to the flow doc as a shared set of principles all advisors test against.
   - **(b)** Keep them per-person but inside a flow-specific block within each person profile. (Fragile if we add more flows.)
   - **(c)** Split: shared universal principles live in the flow doc; each person also has a few character-specific principles that the flow doc explicitly pulls in by reference.
   - My lean is (c). Universal council principles in `flows/council.md`, plus a short `## Council-specific principles` block in each person file that the council flow includes. But this does re-couple a little. Want me to default to (a) for simplicity?

4. **Poll rename to something better?** "Poll" implies voting. This flow is closer to a "roundtable take" or "question drop." Other names: `/ask-each`, `/roundtable`, `/takes`, `/chorus`. Lean?

5. **Poll output dir.** `docs/polls/` or `docs/council/polls/`? If we rename "council" to something broader (e.g., "voices"), they might share a parent.

6. **Command rename.** Keep `/council-add-member`, or switch to `/person-add` since it's cross-flow? I'd lean toward `/person-add` to decouple from council branding.

7. **Do we want a command to list people** (`/people-list`) or flows (`/flows-list`)? Not required, but cheap and helps when the roster grows.

---

## What this unlocks

Once the two-layer model is in place, adding new flows is cheap. Examples of future flows this architecture supports without touching person profiles:

- **Debate** — two people, a topic, they argue their sides
- **Endorsement** — one person endorses or declines DJ's plan, in voice
- **Interview** — one person interviewed by DJ with a list of questions
- **Memorial** — a person writes a hypothetical letter/essay on a topic they care about
- **Compare** — pick two people, they both take the same question, differences are highlighted

Each new flow is a single `.claude/flows/<name>.md` + `.claude/commands/<name>.md`. The roster at `.claude/people/` stays untouched.

---

_Last updated: 2026-04-24_
