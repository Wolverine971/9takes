<script lang="ts">
	export let data: any;
	export let slug: string;

	let title: string = data?.title;
	let description: string = data?.description;
	const siteTitle = '9takes';
	const formattedTitle = title ? `${title} | ${siteTitle}` : siteTitle;

	let jsonldString = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: title,
		url: `https://9takes.com/${slug}`,
		description: description,
		publisher: { '@type': 'Person', name: data?.author }
	};

	// let jsonld = {
	// 	'@context': 'https://schema.org',
	// 	'@type': 'Blog',
	// 	name: 'This-Is-Why-Not-Everyone-Agrees-With-You',
	// 	url: 'https://9takes.comThis-Is-Why-Not-Everyone-Agrees-With-You',
	// 	description: 'Lets explore how and why people may not see eye to eye',
	// 	publisher: { '@type': 'Person', name: 'DJ Wayne' }
	// };

	let jsonld = JSON.stringify(jsonldString);
</script>

<svelte:head>
	<title>{formattedTitle}</title>

	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="description" content={description || title} />

	{@html `<script type="application/ld+json">${jsonld}</script>`}
</svelte:head>
