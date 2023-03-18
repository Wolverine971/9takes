<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import Jumbotron from '$lib/components/atoms/jumbotron.svelte';
	import Footer from '../Footer.svelte';
	export let data: PageData;
</script>

<div class="app">
	{#if $page.url.pathname === '/blog'}
		<Jumbotron
			image={'background2.png'}
			showIcon={false}
			text={'9takes Blogs'}
			subtext={''}
			aspectRatio={'16/5'}
		/>
	{/if}
	<slot />
</div>
