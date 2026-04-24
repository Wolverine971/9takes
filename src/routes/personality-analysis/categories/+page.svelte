<!-- src/routes/personality-analysis/categories/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';

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
		<p class="eyebrow">Personality analysis · Categories</p>
		<h1>Browse famous people by the lane they live in</h1>
		<p class="lede">
			Instead of one flat archive, every hub now breaks into tight sub-categories — so you can
			compare screen icons to rising actors, pop stars to rappers, and heads of state to activists
			inside the same frame.
		</p>
		<div class="hero-meta">
			<span class="stat"><strong>{data.totalPeople}</strong> profiles</span>
			<span class="stat-divider" aria-hidden="true">·</span>
			<span class="stat"><strong>{allCategories.length}</strong> categories</span>
			<a href="/personality-analysis" class="hero-back">
				<span aria-hidden="true">←</span>
				All personalities
			</a>
		</div>
	</header>

	<nav class="quick-jump" aria-label="Jump to category">
		{#each allCategories as category}
			<a href="#cat-{category.slug}" class="jump-pill" style={`--jump-accent:${category.accent};`}>
				<span class="jump-dot" aria-hidden="true"></span>
				<span class="jump-label">{category.shortLabel}</span>
				<span class="jump-count">{category.count}</span>
			</a>
		{/each}
	</nav>

	<main class="content">
		<section class="section">
			<div class="section-head">
				<h2>Core categories</h2>
				<p>The seven largest lanes — together they cover the bulk of the library.</p>
			</div>

			<div class="category-grid">
				{#each data.primaryCategories as category}
					<a
						id="cat-{category.slug}"
						href="/personality-analysis/categories/{category.slug}"
						class="category-card"
						style={`--accent:${category.accent}; --accent-soft:${category.accentSoft};`}
					>
						<span class="card-accent-bar" aria-hidden="true"></span>

						<div class="card-head">
							<div class="card-title-group">
								<p class="card-label">{category.shortLabel}</p>
								<h3>{category.label}</h3>
							</div>
							<span class="count-pill">{category.count}</span>
						</div>

						<p class="summary">{category.summary}</p>

						<div class="card-body">
							{#if category.groups.length > 0}
								<div class="block">
									<p class="mini-label">Subcategories</p>
									<div class="chip-row">
										{#each category.groups.slice(0, 3) as group}
											<span class="chip">{group.label}</span>
										{/each}
										{#if category.groups.length > 3}
											<span class="chip muted">+{category.groups.length - 3}</span>
										{/if}
									</div>
								</div>
							{/if}

							{#if category.featured.length > 0}
								<div class="block">
									<p class="mini-label">Featured</p>
									<p class="featured-names">
										{#each category.featured.slice(0, 3) as person, i}
											{#if i > 0}<span class="bullet" aria-hidden="true">·</span>{/if}<span
												>{person.name}</span
											>
										{/each}
									</p>
								</div>
							{/if}
						</div>

						<div class="card-footer">
							<span class="cta">
								Explore
								<ArrowRightIcon iconStyle={''} height={'0.9rem'} fill={'currentColor'} />
							</span>
							{#if formatDate(category.latestUpdate)}
								<span class="updated">Updated {formatDate(category.latestUpdate)}</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</section>

		{#if data.secondaryCategories.length > 0}
			<section class="section">
				<div class="section-head">
					<h2>Specialty lanes</h2>
					<p>Tighter focus, still deep enough to stand on their own.</p>
				</div>

				<div class="category-grid specialty">
					{#each data.secondaryCategories as category}
						<a
							id="cat-{category.slug}"
							href="/personality-analysis/categories/{category.slug}"
							class="category-card"
							style={`--accent:${category.accent}; --accent-soft:${category.accentSoft};`}
						>
							<span class="card-accent-bar" aria-hidden="true"></span>

							<div class="card-head">
								<div class="card-title-group">
									<p class="card-label">{category.shortLabel}</p>
									<h3>{category.label}</h3>
								</div>
								<span class="count-pill">{category.count}</span>
							</div>

							<p class="summary">{category.summary}</p>

							{#if category.groups.length > 0}
								<div class="block">
									<p class="mini-label">Subcategories</p>
									<div class="chip-row">
										{#each category.groups.slice(0, 3) as group}
											<span class="chip">{group.label}</span>
										{/each}
									</div>
								</div>
							{/if}

							<div class="card-footer">
								<span class="cta">
									Explore
									<ArrowRightIcon iconStyle={''} height={'0.9rem'} fill={'currentColor'} />
								</span>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<aside class="alt-browse">
			<div class="alt-copy">
				<p class="mini-label">Another way in</p>
				<h2>Or browse by Enneagram type</h2>
				<p>See every profile grouped by the nine core personality types — 1 through 9.</p>
			</div>
			<a href="/personality-analysis" class="alt-link">
				<span>Go to type index</span>
				<ArrowRightIcon iconStyle={''} height={'1rem'} fill={'currentColor'} />
			</a>
		</aside>
	</main>
</div>

<style lang="scss">
	.page-shell {
		--surface-card: color-mix(in srgb, var(--bg-surface) 92%, var(--bg-deep));
		--surface-card-strong: color-mix(in srgb, var(--bg-surface) 86%, var(--bg-deep));
		--card-border: color-mix(in srgb, var(--accent) 20%, var(--border-color));
		--card-border-hover: color-mix(in srgb, var(--accent) 55%, transparent);
		min-height: 100vh;
		background:
			radial-gradient(
				ellipse at top,
				color-mix(in srgb, var(--primary-subtle) 120%, transparent) 0%,
				transparent 45%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-deep) 88%, var(--bg-base)) 0%,
				var(--bg-base) 100%
			);
	}

	/* ============ Hero ============ */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 4rem 1.5rem 2.25rem;
		text-align: center;
	}

	.eyebrow,
	.mini-label,
	.card-label {
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--text-tertiary);
		margin: 0;
	}

	h1,
	h2,
	h3 {
		color: var(--text-primary);
		margin: 0;
	}

	h1 {
		margin-top: 0.75rem;
		font-size: clamp(2.25rem, 4.5vw, 3.75rem);
		letter-spacing: -0.03em;
		line-height: 1.08;
	}

	.lede {
		max-width: 680px;
		margin: 1.25rem auto 0;
		color: var(--text-secondary);
		font-size: 1.05rem;
		line-height: 1.65;
	}

	.hero-meta {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.65rem 0.9rem;
		margin-top: 1.75rem;
		padding: 0.6rem 1.1rem;
		border-radius: 999px;
		background: var(--surface-card);
		border: 1px solid var(--border-color);
	}

	.stat {
		font-size: 0.9rem;
		color: var(--text-secondary);

		strong {
			color: var(--text-primary);
			font-weight: 700;
			margin-right: 0.3rem;
		}
	}

	.stat-divider {
		color: var(--text-muted);
	}

	.hero-back {
		font-size: 0.85rem;
		color: var(--primary);
		text-decoration: none;
		padding-left: 0.85rem;
		margin-left: 0.1rem;
		border-left: 1px solid var(--border-color);
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;

		&:hover {
			color: var(--primary-light);
		}
	}

	/* ============ Quick jump ============ */
	.quick-jump {
		max-width: 1200px;
		margin: 0 auto 2.5rem;
		padding: 0 1.5rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
	}

	.jump-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.5rem 0.85rem 0.5rem 0.75rem;
		border-radius: 999px;
		background: var(--surface-card);
		border: 1px solid var(--border-color);
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.85rem;
		transition:
			color 0.18s ease,
			border-color 0.18s ease,
			background 0.18s ease,
			transform 0.18s ease;

		&:hover {
			color: var(--text-primary);
			transform: translateY(-1px);
			border-color: color-mix(in srgb, var(--jump-accent) 55%, transparent);
			background: color-mix(in srgb, var(--jump-accent) 10%, var(--surface-card));
		}
	}

	.jump-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--jump-accent);
		box-shadow: 0 0 10px color-mix(in srgb, var(--jump-accent) 45%, transparent);
		flex-shrink: 0;
	}

	.jump-label {
		white-space: nowrap;
	}

	.jump-count {
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--text-tertiary);
		padding: 0.1rem 0.45rem;
		border-radius: 999px;
		background: var(--bg-base);
	}

	/* ============ Content ============ */
	.content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}

	.section {
		margin-bottom: 3.5rem;
		scroll-margin-top: 2rem;
	}

	.section-head {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);

		h2 {
			font-size: 1.6rem;
			letter-spacing: -0.015em;
		}

		p {
			margin: 0.3rem 0 0;
			color: var(--text-secondary);
			font-size: 0.95rem;
			line-height: 1.5;
			max-width: 54ch;
		}
	}

	/* ============ Cards ============ */
	.category-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
	}

	.category-card {
		position: relative;
		text-decoration: none;
		background: var(--surface-card-strong);
		border: 1px solid var(--card-border);
		border-radius: 1rem;
		padding: 1.75rem 1.5rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-shadow: var(--shadow-sm);
		overflow: hidden;
		scroll-margin-top: 6rem;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-3px);
			border-color: var(--card-border-hover);
			box-shadow:
				var(--shadow-lg),
				0 12px 28px -15px color-mix(in srgb, var(--accent) 55%, transparent);
		}
	}

	.card-accent-bar {
		position: absolute;
		inset: 0 0 auto 0;
		height: 4px;
		background: linear-gradient(
			90deg,
			var(--accent) 0%,
			color-mix(in srgb, var(--accent) 55%, transparent) 100%
		);
	}

	.card-head {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.card-title-group {
		display: grid;
		gap: 0.3rem;
	}

	.card-label {
		color: color-mix(in srgb, var(--accent) 80%, var(--text-secondary));
	}

	.category-card h3 {
		font-size: 1.25rem;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}

	.count-pill {
		flex-shrink: 0;
		min-width: 2.25rem;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent-soft) 75%, var(--bg-base));
		border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
		color: var(--text-primary);
		text-align: center;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.summary {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.92rem;
		line-height: 1.55;
	}

	.card-body {
		display: grid;
		gap: 0.9rem;
	}

	.block {
		display: grid;
		gap: 0.45rem;
	}

	.chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chip {
		padding: 0.3rem 0.6rem;
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--bg-base) 55%, transparent);
		border: 1px solid var(--border-color);
		color: var(--text-primary);
		font-size: 0.75rem;
		line-height: 1.3;
	}

	.chip.muted {
		color: var(--text-tertiary);
	}

	.featured-names {
		margin: 0;
		color: var(--text-primary);
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.featured-names .bullet {
		margin: 0 0.4rem;
		color: var(--text-muted);
	}

	.card-footer {
		margin-top: auto;
		padding-top: 0.85rem;
		border-top: 1px solid color-mix(in srgb, var(--border-color) 65%, transparent);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--accent);
		font-size: 0.88rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.category-card:hover .cta {
		gap: 0.55rem;
	}

	.updated {
		font-size: 0.68rem;
		color: var(--text-muted);
		letter-spacing: 0.06em;
	}

	/* ============ Alt browse ============ */
	.alt-browse {
		margin-top: 3rem;
		padding: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		align-items: center;
		justify-content: space-between;
		background: var(--surface-card);
		border: 1px solid var(--border-color);
		border-radius: 1rem;

		.alt-copy {
			max-width: 60ch;
		}

		h2 {
			margin: 0.3rem 0 0.35rem;
			font-size: 1.35rem;
		}

		p {
			margin: 0;
			color: var(--text-secondary);
			font-size: 0.92rem;
			line-height: 1.5;
		}
	}

	.alt-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.25rem;
		border-radius: 999px;
		background: var(--primary);
		color: var(--text-on-primary);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		box-shadow: var(--glow-sm);
		transition:
			transform 0.18s ease,
			background 0.18s ease;

		&:hover {
			transform: translateY(-1px);
			background: var(--primary-dark);
		}
	}

	/* ============ Responsive ============ */
	@media (max-width: 1024px) {
		.category-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 2.5rem 1rem 1.75rem;
		}

		.content {
			padding: 0 1rem 3rem;
		}

		.quick-jump {
			padding: 0 1rem 0.5rem;
			flex-wrap: nowrap;
			justify-content: flex-start;
			overflow-x: auto;
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		.jump-pill {
			flex-shrink: 0;
		}

		.category-grid {
			grid-template-columns: 1fr;
		}

		.section-head h2 {
			font-size: 1.35rem;
		}

		.alt-browse {
			flex-direction: column;
			align-items: stretch;
			padding: 1.5rem;
		}

		.alt-link {
			justify-content: center;
		}
	}
</style>
