<!-- docs/domain-authority/blog-index-integration.md -->
# Blog Index Integration & Cross-Linking Strategy

_Last Updated: 2025-12-04_
_Related: [Master Index](./00-master-index.md) | [Blog Index TypeScript](/src/lib/components/molecules/blogIndex.ts)_

## Overview

This document integrates the new structured blog index (`blogIndex.ts`) with the domain authority strategy. The blog index provides programmatic access to all enneagram-corner blogs for cross-linking, related posts, and content gap analysis.

---

## Current Blog Inventory Summary

### Total Published Blogs: 75 posts

| Domain             | Posts | % of Content | Status        |
| ------------------ | ----- | ------------ | ------------- |
| Enneagram Core     | 21    | 28%          | 🟢 Strong     |
| Personality Maxing | 10    | 13%          | 🟡 Growing    |
| Relationships      | 13    | 17%          | 🟢 Strong     |
| Mental Health      | 8     | 11%          | 🟡 Moderate   |
| Workplace          | 7     | 9%           | 🟡 Developing |
| Social Dynamics    | 11    | 15%          | 🟢 Strong     |
| Resources          | 6     | 8%           | 🟡 Moderate   |

---

## Domain-by-Domain Analysis

### 1. Enneagram Core Knowledge (21 posts) 🟢

**Current State:** Strong foundation with all 9 type profiles complete.

**Published Content:**

- ✅ All 9 core type profiles (Type 1-9)
- ✅ Wings guide (`enneagram-wings-complete-guide`)
- ✅ Subtypes/Instincts (`enneagram-instinctual-subtypes`)
- ✅ Stress patterns (`enneagram-stress-number`)
- ✅ Connecting lines (`enneagram-connecting-lines`)
- ✅ FAQs, concepts, criticisms
- ✅ Religious/philosophical perspectives

**Cross-Linking Opportunities:**

```
Type profiles → Wings guide → Subtypes → Stress patterns
↓
Celebrity examples (personality-analysis pages)
↓
Practical applications (relationships, workplace)
```

**Gap Analysis:**

- ❌ Missing: 27 Subtypes comprehensive guide (in drafts)
- ❌ Missing: Levels of Development (Riso-Hudson)
- ❌ Missing: Counter-types explanation

**Priority Actions:**

1. Complete 27 subtypes from draft
2. Add "Levels of Development" post
3. Create hub page linking all core content

---

### 2. Personality Maxing & Self-Optimization (10 posts) 🟡

**Current State:** Growing domain with flagship content in place.

**Published Content:**

- ✅ `personality-maxing` - Core concept piece
- ✅ `90-day-personality-maxing-blueprint` - Action plan
- ✅ `shadow-work-by-enneagram-type` - Deep work
- ✅ `enneagram-positive-self-talk` - Practical scripts
- ✅ `enneagram-strengths-and-weaknesses` - Self-awareness
- ✅ `how-each-enneagram-type-self-sabotages-success` - NEW

**Cross-Linking Strategy:**

```
Personality Maxing (concept) → 90-Day Blueprint (action)
↓
Shadow Work → Positive Self-Talk → Strengths/Weaknesses
↓
Self-Sabotage Patterns
↓
Link to Mental Health (stress, anxiety)
Link to Relationships (patterns in love)
```

**Gap Analysis:**

- ❌ Missing: Morning routines by type
- ❌ Missing: Productivity systems by type
- ❌ Missing: Habit formation by type
- ❌ Missing: Goal setting frameworks

**Priority Actions:**

1. Create "Morning Routines by Type" guide
2. Create "Productivity Systems by Type" guide
3. Link personality-maxing to all type profiles
4. Cross-link shadow work with toxic traits content

---

### 3. Relationships & Communication (13 posts) 🟢

**Current State:** Strong domain with comprehensive coverage.

**Published Content:**

- ✅ `enneagram-types-in-relationships` - Overview
- ✅ `enneagram-compatibility-matrix` - All 81 pairings
- ✅ `love-languages-and-enneagram-types` - Integration
- ✅ `attachment-styles-and-enneagram-types` - Psychology bridge
- ✅ Dating guides (men, women, first date)
- ✅ `how-to-apologize-like-a-pro` - Conflict repair
- ✅ Red flags and toxic traits content

**Cross-Linking Strategy:**

```
Compatibility Matrix ←→ Type Profiles
↓
Love Languages + Attachment Styles (psychology bridges)
↓
Dating Guides → First Date → Ghosting → Red Flags
↓
Apology Guide → Communication Guides
```

**Gap Analysis:**

- ❌ Missing: Friendship dynamics by type
- ❌ Missing: Family/parenting content
- ❌ Missing: Conflict resolution scripts
- ❌ Missing: Long-term relationship maintenance

**Priority Actions:**

1. Create "Friendship Dynamics by Type"
2. Create "Conflict Resolution Scripts" (practical tools)
3. Cross-link compatibility matrix to all type profiles
4. Link attachment styles to mental health content

---

### 4. Mental Health & Wellness (8 posts) 🟡

**Current State:** Moderate coverage with key topics addressed.

**Published Content:**

- ✅ `enneagram-and-mental-illness` - Overview
- ✅ `depression-patterns-by-enneagram-type`
- ✅ `enneagram-anxiety-management-guide`
- ✅ `enneagram-mental-health-flags` - Warning signs
- ✅ `enneagram-types-in-stress` - Stress patterns
- ✅ `enneagram-and-adhd-which-types-struggle-most`
- ✅ `neurodiversity-vs-personality`
- ✅ `why-you-cant-stop-overthinking-enneagram` - NEW

**Cross-Linking Strategy:**

```
Mental Illness Overview → Specific Conditions
↓
Depression ←→ Anxiety ←→ ADHD ←→ Stress
↓
Mental Health Flags (warning signs)
↓
Link to: Shadow Work, Self-Sabotage, Toxic Traits
```

**Note:** Extensive mental health guides exist in `/mental-health/` subdirectory (not included in main index):

- Therapy guide, trauma response, crisis management
- Addiction recovery, medication guide
- Neurodivergence, workplace mental health
- Parenting mental health, science guide

**Gap Analysis:**

- ❌ Missing: Burnout by type
- ❌ Missing: Sleep issues by type
- ❌ Missing: Grief processing by type

**Priority Actions:**

1. Create "Burnout Prevention by Type"
2. Cross-link main mental health posts with `/mental-health/` subdirectory
3. Link overthinking post to anxiety and stress content
4. Connect to personality maxing domain (proactive mental health)

---

### 5. Workplace & Leadership (7 posts) 🟡

**Current State:** Developing domain with team focus.

**Published Content:**

- ✅ `enneagram-types-and-career-choices` - Career mapping
- ✅ `enneagram-leadership` - Leadership styles
- ✅ `enneagram-team-dynamics` - Team collaboration
- ✅ `enneagram-team-diversity` - Diversity benefits
- ✅ `enneagram-types-working-in-teams` - Collaboration
- ✅ `enneagram-workplace-team-building` - Team building
- ✅ `enneagram-coach-toolkit` - Professional tools

**Cross-Linking Strategy:**

```
Career Choices → Leadership Styles
↓
Team Dynamics ←→ Team Diversity ←→ Working in Teams
↓
Workplace Team Building
↓
Coach Toolkit (professional application)
↓
Link to: Communication Guides, Conflict Resolution
```

**Gap Analysis:**

- ❌ Missing: Remote work by type
- ❌ Missing: Salary negotiation by type
- ❌ Missing: Interview strategies by type
- ❌ Missing: Productivity systems (overlap with personality maxing)

**Priority Actions:**

1. Create "Remote Work Success by Type"
2. Create "Interview Strategies by Type"
3. Cross-link leadership with type profiles (famous leaders)
4. Connect to communication guides

---

### 6. Social Dynamics & Communication (11 posts) 🟢

**Current State:** Strong domain with practical content.

**Published Content:**

- ✅ `first-impression-enneagram-playbook` - Body language
- ✅ `first-impression-cheat-sheet` - Quick reference
- ✅ `enneagram-types-at-party` - Social scenarios
- ✅ `enneagram-party-planner` - Event planning
- ✅ `how-each-enneagram-flexes` - Recognition seeking
- ✅ `biggest-compliments-to-give-each-enneagram-type` - Influence
- ✅ `how-each-enneagram-type-manipulates` - NEW
- ✅ `toxic-traits-of-each-enneagram-type` - Shadow behavior
- ✅ Communication guides (3 posts)

**Cross-Linking Strategy:**

```
First Impressions → Compliments → Flexing (influence chain)
↓
Party Behavior ←→ Social Scenarios
↓
Manipulation ←→ Toxic Traits (shadow content)
↓
Communication Guides (practical application)
↓
Link to: Relationships, Workplace
```

**Gap Analysis:**

- ❌ Missing: Networking strategies by type
- ❌ Missing: Public speaking by type
- ❌ Missing: Charisma development by type

**Priority Actions:**

1. Create "Networking Strategies by Type"
2. Cross-link manipulation with toxic traits and red flags
3. Connect first impressions to dating content
4. Link communication guides to workplace and relationships

---

### 7. Resources & Guides (6 posts) 🟡

**Current State:** Moderate with essential resources.

**Published Content:**

- ✅ `beginners-guide-to-determining-your-enneagram-type` - Typing
- ✅ `enneagram-test-comparison-2025` - Test reviews
- ✅ `enneagram-books-websites-podcasts` - Learning resources
- ✅ `enneagram-vs-meyers-briggs` - System comparison
- ✅ `astrology-and-the-enneagram` - Integration
- ✅ `enneagram-childhood-stereotypes` - Origins

**Cross-Linking Strategy:**

```
Beginner's Guide → Test Comparison → Type Profiles
↓
Books/Podcasts (further learning)
↓
MBTI Comparison (for MBTI users finding Enneagram)
↓
Astrology Integration (broader audience)
```

**Gap Analysis:**

- ❌ Missing: Enneagram apps review
- ❌ Missing: How to study the Enneagram guide
- ❌ Missing: Certification programs overview

**Priority Actions:**

1. Cross-link beginner's guide to all type profiles
2. Add internal links from test comparison to typing resources
3. Update books/podcasts with more current resources

---

## Cross-Linking Implementation Guide

### High-Priority Cross-Links to Add

#### 1. Type Profile Links (add to each type page)

```
Each type page should link to:
- Wings guide section for their type
- Compatibility matrix (their row)
- Dating guide relevant to them
- Career choices mentioning their type
- Shadow work section for their type
- Stress patterns section
```

#### 2. Hub Page Links (create navigation hubs)

```
Enneagram Core Hub:
├── All 9 type profiles
├── Wings guide
├── Subtypes guide
├── Stress/Growth patterns
└── FAQs & Basics

Relationships Hub:
├── Compatibility matrix
├── Dating guides (men/women)
├── Communication guides
├── Conflict resolution
└── Red flags & toxic traits

Self-Development Hub:
├── Personality maxing
├── 90-day blueprint
├── Shadow work
├── Strengths/weaknesses
└── Self-sabotage patterns
```

#### 3. Contextual Cross-Links (within content)

```
When discussing... → Link to...
─────────────────────────────────
Stress patterns → Mental health flags
Dating behavior → First impressions
Team conflicts → Communication guides
Self-improvement → 90-day blueprint
Type descriptions → Celebrity examples
Relationship issues → Compatibility matrix
```

---

## Using blogIndex.ts Programmatically

### Get Related Posts for a Page

```typescript
import { getRelatedBlogs, getCrossLinkSuggestions } from '$lib/components/molecules/blogIndex';

// Get 5 related posts for current blog
const related = getRelatedBlogs('enneagram-type-1', 5);

// Get cross-linking suggestions
const { sameDomain, related } = getCrossLinkSuggestions('personality-maxing', 'personality-maxing');
```

### Get Posts by Tag for Sidebars

```typescript
import { getBlogsByTag } from '$lib/components/molecules/blogIndex';

// Get all relationship posts
const relationshipPosts = getBlogsByTag('relationships');

// Get all posts about anxiety
const anxietyPosts = getBlogsByTag('anxiety');
```

### Domain Statistics

```typescript
import { getDomainStats, getAllTags } from '$lib/components/molecules/blogIndex';

// Get counts per domain
const stats = getDomainStats();
// { 'enneagram-core': { name: 'Enneagram Core', count: 21, posts: [...] }, ... }

// Get all unique tags
const tags = getAllTags();
// ['adhd', 'anxiety', 'attachment-styles', ...]
```

---

## Next Steps

### Immediate (This Week)

1. ✅ Blog index TypeScript file created
2. [ ] Add cross-links to 5 highest-traffic pages
3. [ ] Create relationship hub page
4. [ ] Update type profiles with wing links

### Short-Term (Next 2 Weeks)

1. [ ] Implement related posts component using blogIndex
2. [ ] Add "Read Next" sections to all blog posts
3. [ ] Create self-development hub page
4. [ ] Fill top 3 content gaps identified

### Medium-Term (This Month)

1. [ ] Comprehensive cross-linking audit
2. [ ] Create remaining hub pages
3. [ ] Implement automatic related posts
4. [ ] Track internal link performance

---

## Content Gap Priority Matrix

| Gap                         | Domain        | SEO Value | Effort | Priority    |
| --------------------------- | ------------- | --------- | ------ | ----------- |
| 27 Subtypes Guide           | Core          | High      | Medium | 🔴 Critical |
| Morning Routines by Type    | Personality   | Medium    | Low    | 🟡 High     |
| Friendship Dynamics         | Relationships | High      | Medium | 🟡 High     |
| Remote Work by Type         | Workplace     | Medium    | Low    | 🟡 High     |
| Networking Strategies       | Social        | Medium    | Low    | 🟡 High     |
| Burnout by Type             | Mental Health | High      | Medium | 🟡 High     |
| Conflict Resolution Scripts | Relationships | High      | High   | 🟢 Medium   |
| Levels of Development       | Core          | Medium    | Medium | 🟢 Medium   |

---

_This document should be updated whenever new blog posts are added or cross-linking strategy changes._
