<!-- claude-code-skills.md -->
# Claude Code Skills Assessment for 9takes

Source: imported from a tweet/video thread and normalized for review.

## Executive Take

- The file claims "20" skills, but the paste actually contains 22.
- Most of the imported items are not strong operational skills. They are lightweight prompt templates.
- 9takes already has better, more specific Claude commands for writing, editing, distribution, research, and automation.
- The real value is not installing these as-is. The value is extracting the few useful ideas and rewriting them around 9takes workflows.

## Imported Skill Inventory

### Writing & Content

- `scqa-writing-framework`
  - Purpose: structure writing with Situation -> Complication -> Question -> Answer.
  - Assessment: useful framework, weak standalone skill.
  - Verdict: skip as a separate skill; keep as a pattern inside blog and tweet workflows.

- `content-repurposing-engine`
  - Purpose: turn long-form content into multiple formats.
  - Assessment: directly relevant.
  - Verdict: keep, but 9takes already has a stronger version in `.claude/commands/content-repurposing-engine.md`.

- `tone-style-enforcer`
  - Purpose: force outputs into a specific voice.
  - Assessment: too generic on its own.
  - Verdict: redundant; fold into brand-aware writing commands.

- `long-form-summary-compressor`
  - Purpose: summarize long text.
  - Assessment: commodity behavior, not a differentiating skill.
  - Verdict: skip as standalone.

- `structured-copywriting-skill`
  - Purpose: generate copy with hooks, flow, and CTAs.
  - Assessment: useful in principle, but too broad and generic.
  - Verdict: redundant with existing blog, Twitter, and distribution commands.

### Visual & Infographic

- `excalidraw-diagram-generator`
  - Purpose: turn concepts into diagram instructions.
  - Assessment: mildly useful for planning or documentation.
  - Verdict: optional; not core to current 9takes workflows.

- `infographic-builder`
  - Purpose: turn text into infographic structure.
  - Assessment: overlaps with social distribution work.
  - Verdict: low priority unless you start producing a lot of visual educational content.

- `flowchart-decision-builder`
  - Purpose: generate decision trees and flowcharts.
  - Assessment: generic and narrow.
  - Verdict: skip unless you want internal process docs.

- `ui-ux-layout-advisor`
  - Purpose: critique interface layout and hierarchy.
  - Assessment: more useful than most of the visual skills because the repo has a real product UI and admin surface.
  - Verdict: worth adapting if you want a reusable frontend critique workflow.

### Research & Analysis

- `deep-research-synthesizer`
  - Purpose: condense large research inputs into useful takeaways.
  - Assessment: relevant, but too vague as written.
  - Verdict: adapt into a 9takes-specific research brief workflow.

- `onchain-transaction-analyzer`
  - Purpose: explain blockchain transactions.
  - Assessment: off-domain.
  - Verdict: ignore.

- `source-validation-skill`
  - Purpose: assess source credibility and bias.
  - Assessment: high-value for celebrity/personality analysis and any evidence-based writing.
  - Verdict: strong candidate to adapt.

- `competitive-intelligence-skill`
  - Purpose: compare tools, products, or markets.
  - Assessment: high-value for SEO, blog positioning, and content-gap work.
  - Verdict: strong candidate to adapt.

- `knowledge-structuring-skill`
  - Purpose: organize messy notes into a clean framework.
  - Assessment: genuinely useful, especially for research-heavy content pipelines.
  - Verdict: keep the idea, but merge it with research synthesis instead of keeping it separate.

### Video & Social

- `video-script-generator`
  - Purpose: generate short- or long-form scripts.
  - Assessment: relevant if you want more Reels, Shorts, or creator-style distribution.
  - Verdict: useful only if rewritten around 9takes channels and voice.

- `video-editing-planner`
  - Purpose: suggest scenes, cuts, and pacing.
  - Assessment: niche for this repo.
  - Verdict: low priority.

- `hook-generator`
  - Purpose: create attention-grabbing openers.
  - Assessment: too narrow to justify a dedicated skill.
  - Verdict: merge into social/video distribution workflows.

- `caption-subtitle-formatter`
  - Purpose: format captions for clarity and timing.
  - Assessment: useful only if paired with actual video production work.
  - Verdict: low priority unless video becomes a real operating lane.

### Coding & Automation

- `code-review-skill`
  - Purpose: review code for issues and improvements.
  - Assessment: a generic version adds little. It only becomes useful if it encodes 9takes-specific rules.
  - Verdict: skip as-is; rewrite only if you want Svelte 5 + Supabase + admin-panel-specific review rules.

- `workflow-automation-agent`
  - Purpose: break goals into executable steps.
  - Assessment: too abstract.
  - Verdict: redundant with existing plan and automation commands.

- `skill-creator-meta-skill`
  - Purpose: generate new skill files.
  - Assessment: meta, not operational.
  - Verdict: no need to keep this in the project.

- `devops-assistant`
  - Purpose: help with deployment and workflow operations.
  - Assessment: too generic to matter.
  - Verdict: skip unless rewritten around Vercel, Supabase, and this repo's release flow.

## What 9takes Already Has

The current `.claude` setup is already more valuable than most of the imported list because it is tied to real project outcomes.

### Existing writing/editorial coverage

- `.claude/commands/write_amazing_blog.md`
- `.claude/commands/blog_content_creator_people.md`
- `.claude/commands/content-repurposing-engine.md`
- `.claude/commands/cohesion-check.md`
- `.claude/commands/deai.md`
- `.claude/commands/grade_blog.md`
- `.claude/agents/content-editor.md`
- `.claude/agents/content-polish.md`

These already cover most of:

- SCQA-style structuring
- tone enforcement
- long-form summarization
- structured copywriting
- repurposing
- quality control

### Existing research/distribution coverage

- `.claude/commands/web-research.md`
- `.claude/commands/research_codebase_generic.md`
- `.claude/commands/distribute.md`
- `.claude/commands/distribute-instagram.md`
- `.claude/commands/twitter.md`
- `.claude/commands/next-tweet.md`
- `.claude/commands/tweet-reply.md`
- `.claude/commands/twitter-warmup.md`
- `.claude/commands/instagram-warmup.md`

These already cover most of:

- research synthesis
- content ideation
- hook generation
- platform adaptation
- social distribution

### Existing design/automation coverage

- `.claude/commands/design-update.md`
- `.claude/skills/midjourney-prompt/SKILL.md`
- `.claude/commands/implement_plan.md`
- `.claude/commands/daily-blog-creator.md`
- `.claude/commands/project-cleanup.md`

These already cover most of:

- UI/design critique direction
- visual ideation
- workflow execution
- automation orchestration

## Recommendation Matrix

### Strong candidates to adapt for 9takes

- `source-validation-skill`
  - Why: celebrity typing and blog claims are only as good as the evidence chain.
  - Rewrite target: `evidence-led-research`
  - Required additions:
    - source-quality rubric
    - quote extraction rules
    - contradiction log
    - confidence scoring
    - mandatory citation format

- `competitive-intelligence-skill`
  - Why: 9takes is SEO- and positioning-sensitive.
  - Rewrite target: `seo-content-gap-analysis`
  - Required additions:
    - SERP intent analysis
    - competitor angle comparison
    - content-gap map
    - internal linking suggestions
    - title/meta improvement ideas

- `deep-research-synthesizer` + `knowledge-structuring-skill`
  - Why: together they solve a real problem; separately they are too generic.
  - Rewrite target: `research-brief-builder`
  - Required additions:
    - claim/evidence table
    - unresolved questions
    - strongest supporting examples
    - counterarguments
    - ready-to-write section outline

- `video-script-generator`
  - Why: potentially useful if you want blog-to-Reels or blog-to-Shorts output.
  - Rewrite target: `short-form-video-adapter`
  - Required additions:
    - hook variants
    - scene beats
    - on-screen text
    - CTA style for 9takes
    - evidence/disclaimer pattern

- `ui-ux-layout-advisor`
  - Why: the repo has a real product/admin UI, unlike the rest of the tweet list.
  - Rewrite target: `svelte-ui-critique`
  - Required additions:
    - mobile-first review
    - Svelte component references
    - design-token adherence
    - usability findings format

### Keep only as patterns, not standalone skills

- `scqa-writing-framework`
- `tone-style-enforcer`
- `structured-copywriting-skill`
- `hook-generator`
- `long-form-summary-compressor`

These are better treated as techniques embedded inside stronger commands.

### Skip entirely

- `onchain-transaction-analyzer`
- `video-editing-planner`
- `caption-subtitle-formatter`
- `workflow-automation-agent`
- `skill-creator-meta-skill`
- `devops-assistant`
- `flowchart-decision-builder`

These are either off-domain, too generic, or too weak to justify maintenance.

## Better Skill Opportunities Than the Tweet List

If you want real leverage, the best additions are not the tweet prompts. They are project-specific skills or live ecosystem skills that match the stack.

### Project-specific skills worth creating

1. `evidence-led-research`
   - For celebrity typing, quote collection, source scoring, and contradiction handling.

2. `seo-content-gap-analysis`
   - For SERP pattern review, competitor comparison, and internal-link opportunities.

3. `research-brief-builder`
   - For turning raw research into a publishable outline with evidence.

4. `short-form-video-adapter`
   - For converting blog ideas into Reels, Shorts, and caption plans.

5. `svelte-ui-critique`
   - For reviewing product/admin UI against mobile, hierarchy, and conversion goals.

### Live installable skills that fit the stack better

- Svelte/SvelteKit skill
  - Useful for Svelte 5 and SvelteKit-specific implementation guidance.
  - Example: `bobmatnyc/claude-mpm-skills@svelte`

- Playwright skill
  - Useful for browser-driven QA and admin flow testing.
  - Example: `bobmatnyc/claude-mpm-skills@playwright-e2e-testing`

- Supabase/Postgres best practices
  - Useful for query quality and schema review.
  - Example: `bobmatnyc/claude-mpm-skills@supabase-backend-platform`

- SEO/GEO skill
  - Useful for content discovery and search-facing content strategy.
  - Example: `founderjourney/claude-skills@seo-geo-skills`

## Bottom Line

- Do not bulk-import the tweet list.
- Keep using the current 9takes Claude commands as the primary system.
- Extract only 4-5 ideas from the tweet list and rewrite them around real repo workflows.
- If you want net-new leverage, prioritize Svelte, Playwright, Supabase/Postgres, and SEO/GEO support over generic "writing" or "hook" skills.
