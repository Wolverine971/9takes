<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '@fontsource/space-grotesk/400.css';
	import '@fontsource/space-grotesk/500.css';
	import '@fontsource/space-grotesk/700.css';
	import '@fontsource/rajdhani/500.css';
	import '@fontsource/rajdhani/700.css';
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/500.css';
	import '../app.scss';
	import { browser, dev } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import {
		ANALYTICS_ACTIVITY_WINDOW_MS,
		ANALYTICS_MAX_DELTA_MS,
		ANALYTICS_PING_INTERVAL_MS,
		ANALYTICS_SESSION_TIMEOUT_MS,
		classifyPath,
		normalizePath,
		shouldTrackPath
	} from '$lib/analytics/pageAnalytics';
	import { extractPageViewAttribution } from '$lib/analytics/attribution';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { webVitals } from '$lib/vitals';
	import { preparePageTransition } from '$lib/page-transition';

	// Components
	import Header from '$lib/components/molecules/Header.svelte';
	import Toast from '$lib/components/molecules/Toast.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
	import BackNavigation from '$lib/components/atoms/BackNavigation.svelte';
	import CategoryNavigation from '$lib/components/atoms/CategoryNavigation.svelte';
	import FloatingParticles from '$lib/components/atoms/FloatingParticles.svelte';

	export let data: PageData;

	// Constants
	const VERCEL_ANALYTICS_ID = import.meta.env.VERCEL_ANALYTICS_ID;
	const PUBLIC_GOOGLE = import.meta.env.PUBLIC_GOOGLE;
	const PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS =
		String(import.meta.env.PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS || '').toLowerCase() === 'true';
	const MAX_WIDTH_PAGES = ['/', '/content-board', '/book-session', '/search'];
	const ANALYTICS_SESSION_STORAGE_KEY = '9t_analytics_session_key';
	const ANALYTICS_SESSION_LAST_SEEN_STORAGE_KEY = '9t_analytics_session_last_seen';

	let innerWidth = 0;
	let isMobile = false;

	// Initialize page-dependent variables to prevent server access
	let isHomePage = false;
	let isSignupPage = false;
	let isCategoryPage = false;
	let isAdminPage = false;
	let shouldShowMaxWidth = true;
	let showBackButton = false;

	// Track swipe gestures for mobile
	let touchStartX = 0;
	let touchEndX = 0;

	// In-house page analytics state
	let analyticsInitialized = false;
	let analyticsSessionKey: string | null = null;
	let analyticsVisitKey: string | null = null;
	let analyticsVisitEnded = false;
	let analyticsMaxScrollPct = 0;
	let analyticsLastActivityAt = 0;
	let analyticsLastFlushAt = 0;
	let analyticsPingTimer: ReturnType<typeof setInterval> | null = null;

	// Type for category structure passed to CategoryNavigation
	interface CategoryStep {
		id: number;
		category_name: string;
		slug?: string | null;
		level: number;
	}

	preparePageTransition();

	function createUuid(): string {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}
		return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}

	function setAnalyticsSessionLastSeen(now: number) {
		try {
			sessionStorage.setItem(ANALYTICS_SESSION_LAST_SEEN_STORAGE_KEY, String(now));
		} catch {
			// Ignore sessionStorage errors
		}
	}

	function getOrCreateAnalyticsSessionKey(): string {
		const now = Date.now();
		try {
			const existingKey = sessionStorage.getItem(ANALYTICS_SESSION_STORAGE_KEY);
			const lastSeenRaw = sessionStorage.getItem(ANALYTICS_SESSION_LAST_SEEN_STORAGE_KEY);
			const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : 0;
			const expired =
				!lastSeen || Number.isNaN(lastSeen) || now - lastSeen > ANALYTICS_SESSION_TIMEOUT_MS;

			const sessionKey = !existingKey || expired ? createUuid() : existingKey;
			sessionStorage.setItem(ANALYTICS_SESSION_STORAGE_KEY, sessionKey);
			setAnalyticsSessionLastSeen(now);
			return sessionKey;
		} catch {
			// Fallback for environments where sessionStorage fails
			return createUuid();
		}
	}

	function markAnalyticsActivity() {
		analyticsLastActivityAt = Date.now();
	}

	function updateAnalyticsScrollProgress() {
		if (!browser) return;
		const doc = document.documentElement;
		const scrollTop = window.scrollY || doc.scrollTop || 0;
		const scrollHeight = Math.max(doc.scrollHeight, document.body?.scrollHeight ?? 0);
		const maxScrollable = Math.max(scrollHeight - window.innerHeight, 1);
		const pct = Math.max(0, Math.min(100, Math.round((scrollTop / maxScrollable) * 100)));
		analyticsMaxScrollPct = Math.max(analyticsMaxScrollPct, pct);
		markAnalyticsActivity();
	}

	function getReferrerHost(): string | null {
		if (!browser || !document.referrer) return null;
		try {
			return new URL(document.referrer).host;
		} catch {
			return null;
		}
	}

	function getEngagedDelta(now: number, allowHidden = false): number {
		if (!analyticsLastFlushAt) {
			analyticsLastFlushAt = now;
			return 0;
		}

		const elapsed = Math.max(0, now - analyticsLastFlushAt);
		analyticsLastFlushAt = now;

		if (elapsed <= 0) return 0;

		const recentlyActive = now - analyticsLastActivityAt <= ANALYTICS_ACTIVITY_WINDOW_MS;
		const visible = allowHidden ? true : !document.hidden;
		if (!visible || !recentlyActive) return 0;

		return Math.min(elapsed, ANALYTICS_MAX_DELTA_MS);
	}

	async function sendAnalyticsEvent(
		endpoint: string,
		payload: Record<string, unknown>,
		useBeacon = false
	): Promise<boolean> {
		if (!browser) return false;

		if (useBeacon && navigator.sendBeacon) {
			try {
				const body = new Blob([JSON.stringify(payload)], { type: 'application/json' });
				return navigator.sendBeacon(endpoint, body);
			} catch {
				// Fall through to fetch
			}
		}

		try {
			await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
				keepalive: useBeacon
			});
			return true;
		} catch {
			return false;
		}
	}

	async function startAnalyticsVisit(url: URL, routeId: string | null) {
		if (!browser || (dev && !PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS)) return;

		const normalizedPath = normalizePath(url.pathname);
		if (!shouldTrackPath(normalizedPath)) {
			analyticsVisitKey = null;
			analyticsVisitEnded = true;
			return;
		}

		analyticsSessionKey = getOrCreateAnalyticsSessionKey();
		analyticsVisitKey = createUuid();
		analyticsVisitEnded = false;
		analyticsMaxScrollPct = 0;
		analyticsLastActivityAt = Date.now();
		analyticsLastFlushAt = analyticsLastActivityAt;

		const classified = classifyPath(normalizedPath, routeId);
		const attribution = extractPageViewAttribution(url);
		const payload = {
			visit_key: analyticsVisitKey,
			session_key: analyticsSessionKey,
			fingerprint: getOrCreateVisitorId(),
			path: classified.path,
			route_id: classified.routeId,
			path_group: classified.pathGroup,
			content_type: classified.contentType,
			content_slug: classified.contentSlug,
			referrer_host: getReferrerHost(),
			landing_query: attribution.landing_query,
			utm_source: attribution.utm_source,
			utm_medium: attribution.utm_medium,
			utm_campaign: attribution.utm_campaign,
			utm_term: attribution.utm_term,
			utm_content: attribution.utm_content,
			click_id_type: attribution.click_id_type,
			click_id_value: attribution.click_id_value
		};

		await sendAnalyticsEvent('/api/analytics/page-view', payload);
	}

	async function flushAnalyticsPing() {
		if (!analyticsVisitKey || analyticsVisitEnded) return;

		const now = Date.now();
		const engagedDelta = getEngagedDelta(now, false);
		if (engagedDelta <= 0 && analyticsMaxScrollPct <= 0) return;

		setAnalyticsSessionLastSeen(now);
		await sendAnalyticsEvent('/api/analytics/page-ping', {
			visit_key: analyticsVisitKey,
			engaged_ms_delta: engagedDelta,
			max_scroll_pct: analyticsMaxScrollPct
		});
	}

	async function endAnalyticsVisit(isExit: boolean, useBeacon: boolean) {
		if (!analyticsVisitKey || analyticsVisitEnded) return;

		const visitKey = analyticsVisitKey;
		analyticsVisitEnded = true;
		const now = Date.now();
		const engagedDelta = getEngagedDelta(now, true);
		setAnalyticsSessionLastSeen(now);

		const payload = {
			visit_key: visitKey,
			engaged_ms_delta: engagedDelta,
			max_scroll_pct: analyticsMaxScrollPct,
			ended_at: new Date().toISOString(),
			is_exit: isExit
		};

		await sendAnalyticsEvent('/api/analytics/page-exit', payload, useBeacon);

		if (!isExit) {
			analyticsVisitKey = null;
		}
	}

	function initializePageAnalytics() {
		if (!browser || (dev && !PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS) || analyticsInitialized) return;
		analyticsInitialized = true;

		window.addEventListener('pointerdown', markAnalyticsActivity, { passive: true });
		window.addEventListener('keydown', markAnalyticsActivity);
		window.addEventListener('scroll', updateAnalyticsScrollProgress, { passive: true });
		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('pagehide', handlePageHide);
		window.addEventListener('beforeunload', handleBeforeUnload);

		analyticsPingTimer = setInterval(() => {
			void flushAnalyticsPing();
		}, ANALYTICS_PING_INTERVAL_MS);
	}

	function destroyPageAnalytics() {
		if (!browser || !analyticsInitialized) return;

		window.removeEventListener('pointerdown', markAnalyticsActivity);
		window.removeEventListener('keydown', markAnalyticsActivity);
		window.removeEventListener('scroll', updateAnalyticsScrollProgress);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		window.removeEventListener('pagehide', handlePageHide);
		window.removeEventListener('beforeunload', handleBeforeUnload);

		if (analyticsPingTimer) {
			clearInterval(analyticsPingTimer);
			analyticsPingTimer = null;
		}
	}

	function handleVisibilityChange() {
		if (document.hidden) {
			void flushAnalyticsPing();
			return;
		}
		markAnalyticsActivity();
		analyticsLastFlushAt = Date.now();
	}

	function handlePageHide() {
		void endAnalyticsVisit(true, true);
	}

	function handleBeforeUnload() {
		void endAnalyticsVisit(true, true);
	}

	afterNavigate((navigation) => {
		const nextUrl = navigation.to?.url ?? $page.url;
		const nextRouteId = navigation.to?.route?.id ?? null;
		void (async () => {
			if (analyticsVisitKey && !analyticsVisitEnded) {
				await endAnalyticsVisit(false, false);
			}
			await startAnalyticsVisit(nextUrl, nextRouteId);
		})();
	});

	// Function to update all page-dependent values
	function updatePageDerivedValues() {
		if (!browser) return;

		const pathname = $page.url.pathname;
		isHomePage = pathname === '/';
		isSignupPage = pathname === '/signup';
		isCategoryPage = pathname.includes('/categories');
		isAdminPage = pathname.startsWith('/admin');
		shouldShowMaxWidth = !MAX_WIDTH_PAGES.includes(pathname) && !isAdminPage;
		showBackButton = !isHomePage && !isCategoryPage && !isAdminPage;
	}

	// Defer analytics loading to after page is interactive
	const initAnalytics = () => {
		if (dev) return;

		// Use requestIdleCallback to load analytics during idle time
		const loadAnalytics = () => {
			// Initialize Google Tag Manager - deferred loading
			if (PUBLIC_GOOGLE) {
				window.dataLayer = window.dataLayer || [];
				window.gtag = function (...args: unknown[]) {
					window.dataLayer!.push(args);
				};
				window.gtag('js', new Date());
				window.gtag('config', PUBLIC_GOOGLE);

				const script = document.createElement('script');
				script.async = true;
				script.src = `https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GOOGLE}`;
				document.head.appendChild(script);
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

		// Defer analytics to after main content is interactive
		if ('requestIdleCallback' in window) {
			(window as any).requestIdleCallback(loadAnalytics, { timeout: 3000 });
		} else {
			setTimeout(loadAnalytics, 1500);
		}
	};

	// Handle swipe gestures for navigation with passive event options
	const handleTouchStart = (e: TouchEvent) => {
		touchStartX = e.changedTouches[0].screenX;
	};

	const handleTouchEnd = (e: TouchEvent) => {
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
		// Initialize page-dependent values
		updatePageDerivedValues();

		initAnalytics();

		getOrCreateVisitorId();

		// Update mobile status based on window width
		updateMobileStatus();
		initializePageAnalytics();

		// 9takes initialized
	});

	onDestroy(() => {
		destroyPageAnalytics();
		void endAnalyticsVisit(true, false);
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

	$: parents = data?.parents ? ([...data.parents].slice(0, -1) as CategoryStep[]) : [];
</script>

<svelte:head>
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
	/>
	<meta name="theme-color" content="#0C0A09" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="color-scheme" content="dark light" />
	{@html `<script>(function(){try{var stored=localStorage.getItem('9takes-theme');var effective=stored==='light'||stored==='dark'?stored:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var root=document.documentElement;root.classList.toggle('light',effective==='light');root.classList.toggle('dark',effective==='dark');root.dataset.theme=effective;root.style.colorScheme=effective;var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content',effective==='light'?'#FAFAF9':'#0C0A09');}catch{}})()</script>`}

	{#if !dev}
		<!-- Use dns-prefetch instead of preconnect for lighter initial load -->
		<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
	{/if}

	<!-- Site-wide Organization + WebSite schema (every page inherits site identity) -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': 'https://9takes.com/#organization',
				name: '9takes',
				url: 'https://9takes.com',
				description:
					'9takes helps people decode social dynamics, personality patterns, and emotional blind spots using the Enneagram.',
				foundingDate: '2022',
				founder: { '@id': 'https://9takes.com/about/#person' },
				logo: {
					'@type': 'ImageObject',
					url: 'https://9takes.com/brand/aero.png',
					width: 512,
					height: 512
				},
				contactPoint: [
					{
						'@type': 'ContactPoint',
						contactType: 'customer support',
						email: 'usersup@9takes.com',
						url: 'https://9takes.com/about',
						availableLanguage: ['English']
					}
				],
				sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom']
			},
			{
				'@type': 'Person',
				'@id': 'https://9takes.com/about/#person',
				name: 'DJ Wayne',
				jobTitle: 'Founder',
				description:
					'Founder of 9takes, a former USMC infantry Marine turned software entrepreneur who writes about personality, self-awareness, and the Enneagram.',
				image: 'https://9takes.com/brand/djface.webp',
				url: 'https://9takes.com/about',
				worksFor: { '@id': 'https://9takes.com/#organization' },
				sameAs: ['https://twitter.com/djwayne3', 'https://www.linkedin.com/in/djwayne3']
			},
			{
				'@type': 'WebSite',
				'@id': 'https://9takes.com/#website',
				name: '9takes',
				url: 'https://9takes.com',
				description:
					'An Enneagram site for personality analysis, emotional intelligence, and understanding social dynamics.',
				publisher: { '@id': 'https://9takes.com/#organization' },
				inLanguage: 'en-US'
			}
		]
	})}</script>`}
</svelte:head>

<svelte:window bind:innerWidth />

{#if browser && $page?.route?.id?.includes('/stories/')}
	<slot />
{:else}
	<div
		class="app-wrapper flex min-h-screen w-full flex-col"
		on:touchstart|passive={handleTouchStart}
		on:touchend|passive={handleTouchEnd}
	>
		<!-- Skip link for accessibility (WCAG 2.4.1) -->
		<a
			href="#main-content"
			class="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-teal-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
		>
			Skip to main content
		</a>
		<FloatingParticles />
		<div class="sticky top-0 z-50">
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
			id="main-content"
			class="relative flex w-full flex-1 flex-col {isAdminPage
				? ''
				: 'overflow-visible p-2 md:p-4'}"
			class:max-w-4xl={shouldShowMaxWidth}
			class:mx-auto={shouldShowMaxWidth}
			style={isAdminPage ? 'overflow-x: clip;' : ''}
			aria-label="Main content"
		>
			<slot />
		</main>

		<Footer />
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		box-sizing: border-box;
		padding: 0;
		background-color: var(--bg-base);
		color: var(--text-primary);
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		touch-action: manipulation;
	}

	:global(html),
	:global(body) {
		width: 100%;
		max-width: 100%;
		overflow-x: hidden;
	}

	@supports (overflow-x: clip) {
		:global(html),
		:global(body) {
			overflow-x: clip;
		}
	}

	.app-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 50%, var(--bg-base) 100%);
		overflow-x: hidden;
	}

	/* Media query adjustments for the main content area */
	@media (max-width: 768px) {
		.max-w-4xl {
			max-width: 100%;
			padding-left: 0.75rem;
			padding-right: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.max-w-4xl {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}
	}
</style>
