<!-- docs/content-analysis/blog-command-analysis.md -->

# Analysis: `blog_content_creator_people.md`

**Date:** 2026-02-09
**File:** `.claude/commands/blog_content_creator_people.md`
**Length:** 1,307 lines

---

## Executive Summary

This command file has been iterated on many times and the core creative principles are strong. The main issues are structural: **~300 lines of pure duplication**, scattered information that should be co-located, a few contradictions from different editing passes, and meaningful gaps in the workflow (no image handling, no `famousTypes.ts` update step, unclear field values).

The file tries to be two things at once — a **sequential workflow** and a **reference manual** — and the interleaving of these concerns makes it harder for the AI to follow and harder for you to maintain.

---

## 1. DUPLICATION

### 1.1 Database Push Instructions (3x, ~300 lines)

The Python+JSON+curl approach is fully written out with code blocks in three places:

| Location                        | Lines     | What It Contains                                                  |
| ------------------------------- | --------- | ----------------------------------------------------------------- |
| Section 7 "Database Submission" | 647-821   | Full PATCH + POST with Python, curl, verification, error handling |
| Quick Reference section         | 1182-1293 | Nearly identical PATCH + POST code blocks                         |
| Summary item 6                  | 1139-1144 | Prose description of the same method                              |

**Recommendation:** Keep Section 7 as the authoritative version. Delete the Quick Reference section entirely — the AI reads the whole file linearly and doesn't need a "quick ref." Delete the Summary item.

### 1.2 "Pre-Approved Operations" (5x)

| Location                                   | Lines |
| ------------------------------------------ | ----- |
| Explicit list at top                       | 5-16  |
| "All database operations are pre-approved" | 206   |
| "All database operations are pre-approved" | 821   |
| "All these are pre-approved"               | 1131  |
| Summary item 1                             | 1134  |

**Recommendation:** Keep lines 5-16. Remove the other four instances. The AI processes the whole file; repeating this doesn't make it more "pre-approved."

### 1.3 Enneagram Tone Principles (3x)

| Location                                     | Lines     | Form                                     |
| -------------------------------------------- | --------- | ---------------------------------------- |
| "Enneagram Analysis Tone & Approach" section | 87-157    | Detailed creative guide (excellent)      |
| Holistic balance check items                 | 901-904   | Checklist items restating the same rules |
| Summary items 10-12                          | 1162-1177 | Prose restating the same rules           |

**Recommendation:** The core section (87-157) is the best part of this file — keep it as-is. The checklist items (901-904) are useful as a pre-flight check and worth keeping. Delete Summary items 10-12.

### 1.4 Research Source Priorities (4x)

| Location                                 | Lines                        |
| ---------------------------------------- | ---------------------------- |
| Step 3.1 "PRIMARY SOURCE PRIORITY"       | 253-262                      |
| "Research Quality" section               | 1036-1040                    |
| Summary item 12                          | 1171-1176                    |
| prep-prompt-1.md "Sources to Prioritize" | (external file, lines 69-74) |

**Recommendation:** Keep Step 3.1 as the authoritative version. Trim the Research Quality mention to a one-line reference back. Delete Summary item 12. Update prep-prompt-1.md to match (see Contradictions).

### 1.5 YouTube Transcript Recommendations (4x)

| Location                 | Lines     |
| ------------------------ | --------- |
| Step 3.4 (full section)  | 277-306   |
| Update workflow step 3   | 854       |
| Research Quality section | 1040      |
| Summary item 12          | 1173-1176 |

**Recommendation:** Step 3.4 is the authoritative version. The update workflow mention (854) is fine — it's in a different context (updates vs. new blogs). Delete the other two.

### 1.6 Environment Variable Instructions (2x)

| Location                             | Lines     |
| ------------------------------------ | --------- |
| Section 1 "Database Check and Setup" | 192-206   |
| "Environment Requirements" section   | 1116-1131 |

**Recommendation:** Keep the one in Section 1 (it's in the workflow where it's needed). Delete the standalone section.

### 1.7 The Entire Summary Section (lines 1132-1177)

All 12 items are restating things covered in detail earlier in the file. This is ~50 lines of pure redundancy. Every single item maps to an existing section:

| Summary Item                     | Already Covered In        |
| -------------------------------- | ------------------------- |
| 1. Pre-approved operations       | Lines 5-16                |
| 2. Direct database updates       | Section 7                 |
| 3. TodoWrite tracking            | Lines 19-38               |
| 4. Parallel research             | Lines 253-262             |
| 5. Clean workflow                | Lines 1096-1101           |
| 6. Python+JSON+Curl method       | Section 7 (full code)     |
| 7. Credentials security          | Lines 192-206             |
| 8. Strategic internal linking    | Section 5.5 (160 lines!)  |
| 9. Holistic content preservation | Section 8 (full workflow) |
| 10. Enneagram analysis tone      | Lines 87-157              |
| 11. Anti-repetition/anti-fatigue | Lines 159-183             |
| 12. Primary source emphasis      | Lines 253-262             |

**Recommendation:** Delete the entire Summary section.

### Total Duplication Impact

| Section to Remove                    | Lines Saved    |
| ------------------------------------ | -------------- |
| Quick Reference (1182-1307)          | ~125           |
| Summary section (1132-1177)          | ~45            |
| Environment Requirements (1116-1131) | ~15            |
| Redundant "pre-approved" reminders   | ~10            |
| **Total**                            | **~195 lines** |

---

## 2. CONTRADICTIONS

### 2.1 Source Priority Conflict (Command File vs. prep-prompt-1.md)

**Command file** (line 257):

> 1. **Podcast appearances** — Search for "[Person] podcast interview"...

**prep-prompt-1.md** (line 70):

> 1. **Recent interviews** (last 2-3 years)
> 2. **Long-form podcast appearances**

The command file clearly supersedes prep-prompt-1 (the "PRIMARY SOURCE PRIORITY" block was added later), but prep-prompt-1 was never updated. If the agent reads that file as instructed ("Follow the prep-prompt-1 template"), it gets conflicting guidance.

**Recommendation:** Update prep-prompt-1.md's "Sources to Prioritize" section to match the command file's podcast-first hierarchy. Or stop referencing prep-prompt-1 and inline the research instructions entirely (since the command file already has more detailed guidance).

### 2.2 "Execute Immediately" vs. "Confirm Before Irreversible"

**Multiple locations** (lines 5-16, 639, 821):

> Execute immediately without asking / No additional approval needed

**User Experience section** (line 1093):

> Confirm actions before irreversible operations

These directly contradict each other. The "confirm" line reads like a default principle that was never cleaned up after you added the explicit "push immediately" instructions.

**Recommendation:** Remove line 1093 or rewrite it to match: "Database pushes are pre-approved; execute when user says 'push it up.'"

### 2.3 Step 3.2 Type Determination Chicken-and-Egg

**Command file** (Step 3.2):

> Determine the person's likely Enneagram type based on research

**prep-prompt-2.md** (line 7):

> Conduct a comprehensive Enneagram analysis of {PERSON} as a Type {ENNEAGRAMTYPE}

The command says "determine the type" (output). The template says "analyze them _as_ this type" (input). In practice the agent probably figures it out during 3.1 research and confirms in 3.2, but the mismatch could cause confusion — especially if the agent reads the prep-prompt-2 template literally.

**Recommendation:** Add a brief note in Step 3.2: "Based on Step 3.1 research, determine the likely Enneagram type first. Then use that type as the input for the prep-prompt-2 analysis framework."

### 2.4 `TodoWrite` vs. Current Tool Names

The file references "TodoWrite" throughout (lines 20, 227, 830, 1100) but the current tools are `TaskCreate` and `TaskUpdate`.

**Recommendation:** Find-and-replace "TodoWrite" with the correct tool names, or use generic language like "task tracking" if the tool name might change again.

---

## 3. OVER-ITERATED (Opportunities to Condense)

### 3.1 Internal Linking Section (5.5) — 160 Lines

This section (lines 474-631) is the most thorough part of the file but also the most verbose. The breakdown:

| Sub-section               | Lines   | Content                                   |
| ------------------------- | ------- | ----------------------------------------- |
| 5.5.1 Gather link targets | 486-518 | How to read famousTypes.ts                |
| 5.5.2 Rules + link types  | 520-558 | Core rules (valuable)                     |
| 5.5.3 HTML block handling | 560-598 | HTML vs. markdown (important but verbose) |
| 5.5.4 Example output      | 599-616 | Before/after example                      |
| 5.5.5 Verify and report   | 617-631 | Output format                             |

**What could be condensed:**

- 5.5.1 could be trimmed — the TypeScript example and "do NOT make Supabase API calls" note are useful, but the prose around them is excessive
- 5.5.3 is important (HTML inside tags = anchor tags, markdown outside = markdown links) but takes 38 lines for a 3-sentence rule
- 5.5.4 example is helpful but could be shorter
- 5.5.5 verification format is prescriptive about output format that the AI doesn't need

**Estimated savings:** ~80 lines → ~80 lines of linking guidance

### 3.2 Persona Title Section (4.1) — 60 Lines

The vocabulary table (lines 389-401) and examples table (lines 403-424) are both valuable. But then:

- 6 "Key Rules" (lines 426-433) — mostly obvious from the examples
- "Title Formula Examples" table (lines 437-443) — overlaps with the examples table above

**Estimated savings:** ~15 lines

### 3.3 Database Push Error Handling / Why This Works

Lines 729-734 ("Why This Method Works") and 814-819 ("Error Handling") feel like notes-to-self that were added after debugging. The error handling is useful; the "why this works" explanation is unnecessary — the AI doesn't need to know _why_ json.dump works, just to use it.

**Estimated savings:** ~10 lines

---

## 4. UNDER-ITERATED (Gaps)

### 4.1 `famousTypes.ts` Never Gets Updated (HIGH)

The workflow creates database content and saves draft files, but **never mentions updating `famousTypes.ts`** — which is the file that controls:

- Whether a blog appears on listing pages (`link: true`)
- Image availability (`hasImage: true`)
- The person's Enneagram type grouping

For a new person, they need to be added to this file. For an existing person whose status changes, it may need updating.

**Recommendation:** Add a step after database submission: "Update `famousTypes.ts` with the new person's entry (or update existing entry) — set `link`, `hasImage`, and verify type grouping."

### 4.2 Image Handling Is Absent (HIGH)

Git status shows image files like `static/types/3s/Chris-Williamson.webp` and `static/types/3s/s-Chris-Williamson.webp` (small version). The blog system clearly uses these, but the workflow has zero guidance on:

- Where images come from (generated? sourced? user-provided?)
- Naming convention (`static/types/Xs/Person-Name.webp` + `s-Person-Name.webp`)
- When in the workflow images should be handled
- What to do if no image is available

**Recommendation:** Add a step or note about image handling. Even if it's "ask the user to provide an image" — the current silence means it's always forgotten.

### 4.3 `suggestions` Field Never Explained (MEDIUM)

The field appears in:

- Frontmatter (line 373): `suggestions: []`
- POST payload (line 1220): `["Similar-Person-1", "Similar-Person-2"]`
- PATCH payload (line 1270): with a comment "Optional - include if updating"

But nowhere does it explain:

- What suggestions are for (related personality analyses?)
- How to choose them (same type? same domain? same fame level?)
- How many to include
- Whether they need to be published (`link: true`) entries

**Recommendation:** Add 3-4 lines explaining what suggestions are and how to select them.

### 4.4 Valid `type` Field Values (MEDIUM)

The `type` array appears with different values across the file:

- Frontmatter example: `type: ['celebrity']`
- POST payload: `type: ["movieStar"]`
- Quick Reference: `type: ["creator"]`

What are the valid options? When should each be used? Without this, the agent guesses differently each time.

**Recommendation:** Add a reference table of valid `type` values and when to use each.

### 4.5 Publishing Workflow (MEDIUM)

Everything sets `published: false`. The workflow ends with content in the database unpublished. What's the next step?

- Is there an admin toggle?
- Is it a separate command?
- Should the workflow ask "ready to publish?" as a final step?

**Recommendation:** Add a brief note about the publishing pathway, even if it's "publishing is done manually via admin UI."

### 4.6 Opening Quote Guidance (LOW)

"Compelling quote" is mentioned in multiple places but there's no guidance on what makes a quote good for this format:

- Should it be from the person or about them?
- Should it reveal personality or be provocative?
- How long should it be?
- Should it connect to the Enneagram analysis or just be interesting?

**Recommendation:** Add 3-5 lines of guidance near the writing step.

### 4.7 Type Disagreement Handling (LOW)

What if Step 3.1 research suggests a different type than expected? What if there's genuine ambiguity? The workflow assumes the type is determined cleanly, but in practice there are often debates.

**Recommendation:** Add a brief note: "If research is ambiguous about the type, present the top 2-3 candidates with evidence to the user and wait for a decision before proceeding to Step 3.2."

---

## 5. STRUCTURAL ISSUES

### 5.1 Dual Identity Problem

The file interleaves two concerns:

**Workflow steps** (procedural, linear):

1. Check stale blogs → 2. Ask for input → 3. Research → 4. Metadata → 5. Draft → 5.5. Links → 6. Review → 7. Push → 8. Update workflow → 9. Error handling → 10. Cleanup

**Reference material** (static, lookup-based):

- Enneagram tone guide (lines 87-183)
- Persona title vocabulary and examples (lines 381-443)
- Internal linking rules (lines 474-631)
- Page template context / what NOT to include (lines 949-1031)
- Database push recipes (lines 647-821)
- Meta title patterns (lines 444-450)

These are interspersed. The tone guide sits between setup and research. The 160-line linking section interrupts the flow between drafting and review. The "Page Template Context — CRITICAL" section is buried at the very end under Implementation Notes.

**Recommendation:** Restructure into two main sections:

1. **Reference Guide** — Tone, titles, linking rules, template context, DB recipes
2. **Workflow** — Clean numbered steps that reference the guide sections

### 5.2 "Page Template Context — CRITICAL" Is Misplaced

Lines 949-1031 contain vital information about what NOT to include in generated content (no script tags, no PopCard, no BlogPurpose, no JSON-LD, no style tags). This is the kind of mistake the AI will make if this section isn't prominent.

Currently it's buried under "Important Implementation Notes" after all workflow steps. It should be near **Step 3.5** (the writing step) where the content is actually generated.

**Recommendation:** Move this section to immediately before or after the writing step, or at least add a bold reference in Step 3.5: "**CRITICAL: See Page Template Context below — do NOT include script tags, PopCard, BlogPurpose, JSON-LD, or style blocks.**"

### 5.3 Step Numbering Gap

Steps go 3.1, 3.2, then jump to 3.4. Step 3.3 was removed but numbering was never adjusted.

**Recommendation:** Renumber to 3.1, 3.2, 3.3 (current 3.4), 3.4 (current 3.5).

---

## 6. OUTDATED ELEMENTS

| Element                                                      | Issue                                                | Fix                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------- |
| "TodoWrite" (lines 20, 227, 830, 1100)                       | Tool is now `TaskCreate`/`TaskUpdate`                | Update references                                             |
| Person template (`src/blog/people/person-template.md`)       | Contains "booboo" and "tiptype" placeholder text     | Either develop it into a real template or stop referencing it |
| Step 3.3 gap                                                 | Step was removed, numbering not fixed                | Renumber                                                      |
| "Confirm actions before irreversible operations" (line 1093) | Contradicted by explicit "execute immediately"       | Remove or rewrite                                             |
| prep-prompt-1.md source priorities                           | Doesn't match command file's podcast-first hierarchy | Update to match                                               |

---

## 7. TENSIONS WORTH PRESERVING

These aren't problems — they're deliberate creative tensions that make the content strategy work:

### 7.1 "Authoritative About the System, Humble About the Person"

This is well-articulated and specific. The language guidance ("likely," "suggests," "echoes" for the person; confident statements about the Enneagram system) is one of the strongest parts of the file. **Keep as-is.**

### 7.2 "Clickbait to the Door, Quality Inside"

The triple-title system (title/meta_title/persona_title) embodies this tension deliberately. The meta_title is unapologetically clickbait; the page title is authoritative; the content is deep. The formula on line 1071 captures it well:

> `meta_title` (clickbait for traffic) + `title` (authority for reputation) + `content` (depth for value) = Sustainable growth

**Keep as-is.**

### 7.3 "Story First, but the Enneagram Is the Lens"

The distribution rule (explicit Enneagram framing in at most 3-4 sections, rest is narrative) and the litmus test (line 136) are excellent operational guidelines:

> "If you removed every sentence that explicitly mentions 'Type X' or 'Enneagram,' would the blog still be a compelling, insightful profile?"

**Keep as-is.**

### 7.4 "Updates Must Enhance, Not Narrow"

The holistic update philosophy (Section 8) is well-thought-out. The integration strategy (Add/Update/Enhance/Leave unchanged, default to preservation) is practical. The balance check checklist is useful. **Keep as-is**, though it could reference the tone guide rather than restating its rules.

---

## 8. SUGGESTED NEW STRUCTURE (High-Level)

If you decide to restructure, here's a suggested outline:

```
# Blog Content Creator

## Pre-Approved Operations (keep lines 5-16)

## Task Tracking (keep lines 19-38, update tool names)

## Reference Guide
### Enneagram Analysis Tone & Approach (lines 87-183 — keep as-is)
### Page Template Context — What NOT to Include (move lines 949-1031 here)
### Triple-Title System (lines 325-450 — consolidate)
### Internal Linking Rules (lines 474-631 — condense to ~80 lines)
### Database Push Method (lines 647-821 — keep once, remove Quick Ref)
### Valid Field Values (NEW — type options, suggestions guidance)

## Workflow: New Blog
### 1. Check for Stale Blogs
### 2. Ask for Input
### 3. Database Check and Setup
### 4. Research Phase (3.1, 3.2, 3.3)
### 5. Writing Phase (ref: tone guide, page template context)
### 6. Metadata Generation (ref: triple-title system)
### 7. Draft Creation
### 8. Internal Linking (ref: linking rules)
### 9. Review Cycle
### 10. Database Submission (ref: push method)
### 11. famousTypes.ts Update (NEW)
### 12. Image Handling (NEW)

## Workflow: Update Existing Blog
### (Section 8 content, streamlined)

## File References (keep, deduplicate)
```

This separates "what the rules are" from "what order to do things" and eliminates the need for a summary section or quick reference.

---

## 9. QUICK WINS (Can Do Right Now)

These are changes that reduce bloat without restructuring:

1. **Delete Quick Reference section** (lines 1182-1307) — saves ~125 lines
2. **Delete Summary section** (lines 1132-1177) — saves ~45 lines
3. **Delete duplicate Environment Requirements** (lines 1116-1131) — saves ~15 lines
4. **Remove 4 redundant "pre-approved" reminders** — saves ~10 lines
5. **Fix step numbering** (3.3 gap)
6. **Update "TodoWrite" → TaskCreate/TaskUpdate**
7. **Remove "Confirm before irreversible" from line 1093**
8. **Add bold reference to Page Template Context in Step 3.5**

**Total savings from quick wins: ~195 lines (~15% of the file)**

---

## 10. PRIORITY MATRIX

| Priority | Type          | Item                                                            |
| -------- | ------------- | --------------------------------------------------------------- |
| **P0**   | Duplication   | Delete Quick Reference, Summary, duplicate Environment sections |
| **P0**   | Gap           | Add famousTypes.ts update step                                  |
| **P0**   | Misplacement  | Move/reference Page Template Context near writing step          |
| **P1**   | Contradiction | Update prep-prompt-1.md source priorities                       |
| **P1**   | Contradiction | Fix "confirm before irreversible" vs. "execute immediately"     |
| **P1**   | Outdated      | Update TodoWrite → TaskCreate/TaskUpdate                        |
| **P1**   | Gap           | Add image handling guidance                                     |
| **P1**   | Gap           | Document valid `type` field values                              |
| **P2**   | Condensing    | Trim internal linking section                                   |
| **P2**   | Gap           | Add suggestions field guidance                                  |
| **P2**   | Gap           | Add publishing workflow note                                    |
| **P2**   | Contradiction | Clarify Step 3.2 type determination flow                        |
| **P3**   | Structure     | Full restructure into Reference + Workflow sections             |
| **P3**   | Outdated      | Rebuild or retire person-template.md                            |
| **P3**   | Gap           | Opening quote guidance                                          |
| **P3**   | Gap           | Type disagreement handling                                      |
