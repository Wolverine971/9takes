<script lang="ts">
	import type { PageData } from './$types';
	import Header from './Header.svelte';
	import './styles.css';

	import Toast from '$lib/components/molecules/Toast.svelte';
	import { page } from '$app/stores';
	import Footer from './Footer.svelte';
	export let data: PageData;
</script>

<div class="app">
	{#if $page.url.pathname !== '/'}
		<Header {data} />
	{/if}

	<Toast />
	<main class={$page.url.pathname !== '/' ? 'column-width' : ''}>
		<slot />
	</main>
	{#if $page.url.pathname !== '/'}
		<Footer />
	{/if}
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		// align-items: center;
		padding: 1rem;
		width: 100%;
		// max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
	.column-width {
		max-width: 64rem;
	}
	body::-webkit-scrollbar {
		width: 4px;
	}

	body::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}

	body::-webkit-scrollbar-thumb {
		background-color: darkgrey;
		outline: 0.5px solid slategrey;
	}
</style>
