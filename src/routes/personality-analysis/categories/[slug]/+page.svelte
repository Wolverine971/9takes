<!-- src/routes/personality-analysis/categories/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath
	} from '$lib/utils/personalityAnalysis';
	import { formatPersonalityRawType, formatPersonName } from '$lib/personalityCategories';

	let { data }: { data: PageData } = $props();

	function formatDate(value: string | null): string | null {
		if (!value) return null;

		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
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

	const structuredData = $derived.by(() => ({
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
						name: 'Categories',
						item: 'https://9takes.com/personality-analysis/categories'
					},
					{
						'@type': 'ListItem',
						position: 4,
						name: data.category.label
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
				...(data.latestUpdate ? { dateModified: data.latestUpdate } : {}),
				keywords: seoKeywords,
				isPartOf: {
					'@type': 'CollectionPage',
					name: 'Personality Analysis Categories',
					url: 'https://9takes.com/personality-analysis/categories'
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
					'@id': `${canonicalUrl}#people`,
					numberOfItems: data.people.length,
					itemListOrder: 'https://schema.org/ItemListUnordered',
					itemListElement: data.people.map((person, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: person.name,
						url: `https://9takes.com${buildPersonalityAnalysisPath(person.slug)}`,
						...(person.personaTitle || person.description
							? { description: person.personaTitle ?? person.description }
							: {})
					}))
				},
				hasPart: data.groups.map((group) => ({
					'@type': 'WebPageElement',
					name: group.label,
					description: group.description,
					url: `${canonicalUrl}#${group.slug}`
				}))
			},
			{
				'@type': 'FAQPage',
				'@id': `${canonicalUrl}#faq`,
				mainEntity: data.category.seoFaqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: faq.answer
					}
				}))
			}
		]
	}));
</script>

<SEOHead
	title={seoTitle}
	description={seoDescription}
	canonical={canonicalUrl}
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/personality-analysis-card.webp"
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
				<p class="eyebrow">Personality Analysis Category</p>
				<h1>{data.category.label}</h1>
				<p class="lede">{data.category.intro}</p>

				<div class="stats-row">
					<span>{data.people.length} published analyses</span>
					<span>{data.distribution.length} Enneagram types represented</span>
					{#if formatDate(data.latestUpdate)}
						<span>Updated {formatDate(data.latestUpdate)}</span>
					{/if}
				</div>

				<div class="tag-row">
					{#each data.category.rawTypes as rawType}
						<span class="tag-chip">{formatPersonalityRawType(rawType)}</span>
					{/each}
				</div>
			</div>

			<div class="distribution-card">
				<p class="eyebrow">Type Spread</p>
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
						<p class="section-kicker">Subcategories</p>
						<h2>Jump to a Section</h2>
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
						<p class="section-kicker">Featured</p>
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
					<p class="section-kicker">{data.groups.length > 0 ? 'Subcategories' : 'Library'}</p>
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
										<p class="section-kicker">{group.people.length} profiles</p>
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

		{#if data.relatedCategories.length > 0}
			<section class="section">
				<div class="section-head">
					<div>
						<p class="section-kicker">Adjacent</p>
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
		min-height: 100vh;
		background:
			radial-gradient(circle at top, var(--accent-soft), transparent 35%),
			linear-gradient(180deg, #09090f 0%, #12121a 100%);
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
		border: 1px solid rgba(148, 163, 184, 0.16);
		background: rgba(15, 23, 42, 0.72);
		color: #cbd5e1;
		font-size: 0.82rem;
		text-decoration: none;

		&:hover {
			color: #f8fafc;
			border-color: var(--accent);
		}
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.9fr);
		gap: 1.25rem;
		align-items: start;
	}

	.eyebrow,
	.section-kicker {
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.7rem;
		font-weight: 700;
		color: #94a3b8;
		margin: 0 0 0.35rem;
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
		color: #f8fafc;
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
		color: #cbd5e1;
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
		background: rgba(15, 23, 42, 0.74);
		border: 1px solid rgba(148, 163, 184, 0.16);
		font-size: 0.78rem;
		color: #e2e8f0;
	}

	.distribution-card {
		padding: 1.1rem;
		border-radius: 1.15rem;
		background:
			linear-gradient(180deg, var(--accent-soft) 0%, rgba(15, 23, 42, 0) 55%),
			linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.98) 100%);
		border: 1px solid rgba(148, 163, 184, 0.16);
	}

	.distribution-card h2 {
		font-size: 1.25rem;
		margin-bottom: 0.9rem;
	}

	.cluster-nav {
		margin-top: 1.25rem;
		padding: 1.1rem;
		border-radius: 1.15rem;
		background: linear-gradient(180deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.94) 100%);
		border: 1px solid rgba(148, 163, 184, 0.14);
	}

	.cluster-nav-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.9rem;
	}

	.cluster-nav-copy {
		max-width: 460px;
		color: #cbd5e1;
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
		border-radius: 0.9rem;
		text-decoration: none;
		background: rgba(9, 14, 26, 0.72);
		border: 1px solid rgba(148, 163, 184, 0.14);
		color: #e2e8f0;

		&:hover {
			border-color: var(--accent);
			color: #fff;
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
			background: rgba(15, 23, 42, 0.76);
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
		border-radius: 0.8rem;
		background: rgba(15, 23, 42, 0.72);
		border: 1px solid rgba(148, 163, 184, 0.14);
		text-decoration: none;
		color: #e2e8f0;
		font-size: 0.82rem;

		&:hover {
			border-color: var(--accent);
			color: #fff;
		}
	}

	.empty-note,
	.empty-state p {
		color: #94a3b8;
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
		border-bottom: 1px solid rgba(148, 163, 184, 0.14);
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
		border: 1px solid rgba(148, 163, 184, 0.16);
		background: rgba(15, 23, 42, 0.8);
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-4px);
			border-color: var(--accent);
			box-shadow: 0 16px 32px rgba(0, 0, 0, 0.32);
		}
	}

	.featured-card {
		aspect-ratio: 3 / 4;
	}

	.image-wrap,
	.person-image {
		position: absolute;
		inset: 0;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.featured-overlay,
	.person-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(9, 9, 15, 0.96) 0%,
			rgba(9, 9, 15, 0.56) 52%,
			rgba(9, 9, 15, 0.14) 100%
		);
	}

	.featured-copy,
	.person-copy {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		padding: 1rem;
	}

	.featured-type,
	.person-type {
		display: inline-flex;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		background: rgba(15, 23, 42, 0.74);
		color: color-mix(in srgb, var(--accent) 72%, white 15%);
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
	}

	.featured-copy p,
	.person-copy p {
		font-size: 0.85rem;
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
		border-radius: 1.25rem;
		background: rgba(9, 14, 26, 0.72);
		border: 1px solid rgba(148, 163, 184, 0.14);
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
		color: #cbd5e1;
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
			linear-gradient(180deg, var(--related-soft) 0%, rgba(15, 23, 42, 0) 55%),
			linear-gradient(180deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.98) 100%);
		border: 1px solid rgba(148, 163, 184, 0.14);

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
			background: rgba(15, 23, 42, 0.76);
			color: #f8fafc;
			font-size: 0.78rem;
			font-weight: 700;
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
