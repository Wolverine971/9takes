<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	// import { PUBLIC_GOOGLE } from '$env/static/public';

	let PUBLIC_GOOGLE = import.meta.env.PUBLIC_GOOGLE;
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
	<script async src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GOOGLE}`}>
	</script>
	<script async>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', PUBLIC_GOOGLE);
	</script>
</svelte:head>
