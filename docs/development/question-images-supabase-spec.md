<!-- docs/development/question-images-supabase-spec.md -->

# Supabase Question Images Spec

**Status:** Draft  
**Owner:** 9takes  
**Date:** 2026-02-05

## Summary

Move all question image storage from AWS S3 to Supabase Storage, using the existing `questions` bucket. Remove AWS dependencies from the codebase. Missing legacy images are acceptable.

## Decisions

- **Bucket name:** `questions`
- **Path structure:** `images/{question_url}/{image_id}.{ext}`
- **Public access:** Bucket is public to support OG/Twitter meta tags.
- **Migration:** No migration of existing S3 images. Missing images are acceptable.
- **DB column:** `questions.img_url` stores the **storage path**, not a full URL.

## Current State

- S3 upload happens in `src/routes/questions/create/+page.server.ts`.
- S3 URL is hard-coded in `src/routes/questions/[slug]/+page.svelte`.
- Supabase Storage upload already exists for image updates in `src/routes/questions/[slug]/+page.server.ts`.
- `questions.img_url` is **nullable** per `database.types.ts`.

## New Storage Design

### Storage Path

```
images/{question_url}/{image_id}.{ext}
```

Examples:

- `images/why-do-i-overthink/8f3f6b5c-2d4e-4b5f-9a0b-7e3d6f2f4d7a.png`

### Public URL Pattern

```
${PUBLIC_SUPABASE_URL}/storage/v1/object/public/questions/{path}
```

## Database Notes

`questions.img_url` is nullable.  
Reference: `database.types.ts` shows `img_url: string | null` in `questions` row/insert/update types.

## Queries

### Find Questions With Images

```sql
select id, url, img_url, created_at
from questions
where img_url is not null and img_url <> ''
order by created_at desc;
```

### Remove Image References (Keep Questions)

```sql
update questions
set img_url = null
where img_url is not null and img_url <> '';
```

## Required Code Changes

- `src/routes/questions/create/+page.server.ts`
  - Replace S3 upload with Supabase Storage upload.
  - Store storage path in `img_url`.
- `src/routes/questions/[slug]/+page.server.ts`
  - Align image upload path structure with new design.
- `src/routes/questions/[slug]/+page.svelte`
  - Replace S3 URL with Supabase public URL.
- `src/lib/server/elasticSearch.ts`
  - Ensure `imgUrl` stores only short paths, never base64.
- `package.json`
  - Remove `aws-sdk` dependency.
- `pnpm-lock.yaml`
  - Remove `aws-sdk` lock entries.

## Implementation Steps

1. Create shared helper for parsing data URLs and uploading to Supabase Storage.
2. Update question creation flow to use Supabase upload.
3. Update question image update flow to use the same path structure.
4. Update image URL rendering to use Supabase public URLs.
5. Remove AWS dependency from `package.json` and lockfile.

## Acceptance Criteria

- Creating a question uploads its image to Supabase `questions` bucket.
- `questions.img_url` stores the storage path.
- Question pages render images from Supabase public URLs.
- No `aws-sdk` usage or S3 URLs remain.
