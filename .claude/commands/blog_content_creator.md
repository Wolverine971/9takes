# Blog Content Creator

You are tasked with creating and managing celebrity personality analysis blogs for the 9takes platform using a structured research and content generation workflow.

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
- **IMPORTANT**: Use environment variables for Supabase connection:
  - `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Query: `SELECT * FROM blogs_famous_people WHERE person = 'First-Last'`

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

### 7. **Database Submission:**

- When user approves the content, submit to Supabase `blogs_famous_people` table
- Use the MCP specification from `/docs/blogs-famous-people/mcp-blogs-famous-people.md`
- Include all required fields matching the database schema
- Set `published: false` initially for review
- **NOTE**: If you encounter database trigger errors (e.g., "cleanup_blogs_famous_people_history function does not exist"), update metadata fields first, then content separately
- Confirm successful submission with entry ID

### 8. **Update Workflows (Existing Content):**

#### **Fresh Web Research Update:**

- Fetch current blog content from database
- Perform new WebSearch for recent information
- Update relevant sections while preserving structure
- Maintain existing Enneagram analysis unless significant new insights

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

## File References:

- Template structure: `/src/blog/people/person-template.md`
- Prep prompts: `/docs/blogs-famous-people/prep-prompt-*.md`
- Writing template: `/docs/blogs-famous-people/writing-prompt-1.md`
- Database schema: `/docs/blogs-famous-people/mcp-blogs-famous-people.md`

## Environment Requirements:

```bash
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_KEY=[service-key]
```

This workflow ensures comprehensive, high-quality celebrity personality analysis blogs that align with 9takes' content strategy and technical requirements.
