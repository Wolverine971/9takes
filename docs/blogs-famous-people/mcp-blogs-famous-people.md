TODO

# Supabase Blog Management Instructions for Claude Code

## Setup & Configuration

### Environment Variables Required

```bash
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_SERVICE_KEY=[your-service-key]
```

### API Endpoints

- Base URL: `${SUPABASE_URL}/rest/v1/blogs_famous_people`
- Headers for all requests:
  ```json
  {
  	"apikey": "${SUPABASE_SERVICE_KEY}",
  	"Authorization": "Bearer ${SUPABASE_SERVICE_KEY}",
  	"Content-Type": "application/json",
  	"Prefer": "return=representation"
  }
  ```

## Database Schema Reference

```typescript
{
	id: number; // Auto-generated, do not modify
	created_at: string; // Auto-generated, do not modify
	title: string | null; // SEO-optimized title
	description: string | null; // Meta description for SEO
	author: string | null; // Article author name
	loc: string | null; // Full URL path
	lastmod: string | null; // YYYY-MM-DD format
	changefreq: string | null; // monthly, weekly, etc.
	priority: string | null; // 0.0 to 1.0
	published: boolean | null; // Publication status
	enneagram: string | null; // Enneagram type (1-9)
	type: Json | null; // Array of types ["politician", "actor", etc.]
	person: string | null; // Person identifier (First-Last format)
	wikipedia: string | null; // Wikipedia URL
	twitter: string | null; // Twitter handle
	instagram: string | null; // Instagram handle
	tiktok: string | null; // TikTok handle
	date: string | null; // Original publish date YYYY-MM-DD
	content: string | null; // Markdown content of the blog
	jsonld_snippet: Json | null; // Schema.org structured data
	suggestions: Json | null; // Array of related person names
	meta_title: string | null; // SEO meta title
}
```

## CRUD Operations

### 1. READ - Get a Blog Entry

#### Get by ID

```bash
curl -X GET \
  "${SUPABASE_URL}/rest/v1/blogs_famous_people?id=eq.${ID}" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
```

#### Get by Person Name

```bash
curl -X GET \
  "${SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.${PERSON_NAME}" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
```

#### Get Multiple with Filters

```bash
# Get all published blogs
curl -X GET \
  "${SUPABASE_URL}/rest/v1/blogs_famous_people?published=eq.true" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"

# Get by enneagram type
curl -X GET \
  "${SUPABASE_URL}/rest/v1/blogs_famous_people?enneagram=eq.2" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
```

### 2. CREATE - Add New Blog Entry

```bash
curl -X POST \
  "${SUPABASE_URL}/rest/v1/blogs_famous_people" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "Person Name: Title of Analysis",
    "description": "Meta description for SEO",
    "author": "DJ Wayne",
    "person": "First-Last",
    "enneagram": "5",
    "type": ["category1", "category2"],
    "content": "# Markdown content here...",
    "published": false,
    "date": "2025-01-01",
    "lastmod": "2025-01-01",
    "changefreq": "monthly",
    "priority": "0.6",
    "loc": "https://9takes.com/personality-analysis/Person-Name"
  }'
```

### 3. UPDATE - Modify Existing Blog

#### Update by ID

```bash
curl -X PATCH \
  "${SUPABASE_URL}/rest/v1/blogs_famous_people?id=eq.${ID}" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "content": "Updated markdown content...",
    "lastmod": "2025-01-17",
    "meta_title": "Updated SEO title"
  }'
```

#### Update by Person Name

```bash
curl -X PATCH \
  "${SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.Joe-Biden" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "content": "Updated content...",
    "lastmod": "2025-01-17"
  }'
```

## Workflow for Research & Update

### Step 1: Retrieve the Current Blog

```javascript
// Example using fetch in Node.js
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function getBlog(personName) {
	const response = await fetch(
		`${SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.${personName}`,
		{
			headers: {
				apikey: SUPABASE_SERVICE_KEY,
				Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`
			}
		}
	);
	const data = await response.json();
	return data[0]; // Returns first matching blog
}
```

### Step 2: Research & Generate Updated Content

When updating content, Claude should:

1. Read the existing content
2. Research current information about the person
3. Maintain the existing structure and Enneagram analysis framework
4. Update facts, add recent events, or expand analysis
5. Preserve the markdown formatting style

### Step 3: Update the Blog

```javascript
async function updateBlog(blogId, updates) {
	const response = await fetch(`${SUPABASE_URL}/rest/v1/blogs_famous_people?id=eq.${blogId}`, {
		method: 'PATCH',
		headers: {
			apikey: SUPABASE_SERVICE_KEY,
			Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
			'Content-Type': 'application/json',
			Prefer: 'return=representation'
		},
		body: JSON.stringify({
			...updates,
			lastmod: new Date().toISOString().split('T')[0] // Auto-update lastmod
		})
	});
	return await response.json();
}
```

## Content Guidelines for Updates

### Markdown Structure

- Use proper heading hierarchy (# for title, ## for main sections, ### for subsections)
- Include blockquotes for notable quotes
- Use **bold** for emphasis
- Maintain the personality analysis framework

### Required Elements to Preserve

1. **Enneagram Type Analysis** - Core personality framework
2. **Quote attributions** - Properly formatted with `>`
3. **Disclaimer** at the end
4. **SEO elements** - title, description, meta_title

### Fields to Update When Modifying Content

- `content`: The updated markdown
- `lastmod`: Current date in YYYY-MM-DD format
- `meta_title`: Update if title changes significantly
- `description`: Update if main focus changes
- `suggestions`: Update array of related people if relevant

### Fields NOT to Modify

- `id` - System generated
- `created_at` - System generated
- `author` - Unless specifically instructed
- `person` - This is the identifier, don't change
- `enneagram` - Core analysis type, rarely changes

## Example Update Commands for Claude Code

### Quick Content Update

```bash
# Get the blog
curl -X GET "${SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.Joe-Biden" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"

# Update with new content
curl -X PATCH "${SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.Joe-Biden" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "content": "[Updated markdown content]",
    "lastmod": "2025-01-17",
    "meta_title": "Joe Biden Enneagram Type 2 | Updated Analysis 2025"
  }'
```

### Full Blog Creation

```bash
curl -X POST "${SUPABASE_URL}/rest/v1/blogs_famous_people" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "Taylor Swift: The Achiever Type 3 Personality Analysis",
    "person": "Taylor-Swift",
    "enneagram": "3",
    "type": ["musician", "celebrity"],
    "author": "DJ Wayne",
    "content": "[Full markdown content]",
    "published": false,
    "date": "2025-01-17",
    "lastmod": "2025-01-17",
    "loc": "https://9takes.com/personality-analysis/Taylor-Swift",
    "priority": "0.7",
    "changefreq": "monthly"
  }'
```

## Error Handling

Common errors and solutions:

- **401 Unauthorized**: Check SUPABASE_SERVICE_KEY
- **404 Not Found**: Check SUPABASE_URL and table name
- **400 Bad Request**: Validate JSON structure and data types
- **409 Conflict**: Check for unique constraint violations

## Best Practices

1. **Always backup before major updates**: Fetch and save the current content before updating
2. **Test with published=false**: Set published to false when testing updates
3. **Validate markdown**: Ensure markdown syntax is correct before updating
4. **Update lastmod**: Always update the lastmod field when changing content
5. **Research thoroughly**: Use web search to verify current information about the person
6. **Maintain voice**: Keep the analytical, professional tone of the existing content
7. **SEO consistency**: Ensure meta_title and description align with content

## Quick Reference Commands

```bash
# Set environment variables first
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-key"

# List all blogs
curl "${SUPABASE_URL}/rest/v1/blogs_famous_people" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}"

# Get specific blog
curl "${SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.Joe-Biden" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}"

# Update blog content
curl -X PATCH "${SUPABASE_URL}/rest/v1/blogs_famous_people?id=eq.711" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"content": "new content", "lastmod": "2025-01-17"}'
```
