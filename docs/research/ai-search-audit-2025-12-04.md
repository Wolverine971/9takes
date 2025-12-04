<!-- docs/research/ai-search-audit-2025-12-04.md -->

# AI Search Audit - December 4, 2025

_Created: 2025-12-03 (Pre-launch prep)_
_Purpose: Track 9takes visibility in AI search platforms and identify optimization opportunities_

---

## Executive Summary

**Current Status:** 9takes appears in Google Search results for key mental health + Enneagram queries. The site's comprehensive content is being picked up, but there are opportunities to optimize for AI citation formats.

**Key Finding:** 9takes ranks #1 for "enneagram mental health" and "enneagram mental illness" queries - this authority should extend to related topics.

---

## Query Testing Results

### Query 1: "What enneagram type is most prone to anxiety?"

**Google Search Results:**
| Position | Source | Type |
|----------|--------|------|
| 1 | **9takes.com** ✅ | Blog post |
| 2 | Rel Consultants | Blog post |
| 3 | Psychology Junkie | Ranked list |
| 4 | FHE Health | Clinical |
| 5 | enneagramtest.com | Blog post |

**AI Response Key Points (from search synthesis):**

- Type 6 (The Loyalist) is most prone to anxiety
- Sixes have overactive minds, focus on past/future
- Core fear is abandonment and rejection
- Important caveat: Enneagram is not a diagnostic tool

**9takes Citation:** ✅ **Yes - Appears in Position 1**

**Optimization Opportunity:**

- Content currently ranks well
- Could add "Quick Answer" box format for featured snippets
- Ensure Type 6 anxiety content has direct, citable statements

---

### Query 2: "Enneagram type most likely to have depression"

**Google Search Results:**
| Position | Source | Type |
|----------|--------|------|
| 1 | **9takes.com** ✅ | Blog post |
| 2 | FHE Health | Clinical |
| 3-4 | PersonalityCafe | Forum |
| 5 | enneagramtest.com | Blog post |
| 6 | Symmetry Neurotherapy | Medical |

**AI Response Key Points:**

- Types 2, 4, and 9 most prone to depression
- Type 4 most frequently associated with depression
- "Fours likely know depression better than any other number"
- All types can experience depression

**9takes Citation:** ✅ **Yes - Appears in Position 1**

**Optimization Opportunity:**

- Already ranking #1
- Could create dedicated "Depression Patterns by Enneagram Type" content (if not existing)
- Add structured data for FAQ format

---

### Query 3: "Why am I so critical of myself enneagram"

**Google Search Results:**
| Position | Source | Type |
|----------|--------|------|
| 1 | Medium (Samantha Mackay) | Personal blog |
| 2 | Nine Types Co | Business blog |
| 3 | Truity | Major competitor |
| 4 | Enneagram Institute | Authority |
| 5 | PersonalityCafe | Forum |

**AI Response Key Points:**

- Inner critic exists in ALL types (not just Type 1)
- Types 1, 3, 4, 9 most prone to excessive self-criticism
- Type 1 has loudest inner critic
- Inner critic is protective mechanism from childhood

**9takes Citation:** ❌ **No - Not appearing**

**Gap Identified:**

- 9takes NOT ranking for self-criticism/inner critic queries
- Competitors (Truity, Medium, Nine Types Co) winning
- **Action Required:** Create content targeting "inner critic enneagram" / "self-criticism personality type"

---

## AI Citation Format Analysis

### What Gets Cited

Based on analysis of AI-synthesized responses, the following content formats get cited:

| Format                             | Citation Rate | Example                              |
| ---------------------------------- | ------------- | ------------------------------------ |
| Direct answer in first 2 sentences | HIGH          | "Type 6 is most prone to anxiety"    |
| Bulleted lists                     | HIGH          | "Common patterns include: ..."       |
| Comparison tables                  | MEDIUM        | Type-by-type breakdowns              |
| FAQ format with Q&A                | MEDIUM        | Schema markup helps                  |
| Long-form narrative                | LOW           | Gets summarized, not directly quoted |

### What 9takes Does Well

- ✅ Comprehensive coverage of topics
- ✅ Psychological depth (root causes, not just behaviors)
- ✅ Type-by-type breakdowns
- ✅ Mental health authority

### What 9takes Needs

- ❌ "Quick Answer" boxes at top of content
- ❌ More direct, citable statements (less hedging)
- ❌ Structured FAQ sections with schema markup
- ❌ Comparison tables for easy synthesis

---

## Content Gaps for AI Optimization

### High Priority (Not Ranking, High Search Volume)

| Query                      | Current Ranking  | Action                     |
| -------------------------- | ---------------- | -------------------------- |
| "enneagram inner critic"   | Not ranking      | Create content             |
| "enneagram self-criticism" | Not ranking      | Create content             |
| "enneagram ADHD"           | Not ranking well | Create comprehensive guide |
| "enneagram self-sabotage"  | Not ranking      | Create content             |
| "enneagram overthinking"   | Not ranking      | Create content             |

### Medium Priority (Ranking but CTR opportunity)

| Query                    | Current Position | Action               |
| ------------------------ | ---------------- | -------------------- |
| "enneagram anxiety"      | Page 1           | Add Quick Answer box |
| "enneagram depression"   | Page 1           | Add FAQ schema       |
| "toxic enneagram traits" | Page 1           | Add comparison table |

---

## Recommended AI Optimization Strategy

### 1. Quick Answer Box Format

Add to top of every key content piece:

```markdown
<div class="quick-answer">

**Quick Answer:** [Direct 2-sentence answer that AI can cite]

</div>
```

### 2. Structured FAQ Sections

Every post should have:

- 5 real search queries as questions
- First sentence directly answers the question
- JSON-LD FAQPage schema markup

### 3. Remove Hedging Language

**Before:** "Some Type 6s might experience anxiety..."
**After:** "Type 6 experiences anxiety more than any other type."

**Before:** "It's possible that Type 4s could be prone to depression..."
**After:** "Type 4 is the most depression-prone Enneagram type."

### 4. Add Comparison Tables

| Type | Most Common Issue | Root Cause          | Key Sign         |
| ---- | ----------------- | ------------------- | ---------------- |
| 1    | OCD/Perfectionism | Inner critic        | Never satisfied  |
| 2    | Codependency      | Earning love        | Martyrdom        |
| 3    | Workaholism       | Achievement = worth | Image management |
| ...  | ...               | ...                 | ...              |

### 5. Entity Optimization

Mention related topics/entities:

- Psychology terms (attachment styles, childhood wounds, trauma responses)
- Related frameworks (MBTI, Big Five, attachment theory)
- Expert names where credible
- Research references

---

## AI Platform Status Summary

| Platform           | 9takes Present | Notes                              |
| ------------------ | -------------- | ---------------------------------- |
| Google Search      | ✅ Yes         | #1 for mental health queries       |
| Google AI Overview | 🔶 Partial     | Appears when mental health related |
| Perplexity         | ⏳ TBD         | Needs direct testing               |
| ChatGPT            | ⏳ TBD         | Needs direct testing               |

---

## Action Items

### This Week

1. [x] Audit complete (this document)
2. [ ] Add Quick Answer boxes to top 10 pages
3. [ ] Add FAQ schema to mental health content
4. [ ] Remove hedging language from top performers

### This Month

5. [ ] Create "Inner Critic by Enneagram Type" content
6. [ ] Create "ADHD and Enneagram" comprehensive guide
7. [ ] Create "Self-Sabotage by Enneagram Type" content
8. [ ] Create "Overthinking by Enneagram Type" content

### Ongoing

9. [ ] Test AI platforms weekly for 9takes mentions
10. [ ] Track which content formats get cited
11. [ ] Monitor competitor AI citations

---

## Tracking Template (Weekly)

```markdown
## Week of [DATE]

### Queries Tested

1. "[query]" - 9takes cited? Y/N - Position: \_\_\_
2. "[query]" - 9takes cited? Y/N - Position: \_\_\_
3. "[query]" - 9takes cited? Y/N - Position: \_\_\_

### New Citations Found

- [Platform]: [Query]

### Competitor Movements

- [Competitor]: [Change observed]

### Actions Taken

- [What was optimized]
```

---

_Next: Begin content creation for identified gaps_
_Priority: ADHD content (forum-dominated = opportunity)_
