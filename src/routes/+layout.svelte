<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import type { PageData } from './$types';
	import { webVitals } from '$lib/vitals';
	import { preparePageTransition } from '$lib/page-transition';
	import { setCookie } from '../utils/cookies';
	import Header from '$lib/components/molecules/Header.svelte';
	import Toast from '$lib/components/molecules/Toast.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
	import BackNavigation from '$lib/components/atoms/BackNavigation.svelte';
	import Analytics from '$lib/analytics.svelte';
	let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;
	import './styles.css';

	preparePageTransition();

	$: if (browser && analyticsId && !dev) {
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId
		});
		// injectSpeedInsights();
	}

	export let data: PageData;
	let innerWidth = 0;
	onMount(async () => {
		try {
			const fp = await FingerprintJS.load();
			const fpval = await fp.get();
			const visitorId = fpval?.visitorId?.toString();
			if (visitorId) {
				const formdata = new FormData();
				formdata.append('fp', visitorId);
				setCookie('9tfingerprint', visitorId, 365);
				await fetch(`/api/adder`, {
					method: 'POST',
					body: formdata
				});
			}
		} catch (error) {
			console.error('Error in fingerprint processing:', error);
		}
	});

	const maxWidthPages = ['/', '/content-board'];
</script>

<svelte:head>
	<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<svelte:window bind:innerWidth />

<Analytics />
<Header {data} />

<Toast />
{#if $page.url.pathname !== '/'}
	<BackNavigation />
{/if}
<main
	class="main {!maxWidthPages.includes($page.url.pathname) ? 'column-width' : 'column'} {$page.url
		.pathname !== '/signup'
		? 'pos-rel'
		: ''}"
>
	<slot />
</main>
<Footer />

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: calc(100vh - 60px); // Adjust based on your header height
		padding: 1rem;
		overflow: visible;
	}

	.column-width {
		max-width: 64rem;
		margin: 0 auto;
		width: 100%;
	}

	.pos-rel {
		position: relative;
	}

	@media (max-width: 768px) {
		.main {
			padding: 0.5rem;
		}

		.column-width {
			max-width: 100%;
		}
	}

	main > a {
		display: inline-flex;
		align-items: center;
		color: var(--primary-dark);
		text-decoration: none;

		&::after {
			content: '';
			background-image: url(/icons/arrow.svg);
			display: inline-block;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
			margin-left: 0.5em;
		}
	}
</style>
