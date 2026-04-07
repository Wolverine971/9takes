<!-- src/lib/components/SEOHead.svelte -->
<script lang="ts">
	interface AdditionalMetaEntry {
		name?: string;
		property?: string;
		content: string;
	}

	interface Props {
		title?: string;
		description?: string;
		canonical?: string;
		ogImage?: string;
		twitterImage?: string;
		twitterCardType?: 'summary' | 'summary_large_image';
		twitterCreator?: string;
		ogType?: string;
		jsonLd?: any;
		additionalMeta?: AdditionalMetaEntry[];
		noindex?: boolean;
		nofollow?: boolean;
		author?: string;
		twitterImageAlt?: string;
		locale?: string;
	}

	let {
		title = '9takes - See the emotions behind every take',
		description = 'One situation, 9 ways to see it. Anonymous Q&A platform exploring perspectives through personality types.',
		canonical,
		ogImage = 'https://9takes.com/twitter-card-9takes.webp',
		twitterImage: providedTwitterImage,
		twitterCardType = 'summary_large_image',
		twitterCreator = '@djwayne3',
		ogType = 'website',
		jsonLd = null,
		additionalMeta = [],
		noindex = false,
		nofollow = noindex,
		author = 'DJ Wayne',
		twitterImageAlt = '',
		locale = 'en_US'
	}: Props = $props();

	const TITLE_SUFFIX = ' - 9takes';
	let twitterImage = $derived(providedTwitterImage ?? ogImage);
	let computedTwitterImageAlt = $derived(
		twitterImageAlt || (title ? `9takes - ${title.replace(TITLE_SUFFIX, '')}` : '9takes')
	);
	let robotsContent = $derived(
		`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if canonical}
		<link rel="canonical" href={canonical} />
		<link rel="alternate" href={canonical} hreflang="en-US" />
		<link rel="alternate" href={canonical} hreflang="x-default" />
	{/if}
	<meta name="robots" content={robotsContent} />

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
	<meta property="og:image:alt" content={computedTwitterImageAlt} />
	<meta property="og:locale" content={locale} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content={twitterCardType} />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:creator" content={twitterCreator} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={twitterImage} />
	<meta name="twitter:image:alt" content={computedTwitterImageAlt} />

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
