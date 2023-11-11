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
	export let data: PageData;
	let innerWidth = 0;

	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import { onMount } from 'svelte';

	onMount(async () => {
		// if (dev) return;

		const fp = await FingerprintJS.load();
		const fpval = await fp.get();

		const formdata = new FormData();
		formdata.append('fingerprint', fpval?.visitorId?.toString());

		await fetch(`/api/adder`, {
			method: 'POST',
			body: formdata
		})
			.then((response) => response.text())
			.catch((error) => console.log('error', error));
	});
</script>

<svelte:window bind:innerWidth />

<Analytics />
<Header {data} />

<Toast />
{#if $page.url.pathname !== '/'}
	<BackNavigation />
{/if}
<main
	class="{$page.url.pathname !== '/' ? 'column-width' : 'column'} {$page.url.pathname !== '/signup'
		? 'pos-rel'
		: ''}"
>
	<!-- style={innerWidth > 760 && $page.url.pathname === '/' ? 'margin-top: 85px;' : ''} -->
	<slot />
	<Footer {data} />
</main>

<style lang="scss">
	@media (prefers-reduced-motion: no-preference) {
		[style*='--tag'] {
			view-transition-name: var(--tag);
		}
	}

	.content-display {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
	}
	.jumbo-name {
		position: relative;
		font-size: 3.25rem;
		// font-weight: 400;
		margin: 1rem;
		// font-family: 'Source Code Pro', monospace;
		// color: var(--color-paladin-1, white);
		text-align: center;
		text-transform: uppercase;
	}

	.link {
		opacity: 0.9;
		font-size: 1.5rem;
		// font-weight: 400;
		letter-spacing: 0.3rem;
		text-decoration: none;
		text-align: center;
		text-transform: uppercase;
	}

	// .mcard {
	// 	/* --mask: linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0.5)); */
	// 	/* --dotsColor: 255 255 255; */
	// 	--bg: radial-gradient(
	// 		circle at center,
	// 		rgb(var(--dotsColor)) 3%,
	// 		rgb(var(--dotsColor) / 0.4) var(--dotRadius, 70%)
	// 	);
	// 	/* --bgSize: var(--size); */
	// 	/* --cardBg: linear-gradient(135deg, hotpink, blue); */
	// 	background: linear-gradient(135deg, hotpink, blue);
	// 	background: var(--cardBg);
	// 	overflow: hidden;
	// 	border: 2px solid;
	// 	-o-border-image: linear-gradient(135deg, hotpink, blue) 30;
	// 	/* border-image: linear-gradient(135deg, hotpink, blue) 30; */
	// 	-o-border-image: var(--cardBg) 30;
	// 	/* border-image: var(--cardBg) 30; */
	// }

	// .rcard {
	// 	display: flex;
	// 	flex-direction: column;
	// 	margin: 1rem;
	// 	margin: var(--card-margin);
	// 	border-radius: 10px;
	// 	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	// 	padding: 0.8rem 1rem;
	// 	padding: var(--card-padding);
	// }

	// .halftone.s-7IPF32Wcq3s8.s-7IPF32Wcq3s8 {
	// 	position: relative;
	// 	aspect-ratio: 1;
	// 	background: rgb(0, 0, 0);
	// 	/* filter: contrast(20); */
	// 	/* filter: contrast(var(--contrast, 20)); */
	// 	/* mix-blend-mode: multiply; */
	// 	/* mix-blend-mode: var(--blendMode, multiply); */
	// }

	// .halftone.s-7IPF32Wcq3s8.s-7IPF32Wcq3s8::before {
	// 	content: '';
	// 	position: fixed;
	// 	top: 0;
	// 	right: 0;
	// 	bottom: 0;
	// 	/* mix-blend-mode: var(--blendMode, multiply); */
	// 	left: 0;
	// 	background-image: var(--bg);
	// 	background-size: 0.75rem 0.75rem;
	// 	background-size: var(--bgSize, 0.75rem) var(--bgSize, 0.75rem);
	// 	background-repeat: round;
	// 	background-position: 0 0, calc(0.75rem / 2) calc(0.75rem / 2);
	// 	background-position: 0 0, var(--bgPosition) var(--bgPosition);
	// 	-webkit-mask-image: linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0.5));
	// 	-webkit-mask-image: var(--mask);
	// 	mask-image: linear-gradient(rgb(0, 0, 0), rgba(0, 0, 0, 0.5));
	// 	mask-image: var(--mask);
	// 	-webkit-mask-size: cover;
	// 	mask-size: cover;
	// 	-webkit-mask-position: center;
	// 	mask-position: center;
	// 	transition: background-size 100ms;
	// }
	// .app {
	// 	display: flex;
	// 	flex-direction: column;
	// 	min-height: 100vh;
	// }

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		// align-items: center;

		width: 100%;
		// max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
	.column-width {
		max-width: 64rem;
		// background-color: #ffffff;
		border-radius: 5px;
	}
	.pos-rel {
		position: relative;
		overflow: hidden;
	}

	.column {
		padding: 0;
		margin: 0;
	}

	main > a {
		display: inline-block;
		align-items: center;
		color: #260958;

		&::after {
			content: '';

			background-image: url('/icons/arrow.svg');
			display: inline-block;
			vertical-align: middle;
			align-items: center;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
		}
	}
	@media (min-width: 768px) {
		main {
			padding: 2rem;
		}
	}
</style>
