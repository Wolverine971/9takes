<!-- src/routes/enneagram-corner/mental-health/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';

	export let data: PageData;

	const hubDescription = `Explore the intersection of Enneagram personality types and mental health. Our comprehensive guides help you understand how each type experiences anxiety, depression, trauma, and other mental health challenges, with tailored strategies for healing and growth.`;

	const navItems = [
		{ id: 'why', title: 'Why It Matters', icon: '💡' },
		{ id: 'guides', title: 'Guides', icon: '📚' },
		{ id: 'by-type', title: 'By Type', icon: '🔢' }
	];

	const categories = [
		{
			title: 'Core Mental Health Guides',
			description: 'Essential resources for understanding mental health through the Enneagram lens',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-and-mental-illness') ||
					blog.slug?.includes('enneagram-anxiety-complete-guide') ||
					blog.slug?.includes('enneagram-therapy-guide')
			)
		},
		{
			title: 'Trauma & Crisis Support',
			description: 'Resources for healing, crisis management, and building resilience',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-trauma-response-guide') ||
					blog.slug?.includes('enneagram-crisis-management-guide')
			)
		},
		{
			title: 'Specialized Topics',
			description: 'In-depth guides on specific mental health areas',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-addiction-recovery-guide') ||
					blog.slug?.includes('enneagram-neurodivergence-guide') ||
					blog.slug?.includes('enneagram-medication-mental-health')
			)
		},
		{
			title: 'Life Stage & Environmental',
			description: 'Mental health across different life contexts',
			blogs: data.mentalHealthBlogs.filter(
				(blog) =>
					blog.slug?.includes('enneagram-parenting-mental-health') ||
					blog.slug?.includes('enneagram-workplace-mental-health')
			)
		},
		{
			title: 'Research & Science',
			description: 'Evidence-based insights and scientific findings',
			blogs: data.mentalHealthBlogs.filter((blog) =>
				blog.slug?.includes('enneagram-science-mental-health')
			)
		}
	];

	const typeData = [
		{
			vulnerabilities: [
				'Anxiety disorders',
				'Obsessive-compulsive tendencies',
				'Perfectionism-related depression'
			],
			strengths: [
				'Strong commitment to recovery',
				'Systematic approach to healing',
				'High integrity in treatment'
			]
		},
		{
			vulnerabilities: ['Codependency', 'Boundary issues', 'Caregiver burnout'],
			strengths: [
				'Natural support network building',
				'Emotional intelligence',
				'Helping others aids own healing'
			]
		},
		{
			vulnerabilities: [
				'Workaholism and burnout',
				'Identity-based depression',
				'Stress-related health issues'
			],
			strengths: ['Goal-oriented recovery', 'Resilience and adaptability', 'Success-driven healing']
		},
		{
			vulnerabilities: ['Major depression', 'Emotional dysregulation', 'Identity disturbances'],
			strengths: [
				'Deep self-awareness',
				'Creative expression for healing',
				'Authenticity in recovery'
			]
		},
		{
			vulnerabilities: ['Social anxiety', 'Avoidant patterns', 'Dissociation'],
			strengths: [
				'Research-based approach',
				'Self-sufficiency in healing',
				'Intellectual understanding aids recovery'
			]
		},
		{
			vulnerabilities: ['Generalized anxiety disorder', 'Phobias', 'Hypervigilance'],
			strengths: [
				'Loyalty to support systems',
				'Thorough treatment planning',
				'Community-oriented recovery'
			]
		},
		{
			vulnerabilities: ['ADHD-like symptoms', 'Addiction vulnerabilities', 'Masked depression'],
			strengths: [
				'Optimistic recovery outlook',
				'Multiple healing modalities',
				'Enthusiasm for growth'
			]
		},
		{
			vulnerabilities: [
				'Anger management issues',
				'Vulnerability avoidance',
				'Stress-related illness'
			],
			strengths: ['Strong determination', 'Leadership in recovery', 'Protective of healing space']
		},
		{
			vulnerabilities: ['Clinical depression', 'Dissociative tendencies', 'Chronic fatigue'],
			strengths: [
				'Holistic healing approach',
				'Natural mediator in groups',
				'Steady, sustainable recovery'
			]
		}
	];
</script>

<SEOHead
	title="Enneagram and Mental Health Hub | 9takes"
	description={hubDescription}
	canonical="https://9takes.com/enneagram-corner/mental-health"
/>

<div class="page-wrapper">
	<!-- Hero Section -->
	<header class="hero">
		<h1>Enneagram & Mental Health</h1>
	</header>

	<!-- Quick Navigation -->
	<nav class="quick-nav" aria-label="Topic Navigation">
		<div class="nav-scroll">
			{#each navItems as item}
				<a href="#{item.id}" class="nav-pill">
					<span class="nav-icon">{item.icon}</span>
					<span class="nav-text">{item.title}</span>
				</a>
			{/each}
			{#each Array(9) as _, i}
				<a href="#type-{i + 1}" class="nav-pill type-pill">
					<span class="type-num">{i + 1}</span>
				</a>
			{/each}
		</div>
	</nav>

	<main class="main-content">
		<!-- Crisis Banner -->
		<section class="crisis-banner">
			<strong>If you're in crisis, please reach out:</strong>
			<div class="crisis-contacts">
				<span>988 (Suicide Prevention)</span>
				<span>Text HOME to 741741</span>
				<span>911 (Emergency)</span>
			</div>
		</section>

		<!-- Why It Matters Section -->
		<section class="content-section" id="why">
			<div class="section-header">
				<div class="section-title-group">
					<span class="section-icon">💡</span>
					<div>
						<h2>Why Personality Type Matters</h2>
						<p class="section-subtitle">Personalized approaches to mental wellness</p>
					</div>
				</div>
			</div>

			<div class="benefits-grid">
				<div class="benefit-card">
					<h3>Personalized Understanding</h3>
					<p>Each type has unique mental health vulnerabilities and strengths.</p>
				</div>
				<div class="benefit-card">
					<h3>Targeted Strategies</h3>
					<p>Find coping strategies tailored to your personality.</p>
				</div>
				<div class="benefit-card">
					<h3>Earlier Recognition</h3>
					<p>Recognize warning signs before they escalate.</p>
				</div>
				<div class="benefit-card">
					<h3>Better Outcomes</h3>
					<p>Type-aware therapy leads to more effective treatment.</p>
				</div>
			</div>
		</section>

		<!-- Guide Categories -->
		<section class="content-section" id="guides">
			<div class="section-header">
				<div class="section-title-group">
					<span class="section-icon">📚</span>
					<div>
						<h2>Mental Health Guides</h2>
						<p class="section-subtitle">Comprehensive resources by topic</p>
					</div>
				</div>
			</div>

			{#each categories.filter((c) => c.blogs.length > 0) as category}
				<div class="category-block">
					<h3 class="category-title">{category.title}</h3>
					<p class="category-desc">{category.description}</p>
					<div class="blog-grid">
						{#each category.blogs as blog}
							{@const blogPath =
								blog.loc?.replace('https://9takes.com', '') ||
								`/enneagram-corner/mental-health/${blog.slug}`}
							<a href={blogPath} class="blog-card">
								<div class="card-overlay"></div>
								<div class="card-content">
									<h4>{blog.title}</h4>
									<p>{blog.description}</p>
									<span class="read-link">Read Guide</span>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</section>

		<!-- By Type Section -->
		<section class="content-section" id="by-type">
			<div class="section-header">
				<div class="section-title-group">
					<span class="section-icon">🔢</span>
					<div>
						<h2>Resources by Type</h2>
						<p class="section-subtitle">Find guidance specific to your personality</p>
					</div>
				</div>
			</div>

			{#each Array(9) as _, i}
				{@const typeNum = i + 1}
				<div class="type-block" id="type-{typeNum}">
					<div class="type-header">
						<span class="type-badge">{typeNum}</span>
						<h3>Type {typeNum} Mental Health</h3>
					</div>
					<div class="type-content">
						<div class="type-column">
							<h4>Common Vulnerabilities</h4>
							<ul>
								{#each typeData[i].vulnerabilities as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
						<div class="type-column">
							<h4>Healing Strengths</h4>
							<ul>
								{#each typeData[i].strengths as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/each}
		</section>

		<!-- CTA Section -->
		<section class="cta-section">
			<div class="cta-content">
				<h2>Start your mental health journey</h2>
				<p>Understanding your type is the first step toward personalized care.</p>
				<div class="cta-buttons">
					<a
						href="/enneagram-corner/mental-health/enneagram-anxiety-complete-guide"
						class="btn-primary">Read Anxiety Guide</a
					>
					<a href="/questions" class="btn-secondary">Discover Your Type</a>
				</div>
			</div>
		</section>
	</main>
</div>

<style lang="scss">
	.page-wrapper {
		min-height: 100vh;
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 1rem;
		text-align: center;
	}

	.hero h1 {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		color: var(--text-primary);
	}

	/* Quick Navigation */
	.quick-nav {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 1.5rem;
	}

	.nav-scroll {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		padding-bottom: 0.25rem;
		scrollbar-width: none;
		justify-content: center;
		flex-wrap: wrap;

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
		}
	}

	.type-pill {
		padding: 0.5rem 0.75rem;
	}

	.type-num {
		font-weight: 700;
		font-size: 0.875rem;
	}

	.nav-icon {
		font-size: 1rem;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	/* Crisis Banner */
	.crisis-banner {
		background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
		color: white;
		padding: 1rem 1.5rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		text-align: center;

		strong {
			display: block;
			margin-bottom: 0.5rem;
			font-size: 0.9rem;
		}
	}

	.crisis-contacts {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
		font-size: 0.85rem;
		font-weight: 600;
	}

	/* Content Sections */
	.content-section {
		margin-bottom: 3rem;
		scroll-margin-top: 120px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.section-title-group {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.section-icon {
		font-size: 1.5rem;
		margin-top: 0.25rem;
	}

	.section-title-group h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0.25rem 0 0;
	}

	/* Benefits Grid */
	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.benefit-card {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 1.25rem;
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}

		h3 {
			font-size: 0.95rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0 0 0.5rem;
		}

		p {
			font-size: 0.8rem;
			color: var(--text-secondary);
			margin: 0;
			line-height: 1.5;
		}
	}

	/* Category Blocks */
	.category-block {
		margin-bottom: 2rem;
	}

	.category-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.25rem;
	}

	.category-desc {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0 0 1rem;
	}

	/* Blog Grid */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.blog-card {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 12px;
		overflow: hidden;
		background: linear-gradient(135deg, var(--darkest-gray) 0%, var(--black) 100%);
		text-decoration: none;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
		}
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(42, 45, 52, 0.9) 0%, rgba(24, 25, 26, 0.9) 100%);
	}

	.card-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.25rem;
		color: white;

		h4 {
			font-size: 1rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.8rem;
			line-height: 1.5;
			opacity: 0.85;
			margin: 0.5rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.read-link {
			font-size: 0.75rem;
			font-weight: 600;
			opacity: 0.8;
			margin-top: 0.5rem;
		}
	}

	/* Type Blocks */
	.type-block {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		scroll-margin-top: 120px;
	}

	.type-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;

		h3 {
			font-size: 1.1rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0;
		}
	}

	.type-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: var(--darkest-gray);
		color: white;
		border-radius: 8px;
		font-weight: 700;
		font-size: 1rem;
	}

	.type-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.type-column {
		h4 {
			font-size: 0.9rem;
			font-weight: 600;
			color: var(--text-primary);
			margin: 0 0 0.75rem;
		}

		ul {
			list-style: disc;
			padding-left: 1.25rem;
			margin: 0;
		}

		li {
			font-size: 0.85rem;
			color: var(--text-secondary);
			margin-bottom: 0.5rem;
			line-height: 1.4;
		}
	}

	/* CTA Section */
	.cta-section {
		background: linear-gradient(135deg, var(--darkest-gray) 0%, var(--black) 100%);
		border-radius: 20px;
		padding: 3rem 2rem;
		text-align: center;
		color: white;
	}

	.cta-content {
		max-width: 600px;
		margin: 0 auto;

		h2 {
			font-size: 1.75rem;
			font-weight: 700;
			margin: 0 0 1rem;
		}

		p {
			font-size: 1rem;
			opacity: 0.85;
			line-height: 1.6;
			margin: 0 0 2rem;
		}
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		padding: 0.875rem 1.5rem;
		background: white;
		color: var(--darkest-gray);
		font-weight: 600;
		font-size: 0.9rem;
		border-radius: 2rem;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: var(--lightest-gray);
			transform: translateY(-2px);
		}
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		padding: 0.875rem 1.5rem;
		background: transparent;
		color: white;
		font-weight: 600;
		font-size: 0.9rem;
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(255, 255, 255, 0.1);
			border-color: rgba(255, 255, 255, 0.5);
		}
	}

	/* Responsive */
	@media (max-width: 900px) {
		.benefits-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: 1.25rem 0.75rem 0.75rem;
		}

		.hero h1 {
			font-size: 1.35rem;
		}

		.quick-nav {
			padding: 0 0.75rem 1rem;
		}

		.nav-pill {
			padding: 0.4rem 0.75rem;
			font-size: 0.75rem;
		}

		.nav-icon {
			font-size: 0.875rem;
		}

		.nav-text {
			display: none;
		}

		.main-content {
			padding: 1rem 0.75rem 2rem;
		}

		.crisis-banner {
			padding: 0.75rem 1rem;
			font-size: 0.85rem;
		}

		.crisis-contacts {
			gap: 0.75rem;
			font-size: 0.75rem;
		}

		.content-section {
			margin-bottom: 2rem;
			scroll-margin-top: 100px;
		}

		.section-header {
			margin-bottom: 1rem;
		}

		.section-icon {
			font-size: 1.25rem;
		}

		.section-title-group h2 {
			font-size: 1.1rem;
		}

		.section-subtitle {
			font-size: 0.8rem;
		}

		.benefits-grid {
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
		}

		.benefit-card {
			padding: 1rem;

			h3 {
				font-size: 0.85rem;
			}

			p {
				font-size: 0.75rem;
			}
		}

		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.blog-card {
			aspect-ratio: 1;
			border-radius: 8px;
		}

		.card-content {
			padding: 0.75rem;

			h4 {
				font-size: 0.8rem;
			}

			p,
			.read-link {
				display: none;
			}
		}

		.type-block {
			padding: 1rem;
		}

		.type-content {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.cta-section {
			padding: 1.5rem 1rem;
			border-radius: 12px;
		}

		.cta-content h2 {
			font-size: 1.25rem;
		}

		.cta-content p {
			font-size: 0.875rem;
			margin-bottom: 1.5rem;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: center;
			gap: 0.75rem;
		}

		.btn-primary,
		.btn-secondary {
			padding: 0.75rem 1.25rem;
			font-size: 0.85rem;
			width: 100%;
			justify-content: center;
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1.2rem;
		}

		.benefits-grid {
			grid-template-columns: 1fr;
		}

		.blog-grid {
			gap: 0.4rem;
		}

		.card-content {
			padding: 0.5rem;

			h4 {
				font-size: 0.7rem;
			}
		}
	}
</style>
