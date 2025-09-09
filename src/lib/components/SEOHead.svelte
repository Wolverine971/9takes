<script lang="ts">
	export let title = '9takes - See the emotions behind every take';
	export let description =
		'One situation, 9 ways to see it. Anonymous Q&A platform exploring perspectives through personality types.';
	export let canonical: string;
	export let ogImage = 'https://9takes.com/twitter-card-9takes.webp';
	export let twitterImage = ogImage;
	export let twitterCardType: 'summary' | 'summary_large_image' = 'summary_large_image';
	export let twitterCreator = '@djwayne3';
	export let ogType = 'website';
	export let jsonLd: any = null;
	export let additionalMeta: Array<{ name?: string; property?: string; content: string }> = [];
	export let noindex = false;
	export let author = 'DJ Wayne';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	{#if author}
		<meta name="author" content={author} />
	{/if}

	<!-- OpenGraph -->
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={ogType} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="628" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content={twitterCardType} />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:creator" content={twitterCreator} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={twitterImage} />
	<meta name="twitter:image:alt" content="9takes - {title.replace(' - 9takes', '')}" />

	<!-- Additional Meta Tags -->
	{#each additionalMeta as meta}
		{#if meta.name}
			<meta name={meta.name} content={meta.content} />
		{:else if meta.property}
			<meta property={meta.property} content={meta.content} />
		{/if}
	{/each}

	<!-- JSON-LD Structured Data -->
	{#if jsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>
