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
	import Header from '$lib/components/molecules/Header.svelte';
	import Toast from '$lib/components/molecules/Toast.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
	import BackNavigation from '$lib/components/atoms/BackNavigation.svelte';

	export let data: PageData;

	const VERCEL_ANALYTICS_ID = import.meta.env.VERCEL_ANALYTICS_ID;
	const PUBLIC_GOOGLE = import.meta.env.PUBLIC_GOOGLE;
	const maxWidthPages = ['/', '/content-board'];

	let innerWidth = 0;

	preparePageTransition();

	function loadAnalytics() {
		if (browser && !dev) {
			// Google Analytics
			const gaScript = document.createElement('script');
			gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GOOGLE}`;
			gaScript.defer = true;
			document.head.appendChild(gaScript);

			window.dataLayer = window.dataLayer || [];
			function gtag(...args: any[]) {
				dataLayer.push(args);
			}
			gtag('js', new Date());
			gtag('config', PUBLIC_GOOGLE);

			// Microsoft Clarity
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

			// Web Vitals
			if (VERCEL_ANALYTICS_ID) {
				webVitals({
					path: $page.url.pathname,
					params: $page.params,
					analyticsId: VERCEL_ANALYTICS_ID
				});
			}
		}
	}

	onMount(async () => {
		window.addEventListener('load', loadAnalytics);

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

	$: if (browser && !dev && typeof gtag !== 'undefined') {
		gtag('config', PUBLIC_GOOGLE, {
			page_title: document.title,
			page_path: $page.url.pathname
		});
	}
</script>

<svelte:head>
	<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	{#if !dev}
		<link rel="preconnect" href="https://www.googletagmanager.com" />
		<link rel="preconnect" href="https://www.clarity.ms" />
		<link rel="preconnect" href="https://app.posthog.com" />
	{/if}
</svelte:head>

<svelte:window bind:innerWidth />

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
		min-height: calc(100vh - 60px);
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
</style>
