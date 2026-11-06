<!-- src/routes/+page.svelte -->
<script lang="ts">
	import HomePage from '$lib/components/marketing/home/HomePage.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<HomePage live={data?.live ?? null} liveTypes={data?.liveTypes ?? null} />
