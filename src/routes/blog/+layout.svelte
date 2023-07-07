<script lang="ts">
	import type { PageData } from './$types';
	// import Layout from '$lib/components/blog/layout.svelte';
	import { page } from '$app/stores';
	import Jumbotron from '$lib/components/atoms/jumbotron.svelte';
</script>

<!-- <Layout> -->
<!-- <div class="app"> -->
{#if $page.url.pathname === '/blog'}
	<Jumbotron
		image={'background4.webp'}
		showIcon={false}
		text={'The Blog'}
		subtext={''}
		aspectRatio={''}
	>
		<p class="jumbo-name bold-shadow " data-value={'The Blog'}>{'The Blog'}</p>
	</Jumbotron>
{/if}
<slot />
<!-- </div> -->

<!-- </Layout> -->
<style>
	.jumbo-name {
		position: relative;
		font-size: 3.25rem;
		font-weight: 400;
		margin: 1rem;
		font-family: 'Source Code Pro', monospace;
		color: white;
		text-align: center;
		text-transform: uppercase;
	}
</style>
