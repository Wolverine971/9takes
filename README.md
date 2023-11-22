# 9takes- Anonymous questions and answers with a touch of personality

## Find out what people think, feel and do

> this is a rewrite of 9takes

## Why the name 9takes

9takes comes from the 9 personality types within the Enneagram. Therefore there are 9 personalities/ worldviews/ takes on life.

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

### checkout pwa

<https://dev.to/askrodney/sveltekit-pwa-installable-app-with-offline-access-5a8n>

### Stripe

<https://github.com/srmullen/sveltekit-stripe/blob/main/src/routes/index.svelte>

### Change color of images

magick party-in-street.png -alpha set -channel A -evaluate set 75% -sepia-tone 100% -modulate 100,100,200 party-in-street-try.png

cwebp "paint-transpo.jpeg" -o "paint-transpo.webp"
cwebp -sns 70 -f 50 -size 20000 "paint-transpo.webp" -o "/Users/djwayne/Downloads/s-paint-transpo.webp"

### fix image size

[link](https://www.youtube.com/watch?v=fp9eVtkQ4EA)

<!--
## transitions
https://www.youtube.com/watch?v=ecP8RwpkiQw
-->

<!-- Zooom into question so it takes over the page -->
<!-- Experiment to sort emotion words -->

 <!-- npx stylelint "**/*.css" --fix -->
