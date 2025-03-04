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
	let isMobile = false;

	// Track swipe gestures for mobile
	let touchStartX = 0;
	let touchEndX = 0;

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

	// Handle swipe gestures for navigation
	const handleTouchStart = (e) => {
		touchStartX = e.changedTouches[0].screenX;
	};

	const handleTouchEnd = (e) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	};

	const handleSwipe = () => {
		// Only process swipe on mobile
		if (!isMobile) return;

		const swipeThreshold = 100; // Minimum swipe distance
		const swipeDistance = touchEndX - touchStartX;

		if (swipeDistance > swipeThreshold) {
			// Swipe right - go back
			window.history.back();
		}
	};

	onMount(() => {
		initAnalytics();
		initFingerprint();

		// Update mobile status based on window width
		updateMobileStatus();

		console.log(`
 ___  _        _              
/ _ \\| |_ __ _| | _____  ___ 
| (_) | __/ _\`| |/ / _ \\/ __|
 \\__, | || (_| |   <  __/\\__ \\
   /_/ \\__\\__,_|_|\\_\\___||___/
`);
	});

	// Update mobile status when window resizes
	const updateMobileStatus = () => {
		isMobile = innerWidth <= 768;
	};

	// Track page changes
	$: if (browser && !dev && window.gtag) {
		window.gtag('config', PUBLIC_GOOGLE, {
			page_title: document.title,
			page_path: $page.url.pathname
		});
	}

	// Update mobile status when window width changes
	$: {
		innerWidth;
		if (browser) updateMobileStatus();
	}

	$: parents = data?.parents ? [...data.parents].slice(0, -1) : [];
	$: isHomePage = $page.url.pathname === '/';
	$: isSignupPage = $page.url.pathname === '/signup';
	$: isCategoryPage = $page.url.pathname.includes('/categories');
	$: shouldShowMaxWidth = !MAX_WIDTH_PAGES.includes($page.url.pathname);
	$: showBackButton = !isHomePage && !isCategoryPage;
</script>

<svelte:head>
	<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
	/>
	<meta name="theme-color" content="#ffffff" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="mobile-web-app-capable" content="yes" />

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

<div class="layout-container" on:touchstart={handleTouchStart} on:touchend={handleTouchEnd}>
	<Header {data} {isMobile} />
	<Toast />

	{#if showBackButton}
		<BackNavigation />
	{/if}

	{#if isCategoryPage}
		<CategoryNavigation categoryStructure={parents} />
	{/if}

	<main class="main {shouldShowMaxWidth ? 'column-width' : ''} {!isSignupPage ? 'pos-rel' : ''}">
		<slot />
	</main>

	<Footer {isMobile} />
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* Remove tap highlight on mobile */
		touch-action: manipulation; /* Improves touch responsiveness */
	}

	:global(button, a) {
		/* Make sure touch targets are large enough */
		min-height: 44px;
		min-width: 44px;
	}

	.layout-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
	}

	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: clamp(0.5rem, 2vw, 1rem);
		overflow: visible;
		-webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
	}

	.back-nav-container {
		/* Make back button more touch-friendly */
		padding: 0.5rem;

		@media (max-width: 768px) {
			padding: 0.75rem;
		}
	}

	.column-width {
		max-width: 64rem;
		margin: 0 auto;
		width: 100%;

		@media (max-width: 768px) {
			max-width: 100%;
			padding-left: 0.75rem;
			padding-right: 0.75rem;
		}

		@media (max-width: 480px) {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}
	}

	.pos-rel {
		position: relative;
	}
</style>
