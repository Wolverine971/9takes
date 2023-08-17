<script lang="ts">
	export let data: App.BlogPost;

	let title: string = data?.title;
	let description: string = data?.description;
	let slug = `blog/famous-enneagram-types/${data.slug}`;
	const siteTitle = '9takes';
	const formattedTitle = title ? `${title} | ${siteTitle}` : siteTitle;

	let jsonldString = {
		'@context': 'http://schema.org',
		'@type': 'Blog',
		name: title,
		url: `https://9takes.com/${slug}`,
		description: description,
		publisher: { '@type': 'Person', name: data?.author }
	};

	let jsonld = JSON.stringify(jsonldString);
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="canonical" href={data.loc} />
	<meta name="description" content={description || title} />

	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:url" content={data.loc} />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://9takes.com/types/{data.enneagram}s/{data.person}.webp"
	/>

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:url" content={data.loc} />
	<meta
		property="twitter:image"
		content="https://9takes.com/types/{data.enneagram}s/{data.person}.webp"
	/>

	<!-- {@html `<script type="application/ld+json">${jsonld}</script>`} -->
</svelte:head>
