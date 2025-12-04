<!-- src/routes/personality-analysis/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: PageData;

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

	function formatName(slug: string) {
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			"mainEntity": {
				"@type": "ItemList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Enneagram Type 1 Personalities",
						"url": "https://9takes.com/personality-analysis/type/1"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Enneagram Type 2 Personalities",
						"url": "https://9takes.com/personality-analysis/type/2"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Enneagram Type 3 Personalities",
						"url": "https://9takes.com/personality-analysis/type/3"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Enneagram Type 4 Personalities",
						"url": "https://9takes.com/personality-analysis/type/4"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Enneagram Type 5 Personalities",
						"url": "https://9takes.com/personality-analysis/type/5"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Enneagram Type 6 Personalities",
						"url": "https://9takes.com/personality-analysis/type/6"
					},
					{
						"@type": "ListItem",
						"position": 7,
						"name": "Enneagram Type 7 Personalities",
						"url": "https://9takes.com/personality-analysis/type/7"
					},
					{
						"@type": "ListItem",
						"position": 8,
						"name": "Enneagram Type 8 Personalities",
						"url": "https://9takes.com/personality-analysis/type/8"
					},
					{
						"@type": "ListItem",
						"position": 9,
						"name": "Enneagram Type 9 Personalities",
						"url": "https://9takes.com/personality-analysis/type/9"
					}
				]
			},
			"name": "Famous Personality Analysis | Character Studies",
			"description": "In-depth Enneagram-based personality analyses of influential figures across music, film, politics, tech, and history.",
			"url": "https://9takes.com/personality-analysis",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			}
		}
	</script>
</svelte:head>

<SEOHead
	title="Famous People Personality Analysis | Enneagram Character Studies | 9takes"
	description="Explore in-depth Enneagram-based personality analyses of celebrities, historical figures, and influential people. Understand what drives the world's most fascinating personalities."
	canonical="https://9takes.com/personality-analysis"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/personality-analysis-card.webp"
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'celebrity personality types, famous enneagram types, personality analysis, character studies, celebrity psychology'
		},
		{ name: 'author', content: '9takes' }
	]}
/>

<div class="page-wrapper">
	<!-- Hero Section -->
	<header class="hero">
		<h1>Famous Personality Analysis</h1>
	</header>

	<!-- Quick Type Navigation -->
	<nav class="quick-nav" aria-label="Type Navigation">
		<div class="nav-scroll">
			{#each Array.from({ length: 9 }, (_, i) => i + 1) as typeNum}
				<a href="#type-{typeNum}" class="nav-pill">
					<span class="type-number">{typeNum}</span>
					<span class="type-name">{typeNames[typeNum].name.replace('The ', '')}</span>
				</a>
			{/each}
		</div>
	</nav>

	<main class="main-content">
		<!-- Type Sections -->
		{#each Array.from({ length: 9 }, (_, i) => i + 1) as typeNum}
			{@const typePeople = data.people.filter((p) => parseInt(p.enneagram) === typeNum)}
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
						<a href="/personality-analysis/type/{typeNum}" class="view-all-link">
							View all Type {typeNum}s
							<ArrowRightIcon
								iconStyle={'margin-left: 0.25rem'}
								height={'1rem'}
								fill={'currentColor'}
							/>
						</a>
					</div>

					<div class="people-grid">
						{#each typePeople.slice(0, 5) as person}
							<a
								href="/personality-analysis/{person.slug}"
								class="person-card"
								aria-label="Read analysis of {formatName(person.slug)}"
							>
								<div class="person-image">
									<img
										src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
										alt={formatName(person.slug)}
										loading="lazy"
										width="200"
										height="200"
									/>
								</div>
								<div class="person-info">
									<span class="person-name">{formatName(person.slug)}</span>
								</div>
							</a>
						{/each}
						<a
							href="/personality-analysis/type/{typeNum}"
							class="person-card view-all-card"
							aria-label="View all Type {typeNum} personalities"
						>
							<div class="view-all-content">
								<span class="view-all-text">All Type {typeNum}s</span>
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
	.page-wrapper {
		min-height: 100vh;

		a::after {
			display: none !important;
		}
	}

	/* Hero Section - Compact */
	.hero {
		background: var(--darkest-gray);
		padding: 0.75rem 1rem;
		text-align: center;
		color: white;
	}

	.hero h1 {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1;
		margin: 0;
		letter-spacing: -0.01em;
	}

	/* Quick Navigation */
	.quick-nav {
		background: var(--card-background);
		border-bottom: 1px solid var(--border-color);
		padding: 1rem 1.5rem;
		position: sticky;
		top: 60px;
		z-index: 30;
	}

	.nav-scroll {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		max-width: 1200px;
		margin: 0 auto;
		padding-bottom: 0.25rem;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.nav-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--lightest-gray);
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid transparent;

		&:hover {
			background: var(--darkest-gray);
			color: white;
			border-color: var(--darkest-gray);
			transform: translateY(-1px);

			.type-number {
				background: white;
				color: var(--darkest-gray);
			}
		}
	}

	.type-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		background: var(--darkest-gray);
		color: white;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 700;
		transition: all 0.2s ease;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	/* Type Sections */
	.type-section {
		margin-bottom: 4rem;
		scroll-margin-top: 120px;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.type-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		background: var(--darkest-gray);
		border-radius: 12px;
		flex-shrink: 0;
	}

	.type-num {
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
	}

	.section-info {
		flex: 1;
		min-width: 200px;

		h2 {
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text-primary);
			margin: 0;
			line-height: 1.3;
		}
	}

	.type-tagline {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0.25rem 0 0;
	}

	.view-all-link {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s ease;
		white-space: nowrap;

		&:hover {
			color: var(--text-primary);
		}
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
		border-radius: 12px;
		overflow: hidden;
		background: var(--lightest-gray);
		text-decoration: none;
		transition: all 0.3s ease;
		border: 1px solid var(--border-color);

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
			border-color: var(--darkest-gray);

			.person-image img {
				transform: scale(1.05);
			}

			.person-info {
				background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 100%);
			}
		}
	}

	.person-image {
		position: absolute;
		inset: 0;
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
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.75rem;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 100%);
		transition: background 0.3s ease;
	}

	.person-name {
		display: block;
		font-size: 0.85rem;
		font-weight: 600;
		color: white;
		text-align: center;
		text-transform: capitalize;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* View All Card */
	.view-all-card {
		background: linear-gradient(135deg, var(--darkest-gray) 0%, var(--black) 100%);
		border: 1px solid rgba(255, 255, 255, 0.1);

		&:hover {
			background: linear-gradient(135deg, var(--dark-gray) 0%, var(--darkest-gray) 100%);
			border-color: rgba(255, 255, 255, 0.3);
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
		color: white;
		transition: color 0.3s ease;
	}

	.view-all-text {
		font-size: 0.9rem;
		font-weight: 600;
	}

	/* Signup Section */
	.signup-section {
		margin-top: 3rem;
		padding: 2rem;
		background: var(--lightest-gray);
		border-radius: 16px;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.people-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 768px) {
		.people-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.view-all-link {
			margin-top: 0.5rem;
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 0.5rem 0.75rem;
		}

		.hero h1 {
			font-size: 1.1rem;
		}

		.quick-nav {
			padding: 0.5rem 0.75rem;
			top: 56px;
		}

		.nav-pill {
			padding: 0.4rem 0.6rem;
			font-size: 0.75rem;
			gap: 0.35rem;
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
			padding: 1rem 0.75rem 2rem;
		}

		.type-section {
			margin-bottom: 2rem;
			scroll-margin-top: 100px;
		}

		.section-header {
			gap: 0.75rem;
			margin-bottom: 1rem;
		}

		.type-badge {
			width: 2.25rem;
			height: 2.25rem;
			border-radius: 8px;
		}

		.type-num {
			font-size: 1.1rem;
		}

		.section-info h2 {
			font-size: 1.1rem;
		}

		.type-tagline {
			font-size: 0.75rem;
		}

		.view-all-link {
			font-size: 0.8rem;
		}

		.people-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.5rem;
		}

		.person-card {
			border-radius: 8px;
		}

		.person-name {
			font-size: 0.65rem;
		}

		.person-info {
			padding: 0.4rem;
		}

		.view-all-text {
			font-size: 0.75rem;
		}

		.signup-section {
			padding: 1.25rem 1rem;
			border-radius: 12px;
			margin-top: 2rem;
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1rem;
		}

		.people-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.4rem;
		}

		.person-name {
			font-size: 0.6rem;
		}

		.view-all-text {
			font-size: 0.7rem;
		}
	}
</style>
