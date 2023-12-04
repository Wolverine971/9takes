<script lang="ts">
	import type { PageData } from './$types';
	import { webVitals } from '$lib/vitals';
	import { browser } from '$app/environment';
	import Header from '$lib/components/molecules/Header.svelte';
	import './styles.css';
	let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;
	import { dev } from '$app/environment';
	import { preparePageTransition } from '$lib/page-transition';
	import { partytownSnippet } from '@builder.io/partytown/integration';

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
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import { onMount } from 'svelte';
	import { setCookie } from '../utils/cookies';

	export let data: PageData;
	let innerWidth = 0;
	onMount(async () => {
		if (dev) return;
		const fp = await FingerprintJS.load();
		const fpval = await fp.get();
		const formdata = new FormData();
		formdata.append('fp', fpval?.visitorId?.toString());
		setCookie('9tfingerprint', fpval?.visitorId?.toString(), 365);
		await fetch(`/api/adder`, {
			method: 'POST',
			body: formdata
		})
			.then((response) => response.text())
			.catch((error) => console.log('error', error));
	});
</script>

<svelte:head>
	<link href="https://www.googletagmanager.com/gtag/js?id=G-1BKNXQPYKG" rel="preload" as="script" />
	<!-- Config options -->
	<script>
		// Forward the necessary functions to the web worker layer
		partytown = {
			forward: ['dataLayer.push']
		};
	</script>
	{@html '<script>' + partytownSnippet() + '</script>'}

	<script type="text/partytown" defer>
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
	</script>

	<script
		type="text/partytown"
		src="https://www.googletagmanager.com/gtag/js?id=G-1BKNXQPYKG"
	></script>
	<script type="text/partytown">
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', 'G-1BKNXQPYKG');
	</script>
	<script type="text/partytown">
		!(function (t, e) {
			var o, n, p, r;
			e.__SV ||
				((window.posthog = e),
				(e._i = []),
				(e.init = function (i, s, a) {
					function g(t, e) {
						var o = e.split('.');
						2 == o.length && ((t = t[o[0]]), (e = o[1])),
							(t[e] = function () {
								t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
							});
					}
					((p = t.createElement('script')).type = 'text/javascript'),
						(p.async = !0),
						(p.src = s.api_host + '/static/array.js'),
						(r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
					var u = e;
					for (
						void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
							u.people = u.people || [],
							u.toString = function (t) {
								var e = 'posthog';
								return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
							},
							u.people.toString = function () {
								return u.toString(1) + '.people (stub)';
							},
							o =
								'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys'.split(
									' '
								),
							n = 0;
						n < o.length;
						n++
					)
						g(u, o[n]);
					e._i.push([i, s, a]);
				}),
				(e.__SV = 1));
		})(document, window.posthog || []);
		posthog.init('phc_osbO9KZwWV9XRGSD2pIzPF7yGbNO92SfjXkuGi6Vljf', {
			api_host: 'https://app.posthog.com'
		});
	</script>
</svelte:head>

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
