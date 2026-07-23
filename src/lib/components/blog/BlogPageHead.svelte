<!-- src/lib/components/blog/BlogPageHead.svelte -->
<script lang="ts">
	import { buildSocialImageUrl } from '$lib/utils/socialImage';
	import { buildBreadcrumbSchemaForGraph } from '$lib/utils/schema';
	import { capDescriptionForSnippet, capTitleForSnippet } from '$lib/utils/seoBudget';
	import {
		AUTHOR_DJ_WAYNE_ID,
		DJ_WAYNE_SAME_AS,
		PUBLISHER_ID,
		PUBLISHER_SAME_AS
	} from '$lib/utils/personJsonLd';

	interface Props {
		data: App.BlogPost;
		slug: string;
		skipJsonLd?: boolean;
	}

	let { data, slug, skipJsonLd = false }: Props = $props();
	let shouldSkipJsonLd = $derived(skipJsonLd || data?.skip_jsonld === true);

	// Use meta_title for snippet/social text, but keep Article JSON-LD aligned
	// to the visible H1 title.
	let articleTitle = $derived(data?.title || data?.meta_title || '');
	let seoTitle = $derived(data?.meta_title || articleTitle || '');
	let description = $derived(data?.description || '');
	let formattedTitle = $derived(seoTitle ? `${seoTitle}` : '9takes');
	// SERP-budgeted variants - only constrain the snippet-facing tags.
	let serpTitle = $derived(capTitleForSnippet(formattedTitle));
	let serpDescription = $derived(capDescriptionForSnippet(description || seoTitle || articleTitle));
	const defaultShareImage = 'https://9takes.com/brand/9takes-nine-mask-social-card.png';
	let shareImage = $derived(
		data?.picGroup?.length
			? buildSocialImageUrl(data.picGroup[0].image)
			: data?.pic
				? `https://9takes.com/blogs/${data.pic}.webp`
				: defaultShareImage
	);
	let shareImageAlt = $derived(
		data?.picGroup?.length
			? data.picGroup.map((p) => p.text).join(', ')
			: data?.pic
				? data.pic.split('-').join(' ')
				: articleTitle || '9takes'
	);
	let shareImageWidth = $derived(data?.picGroup?.length ? '560' : data?.pic ? '900' : '1200');
	let shareImageHeight = $derived(data?.picGroup?.length ? '560' : data?.pic ? '900' : '630');
	const robotsContent =
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
	let canonicalUrl = $derived(`https://9takes.com/${slug}`);

	// Detect blog section from slug
	function getArticleSection(s: string): string {
		if (s.startsWith('how-to-guides/')) return 'How-To Guides';
		if (s.startsWith('community/')) return 'Community';
		if (s.startsWith('enneagram-corner/mental-health/')) return 'Mental Health';
		if (s.startsWith('enneagram-corner/')) return 'Enneagram';
		if (s.startsWith('pop-culture/')) return 'Pop Culture';
		return 'Blog';
	}

	function getBlogName(s: string): string {
		if (s.startsWith('how-to-guides/')) return '9takes How-To Guides';
		if (s.startsWith('community/')) return '9takes Community Blog';
		if (s.startsWith('enneagram-corner/')) return '9takes Enneagram Corner';
		if (s.startsWith('pop-culture/')) return '9takes Pop Culture';
		return '9takes Blog';
	}

	function getBlogUrl(s: string): string {
		const section = s.split('/')[0];
		return `https://9takes.com/${section}`;
	}

	function getSectionRoute(s: string): string {
		if (s.startsWith('enneagram-corner/mental-health/')) return 'enneagram-corner/mental-health';
		return s.split('/')[0];
	}

	let articleSection = $derived(getArticleSection(slug));
	let sectionRoute = $derived(getSectionRoute(slug));
	let isHowToGuide = $derived(slug.startsWith('how-to-guides/'));

	let tags = $derived.by(() =>
		(isHowToGuide
			? ['How to', 'Guide']
			: [
					'Personality',
					'Enneagram',
					'Psychology',
					data.person ? data.person.split('-').join(' ') : null
				]
		).filter((tag): tag is string => Boolean(tag))
	);

	let breadcrumbItems = $derived.by(() => [
		{ name: 'Home', url: 'https://9takes.com/' },
		{ name: articleSection, url: `https://9takes.com/${sectionRoute}` },
		{ name: articleTitle || seoTitle, url: canonicalUrl }
	]);

	let aboutThings = $derived(
		(data?.about_things ?? []).map((thing) => ({
			'@type': 'Thing',
			name: thing.name,
			...(thing.description ? { description: thing.description } : {}),
			...(thing.sameAs ? { sameAs: thing.sameAs } : {})
		}))
	);

	let mentions = $derived(
		(data?.mentions ?? []).map((mention) => ({
			'@type': 'Thing',
			name: mention.name,
			...(mention.description ? { description: mention.description } : {})
		}))
	);

	let articleCitations = $derived(
		(data?.article_citations ?? []).map((citation) => ({
			'@type': 'CreativeWork',
			name: citation.name,
			...(citation.author ? { author: citation.author } : {}),
			...(citation.datePublished ? { datePublished: citation.datePublished } : {}),
			...(citation.publisher ? { publisher: citation.publisher } : {}),
			...(citation.url ? { url: citation.url } : {})
		}))
	);

	let articleType = $derived(
		data?.medical === true ? ['BlogPosting', 'MedicalWebPage'] : 'BlogPosting'
	);

	let blogPostingNode = $derived({
		'@type': articleType,
		'@id': `${canonicalUrl}#article`,
		headline: articleTitle || seoTitle,
		name: articleTitle || seoTitle,
		url: canonicalUrl,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': canonicalUrl
		},
		author: {
			'@type': 'Person',
			'@id': AUTHOR_DJ_WAYNE_ID,
			name: 'DJ Wayne',
			url: 'https://9takes.com/about',
			jobTitle: 'Creator of 9takes',
			image: 'https://9takes.com/brand/djface.webp',
			knowsAbout: ['Enneagram', 'personality psychology', 'emotional intelligence'],
			sameAs: DJ_WAYNE_SAME_AS
		},
		description,
		datePublished: data.date,
		dateModified: data.lastmod || data.date,
		...(data?.picGroup?.length || data?.pic
			? {
					image: {
						'@type': 'ImageObject',
						url: shareImage,
						width: data?.picGroup?.length ? 560 : 900,
						height: data?.picGroup?.length ? 560 : 900
					}
				}
			: {}),
		isAccessibleForFree: true,
		publisher: {
			'@type': 'Organization',
			'@id': PUBLISHER_ID,
			name: '9takes',
			url: 'https://9takes.com/',
			logo: {
				'@type': 'ImageObject',
				url: 'https://9takes.com/brand/9takes-nine-mask-logo-512.png'
			},
			sameAs: PUBLISHER_SAME_AS
		},
		articleSection,
		inLanguage: 'en-US',
		keywords: tags,
		isPartOf: {
			'@type': 'Blog',
			name: getBlogName(slug),
			url: getBlogUrl(slug)
		},
		...(aboutThings.length ? { about: aboutThings } : {}),
		...(mentions.length ? { mentions } : {}),
		...(articleCitations.length ? { citation: articleCitations } : {}),
		...(data?.medical && data?.disclaimer ? { disclaimer: data.disclaimer } : {})
	});

	let jsonldObj = $derived.by(() => ({
		'@context': 'https://schema.org',
		'@graph': [blogPostingNode, buildBreadcrumbSchemaForGraph(breadcrumbItems)]
	}));

	let jsonld = $derived(JSON.stringify(jsonldObj));
</script>

<svelte:head>
	<title>{serpTitle}</title>
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" href={canonicalUrl} hreflang="en-US" />
	<link rel="alternate" href={canonicalUrl} hreflang="x-default" />
	<meta name="description" content={serpDescription} />
	<meta name="robots" content={robotsContent} />
	<meta name="author" content="DJ Wayne" />

	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={seoTitle || articleTitle} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={shareImage} />
	<meta property="og:image:width" content={shareImageWidth} />
	<meta property="og:image:height" content={shareImageHeight} />
	<meta property="og:image:alt" content={shareImageAlt} />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || seoTitle || articleTitle} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={seoTitle || articleTitle} />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:image" content={shareImage} />
	<meta name="twitter:image:alt" content={shareImageAlt} />
	<meta property="article:author" content="DJ Wayne" />

	<meta property="article:published_time" content={data.date} />
	<meta property="article:modified_time" content={data.lastmod || data.date} />
	<meta property="article:section" content={articleSection} />
	<meta property="article:tag" content={tags.join(', ')} />

	{#if !shouldSkipJsonLd}
		{@html `<script type="application/ld+json">${jsonld}</script>`}
	{/if}
</svelte:head>
