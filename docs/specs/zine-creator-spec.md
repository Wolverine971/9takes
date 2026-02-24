<!-- docs/specs/zine-creator-spec.md -->

# Zine Creator - Feature Spec

> **Route**: `/admin/asset-generators/zine-creator`
> **Status**: Draft
> **Date**: 2026-02-24

---

## Overview

Zine Creator converts 9takes blog posts into print-ready zines with correct imposition.

Core capabilities:

- Import a supported 9takes blog URL
- Choose zine format and valid page count
- Edit layout/style/content distribution
- Export print-ready and reader-friendly files

The route is admin-only through existing `/admin` layout auth.

---

## Supported Content Sources

### Included in v1

- **Enneagram Corner main posts**: `/enneagram-corner/[slug]` (MDsvex)
- **Enneagram Corner mental-health posts**: `/enneagram-corner/mental-health/[slug]` (MDsvex)
- **Personality Analysis posts**: `/personality-analysis/[slug]` (Supabase `blogs_famous_people`)

### Explicitly excluded in v1

- `/enneagram-corner/subtopic/[slug]`
- Non-9takes domains
- Custom uploaded text/docs

---

## Import Safety and Validation

The importer must never fetch arbitrary remote content.

Validation rules:

1. Parse with `new URL(input)`.
2. Allow hostnames only: `9takes.com`, `www.9takes.com`.
3. Allow paths only matching supported routes above.
4. Ignore query strings and fragments for slug resolution.
5. Reject unsupported/invalid URLs with clear error copy.
6. Load content only from local MDsvex modules or Supabase (never by outbound HTTP fetch).

---

## Zine Formats

All formats are produced from US Letter (`8.5" x 11"`).

| Format           | Finished Size   | Valid Pages         | Sheets Needed | Print Model                                 |
| ---------------- | --------------- | ------------------- | ------------- | ------------------------------------------- |
| **Half-Page**    | `5.5" x 8.5"`   | `8, 12, 16, 20, 24` | `pages / 4`   | 2-up per side, duplex saddle-stitch         |
| **Quarter-Page** | `4.25" x 5.5"`  | `8, 16, 24`         | `pages / 8`   | 4-up per side, duplex + cut + saddle-stitch |
| **Mini Zine**    | `2.75" x 4.25"` | `8` fixed           | `1 sheet`     | single-sheet fold-and-cut (no duplex)       |

Page count constraints:

- Half-page: multiple of `4`
- Quarter-page: multiple of `8`
- Mini: exactly `8`

---

## User Flow

### Step 1: Import

User can paste URL or pick recent posts.

Server load:

- Returns recent Enneagram + mental-health posts (excluding subtopics)
- Returns recent published Personality Analysis rows

Fetch action:

- Validates source + slug from input URL
- Loads raw content from source of truth
- Returns normalized payload:
  - `title`
  - `author`
  - `date`
  - `description`
  - `enneagram` (`1-9` or `null`)
  - `bodyHtml`
  - `headings[]`
  - `images[]`
  - `sourceUrl`

### Step 2: Format + Page Count

The tool estimates content length and recommends nearest valid page count **for the selected format**.

Recommendation rule:

- Half-page: nearest of `[8, 12, 16, 20, 24]`
- Quarter-page: nearest of `[8, 16, 24]`
- Mini: fixed `8`
- On ties, choose larger page count to reduce truncation risk

### Step 3: Customize

Four tabs:

#### Import Tab

- URL input + source validation feedback
- Recent post picker (Enneagram / Personality Analysis)

#### Layout Tab

- Cover fields (title, subtitle/persona, author, date, type badge)
- Section picker from parsed `h2` headings
- Drag-to-reorder sections
- Back-cover settings (QR, CTA, branding)
- Image placement controls (include/exclude, full-bleed/inset/rounded)

#### Style Tab

- Enneagram-based color preset + custom override
- Heading font family
- Body font size (`9pt`, `10pt`, `11pt`)
- Pull quote behavior (auto/manual)
- Page numbers (on/off + position)

#### Export Tab

- Print-ready PDF
- Reader PDF
- Page images (PNG)
- Instruction sheet PDF (separate file)

### Step 4: Preview + Export

Split-pane UI:

- Left: controls (tabs)
- Right: live preview

Preview features:

- Single page view
- Spread view
- Page thumbnails
- Zoom

---

## Page Templates

Standard booklet structure:

1. Cover (`page 1`)
2. Interior content pages
3. Optional dedicated image pages
4. Back cover (`last page`)

Back cover includes QR to canonical source URL.

---

## Enneagram Color Palettes

Default style presets (user can override):

| Type | Name          | Primary   | Accent    | Background |
| ---- | ------------- | --------- | --------- | ---------- |
| 1    | Perfectionist | `#1e3a5f` | `#4a90d9` | `#f0f4f8`  |
| 2    | Helper        | `#8b2252` | `#d4637a` | `#fdf2f4`  |
| 3    | Achiever      | `#b8860b` | `#f0c040` | `#fffdf0`  |
| 4    | Individualist | `#4a0e4e` | `#9b59b6` | `#f8f0fc`  |
| 5    | Investigator  | `#1a3c34` | `#2e8b57` | `#f0f8f4`  |
| 6    | Loyalist      | `#8b4513` | `#cd853f` | `#fdf6f0`  |
| 7    | Enthusiast    | `#cc5500` | `#ff8c42` | `#fff8f0`  |
| 8    | Challenger    | `#8b0000` | `#dc3545` | `#fdf0f0`  |
| 9    | Peacemaker    | `#2f4f4f` | `#5f9ea0` | `#f0f8f8`  |

---

## Print Specifications

### Safe Margins

| Edge               | Half-Page | Quarter-Page | Mini    |
| ------------------ | --------- | ------------ | ------- |
| Top                | `0.5"`    | `0.375"`     | `0.25"` |
| Bottom             | `0.5"`    | `0.375"`     | `0.25"` |
| Outside            | `0.5"`    | `0.375"`     | `0.25"` |
| Gutter (fold side) | `0.625"`  | `0.5"`       | `0.25"` |

### Content Area

| Format       | Content Width | Content Height |
| ------------ | ------------- | -------------- |
| Half-Page    | `4.375"`      | `7.5"`         |
| Quarter-Page | `3.375"`      | `4.75"`        |
| Mini         | `2.25"`       | `3.75"`        |

---

## Imposition Rules

### Half-Page (2-up duplex saddle-stitch)

For `N` pages (`N % 4 === 0`), each sheet holds 4 page-sides.

Page pairs:

- `front`: `[N - 2i, 2i + 1]`
- `back`: `[2i + 2, N - 2i - 1]`

Output layout:

- Letter landscape (`11" x 8.5"`)
- Two zine pages per PDF page
- Duplex print, flip on short edge

### Quarter-Page (4-up duplex, 8 pages per sheet)

For `N` pages (`N % 8 === 0`), each full letter sheet contains **two half-sheet signatures**:

- top half (one folded leaf, 4 pages)
- bottom half (one folded leaf, 4 pages)

Each half-sheet follows normal saddle math. Combined sheet mapping:

```text
Sheet i, Front (portrait letter, 2x2):
Top:    [N - 4i]     [4i + 1]
Bottom: [N - 4i - 2] [4i + 3]

Sheet i, Back:
Top:    [4i + 2]     [N - 4i - 1]
Bottom: [4i + 4]     [N - 4i - 3]
```

Example (`N = 8`, sheet 0):

```text
Front: Top [8][1], Bottom [6][3]
Back:  Top [2][7], Bottom [4][5]
```

Output layout:

- Letter portrait (`8.5" x 11"`)
- Four zine pages per PDF page (`2x2`)
- Duplex print, flip on short edge
- Cut horizontally, then fold each half at vertical center

### Mini Zine (single sheet)

Fixed 8-page panel layout:

```text
Front of one landscape letter sheet:
Top row:    8(rot180), 1, 2, 7(rot180)
Bottom row: 5(rot180), 4, 3, 6(rot180)
```

Single-sided only. Include a marked center cut guide.

---

## Technical Design

### File Structure

```text
src/routes/admin/asset-generators/zine-creator/
├── +page.server.ts
├── +page.svelte
└── zine-utils.ts
```

### `+page.server.ts` load

```typescript
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;

	const enneagramBlogs = await getRecentEnneagramBlogs({
		limit: 10,
		includeMentalHealth: true,
		includeSubtopic: false
	});

	const { data: peopleBlogs } = await supabase
		.from('blogs_famous_people')
		.select('person, title, enneagram, description, lastmod, published')
		.eq('published', true)
		.order('lastmod', { ascending: false })
		.limit(10);

	return {
		enneagramBlogs: enneagramBlogs ?? [],
		peopleBlogs: peopleBlogs ?? []
	};
};
```

### `fetchBlog` action

```typescript
export const actions: Actions = {
	fetchBlog: async ({ request, locals }) => {
		const form = await request.formData();
		const inputUrl = String(form.get('url') ?? '');

		const source = validateAndResolveSource(inputUrl); // throws on invalid path/host
		const blog = await loadBlogFromSource(source, locals.supabase);

		return {
			title: blog.title,
			author: blog.author,
			date: blog.date,
			description: blog.description,
			enneagram: normalizeEnneagram(blog.enneagram), // number 1-9 or null
			bodyHtml: blog.bodyHtml,
			headings: blog.headings,
			images: blog.images,
			sourceUrl: source.canonicalUrl
		};
	}
};
```

### Enneagram normalization

`blogs_famous_people.enneagram` is currently a string field.

Normalization rule:

- Parse to integer if value is `"1"`..`"9"` or `1..9`
- Otherwise return `null`

---

## Content Processing Pipeline

When a blog is loaded:

1. **Resolve source** - validate hostname/path and identify source type.
2. **Load raw content** - MDsvex module (Enneagram) or DB row (Personality Analysis).
3. **Render to HTML**:
   - Enneagram: rendered MDsvex HTML
   - Personality Analysis: existing server blog processor (`processBlogContent`)
4. **Sanitize HTML** - remove scripts/forms/interactive embeds, keep safe structural tags.
5. **Extract structure** - headings (`h2`) and section boundaries.
6. **Extract pull quote candidates**:
   - `<blockquote>` text
   - callout content such as `QuickAnswer`/`InsightBox` when present
7. **Extract image assets** - gather `img[src]` plus alt/caption when available.
8. **Paginate** - estimate and fit content into selected page count + format constraints.

Important ordering rule:

- Pull-quote extraction happens **before** removing component placeholders/callout wrappers.

---

## PDF and Image Rendering

Approach (same pattern as poster generator):

- Build hidden page render targets in DOM
- Render each page with `html-to-image` at export pixel ratio
- Compose PDFs with `jsPDF`

Preview/export density:

- On-screen preview target: 150 DPI equivalent
- Export target: 300 DPI equivalent

`zine-utils.ts` contains:

- page fitting helpers
- half-page imposition
- quarter-page imposition (4-up)
- mini-zine layout
- reader vs print-ready export assemblers

---

## Export Options

| Export                    | Format                                      | Notes                              |
| ------------------------- | ------------------------------------------- | ---------------------------------- |
| **Print-Ready PDF**       | Imposed pages, format-specific sheet layout | For physical assembly              |
| **Reader PDF**            | Sequential finished pages                   | For phone/screen reading           |
| **Page Images (PNG)**     | One PNG per page at 300 DPI                 | For custom downstream use          |
| **Instruction Sheet PDF** | Standalone sheet with fold/cut diagrams     | Separate file from print-ready PDF |

Instruction sheet policy:

- Always generated as a **separate file**.
- Print-ready imposed PDF includes booklet pages only.
- This avoids accidental extra pages in print runs.

---

## UI Layout

Matches `/admin/asset-generators/poster-generator` split-pane structure.

```text
Header: [Export ▼] [Copy]
Main:
- Left pane: Import | Layout | Style | Export tabs
- Right pane: live page preview, spread toggle, pagination, thumbnails
```

---

## Content Fitting Algorithm

Rules:

1. Measure content in target format dimensions.
2. Break at paragraph boundaries only.
3. Keep headings with at least 2 following lines.
4. Place pull quotes roughly every 3-4 pages when space allows.
5. Anchor images near related paragraphs; promote to image page when needed.
6. If short on content, use spacing and quote emphasis (not large empty regions).
7. If over limit:
   - suggest higher valid page count first
   - only truncate if user confirms
   - append `"Read more online"` marker when truncated

---

## Fold and Assembly Instructions

Instruction sheet includes separate diagrams for each format.

### Half-Page

1. Print duplex, flip on short edge.
2. Keep sheets in order.
3. Fold stack in half.
4. Staple along spine.

### Quarter-Page (true 4-up per side)

1. Print duplex, flip on short edge.
2. Cut each sheet horizontally at center (top half + bottom half).
3. Keep top/bottom halves from the same sheet paired.
4. Fold each half at vertical center.
5. Nest leaves in sheet order (`sheet 1` outermost), then staple spine.

### Mini Zine

1. Print single-sided.
2. Fold lengthwise.
3. Fold widthwise and unfold.
4. Cut center slit on marked segment only.
5. Refold and collapse into booklet.

---

## Scope and Dependencies

### Existing dependencies used

- `jsPDF`
- `html-to-image`
- `qrcode`
- existing server markdown/content processing utilities

### New files

- `src/routes/admin/asset-generators/zine-creator/+page.server.ts`
- `src/routes/admin/asset-generators/zine-creator/+page.svelte`
- `src/routes/admin/asset-generators/zine-creator/zine-utils.ts`

### Out of scope for v1

- Server-side rendering with Puppeteer
- A4 or non-letter paper presets
- `/enneagram-corner/subtopic/*` imports
- Non-blog freeform content uploads
- Batch generation
