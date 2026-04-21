<!-- src/routes/personality-analysis/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import {
		PRIMARY_PERSONALITY_CATEGORY_SLUGS,
		getPersonalityCategoryBySlug
	} from '$lib/personalityCategories';

	let { data }: { data: PageData } = $props();

	function getRecencyLabel(lastmod: string | null): string | null {
		if (!lastmod) return null;

		const days = Math.floor((Date.now() - new Date(lastmod).getTime()) / 86400000);
		if (days <= 3) return 'New';
		if (days <= 7) return 'This week';
		if (days <= 30) return 'This month';
		return null;
	}

	const typeNames: Record<number, { name: string; tagline: string }> = {
		1: { name: 'The Perfectionist', tagline: 'Principled, purposeful, self-controlled' },
		2: { name: 'The Helper', tagline: 'Generous, demonstrative, people-pleasing' },
		3: { name: 'The Achiever', tagline: 'Adaptable, excelling, driven' },
		4: { name: 'The Individualist', tagline: 'Expressive, dramatic, self-absorbed' },
		5: { name: 'The Investigator', tagline: 'Perceptive, innovative, secretive' },
		6: { name: 'The Loyalist', tagline: 'Engaging, responsible, anxious' },
		7: { name: 'The Enthusiast', tagline: 'Spontaneous, versatile, scattered' },
		8: { name: 'The Challenger', tagline: 'Self-confident, decisive, confrontational' },
		9: { name: 'The Peacemaker', tagline: 'Receptive, reassuring, complacent' }
	};

	const primaryCategories = PRIMARY_PERSONALITY_CATEGORY_SLUGS.map((slug) =>
		getPersonalityCategoryBySlug(slug)
	).filter((category): category is NonNullable<typeof category> => Boolean(category));

	const totalPeople = $derived(data.totalPeople);

	const structuredData = $derived({
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
						name: 'Personality Analysis'
					}
				]
			},
			{
				'@type': 'CollectionPage',
				name: 'Famous People Personality Analysis',
				description: `Browse ${totalPeople} in-depth Enneagram personality analyses of celebrities, historical figures, and public personalities across music, film, politics, tech, and more.`,
				url: 'https://9takes.com/personality-analysis',
				inLanguage: 'en-US',
				about: {
					'@type': 'Thing',
					name: 'Enneagram of Personality',
					sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
				},
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com',
					logo: {
						'@type': 'ImageObject',
						url: 'https://9takes.com/brand/aero.png'
					},
					sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom']
				},
				mainEntity: {
					'@type': 'ItemList',
					numberOfItems: 9,
					itemListOrder: 'https://schema.org/ItemListOrderAscending',
					itemListElement: Array.from({ length: 9 }, (_, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name: `Enneagram Type ${i + 1} (${typeNames[i + 1].name}) Personalities`,
						url: `https://9takes.com/personality-analysis/type/${i + 1}`,
						description: typeNames[i + 1].tagline
					}))
				}
			}
		]
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<SEOHead
	title="Famous People Personality Analysis | Enneagram Character Studies | 9takes"
	description={`Explore ${totalPeople} in-depth Enneagram personality analyses of celebrities, historical figures, and influential people. Browse by type or category to decode what drives the world's most fascinating personalities.`}
	canonical="https://9takes.com/personality-analysis"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/personality-analysis-card.webp"
	author="9takes"
/>

<div class="page-wrapper">
	<header class="index-hero">
		<div class="index-badge">Personality Analysis</div>
		<h1>See public figures through the patterns that drive them.</h1>
		<p class="index-hero-copy">
			Browse Enneagram analyses of celebrities, founders, artists, athletes, and public figures by
			type or category.
		</p>
		<div class="index-hero-actions">
			<a href="/personality-analysis/categories" class="index-action primary">
				Browse Categories
			</a>
			<a href="#type-1" class="index-action">Jump to Enneagram Types</a>
		</div>
		<div class="index-tag-row" aria-label="Category Navigation">
			{#each primaryCategories as category}
				<a href="/personality-analysis/categories/{category.slug}" class="index-tag">
					<span>{category.shortLabel}</span>
				</a>
			{/each}
		</div>
	</header>

	<nav class="index-link-band" aria-label="Type Navigation">
		<div class="index-link-scroll">
			{#each Array.from({ length: 9 }, (_, i) => i + 1) as typeNum}
				<a href="#type-{typeNum}" class="index-link-pill">
					<span class="index-link-code">{typeNum}</span>
					<span>{typeNames[typeNum].name.replace('The ', '')}</span>
				</a>
			{/each}
		</div>
	</nav>

	<main class="main-content">
		<!-- Featured Section -->
		{#if data.featured.length > 0}
			<section class="featured-section">
				<div class="section-header featured-header">
					<div class="type-badge featured-badge-icon">
						<span class="type-num">F</span>
					</div>
					<div class="section-info">
						<h2>Featured</h2>
						<p class="type-tagline">Most recently updated analyses</p>
					</div>
				</div>
				<div class="featured-grid">
					{#each data.featured as person (person.slug)}
						{@const label = getRecencyLabel(person.lastmod || person.date)}
						<a
							href={buildPersonalityAnalysisPath(person.slug)}
							class="featured-person-card"
							aria-label="Read analysis of {formatPersonalityDisplayName(person.slug)}"
						>
							<div class="featured-person-image">
								<img
									src={buildPersonalityImagePath(person.enneagram, person.slug)}
									alt={formatPersonalityDisplayName(person.slug)}
									loading="eager"
									width="400"
									height="533"
								/>
							</div>
							<div class="featured-person-overlay"></div>
							<div class="featured-person-info">
								<span class="featured-label">Featured</span>
								{#if label}
									<span class="recency-badge" class:new={label === 'New'}>{label}</span>
								{/if}
								<span class="featured-person-name">{formatPersonalityDisplayName(person.slug)}</span
								>
								<span class="featured-person-type">
									Type {person.enneagram}: {person.enneagram
										? typeNames[parseInt(person.enneagram)]?.name || ''
										: ''}
								</span>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Recently Updated Section -->
		{#if data.recentlyUpdated.length > 0}
			<section class="recent-section">
				<div class="section-header recent-header">
					<div class="type-badge recent-badge-icon">
						<span class="type-num">R</span>
					</div>
					<div class="section-info">
						<h2>Recently Updated</h2>
						<p class="type-tagline">Fresh insights and revisions</p>
					</div>
				</div>
				<div class="recent-people-grid">
					{#each data.recentlyUpdated as person (person.slug)}
						{@const label = getRecencyLabel(person.lastmod || person.date)}
						<a
							href={buildPersonalityAnalysisPath(person.slug)}
							class="recent-person-card"
							aria-label="Read analysis of {formatPersonalityDisplayName(person.slug)}"
						>
							<div class="recent-person-image">
								<img
									src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
									alt={formatPersonalityDisplayName(person.slug)}
									loading="lazy"
									width="200"
									height="200"
								/>
							</div>
							<div class="recent-person-overlay"></div>
							<div class="recent-person-info">
								{#if label}
									<span class="recency-badge" class:new={label === 'New'}>{label}</span>
								{/if}
								<span class="recent-person-name">{formatPersonalityDisplayName(person.slug)}</span>
								<span class="recent-person-type">
									Type {person.enneagram}
								</span>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Type Sections -->
		{#each Array.from({ length: 9 }, (_, i) => i + 1) as typeNum}
			{@const typePeople = data.people.filter(
				(p) => p.enneagram && parseInt(p.enneagram) === typeNum
			)}
			{#if typePeople.length > 0}
				<section class="type-section" id="type-{typeNum}">
					<div class="section-header">
						<div class="type-badge">
							<span class="type-num">{typeNum}</span>
						</div>
						<div class="section-info">
							<h2>Type {typeNum}: {typeNames[typeNum].name}</h2>
							<p class="type-tagline">{typeNames[typeNum].tagline}</p>
						</div>
					</div>

					<div class="people-grid">
						{#each typePeople.slice(0, 5) as person}
							<a
								href={buildPersonalityAnalysisPath(person.slug)}
								class="person-card"
								aria-label="Read analysis of {formatPersonalityDisplayName(person.slug)}"
							>
								<div class="person-image">
									<img
										src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
										alt={formatPersonalityDisplayName(person.slug)}
										loading="lazy"
										width="200"
										height="200"
									/>
								</div>
								<div class="person-info">
									<span class="person-name">{formatPersonalityDisplayName(person.slug)}</span>
								</div>
							</a>
						{/each}
						<a
							href="/personality-analysis/type/{typeNum}"
							class="person-card view-all-card"
							aria-label="View all Enneagram Type {typeNum} personalities"
						>
							<div class="view-all-content">
								<span class="view-all-text">View all Type {typeNum}s</span>
								<ArrowRightIcon iconStyle={''} height={'1.25rem'} fill={'currentColor'} />
							</div>
						</a>
					</div>
				</section>
			{/if}
		{/each}

		<!-- Email Signup -->
		{#if !data?.user}
			<section class="signup-section">
				<EmailSignup />
			</section>
		{/if}
	</main>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme - Personality Analysis */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
		--type-chip-bg: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-surface) 94%, white 6%) 0%,
			color-mix(in srgb, var(--bg-surface) 84%, var(--bg-base) 16%) 100%
		);
		--type-chip-border: color-mix(in srgb, var(--primary-dark) 24%, var(--border-color));
		--type-chip-border-strong: color-mix(in srgb, var(--primary) 34%, var(--glass-border));
		--type-chip-text: var(--primary-dark);
		--type-chip-highlight: color-mix(in srgb, var(--primary-lightest) 18%, transparent);
		--type-chip-shadow: color-mix(in srgb, var(--primary) 18%, transparent);
		--type-chip-shadow-strong: color-mix(in srgb, var(--primary) 28%, transparent);
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 1.5rem;
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
		background: radial-gradient(ellipse, rgba(45, 212, 191, 0.12) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: 0;
		position: relative;
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-copy {
		max-width: 640px;
		margin: 0.85rem auto 0;
		color: var(--text-secondary);
		font-size: 0.98rem;
		line-height: 1.7;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.1rem;
	}

	.hero-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.65rem 1rem;
		border-radius: 8px;
		border: 1px solid var(--glass-border);
		background: var(--glass-color);
		color: var(--text-secondary);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;

		&:hover {
			transform: translateY(-1px);
			color: var(--text-primary);
			border-color: rgba(45, 212, 191, 0.45);
		}
	}

	.hero-link-primary {
		background: linear-gradient(135deg, rgba(45, 212, 191, 0.24) 0%, var(--accent-subtle) 100%);
		color: var(--accent-light);
	}

	.category-pills {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.category-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.75rem;
		border-radius: 8px;
		border: 1px solid var(--glass-border);
		background: var(--glass-color);
		color: var(--text-secondary);
		font-size: 0.78rem;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			color: var(--accent-light);
			border-color: rgba(45, 212, 191, 0.3);
			background: rgba(45, 212, 191, 0.08);
		}
	}

	/* Quick Navigation */
	.quick-nav {
		background: var(--glass-color);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--glass-border);
		padding: 0.75rem 0;
		margin-bottom: 1rem;
	}

	.nav-scroll {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		padding: 0.5rem 1.5rem;
		scrollbar-width: none;
		justify-content: center;
		flex-wrap: wrap;

		&::-webkit-scrollbar {
			display: none;
		}

		@media (max-width: 640px) {
			flex-wrap: nowrap;
			justify-content: flex-start;
			mask-image: linear-gradient(
				to right,
				transparent,
				black 1.5rem,
				black calc(100% - 1.5rem),
				transparent
			);
			-webkit-mask-image: linear-gradient(
				to right,
				transparent,
				black 1.5rem,
				black calc(100% - 1.5rem),
				transparent
			);
		}
	}

	.nav-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--glass-color);
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		white-space: nowrap;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid var(--glass-border);
		flex-shrink: 0;

		&:hover {
			background: color-mix(in srgb, var(--primary) 12%, var(--glass-color));
			color: var(--text-primary);
			border-color: var(--type-chip-border-strong);
			transform: translateY(-1px);

			.type-number {
				background: color-mix(in srgb, var(--primary) 18%, var(--bg-surface));
				border-color: var(--type-chip-border-strong);
				box-shadow:
					0 10px 18px var(--type-chip-shadow-strong),
					inset 0 1px 0 var(--type-chip-highlight);
			}
		}

		&:active {
			transform: scale(0.98);
		}
	}

	.type-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		background: color-mix(in srgb, var(--primary) 12%, var(--bg-surface));
		color: var(--type-chip-text);
		border: 1px solid var(--type-chip-border);
		border-radius: 0.45rem;
		font-size: 0.75rem;
		font-weight: 700;
		box-shadow: inset 0 1px 0 var(--type-chip-highlight);
		transition: all 0.2s ease;
	}

	.type-name {
		letter-spacing: 0;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 4rem;
	}

	/* Type Sections */
	.type-section {
		margin-bottom: 3.5rem;
		scroll-margin-top: 80px;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
		flex-wrap: wrap;
	}

	.type-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		background: var(--type-chip-bg);
		border: 1px solid var(--type-chip-border-strong);
		border-radius: 8px;
		flex-shrink: 0;
		box-shadow:
			0 12px 24px var(--type-chip-shadow),
			inset 0 1px 0 var(--type-chip-highlight);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0.3rem;
			border-radius: 0.45rem;
			border: 1px solid color-mix(in srgb, var(--primary) 10%, transparent);
			pointer-events: none;
		}
	}

	.type-num {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--type-chip-text);
	}

	.section-info {
		flex: 1;
		min-width: 200px;

		h2 {
			font-size: 1.25rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0;
			line-height: 1.3;
		}
	}

	.type-tagline {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin: 0.125rem 0 0;
	}

	/* People Grid */
	.people-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 1rem;
	}

	/* Person Cards */
	.person-card {
		position: relative;
		aspect-ratio: 1;
		border-radius: 8px;
		overflow: hidden;
		background: var(--bg-surface);
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-sm);
		padding: 0.45rem;

		&::before {
			content: '';
			position: absolute;
			inset: 0.45rem;
			border-radius: 8px;
			background: linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: rgba(45, 212, 191, 0.35);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px rgba(45, 212, 191, 0.1);

			&::before {
				opacity: 1;
			}

			.person-image img {
				transform: scale(1.08);
			}

			.person-info {
				background: linear-gradient(to top, rgba(12, 10, 9, 0.98) 0%, rgba(12, 10, 9, 0.82) 100%);
			}

			.person-name {
				color: #fff;
			}
		}
	}

	.person-image {
		position: absolute;
		inset: 0.45rem;
		border-radius: 8px;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.4s ease;
		}
	}

	.person-info {
		position: absolute;
		bottom: 0.45rem;
		left: 0.45rem;
		right: 0.45rem;
		padding: 0.75rem;
		border-radius: 0 0 0.6rem 0.6rem;
		background: linear-gradient(to top, rgba(12, 10, 9, 0.96) 0%, rgba(12, 10, 9, 0.68) 100%);
		backdrop-filter: blur(10px);
		transition: background 0.3s ease;
		z-index: 2;
	}

	.person-name {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #fff;
		text-align: center;
		text-transform: capitalize;
		line-height: 1.3;
		transition: color 0.2s ease;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* View All Card */
	.view-all-card {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--primary-subtle) 72%, transparent) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, var(--bg-deep)) 100%
		);
		border: 1px solid color-mix(in srgb, var(--primary) 22%, var(--border-color));

		&::before {
			display: none;
		}

		&:hover {
			background: linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary) 16%, transparent) 0%,
				var(--bg-surface) 100%
			);
			border-color: rgba(45, 212, 191, 0.5);
			box-shadow:
				var(--shadow-lg),
				0 0 30px rgba(45, 212, 191, 0.15);

			.view-all-content {
				color: var(--primary);
			}
		}
	}

	.view-all-content {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: var(--primary);
		transition: color 0.25s ease;
	}

	.view-all-text {
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0;
	}

	/* Featured Section */
	.featured-section {
		margin-bottom: 3rem;
	}

	.featured-header,
	.recent-header {
		flex-direction: row;
		align-items: center;
	}

	.featured-badge-icon,
	.recent-badge-icon {
		background: linear-gradient(135deg, rgba(45, 212, 191, 0.2) 0%, var(--accent-subtle) 100%);
		box-shadow: none;

		.type-num {
			font-size: 1.25rem;
			text-shadow: none;
		}
	}

	.featured-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.25rem;
	}

	.featured-person-card {
		position: relative;
		aspect-ratio: 3 / 4;
		border-radius: 8px;
		overflow: hidden;
		background: var(--bg-surface);
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid color-mix(in srgb, var(--primary) 20%, var(--border-color));
		box-shadow: var(--shadow-sm);
		padding: 0.55rem;

		&:hover {
			transform: translateY(-4px);
			border-color: rgba(45, 212, 191, 0.5);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px rgba(45, 212, 191, 0.15);

			.featured-person-image img {
				transform: scale(1.05);
			}

			.featured-person-name {
				color: #fff;
			}
		}
	}

	.featured-person-image {
		position: absolute;
		inset: 0.55rem;
		border-radius: 8px;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.4s ease;
		}
	}

	.featured-person-overlay {
		position: absolute;
		inset: 0.55rem;
		border-radius: 8px;
		background: linear-gradient(
			to top,
			rgba(12, 10, 9, 0.97) 0%,
			rgba(12, 10, 9, 0.58) 50%,
			rgba(12, 10, 9, 0.14) 100%
		);
	}

	.featured-person-info {
		position: absolute;
		bottom: 0.55rem;
		left: 0.55rem;
		right: 0.55rem;
		padding: 1.5rem;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.featured-label {
		display: inline-block;
		width: fit-content;
		padding: 0.2rem 0.5rem;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.18);
		color: #fff;
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 0.25rem;
		margin-bottom: 0.25rem;
	}

	.featured-person-name {
		font-size: 1.375rem;
		font-weight: 700;
		color: #fff;
		text-transform: capitalize;
		transition: color 0.2s ease;
		line-height: 1.3;
	}

	.featured-person-type {
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.82);
		font-weight: 500;
	}

	.recency-badge {
		display: inline-block;
		width: fit-content;
		padding: 0.125rem 0.5rem;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.18);
		color: rgba(255, 255, 255, 0.92);
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 0.25rem;

		&.new {
			background: color-mix(in srgb, var(--primary) 28%, transparent);
			color: #fff;
		}
	}

	/* Recently Updated Section */
	.recent-section {
		margin-bottom: 3rem;
	}

	.recent-people-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.recent-person-card {
		position: relative;
		aspect-ratio: 3 / 4;
		border-radius: 8px;
		overflow: hidden;
		background: var(--bg-surface);
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-sm);
		padding: 0.45rem;

		&:hover {
			transform: translateY(-3px);
			border-color: rgba(45, 212, 191, 0.35);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px rgba(45, 212, 191, 0.1);

			.recent-person-image img {
				transform: scale(1.05);
			}

			.recent-person-name {
				color: #fff;
			}
		}
	}

	.recent-person-image {
		position: absolute;
		inset: 0.45rem;
		border-radius: 8px;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 0.4s ease;
		}
	}

	.recent-person-overlay {
		position: absolute;
		inset: 0.45rem;
		border-radius: 8px;
		background: linear-gradient(
			to top,
			rgba(12, 10, 9, 0.96) 0%,
			rgba(12, 10, 9, 0.62) 50%,
			rgba(12, 10, 9, 0.16) 100%
		);
	}

	.recent-person-info {
		position: absolute;
		bottom: 0.45rem;
		left: 0.45rem;
		right: 0.45rem;
		padding: 0.75rem;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.recent-person-name {
		font-size: 0.9375rem;
		font-weight: 600;
		color: #fff;
		text-transform: capitalize;
		transition: color 0.2s ease;
		line-height: 1.3;
	}

	.recent-person-type {
		font-size: 0.6875rem;
		color: rgba(255, 255, 255, 0.82);
		font-weight: 500;
	}

	/* Signup Section */
	.signup-section {
		margin-top: 3rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		border-radius: 8px;
		border: 1px solid rgba(45, 212, 191, 0.2);
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

	/* Responsive */
	@media (max-width: 1024px) {
		.people-grid {
			grid-template-columns: repeat(4, 1fr);
		}

		.recent-people-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.featured-grid {
			grid-template-columns: 1fr;
		}

		.featured-person-card {
			aspect-ratio: 4 / 3;
		}

		.people-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.featured-header,
		.recent-header {
			flex-direction: row;
			align-items: center;
		}
	}

	@media (max-width: 640px) {
		.featured-section,
		.recent-section {
			margin-bottom: 2rem;
		}

		.featured-person-info {
			padding: 1rem;
		}

		.featured-person-name {
			font-size: 1.125rem;
		}

		.recent-people-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.625rem;
		}

		.recent-person-card {
			border-radius: 0.5rem;
		}

		.recent-person-name {
			font-size: 0.75rem;
		}

		.recent-person-info {
			padding: 0.5rem;
		}

		.hero {
			padding: 1.5rem 1rem 1rem;
		}

		.hero h1 {
			font-size: 1.5rem;
		}

		.hero-copy {
			font-size: 0.9rem;
		}

		.hero-actions {
			gap: 0.5rem;
		}

		.hero-link,
		.category-pill {
			padding: 0.5rem 0.75rem;
			font-size: 0.75rem;
		}

		.quick-nav {
			padding: 0.5rem 0;
		}

		.nav-scroll {
			padding: 0.375rem 1rem;
			gap: 0.375rem;
		}

		.nav-pill {
			padding: 0.4rem 0.75rem;
			font-size: 0.75rem;
			gap: 0.375rem;
			border-radius: 0.375rem;
		}

		.type-number {
			width: 1.25rem;
			height: 1.25rem;
			font-size: 0.65rem;
		}

		.type-name {
			display: none;
		}

		.main-content {
			padding: 1rem 1rem 2.5rem;
		}

		.type-section {
			margin-bottom: 2.5rem;
			scroll-margin-top: 70px;
		}

		.section-header {
			gap: 0.75rem;
			margin-bottom: 1rem;
			padding-bottom: 0.5rem;
		}

		.type-badge {
			width: 2.25rem;
			height: 2.25rem;
			border-radius: 0.5rem;
		}

		.type-num {
			font-size: 1.125rem;
		}

		.section-info h2 {
			font-size: 1.0625rem;
		}

		.type-tagline {
			font-size: 0.75rem;
		}

		.people-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.625rem;
		}

		.person-card {
			border-radius: 0.5rem;
		}

		.person-name {
			font-size: 0.6875rem;
		}

		.person-info {
			padding: 0.5rem;
		}

		.view-all-text {
			font-size: 0.75rem;
		}

		.signup-section {
			padding: 1.5rem 1.25rem;
			border-radius: 8px;
			margin-top: 2rem;
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1.25rem;
		}

		.nav-scroll {
			padding: 0.25rem 0.75rem;
		}

		.nav-pill {
			padding: 0.35rem 0.625rem;
			gap: 0;
		}

		.type-number {
			width: 1.375rem;
			height: 1.375rem;
			font-size: 0.7rem;
		}

		.people-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.person-name {
			font-size: 0.625rem;
		}

		.person-info {
			padding: 0.375rem;
		}

		.view-all-text {
			font-size: 0.6875rem;
		}
	}
</style>
