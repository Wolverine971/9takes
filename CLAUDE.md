# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

9takes is a personality-based Q&A platform built on the Enneagram personality system. The platform features anonymous questions and answers with personality context, using a unique "give-first" commenting system where users must contribute before seeing others' responses.

**Core Concept**: "See the emotions behind every take" - One situation, 9 ways to see it.

## Development Commands

### Essential Commands
```bash
# Development
pnpm dev              # Start development server (port 5173)
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm check            # Type-check TypeScript and Svelte
pnpm lint             # Lint code (Prettier + ESLint)
pnpm format           # Auto-format code

# Testing
pnpm test             # Run Playwright E2E tests
pnpm test:unit        # Run unit tests (Vitest)

# Utilities
pnpm clean            # Clean build artifacts
```

### Package Management
This project uses pnpm. Install dependencies with:
```bash
pnpm install
```

## Architecture Overview

### Tech Stack
- **Framework**: SvelteKit 2.x with TypeScript
- **Database**: Supabase (PostgreSQL with real-time features)
- **Deployment**: Vercel
- **Styling**: TailwindCSS + SCSS
- **Content**: MDsvex for Markdown processing
- **Search**: Elasticsearch
- **UI Components**: Flowbite-Svelte

### Project Structure
```
src/
├── routes/                    # SvelteKit routes
│   ├── questions/            # Main Q&A platform
│   ├── personality-analysis/ # Celebrity Enneagram analyses
│   ├── enneagram-corner/    # Educational content
│   ├── api/                 # Server-side API endpoints
│   └── admin/               # Admin panel
├── lib/
│   ├── components/          # Reusable UI components
│   ├── utils/              # Helper functions
│   └── supabase.ts         # Database client
├── blog/                   # Markdown blog content
├── emails/                 # Email templates
└── scss/                   # Global styles
```

### Key Features Implementation

1. **Give-First Commenting System**
   - Located in: `src/routes/questions/[slug]/+page.svelte`
   - Users must submit a comment before viewing others' responses
   - Tracks participation via fingerprinting for anonymous users

2. **Personality Context**
   - All users have an Enneagram type (1-9)
   - Comments can be filtered by personality type
   - Located in: `src/lib/components/questions/CommentList.svelte`

3. **Content Management**
   - Blog posts: `src/blog/` directory with MDsvex
   - Questions stored in Supabase `questions` table
   - Comments in nested structure supporting replies

### Database Schema

Key tables:
- `questions`: User-submitted questions with context
- `comments`: Nested comment system with personality types
- `profiles`: User profiles with Enneagram types
- `blog_posts`: SEO-focused blog content

### API Patterns

Server-side routes follow this pattern:
```typescript
// src/routes/api/[resource]/+server.ts
export async function GET({ locals, url }) {
  const supabase = locals.supabase;
  // Implementation
}
```

### Component Patterns

Components use:
- TypeScript for type safety
- Svelte stores for state management
- TailwindCSS for styling
- Props validation with TypeScript interfaces

Example:
```svelte
<script lang="ts">
  export let enneagramType: number;
  export let comment: Comment;
</script>
```

### Environment Variables

Required environment variables (create `.env` file):
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `ELASTIC_NODE`
- `ELASTIC_API_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`

### Content Strategy

The platform has two main content areas:

1. **User-Generated Q&A** (`/questions`)
   - Anonymous participation
   - Personality-based filtering
   - Give-first mechanic

2. **SEO Content** (`/blog`, `/personality-analysis`)
   - Celebrity Enneagram analyses
   - Educational content about personality types
   - Drives organic traffic to the platform

### Testing Approach

- E2E tests with Playwright in `/tests`
- Unit tests with Vitest (minimal coverage currently)
- Test database migrations in `/supabase/migrations`

### Deployment

Deployed to Vercel with:
- Adapter: `@sveltejs/adapter-vercel`
- Build command: `pnpm build`
- Output directory: `.vercel`

### Important Implementation Notes

1. **Authentication**: Uses Supabase Auth with SvelteKit helpers
2. **Real-time**: Socket.io for live features
3. **Analytics**: Custom analytics system tracking user engagement
4. **Email**: Custom email system using Google APIs
5. **Search**: Elasticsearch for content discovery
6. **Markdown Processing**: MDsvex with custom configuration in `mdsvex.config.js`

### Common Development Tasks

When implementing new features:
1. Check existing patterns in similar components
2. Use TypeScript interfaces for data structures
3. Follow the give-first pattern for new interactive features
4. Ensure mobile responsiveness with Tailwind
5. Add appropriate meta tags for SEO

### Performance Considerations

- Use SvelteKit's built-in preloading
- Implement proper image optimization
- Utilize Supabase's row-level security
- Cache frequently accessed data