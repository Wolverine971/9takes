<!-- docs/domain-authority/00-master-index.md -->

# Domain Authority Master Index

_Last Modified: 2025-12-04_

## Executive Summary

### Current Content Inventory (FRESH AUDIT 2025-12-04):

- **Total Enneagram Blog Posts:** 75 published posts (indexed in `blogIndex.ts`)
- **Celebrity Analyses:** 284+ in database (largest online!)
- **Mental Health Suite:** 8 main posts + 10 comprehensive guides in subdirectory
- **New Content Since Last Audit:** manipulation tactics, self-sabotage, overthinking guides

### 📊 NEW: Programmatic Blog Index

A new TypeScript blog index has been created at `src/lib/components/molecules/blogIndex.ts` providing:

- Structured categorization of all 75 blog posts by domain
- Cross-linking utilities (`getRelatedBlogs`, `getCrossLinkSuggestions`)
- Tag-based filtering for related content
- Domain statistics for gap analysis

**See:** [Blog Index Integration Guide](./blog-index-integration.md)

### Content Funnel Analysis

**What this is:** Content falls into three funnel stages based on where the reader is in their journey. Content that doesn't match the reader's stage will underperform—even if it's good.

> **Framework source:** [`/docs/viral-coach-framework-reference.md`](../viral-coach-framework-reference.md) — Full explanations of Content Funnel, Trust Onion, and EEO Continuum.

**Current content distribution by funnel stage:**

| Funnel Stage         | Current % | Target % | Status  | Action Needed                     |
| -------------------- | --------- | -------- | ------- | --------------------------------- |
| **Top of Funnel**    | ~20%      | 50%      | 🔴 Gap  | Need more "circumstances" content |
| **Middle of Funnel** | ~60%      | 35%      | 🟡 Over | Solid foundation                  |
| **Bottom of Funnel** | ~20%      | 15%      | 🟢 OK   | Slightly reduce CTAs              |

**Top of Funnel Content Gaps (Priority):**

- Content that validates EXTERNAL struggles (Trust Onion "Outer Layer")
- "Why dating apps/algorithms/economy affects your type"
- Quick wins that don't require self-reflection yet
- Observation-voice content (EEO Continuum), not Expert voice

**The Fix:** Every week, create at least 2 pieces of "circumstances layer" content that meets new readers where they are.

### Domain Authority Status (7 Content Domains):

| Domain                | Posts | %   | Status        | Trend                      |
| --------------------- | ----- | --- | ------------- | -------------------------- |
| 1. Enneagram Core     | 21    | 28% | 🟢 Strong     | ✅ Complete foundation     |
| 2. Relationships      | 13    | 17% | 🟢 Strong     | ↑ Recently expanded        |
| 3. Social Dynamics    | 11    | 15% | 🟢 Strong     | ↑ New manipulation content |
| 4. Personality Maxing | 10    | 13% | 🟡 Growing    | ↑ Self-sabotage added      |
| 5. Mental Health      | 8     | 11% | 🟡 Moderate   | ↑ Overthinking added       |
| 6. Workplace          | 7     | 9%  | 🟡 Developing | → Needs expansion          |
| 7. Resources          | 6     | 8%  | 🟡 Moderate   | → Stable                   |

### Recent Additions (Dec 2025):

- ✅ `how-each-enneagram-type-manipulates` (Social Dynamics)
- ✅ `how-each-enneagram-type-self-sabotages-success` (Personality Maxing)
- ✅ `why-you-cant-stop-overthinking-enneagram` (Mental Health)
- ✅ `attachment-styles-and-enneagram-types` updated (Relationships)

### Expansion Opportunities (Future Domains):

10. **🔴 Parenting & Family** - Completely untapped
11. **🔴 Learning & Education** - No dedicated content
12. **🔴 Creativity & Arts** - Virgin territory
13. **🔴 Health & Fitness** - High potential
14. **🔴 Financial & Money Psychology** - Unexplored

---

## Domain Authority Breakdown

### 🎯 Primary Domains (Your Core)

#### 1. [Enneagram Core Knowledge](./01-enneagram-core.md) — 21 posts 🟢

- **Status:** 🟢 Strong Foundation
- **Strengths:** All 9 type profiles complete, wings guide, subtypes, stress patterns
- **Recent:** Wings complete guide, instinctual subtypes, religion perspectives
- **Gaps:** 27 subtypes (in draft), levels of development
- **Priority:** Complete 27 subtypes guide, add levels of development

#### 2. [Personality Maxing & Self-Optimization](./02-personality-maxing.md) — 10 posts 🟡

- **Status:** 🟡 Growing (up from 8 posts!)
- **Strengths:** Unique positioning, 90-day blueprint, shadow work complete
- **Recent:** ✅ Self-sabotage guide added Dec 2025
- **Gaps:** Morning routines, productivity systems, habit formation
- **Priority:** Create morning routines and productivity guides by type

#### 3. [Relationship Conflict & Communication](./03-relationship-conflict.md) — 13 posts 🟢

- **Status:** 🟢 Strong (up from 6 posts!)
- **Strengths:** ✅ Compatibility matrix complete, ✅ Love languages complete, ✅ Attachment styles complete
- **Recent:** Attachment styles updated, apology guide, toxic traits warnings
- **Gaps:** Friendship dynamics, conflict resolution scripts, family content
- **Priority:** Create friendship dynamics guide and conflict scripts

### 🚀 Growth Domains (High Potential)

#### 4. [Mental Health & Wellness](./04-mental-health-wellness.md) — 8 main + 10 guides 🟡

- **Status:** 🟡 Moderate (8 main posts + comprehensive `/mental-health/` subdirectory)
- **Strengths:** ✅ Depression guide complete, ✅ ADHD guide complete, ✅ Anxiety guide complete
- **Recent:** ✅ Overthinking guide added Dec 2025
- **Gaps:** Burnout by type, sleep issues, grief processing
- **Priority:** Create burnout guide, cross-link main posts with subdirectory guides

#### 5. [Workplace & Leadership](./05-workplace-leadership.md) — 7 posts 🟡

- **Status:** 🟡 Developing (needs expansion)
- **Strengths:** ✅ Leadership guide complete, good team dynamics coverage
- **Recent:** Career choices updated, team dynamics enhanced
- **Gaps:** Remote work by type, interview strategies, salary negotiation
- **Priority:** Create remote work success guide and interview strategies

#### 6. [Social Dynamics & Interpersonal](./06-social-dynamics.md) — 11 posts 🟢

- **Status:** 🟢 Strong
- **Strengths:** Excellent first impression content, communication guides complete
- **Recent:** ✅ Manipulation tactics guide added Dec 2025
- **Gaps:** Networking strategies, public speaking, charisma development
- **Priority:** Create networking strategies guide, link manipulation with toxic traits

### 🎯 Current Domains

#### 7. [Pop Culture & Celebrities](./07-pop-culture-celebrities.md)

- **Status:** 🟢 DOMINANT - 284 analyses in Supabase database
- **Achievement:** Largest celebrity personality database online
- **Strategy:** Gateway content driving traffic to practical guides
- **Monetization:** Celebrity type database subscription

#### 8. [Community & Platform](./08-community-engagement.md)

- **Status:** 🟡 Developing - 25 posts + Q&A platform
- **Unique:** Give-first commenting system with personality context
- **Priority:** Activate platform features for differentiation
- **Potential:** Network effects and user-generated content

#### 9. [Practical Guides](./09-guides-resources.md)

- **Status:** 🟡 Moderate - 18 comprehensive guides
- **Gaps:** Need how-to guides for relationships and optimization
- **Priority:** Create 20+ practical guides this month
- **Value:** High conversion and authority building

### 🌟 Expansion Domains (Future Growth)

#### 10. Parenting & Family Dynamics

- **Opportunity:** Huge untapped market
- **Content Needs:** Parent types, child development, family systems
- **Monetization:** Parenting courses, family workshops

#### 11. Learning & Education

- **Opportunity:** Academic and student market
- **Content Needs:** Study methods by type, learning styles, academic success
- **Monetization:** Student guides, educator resources

#### 12. Creativity & Artistic Expression

- **Opportunity:** Creative professional market
- **Content Needs:** Creative process by type, artistic styles, creative blocks
- **Monetization:** Creative coaching, artist resources

#### 13. Health & Fitness Optimization

- **Opportunity:** Wellness market integration
- **Content Needs:** Exercise by type, nutrition, sleep, habits
- **Monetization:** Fitness programs, wellness coaching

---

## Content Gap Analysis Summary (UPDATED 2025-12-04)

### 🔴 TOP PRIORITY: Trust Onion "Outer Layer" Content

**What this is:** The Trust Onion framework identifies three layers of blame. New readers are at the "Outer Layer" (blaming circumstances). Content must meet them there before asking for self-reflection.

> **Framework source:** [`/docs/viral-coach-framework-reference.md`](../viral-coach-framework-reference.md#2-trust-onion-framework-🧅)

**The strategic gap:** Most 9takes content skips to the Inner Layer (self-responsibility). New readers blame EXTERNAL factors. Meet them there first.

**Create these "Circumstances Layer" posts:**

1. "Why dating apps are harder for certain personality types"
2. "The algorithm is designed to exploit your type (here's how)"
3. "5 workplace policies that secretly favor certain types"
4. "Why modern hustle culture burns out Type 2s and 9s first"
5. "The economy is harder on some types than others"
6. "Social media was designed by 7s for 7s (here's why you're exhausted)"
7. "Remote work vs office: Which types are getting screwed"
8. "Why therapy doesn't work the same for every type"
9. "The education system failed these 3 types worst"
10. "Dating in 2025 vs 2015: How it changed for each type"

**Why this matters:** These posts validate external struggles FIRST, then bridge to type-specific insights. This is how you build trust with new readers before asking for self-reflection.

### 🔴 Critical Gaps (From Previous Audit)

1. **Relationship Content Suite** - Only 6 posts (1.7% of content!)
   - Dating dynamics by type
   - Conflict resolution scripts
   - Healthy boundaries guide
   - Apology frameworks
2. **Personality Optimization Content** - Only 8 posts (2.3% of content!)
   - Habit formation by type
   - Morning routines
   - Productivity systems
   - Goal setting frameworks
3. **27 Enneagram Subtypes** - Major gap (outline ready in drafts)
4. **Leadership Styles by Type** - Professional authority gap
5. **Career Pivot Guide** - High-demand professional content

### ✅ Previously Critical - NOW COMPLETE

- ✅ **Enneagram Wings Guide** - DONE
- ✅ **Enneagram Compatibility Matrix** - DONE
- ✅ **Depression by Type** - DONE
- ✅ **90-Day Transformation Program** - DONE
- ✅ **Shadow Work Guide** - DONE
- ✅ **Attachment Styles Integration** - DONE
- ✅ **Love Languages Integration** - DONE
- ✅ **Enneagram Tests Comparison** - DONE

### 🟡 Important Gaps (Short-term)

1. **Friendship Dynamics** - Social relationship gap
2. **Networking Strategies by Type** - Professional networking
3. **Social Anxiety by Type** - Mental health expansion
4. **ADHD and Enneagram** - Neurodivergence expansion
5. **Remote Work Dynamics** - Modern workplace need

### 🟢 Strategic Opportunities (Medium-term)

1. **Parenting by Type** - Completely untapped vertical
2. **Learning Styles by Type** - Education market
3. **Creative Process by Type** - Artist/creator market
4. **Health & Fitness by Type** - Wellness integration
5. **Financial Habits by Type** - Money mindset content

---

## Master Priority List (UPDATED 2025-12-04)

### Week 1 (Immediate - THIS WEEK)

1. ⬜ **TOP PRIORITY:** Create 3+ Trust Onion "Outer Layer" posts (Top of Funnel)
   - "Why dating apps are harder for certain types"
   - "The algorithm is designed to exploit your type"
   - "Why therapy doesn't work the same for every type"
2. ⬜ **CRITICAL:** Create 5+ Relationship Content pieces (1.7% → 5% of content)
   - Dating dynamics by type
   - Conflict resolution scripts
   - Complete Active Listening guide (outline ready)
3. ⬜ **CRITICAL:** Create 5+ Personality Optimization pieces (2.3% → 5% of content)
   - Productivity systems by type
   - Morning routines by type
   - Complete Positive Self-Talk guide (outline ready)
4. ⬜ **HIGH:** Complete 27 Subtypes Guide (outline ready in drafts)
5. ⬜ **Continue:** Twitter strategy execution (with Viral Coach frameworks)

### Week 2-3 (Short-term)

6. ⬜ **Create:** Friendship Dynamics Guide
7. ⬜ **Create:** Career Pivot by Type
8. ⬜ **Create:** Social Anxiety by Type
9. ⬜ **Finish:** High Achievers Playbook (draft exists)
10. ⬜ **Create:** Networking Strategies by Type

### Month 2 (Medium-term)

11. ⬜ **Launch:** Parenting by Type vertical (huge opportunity)
12. ⬜ **Create:** ADHD and Enneagram expansion
13. ⬜ **Create:** Learning Styles by Type
14. ⬜ **Build:** Interactive Assessment Tools
15. ⬜ **Create:** Financial Habits by Type

---

## SEO Opportunity Matrix

### Highest Volume Opportunities

| Keyword                 | Volume/mo | Current Coverage | Priority       |
| ----------------------- | --------- | ---------------- | -------------- |
| enneagram test          | 246,000   | None             | 🔴 Critical    |
| shadow work             | 74,000    | Minimal          | 🔴 Critical    |
| love languages          | 301,000   | None             | 🟡 Integration |
| attachment styles       | 60,500    | None             | 🟡 Integration |
| enneagram wings         | 22,200    | None             | 🔴 Critical    |
| enneagram compatibility | 18,100    | Partial          | 🔴 Critical    |

---

## Monetization Roadmap

### Digital Products Pipeline

1. **Q1 2025:** 90-Day Personality Maxing Program ($197)
2. **Q1 2025:** Compatibility Report Generator ($27/report)
3. **Q2 2025:** Shadow Work Workbook ($37)
4. **Q2 2025:** Leadership Development Course ($297)
5. **Q3 2025:** Parenting by Type Guide ($67)

### Service Opportunities

- Corporate workshops ($2,500-5,000)
- Couples coaching ($150/session)
- Team assessments ($97/team)
- Speaking engagements ($5,000+)

### Projected Annual Revenue

- **Year 1:** $150-250k
- **Year 2:** $300-500k
- **Year 3:** $500k-1M

---

## Success Metrics & Targets

### 6-Month Targets

- **Total Posts:** 100+ comprehensive guides
- **Monthly Traffic:** 500k+ organic visitors
- **Email List:** 10,000+ subscribers
- **Domain Authority:** 50+ DA
- **Revenue:** $10-20k/month

### Key Performance Indicators

1. **Content:** 2-3 new authority posts/week
2. **SEO:** Page 1 rankings for 50+ target keywords
3. **Engagement:** 5% email open rate improvement
4. **Revenue:** 20% month-over-month growth
5. **Authority:** 3+ high-quality backlinks/month

---

## Competitive Advantages

### What Makes 9takes Unique:

1. **Only site** combining Enneagram depth with practical optimization
2. **Most comprehensive** mental health suite by personality type
3. **Real user data** from Q&A platform validates insights
4. **Modern voice** without losing psychological complexity
5. **Actionable frameworks** not just theory
6. **Type-specific everything** vs generic advice

---

## Content Creation Best Practices

### The 9takes Content Formula

1. **Emotional Hook Opening**
   - Start with `<p class="firstLetter">` for visual impact
   - Lead with relatable problem or controversial statement
   - Promise clear value within first 150 words

2. **Invisible Structure (McPhee Method)**
   - Choose structure based on content type
   - Make transitions seamless
   - Build tension and resolution
   - Every section advances the narrative

3. **Psychological Depth**
   - Connect adult behaviors to childhood patterns
   - Explain the "why" behind behaviors
   - Provide type-specific insights
   - Include growth edges for each type

4. **Practical Application**
   - Scripts and exact language to use
   - Step-by-step action plans
   - Type-specific strategies
   - Real-world examples

5. **Engagement Elements**
   - PopCard components for interaction
   - Tables/lists every 300-400 words
   - Question-based H2 headers
   - Clear CTAs throughout

### Quality Checklist

Before publishing any content:

- [ ] Follows `/docs/writing-system/01-content-creation-workflow.md`
- [ ] Includes proper frontmatter and JSON-LD
- [ ] 2,500-3,500 words optimal length
- [ ] 3-5 internal links to related content
- [ ] PopCard components correctly implemented
- [ ] Two-pass editing completed
- [ ] SEO optimization verified
- [ ] Mobile formatting checked

## Next Steps for Total Dominance (REVISED STRATEGY)

### Phase 1: Balance Content Portfolio (Weeks 1-2)

- **URGENT:** Fix relationship content gap (1.7% → 5% minimum)
- **URGENT:** Expand personality optimization (2.3% → 5% minimum)
- **Continue:** Leverage pop culture dominance for traffic
- **Execute:** Twitter Phase 1 + Reddit value strategy

### Phase 2: Fill Domain Gaps (Weeks 3-4)

- Complete 27 Subtypes guide from outline
- Launch leadership content series
- Add career and workplace guides
- Build friendship and social content

### Phase 3: New Verticals (Month 2)

- Launch parenting vertical (massive untapped market)
- Create learning/education content
- Add health & fitness integration
- Develop financial wellness content

---

## Resource Requirements

### Content Creation System

**📝 CRITICAL: All blog content must follow the established writing system:**

#### Primary Resources

- **Main Workflow:** `/docs/writing-system/01-content-creation-workflow.md`
  - Complete 6-phase content creation process
  - Planning templates and structure options
  - Two-pass editing system
  - Quality standards and checklists

#### Supporting Documentation

- `/docs/writing-system/02-blog-optimization-framework.md` - SEO and optimization
- `/docs/writing-system/03-mcphee-editing-method.md` - Professional editing
- `/docs/writing-system/04-content-patterns-library.md` - Content examples

#### Content Requirements

- **Blog Posts Needed:** 50-60 new pieces
- **Time Investment:** 150-200 hours
- **Writing Support:** Consider VA for research
- **Quality Standard:** All posts must follow workflow guidelines

### Technical Development

- **Interactive Tools:** 3-5 assessment tools
- **Email Courses:** 3-4 automated sequences
- **Landing Pages:** 10-15 conversion pages

### Marketing & Promotion

- **Social Media:** Daily posting system
- **Email Marketing:** Weekly newsletter
- **Partnerships:** 5-10 strategic relationships
- **PR:** 2-3 major features

---

## Risk Mitigation

### Potential Challenges:

1. **Content overwhelm** → Prioritize by ROI
2. **Quality dilution** → Maintain editorial standards
3. **Competitor copying** → Stay ahead with innovation
4. **Algorithm changes** → Diversify traffic sources
5. **Monetization pressure** → Balance free/paid content

---

## Final Recommendations (UPDATED 2025-12-04 - VIRAL COACH INTEGRATION)

### Immediate Actions (THIS WEEK):

1. **TOP PRIORITY:** Create 3+ "Trust Onion Outer Layer" posts (meet readers where they are)
2. **CRITICAL:** Create 10+ posts in relationship/optimization domains (currently <4% of content combined!)
3. **Complete:** 3 draft outlines that are ready (Active Listening, Positive Self-Talk, 27 Subtypes)
4. **Execute:** Twitter strategy with new Viral Coach frameworks (reposting, competitor research)
5. **Leverage:** Use celebrity content (71% of site) to drive traffic to new guides

### Key Insights from Content Audit + Viral Coach:

- **SURPRISE:** Pop culture content dominates (71%) - use this traffic magnet wisely
- **CRITICAL GAP:** Relationships (1.7%) and Optimization (2.3%) desperately need content
- **STRATEGIC GAP:** Most content is Middle/Bottom funnel - need more Top of Funnel
- **TRUST GAP:** Content jumps to self-responsibility - need "circumstances layer" first
- **STRENGTH:** Mental health suite is solid, Enneagram core is strong
- **OPPORTUNITY:** Parenting, education, and financial verticals completely untapped

### Strategic Frameworks Now Integrated:

> **Reference:** [`/docs/viral-coach-framework-reference.md`](../viral-coach-framework-reference.md)

1. **Content Funnel** - Tag all content as ToF/MoF/BoF (see `/docs/writing-system/README.md`)
2. **Trust Onion** - Create content for each layer, don't skip to Inner
3. **EEO Continuum** - Calibrate voice (Observation → Experience → Expert)
4. **Content Flywheel** - Every blog = 5-10 social posts + scheduled reposts
5. **Competitor Research** - Monthly analysis of "slightly ahead" accounts

### Long-term Vision:

**9takes leverages its dominant celebrity analysis database (largest online!) to become THE definitive resource for ALL personality-based life optimization, balancing viral pop culture content with deep, practical guides across relationships, career, wellness, and personal growth.**

**The new approach:** Meet people where they are (circumstances/external blame), build trust through the layers, THEN offer deep self-reflection content.

---

_This index revised 2025-12-04 with Viral Coach framework integration. Review weekly and update based on progress._
