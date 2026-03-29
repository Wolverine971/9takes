<!-- src/routes/personality-analysis/type/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import EnneagramTypeIntro from '$lib/components/blog/EnneagramTypeIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import EnneagramTypeBottom from '$lib/components/blog/EnneagramTypeBottom.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	export let data: PageData;

	const enneagramTypes: Record<string, { name: string; tagline: string }> = {
		'1': { name: 'The Perfectionist', tagline: 'Principled, purposeful, self-controlled' },
		'2': { name: 'The Helper', tagline: 'Generous, demonstrative, people-pleasing' },
		'3': { name: 'The Achiever', tagline: 'Adaptable, excelling, driven' },
		'4': { name: 'The Individualist', tagline: 'Expressive, dramatic, self-absorbed' },
		'5': { name: 'The Investigator', tagline: 'Perceptive, innovative, secretive' },
		'6': { name: 'The Loyalist', tagline: 'Engaging, responsible, anxious' },
		'7': { name: 'The Enthusiast', tagline: 'Spontaneous, versatile, scattered' },
		'8': { name: 'The Challenger', tagline: 'Self-confident, decisive, confrontational' },
		'9': { name: 'The Peacemaker', tagline: 'Receptive, reassuring, complacent' }
	};

	function getLatestDate(people: PageData['people']): string | null {
		let latestDate: string | null = null;
		let latestTimestamp = 0;

		for (const person of people) {
			const candidate = person.lastmod ?? person.date;
			if (!candidate) continue;

			const timestamp = new Date(candidate).getTime();
			if (!Number.isFinite(timestamp) || timestamp <= latestTimestamp) continue;

			latestDate = candidate;
			latestTimestamp = timestamp;
		}

		return latestDate;
	}

	$: typeInfo = enneagramTypes[data.slug] || { name: '', tagline: '' };

	$: seoTitle = `Famous Enneagram Type ${data.slug}s: ${typeInfo.name} | 9takes`;
	$: seoDescription = `${data.people.length} famous Enneagram Type ${data.slug} (${typeInfo.name}) personalities analyzed. ${typeInfo.tagline}. See how this type shows up in celebrities, leaders, and creators.`;
	$: canonicalUrl = `https://9takes.com/personality-analysis/type/${data.slug}`;

	$: latestDate = getLatestDate(data.people);

	$: structuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: 'https://9takes.com'
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Personality Analysis',
						item: 'https://9takes.com/personality-analysis'
					},
					{
						'@type': 'ListItem',
						position: 3,
						name: `Type ${data.slug}: ${typeInfo.name}`
					}
				]
			},
			{
				'@type': 'CollectionPage',
				name: `Enneagram Type ${data.slug} (${typeInfo.name}) Famous People`,
				description: seoDescription,
				url: canonicalUrl,
				inLanguage: 'en-US',
				...(latestDate ? { dateModified: latestDate } : {}),
				isPartOf: {
					'@type': 'CollectionPage',
					name: 'Famous Personality Analysis',
					url: 'https://9takes.com/personality-analysis'
				},
				about: [
					{
						'@type': 'Thing',
						name: 'Enneagram of Personality',
						sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
					},
					{
						'@type': 'Thing',
						name: `Enneagram Type ${data.slug}: ${typeInfo.name}`
					}
				],
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com',
					logo: {
						'@type': 'ImageObject',
						url: 'https://9takes.com/brand/aero.png'
					}
				},
				mainEntity: {
					'@type': 'ItemList',
					numberOfItems: data.people.length,
					itemListOrder: 'https://schema.org/ItemListUnordered',
					itemListElement: data.people.map((person: any, index: number) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: formatPersonalityDisplayName(person.slug),
						url: `https://9takes.com${buildPersonalityAnalysisPath(person.slug)}`
					}))
				}
			}
		]
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<SEOHead
	title={seoTitle}
	description={seoDescription}
	canonical={canonicalUrl}
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/personality-analysis-card.webp"
	author="9takes"
/>

<div class="page-wrapper">
	<header class="hero">
		<div class="type-badge">
			<span class="type-num">{data.slug}</span>
		</div>
		<h1>Type {data.slug}: {typeInfo.name}</h1>
		<p class="tagline">{typeInfo.tagline}</p>
	</header>

	<article class="enneagram-type-page">
		<EnneagramTypeIntro type={data.slug} />

		<section class="famous-people">
			<div class="section-header">
				<h2>Famous Type {data.slug}s</h2>
				<span class="people-count">{data.people.length} personalities</span>
			</div>
			<div class="people-grid-container">
				{#each data.people as person}
					<a href={buildPersonalityAnalysisPath(person.slug)} class="grid-item">
						{#if person.enneagram}
							<img
								loading="lazy"
								class="grid-img"
								src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
								alt={`${formatPersonalityDisplayName(person.slug)} - Enneagram Type ${data.slug}`}
								width="218"
								height="218"
							/>
						{/if}
						<div class="person-name">
							<h3 style:--tag={`h-blog-${person.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}>
								{formatPersonalityDisplayName(person.slug)}
							</h3>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<EnneagramTypeBottom type={data.slug} />

		<footer>
			<p class="more-info">More information coming soon about Enneagram Type {data.slug}!</p>
			{#if !data?.user}
				<div class="email-signup">
					<EmailSignup />
				</div>
			{/if}
		</footer>
	</article>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme - Type Page */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 2rem;
		text-align: center;
		position: relative;
	}

	.hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 400px;
		height: 200px;
		background: radial-gradient(ellipse, rgba(45, 212, 191, 0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-dark) 100%);
		border-radius: 1rem;
		margin-bottom: 1rem;
		box-shadow: 0 0 30px rgba(45, 212, 191, 0.4);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: -2px;
			border-radius: 1.125rem;
			background: linear-gradient(135deg, rgba(167, 139, 250, 0.4) 0%, transparent 50%);
			z-index: -1;
		}
	}

	.type-num {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.tagline {
		font-size: 1rem;
		color: var(--text-tertiary);
		margin: 0;
		font-weight: 500;
	}

	/* Main Content */
	.enneagram-type-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}

	/* Section Header */
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.people-count {
		font-size: 0.875rem;
		color: var(--primary);
		font-weight: 500;
		padding: 0.375rem 0.75rem;
		background: var(--primary-subtle);
		border-radius: 2rem;
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
	}

	.famous-people {
		margin-bottom: 3rem;
	}

	.people-grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 1rem;
	}

	.grid-item {
		position: relative;
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--bg-surface);
		border: 1px solid var(--border-color);
		transition: all 0.25s ease;
		text-decoration: none;
		box-shadow: var(--shadow-sm);
		padding: 0.45rem;

		&::before {
			content: '';
			position: absolute;
			inset: 0.45rem;
			border-radius: 0.6rem;
			background: linear-gradient(135deg, rgba(45, 212, 191, 0.1) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: rgba(45, 212, 191, 0.4);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px rgba(45, 212, 191, 0.1);

			&::before {
				opacity: 1;
			}

			.grid-img {
				transform: scale(1.05);
			}

			.person-name {
				background: linear-gradient(to top, rgba(12, 10, 9, 0.98) 0%, rgba(12, 10, 9, 0.84) 100%);

				h3 {
					color: #fff;
				}
			}
		}
	}

	.grid-img {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		transition: transform 0.4s ease;
		border-radius: 0.6rem;
		display: block;
	}

	.person-name {
		position: absolute;
		bottom: 0.45rem;
		left: 0.45rem;
		right: 0.45rem;
		border-radius: 0 0 0.6rem 0.6rem;
		background: linear-gradient(to top, rgba(12, 10, 9, 0.96) 0%, rgba(12, 10, 9, 0.64) 100%);
		backdrop-filter: blur(10px);
		padding: 0.75rem 0.5rem;
		text-align: center;
		transition: background 0.25s ease;
		z-index: 2;

		h3 {
			color: #fff;
			font-size: 0.8125rem;
			font-weight: 600;
			margin: 0;
			text-transform: capitalize;
			transition: color 0.25s ease;
			line-height: 1.3;
		}
	}

	footer {
		text-align: center;
		margin-top: 3rem;
		padding: 2.5rem 2rem;
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		border-radius: 1rem;
		border: 1px solid rgba(45, 212, 191, 0.2);
		color: var(--text-primary);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: 50%;
			transform: translateX(-50%);
			width: 300px;
			height: 150px;
			background: radial-gradient(ellipse, rgba(45, 212, 191, 0.08) 0%, transparent 70%);
			pointer-events: none;
		}
	}

	.more-info {
		font-style: italic;
		margin-bottom: 1.5rem;
		color: var(--text-secondary);
		font-size: 0.9375rem;
		position: relative;
	}

	.email-signup {
		max-width: 500px;
		margin: 0 auto;
		position: relative;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.hero {
			padding: 1.5rem 1rem 1.5rem;
		}

		.type-badge {
			width: 3.5rem;
			height: 3.5rem;
		}

		.type-num {
			font-size: 1.75rem;
		}

		.hero h1 {
			font-size: 1.5rem;
		}

		.tagline {
			font-size: 0.875rem;
		}

		.enneagram-type-page {
			padding: 0 1rem 3rem;
		}

		h2 {
			font-size: 1.25rem;
		}

		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
			gap: 0.75rem;
		}

		footer {
			padding: 2rem 1.5rem;
			border-radius: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.hero {
			padding: 1.25rem 1rem 1.25rem;
		}

		.type-badge {
			width: 3rem;
			height: 3rem;
			border-radius: 0.75rem;
		}

		.type-num {
			font-size: 1.5rem;
		}

		.hero h1 {
			font-size: 1.25rem;
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
			gap: 0.5rem;
		}

		.grid-item {
			border-radius: 0.5rem;
		}

		.person-name {
			padding: 0.5rem 0.375rem;

			h3 {
				font-size: 0.6875rem;
			}
		}

		footer {
			padding: 1.5rem 1.25rem;
			margin-top: 2rem;
		}

		.more-info {
			font-size: 0.8125rem;
		}
	}
</style>
