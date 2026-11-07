<!-- src/routes/+layout.svelte -->
<script lang="ts">
	// Cold Light (2026-11-05): Archivo (talk) + Playfair Display italic (voice)
	// + Anton (shout), self-hosted, font-display: swap, latin subset only (keeps
	// build output + global CSS lean). Size-adjusted local fallbacks live in
	// src/scss/index.scss. Inter is retired from the UI (the email asset script
	// outlines its own TTFs from static/fonts/inter).
	import { serializeJsonLd } from '$lib/utils/jsonLd';
	import '@fontsource/archivo/latin-400.css';
	import '@fontsource/archivo/latin-500.css';
	import '@fontsource/archivo/latin-600.css';
	import '@fontsource/archivo/latin-700.css';
	import '@fontsource/playfair-display/latin-400-italic.css';
	import '@fontsource/playfair-display/latin-500-italic.css';
	import '@fontsource/anton/latin-400.css';
	import '@fontsource/jetbrains-mono/latin-400.css';
	import '@fontsource/jetbrains-mono/latin-500.css';
	import '../app.scss';
	import { browser, dev } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onDestroy, onMount, untrack } from 'svelte';
	import type { LayoutProps } from './$types';
	import {
		ANALYTICS_ACTIVITY_WINDOW_MS,
		ANALYTICS_MAX_DELTA_MS,
		ANALYTICS_PING_INTERVAL_MS,
		ANALYTICS_SESSION_TIMEOUT_MS,
		classifyPath,
		normalizePath,
		shouldTrackPath
	} from '$lib/analytics/pageAnalytics';
	import {
		extractExternalReferrerHost,
		extractPageViewAttribution
	} from '$lib/analytics/attribution';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import {
		beginUserIdentityResolution,
		loadPostHog,
		setUserIdentity
	} from '$lib/analytics/posthog';
	import { webVitals } from '$lib/vitals';
	import { preparePageTransition } from '$lib/page-transition';
	import { resolvePageShell } from '$lib/layout/pageShell';
	import {
		createAuthShell,
		normalizeAuthShellUser,
		type AuthShellUser
	} from '$lib/authShell.svelte';
	import { provideNotificationCount } from '$lib/notificationCount.svelte';
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

	let { data, children }: LayoutProps = $props();

	// Seeded once from the first load; later data changes are pushed into the store
	// by the auth-shell effect below, so capturing the initial value is intended.
	const authShellUser = createAuthShell(untrack(() => data?.user));
	provideNotificationCount();
	let authShellRequest: Promise<void> | null = null;
	let authShellHydrated = $state(false);
	if (browser && untrack(() => data?.authShell) === 'client') beginUserIdentityResolution();

	// Constants
	const VERCEL_ANALYTICS_ID = import.meta.env.VERCEL_ANALYTICS_ID;
	const PUBLIC_GOOGLE = import.meta.env.PUBLIC_GOOGLE;
	const PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS =
		String(import.meta.env.PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS || '').toLowerCase() === 'true';
	const ANALYTICS_SESSION_STORAGE_KEY = '9t_analytics_session_key';
	const ANALYTICS_SESSION_LAST_SEEN_STORAGE_KEY = '9t_analytics_session_last_seen';

	let innerWidth = $state(0);
	let isMobile = $derived(innerWidth <= 768);

	// Page-dependent values. Read only `page` (no window APIs), so they work during
	// SSR too. Routes opt into an owned shell through page data; the root no longer
	// maintains a path exception list.
	let pathname = $derived(page.url.pathname);
	let isHomePage = $derived(pathname === '/');
	let isCategoryPage = $derived(pathname.includes('/categories'));
	let isAdminPage = $derived(pathname.startsWith('/admin'));
	// Question detail pages render their own breadcrumbs, so we skip the
	// duplicate top-level back arrow there.
	let isQuestionSlugPage = $derived(
		/^\/questions\/[^/]+$/.test(pathname) &&
			pathname !== '/questions/create' &&
			pathname !== '/questions/categories'
	);
	let pageShell = $derived(resolvePageShell(page.data));
	let shouldShowMaxWidth = $derived(pageShell === 'contained');
	let shouldUseOwnedShell = $derived(pageShell === 'owned');
	let shouldUseOwnedChrome = $derived(page.data.pageChrome === 'owned');
	let showBackButton = $derived(
		!isHomePage && !isCategoryPage && !isAdminPage && !isQuestionSlugPage
	);

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

				if (!response.ok) {
					authShellUser.set(null);
					authShellHydrated = true;
					setUserIdentity(null);
					return;
				}

				const payload = (await response.json()) as { user?: AuthShellUser | null };
				const user = normalizeAuthShellUser(payload.user);
				authShellUser.set(user);
				authShellHydrated = true;
				setUserIdentity(user);
			} catch {
				// Keep the public shell usable if the optional auth refresh fails.
				authShellUser.set(null);
				authShellHydrated = true;
				setUserIdentity(null);
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
		if (!browser) return null;
		return extractExternalReferrerHost(document.referrer, window.location.host);
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
		const nextUrl = navigation.to?.url ?? page.url;
		const nextRouteId = navigation.to?.route?.id ?? null;

		// Google Analytics page tracking: once per navigation. gtag only exists
		// after the deferred loader in initAnalytics runs, so the first page load
		// is skipped here and counted by that loader's gtag('config') call.
		if (!dev && window.gtag) {
			window.gtag('config', PUBLIC_GOOGLE, {
				page_title: document.title,
				page_path: nextUrl.pathname
			});
		}

		void syncClientAuthShell();
		void (async () => {
			if (analyticsVisitKey && !analyticsVisitEnded) {
				await endAnalyticsVisit(false, false);
			}
			await startAnalyticsVisit(nextUrl, nextRouteId);
		})();
	});

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
					path: page.url.pathname,
					params: page.params,
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

		// Listeners live on the window (a gesture handler on a plain <div> fails
		// a11y_no_static_element_interactions), so scope to the app shell: story
		// pages and body-portaled overlays sit outside it.
		const target = e.target as Element | null;
		if (!target?.closest?.('.app-wrapper')) return;

		// Never hijack drags that begin inside a horizontal scroller
		if (target.closest('.scroll-table, [data-swipe-ignore]')) return;

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
		initAnalytics();

		getOrCreateVisitorId();

		initializePageAnalytics();
		void syncClientAuthShell();

		// 9takes initialized
	});

	onDestroy(() => {
		destroyPageAnalytics();
		void endAnalyticsVisit(true, false);
	});

	// Server-owned routes keep their existing SSR auth state. Public editorial
	// routes leave this store alone so a hydrated account state survives client
	// navigation between cached articles. External store sync (the store is shared
	// with Header/MobileNav through context); a pre-effect so the store is current
	// before the DOM updates, like the reactive statement it replaces. The store
	// already holds this value on the first run, so skipping SSR loses nothing.
	$effect.pre(() => {
		if (data?.authShell !== 'client') {
			authShellUser.set(normalizeAuthShellUser(data?.user));
			authShellHydrated = false;
		}
	});

	// PostHog: hold identity-dependent events until the client auth shell resolves.
	$effect(() => {
		if (data?.authShell === 'client' && !authShellHydrated) {
			beginUserIdentityResolution();
		}
	});

	// Sync PostHog identity with auth state. Calls made before PostHog
	// finishes loading are queued by the wrapper and applied on init.
	$effect(() => {
		const authIsReady = data?.authShell !== 'client' || authShellHydrated;
		if (authIsReady) {
			const u = (data?.authShell === 'client' ? authShellUser.user : data?.user) as
				{ id?: string | null; enneagram?: number | null; admin?: boolean } | null | undefined;
			if (u?.id) {
				setUserIdentity({
					id: u.id,
					enneagram: u.enneagram ?? null,
					admin: u.admin ?? false
				});
			} else {
				setUserIdentity(null);
			}
		}
	});
</script>

<svelte:head>
	<link rel="manifest" href="/site.webmanifest?v=20261106" />
	<link rel="apple-touch-icon" sizes="180x180" href="/brand/apple-touch-icon-nine-mask.png" />
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
	/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="9takes" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="application-name" content="9takes" />
	<meta name="msapplication-TileColor" content="#01010D" />
	<meta name="msapplication-TileImage" content="/brand/app-icon-nine-mask-192.png" />

	{#if !dev}
		<!-- Use dns-prefetch instead of preconnect for lighter initial load -->
		<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
	{/if}

	<!-- Site-wide Organization + WebSite schema (every page inherits site identity) -->
	{@html `<script type="application/ld+json">${serializeJsonLd({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': PUBLISHER_ID,
				name: '9takes',
				url: 'https://9takes.com',
				description:
					'One question, nine perspectives. 9takes is a Q&A platform where you answer before the crowd, then see the emotions behind every take — nine coherent readings of the same situation, mapped by the Enneagram.',
				foundingDate: '2022',
				founder: { '@id': AUTHOR_DJ_WAYNE_ID },
				logo: {
					'@type': 'ImageObject',
					url: 'https://9takes.com/brand/9takes-nine-mask-logo-512.png',
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
					'One question, nine perspectives. Answer before the crowd, then see the emotions behind every take. Includes personality analysis, Enneagram guides, and anonymous Q&A.',
				publisher: { '@id': PUBLISHER_ID },
				inLanguage: 'en-US'
			}
		]
	})}</script>`}
</svelte:head>

<!-- touchstart is passive by default in Svelte 5; touchend never calls preventDefault. -->
<svelte:window bind:innerWidth ontouchstart={handleTouchStart} ontouchend={handleTouchEnd} />

{#if browser && page.route.id?.includes('/stories/')}
	{@render children()}
{:else}
	<div class="app-wrapper flex min-h-screen w-full flex-col">
		<!-- Skip link for accessibility (WCAG 2.4.1) -->
		<a
			href="#main-content"
			class="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--highlight)] focus:px-4 focus:py-2 focus:text-[var(--text-on-action)] focus:outline-none focus:ring-2 focus:ring-[var(--text)]"
		>
			Skip to main content
		</a>
		{#if !shouldUseOwnedChrome}
			<div class="sticky top-0 z-50">
				<Header />
			</div>
		{/if}
		<Toast />

		{#if showBackButton && !shouldUseOwnedChrome}
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
			{@render children()}
		</main>

		{#if !shouldUseOwnedChrome}<Footer />{/if}
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		box-sizing: border-box;
		padding: 0;
		background-color: var(--bg);
		color: var(--text);
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
		background: linear-gradient(180deg, var(--bg) 0%, var(--bg) 50%, var(--bg) 100%);
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
