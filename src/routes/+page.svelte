<!-- src/routes/+page.svelte -->
<script lang="ts">
	import HomeLandingV2 from '$lib/components/marketing/HomeLandingV2.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<HomeLandingV2 live={data?.live ?? null} />
