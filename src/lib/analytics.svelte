<!-- src/lib/analytics.svelte -->
<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	type AnalyticsWindow = Window & {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
		clarity?: (...args: unknown[]) => void;
		[key: string]: unknown;
	};

	const PUBLIC_GOOGLE = String(import.meta.env.PUBLIC_GOOGLE ?? '');

	function loadAnalytics() {
		if (typeof window !== 'undefined' && !dev) {
			const win = window as unknown as AnalyticsWindow;

			// Load Google Analytics
			const gaScript = document.createElement('script');
			gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GOOGLE}`;
			gaScript.defer = true;
			document.head.appendChild(gaScript);

			win.dataLayer = win.dataLayer || [];
			const gtag = (...args: unknown[]) => {
				win.dataLayer?.push(args);
			};
			win.gtag = gtag;

			gtag('js', new Date());
			gtag('config', PUBLIC_GOOGLE);

			// Load Microsoft Clarity
			if (document.URL.includes('9takes')) {
				(function (c: AnalyticsWindow, l: Document, a: string, r: string, i: string) {
					if (typeof c[a] !== 'function') {
						const queue: unknown[][] = [];
						c[a] = (...args: unknown[]) => {
							queue.push(args);
						};
						(c[a] as ((...args: unknown[]) => void) & { q?: unknown[][] }).q = queue;
					}

					const t = l.createElement(r) as HTMLScriptElement;
					t.async = true;
					t.src = 'https://www.clarity.ms/tag/' + i;
					const y = l.getElementsByTagName(r)[0];
					y.parentNode?.insertBefore(t, y);
				})(window as unknown as AnalyticsWindow, document, 'clarity', 'script', 'g3hw5t1scg');
			}
		}
	}

	onMount(() => {
		// Lazy load analytics after main content has loaded
		window.addEventListener('load', loadAnalytics);
	});

	$: {
		const gtag = (window as unknown as AnalyticsWindow | undefined)?.gtag;
		if (typeof gtag === 'function') {
			gtag('config', 'MEASUREMENT_ID', {
				page_title: document.title,
				page_path: $page.url.pathname
			});
		}
	}
</script>

<svelte:head>
	{#if !dev}
		<link rel="preconnect" href="https://www.googletagmanager.com" />
		<link rel="preconnect" href="https://www.clarity.ms" />
		<link rel="preconnect" href="https://app.posthog.com" />
	{/if}
</svelte:head>
