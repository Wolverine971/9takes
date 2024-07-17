<script lang="ts">
	import type { PageData } from './$types';
	import { webVitals } from '$lib/vitals';
	import { browser } from '$app/environment';
	import Header from '$lib/components/molecules/Header.svelte';
	import './styles.css';
	let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;
	import { dev } from '$app/environment';
	import { preparePageTransition } from '$lib/page-transition';

	preparePageTransition();

	$: if (browser && analyticsId && !dev) {
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId
		});
	}
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	import Toast from '$lib/components/molecules/Toast.svelte';
	import Analytics from '$lib/analytics.svelte';
	import { page } from '$app/stores';
	import Footer from '$lib/components/molecules/Footer.svelte';
	// import Jumbotron from '$lib/components/atoms/jumbotron.svelte';
	import BackNavigation from '$lib/components/atoms/BackNavigation.svelte';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import { onMount } from 'svelte';
	import { setCookie } from '../utils/cookies';

	export let data: PageData;
	let innerWidth = 0;
	onMount(async () => {
		// if (dev) return;
		const fp = await FingerprintJS.load();
		const fpval = await fp.get();
		const formdata = new FormData();
		formdata.append('fp', fpval?.visitorId?.toString());
		setCookie('9tfingerprint', fpval?.visitorId?.toString(), 365);
		fetch(`/api/adder`, {
			method: 'POST',
			body: formdata
		})
			.then((response) => response.text())
			.catch((error) => console.log('error', error));
	});
</script>

<svelte:head>
	<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
	<!-- Config options -->
</svelte:head>

<svelte:window bind:innerWidth />

<Analytics />
<Header {data} />

<Toast />
{#if $page.url.pathname !== '/'}
	<BackNavigation />
{/if}
<main
	class="main flexrate {$page.url.pathname !== '/' ? 'column-width' : 'column'} {$page.url
		.pathname !== '/signup'
		? 'pos-rel'
		: ''}"
>
	<!-- style={innerWidth > 760 && $page.url.pathname === '/' ? 'margin-top: 85px;' : ''} -->
	<slot />
	<Footer />
</main>

<style lang="scss">
	.jumbo-name {
		position: relative;
		font-size: 3.25rem;
		margin: 1rem;
		text-align: center;
		text-transform: uppercase;
	}

	.column-width {
		max-width: 64rem;
		border-radius: var(--base-border-radius);
	}

	.pos-rel {
		position: relative;
		// overflow: hidden;
	}

	main > a {
		display: inline-block;
		align-items: center;
		color: #260958;
		&::after {
			content: '';
			background-image: url(/icons/arrow.svg);
			display: inline-block;
			vertical-align: middle;
			align-items: center;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
		}
	}

	.flexrate {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: visible;
	}
</style>
