<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// Phase 2 (2026-05-04): swapped to Inter Variable + JetBrains Mono per
	// design-system.md §6. Space Grotesk + Rajdhani imports removed; the
	// @fontsource/* packages are still in package.json (used by email
	// templates / poster generator until Phase 6) but no longer loaded
	// globally.
	import '@fontsource-variable/inter';
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
	import { loadPostHog, setUserIdentity } from '$lib/analytics/posthog';
	import { webVitals } from '$lib/vitals';
	import { preparePageTransition } from '$lib/page-transition';
	import { resolvePageShell } from '$lib/layout/pageShell';
	import { createAuthShellUser, normalizeAuthShellUser, type AuthShellUser } from '$lib/authShell';
	import {
		AUTHOR_DJ_WAYNE_ID,
		DJ_WAYNE_SAME_AS,
		PUBLISHER_ID,
		PUBLISHER_SAME_AS
	} from '$lib/utils/personJsonLd';

	// Components
	import Header from '$lib/components/molecules/Header.svelte';
	import Toast from '$lib/components/molecules/Toast.svelte';
	import Footer from '$lib/components/molecules/Footer.svelte';
	import BackNavigation from '$lib/components/atoms/BackNavigation.svelte';

	export let data: PageData;

	const authShellUser = createAuthShellUser(data?.user);
	let authShellRequest: Promise<void> | null = null;
	let authShellHydrated = false;

	// Constants
	const VERCEL_ANALYTICS_ID = import.meta.env.VERCEL_ANALYTICS_ID;
	const PUBLIC_GOOGLE = import.meta.env.PUBLIC_GOOGLE;
	const PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS =
		String(import.meta.env.PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS || '').toLowerCase() === 'true';
	const ANALYTICS_SESSION_STORAGE_KEY = '9t_analytics_session_key';
	const ANALYTICS_SESSION_LAST_SEEN_STORAGE_KEY = '9t_analytics_session_last_seen';

	let innerWidth = 0;
	let isMobile = false;

	// Initialize page-dependent variables to prevent server access
	let isHomePage = false;
	let isCategoryPage = false;
	let isAdminPage = false;
	let shouldShowMaxWidth = true;
	let shouldUseOwnedShell = false;
	let showBackButton = false;

	// Track swipe gestures for mobile
	let touchStartX = 0;
	let touchStartY = 0;
	let touchEndX = 0;
	let touchEndY = 0;

	// In-house page analytics state
	let analyticsInitialized = false;
	let analyticsSessionKey: string | null = null;
	let analyticsVisitKey: string | null = null;
	let analyticsVisitEnded = false;
	let analyticsMaxScrollPct = 0;
	let analyticsLastSentScrollPct = 0;
	let analyticsLastActivityAt = 0;
	let analyticsLastFlushAt = 0;
	let analyticsPingTimer: ReturnType<typeof setInterval> | null = null;
	let analyticsPingIdleHandle: number | null = null;
	let analyticsPingInFlight = false;

	type IdleWindow = Window & {
		requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
		cancelIdleCallback?: (handle: number) => void;
	};

	preparePageTransition();

	function createUuid(): string {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}
		return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}

	async function syncClientAuthShell() {
		if (!browser || data?.authShell !== 'client' || authShellHydrated || authShellRequest) {
			return;
		}

		authShellRequest = (async () => {
			try {
				const response = await fetch('/api/auth-shell', {
					headers: { Accept: 'application/json' },
					credentials: 'same-origin'
				});

				if (!response.ok) return;

				const payload = (await response.json()) as { user?: AuthShellUser | null };
				authShellUser.set(normalizeAuthShellUser(payload.user));
				authShellHydrated = true;
			} catch {
				// Keep the public shell usable if the optional auth refresh fails.
			} finally {
				authShellRequest = null;
			}
		})();

		await authShellRequest;
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
		analyticsLastSentScrollPct = 0;
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
		if (!analyticsVisitKey || analyticsVisitEnded || analyticsPingInFlight) return;

		const now = Date.now();
		const engagedDelta = getEngagedDelta(now, false);
		const hasNewScrollProgress = analyticsMaxScrollPct > analyticsLastSentScrollPct;
		if (engagedDelta <= 0 && !hasNewScrollProgress) return;

		setAnalyticsSessionLastSeen(now);
		analyticsPingInFlight = true;
		try {
			const sent = await sendAnalyticsEvent(
				'/api/analytics/page-ping',
				{
					visit_key: analyticsVisitKey,
					engaged_ms_delta: engagedDelta,
					max_scroll_pct: analyticsMaxScrollPct
				},
				true
			);

			if (sent) {
				analyticsLastSentScrollPct = Math.max(analyticsLastSentScrollPct, analyticsMaxScrollPct);
			}
		} finally {
			analyticsPingInFlight = false;
		}
	}

	function scheduleAnalyticsPing() {
		if (!browser || analyticsPingInFlight || analyticsPingIdleHandle !== null) return;

		const idleWindow = window as IdleWindow;
		const run = () => {
			analyticsPingIdleHandle = null;
			void flushAnalyticsPing();
		};

		if (idleWindow.requestIdleCallback) {
			analyticsPingIdleHandle = idleWindow.requestIdleCallback(run, { timeout: 2000 });
			return;
		}

		void flushAnalyticsPing();
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
			scheduleAnalyticsPing();
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

		if (analyticsPingIdleHandle !== null) {
			(window as IdleWindow).cancelIdleCallback?.(analyticsPingIdleHandle);
			analyticsPingIdleHandle = null;
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
		void syncClientAuthShell();
		void (async () => {
			if (analyticsVisitKey && !analyticsVisitEnded) {
				await endAnalyticsVisit(false, false);
			}
			await startAnalyticsVisit(nextUrl, nextRouteId);
		})();
	});

	// Function to update all page-dependent values. Reads only $page (no
	// window APIs), so it runs during SSR too. Routes opt into an owned shell
	// through page data; the root no longer maintains a path exception list.
	function updatePageDerivedValues() {
		const pathname = $page.url.pathname;
		isHomePage = pathname === '/';
		isCategoryPage = pathname.includes('/categories');
		isAdminPage = pathname.startsWith('/admin');
		// Question detail pages render their own breadcrumbs, so we skip the
		// duplicate top-level back arrow there.
		const isQuestionSlugPage =
			/^\/questions\/[^/]+$/.test(pathname) &&
			pathname !== '/questions/create' &&
			pathname !== '/questions/categories';
		const pageShell = resolvePageShell($page.data);
		shouldShowMaxWidth = pageShell === 'contained';
		shouldUseOwnedShell = pageShell === 'owned';
		showBackButton = !isHomePage && !isCategoryPage && !isAdminPage && !isQuestionSlugPage;
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

			// PostHog: dynamic-imported so it stays out of the initial bundle.
			// Pageviews are auto-tracked via history-API hooks (defaults: '2026-01-30').
			void loadPostHog();
		};

		// Defer analytics to after main content is interactive
		if ('requestIdleCallback' in window) {
			(window as any).requestIdleCallback(loadAnalytics, { timeout: 3000 });
		} else {
			setTimeout(loadAnalytics, 1500);
		}
	};

	// Handle swipe gestures for navigation with passive event options.
	// Guards (2026-06-11 mobile audit): only an edge-originated, mostly-horizontal
	// swipe navigates — otherwise drags inside horizontal scrollers (tables, chip
	// rows) and sloppy diagonal scrolls fired history.back().
	const handleTouchStart = (e: TouchEvent) => {
		touchStartX = e.changedTouches[0].clientX;
		touchStartY = e.changedTouches[0].clientY;
	};

	const handleTouchEnd = (e: TouchEvent) => {
		touchEndX = e.changedTouches[0].clientX;
		touchEndY = e.changedTouches[0].clientY;
		handleSwipe(e);
	};

	const handleSwipe = (e: TouchEvent) => {
		// Only process swipe on mobile
		if (!isMobile) return;

		// Must start at the left edge, like the OS back gesture
		const edgeWidth = 24;
		if (touchStartX > edgeWidth) return;

		// Never hijack drags that begin inside a horizontal scroller
		const target = e.target as Element | null;
		if (target?.closest?.('.scroll-table, [data-swipe-ignore]')) return;

		const swipeThreshold = 100; // Minimum swipe distance
		const swipeDistance = touchEndX - touchStartX;
		const verticalDrift = Math.abs(touchEndY - touchStartY);

		// Mostly-horizontal only: a diagonal scroll is not a back gesture
		if (swipeDistance > swipeThreshold && verticalDrift < swipeDistance / 2) {
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
		void syncClientAuthShell();

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

	// Update page values when page changes (SSR + client navigations)
	$: if ($page) {
		updatePageDerivedValues();
	}

	// Server-owned routes keep their existing SSR auth state. Public editorial
	// routes leave this store alone so a hydrated account state survives client
	// navigation between cached articles.
	$: if (data?.authShell !== 'client') {
		authShellUser.set(normalizeAuthShellUser(data?.user));
		authShellHydrated = false;
	}

	// Sync PostHog identity with auth state. Calls made before PostHog
	// finishes loading are queued by the wrapper and applied on init.
	$: if (browser) {
		const u = data?.user as
			| { id?: string | null; email?: string | null; enneagram?: number | null; admin?: boolean }
			| null
			| undefined;
		if (u?.id) {
			setUserIdentity({
				id: u.id,
				email: u.email ?? null,
				enneagram: u.enneagram ?? null,
				admin: u.admin ?? false
			});
		} else {
			setUserIdentity(null);
		}
	}
</script>

<svelte:head>
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="apple-touch-icon" sizes="180x180" href="/brand/apple-touch-icon-v2.png" />
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
				'@id': PUBLISHER_ID,
				name: '9takes',
				url: 'https://9takes.com',
				description:
					'9takes helps people decode social dynamics, personality patterns, and emotional blind spots using the Enneagram.',
				foundingDate: '2022',
				founder: { '@id': AUTHOR_DJ_WAYNE_ID },
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
				sameAs: PUBLISHER_SAME_AS
			},
			{
				'@type': 'Person',
				'@id': AUTHOR_DJ_WAYNE_ID,
				name: 'DJ Wayne',
				jobTitle: 'Founder',
				description:
					'Founder of 9takes, a former USMC infantry Marine turned software entrepreneur who writes about personality, self-awareness, and the Enneagram.',
				image: 'https://9takes.com/brand/djface.webp',
				url: 'https://9takes.com/about',
				worksFor: { '@id': PUBLISHER_ID },
				sameAs: DJ_WAYNE_SAME_AS
			},
			{
				'@type': 'WebSite',
				'@id': 'https://9takes.com/#website',
				name: '9takes',
				url: 'https://9takes.com',
				description:
					'An Enneagram site for personality analysis, emotional intelligence, and understanding social dynamics.',
				publisher: { '@id': PUBLISHER_ID },
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
			class="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--lamp-glow)] focus:px-4 focus:py-2 focus:text-[var(--text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--lamp-soft)]"
		>
			Skip to main content
		</a>
		<div class="sticky top-0 z-50">
			<Header />
		</div>
		<Toast />

		{#if showBackButton}
			<BackNavigation wide={shouldUseOwnedShell} />
		{/if}

		<main
			id="main-content"
			class="relative flex w-full flex-1 flex-col {isAdminPage
				? ''
				: 'overflow-visible p-2 md:p-4'}"
			class:max-w-4xl={shouldShowMaxWidth}
			class:mx-auto={shouldShowMaxWidth}
			style={shouldUseOwnedShell
				? 'max-width: none; margin: 0; padding: 0; overflow-x: clip;'
				: isAdminPage
					? 'overflow-x: clip;'
					: ''}
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
		background-color: var(--night-deep);
		color: var(--ink-bright);
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
		background: linear-gradient(
			180deg,
			var(--night-deep) 0%,
			var(--night-deep) 50%,
			var(--night-deep) 100%
		);
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
