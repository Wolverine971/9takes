<!-- src/lib/components/blog/PeopleBlogPageHead.svelte -->
<script lang="ts">
	import {
		buildPersonalityAnalysisUrl,
		buildPersonalityImagePath,
		buildPersonalityImageUrl,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import {
		buildPersonSocialCardUrl,
		buildSocialImageUrl,
		PERSON_SOCIAL_CARD_HEIGHT,
		PERSON_SOCIAL_CARD_WIDTH
	} from '$lib/utils/socialImage';
	import { serializeJsonLd } from '$lib/utils/jsonLd';
	import { buildPersonPageJsonLd } from '$lib/utils/personJsonLd';
	import { buildPersonIdentifiers, buildPersonSameAsUrls } from '$lib/utils/schema';
	import { capDescriptionForSnippet } from '$lib/utils/seoBudget';

	let { data }: { data: App.BlogPost } = $props();

	let articleTitle = $derived(data?.title || data?.meta_title || '');
	let seoTitle = $derived(data?.meta_title || articleTitle || '');
	let description = $derived(data?.description || '');
	let formattedTitle = $derived(seoTitle ? `${seoTitle}` : '9takes');
	// Keep reviewed people-page titles intact. Google can choose its own visual
	// truncation, but a literal ellipsis in <title> weakens exact-match intent.
	let serpTitle = $derived(formattedTitle.trim() || '9takes');
	let serpDescription = $derived(capDescriptionForSnippet(description || seoTitle || articleTitle));
	const robotsContent =
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
	let publishedAt = $derived(data?.date || '');
	let modifiedAt = $derived(data?.lastmod || publishedAt);
	let canonicalUrl = $derived(data?.loc || buildPersonalityAnalysisUrl(data?.person || data?.slug));
	let personName = $derived(
		formatPersonalityDisplayName(data?.person || data?.slug) || articleTitle || seoTitle
	);
	let shareImagePath = $derived(
		buildPersonalityImagePath(data?.enneagram, data?.person || data?.slug)
	);
	let portraitUrl = $derived(buildPersonalityImageUrl(data?.enneagram, data?.person || data?.slug));
	// JSON-LD keeps the square portrait (the person's image); link previews get the 1200x630
	// Cold Light person card built from it.
	let shareImageUrl = $derived(buildSocialImageUrl(portraitUrl));
	let shareCardUrl = $derived(
		buildPersonSocialCardUrl({ imagePath: portraitUrl, name: personName, type: data?.enneagram })
	);
	let shareCardIsBranded = $derived(shareCardUrl.includes('name='));
	let shareCardAlt = $derived(
		data?.enneagram
			? `${personName}, Enneagram Type ${data.enneagram}: personality analysis on 9takes`
			: `${personName}: personality analysis on 9takes`
	);

	let breadcrumbItems = $derived.by(() => [
		{ name: 'Home', url: 'https://9takes.com/' },
		{ name: 'Personality Analysis', url: 'https://9takes.com/personality-analysis' },
		{ name: personName, url: canonicalUrl }
	]);

	let personSameAs = $derived(
		buildPersonSameAsUrls({
			sameAs: data?.same_as,
			wikidataQid: data?.wikidata_qid,
			imdbId: data?.imdb_id,
			wikipedia: data?.wikipedia,
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
			return serializeJsonLd(
				buildPersonPageJsonLd({
					personName,
					canonicalUrl,
					breadcrumb: breadcrumbItems,
					title: seoTitle || articleTitle,
					description,
					articleBody: buildArticleBodySummary(data?.persona_title, description),
					datePublished: publishedAt,
					dateModified: modifiedAt,
					imageUrl: shareImageUrl,
					imageWidth: 1080,
					imageHeight: 1080,
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
					articleCitations: data?.article_citations ?? [],
					wordCount: data?.word_count,
					timeRequired: data?.time_required,
					faqs: data?.faqs ?? [],
					// Emit FAQPage JSON-LD whenever the row carries real FAQs. The old
					// `include_faq_schema` flag was never wired end-to-end (no DB column,
					// never selected) so it left the AEO schema permanently dark. The
					// builder still enforces the MIN_FAQ_ITEMS (2) floor itself.
					includeFaqPage: Array.isArray(data?.faqs) && data.faqs.length >= 2
				})
			);
		} catch (error) {
			console.error('Error generating JSON-LD:', error);
			return '';
		}
	});
</script>

<svelte:head>
	<title>{serpTitle}</title>
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" href={canonicalUrl} hreflang="en-US" />
	<link rel="alternate" href={canonicalUrl} hreflang="x-default" />
	<meta name="description" content={serpDescription} />
	<meta name="robots" content={robotsContent} />
	<meta name="author" content="DJ Wayne" />

	<!-- Preload LCP image for faster paint -->
	{#if shareImagePath}
		<link rel="preload" as="image" href={shareImagePath} fetchpriority="high" type="image/webp" />
	{/if}

	<!-- Existing meta tags -->
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={seoTitle || articleTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:locale" content="en_US" />
	{#if shareCardUrl}
		<meta property="og:image" content={shareCardUrl} />
		<meta property="og:image:secure_url" content={shareCardUrl} />
		{#if shareCardIsBranded}
			<meta property="og:image:type" content="image/jpeg" />
			<meta property="og:image:width" content={String(PERSON_SOCIAL_CARD_WIDTH)} />
			<meta property="og:image:height" content={String(PERSON_SOCIAL_CARD_HEIGHT)} />
			<meta property="og:image:alt" content={shareCardAlt} />
		{:else}
			<meta property="og:image:type" content="image/png" />
			<meta property="og:image:width" content="1080" />
			<meta property="og:image:height" content="1080" />
			<meta property="og:image:alt" content={personName} />
		{/if}
	{/if}

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || seoTitle || articleTitle} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={seoTitle || articleTitle} />
	<meta name="twitter:url" content={canonicalUrl} />
	{#if shareCardUrl}
		<meta name="twitter:image" content={shareCardUrl} />
		<meta name="twitter:image:src" content={shareCardUrl} />
		{#if shareCardIsBranded}
			<meta name="twitter:image:width" content={String(PERSON_SOCIAL_CARD_WIDTH)} />
			<meta name="twitter:image:height" content={String(PERSON_SOCIAL_CARD_HEIGHT)} />
		{/if}
	{/if}
	<meta name="twitter:image:alt" content={shareCardIsBranded ? shareCardAlt : personName} />

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
