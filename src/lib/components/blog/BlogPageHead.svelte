<!-- src/lib/components/blog/BlogPageHead.svelte -->
<script lang="ts">
	import { buildBreadcrumbSchemaForGraph } from '$lib/utils/schema';

	export let data: App.BlogPost;
	export let slug: string;
	export let skipJsonLd: boolean = false;

	// Use meta_title for SEO/social if available, otherwise fall back to title
	let title: string = data?.meta_title || data?.title;
	let description: string = data?.description;
	const formattedTitle = title ? `${title}` : '9takes';
	const defaultShareImage = 'https://9takes.com/brand/aero.png';
	const shareImage = data?.pic ? `https://9takes.com/blogs/${data.pic}.webp` : defaultShareImage;
	const shareImageAlt = data?.pic ? data.pic.split('-').join(' ') : title || '9takes';
	const robotsContent =
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
	$: canonicalUrl = `https://9takes.com/${slug}`;

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

	const articleSection = getArticleSection(slug);
	const sectionRoute = getSectionRoute(slug);
	const isHowToGuide = slug.startsWith('how-to-guides/');

	const tags = (
		isHowToGuide
			? ['How to', 'Guide']
			: [
					'Personality',
					'Enneagram',
					'Psychology',
					data.person ? data.person.split('-').join(' ') : null
				]
	).filter((tag): tag is string => Boolean(tag));

	// Build breadcrumb items
	const breadcrumbItems = [
		{ name: 'Home', url: 'https://9takes.com/' },
		{ name: articleSection, url: `https://9takes.com/${sectionRoute}` },
		{ name: title, url: canonicalUrl }
	];

	const jsonldObj = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BlogPosting',
				'@id': `${canonicalUrl}#article`,
				headline: title,
				name: title,
				url: canonicalUrl,
				mainEntityOfPage: {
					'@type': 'WebPage',
					'@id': canonicalUrl
				},
				author: {
					'@type': 'Person',
					'@id': 'https://9takes.com/#person/dj-wayne',
					name: 'DJ Wayne',
					url: 'https://9takes.com/about',
					jobTitle: 'Creator of 9takes',
					image: 'https://9takes.com/brand/djface.webp',
					knowsAbout: ['Enneagram', 'personality psychology', 'emotional intelligence'],
					sameAs: [
						'https://www.instagram.com/djwayne3/',
						'https://www.linkedin.com/in/djwayne/',
						'https://twitter.com/djwayne3'
					]
				},
				description: description,
				datePublished: data.date,
				dateModified: data.lastmod || data.date,
				image: data?.pic
					? {
							'@type': 'ImageObject',
							url: shareImage,
							width: 900,
							height: 900
						}
					: shareImage,
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					logo: {
						'@type': 'ImageObject',
						url: 'https://9takes.com/brand/aero.png'
					},
					sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom']
				},
				articleSection: articleSection,
				inLanguage: 'en-US',
				keywords: tags,
				isPartOf: {
					'@type': 'Blog',
					name: getBlogName(slug),
					url: getBlogUrl(slug)
				}
			},
			buildBreadcrumbSchemaForGraph(breadcrumbItems)
		]
	};

	let jsonld = JSON.stringify(jsonldObj);
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" href={canonicalUrl} hreflang="en-US" />
	<link rel="alternate" href={canonicalUrl} hreflang="x-default" />
	<meta name="description" content={description || title} />
	<meta name="robots" content={robotsContent} />
	<meta name="author" content="DJ Wayne" />

	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={shareImage} />
	<meta property="og:image:width" content="900" />
	<meta property="og:image:height" content="900" />
	<meta property="og:image:alt" content={shareImageAlt} />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || title} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:image" content={shareImage} />
	<meta name="twitter:image:alt" content={shareImageAlt} />
	<meta property="article:author" content="DJ Wayne" />

	<meta property="article:published_time" content={data.date} />
	<meta property="article:modified_time" content={data.lastmod || data.date} />
	<meta property="article:section" content={articleSection} />
	<meta property="article:tag" content={tags.join(', ')} />

	{#if !skipJsonLd}
		{@html `<script type="application/ld+json">${jsonld}</script>`}
	{/if}
</svelte:head>
