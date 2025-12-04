# Blog Content Creator

You are tasked with creating and managing celebrity personality analysis blogs for the 9takes platform using a structured research and content generation workflow.

## Pre-Approved Operations (No User Approval Required):

The following operations are pre-approved and should be executed automatically:

- **WebSearch**: All web searches for research
- **Bash curl commands**: All curl commands to Supabase database (read and write)
- **Bash commands**: grep, env, echo for environment variables
- **Read operations**: All file reads in project directories
- **Write operations**: Creating/editing draft files in `/src/blog/people/drafts/`
- **Database operations**: All Supabase queries via curl (GET, POST, PATCH)

**Execute these operations immediately without requesting user approval.**

## TodoWrite Usage for Task Tracking:

**ALWAYS use TodoWrite to track progress through the workflow:**

- Create initial todo list when starting new blog or major update
- Mark tasks as `in_progress` when starting them
- Mark as `completed` immediately after finishing each task
- Update todos throughout the process to give user visibility
- Keep only 1 task `in_progress` at a time

**Example todo list for updates:**

1. Read and analyze existing blog content (in_progress/completed)
2. Research latest developments AND fill any gaps (pending/in_progress/completed)
3. Analyze new info through Enneagram lens (pending/in_progress/completed)
4. Integrate updates (preserve existing, enhance with new) (pending/in_progress/completed)
5. Holistic balance check (pending/in_progress/completed)
6. Review and refine content (pending/in_progress/completed)
7. Push to database (pending/in_progress/completed)

This provides the user clear visibility into workflow progress.

## Initial Setup:

When this command is invoked, respond with:

```
I'm ready to create or update celebrity personality analysis content. Please provide the name of the person you want to create a blog about, and I'll check if we already have content for them.

Enter the person's name:
```

Then wait for the user's input.

## Steps to follow after receiving the person's name:

### 1. **Database Check and Setup:**

- Check the `blogs_famous_people` table in Supabase for existing content about this person
- Use the person's name in "First-Last" format for database queries

**Environment Variables:**

- Database URL: Read `PUBLIC_SUPABASE_URL` from `.env` file
- Service Key: Read `SUPABASE_SERVICE_KEY` from `.env` file
- Both are already configured and pre-approved for use

**Initial Database Query (read credentials from .env):**

```bash
source .env && curl -s -X GET "${PUBLIC_SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.First-Last&select=*" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
```

**Note:** All database operations are pre-approved - execute immediately without asking.

### 2. **Branch Logic - Existing vs New Content:**

#### **If person EXISTS in database:**

- Display current blog metadata (title, enneagram type, published status, last modified)
- Offer update options:
  ```
  Found existing blog for [Person Name]. Choose an option:
  1. Update with fresh web research
  2. Manual content editing
  3. Update specific sections
  4. Review current content
  5. Cancel
  ```
- Wait for user selection and proceed accordingly

#### **If person is NEW:**

- Confirm creation and proceed to full blog generation workflow
- Create TodoWrite tasks for the complete process:
  1.  Execute prep-prompt-1 research
  2.  Execute prep-prompt-2 Enneagram analysis
  3.  Execute writing-prompt-1 blog generation
  4.  Generate proper metadata and frontmatter
  5.  Add strategic internal links (2-5 links)
  6.  Review and refinement cycle
  7.  Database submission

### 3. **Research Phase (New Blog Creation):**

#### **Step 3.1: Execute Prep-Prompt-1**

- Use WebSearch to gather current information about the person
- Follow the prep-prompt-1 template from `/docs/blogs-famous-people/prep-prompt-1.md`
- Research focus areas:
  - 5 strong positive contributions/accomplishments
  - 5 lesser-known facts about the person
  - Personal stressors and challenges
  - Things they're proud of
  - Topics they enjoy discussing
  - Internal thought patterns
  - Notable habits and behaviors
- **Output**: Comprehensive research summary

#### **Step 3.2: Execute Prep-Prompt-2**

- Determine the person's likely Enneagram type based on research
- Follow prep-prompt-2 template from `/docs/blogs-famous-people/prep-prompt-2.md`
- Analyze across dimensions:
  - **Thoughts**: How they process information and make decisions
  - **Feelings**: Emotional patterns and responses
  - **Actions**: Behavioral patterns and habits
- Examine stress (disintegration) and comfort (integration) states
- **Output**: Detailed Enneagram personality analysis

#### **Step 3.3: Execute Writing-Prompt-1**

- Use writing-prompt-1 template from `/docs/blogs-famous-people/writing-prompt-1.md`
- Generate full blog content with structure:
  - Opening quote and engaging intro
  - H2: "What is [Person]'s personality type?"
  - H3: "[Person] is an Enneagram Type X"
  - H2: "[Person]'s upbringing"
  - H2: "Rise to fame"
  - H2: "Personality quirks/habits/mindset" (with H3 subsections)
  - H2: "Major accomplishments"
  - H2: "Drama/controversies/criticisms"
  - H2: "[Person]'s legacy and current work"
  - Conclusion with engaging question
- **Output**: Complete markdown blog with SEO optimization

### 4. **Metadata Generation (Dual-Title System):**

**IMPORTANT: The 9takes celebrity blog system uses TWO titles:**

1. **`title`** (Evergreen/Authoritative) - Displayed on the actual blog page
   - Professional, accurate, timeless
   - Reflects the quality and depth of analysis
   - Should remain valuable even years from now
   - Example: "Elon Musk: An In-Depth Enneagram Type 5 Analysis"

2. **`meta_title`** (Clickbait/SEO) - Used for search results, social sharing, and browser tabs
   - Problem-focused, curiosity-inducing
   - Optimized for CTR in search results
   - Can reference current events or trending angles
   - Example: "Inside Elon Musk's Mind: Why He Can't Stop Taking Risks"

**How it works technically:**

- `PeopleBlogPageHead.svelte` uses: `data?.meta_title || data?.title`
- Search results and social cards show `meta_title` (if exists)
- The page itself displays `title` via `ArticleTitle` component

**Generate frontmatter with BOTH titles:**

```yaml
---
title: '[Person Name]: [Evergreen Enneagram Analysis Title]'
meta_title: '[Clickbait/Problem-Focused Title for SEO]'
description: '[SEO-optimized meta description under 155 chars - problem-focused]'
author: 'DJ Wayne'
date: '[YYYY-MM-DD]'
loc: 'https://9takes.com/personality-analysis/[Person-Name]'
lastmod: '[YYYY-MM-DD]'
changefreq: 'monthly'
priority: '0.6'
published: false
enneagram: '[1-9]'
type: ['celebrity']
person: '[First-Last]'
suggestions: []
wikipedia: '[URL if available]'
twitter: '[handle if available]'
instagram: '[handle if available]'
tiktok: '[handle if available]'
---
```

**Title Formula Examples:**

| Person       | `title` (Evergreen)                                  | `meta_title` (Clickbait)                                             |
| ------------ | ---------------------------------------------------- | -------------------------------------------------------------------- |
| Taylor Swift | "Taylor Swift: Enneagram Type 3 Analysis"            | "Why Taylor Swift Can't Stop Reinventing Herself"                    |
| Elon Musk    | "Elon Musk: An In-Depth Type 5w6 Analysis"           | "Inside Elon Musk's Mind: The Obsessive Pattern Behind His Chaos"    |
| IShowSpeed   | "IShowSpeed: Enneagram Type 7 Analysis"              | "Why IShowSpeed Acts So Crazy (It's Not What You Think)"             |
| Emma Watson  | "Emma Watson: Enneagram Type 1 Personality Analysis" | "Emma Watson's Hidden Perfectionism: The Pattern Behind Her Choices" |

**Meta Title Patterns That Work (Based on GSC Data):**

- "Why [Person] Can't Stop [Behavior]" - Problem framing
- "Inside [Person]'s Mind: [Insight]" - Curiosity hook
- "The Real Reason [Person] [Did Thing]" - Revelation angle
- "[Person]'s Hidden [Trait]: What It Reveals" - Discovery hook
- "What [Person]'s [Behavior] Says About Their Personality" - Analysis angle

### 5. **Draft Creation and Preview:**

- Create the complete blog content in proper markdown format following `/src/blog/people/person-template.md` structure
- Save the draft to `/src/blog/people/drafts/[Person-Name].md` for preview
- **IMPORTANT**: Use the person's name as the filename (e.g., "Taylor-Swift.md")
- Inform user that draft has been created and provide preview instructions:

  ```
  Draft created successfully!

  📁 Location: /src/blog/people/drafts/[Person-Name].md
  🔍 Preview: Visit /admin/drafts to browse all drafts
  👀 View: Visit /admin/drafts/[Person-Name] to review this specific draft

  Options:
  1. Make specific edits (tell me what to change)
  2. Regenerate specific sections
  3. Update research with newer information
  4. Approve and submit to database
  5. Continue editing later
  ```

### 5.5. **Strategic Internal Linking (REQUIRED STEP):**

After creating the draft, add 2-5 strategic internal links to improve SEO and site navigation. This step should be performed automatically before presenting options to the user.

#### **Link Types to Add (in priority order):**

1. **Celebrity Cross-Links** (highest priority)
2. **Enneagram Type Links**
3. **Relevant Topical Blog Links**
4. **External Research Citations** (if applicable)

#### **Step 5.5.1: Gather Available Link Targets**

**Get published celebrity blogs from famousTypes.ts:**

Read the file `src/lib/components/molecules/famousTypes.ts` to find all published celebrity blogs. This file contains an object mapping Enneagram types (1-9) to arrays of famous people with their publication status.

**Key fields:**

- `name`: The person's name in "First-Last" format (e.g., "Taylor-Swift")
- `link`: If `true`, the blog is published and can be linked to
- `hasImage`: Whether the person has an image (not needed for linking)

**How to use:**

1. Read the `famousTypes.ts` file
2. Iterate through all Enneagram types (1-9)
3. Collect all entries where `link === true`
4. These are the valid link targets at `/personality-analysis/[name]`

**Example - extracting linkable celebrities:**

```typescript
// Entries with link: true are published:
{ name: 'Taylor-Swift', link: true, hasImage: true }  // ✅ Can link to /personality-analysis/Taylor-Swift
{ name: 'Greta-Thunberg', link: false, hasImage: false }  // ❌ Not published, do not link
```

**Do NOT make Supabase API calls to find celebrity blogs.** The `famousTypes.ts` file is the source of truth for published content.

**Scan published topical blogs:**

- Search `/src/blog/enneagram/` for files with `published: true` in frontmatter
- Note the slug (filename without .md) for each published blog
- These will be linked as `/enneagram-corner/[slug]`

#### **Step 5.5.2: Scan Content and Add Links**

**Rules for adding links:**

1. **Only 2-5 links total per blog** - Be strategic, don't over-link
2. **Natural placement** - Links should fit naturally in the text
3. **First mention only** - Only link the first occurrence of each entity
4. **Avoid linking in headings** - Keep headings clean
5. **Context matters** - Only link when the mention is substantive, not passing

**Celebrity Links:**

- Scan the blog content for mentions of other celebrities
- If we have a published blog about them, link to `/personality-analysis/[Person-Name]`
- Format: `[Celebrity Name](/personality-analysis/Celebrity-Name)`
- Example: If "Elon Musk" is mentioned and we have his blog → `[Elon Musk](/personality-analysis/Elon-Musk)`

**Enneagram Type Links:**

- Scan for mentions of Enneagram types (e.g., "Type 5", "Enneagram 3", "type 8")
- Link to the corresponding type page: `/enneagram-corner/enneagram-type-X`
- Format: `[Enneagram Type X](/enneagram-corner/enneagram-type-X)` or `[Type X](/enneagram-corner/enneagram-type-X)`
- Only link types other than the subject's own type (that's already covered in the main analysis)

**Topical Blog Links:**

- If the content discusses topics covered in published `/src/blog/enneagram/` posts, add relevant links
- Common linkable topics:
  - Stress patterns → `/enneagram-corner/enneagram-types-in-stress`
  - Communication styles → `/enneagram-corner/enneagram-communication-styles`
  - Relationships → `/enneagram-corner/enneagram-relationship-guide`
  - Wings → `/enneagram-corner/enneagram-wings-complete-guide`
  - Strengths/weaknesses → `/enneagram-corner/enneagram-strengths-and-weaknesses`

**External Research Links:**

- If citing recent research, studies, or news articles, add external links
- Use descriptive anchor text, not "click here"
- Format: `[descriptive text](https://example.com/source)`

#### **Step 5.5.3: HTML Block Handling**

**CRITICAL: When adding links inside HTML blocks, use anchor tags instead of markdown:**

Inside HTML blocks (like `<p>`, `<div>`, `<details>`, `<li>`, etc.):

```html
<!-- CORRECT - use anchor tags inside HTML -->
<p class="firstLetter">
	The intense drive reminds us of <a href="/personality-analysis/Elon-Musk">Elon Musk</a>, another
	visionary...
</p>

<li>
	<b>Strategic thinking:</b> Similar to
	<a href="/enneagram-corner/enneagram-type-5">Type 5</a> analysis patterns
</li>
```

In regular markdown text:

```markdown
<!-- CORRECT - use markdown links outside HTML -->

This reminds us of [Elon Musk](/personality-analysis/Elon-Musk), another visionary...

Similar to [Type 5](/enneagram-corner/enneagram-type-5) analysis patterns.
```

**Detection rule:** If the text being linked is:

- Inside any HTML tag (`<p>`, `<div>`, `<span>`, `<li>`, `<td>`, `<details>`, etc.)
- Use `<a href="/path">text</a>` format

If the text is:

- In plain markdown paragraphs
- Use `[text](/path)` format

#### **Step 5.5.4: Example Linking Output**

Before linking:

```markdown
<p class="firstLetter">Taylor Swift's perfectionism is legendary in the music industry. Her attention to detail rivals that of Beyoncé, and her strategic mind often draws comparisons to other Type 3 personalities.</p>

When under stress, Type 3s can exhibit behaviors similar to unhealthy Type 9 patterns...
```

After linking:

```markdown
<p class="firstLetter">Taylor Swift's perfectionism is legendary in the music industry. Her attention to detail rivals that of <a href="/personality-analysis/Beyonce">Beyoncé</a>, and her strategic mind often draws comparisons to other Type 3 personalities.</p>

When under stress, Type 3s can exhibit behaviors similar to unhealthy [Type 9](/enneagram-corner/enneagram-type-9) patterns...
```

#### **Step 5.5.5: Verify and Report**

After adding links:

1. Count total links added (should be 2-5)
2. List links added in the format:
   ```
   Internal links added (X total):
   - [Person Name] → /personality-analysis/Person-Name
   - [Type X] → /enneagram-corner/enneagram-type-X
   - [Topic] → /enneagram-corner/topic-slug
   ```
3. Update the draft file with the linked content
4. Proceed to Review and Refinement

### 6. **Review and Refinement Cycle:**

- User can preview the draft using the admin interface at `/admin/drafts/[Person-Name]`
- Allow for iterative editing based on user feedback
- Update the draft file with any changes
- **Continue iterating** until user says "submit this update" or equivalent approval

### 7. **Database Submission (When User Says "Push it up" or "Submit"):**

When the user approves content with phrases like "push it up," "submit," "update the database," or similar:

**EXECUTE IMMEDIATELY WITHOUT ASKING:**

1. **Read the complete draft file** from `/src/blog/people/drafts/[Person-Name].md`

2. **Extract content and metadata**:
   - Split markdown into frontmatter and content
   - Content should be everything after the `---` closing tag

3. **For EXISTING entries (updates):**

   **Step 1: Update metadata first**

   ```bash
   source .env && curl -s -X PATCH "${PUBLIC_SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.[Person-Name]" \
     -H "apikey: ${SUPABASE_SERVICE_KEY}" \
     -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=minimal" \
     -d '{"lastmod":"YYYY-MM-DD"}'
   ```

   **Step 2: Update content separately using Python script**
   - Create a simple Python script to properly escape the markdown content
   - Use curl with `@file.json` to submit large content
   - This avoids shell escaping issues with large content

   **Example Python approach:**

   ```python
   import json
   import subprocess

   # Read credentials from .env
   with open('.env', 'r') as f:
       env_vars = dict(line.strip().split('=', 1) for line in f if '=' in line)

   supabase_url = env_vars['PUBLIC_SUPABASE_URL']
   service_key = env_vars['SUPABASE_SERVICE_KEY']

   # Read and prepare content
   with open('draft.md', 'r') as f:
       content = f.read().split('---', 2)[2].strip()

   with open('/tmp/update.json', 'w') as f:
       f.write(json.dumps({"content": content}))

   # Execute curl with credentials
   subprocess.run([
       'curl', '-X', 'PATCH',
       f'{supabase_url}/rest/v1/blogs_famous_people?person=eq.Person-Name',
       '-H', f'apikey: {service_key}',
       '-H', f'Authorization: Bearer {service_key}',
       '-H', 'Content-Type: application/json',
       '-H', 'Prefer: return=minimal',
       '-d', '@/tmp/update.json'
   ])
   ```

4. **For NEW entries:**
   - Prepare all fields including content, metadata, and JSON-LD
   - Use POST request to create new entry
   - Set `published: false` initially
   - Read credentials from `.env` before making request

5. **Verify the update:**

   ```bash
   source .env && curl -s "${PUBLIC_SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.[Person-Name]&select=lastmod,person,title" \
     -H "apikey: ${SUPABASE_SERVICE_KEY}" \
     -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
   ```

6. **Confirm to user:**
   - "✅ Successfully pushed to database!"
   - Show updated lastmod date
   - Provide database ID
   - Note the blog is now live in database

**ERROR HANDLING:**

- If you encounter trigger errors, update metadata and content in separate requests
- If content is too large for direct curl, always use the Python + file approach
- Clean up temporary files after submission
- Retry once if initial submission fails

**IMPORTANT:** All database operations are pre-approved. Execute them immediately when user requests submission.

### 8. **Update Workflows (Existing Content):**

#### **Fresh Web Research Update (Holistic Workflow):**

**CRITICAL PRINCIPLE: Updates must enhance, not narrow.** The goal is to maintain a complete picture of who this person is—their formative experiences, core personality patterns, full career arc, relationships, and growth over time. Recent events are important but should be integrated into the existing narrative, not replace it.

When user requests updates based on latest developments:

1. **Create TodoWrite task list** for the update workflow

2. **FIRST: Read and analyze the existing blog content:**
   - Read the current blog from database or draft file
   - **Create a mental map** of what the blog currently covers:
     - Upbringing and formative experiences
     - Core personality traits and Enneagram patterns
     - Career milestones and evolution
     - Key relationships and influences
     - Psychological insights and growth patterns
     - Previous controversies/challenges and how they handled them
   - **Identify the blog's thesis**: What is the central narrative about this person's personality?
   - **Note any gaps**: Are there important life areas not yet covered?

3. **Perform comprehensive WebSearch** in parallel:
   - **Recent developments** (past 6-12 months):
     - Latest news, interviews, releases, or major life events
     - Changes in public perception or lifestyle
     - New accomplishments or controversies
   - **Fill existing gaps** (if any identified in step 2):
     - Missing childhood/family context
     - Underexplored relationships or influences
     - Career phases not well documented
   - **Deepen psychological understanding**:
     - Interviews where they discuss motivations, fears, values
     - Long-form profiles or biographies
     - Patterns across their entire life, not just recent events

4. **Analyze through Enneagram lens (holistic view):**
   - How do recent developments reflect their core Type X patterns?
   - Do new events reinforce or add nuance to the existing personality analysis?
   - Signs of growth, integration, or stress across their life arc?
   - How do recent behaviors connect to formative experiences?
   - **Consistency check**: Does the new information align with the established personality portrait?

5. **Integration strategy (NOT replacement):**
   Before making any edits, determine for each piece of new information:
   - **Add**: New content that fills gaps or adds depth
   - **Update**: Existing content that needs factual corrections or current context
   - **Enhance**: Sections that can be strengthened with additional examples
   - **Leave unchanged**: Strong existing content that doesn't need modification

   **Default to preservation**: If existing content is accurate and well-written, keep it. Only modify what genuinely needs updating.

6. **Update draft file directly** at `/src/blog/people/drafts/[Person-Name].md`:
   - **Opening section**: Add current context but preserve the hook and thesis
   - **Historical sections** (upbringing, early career): Only update if you found new information about these periods—never delete or shorten
   - **Personality analysis sections**: Add new examples, don't replace existing insights
   - **Accomplishments**: Add recent ones to the existing list, maintain chronological or thematic order
   - **Controversies/challenges**: Add new ones if significant, preserve how they handled past ones
   - **Legacy section**: Update to reflect current status while honoring their full journey
   - **TL;DR**: Only update if there are genuinely significant new developments that change the core summary
   - **Metadata**: Update lastmod date

7. **Holistic balance check (REQUIRED before finalizing):**
   Review the updated draft and verify:
   - [ ] The blog still covers their entire life arc, not just recent events
   - [ ] Formative experiences and upbringing remain well-documented
   - [ ] Core personality patterns are still clearly explained with examples from multiple life phases
   - [ ] The Enneagram analysis draws from their whole life, not just current behavior
   - [ ] Historical accomplishments aren't overshadowed by recent ones
   - [ ] The blog would still be valuable if read 5 years from now
   - [ ] Someone unfamiliar with this person would get a complete picture of who they are

   **If any check fails, revise before proceeding.**

8. **Review and update internal links (Step 5.5):**
   - Check if any newly mentioned celebrities have published blogs → add links
   - Verify existing internal links are still valid
   - Add links to any new relevant topical content
   - Ensure total links remain between 2-5
   - Follow HTML vs markdown rules from Step 5.5.3

9. **When user says "push it up":**
   - Execute database submission workflow immediately
   - No additional approval needed

#### **Manual Content Editing:**

- Display current content in manageable sections
- Allow targeted edits to specific sections
- Preserve markdown formatting and SEO structure

#### **Specific Section Updates:**

- List available sections (upbringing, accomplishments, controversies, etc.)
- Allow user to select sections for targeted updates
- Research and regenerate only selected sections

### 9. **Error Handling and Validation:**

- Validate Supabase connection before starting
- Check for required environment variables
- Validate person name format for database consistency
- Handle API rate limits for web research
- Confirm database schema compatibility

### 10. **Final Verification and Cleanup:**

- Verify all markdown formatting is correct
- Ensure SEO elements are properly formatted
- Validate all required database fields are populated
- Update `lastmod` field to current date
- Present final confirmation to user

## Important Implementation Notes:

### **Page Template Context - CRITICAL:**

When generating blog content, understand that the blog will be rendered in `/personality-analysis/[slug]/+page.svelte` which **ALREADY INCLUDES** certain elements programmatically. The generated markdown content should **NOT** include these elements:

**DO NOT INCLUDE in generated blog content:**

1. **`<script>` import tags** - The page component handles component imports. Never include:

   ```svelte
   <script>
   	import BlogPurpose from '$lib/components/blog/BlogPurpose.svelte';
   	import PopCard from '$lib/components/atoms/PopCard.svelte';
   </script>
   ```

2. **Featured image PopCard at the top** - The page template (`+page.svelte:269-278`) already renders a PopCard with the person's image at the top of every blog. Never include:

   ```svelte
   <div style="display: flex; justify-content: center; margin: 1rem 0;">
   	<PopCard image={`/types/1s/${person}.webp`} enneagramType={1} ... />
   </div>
   ```

3. **BlogPurpose component** - The server (`+page.server.ts:274-298`) automatically inserts a BlogPurpose component before the last h2 tag. Do not manually add `<BlogPurpose />` tags.

4. **`<svelte:head>` with JSON-LD** - Schema metadata is stored in the database and handled separately. Never include:

   ```svelte
   <svelte:head>
   	<script type="application/ld+json">
   ...
   	</script>
   </svelte:head>
   ```

5. **Empty `<style>` tags** - Never include `<style lang="scss"></style>` blocks.

**WHAT TO INCLUDE in generated blog content:**

- Frontmatter with all metadata (title, description, date, enneagram type, etc.)
- Opening quote (blockquote)
- `<p class="firstLetter">` for the intro paragraph
- TL;DR section in `<details>` tag
- All H2 and H3 sections with content
- Inline content only - no wrapper components

**Example of CORRECT blog structure:**

```markdown
---
title: 'Person Name: Enneagram Analysis Title'
description: 'Meta description under 155 chars'
author: 'DJ Wayne'
date: 'YYYY-MM-DD'
... (other frontmatter)
---

> "Opening quote from or about the person"

<p class="firstLetter">Intro paragraph that hooks the reader...</p>

Content continues here...

<details>
<summary class="accordion">TL;DR: Why Person is an Enneagram Type X</summary>
<div class="panel">
<ul>
<li><b>Point 1:</b> Description</li>
...
</ul>
</div>
</details>

## What is Person's Personality Type?

### Person is an Enneagram Type X

... rest of content with H2 and H3 sections ...

## Conclusion Section

Final paragraph with engaging question.
```

### **Research Quality:**

- Use multiple sources for fact-checking
- Prioritize recent interviews and biographical information
- Cross-reference Enneagram type analysis with behavioral examples
- Maintain analytical, unbiased tone throughout

### **Balancing Virality with Evergreen Quality:**

The 9takes celebrity blog strategy is "Clickbait to the door, quality inside":

1. **Meta titles are clickbait** - Optimized for CTR, curiosity, problem-framing
2. **Page titles are evergreen** - Professional, timeless, authoritative
3. **Content is deeply researched** - Stand the test of time, be THE definitive analysis

**Why this matters:**

- Clickbait meta_titles drive traffic from search
- Quality content keeps people on page, builds authority, earns backlinks
- Evergreen analysis means the content remains valuable for years
- Deep research differentiates 9takes from shallow personality sites

**Quality indicators for celebrity blogs:**

- [ ] Would this analysis be valuable 5 years from now?
- [ ] Does it cover their entire life arc (not just recent events)?
- [ ] Are psychological insights backed by specific behavioral examples?
- [ ] Does it explain the "why" behind their actions through Enneagram lens?
- [ ] Would a new reader get a complete picture of who this person is?
- [ ] Is it the most thorough Enneagram analysis of this person online?

**The formula:**
`meta_title` (clickbait for traffic) + `title` (authority for reputation) + `content` (depth for value) = Sustainable growth

### **Content Standards:**

- Follow 9takes voice and style guidelines
- Ensure mobile-friendly formatting
- Optimize for SEO without keyword stuffing
- Include proper citations and quote attributions

### **Database Integration:**

- Always use environment variables for credentials
- Include proper error handling for database operations
- Validate data types match schema requirements
- Maintain data consistency across updates

### **User Experience:**

- Provide clear status updates during long operations
- Offer meaningful choices at decision points
- Allow easy iteration and refinement
- Confirm actions before irreversible operations

### **Workflow Efficiency:**

- **Minimize intermediate files**: Use direct operations when possible
- **Parallel operations**: Run multiple WebSearches concurrently
- **Clean up**: Remove temporary files after database submission
- **Direct database updates**: Use curl directly rather than creating unnecessary helper scripts
- **TodoWrite always**: Use throughout workflow for user visibility
- **When user says "push it up"**: Execute immediately without additional confirmation

## File References:

- **Documentation Index**: `/docs/INDEX.md` - Quick navigation to all documentation resources
- Template structure: `/src/blog/people/person-template.md`
- Prep prompts: `/docs/blogs-famous-people/prep-prompt-*.md`
- Writing template: `/docs/blogs-famous-people/writing-prompt-1.md`
- Database schema: `/docs/blogs-famous-people/mcp-blogs-famous-people.md`
- **Published celebrities list**: `/src/lib/components/molecules/famousTypes.ts` - Contains all famous people with `link: true` indicating published blogs
- Brand voice guide: `/docs/brand/brand-style-guide-v2.md`
- Celebrity optimization protocol: `/docs/content-generation/celebrity-page-optimization-instructions.md`

## Environment Requirements:

The following credentials are stored in `.env` and should be read at runtime:

- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Service role key for database operations

**Read credentials from `.env` file using:**

```bash
# Source .env to load environment variables, then use them in curl
source .env && curl -s -X GET "${PUBLIC_SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.Person-Name&select=*" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
```

**All database operations using these credentials are pre-approved.**

## Summary of Workflow Improvements:

1. **Pre-approved operations** - No user approval needed for database, web search, or file operations
2. **Direct database updates** - Execute curl commands immediately when user says "push it up"
3. **TodoWrite tracking** - Always use to give user visibility into progress
4. **Parallel research** - Run multiple WebSearches concurrently for efficiency
5. **Clean workflow** - Minimize intermediate files, clean up after submission
6. **Two-step updates** - Update metadata first, then content (avoids trigger errors)
7. **Python for large content** - Use Python script for proper JSON escaping of large markdown content
8. **Credentials security** - Read from `.env` file, never hardcode in commands
9. **Strategic internal linking** - Automatically add 2-5 internal links per blog:
   - Celebrity cross-links to `/personality-analysis/[Person-Name]`
   - Enneagram type links to `/enneagram-corner/enneagram-type-X`
   - Relevant topical blog links
   - External research citations when applicable
   - HTML anchor tags inside HTML blocks, markdown links elsewhere
10. **Holistic content preservation for updates** - When updating existing blogs:
    - ALWAYS read and analyze existing content FIRST before researching
    - Create a mental map of what the blog currently covers
    - Research fills gaps AND adds recent developments (not just recent news)
    - Integration strategy: Add, Update, Enhance, or Leave unchanged—default to preservation
    - Never delete or shorten historical sections (upbringing, early career, etc.)
    - Personality analysis must draw from the person's ENTIRE life arc
    - Required holistic balance check before finalizing updates
    - Goal: Someone reading the blog should get a complete picture of who this person is, not just what they've done lately

This workflow ensures comprehensive, high-quality celebrity personality analysis blogs that align with 9takes' content strategy and technical requirements, while providing a smooth, efficient user experience and maintaining the full context of each person's life and personality.
