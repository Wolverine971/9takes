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

## Source of Truth

This command is **self-sufficient**. Operating principles, frameworks, hook patterns, and templates are inlined below — you do not need to read any other file to run this command.

Only read the root docs in the "Go Deeper" section at the end if you hit an edge case the inlined frameworks don't cover, or if you want background on where a rule came from.

### Pre-researched tidbits file (use first if person is listed)

A curated tidbits file lives at:

```
docs/instagram/post-ideas/2026-04-29_top-tier-people-tidbits.md
```

It contains 8-12 pre-extracted, factually-checked, scroll-stopping tidbits per person for the top-tier blogs identified in the corpus assessments (`docs/blog-automation/2026-04-29-*`). If the target person has a section in that file, **use it as your primary source for the Tidbits Lead-In Carousel** (see Step 4) and as a hook reservoir for the analytical carousel — it saves a full blog re-read. Always supplement with blog text for context, but don't re-research what's already extracted.

If the person is NOT in the tidbits file, extract tidbits directly from the blog using the criteria in the tidbits file's header (concrete, falsifiable, surprising, self-contained, ~30 words max).

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

## Step 0: Operating Principles (Non-Negotiables)

Apply these to every line of output. They are not stylistic preferences — they are quality gates.

### Brand frame

9takes is **not** gossip and **not** fan content. 9takes is **pattern recognition in public behavior through personality frameworks**. Every post should feel:

- **Entertaining** enough to watch (tension, surprise, stakes, emotional contrast).
- **Educational** enough to teach a model or mechanism.
- **Expressive** enough to show a clear 9takes POV (never neutral summary).

### The 10 non-negotiables

1. **No-waste opening:** first line (or first 1-2 seconds) states the payoff. Start with the conflict, not background. No "Hey guys, today..." intros.
2. **Content Value Triad:** score ≥1 on entertaining + educational + expressive.
3. **Copy Quality Triad (Harry Dry):** every hook + thesis line must pass:
   - _Can I visualize it?_ — reader can picture a scene/object.
   - _Can I falsify it?_ — claim can be proven true or false.
   - _Can nobody else say this?_ — tied to 9takes positioning, not a line a competitor could sign.
   - 3 no's → rewrite.
4. **Falsifiable psychology:** every personality claim needs Claim + Evidence + Boundary + Counter-signal + Disclaimer (template in Frameworks below).
5. **Forced-choice CTA:** ask an agree/disagree, this-or-that, or A/B prompt. No "what do you think?"
6. **One Mississippi test:** hook must be understandable in ~2 seconds. If it takes longer, rewrite.
7. **Don't talk, only point:** replace adjectives with observable proof. "He's insecure" → "In the 2026 interview, he laughs, looks down, and changes subject when asked about failure."
8. **Competitor-signability test:** if any generic IG account could post this line verbatim, it's not 9takes-ownable. Rewrite.
9. **Conflict requirement:** include at least one tension/contrast (public vs private, image vs reality, strength vs cost).
10. **Compression rule:** caption and story paragraphs max two lines on mobile. One idea per paragraph. If a sentence can be cut without losing meaning, cut it.

---

## Step 0.5: Frameworks Reference

Use these while drafting. Do not skip — the output template at Step 4 references them directly.

### Hook patterns (pick ONE per post)

The `Hook Type Used` field in the output must be one of these six:

1. **Contrarian** — "You think X. It's actually Y." → _"Everyone saw Pete Davidson's tattoos as self-expression. They're a second skin covering scars."_
2. **Prediction** — "Within 12 months, this person will..." → _"Within 12 months, Sabrina Carpenter will pivot from flirty persona to control era."_
3. **Pattern Interrupt** — "Most people miss this 5-second clip." → _"Most people missed the 2-second tell in his Netflix interview."_
4. **Identity Callout** — "If you're Type 7, this is your blind spot." → _"If you're a Type 9, Pete's $200k tattoo removal should scare you."_
5. **Evidence-Led** — "After analyzing 200+ profiles, here's what repeats." → _"After 200+ personality reads, this is the one move every Type 3 makes under stress."_
6. **High-Stakes Binary** — "This is either X or Y. Nothing in between." → _"This is either confidence or fear-masking. Pick one."_

Hook checklist before writing: concrete nouns (person, event, quote), time/place context, implied tension.

### Hook Build Method (First Line / Second Line)

- **First line:** concrete scene + tension.
- **Second line:** interpretation payoff.

If line two repeats line one, delete and rewrite.

Examples:

- L1: "He laughed when asked about commitment on live TV."
- L2: "That reaction is classic Type 7 escape behavior."

- L1: "She praised the team, then took control in the same breath."
- L2: "That is Type 3 image management under pressure."

### Don't Talk, Only Point — conversion examples

Use these as a model for the required "Abstract → Concrete Rewrites" section in the output:

| Abstract                     | Pointed                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| "He's insecure."             | "In the 2026 interview, he laughs, looks down, and changes subject when asked about failure."          |
| "She's authentic."           | "She posts unedited studio clips the same day she records them, including mistakes."                   |
| "He's a people pleaser."     | "He says yes to two conflicting commitments in the same week, then apologizes publicly to both sides." |
| "She has strong boundaries." | "She ended the interview after the third question about her ex and stated the boundary on camera."     |

Drafting rule: for each major claim, add at least one pointed sentence with a quote, timestamped moment, or concrete behavior.

### Falsifiable claim template (required structure)

Every personality read uses this five-part shape:

1. **Claim:** "X behavior suggests Y pattern."
2. **Evidence:** observed public behavior or direct quote.
3. **Boundary:** when this interpretation may fail.
4. **Counter-signal:** what would disconfirm the read.
5. **Disclaimer:** speculative, public-data-based.

Template:

```
Based on [observable behavior], my read is [type/pattern].
If this were wrong, we'd expect [alternative behavior].
Speculative analysis only; not a diagnosis.
```

### "Only 9takes can say this" credibility anchors

Use at least one in ~70% of posts:

- "We've analyzed 200+ public figures through this lens."
- "Across our archive, this pattern appears most in Types X and Y."
- "Most takes stop at behavior; we map motive + fear + coping style."
- "Our model predicts what happens under stress, not just public image."

Don't force this into every post. Use when it increases authority.

### Conflict and contrast templates

- "Publicly, [image]. Privately, [behavior]. That's the tension."
- "[Common interpretation] sounds right, but [better interpretation] explains more."
- "This is not [label A]. It's [label B], and here's the evidence."
- "The strength that built them is now the thing costing them."

### Disclaimer strings (exact text)

**Short (use in captions):**

> Speculative personality read based on publicly available behavior, not diagnosis.

**Long (use when tone demands more care, e.g. mental-health-adjacent subjects):**

> Disclaimer: This Enneagram analysis is speculative, based on publicly available information, and may not reflect the person's actual personality type.

### Guardrails

Before publishing, run:

- No mental health diagnosis claims.
- No definitive certainty on speculative reads — always hedge with "my read" / "suggests" / "likely."
- No low-effort reposting or shock framing that adds no value.
- No diagnosing mental health conditions (depression, BPD, addiction) — describe behavior only.

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

## Carousel (6-8 Slides) — Analytical (Mid-Funnel)

> Use this when the audience already knows the person and is ready for a personality read. For top-of-funnel curiosity (cold audience, "who is this person and why should I care?"), generate the **Tidbits Lead-In Carousel** below INSTEAD or IN ADDITION.

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

## Tidbits Lead-In Carousel (7-12 Slides) — Top-of-Funnel (Curiosity Bait)

> Purpose: drive blog reads by sharing surprising, concrete facts that make a stranger curious enough to click through. Lighter and more shareable than the analytical carousel — no falsifiability gates, no Enneagram framework on the slides themselves. The interpretation lives in the blog. **The job of these slides is to make someone go "wait, what?"**
>
> Source: pull tidbits from `docs/instagram/post-ideas/2026-04-29_top-tier-people-tidbits.md` (preferred) or extract from blog if person is not listed.

**Slide 1 - Hook (Big Type + Face):**
Pick ONE of these formats (rotate across posts):

- "You don't know [Person]."
- "[N] things you didn't know about [Person]."
- "[Person] is way more interesting than you think."
- "You think you know [Person]. You probably don't."
- Person-specific hook tied to their most surprising tidbit ("Peter Thiel bought a parachute after 9/11.")

**Slide 2 - Setup (One Line):**
"Here are [N] things you probably don't know about [Person]:"

**Slides 3 through (N+2) - Tidbits (One Per Slide, Big Readable Type):**
Pick 5-10 tidbits from the source list. Selection rules:

- Lead with the strongest (most "wait, what?" reaction).
- Save the second-strongest for last so they're hooked at the end.
- Mix categories: weird purchase, weird decision, weird childhood detail, weird quote, weird relationship.
- Each tidbit must read as a standalone headline. If it requires setup, it's the wrong tidbit for this format.
- Cut ruthlessly. Two short jaw-droppers > five medium ones.

**Final Slide - CTA:**
Pick ONE of these formats:

- "I wrote a full personality breakdown of [Person]. Link in bio."
- "Want to know what makes [Person] tick? Full Enneagram analysis — link in bio."
- "Read the full read on [Person] at 9takes.com/personality-analysis/[slug]"

---

## Tidbits Lead-In Caption (60-140 words)

Use this sequence:

1. Re-state the hook in one sentence (no throat-clearing).
2. Tease the 1-2 wildest tidbits that didn't make it onto the slides (or repeat the top one for emphasis).
3. One forward-looking line on what the full blog covers ("there's a full read on why he does what he does — link in bio").
4. Forced-choice CTA question that ties to the tidbits, not Enneagram theory ("Most surprising one — the [tidbit A] or the [tidbit B]?").

Constraints:

- Each paragraph max two lines on mobile.
- No personality-type analysis in the caption — that's the blog's job. Keep it factual + curious.
- No disclaimer needed (these are facts, not interpretations).

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

# Go Deeper

This command is self-sufficient. The frameworks above are distilled from these root docs — consult them only if you need fuller context, historical research, or examples beyond what's inlined:

- `docs/instagram/gen-z-instagram-posting-cheat-sheet-2026.md` — full cheat sheet with content pillars, posting cadence, 14-day sprint, testing and experimentation playbook, metrics framework. Source of truth for the 10 non-negotiables and the frameworks in Step 0.5.
- `docs/instagram/instagram-launch-plan-feb-2026.md` — full Pete Davidson case study (hook options, key quotes, carousel draft, caption template, hashtag + tag lists). Use as a worked example when the current target is analogous.
- `docs/marketing/blog-distribution-strategy.md` — wider Instagram playbook context.
- `youtube-transcript-research/learn-copywriting.md` — full Harry Dry interview (background on the 3 rules and "don't talk, only point").
- `youtube-transcript-research/3-rules-of-copywriting.md` — shorter version of the 3 rules framework with additional examples.

**When to read a root doc:**

- You hit a situation the inlined frameworks don't cover.
- The user explicitly asks for an angle or framework from one of these.
- You want to refresh your understanding of the _why_ behind a rule.
