<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	// import { PUBLIC_GOOGLE } from '$env/static/public';
</script>

<svelte:head>
	<!-- Google tag (gtag.js) -->
	{#if !dev}
		<!-- <script type="text/javascript" defer>
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
		</script> -->
		<!-- <script type="text/javascript" defer>
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
		<link
			href="https://www.googletagmanager.com/gtag/js?id=G-1BKNXQPYKG"
			rel="preload"
			as="script"
		/>

		<script async src="https://www.googletagmanager.com/gtag/js?id=G-1BKNXQPYKG"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());

			gtag('config', 'G-1BKNXQPYKG');
		</script>
		<script>
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
		</script> -->
	{/if}
</svelte:head>
