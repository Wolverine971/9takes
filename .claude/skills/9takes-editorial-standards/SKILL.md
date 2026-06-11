---
name: 9takes-editorial-standards
description: The single source of truth for 9takes editorial rules - AI-writing tells to remove, banned words, voice attributes, frontmatter rules, and quality bars. Load when editing, polishing, de-AI-ing, or grading any 9takes blog content. Referenced by the editor agent and the editorial slash commands so the rules never drift between tools.
path: .claude/skills/9takes-editorial-standards/SKILL.md
---

# 9takes Editorial Standards

One rulebook for every editorial tool (the `editor` agent, `/deai`, `/copywriting-pass`, `/blog_content_editor_pass_people`, `/grade_blog`, `/cohesion-check`). If a rule here conflicts with an inline rule in a command, THIS FILE WINS — and the command should be updated to match.

## Hard rules (never violate)

1. **Never modify `lastmod` frontmatter.** DJ manages it manually. No enrichment, editing, or automated pass touches it.
2. **Em-dashes are banned in blog content.** Zero per article (the blog lint enforces this). Replace with commas, periods, or restructure. This supersedes any older "1–2 is fine" guidance.
3. **Quality gate: overall grade ≥ 8.5 and discoverability ≥ 7** (per `/grade_blog`) before a draft is publish-eligible.
4. **Don't change the title or slug of high-traffic published posts** (notably `enneagram-and-mental-illness`) — light-touch edits only, SEO preservation first.

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
- **date** — accurate; **lastmod** — DO NOT TOUCH
- **enneagram** — correct type number

## Quality bar (post-edit)

Scannable in 30 seconds · flows read aloud · sounds like a human expert · value delivered by halfway · reader knows what to think or do next · each point made once, well.
