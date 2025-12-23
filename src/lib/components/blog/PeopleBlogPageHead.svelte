<!-- src/lib/components/blog/PeopleBlogPageHead.svelte -->
<script lang="ts">
	export let data: App.BlogPost;

	let title: string = data?.meta_title || data?.title;
	let description: string = data?.description;
	let slug = `personality-analysis/${data.slug}`;
	const formattedTitle = title ? `${title}` : '9takes';
	let jsonLdString: string;

	// Prepare common JSON-LD fields
	const commonJsonLDFields = {
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
			'@id': `https://9takes.com/${slug}`
		},
		datePublished: data.date,
		dateModified: data.lastmod,
		image: {
			'@type': 'ImageObject',
			url: `https://9takes.com/types/${data.enneagram}s/${data.person}.webp`,
			width: 900,
			height: 900
		}
	};

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
				jsonLdObject = commonJsonLDFields;
			}

			jsonLdString = JSON.stringify(jsonLdObject);
		} catch (error) {
			console.error('Error generating JSON-LD:', error);
			// Fallback to basic JSON-LD
			jsonLdString = JSON.stringify(commonJsonLDFields);
		}
	}
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="canonical" href={data.loc} />
	<meta name="description" content={description || title} />

	<!-- Preload LCP image for faster paint -->
	<link
		rel="preload"
		as="image"
		href={`/types/${data.enneagram}s/${data.person}.webp`}
		fetchpriority="high"
		type="image/webp"
	/>

	<!-- Existing meta tags -->
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={data.loc} />
	<meta
		property="og:image"
		content={`https://9takes.com/types/${data.enneagram}s/${data.person}.webp`}
	/>

	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:description" content={description || title} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:url" content={data.loc} />
	<meta
		name="twitter:image"
		content={`https://9takes.com/types/${data.enneagram}s/${data.person}.webp`}
	/>
	<meta name="twitter:image:alt" content={data.person.split('-').join(' ')} />

	<meta property="article:author" content="DJ Wayne" />
	<meta property="article:published_time" content={data.date} />
	<meta property="article:modified_time" content={data.lastmod} />
	<meta property="article:section" content="Personality-Analysis" />
	<meta
		property="article:tag"
		content={`Personality, Enneagram, Psychology, Mindset, ${data.person.split('-').join(' ')}`}
	/>

	<!-- JSON-LD snippet - Use {@html} to avoid double-escaping -->
	{#if jsonLdString}
		{@html `<script type="application/ld+json">${jsonLdString}</script>`}
	{/if}
</svelte:head>
