<!-- src/routes/enneagram-corner/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { FAQItem } from '$lib/types/faq';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';

	let { data }: { data: PageData } = $props();

	function getRecencyLabel(lastmod: string): string | null {
		const days = Math.floor((Date.now() - new Date(lastmod).getTime()) / 86400000);
		if (days <= 3) return 'New';
		if (days <= 7) return 'This week';
		if (days <= 30) return 'This month';
		return null;
	}

	// FAQ data for SEO and user engagement
	const enneagramFAQs: FAQItem[] = [
		{
			question: 'What is the Enneagram personality system?',
			answer:
				'The Enneagram is a personality framework describing 9 interconnected types, each driven by distinct core fears, desires, and motivations. Unlike behavioral tests, it reveals WHY you act the way you do, not just what you do. Each type has predictable patterns of thinking, feeling, and responding to stress.'
		},
		{
			question: 'How do I find my Enneagram type?',
			answer:
				'Start by reading descriptions of all 9 types and notice which core fear resonates most deeply. Focus on motivation, not behavior. Many people mistype initially because they identify with healthy traits of other types. Consider taking a validated assessment and exploring how you respond under stress.'
		},
		{
			question: 'How is the Enneagram different from MBTI?',
			answer:
				'MBTI categorizes how you process information and make decisions (cognitive functions). The Enneagram maps your core emotional drivers and unconscious patterns. MBTI describes what you do; Enneagram explains why. Many find the Enneagram more useful for personal growth and understanding relationship dynamics.'
		},
		{
			question: 'Can my Enneagram type change over time?',
			answer:
				'Your core type remains constant throughout life, as it forms in childhood. However, you can grow within your type, accessing healthier behaviors and integrating traits from other types. Growth means expanding beyond your automatic patterns, not becoming a different type.'
		},
		{
			question: 'What are Enneagram wings?',
			answer:
				'Wings are the two types adjacent to your core type on the Enneagram circle. Most people lean toward one wing more than the other, which adds flavor to their personality. For example, a Type 9 might have a stronger 8 wing (9w8) or 1 wing (9w1), each creating distinct subtypes.'
		},
		{
			question: 'Is the Enneagram scientifically validated?',
			answer:
				'Research on the Enneagram is growing but limited compared to other personality systems. Studies show reasonable reliability and validity for typing. Its value lies in practical application: understanding motivations, improving relationships, and guiding personal development rather than statistical prediction.'
		},
		{
			question: 'How can the Enneagram improve my relationships?',
			answer:
				'The Enneagram reveals why people react differently to the same situation. Understanding your partner\'s type helps you stop taking their behavior personally and communicate in ways that actually land. It transforms "they\'re being difficult" into "they need something different than I do."'
		}
	];

	const blogSections = [
		{
			id: 'nine-types',
			title: 'The 9 Types',
			subtitle: 'Core personality patterns',
			type: 'nine-types',
			linkTitle: 'All 9 Types',
			icon: '🎯'
		},
		{
			id: 'understanding',
			title: 'Foundations',
			subtitle: 'Master the fundamentals',
			type: 'overview',
			linkTitle: 'Core Concepts',
			icon: '📚'
		},
		{
			id: 'personal-development',
			title: 'Growth',
			subtitle: 'Transform yourself',
			type: 'development',
			linkTitle: 'Growth Strategies',
			icon: '🌱'
		},
		{
			id: 'relationships',
			title: 'Relationships',
			subtitle: 'Connect deeper',
			type: 'relationships',
			linkTitle: 'Relationship Insights',
			icon: '💜'
		},
		{
			id: 'mental-health',
			title: 'Mental Health',
			subtitle: 'Type-aware wellness',
			type: 'mental-health',
			linkTitle: 'Wellness Resources',
			icon: '🧠'
		},
		{
			id: 'workplace',
			title: 'Career',
			subtitle: 'Professional growth',
			type: 'workplace',
			linkTitle: 'Career Insights',
			icon: '💼'
		},
		{
			id: 'situations',
			title: 'Real Life',
			subtitle: 'Types in action',
			type: 'situational',
			linkTitle: 'Real-World Examples',
			icon: '🎭'
		},
		{
			id: 'resources',
			title: 'Resources',
			subtitle: 'Books & tools',
			type: 'resources',
			linkTitle: 'Resources',
			icon: '🔧'
		}
	];

	function formatBlogSlug(title: string) {
		return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	}
</script>

<svelte:head>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "CollectionPage",
					"mainEntity": {
						"@type": "ItemList",
						"itemListElement": [
							{
								"@type": "ListItem",
								"position": 1,
								"name": "The Nine Enneagram Types",
								"description": "Detailed information about each of the nine Enneagram personality types",
								"url": "https://9takes.com/enneagram-corner#nine-types"
							},
							{
								"@type": "ListItem",
								"position": 2,
								"name": "Understanding the Enneagram",
								"description": "Explore the basics and fundamentals of the Enneagram system",
								"url": "https://9takes.com/enneagram-corner#understanding"
							},
							{
								"@type": "ListItem",
								"position": 3,
								"name": "Personal Development",
								"description": "Learn how to apply Enneagram insights for personal growth",
								"url": "https://9takes.com/enneagram-corner#personal-development"
							},
							{
								"@type": "ListItem",
								"position": 4,
								"name": "Relationships",
								"description": "Understand how Enneagram types interact in relationships",
								"url": "https://9takes.com/enneagram-corner#relationships"
							},
							{
								"@type": "ListItem",
								"position": 5,
								"name": "Mental Health",
								"description": "Type-specific mental health resources and healing strategies",
								"url": "https://9takes.com/enneagram-corner#mental-health"
							},
							{
								"@type": "ListItem",
								"position": 6,
								"name": "Career & Workplace",
								"description": "Enneagram insights for professional development",
								"url": "https://9takes.com/enneagram-corner#workplace"
							},
							{
								"@type": "ListItem",
								"position": 7,
								"name": "Types in Real Life",
								"description": "How Enneagram types respond in various situations",
								"url": "https://9takes.com/enneagram-corner#situations"
							},
							{
								"@type": "ListItem",
								"position": 8,
								"name": "Resources",
								"description": "Curated Enneagram books, tools, and resources",
								"url": "https://9takes.com/enneagram-corner#resources"
							}
						]
					},
					"name": "Enneagram Corner: Your Guide to Personal Growth",
					"description": "Master the Enneagram personality system. Explore the nine types, personal development, relationships, and more.",
					"url": "https://9takes.com/enneagram-corner",
					"author": {
						"@type": "Organization",
						"name": "9takes",
						"url": "https://9takes.com"
					}
				},
				{
					"@type": "FAQPage",
					"mainEntity": [
						{
							"@type": "Question",
							"name": "What is the Enneagram personality system?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "The Enneagram is a personality framework describing 9 interconnected types, each driven by distinct core fears, desires, and motivations. Unlike behavioral tests, it reveals WHY you act the way you do, not just what you do. Each type has predictable patterns of thinking, feeling, and responding to stress."
							}
						},
						{
							"@type": "Question",
							"name": "How do I find my Enneagram type?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Start by reading descriptions of all 9 types and notice which core fear resonates most deeply. Focus on motivation, not behavior. Many people mistype initially because they identify with healthy traits of other types. Consider taking a validated assessment and exploring how you respond under stress."
							}
						},
						{
							"@type": "Question",
							"name": "How is the Enneagram different from MBTI?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "MBTI categorizes how you process information and make decisions (cognitive functions). The Enneagram maps your core emotional drivers and unconscious patterns. MBTI describes what you do; Enneagram explains why. Many find the Enneagram more useful for personal growth and understanding relationship dynamics."
							}
						},
						{
							"@type": "Question",
							"name": "Can my Enneagram type change over time?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Your core type remains constant throughout life, as it forms in childhood. However, you can grow within your type, accessing healthier behaviors and integrating traits from other types. Growth means expanding beyond your automatic patterns, not becoming a different type."
							}
						},
						{
							"@type": "Question",
							"name": "What are Enneagram wings?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Wings are the two types adjacent to your core type on the Enneagram circle. Most people lean toward one wing more than the other, which adds flavor to their personality. For example, a Type 9 might have a stronger 8 wing (9w8) or 1 wing (9w1), each creating distinct subtypes."
							}
						},
						{
							"@type": "Question",
							"name": "Is the Enneagram scientifically validated?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Research on the Enneagram is growing but limited compared to other personality systems. Studies show reasonable reliability and validity for typing. Its value lies in practical application: understanding motivations, improving relationships, and guiding personal development rather than statistical prediction."
							}
						},
						{
							"@type": "Question",
							"name": "How can the Enneagram improve my relationships?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "The Enneagram reveals why people react differently to the same situation. Understanding your partner's type helps you stop taking their behavior personally and communicate in ways that actually land. It transforms 'they're being difficult' into 'they need something different than I do.'"
							}
						}
					]
				}
			]
		}
	</script>
</svelte:head>

<SEOHead
	title="Enneagram Personality Guide: Complete Psychology System | 9takes"
	description="Master the Enneagram personality system. Discover your type among 9 distinct patterns, understand core motivations, break limiting patterns, and transform relationships."
	canonical="https://9takes.com/enneagram-corner"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/enneagram-corner-card.webp"
	additionalMeta={[
		{
			name: 'keywords',
			content:
				'enneagram, personality types, enneagram test, personality psychology, 9 types, self-improvement, personal growth'
		},
		{ name: 'author', content: '9takes' }
	]}
/>

<div class="page-wrapper">
	<!-- Hero Section -->
	<header class="hero">
		<h1>Enneagram Guide</h1>
	</header>

	<!-- Quick Navigation -->
	<nav class="quick-nav" aria-label="Topic Navigation">
		<div class="quick-nav-shell">
			<div class="quick-nav-intro">
				<div>
					<p class="quick-nav-kicker">Browse the guide</p>
					<h2>Jump straight to the topic you care about</h2>
				</div>
				<p class="quick-nav-description">
					Each section maps to a different angle of the Enneagram, from core theory to
					relationships, work, and mental health.
				</p>
			</div>

			<div class="nav-grid">
				{#each blogSections as section}
					<a href="#{section.id}" class="nav-pill">
						<span class="nav-icon-wrap" aria-hidden="true">
							<span class="nav-icon">{section.icon}</span>
						</span>
						<span class="nav-copy">
							<span class="nav-title">{section.title}</span>
							<span class="nav-subtitle">{section.subtitle}</span>
						</span>
						<span class="nav-arrow" aria-hidden="true">↘</span>
					</a>
				{/each}
			</div>
		</div>
	</nav>

	<main class="main-content">
		<!-- Featured Section -->
		{#if data.featured.length > 0}
			<section class="featured-section">
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-icon">🔥</span>
						<div>
							<h2>Featured</h2>
							<p class="section-subtitle">Most recently updated</p>
						</div>
					</div>
				</div>
				<div class="featured-grid">
					{#each data.featured as post (post.slug)}
						{@const label = getRecencyLabel(post.lastmod || post.date)}
						<a
							href="/enneagram-corner/{post.slug}"
							class="featured-card"
							class:has-image={post.pic}
						>
							{#if post.pic}
								<div
									class="featured-image"
									style={`background-image: url(/blogs/${post.pic}.webp);`}
								></div>
							{/if}
							<div class="featured-overlay"></div>
							<div class="featured-content">
								<div class="featured-meta">
									<div class="featured-badge">Featured</div>

									{#if label}
										<span class="recency-badge" class:new={label === 'New'}>{label}</span>
									{/if}
								</div>

								<h3>{post.title}</h3>
								{#if post.description}
									<p>{post.description}</p>
								{/if}
								<span class="read-more">
									Read Guide
									<ArrowRightIcon
										iconStyle={'margin-left: 0.25rem'}
										height={'1rem'}
										fill={'currentColor'}
									/>
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
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-icon">⚡</span>
						<div>
							<h2>Recently Updated</h2>
							<p class="section-subtitle">Fresh insights and revisions</p>
						</div>
					</div>
				</div>
				<div class="recent-grid">
					{#each data.recentlyUpdated as post (post.slug)}
						{@const label = getRecencyLabel(post.lastmod || post.date)}

						<a href="/enneagram-corner/{post.slug}" class="recent-card" class:has-image={post.pic}>
							{#if post.pic}
								<div
									class="card-image"
									style={`background-image: url(/blogs/s-${post.pic}.webp);`}
								></div>
							{/if}
							<div class="card-overlay"></div>
							<div class="card-content">
								{#if label}
									<span class="recency-badge" class:new={label === 'New'}>{label}</span>
								{/if}
								<h3>{post.title}</h3>
								{#if post.description}
									<p>{post.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Blog Sections -->
		{#each blogSections as section}
			<section class="content-section" id={section.id}>
				<div class="section-header">
					<div class="section-title-group">
						<span class="section-icon">{section.icon}</span>
						<div>
							<h2>{section.title}</h2>
							<p class="section-subtitle">{section.subtitle}</p>
						</div>
					</div>
					{#if section.type !== 'nine-types'}
						<a
							href="/enneagram-corner/{section.type === 'mental-health'
								? 'mental-health'
								: `subtopic/${section.type}`}"
							class="view-all-link"
						>
							View all
							<ArrowRightIcon
								iconStyle={'margin-left: 0.25rem'}
								height={'1rem'}
								fill={'currentColor'}
							/>
						</a>
					{/if}
				</div>

				<div class="blog-grid" class:nine-types-grid={section.type === 'nine-types'}>
					{#each data.enneagramBlogs
						.filter((blog) => blog.type?.[0] === section.type)
						.slice(0, section.type === 'nine-types' ? 9 : 6) as blog (blog.slug)}
						<a
							href="/enneagram-corner/{blog.slug}"
							class="blog-card"
							class:has-image={blog.pic}
							data-tag={`h-blog-${formatBlogSlug(blog.title)}`}
						>
							{#if blog.pic}
								<div
									class="card-image"
									style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
								></div>
							{/if}
							<div class="card-overlay"></div>
							<div class="card-content">
								<h3>{blog.title}</h3>
								{#if section.type !== 'nine-types' && blog.description}
									<p>{blog.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}

		<!-- FAQ Section -->
		<FAQSection faqs={enneagramFAQs} title="Enneagram Questions Answered" />

		<!-- CTA Section -->
		<section class="cta-section">
			<div class="cta-content">
				<h2>Ready to discover your type?</h2>
				<p>
					Start with our comprehensive guides to each of the 9 personality types, or learn the
					foundational concepts behind the Enneagram system.
				</p>
				<div class="cta-buttons">
					<a href="/enneagram-corner/subtopic/nine-types" class="btn-primary">
						Explore All 9 Types
					</a>
					<a href="/enneagram-corner/subtopic/overview" class="btn-secondary"> Learn the Basics </a>
				</div>
			</div>
		</section>
	</main>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme - Enneagram Corner */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
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
		width: 300px;
		height: 150px;
		background: radial-gradient(ellipse, rgba(45, 212, 191, 0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		color: var(--text-primary);
		position: relative;
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Quick Navigation */
	.quick-nav {
		max-width: 1200px;
		margin: 0 auto 1.5rem;
		padding: 0 1.5rem;
	}

	.quick-nav-shell {
		position: relative;
		padding: 1.35rem;
		border-radius: 1.25rem;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--glass-border));
		background:
			radial-gradient(circle at top left, rgba(45, 212, 191, 0.14), transparent 34%),
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--bg-surface) 90%, white) 0%,
				color-mix(in srgb, var(--bg-base) 94%, var(--primary-subtle)) 100%
			);
		box-shadow:
			var(--shadow-sm),
			inset 0 1px 0 rgba(255, 255, 255, 0.25);
		overflow: hidden;
	}

	.quick-nav-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 28%),
			linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
		background-size:
			auto,
			22px 22px,
			22px 22px;
		pointer-events: none;
		opacity: 0.75;
	}

	.quick-nav-intro {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--primary) 12%, var(--border-color));
	}

	.quick-nav-kicker {
		margin: 0 0 0.45rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--primary);
	}

	.quick-nav-intro h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--text-primary);
	}

	.quick-nav-description {
		margin: 0;
		max-width: 32rem;
		font-size: 0.875rem;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.nav-grid {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.nav-pill {
		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 0.85rem;
		min-height: 5.25rem;
		padding: 1rem 2.9rem 1rem 1rem;
		background: color-mix(in srgb, var(--bg-base) 88%, white);
		border-radius: 1rem;
		color: var(--text-secondary);
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid color-mix(in srgb, var(--primary) 12%, var(--border-color));
		box-shadow:
			0 0 0 1px rgba(255, 255, 255, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.18);
		overflow: hidden;
	}

	.nav-pill::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--primary-subtle) 90%, transparent) 0%,
			transparent 65%
		);
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}

	.nav-pill:hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--primary) 28%, transparent);
		box-shadow:
			var(--shadow-md),
			0 0 0 1px color-mix(in srgb, var(--primary) 14%, transparent);
		background: color-mix(in srgb, var(--bg-surface) 92%, white);
	}

	.nav-pill:hover::before {
		opacity: 1;
	}

	.nav-pill:active {
		transform: scale(0.985);
	}

	.nav-icon-wrap,
	.nav-copy,
	.nav-arrow {
		position: relative;
		z-index: 1;
	}

	.nav-icon-wrap {
		width: 2.85rem;
		height: 2.85rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.85rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--primary-subtle) 75%, white) 0%,
			rgba(255, 255, 255, 0.72) 100%
		);
		border: 1px solid color-mix(in srgb, var(--primary) 16%, transparent);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	.nav-icon {
		font-size: 1.1rem;
		line-height: 1;
	}

	.nav-copy {
		display: flex;
		flex-direction: column;
		gap: 0.18rem;
		min-width: 0;
	}

	.nav-title {
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--text-primary);
	}

	.nav-subtitle {
		font-size: 0.74rem;
		line-height: 1.45;
		color: var(--text-tertiary);
	}

	.nav-arrow {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 1rem;
		color: var(--primary);
		opacity: 0.72;
		transform: translate(0, 0);
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.nav-pill:hover .nav-title {
		color: var(--primary);
	}

	.nav-pill:hover .nav-arrow {
		opacity: 1;
		transform: translate(2px, -2px);
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 4rem;
	}

	/* Content Sections */
	.content-section {
		margin-bottom: 3.5rem;
		scroll-margin-top: 80px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
		gap: 1rem;
	}

	.section-title-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.section-icon {
		font-size: 1.25rem;
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(45, 212, 191, 0.1);
		border-radius: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
	}

	.section-title-group h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin: 0.125rem 0 0;
	}

	.view-all-link {
		display: flex;
		align-items: center;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-tertiary);
		text-decoration: none;
		transition: all 0.2s ease;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid transparent;

		&:hover {
			color: var(--accent-light);
			background: rgba(45, 212, 191, 0.1);
			border-color: rgba(45, 212, 191, 0.2);
		}
	}

	/* Blog Grid */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.nine-types-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	/* Blog Cards - Refined */
	.blog-card {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--bg-surface);
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid var(--border-color);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: color-mix(in srgb, var(--primary) 30%, transparent);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px var(--primary-subtle);

			&::before {
				opacity: 1;
			}

			.card-image {
				transform: scale(1.05);
			}

			.card-content h3 {
				color: var(--accent-light);
			}
		}

		&.has-image {
			.card-content {
				color: #fff;
			}
			.card-content h3 {
				color: #fff;
			}
			.card-content p {
				color: rgba(255, 255, 255, 0.8);
			}
			.card-overlay {
				background: linear-gradient(
					to top,
					rgba(10, 10, 15, 0.95) 0%,
					rgba(10, 10, 15, 0.6) 40%,
					rgba(10, 10, 15, 0.3) 100%
				);
			}
		}
	}

	.card-image {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		transition: transform 0.4s ease;
	}

	.card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--bg-deep) 0%, var(--bg-base) 100%);
	}

	.card-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1rem;
		color: var(--text-primary);

		h3 {
			font-size: 0.9375rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			color: var(--text-primary);
			transition: color 0.2s ease;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.75rem;
			line-height: 1.5;
			color: var(--text-secondary);
			margin: 0.375rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	/* Featured Section */
	.featured-section {
		margin-bottom: 3rem;
	}

	.featured-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.25rem;
	}

	.featured-card {
		position: relative;
		min-height: 280px;
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--bg-surface);
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid color-mix(in srgb, var(--primary) 18%, var(--border-color));
		box-shadow: var(--shadow-sm);
		padding: 0.45rem;

		&::before {
			content: '';
			position: absolute;
			inset: 0.45rem;
			border-radius: 0.8rem;
			background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: color-mix(in srgb, var(--primary) 30%, transparent);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px var(--primary-subtle);

			&::before {
				opacity: 1;
			}

			.featured-image {
				transform: scale(1.05);
			}

			.featured-content h3,
			.featured-content .read-more {
				color: #fff;
			}
		}

		&.has-image {
			.featured-content {
				color: #fff;
			}

			.featured-content h3,
			.featured-content .read-more {
				color: #fff;
			}

			.featured-content p {
				color: rgba(255, 255, 255, 0.8);
			}

			.featured-badge,
			.recency-badge {
				background: rgba(255, 255, 255, 0.12);
				border-color: rgba(255, 255, 255, 0.22);
				color: #fff;
			}

			.featured-overlay {
				background: linear-gradient(
					to top,
					rgba(12, 10, 9, 0.97) 0%,
					rgba(12, 10, 9, 0.72) 45%,
					rgba(12, 10, 9, 0.2) 100%
				);
			}
		}
	}

	.featured-image {
		position: absolute;
		inset: 0.45rem;
		border-radius: 0.8rem;
		background-size: cover;
		background-position: center;
		transition: transform 0.4s ease;
	}

	.featured-overlay {
		position: absolute;
		inset: 0.45rem;
		border-radius: 0.8rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--primary-subtle) 70%, transparent) 0%,
			color-mix(in srgb, var(--bg-surface) 92%, var(--bg-deep)) 28%,
			color-mix(in srgb, var(--bg-deep) 90%, var(--bg-base)) 100%
		);
	}

	.featured-content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.45rem;
		color: var(--text-primary);

		h3 {
			font-size: 1.375rem;
			font-weight: 700;
			line-height: 1.3;
			margin: 0;
			color: var(--text-primary);
			transition: color 0.2s ease;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.875rem;
			line-height: 1.6;
			color: var(--text-secondary);
			margin: 0.5rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	.featured-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.85rem;
	}

	.featured-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.375rem 0.75rem;
		background: var(--primary-subtle);
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		color: var(--primary);
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 999px;
	}

	.featured-card .recency-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.375rem 0.75rem;
		margin-bottom: 0;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		background: color-mix(in srgb, var(--primary) 16%, transparent);
		color: var(--primary-light);
	}

	.featured-card .recency-badge.new {
		background: color-mix(in srgb, var(--primary) 22%, transparent);
		color: var(--primary-light);
		box-shadow: var(--glow-sm);
	}

	.read-more {
		display: flex;
		align-items: center;
		margin-top: 0.95rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--primary);
		transition: color 0.2s ease;
	}

	/* Recently Updated Section */
	.recent-section {
		margin-bottom: 3rem;
	}

	.recent-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.recent-card {
		position: relative;
		aspect-ratio: 3 / 2;
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--bg-surface);
		text-decoration: none;
		transition: all 0.25s ease;
		border: 1px solid var(--border-color);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: color-mix(in srgb, var(--primary) 30%, transparent);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px var(--primary-subtle);

			&::before {
				opacity: 1;
			}

			.card-image {
				transform: scale(1.05);
			}

			.card-content h3 {
				color: var(--accent-light);
			}
		}

		&.has-image {
			.card-content {
				color: #fff;
			}

			.card-content h3 {
				color: #fff;
			}

			.card-content p {
				color: rgba(255, 255, 255, 0.8);
			}

			.card-overlay {
				background: linear-gradient(
					to top,
					rgba(10, 10, 15, 0.95) 0%,
					rgba(10, 10, 15, 0.6) 40%,
					rgba(10, 10, 15, 0.3) 100%
				);
			}
		}

		.card-content {
			h3 {
				font-size: 0.9375rem;
			}

			p {
				font-size: 0.75rem;
				-webkit-line-clamp: 2;
				line-clamp: 2;
			}
		}
	}

	.recency-badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background: color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		color: var(--text-secondary);
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 0.25rem;
		margin-bottom: 0.5rem;

		&.new {
			background: var(--primary-subtle);
			color: var(--accent-light);
		}
	}

	/* CTA Section - Refined */
	.cta-section {
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		border-radius: 1rem;
		padding: 2.5rem 2rem;
		text-align: center;
		color: var(--text-primary);
		border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: 50%;
			transform: translateX(-50%);
			width: 400px;
			height: 200px;
			background: radial-gradient(ellipse, var(--primary-subtle) 0%, transparent 70%);
			pointer-events: none;
		}
	}

	.cta-content {
		max-width: 500px;
		margin: 0 auto;
		position: relative;

		h2 {
			font-size: 1.5rem;
			font-weight: 600;
			margin: 0 0 0.75rem;
			color: var(--text-primary);
		}

		p {
			font-size: 0.9375rem;
			color: var(--text-secondary);
			line-height: 1.6;
			margin: 0 0 1.5rem;
		}
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-dark) 100%);
		color: var(--text-primary);
		font-weight: 600;
		font-size: 0.875rem;
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.2s ease;
		box-shadow: 0 0 20px rgba(45, 212, 191, 0.25);

		&:hover {
			background: linear-gradient(135deg, var(--accent) 0%, var(--primary-dark) 100%);
			transform: translateY(-2px);
			box-shadow: 0 0 30px rgba(45, 212, 191, 0.35);
		}
	}

	.btn-secondary {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		background: rgba(45, 212, 191, 0.1);
		color: var(--text-secondary);
		font-weight: 600;
		font-size: 0.875rem;
		border-radius: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: var(--primary-subtle);
			border-color: rgba(45, 212, 191, 0.4);
			color: var(--accent-light);
		}
	}

	/* Responsive */
	@media (max-width: 900px) {
		.quick-nav-shell {
			padding: 1.15rem;
		}

		.quick-nav-intro {
			flex-direction: column;
			align-items: flex-start;
		}

		.nav-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.featured-grid {
			grid-template-columns: 1fr;
		}

		.recent-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.nine-types-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 640px) {
		.featured-card {
			min-height: 220px;
		}

		.featured-content {
			padding: 1.25rem;

			h3 {
				font-size: 1.125rem;
			}
		}

		.recent-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.625rem;
		}

		.recent-card {
			border-radius: 0.5rem;

			.card-content h3 {
				font-size: 0.8125rem;
			}

			.card-content p {
				display: none;
			}
		}

		.featured-section,
		.recent-section {
			margin-bottom: 2rem;
		}

		.hero {
			padding: 1.5rem 1rem 1rem;
		}

		.hero h1 {
			font-size: 1.5rem;
		}

		.quick-nav {
			padding: 0 1rem;
			margin-bottom: 1.25rem;
		}

		.quick-nav-shell {
			padding: 1rem;
			border-radius: 1rem;
		}

		.quick-nav-intro {
			margin-bottom: 0.875rem;
			padding-bottom: 0.875rem;
		}

		.quick-nav-kicker {
			font-size: 0.64rem;
		}

		.quick-nav-intro h2 {
			font-size: 1.12rem;
		}

		.quick-nav-description {
			font-size: 0.8125rem;
		}

		.nav-pill {
			min-height: 4.75rem;
			padding: 0.875rem 2.55rem 0.875rem 0.875rem;
			gap: 0.7rem;
			border-radius: 0.85rem;
		}

		.nav-icon-wrap {
			width: 2.4rem;
			height: 2.4rem;
			border-radius: 0.7rem;
		}

		.nav-icon {
			font-size: 1rem;
		}

		.nav-title {
			font-size: 0.95rem;
		}

		.nav-subtitle {
			font-size: 0.68rem;
		}

		.nav-arrow {
			font-size: 0.9rem;
		}

		.main-content {
			padding: 1rem 1rem 2.5rem;
		}

		.content-section {
			margin-bottom: 2.5rem;
			scroll-margin-top: 70px;
		}

		.section-header {
			margin-bottom: 1rem;
			padding-bottom: 0.5rem;
			flex-wrap: wrap;
		}

		.section-icon {
			font-size: 1rem;
			width: 1.75rem;
			height: 1.75rem;
		}

		.section-title-group h2 {
			font-size: 1.0625rem;
		}

		.section-subtitle {
			font-size: 0.75rem;
		}

		.view-all-link {
			font-size: 0.75rem;
			padding: 0.25rem 0.5rem;
		}

		.blog-grid,
		.nine-types-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.625rem;
		}

		.blog-card {
			aspect-ratio: 1;
			border-radius: 0.5rem;
		}

		.card-content {
			padding: 0.625rem;

			h3 {
				font-size: 0.75rem;
				-webkit-line-clamp: 2;
				line-clamp: 2;
			}

			p {
				display: none;
			}
		}

		.cta-section {
			padding: 1.5rem 1.25rem;
			border-radius: 0.75rem;
			margin-top: 0.5rem;
		}

		.cta-content h2 {
			font-size: 1.1875rem;
		}

		.cta-content p {
			font-size: 0.8125rem;
			margin-bottom: 1.25rem;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
		}

		.btn-primary,
		.btn-secondary {
			padding: 0.6875rem 1.25rem;
			font-size: 0.8125rem;
			justify-content: center;
			border-radius: 0.5rem;
		}
	}

	@media (max-width: 380px) {
		.hero h1 {
			font-size: 1.25rem;
		}

		.quick-nav {
			padding: 0 0.75rem;
		}

		.nav-pill {
			min-height: 4.25rem;
			padding: 0.75rem;
			gap: 0.625rem;
		}

		.nav-subtitle,
		.nav-arrow {
			display: none;
		}

		.nav-icon-wrap {
			width: 2.2rem;
			height: 2.2rem;
		}

		.nav-icon {
			font-size: 0.95rem;
		}

		.nav-title {
			font-size: 0.9rem;
		}

		.blog-grid,
		.nine-types-grid {
			gap: 0.5rem;
		}

		.card-content {
			padding: 0.5rem;

			h3 {
				font-size: 0.6875rem;
			}
		}

		.section-title-group {
			gap: 0.5rem;
		}

		.section-title-group h2 {
			font-size: 0.9375rem;
		}
	}
</style>
