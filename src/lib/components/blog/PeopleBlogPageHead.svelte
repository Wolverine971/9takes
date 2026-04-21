<!-- src/lib/components/blog/PeopleBlogPageHead.svelte -->
<script lang="ts">
	import {
		buildPersonalityAnalysisUrl,
		buildPersonalityImagePath,
		buildPersonalityImageUrl,
		formatPersonalityDisplayName,
		resolvePersonalityImageSlug
	} from '$lib/utils/personalityAnalysis';
	import { buildSocialImageUrl } from '$lib/utils/socialImage';
	import { buildPersonPageJsonLd } from '$lib/utils/personJsonLd';
	import { buildPersonIdentifiers, buildPersonSameAsUrls } from '$lib/utils/schema';

	let { data }: { data: App.BlogPost } = $props();

	let title = $derived(data?.meta_title || data?.title || '');
	let description = $derived(data?.description || '');
	let formattedTitle = $derived(title ? `${title}` : '9takes');
	const robotsContent =
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
	let publishedAt = $derived(data?.date || '');
	let modifiedAt = $derived(data?.lastmod || publishedAt);
	let canonicalUrl = $derived(data?.loc || buildPersonalityAnalysisUrl(data?.person || data?.slug));
	let personName = $derived(formatPersonalityDisplayName(data?.person || data?.slug) || title);
	let shareImagePath = $derived(
		buildPersonalityImagePath(data?.enneagram, data?.person || data?.slug)
	);
	let shareImageUrl = $derived(
		buildSocialImageUrl(buildPersonalityImageUrl(data?.enneagram, data?.person || data?.slug))
	);
	let resolvedPersonSlug = $derived(resolvePersonalityImageSlug(data?.person || data?.slug));

	let breadcrumbItems = $derived.by(() => [
		{ name: 'Home', url: 'https://9takes.com/' },
		{ name: 'Personality Analysis', url: 'https://9takes.com/personality-analysis' },
		{ name: personName, url: canonicalUrl }
	]);

	// Build Wikipedia URL from person slug (e.g., "Taylor-Swift" -> "https://en.wikipedia.org/wiki/Taylor_Swift")
	let wikipediaName = $derived(
		resolvedPersonSlug
			? resolvedPersonSlug
					.split('-')
					.map((w: string) => (w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w))
					.join('_')
			: ''
	);
	let personSameAs = $derived(
		buildPersonSameAsUrls({
			sameAs: data?.same_as,
			wikidataQid: data?.wikidata_qid,
			imdbId: data?.imdb_id,
			wikipedia: data?.wikipedia,
			fallbackWikipedia: wikipediaName ? `https://en.wikipedia.org/wiki/${wikipediaName}` : null,
			twitter: data?.twitter,
			instagram: data?.instagram,
			tiktok: data?.tiktok
		})
	);
	let personIdentifiers = $derived(
		buildPersonIdentifiers({
			wikidataQid: data?.wikidata_qid,
			imdbId: data?.imdb_id
		})
	);

	function buildArticleBodySummary(personaTitle: string | null | undefined, fallback: string) {
		const parts = [personaTitle, fallback].filter(
			(value): value is string => typeof value === 'string' && value.trim().length > 0
		);
		return parts.join('. ');
	}

	let jsonLdString = $derived.by(() => {
		try {
			return JSON.stringify(
				buildPersonPageJsonLd({
					personName,
					canonicalUrl,
					breadcrumb: breadcrumbItems,
					title,
					description,
					articleBody: buildArticleBodySummary(data?.persona_title, description),
					datePublished: publishedAt,
					dateModified: modifiedAt,
					imageUrl: shareImageUrl,
					imageWidth: 900,
					imageHeight: 900,
					keywords: data?.keywords ?? [],
					sameAs: personSameAs,
					identifiers: personIdentifiers,
					birthDate: data?.birth_date,
					birthPlace: data?.birth_place,
					nationality: data?.nationality,
					jobTitle: data?.occupation?.[0],
					hasOccupation: data?.occupation ?? [],
					knowsAbout: data?.knows_about ?? [],
					citations: data?.citations ?? [],
					wordCount: data?.word_count,
					timeRequired: data?.time_required,
					faqs: data?.faqs ?? []
				})
			);
		} catch (error) {
			console.error('Error generating JSON-LD:', error);
			return '';
		}
	});
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" href={canonicalUrl} hreflang="en-US" />
	<link rel="alternate" href={canonicalUrl} hreflang="x-default" />
	<meta name="description" content={description || title} />
	<meta name="robots" content={robotsContent} />
	<meta name="author" content="DJ Wayne" />

	<!-- Preload LCP image for faster paint -->
	{#if shareImagePath}
		<link rel="preload" as="image" href={shareImagePath} fetchpriority="high" type="image/webp" />
	{/if}

	<!-- Existing meta tags -->
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:locale" content="en_US" />
	{#if shareImageUrl}
		<meta property="og:image" content={shareImageUrl} />
		<meta property="og:image:secure_url" content={shareImageUrl} />
		<meta property="og:image:type" content="image/png" />
		<meta property="og:image:width" content="1080" />
		<meta property="og:image:height" content="1080" />
		<meta property="og:image:alt" content={personName} />
	{/if}

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || title} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:url" content={canonicalUrl} />
	{#if shareImageUrl}
		<meta name="twitter:image" content={shareImageUrl} />
		<meta name="twitter:image:src" content={shareImageUrl} />
	{/if}
	<meta name="twitter:image:alt" content={personName} />

	<meta property="article:author" content="DJ Wayne" />
	<meta property="article:published_time" content={publishedAt} />
	<meta property="article:modified_time" content={modifiedAt} />
	<meta property="article:section" content="Personality-Analysis" />
	<meta
		property="article:tag"
		content={`Personality, Enneagram, Psychology, Mindset, ${personName}`}
	/>

	<!-- JSON-LD snippet - Use {@html} to avoid double-escaping -->
	{#if jsonLdString}
		{@html `<script type="application/ld+json">${jsonLdString}</script>`}
	{/if}
</svelte:head>
