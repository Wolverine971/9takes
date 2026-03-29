<!-- src/routes/personality-analysis/categories/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import { formatPersonalityRawType } from '$lib/personalityCategories';

	let { data }: { data: PageData } = $props();

	function formatDate(value: string | null): string | null {
		if (!value) return null;

		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	const allCategories = $derived([...data.primaryCategories, ...data.secondaryCategories]);
	const canonicalUrl = 'https://9takes.com/personality-analysis/categories';
	const seoTitle = 'Famous People Personality Analysis by Category | 9takes';
	const seoDescription =
		'Browse famous people personality analysis by category, including film & TV, creators, music, politics, tech founders, comedians, and authors. Compare Enneagram patterns by domain.';
	const seoFaqs = [
		{
			question: 'What can you browse on the personality analysis category page?',
			answer:
				'You can browse the 9takes personality-analysis library by domain, including film and TV, creators, musicians, politics, tech, comedy, and authors or thinkers.'
		},
		{
			question: 'How are the category pages organized?',
			answer:
				'Each category page is subdivided into cleaner sections so readers can compare similar public figures inside the same lane instead of looking through one flat archive.'
		},
		{
			question: 'Can a person appear in more than one category?',
			answer:
				'Yes. A profile can appear in more than one category when that person genuinely overlaps multiple domains, such as music and creators or film and politics.'
		}
	] as const;

	function getLatestDate(values: Array<{ latestUpdate: string | null }>): string | null {
		let latestDate: string | null = null;
		let latestTimestamp = 0;

		for (const value of values) {
			if (!value.latestUpdate) continue;
			const timestamp = new Date(value.latestUpdate).getTime();
			if (!Number.isFinite(timestamp) || timestamp <= latestTimestamp) continue;

			latestTimestamp = timestamp;
			latestDate = value.latestUpdate;
		}

		return latestDate;
	}

	const latestCategoryUpdate = $derived.by(() => getLatestDate(allCategories));
	const seoKeywords = $derived.by(() =>
		[...new Set(allCategories.flatMap((category) => category.seoKeywords))].slice(0, 14).join(', ')
	);

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
						name: 'Categories'
					}
				]
			},
			{
				'@type': 'CollectionPage',
				'@id': canonicalUrl,
				name: 'Famous People Personality Analysis by Category',
				description: seoDescription,
				url: canonicalUrl,
				inLanguage: 'en-US',
				...(latestCategoryUpdate ? { dateModified: latestCategoryUpdate } : {}),
				keywords: seoKeywords,
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
						name: 'Famous people personality analysis'
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
					numberOfItems: allCategories.length,
					itemListOrder: 'https://schema.org/ItemListUnordered',
					itemListElement: allCategories.map((category, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: category.label,
						url: `https://9takes.com/personality-analysis/categories/${category.slug}`,
						description: category.summary
					}))
				},
				hasPart: allCategories.map((category) => ({
					'@type': 'CollectionPage',
					name: category.label,
					url: `${canonicalUrl}/${category.slug}`,
					description: category.seoDescription
				}))
			},
			{
				'@type': 'FAQPage',
				'@id': `${canonicalUrl}#faq`,
				mainEntity: seoFaqs.map((faq) => ({
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
	twitterImageAlt="Browse famous people personality analysis by category on 9takes"
	jsonLd={structuredData}
	additionalMeta={[
		{ name: 'keywords', content: seoKeywords },
		{
			name: 'googlebot',
			content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
		}
	]}
/>

<div class="page-shell">
	<header class="hero">
		<p class="eyebrow">New Browse Layer</p>
		<h1>Explore Famous People by Category</h1>
		<p class="lede">
			Browse the personality-analysis library by domain instead of just Enneagram number. Each hub
			now breaks into cleaner sections, so you can compare screen icons to rising actors, pop stars
			to rappers, and heads of state to activists.
		</p>
		<div class="hero-stats">
			<span>{data.totalPeople} published profiles</span>
			<span
				>{data.primaryCategories.length + data.secondaryCategories.length} active categories</span
			>
			<a href="/personality-analysis" class="hero-link">Back to all personalities</a>
		</div>
	</header>

	<main class="content">
		<section class="section">
			<div class="section-head">
				<div>
					<p class="section-kicker">Phase 1</p>
					<h2>Core Categories</h2>
				</div>
				<p class="section-copy">
					These cover the majority of the published personality-analysis library.
				</p>
			</div>

			<div class="category-grid">
				{#each data.primaryCategories as category}
					<a
						href="/personality-analysis/categories/{category.slug}"
						class="category-card"
						style={`--accent:${category.accent}; --accent-soft:${category.accentSoft};`}
					>
						<div class="card-top">
							<div>
								<p class="card-label">{category.shortLabel}</p>
								<h3>{category.label}</h3>
							</div>
							<span class="count-pill">{category.count}</span>
						</div>

						<p class="summary">{category.summary}</p>

						{#if category.groups.length > 0}
							<div class="cluster-preview">
								<span class="mini-label">Subcategories</span>
								<div class="cluster-chip-row">
									{#each category.groups.slice(0, 3) as group}
										<span class="cluster-chip">{group.label}</span>
									{/each}
									{#if category.groups.length > 3}
										<span class="cluster-chip muted">+{category.groups.length - 3} more</span>
									{/if}
								</div>
							</div>
						{/if}

						<div class="tag-row">
							{#each category.rawTypes as rawType}
								<span class="tag-chip">{formatPersonalityRawType(rawType)}</span>
							{/each}
						</div>

						{#if category.featured.length > 0}
							<div class="featured-block">
								<p class="mini-label">Featured reads</p>
								<ul>
									{#each category.featured.slice(0, 3) as person}
										<li>{person.name}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<div class="card-footer">
							<div class="distribution">
								{#each category.distribution.slice(0, 4) as bucket}
									<span>Type {bucket.enneagram}</span>
								{/each}
							</div>
							<div class="cta">
								<span>Open category</span>
								<ArrowRightIcon iconStyle={''} height={'1rem'} fill={'currentColor'} />
							</div>
						</div>

						{#if formatDate(category.latestUpdate)}
							<p class="updated">Updated {formatDate(category.latestUpdate)}</p>
						{/if}
					</a>
				{/each}
			</div>
		</section>

		{#if data.secondaryCategories.length > 0}
			<section class="section">
				<div class="section-head">
					<div>
						<p class="section-kicker">Phase 2</p>
						<h2>Specialty Categories</h2>
					</div>
					<p class="section-copy">Smaller lanes with enough depth to stand on their own.</p>
				</div>

				<div class="secondary-grid">
					{#each data.secondaryCategories as category}
						<a
							href="/personality-analysis/categories/{category.slug}"
							class="secondary-card"
							style={`--accent:${category.accent}; --accent-soft:${category.accentSoft};`}
						>
							<div class="secondary-top">
								<h3>{category.label}</h3>
								<span class="count-pill">{category.count}</span>
							</div>
							<p>{category.summary}</p>
							{#if category.groups.length > 0}
								<div class="cluster-preview compact-preview">
									<span class="mini-label">Subcategories</span>
									<div class="cluster-chip-row">
										{#each category.groups.slice(0, 3) as group}
											<span class="cluster-chip">{group.label}</span>
										{/each}
									</div>
								</div>
							{/if}
							<div class="tag-row compact">
								{#each category.rawTypes as rawType}
									<span class="tag-chip">{formatPersonalityRawType(rawType)}</span>
								{/each}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</main>
</div>

<style lang="scss">
	.page-shell {
		--surface-card: color-mix(in srgb, var(--bg-surface) 90%, var(--bg-deep));
		--surface-card-strong: color-mix(in srgb, var(--bg-surface) 82%, var(--bg-deep));
		--accent-border: color-mix(in srgb, var(--accent) 18%, var(--border-color));
		min-height: 100vh;
		background:
			radial-gradient(
				circle at top,
				color-mix(in srgb, var(--accent-soft) 52%, transparent) 0%,
				transparent 36%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-deep) 88%, var(--bg-base)) 0%,
				var(--bg-base) 100%
			);
	}

	.hero {
		max-width: 1100px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 2rem;
		text-align: center;
	}

	.eyebrow,
	.section-kicker,
	.card-label,
	.mini-label,
	.updated {
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.7rem;
		font-weight: 700;
	}

	.eyebrow,
	.section-kicker,
	.card-label,
	.mini-label {
		color: var(--text-secondary);
	}

	h1,
	h2,
	h3 {
		margin: 0;
		color: var(--text-primary);
		line-height: 1.1;
	}

	h1 {
		font-size: clamp(2rem, 4vw, 3.5rem);
		letter-spacing: -0.03em;
		margin-top: 0.4rem;
	}

	.lede {
		max-width: 760px;
		margin: 1rem auto 0;
		color: var(--text-secondary);
		font-size: 1.05rem;
		line-height: 1.7;
	}

	.hero-stats {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.5rem;

		span,
		a {
			padding: 0.6rem 0.9rem;
			border-radius: 999px;
			background: var(--surface-card);
			border: 1px solid var(--accent-border);
			color: var(--text-secondary);
			font-size: 0.85rem;
			text-decoration: none;
		}
	}

	.hero-link:hover {
		border-color: color-mix(in srgb, var(--accent) 38%, transparent);
		color: var(--primary);
	}

	.content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 1.5rem 4rem;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;
		margin-bottom: 1.25rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid var(--accent-border);
	}

	.section-copy {
		margin: 0;
		max-width: 420px;
		color: var(--text-secondary);
		text-align: right;
		line-height: 1.5;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
	}

	.category-card,
	.secondary-card {
		text-decoration: none;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 38%, transparent) 0%,
				transparent 48%
			),
			var(--surface-card-strong);
		border: 1px solid var(--accent-border);
		border-radius: 1.1rem;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		box-shadow: var(--shadow-sm);
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-4px);
			border-color: color-mix(in srgb, var(--accent) 38%, transparent);
			box-shadow: var(--shadow-lg);
		}
	}

	.category-card h3 {
		font-size: 1.15rem;
	}

	.card-top,
	.secondary-top {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.count-pill {
		min-width: 2.2rem;
		padding: 0.35rem 0.55rem;
		border-radius: 999px;
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		color: var(--text-primary);
		text-align: center;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.summary,
	.secondary-card p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1.55;
	}

	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.cluster-preview {
		display: grid;
		gap: 0.45rem;
	}

	.cluster-chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.cluster-chip {
		padding: 0.35rem 0.55rem;
		border-radius: 0.75rem;
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		color: var(--text-primary);
		font-size: 0.72rem;
		line-height: 1.3;
	}

	.cluster-chip.muted {
		color: var(--text-secondary);
	}

	.tag-chip {
		padding: 0.35rem 0.55rem;
		border-radius: 999px;
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		color: var(--text-secondary);
		font-size: 0.74rem;
	}

	.featured-block ul {
		margin: 0.45rem 0 0;
		padding-left: 1rem;
		color: var(--text-primary);
		line-height: 1.7;
	}

	.card-footer {
		margin-top: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.distribution {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;

		span {
			font-size: 0.72rem;
			color: var(--text-secondary);
		}
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--primary);
		font-size: 0.82rem;
		font-weight: 600;
	}

	.updated {
		color: var(--text-tertiary);
		margin: 0;
	}

	.secondary-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
	}

	.compact {
		gap: 0.35rem;
	}

	.compact-preview {
		margin-top: 0.1rem;
	}

	@media (max-width: 1100px) {
		.category-grid,
		.secondary-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.hero {
			padding: 2.5rem 1rem 1.5rem;
		}

		.content {
			padding: 0.75rem 1rem 3rem;
		}

		.section-head {
			flex-direction: column;
			align-items: start;
		}

		.section-copy {
			text-align: left;
		}

		.category-grid,
		.secondary-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
