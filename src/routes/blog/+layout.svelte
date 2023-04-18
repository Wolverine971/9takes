<script lang="ts">
	import type { PageData } from './$types';
	import Layout from '$lib/components/blog/layout.svelte';
	import { page } from '$app/stores';
	import Jumbotron from '$lib/components/atoms/jumbotron.svelte';
</script>

<Layout>
	<div class="app">
		{#if $page.url.pathname === '/blog'}
			<Jumbotron
				image={'background4.png'}
				showIcon={false}
				text={'9takes Blogs'}
				subtext={''}
				aspectRatio={''}
			/>
		{/if}
		<slot />
	</div>
</Layout>
