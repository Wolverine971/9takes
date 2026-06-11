<!-- src/routes/personality-analysis/categories/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { SectionKicker } from '$lib/components/atoms';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		buildPersonalityImageUrl
	} from '$lib/utils/personalityAnalysis';
	import { formatPersonalityRawType, formatPersonName } from '$lib/personalityCategories';
	import {
		CORPUS_DATASET_LICENSE,
		CORPUS_DATA_DOWNLOAD,
		NINE_TAKES_ORGANIZATION
	} from '$lib/utils/corpusDatasetJsonLd';

	let { data }: { data: PageData } = $props();

	function formatDate(value: string | null): string | null {
		if (!value) return null;

		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatCorpusDate(value: string): string {
		return new Date(value).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function typeUrl(enneagram: string) {
		return `/personality-analysis/type/${enneagram}`;
	}

	function typeLabel(enneagram: string, count: number) {
		return count === 1 ? `Type ${enneagram} (${count})` : `Type ${enneagram} (${count})`;
	}

	const canonicalUrl = $derived(
		`https://9takes.com/personality-analysis/categories/${data.category.slug}`
	);

	const seoTitle = $derived(data.category.seoTitle);

	const seoDescription = $derived(data.category.seoDescription);

	const seoKeywords = $derived(data.category.seoKeywords.join(', '));

	const corpusStats = $derived(data.corpusStats);

	const statFaqs = $derived(
		corpusStats
			? [
					{
						question: `Which Enneagram type is over-represented in the 9takes ${data.category.label} category?`,
						answer: `${corpusStats.headlineClaim} ${corpusStats.underClaim} These numbers are computed from the 9takes corpus of ${corpusStats.corpusPublished} published profiles and regenerated on every deploy — see the full dataset at ${corpusStats.datasetUrl}.`
					},
					{
						question: 'How fresh is the data on this page?',
						answer: corpusStats.freshnessClaim
					}
				]
			: []
	);

	const faqItems = $derived([...data.category.seoFaqs, ...statFaqs]);

	const ogImageUrl = $derived(
		data.category.ogImage ?? 'https://9takes.com/twitter-card-9takes.webp'
	);

	const ORG_ID = 'https://9takes.com/#organization';
	const WEBSITE_ID = 'https://9takes.com/#website';
	const PERSONALITY_ANALYSIS_ID = 'https://9takes.com/personality-analysis#collection';
	const CATEGORIES_INDEX_ID = 'https://9takes.com/personality-analysis/categories#collection';

	const structuredData = $derived.by(() => ({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
				'@id': `${canonicalUrl}#breadcrumbs`,
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
						name: 'Categories',
						item: 'https://9takes.com/personality-analysis/categories'
					},
					{
						'@type': 'ListItem',
						position: 4,
						name: data.category.label,
						item: canonicalUrl
					}
				]
			},
			{
				'@type': 'CollectionPage',
				'@id': canonicalUrl,
				name: `${data.category.label} Personality Analysis`,
				description: seoDescription,
				url: canonicalUrl,
				inLanguage: 'en-US',
				image: {
					'@type': 'ImageObject',
					url: ogImageUrl,
					width: 1200,
					height: 628
				},
				...(data.earliestPublish ? { datePublished: data.earliestPublish } : {}),
				...(data.latestUpdate ? { dateModified: data.latestUpdate } : {}),
				keywords: seoKeywords,
				isPartOf: { '@id': CATEGORIES_INDEX_ID },
				breadcrumb: { '@id': `${canonicalUrl}#breadcrumbs` },
				speakable: {
					'@type': 'SpeakableSpecification',
					cssSelector: ['h1', '.lede', '.corpus-insight-claim']
				},
				about: [
					{
						'@type': 'Thing',
						name: 'Enneagram of Personality',
						sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
					},
					{
						'@type': 'Thing',
						name: data.category.label
					}
				],
				...(corpusStats
					? {
							mentions: [
								{
									'@type': 'Claim',
									text: corpusStats.headlineClaim,
									appearance: {
										'@type': 'WebPage',
										url: corpusStats.datasetUrl,
										name: '9takes Corpus Stats'
									}
								},
								{
									'@type': 'Claim',
									text: corpusStats.freshnessClaim,
									appearance: {
										'@type': 'WebPage',
										url: corpusStats.datasetUrl,
										name: '9takes Corpus Stats'
									}
								}
							],
							isBasedOn: { '@id': 'https://9takes.com/corpus-stats#dataset' },
							subjectOf: {
								'@id': `${canonicalUrl}#corpus-slice`
							}
						}
					: {}),
				publisher: { '@id': ORG_ID },
				mainEntity: {
					'@type': 'ItemList',
					'@id': `${canonicalUrl}#people`,
					numberOfItems: data.people.length,
					itemListOrder: 'https://schema.org/ItemListUnordered',
					itemListElement: data.people.map((person, index) => {
						const personUrl = `https://9takes.com${buildPersonalityAnalysisPath(person.slug)}`;
						const personImage = buildPersonalityImageUrl(person.enneagram, person.slug);
						const personDescription = person.personaTitle ?? person.description ?? null;

						return {
							'@type': 'ListItem',
							position: index + 1,
							url: personUrl,
							item: {
								'@type': 'Person',
								'@id': personUrl,
								name: person.name,
								url: personUrl,
								...(personImage ? { image: personImage } : {}),
								...(personDescription ? { description: personDescription } : {}),
								...(person.enneagram
									? {
											additionalProperty: {
												'@type': 'PropertyValue',
												name: 'Enneagram Type',
												value: String(person.enneagram)
											}
										}
									: {})
							}
						};
					})
				},
				hasPart: data.groups.map((group) => ({
					'@type': 'WebPageElement',
					'@id': `${canonicalUrl}#${group.slug}`,
					name: group.label,
					description: group.description,
					url: `${canonicalUrl}#${group.slug}`,
					cssSelector: `#${group.slug}`
				}))
			},
			{
				'@type': 'CollectionPage',
				'@id': CATEGORIES_INDEX_ID,
				name: 'Personality Analysis Categories',
				url: 'https://9takes.com/personality-analysis/categories',
				inLanguage: 'en-US',
				isPartOf: { '@id': PERSONALITY_ANALYSIS_ID }
			},
			{
				'@type': 'CollectionPage',
				'@id': PERSONALITY_ANALYSIS_ID,
				name: 'Personality Analysis',
				url: 'https://9takes.com/personality-analysis',
				inLanguage: 'en-US',
				isPartOf: { '@id': WEBSITE_ID }
			},
			{
				'@type': 'FAQPage',
				'@id': `${canonicalUrl}#faq`,
				inLanguage: 'en-US',
				isPartOf: { '@id': canonicalUrl },
				mainEntity: faqItems.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: faq.answer
					}
				}))
			},
			...(corpusStats
				? [
						{
							'@type': 'Dataset',
							'@id': `${canonicalUrl}#corpus-slice`,
							name: `Enneagram type distribution among ${corpusStats.domainLabel} (9takes corpus slice)`,
							description: corpusStats.headlineClaim,
							url: `${corpusStats.datasetUrl}#domain-${data.category.slug}`,
							isBasedOn: { '@id': 'https://9takes.com/corpus-stats#dataset' },
							dateModified: corpusStats.generatedAt,
							license: CORPUS_DATASET_LICENSE,
							isAccessibleForFree: true,
							variableMeasured: [
								'enneagram_type_share',
								'over_representation_vs_baseline',
								'domain_total'
							],
							creator: NINE_TAKES_ORGANIZATION,
							publisher: NINE_TAKES_ORGANIZATION,
							distribution: [CORPUS_DATA_DOWNLOAD]
						},
						{
							'@type': 'Quotation',
							'@id': `${canonicalUrl}#corpus-quotation-overrep`,
							text: corpusStats.headlineClaim,
							about: {
								'@type': 'Thing',
								name: `Enneagram type distribution among ${corpusStats.domainLabel}`
							},
							isBasedOn: { '@id': `${canonicalUrl}#corpus-slice` },
							creator: { '@id': ORG_ID },
							citation: `${corpusStats.datasetUrl}#domain-${data.category.slug}`
						},
						{
							'@type': 'Quotation',
							'@id': `${canonicalUrl}#corpus-quotation-freshness`,
							text: corpusStats.freshnessClaim,
							about: {
								'@type': 'Thing',
								name: '9takes corpus freshness'
							},
							isBasedOn: { '@id': `${canonicalUrl}#corpus-slice` },
							creator: { '@id': ORG_ID },
							citation: `${corpusStats.datasetUrl}#methodology`
						}
					]
				: [])
		]
	}));
</script>

<SEOHead
	title={seoTitle}
	description={seoDescription}
	canonical={canonicalUrl}
	twitterCardType="summary_large_image"
	ogImage={ogImageUrl}
	author="9takes"
	twitterImageAlt={`${data.category.label} personality analysis on 9takes`}
	jsonLd={structuredData}
	additionalMeta={[
		{ name: 'keywords', content: seoKeywords },
		{
			name: 'googlebot',
			content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
		}
	]}
/>

<div
	class="page-shell"
	style={`--accent:${data.category.accent}; --accent-soft:${data.category.accentSoft};`}
>
	<header class="hero">
		<div class="hero-top">
			<a href="/personality-analysis/categories" class="crumb">All categories</a>
			<a href="/personality-analysis" class="crumb">All personalities</a>
		</div>

		<div class="hero-grid">
			<div class="hero-copy">
				<SectionKicker class="hero-kicker" label="PERSONALITY ANALYSIS · CATEGORY" />
				<h1>{data.category.label}</h1>
				<p class="lede">{data.category.intro}</p>

				{#if data.category.seoIntro}
					<p class="seo-intro">{data.category.seoIntro}</p>
				{/if}

				{#if data.earliestPublish || data.latestUpdate}
					<p class="meta-line" aria-label="Publication metadata">
						{#if data.earliestPublish}
							<span>
								Published
								<time datetime={data.earliestPublish}>{formatDate(data.earliestPublish)}</time>
							</span>
						{/if}
						{#if data.earliestPublish && data.latestUpdate}
							<span class="meta-sep" aria-hidden="true">·</span>
						{/if}
						{#if data.latestUpdate}
							<span>
								Last updated
								<time datetime={data.latestUpdate}>{formatDate(data.latestUpdate)}</time>
							</span>
						{/if}
					</p>
				{/if}

				<div class="stats-row">
					<span>{data.people.length} published analyses</span>
					<span>{data.distribution.length} Enneagram types represented</span>
				</div>

				{#if corpusStats}
					<aside class="corpus-insight" aria-label="Corpus statistic">
						<p class="corpus-insight-eyebrow">9takes Corpus Snapshot</p>
						<p class="corpus-insight-claim">
							Of the <strong>{corpusStats.domainTotal}</strong> profiles in the 9takes
							{corpusStats.domainLabel} category,
							<a href={`/personality-analysis/type/${corpusStats.over.type}`}>
								{corpusStats.over.typeName}
							</a>
							is over-represented at <strong>{corpusStats.over.sharePct}</strong> —
							<strong
								>{corpusStats.over.deltaPp >= 0 ? '+' : ''}{corpusStats.over.deltaPp.toFixed(2)} pp</strong
							>
							vs. the {corpusStats.corpusPublished}-profile corpus baseline.
							<a href={`/personality-analysis/type/${corpusStats.under.type}`}>
								{corpusStats.under.typeName}
							</a>
							is the most under-represented at {corpusStats.under.sharePct}.
						</p>
						<p class="corpus-insight-meta">
							{corpusStats.freshnessShare90dPct} of the corpus was refreshed in the last 90 days. As
							of
							<time datetime={corpusStats.generatedAt}
								>{formatCorpusDate(corpusStats.generatedAt)}</time
							>. <a href="/corpus-stats">See the full dataset →</a>
						</p>
					</aside>
				{/if}

				<div class="tag-row">
					{#each data.category.rawTypes as rawType}
						<span class="tag-chip">{formatPersonalityRawType(rawType)}</span>
					{/each}
				</div>
			</div>

			<div class="distribution-card">
				<SectionKicker tone="data" class="hero-kicker" label="TYPE SPREAD" />
				<h2>Where this category clusters</h2>
				{#if data.distribution.length > 0}
					<div class="distribution-grid">
						{#each data.distribution as bucket}
							<a href={typeUrl(bucket.enneagram)} class="distribution-pill">
								<span>{typeLabel(bucket.enneagram, bucket.count)}</span>
								<ArrowRightIcon iconStyle={''} height={'0.9rem'} fill={'currentColor'} />
							</a>
						{/each}
					</div>
				{:else}
					<p class="empty-note">No Enneagram distribution available yet.</p>
				{/if}
			</div>
		</div>

		{#if data.groups.length > 0}
			<div class="cluster-nav">
				<div class="cluster-nav-head">
					<div>
						<SectionKicker class="section-tag" num="01" label="SUBCATEGORIES" />
						<h3 class="cluster-nav-title">Jump to a Section</h3>
					</div>
					<p class="cluster-nav-copy">{data.category.groupingDescription}</p>
				</div>

				<div class="cluster-nav-grid">
					{#each data.groups as group}
						<a href={`#${group.slug}`} class="cluster-link">
							<span>{group.label}</span>
							<strong>{group.people.length}</strong>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</header>

	<main class="content">
		{#if data.featured.length > 0}
			<section class="section">
				<div class="section-head">
					<div>
						<SectionKicker class="section-tag" num="02" label="FEATURED" />
						<h2>Best Entry Points</h2>
					</div>
					<p class="section-copy">Start with the strongest or freshest reads in this category.</p>
				</div>

				<div class="featured-grid">
					{#each data.featured as person}
						<a href={buildPersonalityAnalysisPath(person.slug)} class="featured-card">
							<div class="image-wrap">
								<img
									src={buildPersonalityImagePath(person.enneagram, person.slug)}
									alt={`Portrait of ${person.name}`}
									loading="lazy"
									width="400"
									height="533"
								/>
							</div>
							<div class="featured-overlay"></div>
							<div class="featured-copy">
								<span class="featured-type">Type {person.enneagram}</span>
								<h3>{person.name}</h3>
								<p>{person.personaTitle ?? person.title ?? person.description}</p>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<section class="section">
			<div class="section-head">
				<div>
					<SectionKicker
						class="section-tag"
						num="03"
						label={data.groups.length > 0 ? 'SUBCATEGORIES' : 'LIBRARY'}
					/>
					<h2>
						{data.groups.length > 0
							? `${data.category.label} Subcategories`
							: `All ${data.category.label}`}
					</h2>
				</div>
				<p class="section-copy">
					{#if data.groups.length > 0}
						{data.category.groupingDescription}
					{:else}
						Sorted by content quality first, then freshness.
					{/if}
				</p>
			</div>

			{#if data.people.length > 0}
				{#if data.groups.length > 0}
					<div class="group-stack">
						{#each data.groups as group}
							<section class="group-card" id={group.slug}>
								<div class="group-head">
									<div>
										<SectionKicker
											tone="dim"
											class="section-tag"
											label={`${group.people.length} PROFILES`}
										/>
										<h3>{group.label}</h3>
									</div>
									<p class="group-copy">{group.description}</p>
								</div>

								<div class="people-grid">
									{#each group.people as person}
										<a href={buildPersonalityAnalysisPath(person.slug)} class="person-card">
											<div class="person-image">
												<img
													src={buildPersonalityImagePath(
														person.enneagram,
														person.slug,
														'thumbnail'
													)}
													alt={`Portrait of ${person.name}`}
													loading="lazy"
													width="240"
													height="240"
												/>
											</div>
											<div class="person-overlay"></div>
											<div class="person-copy">
												<span class="person-type">Type {person.enneagram}</span>
												<h3>{formatPersonName(person.slug)}</h3>
												<p>{person.personaTitle ?? person.title ?? person.description}</p>
											</div>
										</a>
									{/each}
								</div>
							</section>
						{/each}
					</div>
				{:else}
					<div class="people-grid">
						{#each data.people as person}
							<a href={buildPersonalityAnalysisPath(person.slug)} class="person-card">
								<div class="person-image">
									<img
										src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
										alt={`Portrait of ${person.name}`}
										loading="lazy"
										width="240"
										height="240"
									/>
								</div>
								<div class="person-overlay"></div>
								<div class="person-copy">
									<span class="person-type">Type {person.enneagram}</span>
									<h3>{formatPersonName(person.slug)}</h3>
									<p>{person.personaTitle ?? person.title ?? person.description}</p>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			{:else}
				<div class="empty-state">
					<p>This category exists, but it does not have any published profiles yet.</p>
				</div>
			{/if}
		</section>

		{#if faqItems.length > 0}
			<section class="section faq-section" id="faq" aria-labelledby="faq-heading">
				<div class="section-head">
					<div>
						<SectionKicker class="section-tag" num="04" label="QUESTIONS" />
						<h2 id="faq-heading">{data.category.label} — FAQ</h2>
					</div>
					<p class="section-copy">
						Quick answers about how this category is built and what the data shows.
					</p>
				</div>

				<div class="faq-list">
					{#each faqItems as faq, index (faq.question)}
						<details class="faq-item" open={index === 0}>
							<summary>
								<span class="faq-question">{faq.question}</span>
								<span class="faq-toggle" aria-hidden="true">+</span>
							</summary>
							<p class="faq-answer">{faq.answer}</p>
						</details>
					{/each}
				</div>
			</section>
		{/if}

		{#if data.relatedCategories.length > 0}
			<section class="section">
				<div class="section-head">
					<div>
						<SectionKicker class="section-tag" num="05" label="ADJACENT" />
						<h2>Explore Nearby Categories</h2>
					</div>
					<p class="section-copy">
						Good next stops if you want a different domain with similar pressure patterns.
					</p>
				</div>

				<div class="related-grid">
					{#each data.relatedCategories as category}
						<a
							href="/personality-analysis/categories/{category.slug}"
							class="related-card"
							style={`--related-accent:${category.accent}; --related-soft:${category.accentSoft};`}
						>
							<div class="related-top">
								<h3>{category.label}</h3>
								<span>{category.count}</span>
							</div>
							<p>{category.summary}</p>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</main>
</div>

<style lang="scss">
	.page-shell {
		--surface-card: color-mix(in srgb, var(--stone-warm) 90%, var(--night-deep));
		--surface-card-strong: color-mix(in srgb, var(--stone-warm) 82%, var(--night-deep));
		--accent-border: color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
		--image-overlay-strong: rgba(12, 10, 9, 0.96);
		--image-overlay-mid: rgba(12, 10, 9, 0.58);
		--image-overlay-light: rgba(12, 10, 9, 0.14);
		min-height: 100vh;
		background:
			radial-gradient(
				circle at top,
				color-mix(in srgb, var(--accent-soft) 52%, transparent) 0%,
				transparent 36%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--night-deep) 88%, var(--night-deep)) 0%,
				var(--night-deep) 100%
			);
	}

	.hero,
	.content {
		max-width: 1200px;
		margin: 0 auto;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.hero {
		padding-top: 3rem;
		padding-bottom: 1.75rem;
	}

	.hero-top {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-bottom: 1.25rem;
	}

	.crumb {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--accent-border);
		background: var(--surface-card);
		color: var(--ink-mid);
		font-size: 0.82rem;
		text-decoration: none;

		&:hover {
			color: var(--lamp-glow);
			border-color: color-mix(in srgb, var(--lamp-glow) 38%, transparent);
		}
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.9fr);
		gap: 1.25rem;
		align-items: start;
	}

	/* SectionKicker scoped overrides — give kickers room before headings. */
	:global(.hero-kicker),
	:global(.section-tag) {
		display: block;
		margin-bottom: 0.45rem;
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3 {
		color: var(--ink-bright);
		line-height: 1.1;
	}

	h1 {
		font-size: clamp(2rem, 4vw, 3.4rem);
		letter-spacing: -0.03em;
	}

	.lede,
	.section-copy,
	.distribution-card p,
	.person-copy p,
	.featured-copy p,
	.related-card p {
		color: var(--ink-mid);
		line-height: 1.65;
	}

	.lede {
		margin-top: 0.85rem;
		max-width: 760px;
		font-size: 1.02rem;
	}

	.stats-row,
	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-top: 1rem;
	}

	.stats-row span,
	.tag-chip {
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		font-size: 0.78rem;
		color: var(--ink-bright);
	}

	.corpus-insight {
		margin-top: 1.1rem;
		padding: 0.95rem 1.05rem;
		border-radius: 1rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--accent-soft) 30%, transparent) 0%,
			var(--surface-card) 100%
		);
		border: 1px solid var(--accent-border);
		box-shadow: var(--shadow-sm);
		max-width: 760px;
	}

	.corpus-insight-eyebrow {
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 12px;
		font-weight: 500;
		color: var(--data-teal);
		margin: 0 0 0.35rem;
	}

	.corpus-insight-claim {
		margin: 0;
		color: var(--ink-bright);
		line-height: 1.55;
		font-size: 0.94rem;

		a {
			color: var(--lamp-glow);
			text-decoration: underline;
			text-underline-offset: 2px;
		}
	}

	.corpus-insight-meta {
		margin: 0.55rem 0 0;
		color: var(--ink-mid);
		font-size: 0.82rem;

		a {
			color: var(--lamp-glow);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.distribution-card {
		padding: 1.1rem;
		border-radius: 1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 38%, transparent) 0%,
				transparent 48%
			),
			var(--surface-card-strong);
		border: 1px solid var(--accent-border);
		box-shadow: var(--shadow-sm);
	}

	.distribution-card h2 {
		font-size: 1.25rem;
		margin-bottom: 0.9rem;
	}

	.cluster-nav {
		margin-top: 1.25rem;
		padding: 1.1rem;
		border-radius: 1rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--accent-soft) 26%, transparent) 0%,
			var(--surface-card-strong) 100%
		);
		border: 1px solid var(--accent-border);
		box-shadow: var(--shadow-sm);
	}

	.cluster-nav-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.9rem;
	}

	.cluster-nav-title {
		font-size: 1.25rem;
		letter-spacing: -0.01em;
	}

	.cluster-nav-copy {
		max-width: 460px;
		color: var(--ink-mid);
		text-align: right;
		line-height: 1.6;
	}

	.cluster-nav-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.cluster-link {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.8rem 0.9rem;
		border-radius: 0.625rem;
		text-decoration: none;
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		color: var(--ink-bright);

		&:hover {
			border-color: color-mix(in srgb, var(--lamp-glow) 38%, transparent);
			color: var(--lamp-glow);
		}

		span {
			line-height: 1.35;
		}

		strong {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: 2rem;
			padding: 0.25rem 0.45rem;
			border-radius: 999px;
			background: color-mix(in srgb, var(--accent-soft) 22%, var(--stone-warm));
			font-size: 0.78rem;
		}
	}

	.distribution-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.55rem;
	}

	.distribution-pill {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.7rem 0.8rem;
		border-radius: 0.625rem;
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		text-decoration: none;
		color: var(--ink-bright);
		font-size: 0.82rem;

		&:hover {
			border-color: color-mix(in srgb, var(--lamp-glow) 38%, transparent);
			color: var(--lamp-glow);
		}
	}

	.empty-note,
	.empty-state p {
		color: var(--ink-mid);
	}

	.content {
		padding-top: 0.25rem;
		padding-bottom: 4rem;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.2rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid var(--accent-border);
	}

	.section-copy {
		max-width: 420px;
		text-align: right;
	}

	.featured-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.featured-card,
	.person-card {
		position: relative;
		overflow: hidden;
		border-radius: 1rem;
		text-decoration: none;
		border: 1px solid var(--accent-border);
		background: var(--stone-warm);
		box-shadow: var(--shadow-sm);
		padding: 0.5rem;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-4px);
			border-color: color-mix(in srgb, var(--lamp-glow) 38%, transparent);
			box-shadow: var(--shadow-lg);
		}
	}

	.featured-card {
		aspect-ratio: 3 / 4;
	}

	.image-wrap,
	.person-image {
		position: absolute;
		inset: 0.5rem;
		border-radius: 0.625rem;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.featured-overlay,
	.person-overlay {
		position: absolute;
		inset: 0.5rem;
		border-radius: 0.625rem;
		background: linear-gradient(
			to top,
			var(--image-overlay-strong) 0%,
			var(--image-overlay-mid) 52%,
			var(--image-overlay-light) 100%
		);
	}

	.featured-copy,
	.person-copy {
		position: absolute;
		left: 0.5rem;
		right: 0.5rem;
		bottom: 0.5rem;
		z-index: 2;
		padding: 1rem;
	}

	.featured-type,
	.person-type {
		display: inline-flex;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.18);
		color: #fff;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.45rem;
	}

	.featured-copy h3,
	.person-copy h3 {
		font-size: 1.05rem;
		margin-bottom: 0.35rem;
		color: #fff;
	}

	.featured-copy p,
	.person-copy p {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.8);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.people-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.group-stack {
		display: grid;
		gap: 1.25rem;
	}

	.group-card {
		padding: 1.2rem;
		border-radius: 1rem;
		background: var(--surface-card-strong);
		border: 1px solid var(--accent-border);
		box-shadow: var(--shadow-sm);
	}

	.group-head {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.1fr);
		gap: 1rem;
		align-items: start;
		margin-bottom: 1rem;
	}

	.group-copy {
		font-size: 0.95rem;
		color: var(--ink-mid);
		line-height: 1.6;
	}

	.person-card {
		aspect-ratio: 1;
	}

	.person-copy {
		padding: 0.85rem;
	}

	.person-copy h3 {
		font-size: 0.96rem;
	}

	.person-copy p {
		font-size: 0.78rem;
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.related-card {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 1rem;
		border-radius: 1rem;
		text-decoration: none;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--related-soft) 38%, transparent) 0%,
				transparent 52%
			),
			var(--surface-card-strong);
		border: 1px solid var(--accent-border);
		box-shadow: var(--shadow-sm);

		&:hover {
			border-color: var(--related-accent);
		}
	}

	.related-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;

		span {
			padding: 0.35rem 0.55rem;
			border-radius: 999px;
			background: var(--surface-card);
			color: var(--ink-bright);
			font-size: 0.78rem;
			font-weight: 700;
		}
	}

	.seo-intro {
		margin-top: 0.85rem;
		max-width: 760px;
		color: var(--ink-mid);
		line-height: 1.65;
		font-size: 0.95rem;
	}

	.meta-line {
		margin-top: 0.85rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.55rem;
		color: var(--ink-mid);
		font-size: 0.85rem;
		line-height: 1.4;

		time {
			color: var(--ink-bright);
			font-weight: 600;
		}
	}

	.meta-sep {
		color: var(--ink-mid);
		opacity: 0.6;
	}

	.faq-list {
		display: grid;
		gap: 0.65rem;
	}

	.faq-item {
		border-radius: 1rem;
		border: 1px solid var(--accent-border);
		background: var(--surface-card-strong);
		padding: 0.85rem 1.1rem;
		box-shadow: var(--shadow-sm);

		summary {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			cursor: pointer;
			list-style: none;
			color: var(--ink-bright);
			font-weight: 600;
			line-height: 1.4;

			&::-webkit-details-marker {
				display: none;
			}
		}

		.faq-toggle {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 1.6rem;
			height: 1.6rem;
			border-radius: 999px;
			background: var(--surface-card);
			border: 1px solid var(--accent-border);
			color: var(--ink-bright);
			font-size: 1rem;
			font-weight: 600;
			transition: transform 0.2s ease;
		}

		&[open] .faq-toggle {
			transform: rotate(45deg);
		}

		.faq-answer {
			margin-top: 0.65rem;
			color: var(--ink-mid);
			line-height: 1.65;
			font-size: 0.95rem;
		}
	}

	@media (max-width: 980px) {
		.hero-grid,
		.cluster-nav-grid,
		.featured-grid,
		.people-grid,
		.related-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.hero,
		.content {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.hero {
			padding-top: 2.25rem;
		}

		.hero-grid,
		.cluster-nav-grid,
		.distribution-grid,
		.featured-grid,
		.people-grid,
		.related-grid {
			grid-template-columns: 1fr;
		}

		.section-head {
			flex-direction: column;
			align-items: start;
		}

		.cluster-nav-head {
			flex-direction: column;
			align-items: start;
		}

		.group-head {
			grid-template-columns: 1fr;
		}

		.section-copy,
		.cluster-nav-copy {
			text-align: left;
		}

		.person-card {
			aspect-ratio: 4 / 3;
		}
	}
</style>
