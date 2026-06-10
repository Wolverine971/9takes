<!-- src/routes/personality-analysis/type/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import EnneagramTypeIntro from '$lib/components/blog/EnneagramTypeIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import EnneagramTypeBottom from '$lib/components/blog/EnneagramTypeBottom.svelte';
	import CorpusStatCallout from '$lib/components/blog/callouts/CorpusStatCallout.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		buildPersonalityImageUrl,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	let { data }: { data: PageData } = $props();

	type EnneagramTypeMeta = {
		name: string;
		tagline: string;
		archetype: string;
		coreFear: string;
		coreDesire: string;
		summary: string;
	};

	const enneagramTypes: Record<string, EnneagramTypeMeta> = {
		'1': {
			name: 'The Perfectionist',
			tagline: 'Principled, purposeful, self-controlled',
			archetype: 'The Reformer',
			coreFear: 'being corrupt, defective, or wrong',
			coreDesire: 'integrity, goodness, and improvement',
			summary:
				'Type 1s carry an internal compass that points toward how things should be. Principled, ethical, and relentless about doing things right.'
		},
		'2': {
			name: 'The Helper',
			tagline: 'Generous, demonstrative, people-pleasing',
			archetype: 'The Caregiver',
			coreFear: 'being unloved or unwanted',
			coreDesire: 'to be loved and appreciated',
			summary:
				'Type 2s read what people need before they say it. Warm, generous, and tuned to the emotional weather of the room.'
		},
		'3': {
			name: 'The Achiever',
			tagline: 'Adaptable, excelling, driven',
			archetype: 'The Performer',
			coreFear: 'being worthless or without value',
			coreDesire: 'to feel valuable and admired',
			summary:
				'Type 3s read the room, adapt their image, and execute. Goal-oriented, polished, and wired for achievement and recognition.'
		},
		'4': {
			name: 'The Individualist',
			tagline: 'Expressive, dramatic, self-absorbed',
			archetype: 'The Romantic',
			coreFear: 'having no identity or significance',
			coreDesire: 'to find themselves and their meaning',
			summary:
				'Type 4s feel things at a depth most people avoid. Creative, introspective, and committed to authenticity over fitting in.'
		},
		'5': {
			name: 'The Investigator',
			tagline: 'Perceptive, innovative, secretive',
			archetype: 'The Observer',
			coreFear: 'being helpless, useless, or incapable',
			coreDesire: 'to be capable and competent',
			summary:
				'Type 5s disappear into ideas and emerge with frameworks. Curious, analytical, and protective of their time and energy.'
		},
		'6': {
			name: 'The Loyalist',
			tagline: 'Engaging, responsible, anxious',
			archetype: 'The Skeptic',
			coreFear: 'being without support or guidance',
			coreDesire: 'security and trustworthy support',
			summary:
				'Type 6s scan for what could go wrong and prepare for it. Loyal, vigilant, and the people you want with you in a crisis.'
		},
		'7': {
			name: 'The Enthusiast',
			tagline: 'Spontaneous, versatile, scattered',
			archetype: 'The Adventurer',
			coreFear: 'being trapped in pain or deprivation',
			coreDesire: 'to be satisfied and stimulated',
			summary:
				'Type 7s chase the next idea, trip, or possibility. Optimistic, energetic, and allergic to anything that feels like a cage.'
		},
		'8': {
			name: 'The Challenger',
			tagline: 'Self-confident, decisive, confrontational',
			archetype: 'The Protector',
			coreFear: 'being controlled or harmed by others',
			coreDesire: 'to protect themselves and stay in control',
			summary:
				'Type 8s take up space and protect their people. Direct, decisive, and unwilling to be controlled by anyone.'
		},
		'9': {
			name: 'The Peacemaker',
			tagline: 'Receptive, reassuring, complacent',
			archetype: 'The Mediator',
			coreFear: 'loss of connection and fragmentation',
			coreDesire: 'inner stability and peace of mind',
			summary:
				'Type 9s see every side and resist anything that disrupts the peace. Calm, accepting, and quietly stubborn about harmony.'
		}
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

	const FALLBACK_TYPE_META: EnneagramTypeMeta = {
		name: '',
		tagline: '',
		archetype: '',
		coreFear: '',
		coreDesire: '',
		summary: ''
	};

	const SIBLING_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

	let typeInfo = $derived(enneagramTypes[data.slug] ?? FALLBACK_TYPE_META);
	let peopleCount = $derived(data.people.length);
	let typeUrl = $derived(`https://9takes.com/personality-analysis/type/${data.slug}`);
	let pageId = $derived(`${typeUrl}#webpage`);
	let collectionId = $derived(`${typeUrl}#collection`);
	let articleId = $derived(`${typeUrl}#article`);
	let breadcrumbId = $derived(`${typeUrl}#breadcrumb`);
	let faqId = $derived(`${typeUrl}#faq`);

	let seoTitle = $derived(
		`${peopleCount} Famous Enneagram Type ${data.slug}s — ${typeInfo.name} (Examples & Analyses)`
	);
	let seoDescription = $derived(
		`${peopleCount} famous Enneagram Type ${data.slug} (${typeInfo.name}) personalities, decoded. ${typeInfo.tagline}. See how Type ${data.slug} shows up in celebrities, leaders, and creators.`
	);

	let latestDate = $derived(getLatestDate(data.people));

	let leadPerson = $derived(data.people.find((person) => person.enneagram && person.slug));
	let leadOgImage = $derived(
		leadPerson ? buildPersonalityImageUrl(leadPerson.enneagram, leadPerson.slug, 'full') : ''
	);
	let ogImage = $derived(leadOgImage || 'https://9takes.com/personality-analysis-card.webp');

	let breadcrumbSchema = $derived({
		'@type': 'BreadcrumbList',
		'@id': breadcrumbId,
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
				name: `Type ${data.slug}: ${typeInfo.name}`,
				item: typeUrl
			}
		]
	});

	let webPageSchema = $derived({
		'@type': 'CollectionPage',
		'@id': pageId,
		url: typeUrl,
		name: `Famous Enneagram Type ${data.slug} (${typeInfo.name}) Personalities`,
		description: seoDescription,
		inLanguage: 'en-US',
		isPartOf: { '@id': 'https://9takes.com/#website' },
		breadcrumb: { '@id': breadcrumbId },
		mainEntity: { '@id': collectionId },
		...(latestDate ? { dateModified: latestDate } : {}),
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
		}
	});

	let itemListSchema = $derived({
		'@type': 'ItemList',
		'@id': collectionId,
		name: `Famous Enneagram Type ${data.slug} Personalities`,
		numberOfItems: peopleCount,
		itemListOrder: 'https://schema.org/ItemListOrderDescending',
		itemListElement: data.people.map((person, index) => {
			const displayName = formatPersonalityDisplayName(person.slug);
			const personUrl = `https://9takes.com${buildPersonalityAnalysisPath(person.slug)}`;
			const imageUrl = person.enneagram
				? buildPersonalityImageUrl(person.enneagram, person.slug, 'full')
				: '';
			return {
				'@type': 'ListItem',
				position: index + 1,
				url: personUrl,
				item: {
					'@type': 'Person',
					'@id': `${personUrl}#person`,
					name: displayName,
					url: personUrl,
					...(imageUrl ? { image: imageUrl } : {}),
					additionalType: `https://9takes.com/personality-analysis/type/${data.slug}`,
					description: `Enneagram Type ${data.slug} (${typeInfo.name}) personality analysis of ${displayName} on 9takes.`
				}
			};
		})
	});

	let articleSchema = $derived({
		'@type': 'Article',
		'@id': articleId,
		headline: `Enneagram Type ${data.slug}: ${typeInfo.name} — Worldview, Wings, and Famous Examples`,
		description: typeInfo.summary,
		mainEntityOfPage: { '@id': pageId },
		isPartOf: { '@id': pageId },
		inLanguage: 'en-US',
		about: {
			'@type': 'Thing',
			name: `Enneagram Type ${data.slug}: ${typeInfo.name}`
		},
		author: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com'
		},
		publisher: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com',
			logo: {
				'@type': 'ImageObject',
				url: 'https://9takes.com/brand/aero.png'
			}
		},
		...(latestDate ? { dateModified: latestDate } : {})
	});

	let corpusInsight = $derived(data.corpusInsight);

	let corpusFaqs = $derived(
		corpusInsight
			? [
					{
						'@type': 'Question',
						name: `In which domain is Enneagram Type ${data.slug} (${typeInfo.name}) most over-represented on 9takes?`,
						acceptedAnswer: {
							'@type': 'Answer',
							text:
								corpusInsight.variant === 'domain-overrep'
									? `${corpusInsight.claim} See the full breakdown at https://9takes.com${corpusInsight.corpusAnchorUrl}.`
									: `${corpusInsight.claim} Full corpus stats: https://9takes.com${corpusInsight.corpusAnchorUrl}.`
						}
					},
					{
						'@type': 'Question',
						name: `How rare is Enneagram Type ${data.slug} (${typeInfo.name}) in the 9takes corpus?`,
						acceptedAnswer: {
							'@type': 'Answer',
							text: `9takes profiles ${peopleCount} Type ${data.slug} (${typeInfo.name}) personalities out of ${corpusInsight.corpusPublished} published profiles. The dominant lane for this type is ${corpusInsight.domainLabel}. Browse the full Type ${data.slug} gallery at https://9takes.com/personality-analysis/type/${data.slug}.`
						}
					}
				]
			: []
	);

	let faqSchema = $derived({
		'@type': 'FAQPage',
		'@id': faqId,
		mainEntity: [
			{
				'@type': 'Question',
				name: `What does Enneagram Type ${data.slug} (${typeInfo.name}) mean?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: `Enneagram Type ${data.slug}, also known as ${typeInfo.archetype} or ${typeInfo.name}, is defined by ${typeInfo.tagline.toLowerCase()}. ${typeInfo.summary}`
				}
			},
			{
				'@type': 'Question',
				name: `What is the core fear of Enneagram Type ${data.slug}?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: `Type ${data.slug}s are driven by a core fear of ${typeInfo.coreFear}, which shapes their motivations, decisions, and relationships.`
				}
			},
			{
				'@type': 'Question',
				name: `What does Enneagram Type ${data.slug} want most?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: `The core desire of Type ${data.slug} (${typeInfo.name}) is ${typeInfo.coreDesire}. Most of their behavior can be traced back to pursuing this.`
				}
			},
			{
				'@type': 'Question',
				name: `Who are some famous Enneagram Type ${data.slug}s?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text:
						peopleCount > 0
							? `Famous Enneagram Type ${data.slug} examples include ${data.people
									.slice(0, 8)
									.map((p) => formatPersonalityDisplayName(p.slug))
									.filter(Boolean)
									.join(
										', '
									)}. 9takes profiles ${peopleCount} Type ${data.slug} personalities in total.`
							: `9takes is actively building its library of famous Type ${data.slug} (${typeInfo.name}) personalities.`
				}
			},
			...corpusFaqs
		]
	});

	let structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [breadcrumbSchema, webPageSchema, articleSchema, itemListSchema, faqSchema]
	});

	let canonicalUrl = $derived(typeUrl);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<SEOHead
	title={seoTitle}
	description={seoDescription}
	canonical={canonicalUrl}
	twitterCardType="summary_large_image"
	{ogImage}
	twitterImageAlt={`Famous Enneagram Type ${data.slug} — ${typeInfo.name}`}
	author="9takes"
	ogType="website"
	additionalMeta={[
		...(latestDate ? [{ property: 'article:modified_time', content: latestDate }] : []),
		{
			name: 'keywords',
			content: `enneagram type ${data.slug}, famous type ${data.slug}, ${typeInfo.name.toLowerCase()}, ${typeInfo.archetype.toLowerCase()}, enneagram celebrities, personality types`
		}
	]}
/>

<div class="page-wrapper">
	<nav class="breadcrumbs" aria-label="Breadcrumb">
		<ol>
			<li><a href="/">Home</a></li>
			<li><a href="/personality-analysis">Personality Analysis</a></li>
			<li aria-current="page">Type {data.slug}: {typeInfo.name}</li>
		</ol>
	</nav>

	<header class="hero">
		<div class="type-badge">
			<span class="type-num">{data.slug}</span>
		</div>
		<h1>Famous Enneagram Type {data.slug}s — {typeInfo.name}</h1>
		<p class="tagline">{typeInfo.tagline}</p>
		{#if typeInfo.summary}
			<p class="hero-summary">{typeInfo.summary}</p>
		{/if}
	</header>

	<article class="enneagram-type-page">
		<EnneagramTypeIntro type={data.slug} />

		{#if corpusInsight}
			<CorpusStatCallout
				claim={corpusInsight.claim}
				eyebrow={`9takes Corpus Stat — Type ${data.slug}`}
				domainLabel={corpusInsight.domainLabel}
				domainUrl={corpusInsight.domainUrl}
				corpusAnchorUrl={corpusInsight.corpusAnchorUrl}
				domainTotal={corpusInsight.domainTotal}
				sharePct={corpusInsight.sharePct}
				deltaPpFormatted={corpusInsight.deltaPpFormatted}
				generatedAt={corpusInsight.generatedAt}
			/>
		{/if}

		<section class="famous-people" aria-labelledby="famous-heading">
			<div class="section-header">
				<h2 id="famous-heading">Famous Type {data.slug}s — {typeInfo.name} Examples</h2>
				<span class="people-count">{peopleCount} personalities</span>
			</div>
			<div class="people-grid-container">
				{#each data.people as person}
					<a href={buildPersonalityAnalysisPath(person.slug)} class="grid-item">
						{#if person.enneagram}
							<img
								loading="lazy"
								class="grid-img"
								src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
								alt={`${formatPersonalityDisplayName(person.slug)} — Enneagram Type ${data.slug} (${typeInfo.name})`}
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

		<nav class="sibling-types" aria-label="Other Enneagram types">
			<h2>Explore the Other Enneagram Types</h2>
			<ul>
				{#each SIBLING_TYPES as siblingSlug}
					{@const meta = enneagramTypes[siblingSlug]}
					{#if siblingSlug === data.slug}
						<li class="current" aria-current="page">
							<span class="sibling-num">{siblingSlug}</span>
							<span class="sibling-name">{meta.name}</span>
						</li>
					{:else}
						<li>
							<a href={`/personality-analysis/type/${siblingSlug}`}>
								<span class="sibling-num">{siblingSlug}</span>
								<span class="sibling-name">{meta.name}</span>
							</a>
						</li>
					{/if}
				{/each}
			</ul>
		</nav>

		<footer>
			<p class="more-info">More analyses of Enneagram Type {data.slug} coming soon.</p>
			{#if corpusInsight}
				<p class="corpus-links">
					Want the raw numbers? See the
					<a href="/corpus-stats#enneagram-distribution"
						>full type distribution across {corpusInsight.corpusPublished} profiles</a
					>
					or the
					<a href="/corpus-stats#per-type-domains">per-type domain breakdown for Type {data.slug}</a
					>.
				</p>
			{/if}
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
		background: linear-gradient(180deg, var(--night-deep) 0%, var(--night-deep) 100%);
	}

	/* Breadcrumbs */
	.breadcrumbs {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 1.5rem 0;
		font-size: 0.8125rem;
		color: var(--ink-dim);

		ol {
			list-style: none;
			display: flex;
			flex-wrap: wrap;
			gap: 0.25rem;
			padding: 0;
			margin: 0;
		}

		li {
			display: inline-flex;
			align-items: center;

			&:not(:last-child)::after {
				content: '/';
				margin: 0 0.5rem;
				color: var(--ink-dim);
				opacity: 0.6;
			}

			&[aria-current='page'] {
				color: var(--lamp-glow);
				font-weight: 500;
			}
		}

		a {
			color: var(--ink-dim);
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: var(--lamp-glow);
			}
		}
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 2rem;
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
		background: radial-gradient(
			ellipse,
			color-mix(in srgb, var(--lamp-glow) 15%, transparent) 0%,
			transparent 70%
		);
		pointer-events: none;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, var(--lamp-glow) 0%, var(--lamp-glow) 100%);
		border-radius: 1rem;
		margin-bottom: 1rem;
		box-shadow: 0 0 30px var(--primary-glow);
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
		color: var(--ink-bright);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, var(--ink-bright) 0%, var(--lamp-glow) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.tagline {
		font-size: 1rem;
		color: var(--ink-dim);
		margin: 0;
		font-weight: 500;
	}

	.hero-summary {
		max-width: 640px;
		margin: 1rem auto 0;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--ink-mid);
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
		border-bottom: 1px solid var(--stone-edge);
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0;
	}

	.people-count {
		font-size: 0.875rem;
		color: var(--lamp-glow);
		font-weight: 500;
		padding: 0.375rem 0.75rem;
		background: var(--primary-subtle);
		border-radius: 2rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, transparent);
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
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		transition: all 0.25s ease;
		text-decoration: none;
		box-shadow: var(--shadow-sm);
		padding: 0.45rem;

		&::before {
			content: '';
			position: absolute;
			inset: 0.45rem;
			border-radius: 0.6rem;
			background: linear-gradient(
				135deg,
				color-mix(in srgb, var(--lamp-glow) 10%, transparent) 0%,
				transparent 50%
			);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: color-mix(in srgb, var(--lamp-glow) 40%, transparent);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px color-mix(in srgb, var(--lamp-glow) 10%, transparent);

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

	/* Sibling type navigation */
	.sibling-types {
		margin: 3rem 0 2rem;
		padding: 1.5rem;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;

		h2 {
			font-size: 1.125rem;
			margin-bottom: 1rem;
			color: var(--ink-bright);
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 0.5rem;
		}

		li {
			display: flex;

			a,
			&.current {
				display: flex;
				align-items: center;
				gap: 0.625rem;
				padding: 0.625rem 0.75rem;
				border-radius: 0.5rem;
				width: 100%;
				border: 1px solid var(--stone-edge);
				background: var(--night-deep);
				text-decoration: none;
				color: var(--ink-mid);
				font-size: 0.875rem;
				transition: all 0.2s ease;
			}

			a:hover {
				border-color: color-mix(in srgb, var(--lamp-glow) 40%, transparent);
				color: var(--ink-bright);
			}

			&.current {
				background: linear-gradient(
					135deg,
					color-mix(in srgb, var(--lamp-glow) 18%, transparent),
					rgba(167, 139, 250, 0.12)
				);
				border-color: color-mix(in srgb, var(--lamp-glow) 50%, transparent);
				color: var(--ink-bright);
				font-weight: 600;
			}
		}

		.sibling-num {
			display: inline-flex;
			width: 1.5rem;
			height: 1.5rem;
			align-items: center;
			justify-content: center;
			background: var(--lamp-glow);
			color: var(--ink-bright);
			border-radius: 0.375rem;
			font-weight: 700;
			font-size: 0.75rem;
			flex-shrink: 0;
		}

		.sibling-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	footer {
		text-align: center;
		margin-top: 3rem;
		padding: 2.5rem 2rem;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 20%, transparent);
		color: var(--ink-bright);
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
			background: radial-gradient(
				ellipse,
				color-mix(in srgb, var(--lamp-glow) 8%, transparent) 0%,
				transparent 70%
			);
			pointer-events: none;
		}
	}

	.more-info {
		font-style: italic;
		margin-bottom: 1.5rem;
		color: var(--ink-mid);
		font-size: 0.9375rem;
		position: relative;
	}

	.corpus-links {
		margin: 0 auto 1.5rem;
		max-width: 640px;
		font-size: 0.875rem;
		color: var(--ink-mid);
		line-height: 1.6;
		position: relative;

		a {
			color: var(--lamp-glow);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.email-signup {
		max-width: 500px;
		margin: 0 auto;
		position: relative;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.hero {
			padding: 1.25rem 1rem 1.5rem;
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

		.hero-summary {
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
			padding: 1rem 1rem 1.25rem;
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
