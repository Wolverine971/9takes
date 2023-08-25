<script lang="ts">
	export let data: any;
	export let slug: string;

	let title: string = data?.title;
	let description: string = data?.description;
	const siteTitle = '9takes';
	const formattedTitle = title ? `${title} | ${siteTitle}` : siteTitle;

	let jsonldString = {
		'@context': 'http://schema.org',
		'@type': 'Blog',
		name: title,
		url: `https://9takes.com/${slug}`,
		description: description,
		publisher: { '@type': 'Person', name: data?.author }
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
	console.log(data);
</script>

<svelte:head>
	<title>{formattedTitle}</title>

	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={data.description} />
	<meta name="description" content={description || title} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta property="og:url" content={`https://9takes.com/${slug}`} />
	<!-- {@html `<script type="application/ld+json">${jsonld}</script>`} -->
</svelte:head>
