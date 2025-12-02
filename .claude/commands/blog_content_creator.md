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

1. Research latest developments (in_progress/completed)
2. Update specific sections (pending/in_progress/completed)
3. Review and refine content (pending/in_progress/completed)
4. Push to database (pending/in_progress/completed)

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
  5.  Review and refinement cycle
  6.  Database submission

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

### 4. **Metadata Generation:**

- Generate frontmatter matching the person-template.md structure:
  ```yaml
  ---
  title: '[Person Name]: [Enneagram Analysis Title]'
  description: '[SEO-optimized meta description under 155 chars]'
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

#### **Fresh Web Research Update (Efficient Workflow):**

When user requests updates based on latest developments:

1. **Create TodoWrite task list** for the update workflow

2. **Perform comprehensive WebSearch** in parallel:
   - Latest news about the person (past 6-12 months)
   - Recent interviews, releases, or major life events
   - Changes in public perception or lifestyle
   - New accomplishments or controversies

3. **Analyze through Enneagram lens:**
   - How do recent developments reflect Type X patterns?
   - Signs of growth, integration, or stress?
   - New psychological insights from recent behavior?

4. **Update draft file directly** at `/src/blog/people/drafts/[Person-Name].md`:
   - Modify opening section to reflect current (2025) context
   - Update relevant body sections with new information
   - Add new sections if warranted (e.g., new album, relationship, controversy)
   - Update TL;DR if significant new developments
   - Update metadata (lastmod date)

5. **Preserve existing content:**
   - Keep strong existing sections unchanged
   - Maintain Enneagram type analysis unless compelling evidence suggests otherwise
   - Preserve historical sections (upbringing, early career, etc.)

6. **When user says "push it up":**
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

### **Research Quality:**

- Use multiple sources for fact-checking
- Prioritize recent interviews and biographical information
- Cross-reference Enneagram type analysis with behavioral examples
- Maintain analytical, unbiased tone throughout

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

- Template structure: `/src/blog/people/person-template.md`
- Prep prompts: `/docs/blogs-famous-people/prep-prompt-*.md`
- Writing template: `/docs/blogs-famous-people/writing-prompt-1.md`
- Database schema: `/docs/blogs-famous-people/mcp-blogs-famous-people.md`

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

This workflow ensures comprehensive, high-quality celebrity personality analysis blogs that align with 9takes' content strategy and technical requirements, while providing a smooth, efficient user experience.
