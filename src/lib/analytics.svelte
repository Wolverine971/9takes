<!-- src/lib/analytics.svelte -->
<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let PUBLIC_GOOGLE = import.meta.env.PUBLIC_GOOGLE;

	function loadAnalytics() {
		if (typeof window !== 'undefined' && !dev) {
			// Load Google Analytics
			const gaScript = document.createElement('script');
			gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GOOGLE}`;
			gaScript.defer = true;
			document.head.appendChild(gaScript);

			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());
			gtag('config', PUBLIC_GOOGLE);

			// Load Microsoft Clarity
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
		}
	}

	onMount(() => {
		// Lazy load analytics after main content has loaded
		window.addEventListener('load', loadAnalytics);
	});

	$: {
		if (typeof gtag !== 'undefined') {
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
