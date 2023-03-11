# 9takes Svelte Rewrite


## Why the name 9takes
9takes eludes to the enneagram and how there are 9 types. What follows from that is that there are 9 different ways to view the world or 9 takes on life. Though there are potentially infinite ways to view the world there seem to be 9 core archetypes that nicely group people together and brings together both philosophy and psychology.
## Reasons for rewrite

- Need Authentication --> Svelte Auth
- Want to use SQL db --> Supabase
- Need SSR and Static rendering strategies

## Resources I am using

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

[sk-supabase-auth](https://github.com/huntabyte/sk-supabase-auth)

[Svelte docs](https://kit.svelte.dev/docs/project-structure)
[Joy of Code- SvelteKit Authentication Using Cookies](https://www.youtube.com/watch?v=E3VG-dLCRUk)

## Generating SUPABASE TYPES

<https://supabase.com/docs/guides/api/generating-types>
`npx supabase gen types typescript --project-id "nhjjzcsnmyotyhykbajc" --schema public > src/schema.ts`

## Markdown

<https://github.com/mvasigh/sveltekit-mdsvex-blog/blob/main/src/lib/components/ArticleTitle.svelte>

Validate JSONLD with <https://json-ld.org/playground/>

Rate limit API when questions go live
<https://upstash.com/blog/sveltekit-rate-limiting>

Design

### Card Inspo, Thank you @Hyperplexed
<https://www.youtube.com/watch?v=jMVhxBB3l0w>


## site map
npx sitemap-generator-cli 9takes.com --last-mod --change-freq weekly --priority-map "1.0"