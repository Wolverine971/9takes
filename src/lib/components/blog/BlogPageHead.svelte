<!-- src/lib/components/blog/BlogPageHead.svelte -->
<script lang="ts">
	export let data: App.BlogPost;
	export let slug: string;

	// Use meta_title for SEO/social if available, otherwise fall back to title
	let title: string = data?.meta_title || data?.title;
	let description: string = data?.description;
	const formattedTitle = title ? `${title}` : '9takes';

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
		image: data?.pic
			? `https://9takes.com/blogs/${data.pic}.webp`
			: 'https://9takes.com/brand/aero.png',
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
	const tags = isHowToGuide
		? ['How to', 'Guide']
		: ['Personality', 'Enneagram', 'Psychology', data.person?.split('-').join(' ')];
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="canonical" href={`https://9takes.com/${slug}`} />
	<meta name="description" content={description || title} />
	<meta name="viewport" content="width=device-width,initial-scale=1" />

	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`https://9takes.com/${slug}`} />
	<meta property="og:image" content={`https://9takes.com/blogs/${data?.pic}.webp`} />

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || title} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={title} />
	<meta property="twitter:url" content={`https://9takes.com/${slug}`} />
	<meta name="twitter:image" content={`https://9takes.com/blogs/${data?.pic}.webp`} />
	{#if data?.pic}
		<meta name="twitter:image:alt" content={data?.pic?.split('-').join(' ')} />
	{/if}
	<meta property="article:author" content="DJ Wayne" />

	<meta property="article:published_time" content={data.date} />
	<meta property="article:modified_time" content={data.lastmod} />
	<meta property="article:section" content={isHowToGuide ? 'How-To-Guides' : 'Enneagram-Corner'} />
	<meta property="article:tag" content={tags.join(', ')} />

	{@html `<script type="application/ld+json">${jsonld}</script>`}
</svelte:head>
