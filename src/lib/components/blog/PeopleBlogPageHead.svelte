<!-- src/lib/components/blog/PeopleBlogPageHead.svelte -->
<script lang="ts">
	import {
		buildPersonalityAnalysisUrl,
		buildPersonalityImagePath,
		buildPersonalityImageUrl,
		formatPersonalityDisplayName,
		resolvePersonalityImageSlug
	} from '$lib/utils/personalityAnalysis';
	import { buildBreadcrumbSchema } from '$lib/utils/schema';

	export let data: App.BlogPost;

	$: title = data?.meta_title || data?.title;
	$: description = data?.description;
	$: formattedTitle = title ? `${title}` : '9takes';
	let jsonLdString: string;
	let breadcrumbJsonLd: string;
	$: canonicalUrl = data?.loc || buildPersonalityAnalysisUrl(data?.person || data?.slug);
	$: personName = formatPersonalityDisplayName(data?.person || data?.slug) || title;
	$: shareImagePath = buildPersonalityImagePath(data?.enneagram, data?.person || data?.slug);
	$: shareImageUrl = buildPersonalityImageUrl(data?.enneagram, data?.person || data?.slug);
	$: resolvedPersonSlug = resolvePersonalityImageSlug(data?.person || data?.slug);

	$: breadcrumbJsonLd = JSON.stringify(
		buildBreadcrumbSchema([
			{ name: 'Home', url: 'https://9takes.com/' },
			{ name: 'Personality Analysis', url: 'https://9takes.com/personality-analysis' },
			{ name: personName, url: canonicalUrl }
		])
	);

	// Build Wikipedia URL from person slug (e.g., "Taylor-Swift" -> "https://en.wikipedia.org/wiki/Taylor_Swift")
	$: wikipediaName = resolvedPersonSlug
		? resolvedPersonSlug
				.split('-')
				.map((w: string) => (w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w))
				.join('_')
		: '';
	$: personSameAs = wikipediaName ? [`https://en.wikipedia.org/wiki/${wikipediaName}`] : [];

	// Prepare common JSON-LD fields
	function buildCommonJsonLdFields() {
		return {
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: title,
			description,
			author: {
				'@type': 'Person',
				name: 'DJ Wayne',
				sameAs: [
					'https://www.instagram.com/djwayne3/',
					'https://www.youtube.com/@djwayne3',
					'https://www.linkedin.com/in/davidtwayne/',
					'https://twitter.com/djwayne3'
				]
			},
			about: {
				'@type': 'Person',
				name: personName,
				...(personSameAs.length > 0 && { sameAs: personSameAs })
			},
			publisher: {
				'@type': 'Organization',
				name: '9takes',
				logo: {
					'@type': 'ImageObject',
					url: 'https://9takes.com/brand/darkRubix.png'
				},
				sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom']
			},
			mainEntityOfPage: {
				'@type': 'WebPage',
				'@id': canonicalUrl
			},
			datePublished: data.date,
			dateModified: data.lastmod,
			...(shareImageUrl && {
				image: {
					'@type': 'ImageObject',
					url: shareImageUrl,
					width: 900,
					height: 900
				}
			})
		};
	}

	// Make this reactive to ensure it updates when data changes
	$: {
		try {
			let jsonLdObject;

			if (data.jsonld_snippet) {
				// Create a deep copy to avoid modifying the original object
				jsonLdObject = JSON.parse(JSON.stringify(data.jsonld_snippet));

				// Handle cases where @graph is present
				if (jsonLdObject['@graph'] && Array.isArray(jsonLdObject['@graph'])) {
					jsonLdObject['@graph'] = jsonLdObject['@graph'].map((item) => {
						if (item['@type'] === 'Article' && item.dateModified) {
							item.dateModified = data.lastmod;
						}
						return item;
					});
				} else {
					// Single object case
					if (jsonLdObject.dateModified) {
						jsonLdObject.dateModified = data.lastmod;
					}
				}
			} else {
				// Generate generic snippet if none exists
				jsonLdObject = buildCommonJsonLdFields();
			}

			jsonLdString = JSON.stringify(jsonLdObject);
		} catch (error) {
			console.error('Error generating JSON-LD:', error);
			// Fallback to basic JSON-LD
			jsonLdString = JSON.stringify(buildCommonJsonLdFields());
		}
	}
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="canonical" href={canonicalUrl} />
	<meta name="description" content={description || title} />

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
	{#if shareImageUrl}
		<meta property="og:image" content={shareImageUrl} />
	{/if}

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || title} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:url" content={canonicalUrl} />
	{#if shareImageUrl}
		<meta name="twitter:image" content={shareImageUrl} />
	{/if}
	<meta name="twitter:image:alt" content={personName} />

	<meta property="article:author" content="DJ Wayne" />
	<meta property="article:published_time" content={data.date} />
	<meta property="article:modified_time" content={data.lastmod} />
	<meta property="article:section" content="Personality-Analysis" />
	<meta
		property="article:tag"
		content={`Personality, Enneagram, Psychology, Mindset, ${personName}`}
	/>

	<!-- JSON-LD snippet - Use {@html} to avoid double-escaping -->
	{#if jsonLdString}
		{@html `<script type="application/ld+json">${jsonLdString}</script>`}
	{/if}
	{#if breadcrumbJsonLd}
		{@html `<script type="application/ld+json">${breadcrumbJsonLd}</script>`}
	{/if}
</svelte:head>
