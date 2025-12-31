<!-- src/lib/components/blog/BlogPageHead.svelte -->
<script lang="ts">
	export let data: App.BlogPost;
	export let slug: string;

	// Use meta_title for SEO/social if available, otherwise fall back to title
	let title: string = data?.meta_title || data?.title;
	let description: string = data?.description;
	const formattedTitle = title ? `${title}` : '9takes';
	const defaultShareImage = 'https://9takes.com/brand/aero.png';
	const shareImage = data?.pic ? `https://9takes.com/blogs/${data.pic}.webp` : defaultShareImage;
	const shareImageAlt = data?.pic ? data.pic.split('-').join(' ') : title || '9takes';

	let jsonldString = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		name: title,
		url: `https://9takes.com/${slug}`,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `https://9takes.com/${slug}`
		},
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
		description: description,
		datePublished: data.date,
		dateModified: data.lastmod,
		image: shareImage,
		publisher: {
			'@type': 'Organization',
			sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom'],
			logo: {
				'@type': 'ImageObject',
				url: 'https://9takes.com/brand/aero.png'
			},
			name: '9takes'
		}
	};

	// let jsonld = {
	// 	'@context': '',
	// 	'@type': 'Blog',
	// 	name: 'This-Is-Why-Not-Everyone-Agrees-With-You',
	// 	url: 'https://9takes.comThis-Is-Why-Not-Everyone-Agrees-With-You',
	// 	description: 'Lets explore how and why people may not see eye to eye',
	// 	publisher: { '@type': 'Person', name: 'DJ Wayne' }
	// };

	let jsonld = JSON.stringify(jsonldString);

	const isHowToGuide = slug.includes('how-to');
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
	<meta property="article:modified_time" content={data.lastmod} />
	<meta property="article:section" content={isHowToGuide ? 'How-To-Guides' : 'Enneagram-Corner'} />
	<meta property="article:tag" content={tags.join(', ')} />

	{@html `<script type="application/ld+json">${jsonld}</script>`}
</svelte:head>
