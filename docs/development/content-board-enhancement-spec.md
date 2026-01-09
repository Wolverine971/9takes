---
title: 'Content Board Enhancement Specification'
description: 'Detailed spec for redesigning the admin content board with compact cards and full-screen editor modal'
last_modified: 2026-01-09
status: active
category: spec
related:
  - ../content-generation/blog-suggestions-jan-2026.md
path: docs/development/content-board-enhancement-spec.md
---

# Content Board Enhancement Specification

## Intent Summary

Transform the admin content board from a basic kanban view into a powerful content management interface with:

1. **Compact, information-dense cards** that surface key metadata at a glance
2. **Full-screen modal editor** when clicking a card, featuring:
   - Editable raw markdown content on the left (primary focus, ~70% width)
   - Metadata panel on the right (~30% width) showing all `blogs_famous_people` columns and related data
3. A modern, polished admin experience befitting a professional CMS

---

## Current State Analysis

### What Exists Today

- Kanban board with 9 stages (160px columns)
- Cards show: title, published status, enneagram type, lastmod date
- "Expand" toggle reveals `ContentCard` component inline (cramped, limited info)
- Drag-and-drop stage transitions
- List view alternative

### Pain Points

- Cards are too dense/cramped for the small column width
- Expanded inline view is awkward within kanban columns
- No way to edit content directly
- Metadata is hidden behind multiple clicks
- No full content preview

---

## Detailed Specification

### 1. Compact Content Cards

**Card Layout (within 160px column)**

```
┌────────────────────────┐
│ ● Gary Vee          ↗ │  <- Status dot + person name + external link icon
│ Type 3 · business      │  <- Enneagram + category badges
│ ───────────────────── │
│ Jan 7 · Draft          │  <- Date + publish status
└────────────────────────┘
```

**Card Information Hierarchy:**

1. **Status indicator** (colored dot): Green=published, Amber=draft
2. **Person name** (primary text, truncated with ellipsis)
3. **External link icon** (if published, opens live page; use `loc` if available, else derive from `person` slug)
4. **Enneagram type badge**: "Type 3" with colored background per type
5. **Category tag**: Prefer `category`, fallback to first entry in `type[]`
6. **Footer row**: `lastmod` date (fallback to `date`) + publish status text

**Card Styling:**

- Remove the expand chevron (clicking card opens modal)
- Add subtle hover effect (slight elevation + border highlight)
- Cursor pointer on hover
- Drag handle appears on hover (left edge)
- Max 2 lines for title, ellipsis overflow

**Color Coding by Enneagram Type:**

```typescript
const enneagramColors: Record<number, string> = {
	1: 'bg-slate-100 text-slate-700', // Reformer
	2: 'bg-rose-100 text-rose-700', // Helper
	3: 'bg-amber-100 text-amber-700', // Achiever
	4: 'bg-purple-100 text-purple-700', // Individualist
	5: 'bg-cyan-100 text-cyan-700', // Investigator
	6: 'bg-blue-100 text-blue-700', // Loyalist
	7: 'bg-orange-100 text-orange-700', // Enthusiast
	8: 'bg-red-100 text-red-700', // Challenger
	9: 'bg-green-100 text-green-700' // Peacemaker
};
```

---

### 2. Full-Screen Content Editor Modal

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Close    Gary Vee - Content Editor                    💾 Save  ✓ Done│  <- Header
├───────────────────────────────────────────────┬─────────────────────────┤
│                                               │   METADATA PANEL        │
│                                               │   ─────────────────     │
│   MARKDOWN EDITOR                             │   Status: [Draft ▼]     │
│   ─────────────────                           │   Enneagram: 3          │
│                                               │   Category: business    │
│   [Raw markdown content here...]              │   ─────────────────     │
│   [Full-height scrollable]                    │   SEO                   │
│   [Syntax highlighting optional]              │   • Title (60 chars)    │
│                                               │   • Meta Title          │
│                                               │   • Description         │
│                                               │   ─────────────────     │
│                                               │   Social Links          │
│                                               │   • Twitter: @garyvee   │
│                                               │   • Instagram: garyvee  │
│                                               │   • TikTok: garyvee     │
│                                               │   ─────────────────     │
│                                               │   Dates                 │
│                                               │   • Created: Jan 7      │
│                                               │   • Modified: Jan 7     │
│                                               │   ─────────────────     │
│                                               │   Related Suggestions   │
│                                               │   • Tony Robbins        │
│                                               │   • Alex Hormozi        │
│                                               │   ─────────────────     │
│                                               │   Version History (5)   │
│                                               │   └ View Changes        │
└───────────────────────────────────────────────┴─────────────────────────┘
```

**Modal Sizing:**

- Width: `calc(100vw - 48px)` (24px margin each side)
- Height: `calc(100vh - 48px)` (24px margin top/bottom)
- Mobile: Full screen (no margins)
- Centered with backdrop blur

**Left Panel - Markdown Editor (~70% width):**

- Textarea with monospace font (Fira Code, JetBrains Mono, or system mono)
- Line numbers (optional toggle)
- Full height scrollable
- Font size: 14px
- Line height: 1.6
- Padding: 24px
- Background: `#1e1e2e` (dark) or `#fafafa` (light)
- Syntax highlighting using a lightweight library (optional, can use basic textarea)
- Unsaved changes indicator (dot in tab/header)

**Right Panel - Metadata Sidebar (~30% width, min 320px):**

Organized into collapsible sections:

1. **Status & Classification**
   - Published toggle (switch component)
   - Workflow stage dropdown
   - Enneagram type (readonly or editable dropdown)
   - Categories/Type (multi-select tags)

2. **SEO Information**
   - Title (with character count, target 60)
   - Meta Title
   - Description (with character count, target 155)
   - URL/loc (readonly, linkable)

3. **Social Links**
   - Twitter handle (with @ prefix display)
   - Instagram handle
   - TikTok handle
   - Wikipedia URL

4. **Dates & Author**
   - Created date (readonly)
   - Last modified (readonly, auto-updates on save)
   - Author dropdown/input

5. **Related Content**
   - Suggestions array (pill badges, clickable to navigate)
   - Pic/image URL

6. **Version History** (for `blogs_famous_people` only)
   - List of last 5 changes with timestamps
   - Click to open diff view (existing `/admin/blog-diff/[id]`)

7. **Actions**
   - Preview button (opens new tab to preview URL)
   - Copy markdown button
   - Delete (with confirmation)

---

### 3. Data Flow & API

**Auth & Validation Requirements:**

- All admin API routes must enforce admin access (server-side check + RLS)
- Reject updates to derived/immutable fields: `id`, `person`, `loc`, `date`, `lastmod`, `search_vector`
- Validate types and sanitize arrays/strings before writing
- Return non-200 responses on error (400/403/404/500)

**New API Endpoint Needed:**

```typescript
// src/routes/api/admin/content/[id]/+server.ts
// import { error, json } from '@sveltejs/kit';

// GET - Fetch full content including markdown
export async function GET({ params, locals }) {
	const { id } = params;
	// Ensure admin access (example: locals.user + role check)
	// if (!locals.user?.is_admin) throw error(403, 'Forbidden');
	const { data, error: fetchError } = await locals.supabase
		.from('blogs_famous_people')
		.select('*, blogs_famous_people_history(id, changed_at, old_content, new_content)')
		.order('changed_at', { ascending: false, foreignTable: 'blogs_famous_people_history' })
		.limit(5, { foreignTable: 'blogs_famous_people_history' })
		.eq('id', id)
		.single();
	if (fetchError) throw error(404, 'Content not found');
	return json(data);
}

// PUT - Update content
export async function PUT({ params, request, locals }) {
	const { id } = params;
	// Ensure admin access (example: locals.user + role check)
	// if (!locals.user?.is_admin) throw error(403, 'Forbidden');
	const updates = await request.json();
	const allowedFields = new Set([
		'title',
		'meta_title',
		'description',
		'content',
		'type',
		'category',
		'published',
		'enneagram',
		'author',
		'twitter',
		'instagram',
		'tiktok',
		'wikipedia',
		'suggestions',
		'pic',
		'tags'
	]);
	const safeUpdates = Object.fromEntries(
		Object.entries(updates).filter(([key]) => allowedFields.has(key))
	);
	safeUpdates.lastmod = new Date().toISOString();
	const { data, error: updateError } = await locals.supabase
		.from('blogs_famous_people')
		.update(safeUpdates)
		.eq('id', id)
		.select()
		.single();
	if (updateError) throw error(400, updateError.message);
	return json({ data });
}
```

**Workflow Stage Updates:**

- Stage is stored in `content_people.stageName`, not `blogs_famous_people`
- Fetch stage from `content_people` when opening the modal (separate query if no FK)
- Update stage via a dedicated endpoint (e.g., `/api/admin/content/[id]/stage`) or a server action that updates both tables in one transaction

**For MDsvex file-based content (enneagram, community, guides):**

- These are markdown files in the repo, not database records
- Modal would show read-only view and disable Save/Done, or link to file location
- Future: Could add file-system write capability via server action

---

### 4. Component Structure

```
src/routes/admin/content-board/
├── +page.svelte              (main page, imports components)
├── +page.server.ts           (existing, add content fetch)
├── ContentCard.svelte        (new compact card component)
├── ContentEditorModal.svelte (new full-screen modal)
├── MetadataSidebar.svelte    (right panel sections)
├── MarkdownEditor.svelte     (left panel editor)
└── VersionHistoryPanel.svelte (history section)
```

---

### 5. Interaction Details

**Opening the Modal:**

- Single click on card → Opens modal
- Keyboard: Enter when card is focused
- Deep link support: `/admin/content-board?edit=[id]` (URL query param)
- Dragging only starts from the handle to avoid accidental modal opens

**Closing the Modal:**

- Click X button
- Press Escape
- Click backdrop (with unsaved changes warning if dirty)
- "Done" button (saves and closes)

**Saving:**

- "Save" button → Save without closing
- Cmd/Ctrl+S → Save without closing
- "Done" button → Save and close
- Disable Save when not dirty; "Done" can close without writing
- Auto-save draft to localStorage every 30 seconds (restore prompt on reload; clear on save)
- Show "Saving..." indicator, then "Saved" checkmark
- On save error, keep draft and show error state/toast

**Navigation:**

- Arrow keys in modal navigate between content items
- "Next" / "Previous" buttons in header

---

### 6. Responsive Behavior

**Desktop (>1200px):**

- Full split-panel layout
- 70/30 split

**Tablet (768px - 1200px):**

- 60/40 split
- Collapsible metadata panel (toggle button)

**Mobile (<768px):**

- Full screen modal
- Tabbed interface: "Content" | "Metadata"
- Floating save button

---

## Implementation Phases

### Phase 1: Compact Cards

- Redesign `ContentCard` into new compact format
- Remove inline expand, add click handler for modal
- Add enneagram color coding

### Phase 2: Basic Modal

- Create modal shell with header/close
- Implement markdown textarea (no syntax highlighting)
- Add basic metadata display (read-only)

### Phase 3: Editable Metadata

- Add form controls for each metadata field
- Implement save API endpoint
- Add save/done buttons with loading states

### Phase 4: Polish

- Add version history integration
- Add keyboard shortcuts
- Add auto-save
- Add unsaved changes warning
- URL deep linking

---

## Additional Recommendations

1. **Markdown Preview Toggle**: Add a "Preview" tab that renders the markdown as HTML, useful for checking formatting without leaving the modal.

2. **Bulk Actions**: Add checkbox selection on cards for bulk stage changes or bulk publishing.

3. **Content Health Indicators**: Show SEO scores on cards (title length, description length, missing fields).

4. **Search Within Content**: Add full-text search that searches inside markdown content, not just titles.

5. **Keyboard Navigation**: Full keyboard support for power users (j/k to move between cards, Enter to edit, Escape to close).

6. **Export/Import**: Add ability to export content as JSON or markdown file, import from file.

7. **Content Templates**: Pre-built templates for new celebrity blogs with placeholder sections.

8. **AI Integration Hooks**: Add buttons to trigger AI content suggestions/improvements (integrates with your existing OpenAI setup).

9. **Stage Change History**: Track and display when content moved between stages (audit trail).

---

## Technical Notes

### Database Schema Reference (blogs_famous_people)

Key columns available:

- `id` - Primary key
- `person` - URL-friendly name (e.g., "Gary-Vee")
- `enneagram` - Type number (1-9)
- `title` - Blog title
- `meta_title` - SEO title
- `description` - Meta description
- `content` - Full markdown content
- `type` - JSON array of categories (e.g., `["business"]`)
- `published` - Boolean
- `date` - Created date
- `lastmod` - Last modified date
- `author` - Author name
- `twitter`, `instagram`, `tiktok` - Social handles
- `wikipedia` - Wikipedia URL
- `suggestions` - Related content array
- `pic` - Image URL
- `loc` - Full URL
- `search_vector` - Full-text search (auto-generated)
- `tags` - Additional tags array
- `category` - Primary category

### Data Consistency Notes

- Prefer `category` when present; otherwise fall back to the first entry in `type[]` for card display
- Treat `content_people.stageName` as the workflow state source of truth

### Related Tables

- `blogs_famous_people_history` - Version history (last 5 content changes)
- `content_people` - Stage tracking table (stageName)

---

_Specification created: January 9, 2026_
