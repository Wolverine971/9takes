# Agent Prompt for 9takes Content Strategy Implementation

## Context & Mission

You are assisting with the 9takes content strategy implementation. 9takes is a personality-based Q&A platform that needs to establish domain authority in Enneagram and personality-based life optimization. The current state analysis and strategic planning have been completed. Your role is to execute the strategy and move the project forward.

## Start Here

**ALWAYS begin by reading:** `/docs/START-HERE.md`
This file contains the current state, priorities, and immediate action items.

## Project Overview

### What Has Been Done

1. **Content Audit:** 60+ Enneagram blogs analyzed and organized by domain authority clusters
2. **Gap Analysis:** Identified critical content gaps with search volumes (e.g., 246k monthly searches for "enneagram test" with NO content)
3. **Blog Optimization:** 8 blogs deeply rewritten with psychological depth, SEO optimization, and JSON-LD structured data
4. **Twitter Strategy:** Complete 3-week content calendar with actual tweets, engagement templates, and growth strategy (28 → 1000 followers)
5. **Domain Authority Mapping:** 6 domains identified with detailed content inventories and priority lists
6. **Documentation:** Comprehensive strategy documents created in `/docs/` folder

### Current State

- **Platform:** 9takes.com - personality Q&A platform
- **Content:** 60+ published blogs, 12 drafts, 10 mental health guides
- **Strongest Domain:** Mental health & wellness (90% complete)
- **Weakest Domain:** Workplace & leadership (45% complete)
- **Twitter:** 28 followers, ready to execute growth strategy
- **Critical Gaps:** Wings guide, compatibility matrix, depression guide, test comparisons

## Directory Structure

```
/docs/
├── START-HERE.md ← BEGIN HERE
├── AGENT-PROMPT.md (this file)
├── domain-authority/
│   ├── 00-master-index.md ← Domain strategy overview
│   ├── 01-enneagram-core.md
│   ├── 02-personality-maxing.md
│   ├── 03-relationship-conflict.md
│   ├── 04-mental-health-wellness.md
│   ├── 05-workplace-leadership.md
│   └── 06-social-dynamics.md
├── twitter/
│   ├── 01-strategy-overview.md
│   ├── 02-content-calendar-week1-3.md ← Ready to execute
│   ├── 03-big-accounts-to-engage.md
│   ├── 04-visual-templates.md
│   ├── 05-response-templates.md
│   ├── 06-emergency-content-bank.md
│   └── 07-metrics-tracker.md
└── blog-optimization-strategies.md

/src/blog/enneagram/
├── [60+ published posts]
├── drafts/ [12 posts to complete]
│   ├── enneagram-leadership.md
│   ├── 27-enneagram-subtypes.md
│   ├── anxiety-and-enneagram-types-guide.md
│   └── [others...]
└── mental-health/ [10 comprehensive guides]
```

## Immediate Priorities (This Week)

### 1. Create 5 Critical Content Pieces

These fill the highest-value gaps:

1. **"Enneagram Wings: The Complete Guide"** - 22,200 searches/month gap
2. **"The 10 Best Enneagram Tests (2025 Review)"** - 246,000 searches/month opportunity
3. **"Depression Patterns by Enneagram Type"** - Complete mental health suite
4. **"Enneagram Compatibility Matrix"** - 18,100 searches/month gap
5. **"90-Day Personality Maxing Blueprint"** - Flagship transformation guide

### 2. Complete Pending Blog Updates

Check TodoWrite tool for status:

- enneagram-self-development.md (in progress)
- enneagram-mental-health-flags.md (pending)
- enneagram-team-dynamics.md (pending)

### 3. Execute Twitter Week 1

Use `/docs/twitter/02-content-calendar-week1-3.md`:

- Monday: Post question hook @ 9 AM
- Wednesday: Post main thread @ 12 PM
- Thursday: Post follow-up with link @ 5 PM
- Daily: Engage with 3 big accounts from list

## Content Creation Framework

### Blog Structure (Use for all new posts)

```markdown
---
title: 'SEO-optimized title with main keyword'
description: 'Meta description 150-160 chars'
author: 'DJ Wayne'
date: '2025-08-15'
loc: 'https://9takes.com/enneagram-corner/[url]'
lastmod: '2025-08-15'
changefreq: 'monthly'
priority: '0.6'
published: true
type: ['category']
blog: true
previewHtml: ''
pic: 'relevant-image'
---

<p class="firstLetter">Emotional hook opening.</p>

## Question-Based H2 Header for SEO?

### The Hidden Psychology of [Topic]

[Childhood wound → Adult pattern structure]

[Include tables, lists, practical takeaways]

<svelte:head>

<script type="application/ld+json">
[JSON-LD structured data]
</script>

</svelte:head>
```

### Optimization Checklist

- [ ] 2,500-3,500 words
- [ ] Question-based headers
- [ ] Psychological depth (childhood → adult patterns)
- [ ] Practical tables/lists
- [ ] Internal links to related content
- [ ] JSON-LD structured data
- [ ] Meta description optimized
- [ ] Target keyword in title, H1, first paragraph

## Key Performance Indicators

### Track Weekly

- New blog posts published
- Twitter follower growth
- Engagement rate on tweets
- Blog traffic increases
- Email subscribers added

### 30-Day Targets

- 5 critical gap posts published ✓
- 150 Twitter followers (from 28) ✓
- 10k+ blog traffic increase ✓
- 3 big accounts notice you ✓

## Decision Framework

### When Creating Content, Ask:

1. Does this fill a critical gap? (Check domain authority docs)
2. What's the search volume? (Aim for 1,000+ monthly)
3. Can we rank for this? (Check competition)
4. Does it serve our audience? (Practical value)
5. Can it be monetized? (Product/service tie-in)

### When Prioritizing, Consider:

1. **Search volume** - Higher is better
2. **Competition** - Lower is better
3. **User intent** - Informational → Transactional
4. **Monetization potential** - Direct product connection
5. **Authority building** - Cornerstone content first

## Tools & Resources

### Internal Resources

- Blog optimization framework: `/docs/blog-optimization-strategies.md`
- Domain gaps: `/docs/domain-authority/00-master-index.md`
- Twitter templates: `/docs/twitter/05-response-templates.md`
- Emergency content: `/docs/twitter/06-emergency-content-bank.md`

### External Tools

- Keyword research: Google Keyword Planner, Ahrefs
- Competition analysis: SEMrush, Moz
- Content ideas: Answer The Public, Also Asked
- Trending topics: Google Trends, Twitter Trending

## Common Tasks

### To Create a New Blog Post:

1. Check domain authority doc for gaps
2. Research keywords and competition
3. Use blog optimization framework
4. Write 2,500-3,500 words
5. Add JSON-LD structured data
6. Internal link to related content
7. Create social media adaptations

### To Update an Existing Blog:

1. Read current version
2. Apply optimization framework
3. Add psychological depth
4. Update headers to questions
5. Add tables/lists for scannability
6. Update JSON-LD dates
7. Improve internal linking

### To Execute Twitter Strategy:

1. Check `/docs/twitter/02-content-calendar-week1-3.md`
2. Post according to schedule
3. Use visual templates for formatting
4. Engage with big accounts list
5. Track metrics in tracker
6. Use emergency content when stuck

## Important Notes

### Voice & Tone

- Direct and concise (user prefers brevity)
- Psychologically insightful
- Modern but not casual
- Practical over theoretical
- Data-driven when possible

### User Preferences

- Wants to move fast
- Prefers action over planning
- Values psychological depth
- Focused on monetization
- Building for scale

### Constraints

- Small Twitter following (28)
- Limited time for content creation
- Need quick wins for momentum
- Competing against established sites

## Success Metrics

### 6-Month Vision

- 100+ comprehensive guides published
- 500k+ monthly organic traffic
- 10,000+ email subscribers
- $10-20k monthly revenue
- Recognized authority in Enneagram space

## Questions to Ask User

When you need direction:

1. "Should I prioritize [X] or [Y] this week?"
2. "Do you want to focus on traffic or monetization?"
3. "Should I finish drafts or create new content?"
4. "Which domain should we dominate first?"
5. "Do you want to adjust the Twitter strategy?"

## Your First Actions

1. **Read** `/docs/START-HERE.md` for current state
2. **Review** `/docs/domain-authority/00-master-index.md` for gaps
3. **Check** TodoWrite tool for pending tasks
4. **Create** the first critical gap post
5. **Execute** Monday's Twitter strategy
6. **Update** START-HERE.md with progress

---

Remember: The strategy is complete. Your job is EXECUTION. Create content, fill gaps, and build authority. All the planning documents are ready - just follow them and make progress daily.
