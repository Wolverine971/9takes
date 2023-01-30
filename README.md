# 9takes Svelte Rewrite


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
https://supabase.com/docs/guides/api/generating-types
`npx supabase gen types typescript --project-id "nhjjzcsnmyotyhykbajc" --schema public > src/schema.ts`