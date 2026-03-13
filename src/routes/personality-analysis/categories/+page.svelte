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

	const structuredData = $derived.by(() => ({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Personality Analysis Categories | 9takes',
		description:
			'Browse 9takes personality-analysis profiles by category, including film, creators, music, politics, and tech.',
		url: 'https://9takes.com/personality-analysis/categories',
		isPartOf: {
			'@type': 'CollectionPage',
			name: 'Famous Personality Analysis',
			url: 'https://9takes.com/personality-analysis'
		},
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: [...data.primaryCategories, ...data.secondaryCategories].map(
				(category, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: category.label,
					url: `https://9takes.com/personality-analysis/categories/${category.slug}`
				})
			)
		}
	}));
</script>

<svelte:head>
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
</svelte:head>

<SEOHead
	title="Browse Personality Analysis Categories | 9takes"
	description="Explore 9takes personality-analysis profiles by category: creators, musicians, politicians, movie stars, and tech founders."
	canonical="https://9takes.com/personality-analysis/categories"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/personality-analysis-card.webp"
/>

<div class="page-shell">
	<header class="hero">
		<p class="eyebrow">New Browse Layer</p>
		<h1>Explore Famous People by Category</h1>
		<p class="lede">
			Browse the personality-analysis library by domain instead of just Enneagram number. This makes
			it easier to compare movie stars to movie stars, creators to creators, and politicians to
			politicians.
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
		min-height: 100vh;
		background:
			radial-gradient(circle at top, rgba(124, 58, 237, 0.12), transparent 35%),
			linear-gradient(180deg, #09090f 0%, #12121a 100%);
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
		color: #94a3b8;
	}

	h1,
	h2,
	h3 {
		margin: 0;
		color: #f8fafc;
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
		color: #cbd5e1;
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
			background: rgba(15, 23, 42, 0.7);
			border: 1px solid rgba(148, 163, 184, 0.2);
			color: #cbd5e1;
			font-size: 0.85rem;
			text-decoration: none;
		}
	}

	.hero-link:hover {
		border-color: rgba(124, 58, 237, 0.45);
		color: #ddd6fe;
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
		border-bottom: 1px solid rgba(148, 163, 184, 0.14);
	}

	.section-copy {
		margin: 0;
		max-width: 420px;
		color: #94a3b8;
		text-align: right;
		line-height: 1.5;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 1rem;
	}

	.category-card,
	.secondary-card {
		text-decoration: none;
		background:
			linear-gradient(180deg, var(--accent-soft) 0%, rgba(15, 23, 42, 0) 48%),
			linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.98) 100%);
		border: 1px solid rgba(148, 163, 184, 0.16);
		border-radius: 1.1rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-4px);
			border-color: var(--accent);
			box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
		}
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
		background: rgba(15, 23, 42, 0.82);
		border: 1px solid rgba(148, 163, 184, 0.2);
		color: #f8fafc;
		text-align: center;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.summary,
	.secondary-card p {
		margin: 0;
		color: #cbd5e1;
		line-height: 1.6;
	}

	.tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.tag-chip {
		padding: 0.35rem 0.55rem;
		border-radius: 999px;
		background: rgba(15, 23, 42, 0.78);
		border: 1px solid rgba(148, 163, 184, 0.16);
		color: #cbd5e1;
		font-size: 0.74rem;
	}

	.featured-block ul {
		margin: 0.45rem 0 0;
		padding-left: 1rem;
		color: #f8fafc;
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
			color: #94a3b8;
		}
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--accent);
		font-size: 0.82rem;
		font-weight: 600;
	}

	.updated {
		color: #64748b;
		margin: 0;
	}

	.secondary-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.compact {
		gap: 0.35rem;
	}

	@media (max-width: 1100px) {
		.category-grid {
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
