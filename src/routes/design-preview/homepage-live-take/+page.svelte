<!-- src/routes/design-preview/homepage-live-take/+page.svelte -->
<script lang="ts">
	import HomeLandingV2 from '$lib/components/marketing/HomeLandingV2.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<HomeLandingV2
	preview
	previewNav={{
		badge: 'Live take',
		title: 'Live take preview — 1 question. 9 perspectives. | 9takes',
		compareHref: '/',
		compareLabel: 'Current homepage'
	}}
	live={data.live}
/>
