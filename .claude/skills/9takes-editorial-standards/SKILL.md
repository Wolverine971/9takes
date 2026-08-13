---
name: 9takes-editorial-standards
description: The single source of truth for 9takes editorial rules - AI-writing tells to remove, banned words, voice attributes, frontmatter rules, and quality bars. Load when editing, polishing, de-AI-ing, or grading any 9takes blog content. Referenced by the editor agent and the editorial slash commands so the rules never drift between tools.
path: .claude/skills/9takes-editorial-standards/SKILL.md
---

# 9takes Editorial Standards

One rulebook for every editorial tool (the `editor` agent, `/deai`, `/copywriting-pass`, `/blog_content_editor_pass_people`, `/grade_blog`, `/cohesion-check`). If a rule here conflicts with an inline rule in a command, THIS FILE WINS — and the command should be updated to match.

## Canonical messaging (locked 2026-08-13)

The five-level hierarchy is frozen. Never invent a new master concept, tagline, or umbrella positioning; new language must clarify one of these jobs:

1. **Movement belief:** The internet collapses nine perspectives into one winning take.
2. **Brand promise:** See the emotions behind every take.
3. **Product ritual:** Answer before the crowd.
4. **Product explanation:** One question, nine perspectives.
5. **Personal payoff:** Stop mistaking someone else's alarm for a defect.

**Lead with the human situation** — a recognizable conflict, fear, contradiction, or blind spot. The Enneagram is the map that explains the situation, rarely the protagonist of the opening. ("I wanted her to trust my judgment. She wanted me to slow down." beats "Here is how an 8 communicates with a 7.") Exception: Instagram type-pond captions may open type-first by DJ's standing strategy decision.

**Retired from public copy:** "One situation, 9 ways to see it" (use "One question, nine perspectives"), "personality-maxing" (campaign vocabulary only), "open source conflict resolution" (internal metaphor only), "give-first" (internal; public copy says "Answer before the crowd"). "The Chorus," "The Mirror Moment," "One Take," "The Nine," and "crowd gravity" are supporting vocabulary — explain on first use, never the master message. Do not villainize "the crowd" or Reddit users; the problem is the architecture of anchoring and flattening.

Full usage rules: `docs/brand/messaging-hierarchy.md`.

## Hard rules (never violate)

1. **Never modify `lastmod` frontmatter.** DJ manages it manually. No enrichment, editing, or automated pass touches it. One exception: the publish commands (`/blog_content_publish_people`, `/blog_content_publish_pop_culture`) set `date` and `lastmod` once at publish time — publishing is not editing.
2. **Em-dashes are banned in blog content.** Zero per article (the blog lint enforces this). Replace with commas, periods, or restructure. This supersedes any older "1–2 is fine" guidance.
3. **Quality gate: overall grade ≥ 8.5 and discoverability ≥ 7** (per `/grade_blog`) before a draft is publish-eligible.
4. **Perspective gate: current reader-visible copy must have a passing six-perspective verification.** The subject-fairness, informed-fan, fair-minded-critic, unfamiliar-reader, Enneagram-expert, and one-year-future proxies run independently from one frozen draft. Missing, unresolved, or stale verification blocks publishing.
5. **Don't change the title or slug of high-traffic published posts** (notably `enneagram-and-mental-illness`) — light-touch edits only, SEO preservation first.

## Brand voice

Tactically direct · socially savvy · respectfully provocative · pattern-recognition focused · results-driven.
Writing rhythm: **Hook → Insight → Action step.** Key verbs: decode, navigate, map, read, unlock, resolve.

## The three substance tests

Run the title, opening, headings, and every major claim through these:

1. **Can I visualize it?** The reader should be able to close their eyes and see something. Abstract nouns (`growth`, `transformation`, `journey`) fail. Zoom in until you land on a concrete object, person, scene, or behavior.
2. **Can I falsify it?** Claims should be verifiably true or false. "Helps you understand yourself better" fails; "Type 3s rehearse conversations before sending them" passes. Don't talk — point: a named behavior, a direct quote, a number, an observable action.
3. **Can nobody else say it?** If Psychology Today or 16Personalities could publish the line unchanged, it fails. Find the 9takes angle: the anonymous Q&A mechanic, nine types answering one question, a specific type lens on a specific observable behavior.

## AI-writing tells (kill on sight)

**Sentence patterns**

- Negative parallelism — "It's not X, it's Y" dramatic contrast (the #1 tell). Rewrite as a direct statement.
- [Statement] + [restatement in different words]
- Dangling -ing endings that fake depth: "...ensuring," "...highlighting," "...emphasizing," "...reflecting"
- False ranges: "From X to Y" implying a spectrum between unrelated things
- Weasel attribution: "Industry reports suggest," "Some critics argue," "Many experts believe" — name the source or cut
- Filler openers: "In today's world," "It's important to note/remember/consider," "At the end of the day," "When it comes to"
- AI transitions: "Let's explore/dive into/unpack/take a closer look"
- Compulsive summaries: reflexive "Overall," "In summary," "In conclusion" — conclusions add a new thought or CTA, never restate
- Essay-tone conjunctions: "Moreover," "Furthermore," "In addition," "On the other hand"
- Conversational remnants: "I hope this helps," "Certainly!," "let me know"

**Word list (banned/flag):** game-changer, deep dive, unpack, leverage, tapestry, landscape, navigate the complexities, at its core, shed light on, resonates with, multifaceted, delve, nuanced, realm, foster, pivotal, embark, myriad, paramount, groundbreaking, cutting-edge, intricate, underscore, enhance, crucial, testament (incl. "stands/serves as a testament"), captivate, solidify, cornerstone, spearhead, bolster, commendable, meticulous, watershed moment, enduring/lasting legacy, plays a vital/crucial role, leaves a lasting impact, rich cultural heritage/tapestry, vibrant community, breathtaking, must-see/must-visit.

**Structural tells**

- Lists of exactly 3 everywhere (triplets of adjectives, examples, benefits) — vary list lengths; sometimes 2, sometimes 4
- Every section the same length / same paragraph construction / same opening syntax
- The `**Bold Title:** definition. Elaboration.` bullet template
- Balanced "on one hand / on the other hand" everywhere
- Vague contextual opener paragraph that adds no information
- Title Case In Every Heading (use sentence case)
- Uniform energy throughout — vary intensity and sentence length (short punchy + longer flowing)

## Formatting & readability

- Paragraphs 2–4 sentences; never multiple dense paragraphs back-to-back; mobile-first
- Headings tell a story when scanned alone; H2 = major section, H3 = sub-point; headings preview value ("Why Type 3s avoid vulnerability"), not labels ("Type 3 and vulnerability"); vary heading syntax
- Bullets for genuinely list-shaped content only — don't over-format prose

## Repetition

Keep: thesis callbacks at structural moments, deliberate parallel structure, rhetorical emphasis with a new dimension.
Cut: same point restated back-to-back with nothing new, identical phrasing recurring, multiple examples making one point without nuance, "in other words" + same idea. When cutting, consolidate into the single strongest version.

## Frontmatter checklist

- **title** — works for humans (curiosity) AND search (key terms); specific, not generic
- **description** — the meta description: ~120–155 chars, core value proposition, makes someone click
- **published** — correct for the post's status (never flip without explicit approval)
- **date** — accurate; **lastmod** — DO NOT TOUCH (publish commands set both once at publish time; that is the only exception)
- **enneagram** — correct type number

## Quality bar (post-edit)

Scannable in 30 seconds · flows read aloud · sounds like a human expert · value delivered by halfway · reader knows what to think or do next · each point made once, well.
