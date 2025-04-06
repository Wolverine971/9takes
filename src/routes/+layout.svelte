<script lang="ts">
	import '../app.scss';
	import { browser, dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
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
	let scrollY = 0;
	let lastScrollY = 0;
	let headerVisible = false;
	let ticking = false;

	// Initialize page-dependent variables to prevent server access
	let isHomePage = false;
	let isSignupPage = false;
	let isCategoryPage = false;
	let shouldShowMaxWidth = true;
	let showBackButton = false;
	let showHeader = true;

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

	// Function to update all page-dependent values
	function updatePageDerivedValues() {
		if (!browser) return;

		const pathname = $page.url.pathname;
		isHomePage = pathname === '/';
		isSignupPage = pathname === '/signup';
		isCategoryPage = pathname.includes('/categories');
		shouldShowMaxWidth = !MAX_WIDTH_PAGES.includes(pathname);
		showBackButton = !isHomePage && !isCategoryPage;
		showHeader = !isHomePage || headerVisible;
	}

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
			// Lazy load FingerprintJS only when needed
			const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
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

	// Handle swipe gestures for navigation with passive event options
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

	// Throttled scroll handler for improved performance
	const handleScroll = () => {
		// Only process scroll events at most once every 100ms for better performance
		if (!ticking && isHomePage) {
			ticking = true;

			// Use requestAnimationFrame to align with browser rendering cycle
			window.requestAnimationFrame(() => {
				// Simplified visibility logic to reduce state changes
				if (scrollY > 100 && !headerVisible) {
					headerVisible = true;
					if (browser) showHeader = !isHomePage || headerVisible;
				} else if (scrollY < 50 && headerVisible) {
					headerVisible = false;
					if (browser) showHeader = !isHomePage || headerVisible;
				}

				lastScrollY = scrollY;

				// Reset throttle after 100ms
				setTimeout(() => {
					ticking = false;
				}, 100);
			});
		}
	};

	onMount(() => {
		// Initialize page-dependent values
		updatePageDerivedValues();

		initAnalytics();

		// Defer fingerprint initialization
		if (browser) {
			// Use requestIdleCallback to wait for browser idle time if available,
			// or setTimeout as a fallback
			if ('requestIdleCallback' in window) {
				(window as any).requestIdleCallback(
					() => {
						initFingerprint();
					},
					{ timeout: 2000 }
				);
			} else {
				setTimeout(() => {
					initFingerprint();
				}, 2000);
			}
		}

		// Update mobile status based on window width
		updateMobileStatus();

		// Add optimized event listeners with passive flag
		if (browser) {
			// Passive flag improves scrolling performance
			window.addEventListener('scroll', handleScroll, { passive: true });
		}

		console.log(`
 ___  _        _              
/ _ \\| |_ __ _| | _____  ___ 
| (_) | __/ _\`| |/ / _ \\/ __|
 \\__, | || (_| |   <  __/\\__ \\
   /_/ \\__\\__,_|_|\\_\\___||___/
`);

		return () => {
			if (browser) {
				window.removeEventListener('scroll', handleScroll);
			}
		};
	});

	// Update mobile status when window resizes
	const updateMobileStatus = () => {
		isMobile = innerWidth <= 768;
	};

	// Track page changes - only run on the client
	$: if (browser && !dev && window.gtag && $page) {
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

	// Update page values when page changes
	$: if (browser && $page) {
		updatePageDerivedValues();
	}

	$: parents = data?.parents ? [...data.parents].slice(0, -1) : [];
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

<svelte:window bind:innerWidth bind:scrollY />

{#if browser && $page?.route?.id?.includes('/stories/')}
	<slot />
{:else}
	<div
		class="flex min-h-screen w-full flex-col"
		on:touchstart|passive={handleTouchStart}
		on:touchend|passive={handleTouchEnd}
	>
		<div
			class="sticky top-0 z-40 -translate-y-full transform transition-transform duration-300 ease-in-out"
			class:translate-y-0={showHeader}
		>
			<Header {data} />
		</div>
		<Toast />

		{#if showBackButton}
			<BackNavigation />
		{/if}

		{#if isCategoryPage}
			<CategoryNavigation categoryStructure={parents} />
		{/if}

		<main
			class="relative flex flex-1 flex-col overflow-visible p-2 md:p-4"
			class:max-w-4xl={shouldShowMaxWidth}
			class:mx-auto={shouldShowMaxWidth}
			class:w-full={shouldShowMaxWidth}
			style="margin-top: {isHomePage && !headerVisible ? '-60px' : '0'};"
		>
			<slot />
		</main>

		<Footer />
	</div>
{/if}

<style>
	/* Global styles that might be difficult to do with just Tailwind */
	:global(body) {
		@apply m-0 box-border p-0;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* Remove tap highlight on mobile */
		touch-action: manipulation; /* Improves touch responsiveness */
	}

	/* Media query adjustments for the main content area */
	@media (max-width: 768px) {
		.max-w-4xl {
			@apply max-w-full px-3;
		}
	}

	@media (max-width: 480px) {
		.max-w-4xl {
			@apply px-2;
		}
	}
</style>
