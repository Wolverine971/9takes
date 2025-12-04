<!-- docs/content-generation/ITERATIVE_REVIEW_PROCESS.md -->

# Iterative Review Process for Mental Health Blog System

## Overview

This document outlines the iterative review process for mental health blog content. The process is designed to:

- Enable async collaboration between content creators and AI assistants
- Track multiple review iterations with clear timestamps
- Ensure content quality and alignment with goals
- Maintain synchronization between review notes and actual content

## Review File Structure

Each blog should have a corresponding `.review.md` file that tracks the entire review history.

### File Naming Convention

```
blog-name.md          # Main blog post
blog-name.review.md   # Review tracking file
```

## Review File Template

```markdown
# Review Tracking: [Blog Title]

## Blog Information

- **Blog File:** blog-name.md
- **Created:** [Date]
- **Last Updated:** [Date]
- **Current Status:** [Draft/In Review/Final]
- **Sync Status:** [In Sync/Out of Sync - describe changes needed]

---

## Round 1: [YYYY-MM-DDTHH:MM:SSZ] - Initial Draft Review

**Reviewer:** [Human/AI]

### Content Completeness Check

1. **Does the blog have a clear introduction that hooks the reader?**
   - [ ] Yes [ ] No [ ] Needs improvement
   - **Response:** [User input]
   - **Action:** [What needs to be done]

2. **Are all 9 Enneagram types covered with equal depth?**
   - [ ] Yes [ ] No [ ] Some missing/uneven
   - **Response:** [User input]
   - **Action:** [What needs to be done]

3. **Is there a clear call-to-action at the end?**
   - [ ] Yes [ ] No [ ] Needs refinement
   - **Response:** [User input]
   - **Action:** [What needs to be done]

### Technical Quality

1. **Are there any factual errors about the Enneagram?**
   - **Issues Found:** [List any]
   - **Response:** [User input]

2. **Is the mental health advice accurate and helpful?**
   - **Concerns:** [List any]
   - **Response:** [User input]

### User Responses

#### Response to Content Completeness Check

**Question 1 Response:** [User input here]
**Question 2 Response:** [User input here]
**Question 3 Response:** [User input here]

#### Response to Technical Quality

**Factual Errors Response:** [User input here]
**Mental Health Advice Response:** [User input here]

### My Comments

[Additional user comments not covered in questions above]

### Action Items for Next Iteration

1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

---

## Round 2: [YYYY-MM-DDTHH:MM:SSZ] - Audience Alignment Review [COMPLETED]

**Reviewer:** [Human/AI]

### Primary Audience Alignment

1. **Does the content speak directly to the primary audience's pain points?**
   - **Pain points addressed:** [List]
   - **Missing pain points:** [List]
   - **Response:** [User input]

2. **Is the language appropriate for the target demographic?**
   - [ ] Too technical [ ] Just right [ ] Too simple
   - **Response:** [User input]

3. **Are the examples relatable to the target audience?**
   - **Strong examples:** [List]
   - **Weak examples:** [List]
   - **Response:** [User input]

### Secondary Audience Consideration

1. **How well does the content serve secondary audiences?**
   - **Response:** [User input]

### User Feedback

**Audience targeting thoughts:**
[Space for open-ended feedback]

### Action Items for Next Iteration

1. [Action item 1]
2. [Action item 2]

---

## Iteration 3: Platform Optimization Review

**Date:** [YYYY-MM-DD HH:MM]
**Reviewer:** [Human/AI]

### Social Media Content Review

1. **Twitter Content Assessment**
   - **Thread quality (1-10):** [Score]
   - **Standalone tweets engaging?** [ ] Yes [ ] No
   - **Response:** [User input]

2. **Instagram Content Assessment**
   - **Visual concepts clear?** [ ] Yes [ ] No
   - **Captions compelling?** [ ] Yes [ ] No
   - **Response:** [User input]

3. **Reddit Strategy Assessment**
   - **Target subreddits appropriate?** [ ] Yes [ ] No
   - **Content templates effective?** [ ] Yes [ ] No
   - **Response:** [User input]

### Cross-Platform Consistency

1. **Is the core message consistent across platforms?**
   - **Response:** [User input]

### User Feedback

**Platform optimization thoughts:**
[Space for open-ended feedback]

### Action Items for Next Iteration

1. [Action item 1]
2. [Action item 2]

---

## Iteration 4: Final Quality Review

**Date:** [YYYY-MM-DD HH:MM]
**Reviewer:** [Human/AI]

### Overall Quality Assessment

1. **Content Impact (1-10):** [Score]
   - **Rationale:** [Explanation]

2. **SEO Optimization (1-10):** [Score]
   - **Keywords properly integrated?** [ ] Yes [ ] No
   - **Meta description compelling?** [ ] Yes [ ] No

3. **Brand Alignment (1-10):** [Score]
   - **Matches 9takes voice?** [ ] Yes [ ] No
   - **Supports platform goals?** [ ] Yes [ ] No

### Final Checklist

- [ ] All typos and grammar issues fixed
- [ ] All links tested and working
- [ ] Images have alt text
- [ ] Meta file complete and accurate
- [ ] Social media files ready
- [ ] Reddit strategy documented

### User Decision

**Ready to publish?** [ ] Yes [ ] No [ ] Needs minor fixes

### Final Notes

[Any last thoughts or future considerations]

---

## Post-Publication Notes

**Published Date:** [Date]
**Initial Performance:** [Notes after 1 week]
**Lessons Learned:** [What worked, what didn't]
```

## How to Use This Process

### For Content Creators

1. **Start a Review:** Create a `.review.md` file when you complete the first draft
2. **Complete Each Section:** Answer all questions honestly and thoroughly
3. **Track Actions:** List specific action items after each iteration
4. **Update Sync Status:** Note when the review file and actual content diverge
5. **Close the Loop:** Mark rounds as [COMPLETED] when finished
6. **Add Comments:** Use "My Comments" section for additional feedback
7. **Track in Meta:** Update blog's meta.json with review round information

### For AI Assistants

1. **Read the Review File First:** Understand the current state and history
2. **Check Sync Status:** Verify if previous recommendations were implemented
3. **Check Round Status:** Look for [COMPLETED] tags to see finished rounds
4. **Provide Specific Feedback:** Reference exact sections and suggest concrete improvements
5. **Update the Review:** Add your iteration with ISO 8601 timestamp
6. **Create Action Items:** List clear, actionable next steps
7. **Update Meta File:** Sync review tracking data to meta.json

## Best Practices

### Timing

- Allow at least 4-6 hours between iterations for reflection
- Complete all iterations within 1 week to maintain momentum
- Don't skip iterations even if content seems ready

### Communication

- Be specific about what works and what doesn't
- Use examples from the actual content
- Reference successful blogs as models
- Keep feedback constructive and actionable

### Synchronization

- Update the review file immediately after making changes
- Note any changes made outside the review process
- Keep version history if major rewrites occur

## Review States

### Draft

- Initial content complete
- Ready for first review
- Major changes expected

### In Review

- Active iteration process
- Multiple rounds of feedback
- Incremental improvements
- Rounds marked [COMPLETED] when done

### Final

- All iterations complete
- All rounds marked [COMPLETED]
- Ready for publication
- Only minor fixes needed

### Published

- Content is live
- Post-publication metrics tracked
- Future improvements noted

## Round Management

### Round Header Format

```
## Round [Number]: [ISO 8601 DateTime] - [Topic] [STATUS]
```

Example:

```
## Round 1: 2025-01-20T10:00:00Z - Initial Content Review
## Round 2: 2025-01-21T14:30:00Z - Audience Alignment Review [COMPLETED]
```

### Round Status Tags

- No tag: Round is active/in progress
- `[COMPLETED]`: Round is finished, all questions answered
- `[SKIPPED]`: Round was skipped with explanation

### User Response Sections

Each round should include:

1. **Questions:** Structured review questions
2. **User Responses:** Dedicated section for answers
3. **My Comments:** Open section for additional feedback
4. **Action Items:** Next steps based on feedback

## Common Issues and Solutions

### Issue: Review Feedback Not Implemented

**Solution:** Create a "Deviation Log" section explaining why certain feedback wasn't incorporated

### Issue: Scope Creep During Reviews

**Solution:** Reference original goals in meta file, defer new ideas to future content

### Issue: Conflicting Feedback

**Solution:** Document both perspectives, make decision based on primary audience needs

### Issue: Review Process Taking Too Long

**Solution:** Set strict 48-hour deadline per iteration, move forward with "good enough"

## Integration with Content Calendar

- Schedule review iterations in content calendar
- Block time for both creation and review
- Plan publication date after expected iterations
- Build in buffer time for unexpected revisions

## Metrics for Review Success

Track these metrics to improve the review process:

- Number of iterations needed (target: 3-4)
- Time per iteration (target: 30-60 minutes)
- Action items completed rate (target: 90%+)
- Post-publication performance vs. reviewed content
- Creator satisfaction with process
- Rounds completed vs. started (target: 100%)
- Average time to complete round (target: 24-48 hours)

## Meta File Integration

The blog's meta.json file should include review tracking:

```json
"reviewTracking": {
  "rounds": [
    {
      "roundNumber": 1,
      "datetime": "2025-01-20T10:00:00Z",
      "topic": "Initial Content Review",
      "status": "completed",
      "reviewer": "human"
    }
  ],
  "lastReviewDate": "2025-01-20T10:00:00Z",
  "nextReviewScheduled": null
}
```

## Future Enhancements

As the process matures, consider:

- Automated sync checking between files
- Review templates for specific content types
- Peer review integration
- A/B testing different review approaches
- Machine learning from successful reviews
