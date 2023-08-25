# 9takes Svelte Rewrite/ Notes

## Why the name 9takes

9takes eludes to the enneagram and how there are 9 personalities/ worldviews/ takes on life.

## Reasons for rewrite

- Need Authentication --> Svelte Auth
- Want to use SQL db --> Supabase
- Need SSR and Static rendering strategies

## Resources I am using

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

[sk-supabase-auth](https://github.com/huntabyte/sk-supabase-auth)

[Svelte docs](https://kit.svelte.dev/docs/project-structure)
[Joy of Code- SvelteKit Authentication Using Cookies](https://www.youtube.com/watch?v=E3VG-dLCRUk)

### Generating SUPABASE TYPES

<https://supabase.com/docs/guides/api/generating-types>
`npx supabase gen types typescript --project-id "" --schema public > src/schema.ts`

### Markdown

<https://github.com/mvasigh/sveltekit-mdsvex-blog/blob/main/src/lib/components/ArticleTitle.svelte>

Validate JSONLD with <https://json-ld.org/playground/>

Rate limit API when questions go live
<https://upstash.com/blog/sveltekit-rate-limiting>

### Design

#### Card Inspo, Thank you @Hyperplexed

<https://www.youtube.com/watch?v=jMVhxBB3l0w>

### site map

npx sitemap-generator-cli 9takes.com --last-mod --change-freq weekly --priority-map "1.0"

### checkout pwa

<https://dev.to/askrodney/sveltekit-pwa-installable-app-with-offline-access-5a8n>

### Stripe

<https://github.com/srmullen/sveltekit-stripe/blob/main/src/routes/index.svelte>

### change color of images

magick party-in-street.png -alpha set -channel A -evaluate set 75% -sepia-tone 100% -modulate 100,100,200 party-in-street-try.png

cwebp "greek-statue-having-a-disagreement.png" -o "greek-statue-having-a-disagreement.webp"
cwebp -sns 70 -f 50 -size 20000 "greek-statue-having-a-disagreement.webp" -o "C:/Users/djway/Desktop/svelte/9takes/static/blogs/s-greek-statue-having-a-disagreement.webp"

### fix image size

https://www.youtube.com/watch?v=fp9eVtkQ4EA

<!--
## transitions
https://www.youtube.com/watch?v=ecP8RwpkiQw
-->

<!-- Zooom into question so it takes over the page -->
<!-- Experiment to sort emotion words -->
