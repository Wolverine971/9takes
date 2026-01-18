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
	/* Solo Leveling Dark Theme - Personality Analysis */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);

		a::after {
			display: none !important;
		}
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
		background: radial-gradient(ellipse, rgba(124, 58, 237, 0.12) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Quick Navigation */
	.quick-nav {
		background: linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(10, 10, 15, 0.95) 100%);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(124, 58, 237, 0.15);
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
		background: rgba(26, 26, 46, 0.6);
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #94a3b8;
		white-space: nowrap;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid rgba(100, 116, 139, 0.2);
		flex-shrink: 0;

		&:hover {
			background: rgba(124, 58, 237, 0.15);
			color: #a78bfa;
			border-color: rgba(124, 58, 237, 0.4);
			transform: translateY(-1px);

			.type-number {
				background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
				color: white;
				box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
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
		background: #252538;
		color: #a78bfa;
		border-radius: 50%;
		font-size: 0.75rem;
		font-weight: 700;
		transition: all 0.2s ease;
	}

	.type-name {
		letter-spacing: -0.01em;
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
		border-bottom: 1px solid rgba(100, 116, 139, 0.15);
		flex-wrap: wrap;
	}

	.type-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border-radius: 0.625rem;
		flex-shrink: 0;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.25);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: -1px;
			border-radius: 0.75rem;
			background: linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, transparent 50%);
			z-index: -1;
		}
	}

	.type-num {
		font-size: 1.375rem;
		font-weight: 700;
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.section-info {
		flex: 1;
		min-width: 200px;

		h2 {
			font-size: 1.25rem;
			font-weight: 600;
			color: #f1f5f9;
			margin: 0;
			line-height: 1.3;
		}
	}

	.type-tagline {
		font-size: 0.8125rem;
		color: #64748b;
		margin: 0.125rem 0 0;
	}

	.view-all-link {
		display: flex;
		align-items: center;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #64748b;
		text-decoration: none;
		transition: all 0.2s ease;
		white-space: nowrap;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid transparent;

		&:hover {
			color: #a78bfa;
			background: rgba(124, 58, 237, 0.1);
			border-color: rgba(124, 58, 237, 0.2);
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
		border-radius: 0.75rem;
		overflow: hidden;
		background: #16161e;
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid rgba(100, 116, 139, 0.15);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: rgba(124, 58, 237, 0.35);
			box-shadow:
				0 12px 28px rgba(0, 0, 0, 0.35),
				0 0 0 1px rgba(124, 58, 237, 0.1);

			&::before {
				opacity: 1;
			}

			.person-image img {
				transform: scale(1.08);
			}

			.person-info {
				background: linear-gradient(to top, rgba(10, 10, 15, 1) 0%, rgba(10, 10, 15, 0.85) 100%);
			}

			.person-name {
				color: #a78bfa;
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
		background: linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.6) 100%);
		transition: background 0.3s ease;
		z-index: 2;
	}

	.person-name {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #e2e8f0;
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
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border: 1px solid rgba(100, 116, 139, 0.2);

		&::before {
			display: none;
		}

		&:hover {
			background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, #1a1a2e 100%);
			border-color: rgba(124, 58, 237, 0.5);
			box-shadow:
				0 8px 24px rgba(0, 0, 0, 0.3),
				0 0 30px rgba(124, 58, 237, 0.15);

			.view-all-content {
				color: #c4b5fd;
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
		color: #a78bfa;
		transition: color 0.25s ease;
	}

	.view-all-text {
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	/* Signup Section */
	.signup-section {
		margin-top: 3rem;
		padding: 2rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border-radius: 1rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
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
			background: radial-gradient(ellipse, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
			pointer-events: none;
		}
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
			margin-top: 0.25rem;
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 1.5rem 1rem 1rem;
		}

		.hero h1 {
			font-size: 1.5rem;
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

		.view-all-link {
			font-size: 0.75rem;
			padding: 0.25rem 0.5rem;
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
			border-radius: 0.75rem;
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
