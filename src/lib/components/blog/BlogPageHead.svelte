<!-- src/lib/components/blog/BlogPageHead.svelte -->
<script lang="ts">
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

	// Detect blog section from slug
	function getArticleSection(s: string): string {
		if (s.startsWith('how-to-guides/')) return 'How-To Guides';
		if (s.startsWith('community/')) return 'Community';
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

	const articleSection = getArticleSection(slug);
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

	const jsonldObj = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `https://9takes.com/${slug}#article`,
		headline: title,
		name: title,
		url: `https://9takes.com/${slug}`,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://9takes.com/${slug}`
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
	};

	let jsonld = JSON.stringify(jsonldObj);
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="canonical" href={`https://9takes.com/${slug}`} />
	<meta name="description" content={description || title} />

	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`https://9takes.com/${slug}`} />
	<meta property="og:image" content={shareImage} />
	<meta property="og:image:width" content="900" />
	<meta property="og:image:height" content="900" />

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || title} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:url" content={`https://9takes.com/${slug}`} />
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
