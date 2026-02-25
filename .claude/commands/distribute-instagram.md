# Distribute Instagram - Gen Z Asset Generator (9takes Cheat Sheet Powered)

You are tasked with creating a complete Instagram distribution asset pack for a 9takes personality analysis blog.

When invoked with a blog/person target, generate publish-ready Instagram content that follows the 9takes Gen Z cheat sheet style:

- Alex Hormozi inspired: direct, punchy, no fluff.
- GaryVee inspired: one core insight repurposed into multiple micro-assets.
- 9takes brand: pattern recognition + clear POV + evidence-backed interpretation.

## Input

The user provides: **$ARGUMENTS** (person name, blog URL/path, or draft filename), for example:

- `Pete Davidson`
- `/personality-analysis/Pete-Davidson`
- `src/blog/people/drafts/Pete-Davidson.md`

If no argument is provided, respond:

```text
Ready to build Instagram assets. Tell me which blog you want to distribute.

You can give me:
1. A person's name (e.g., "Pete Davidson")
2. A blog path (e.g., "/personality-analysis/Pete-Davidson")
3. A draft file path (e.g., "src/blog/people/drafts/Pete-Davidson.md")

Example: /distribute-instagram Pete Davidson
```

Then wait for user input.

## Required Source Files (Read First)

1. `docs/instagram/gen-z-instagram-posting-cheat-sheet-2026.md` (primary operating rules)
2. `docs/instagram/instagram-launch-plan-feb-2026.md` (voice + examples)
3. `youtube-transcript-research/learn-copywriting.md` (full transcript + analysis)
4. `youtube-transcript-research/3-rules-of-copywriting.md` (3-rule transcript + analysis)

If any file is missing, continue with available files and note the limitation.

## Pre-Approved Operations

- **Read**: All files in the project
- **WebSearch**: Research Instagram handles, fan accounts, recent hooks, and context
- **Glob/Grep**: Resolve blog file and metadata
- **Write**: Create files in `docs/distribution-assets/`
- **Bash**: `ls` commands only

## Task Tracking

Use TaskCreate/TaskUpdate to track progress through the workflow. Create 6 tasks at the start:

1. Load cheat sheet and resolve blog target
2. Extract hooks, evidence, and POV inputs
3. Research Instagram handles and topical context
4. Generate Instagram asset pack from cheat sheet framework
5. Run scorecard QA and revise if needed
6. Write output file and report summary

---

# Workflow

## Step 0: Load the Cheat Sheet Rules

Before generating content, read and apply the principles from:

- `docs/instagram/gen-z-instagram-posting-cheat-sheet-2026.md`
- `youtube-transcript-research/learn-copywriting.md`
- `youtube-transcript-research/3-rules-of-copywriting.md`

Non-negotiables for every output:

1. **No-waste opening:** first line (or first 1-2 seconds) states the payoff.
2. **Content Value Triad:** entertaining + educational + expressive.
3. **Copy Quality Triad:** visualizable + falsifiable + 9takes-unique.
4. **Falsifiable psychology:** claim + evidence + boundary/counter-signal + disclaimer.
5. **Forced-choice CTA:** ask an agree/disagree or A/B prompt.
6. **One Mississippi test:** hook must be understandable in about 2 seconds.
7. **Don't talk, only point:** replace adjectives with observable proof.
8. **Competitor-signability test:** reject lines a generic account could post.
9. **Conflict requirement:** include at least one clear tension/contrast.
10. **Compression rule:** keep caption/story paragraphs to two lines max.

## Step 1: Resolve Blog Target and Metadata

### 1a. Normalize user input

Resolve the target in this order:

1. If input is a full draft path, use it directly.
2. If input is a `/personality-analysis/[Slug]` path, convert to draft filename and locate source blog.
3. If input is a person name, find matching draft in `src/blog/people/drafts/`.

If multiple matches exist, ask one clarifying question.
If no blog is found, stop and tell the user.

### 1b. Pull metadata

Read `src/lib/components/molecules/famousTypes.ts` and extract if available:

- Enneagram type
- contentGrade
- lastmod
- personaTitle
- link
- hasImage

If metadata is missing, continue with blog text alone and note it.

## Step 2: Extract Instagram Inputs from the Blog

From the full blog, extract:

- **Primary visual hook moment** (a specific scene/event for slide 1)
- **Core interpretation thesis** (pattern behind behavior)
- **3 concrete evidence points** (quotes/events/behaviors)
- **Depth tension** (what this pattern costs them)
- **One direct quote** that is short, specific, and emotionally revealing
- **One falsifiable claim** + **one counter-signal** (what would disprove your read)
- **One 9takes-only credibility anchor** (e.g., archive pattern claim)
- **One explicit conflict pair** (public image vs private behavior, or strength vs cost)
- **3 adjective-to-evidence rewrites** ("don't talk, only point" conversions)
- **Audience sensitivity note** (controversy/protective fandom context)

Quality gate:

- If `contentGrade < 8.0`, warn user that IG distribution may underperform without stronger hook density. Continue unless asked to stop.

## Step 3: Research Instagram Context

Use WebSearch to gather:

- Official Instagram handle
- 2-5 related handles to tag (fan/media/community)
- One topical hook (recent launch, controversy, interview, release, trend)
- Comment climate guidance (supportive vs debatable framing tolerance)

## Step 4: Generate Instagram Asset Pack

Use this exact structure:

```markdown
<!-- docs/distribution-assets/[person-name]-instagram.md -->

# [Person Name] - Instagram Distribution Assets

> Enneagram Type: [X or Unknown] | Content Grade: [X.X or Unknown] | Last Updated: [Date or Unknown]
> Blog URL: /personality-analysis/[Person-Name]
> Instagram Tier: [Direct Reachable / Fan-Route / Hybrid] — [one-line reason]
> Hook Type Used: [Contrarian / Prediction / Pattern Interrupt / Identity Callout / Evidence-Led / Binary]

## Strategy Snapshot (Cheat Sheet Alignment)

- **No-waste opener:** [first-line payoff]
- **Entertaining angle:** [tension/surprise]
- **Educational angle:** [model/mechanism]
- **Expressive angle:** [clear POV]
- **Falsifiable claim:** [specific claim]
- **Counter-signal:** [what would disconfirm it]
- **9takes-only claim:** [why this take is uniquely credible]
- **One Mississippi result:** [passes/fails 2-second clarity + reason]
- **Competitor-signability check:** [what makes this non-generic]

## Abstract -> Concrete Rewrites (Required)

- **Rewrite 1:** [weak abstract line] -> [pointed evidence line]
- **Rewrite 2:** [weak abstract line] -> [pointed evidence line]
- **Rewrite 3:** [weak abstract line] -> [pointed evidence line]

---

## Carousel (6-8 Slides)

**Slide 1 - Hook (Photo Overlay):**
[One-line stop-scroll hook with concrete scene]

**Slide 2 - Scene:**
[Specific moment in time]

**Slide 3 - Thesis:**
[Interpretation in one hard claim]

**Slide 4 - Evidence 1:**
[Concrete proof]

**Slide 5 - Evidence 2:**
[Concrete proof]

**Slide 6 - Evidence 3:**
[Concrete proof]

**Slide 7 - Falsifiability:**
[Counterpoint / what would prove this wrong]

**Slide 8 - CTA:**
[Forced-choice discussion prompt + link in bio]

---

## Caption (140-220 words)

Use this sequence:

1. Hook line (no throat-clearing)
2. 3-5 short evidence lines
3. Interpretation thesis
4. Falsifiable test/prediction
5. Disclaimer
6. Forced-choice CTA question

[Write full caption]

Formatting constraints:

- Paragraphs must be max two lines on mobile.
- Each paragraph should carry one idea.

**Required disclaimer line:**
Speculative personality read based on publicly available behavior, not diagnosis.

---

## Reel Script (30-60 sec)

- **Hook (0-2s):** [line]
- **Scene (3-10s):** [specific moment]
- **Interpretation (11-25s):** [POV + mechanism]
- **Proof (26-40s):** [2-3 points]
- **Challenge (41-55s):** [falsifiable prediction or binary challenge]
- **Close (56-60s):** [CTA]
- **On-screen text cues:** [optional]

---

## Trial Reel Hook Variants (A/B/C)

- **A:** [hook variant]
- **B:** [hook variant]
- **C:** [hook variant]

---

## Story Sequence (3 Frames)

- **Story 1 (same-day share):** [hook + link sticker]
- **Story 2 (poll):** [forced-choice poll text]
- **Story 3 (24h follow-up):** [one insight + link reminder]

---

## Hashtags (15-20)

**Person-specific (3-5):**
[hashtags]

**Enneagram/personality (5-7):**
[hashtags]

**Niche discovery (5-8):**
[hashtags]

---

## Accounts to Tag

- @[primary handle]
- @[secondary handle]
- @[optional third handle]

---

## Posting Plan (7-Day Micro-Distribution)

- **Day 1:** Carousel + Story 1
- **Day 2:** Story poll + comment engagement
- **Day 3-5:** Reel (or Trial Reel first)
- **Day 6-7:** Follow-up story + repost winner angle

---

## First-Hour Comment Playbook

- Reply quickly to thoughtful comments
- Reward disagreement with evidence
- Pin best counterargument + your response

---

## Quality Scorecard (0-2 each)

- Entertaining: [0-2]
- Educational: [0-2]
- Expressive: [0-2]
- Visualizable: [0-2]
- Falsifiable: [0-2]
- 9takes-unique: [0-2]

**Total:** [X]/12
**Ship Decision:** [Ship if >=8, Revise if <8]

## Transcript QA Gates (Pass/Fail)

- 2-second clarity (One Mississippi): [Pass/Fail]
- Pointed evidence (no adjective-only claims): [Pass/Fail]
- Competitor cannot sign main line: [Pass/Fail]
- Conflict/contrast present: [Pass/Fail]
- Caption paragraph compression (<=2 lines): [Pass/Fail]

---

## Execution Checklist

- [ ] Replace final URL placeholders
- [ ] Confirm Instagram bio link points to this blog
- [ ] Publish carousel
- [ ] Publish stories
- [ ] Publish reel or trial reel
- [ ] Engage in comments for first 60 minutes
```

Asset rules:

1. Keep language direct and concrete; avoid fluffy intros.
2. Specific moments > abstract personality statements.
3. Be bold but fair; claims must be evidence-backed and falsifiable.
4. Caption must stand alone even if user never swipes.
5. Do not diagnose mental health conditions.
6. Don't talk about traits without pointing to behavior.
7. Prefer facts and quotes over adjectives.

## Step 5: Run QA and Revise

If scorecard total is below 8/12:

1. Rewrite hook and thesis.
2. Strengthen evidence specificity.
3. Tighten falsifiable claim and counter-signal.
4. Re-score once before finalizing.

If any transcript QA gate fails:

1. Rewrite opening line for 2-second clarity.
2. Convert adjective claims to pointed evidence lines.
3. Add a conflict/contrast sentence.
4. Tighten paragraph length and re-run QA.

## Step 6: Write File and Report to User

Write output to:

```text
docs/distribution-assets/[person-name-lowercase]-instagram.md
```

Then report:

```text
## Instagram Distribution Assets Created: [Person Name]

**File:** docs/distribution-assets/[person-name]-instagram.md
**Blog:** [Grade/Score if available] | Type [X if available]

### Included:
- Strategy snapshot (triad + falsifiability + 9takes edge)
- 3 abstract->concrete rewrites
- 6-8 slide carousel copy
- Caption (140-220 words + disclaimer + forced-choice CTA)
- Reel script (30-60 sec) + 3 trial hook variants
- Story sequence (3 frames)
- 15-20 hashtags (tiered)
- Tag list + 7-day posting plan
- Quality scorecard + transcript QA gates + ship decision

### Quick Pre-Launch Checks:
- [ ] Replace placeholders with final URL
- [ ] Confirm link in bio
- [ ] Post during recommended time window
- [ ] Engage comments in first hour
```

---

# References

- `docs/instagram/gen-z-instagram-posting-cheat-sheet-2026.md` (primary framework)
- `docs/instagram/instagram-launch-plan-feb-2026.md` (voice + examples)
- `docs/marketing/blog-distribution-strategy.md` (Instagram playbook context)
- `youtube-transcript-research/learn-copywriting.md` (full interview insights)
- `youtube-transcript-research/3-rules-of-copywriting.md` (three-rule quality filter)
