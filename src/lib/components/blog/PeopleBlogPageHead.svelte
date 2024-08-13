<script lang="ts">
	export let data: App.BlogPost;

	let title: string = data?.title;
	let description: string = data?.description;
	let slug = `personality-analysis/${data.slug}`;
	const formattedTitle = title ? `${title}` : '9takes';

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
	<meta name="viewport" content="width=device-width,initial-scale=1" />

	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={data.loc} />
	<meta
		property="og:image"
		content="https://9takes.com/types/{data.enneagram}s/{data.person}.webp"
	/>

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || title} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:url" content={data.loc} />
	<meta
		property="twitter:image"
		content="https://9takes.com/types/{data.enneagram}s/{data.person}.webp"
	/>
	{#if data?.pic}
		<meta name="twitter:image:alt" content={data?.person?.split('-').join(' ')} />
	{/if}

	<!-- {@html `<script type="application/ld+json">${jsonld}</script>`} -->
</svelte:head>
