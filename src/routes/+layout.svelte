<script lang="ts">
	import '../app.scss';
	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import type { PageData } from './$types';
	import { webVitals } from '$lib/vitals';
	import { preparePageTransition } from '$lib/page-transition';
	import { setCookie } from '../utils/cookies';

	// Components
	import Header from '$lib/components/molecules/Header.svelte';
	import Toast from '$lib/components/molecules/Toast.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
	import BackNavigation from '$lib/components/atoms/BackNavigation.svelte';
	import CategoryNavigation from '$lib/components/atoms/CategoryNavigation.svelte';

	export let data: PageData;

	// Constants
	const VERCEL_ANALYTICS_ID = import.meta.env.VERCEL_ANALYTICS_ID;
	const PUBLIC_GOOGLE = import.meta.env.PUBLIC_GOOGLE;
	const MAX_WIDTH_PAGES = ['/', '/content-board'];

	let innerWidth = 0;

	// Types
	declare global {
		interface Window {
			gtag: (...args: any[]) => void;
			dataLayer: any[];
			clarity: (...args: any[]) => void;
		}
	}

	preparePageTransition();

	const initAnalytics = () => {
		if (dev) return;

		// Initialize Microsoft Clarity
		if (document.URL.includes('9takes')) {
			(function (c, l, a, r, i, t, y) {
				c[a] =
					c[a] ||
					function () {
						(c[a].q = c[a].q || []).push(arguments);
					};
				t = l.createElement(r);
				t.async = 1;
				t.src = 'https://www.clarity.ms/tag/' + i;
				y = l.getElementsByTagName(r)[0];
				y.parentNode.insertBefore(t, y);
			})(window, document, 'clarity', 'script', 'g3hw5t1scg');
		}

		// Initialize Web Vitals
		if (VERCEL_ANALYTICS_ID) {
			webVitals({
				path: $page.url.pathname,
				params: $page.params,
				analyticsId: VERCEL_ANALYTICS_ID
			});
		}
	};

	const initFingerprint = async () => {
		try {
			const fp = await FingerprintJS.load();
			const { visitorId } = await fp.get();

			if (visitorId) {
				const formdata = new FormData();
				formdata.append('fp', visitorId);
				setCookie('9tfingerprint', visitorId, 365);

				await fetch('/api/adder', {
					method: 'POST',
					body: formdata
				});
			}
		} catch (error) {
			console.error('Error in fingerprint processing:', error);
		}
	};

	onMount(() => {
		initAnalytics();
		initFingerprint();

		console.log(`
 ___  _        _              
/ _ \\| |_ __ _| | _____  ___ 
| (_) | __/ _\`| |/ / _ \\/ __|
 \\__, | || (_| |   <  __/\\__ \\
   /_/ \\__\\__,_|_|\\_\\___||___/
`);
	});

	// Track page changes
	$: if (browser && !dev && window.gtag) {
		window.gtag('config', PUBLIC_GOOGLE, {
			page_title: document.title,
			page_path: $page.url.pathname
		});
	}

	$: parents = data?.parents ? [...data.parents].slice(0, -1) : [];
	$: isHomePage = $page.url.pathname === '/';
	$: isSignupPage = $page.url.pathname === '/signup';
	$: isCategoryPage = $page.url.pathname.includes('/categories');
	$: shouldShowMaxWidth = !MAX_WIDTH_PAGES.includes($page.url.pathname);
</script>

<svelte:head>
	<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	{#if !dev}
		<script async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GOOGLE}"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());
			gtag('config', '{PUBLIC_GOOGLE}');
		</script>
		<link rel="preconnect" href="https://www.googletagmanager.com" />
		<link rel="preconnect" href="https://www.clarity.ms" />
		<link rel="preconnect" href="https://app.posthog.com" />
	{/if}
</svelte:head>

<svelte:window bind:innerWidth />

<Header {data} />
<Toast />

{#if !isHomePage && !isCategoryPage}
	<BackNavigation />
{/if}

{#if isCategoryPage}
	<CategoryNavigation categoryStructure={parents} />
{/if}

<main class="main {shouldShowMaxWidth ? 'column-width' : ''} {!isSignupPage ? 'pos-rel' : ''}">
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
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: clamp(0.5rem, 2vw, 1rem);
		overflow: visible;
	}

	.column-width {
		max-width: 64rem;
		margin: 0 auto;
		width: 100%;

		@media (max-width: 768px) {
			max-width: 100%;
		}
	}

	.pos-rel {
		position: relative;
	}
</style>
