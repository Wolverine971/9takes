<!-- src/routes/enneagram-corner/mental-health/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { FAQItem } from '$lib/types/faq';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button } from '$lib/components/atoms';
	import FAQSection from '$lib/components/blog/FAQSection.svelte';
	import { buildFAQSchema } from '$lib/utils/schema';

	export let data: PageData;

	const hubDescription = `Each Enneagram type breaks differently. Type 7s mask depression with motion. Type 8s with anger. Type 9s with shutdown. These guides decode how anxiety, depression, trauma, and burnout actually show up by type — and what tends to help.`;

	const heroLede = `Anxiety, depression, burnout, addiction — they don't show up the same way in everyone. Type 7s outrun depression. Type 8s convert it to anger. Type 9s vanish into it. Knowing the type tells you what you're actually looking at, and what's likely to help.`;

	const benefitCards = [
		{
			title: 'Different types break differently',
			body: 'Type 1 burns out as moral failure. Type 4 falls into identity collapse. Type 6 spirals into anxiety. Same diagnosis, different lived experience.'
		},
		{
			title: 'Symptoms get hidden by personality',
			body: "Type 7 covers depression with plans. Type 8 with control. Type 9 by going quiet. If you don't know the type, you miss it — including in yourself."
		},
		{
			title: 'What helps is type-specific',
			body: "Type 5s need a framework before they'll engage. Type 2s need permission to receive care. Type 8s need to be the agent of their own recovery. Same therapy, different doors in."
		},
		{
			title: 'You can see it coming',
			body: 'Each type has a predictable path into stress and a predictable path out. Knowing yours means catching the slide weeks before it hits the wall.'
		}
	];

	const sectionSubs = {
		why: 'What changes when you read mental health through type.',
		guides: 'Deep dives by topic — written for actual humans, not symptom checklists.',
		byType: 'Where each type tends to break, and what tends to put it back together.'
	};

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
				'The inner critic that mutates into clinical anxiety',
				'Compulsions disguised as "high standards"',
				'Burnout that reads to them as moral failure'
			],
			strengths: [
				'Will follow a treatment plan to the letter',
				'Self-monitoring is already a daily habit',
				'Treats recovery like the work it deserves to be'
			]
		},
		{
			vulnerabilities: [
				'Codependency wearing a halo',
				'Boundaries that collapse before resentment surfaces',
				'Caregiver burnout that hits all at once'
			],
			strengths: [
				'A real support network, already built',
				'Emotional fluency most types are still learning',
				'Helping others is genuinely metabolizing for them'
			]
		},
		{
			vulnerabilities: [
				'Workaholism that the culture keeps applauding',
				'Depression that hits when the achievements stop landing',
				'The body sending the bill the mind refused to read'
			],
			strengths: [
				'Will set and hit recovery goals like any other goal',
				'Adapts faster than most when something stops working',
				'Already built for sustained, structured effort'
			]
		},
		{
			vulnerabilities: [
				'Major depressive episodes triggered by identity rupture',
				'Emotion intensity that spills into dysregulation',
				'A shifting sense of self that can feel terrifying inside'
			],
			strengths: [
				'Self-awareness that most therapists envy',
				'Creative expression as a real route through pain',
				'Refuses to perform recovery — only the real thing counts'
			]
		},
		{
			vulnerabilities: [
				'Social anxiety mistaken for "just an introvert"',
				'Avoidance that quietly shrinks the life',
				'Dissociation as the default exit door'
			],
			strengths: [
				'Will research their condition cold',
				'Self-sufficient in a way that survives bad therapists',
				'Understanding the mechanism is half their healing'
			]
		},
		{
			vulnerabilities: [
				'Generalized anxiety humming under everything',
				'Catastrophizing that feels like prudence',
				'Hypervigilance the body never gets to put down'
			],
			strengths: [
				'Loyal to the support system once it earns trust',
				'Will plan treatment thoroughly and stick to it',
				'Does best with a community, not in isolation'
			]
		},
		{
			vulnerabilities: [
				'ADHD-like overload from constant tab-switching',
				'Addiction risk hiding inside "having fun"',
				'Depression masked by motion until it stops them cold'
			],
			strengths: [
				'Genuine optimism — the kind that survives setbacks',
				'Will try multiple modalities until one clicks',
				'Reframes growth as adventure, which keeps them in it'
			]
		},
		{
			vulnerabilities: [
				'Rage as the only emotion that feels safe to feel',
				'Vulnerability avoided until it bursts the seam',
				'Stress that lands in the body — heart, gut, blood pressure'
			],
			strengths: [
				'Unstoppable once they decide to do the work',
				"Leads their own recovery — doesn't outsource it",
				'Will defend the healing space from anyone who threatens it'
			]
		},
		{
			vulnerabilities: [
				'Clinical depression hiding behind "I\'m fine"',
				'Dissociation that reads to others as calm',
				"Chronic fatigue that nobody sees because nobody's told"
			],
			strengths: [
				'Holistic approach — nothing single-modality survives them',
				'Natural mediator who can hold both sides of an inner conflict',
				'Steady pace that finishes long after the dramatic types quit'
			]
		}
	];

	// FAQ data for mental health + Enneagram intersection
	const mentalHealthFAQs: FAQItem[] = [
		{
			question: 'How does the Enneagram relate to mental health?',
			answer:
				'Each Enneagram type has distinct mental health vulnerabilities and coping patterns. Type 1s tend toward anxiety and perfectionism. Type 4s are more prone to depression. Type 6s often struggle with generalized anxiety. Understanding your type helps identify your specific risk factors and tailor treatment approaches.'
		},
		{
			question: 'Can the Enneagram be used in therapy?',
			answer:
				'Many therapists integrate the Enneagram as a tool for self-understanding. It helps clients identify defense mechanisms, relationship patterns, and growth edges. However, it complements rather than replaces clinical diagnosis. Find a therapist trained in both clinical methods and Enneagram applications.'
		},
		{
			question: 'Why do different types experience anxiety differently?',
			answer:
				"Anxiety manifests through each type's core fear. Type 6s fear uncertainty and seek reassurance. Type 1s fear making mistakes. Type 3s fear failure and judgment. Type 5s fear being overwhelmed. Understanding your type's anxiety pattern helps you address the root cause, not just symptoms."
		},
		{
			question: 'How does trauma affect Enneagram types?',
			answer:
				"Trauma can intensify type patterns or push people toward their stress point. Type 9s may dissociate more. Type 8s may become more controlling. Type 2s may over-give to feel safe. Trauma-informed Enneagram work helps identify how your type's coping mechanisms developed and when they no longer serve you."
		},
		{
			question: 'Can knowing my type prevent mental health issues?',
			answer:
				"Self-awareness is protective. Knowing your type's vulnerabilities lets you recognize early warning signs and intervene sooner. Type 7s can watch for avoidance patterns that mask depression. Type 1s can notice when self-criticism becomes destructive. Prevention comes from understanding, not from the label itself."
		},
		{
			question: 'What mental health strengths does each type have?',
			answer:
				"Every type brings unique healing assets. Type 2s build strong support networks. Type 3s set and achieve recovery goals. Type 5s research their conditions thoroughly. Type 9s maintain steady, sustainable progress. Leveraging your type's strengths accelerates healing."
		}
	];

	// Build FAQ schema for SEO
	const faqSchema = buildFAQSchema(mentalHealthFAQs);
</script>

<SEOHead
	title="Enneagram and Mental Health Hub | 9takes"
	description={hubDescription}
	canonical="https://9takes.com/enneagram-corner/mental-health"
	jsonLd={faqSchema}
/>

<div class="page-wrapper">
	<!-- Hero Section -->
	<header class="hero">
		<h1>Mental health, decoded by type.</h1>
		<p class="hero-lede">{heroLede}</p>
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
						<p class="section-subtitle">{sectionSubs.why}</p>
					</div>
				</div>
			</div>

			<div class="benefits-grid">
				{#each benefitCards as card}
					<div class="benefit-card">
						<h3>{card.title}</h3>
						<p>{card.body}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Guide Categories -->
		<section class="content-section" id="guides">
			<div class="section-header">
				<div class="section-title-group">
					<span class="section-icon">📚</span>
					<div>
						<h2>Mental Health Guides</h2>
						<p class="section-subtitle">{sectionSubs.guides}</p>
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
							<a href={blogPath} class="blog-card image-card" class:has-image={blog.pic}>
								{#if blog.pic}
									<div
										class="card-image image-card-media"
										style={`background-image: url(/blogs/s-${blog.pic}.webp);`}
									></div>
								{/if}
								<div class="card-overlay image-card-overlay"></div>
								<div class="card-content image-card-content">
									<h4>{blog.title}</h4>
									<p>{blog.description}</p>
									<span class="read-link image-card-read-more">Read Guide</span>
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
						<p class="section-subtitle">{sectionSubs.byType}</p>
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
							<h4>How they tend to break</h4>
							<ul>
								{#each typeData[i].vulnerabilities as item}
									<li>{item}</li>
								{/each}
							</ul>
						</div>
						<div class="type-column">
							<h4>What they bring to recovery</h4>
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

		<!-- FAQ Section -->
		<FAQSection faqs={mentalHealthFAQs} title="Mental Health & Enneagram FAQs" />

		<!-- CTA Section -->
		<section class="cta-section">
			<div class="cta-content">
				<h2>Match the work to the wiring.</h2>
				<p>
					Generic mental health advice doesn't account for how your type breaks. These guides do.
					Pick the angle that fits your pattern.
				</p>
				<div class="cta-buttons">
					<Button href="/enneagram-corner/mental-health/enneagram-anxiety-complete-guide"
						>Read the Anxiety Guide</Button
					>
					<Button href="/questions" variant="secondary">Find Your Type</Button>
				</div>
			</div>
		</section>
	</main>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme - Mental Health Hub */
	.page-wrapper {
		--surface-card: color-mix(in srgb, var(--stone-warm) 92%, var(--night-deep));
		--surface-card-strong: color-mix(in srgb, var(--stone-warm) 86%, var(--night-deep));
		--accent-border: color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
		min-height: 100vh;
		background: linear-gradient(180deg, var(--night-deep) 0%, var(--night-deep) 100%);
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
		background: radial-gradient(
			ellipse,
			color-mix(in srgb, var(--accent-soft) 58%, transparent) 0%,
			transparent 70%
		);
		pointer-events: none;
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, var(--ink-bright) 0%, var(--lamp-glow) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-lede {
		max-width: 56ch;
		margin: 1rem auto 0;
		font-size: 1.05rem;
		line-height: 1.65;
		color: var(--ink-mid);
		position: relative;
	}

	@media (max-width: 640px) {
		.hero-lede {
			font-size: 0.95rem;
		}
	}

	/* Quick Navigation */
	.quick-nav {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--stone-warm) 96%, var(--night-deep)) 0%,
			color-mix(in srgb, var(--stone-warm) 88%, var(--night-deep)) 100%
		);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--accent-border);
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
	}

	.nav-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: color-mix(in srgb, var(--stone-warm) 92%, var(--night-deep));
		border-radius: 0.625rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--ink-mid);
		white-space: nowrap;
		transition: all 0.2s ease;
		text-decoration: none;
		border: 1px solid var(--accent-border);

		&:hover {
			background: color-mix(in srgb, var(--primary-subtle) 62%, transparent);
			color: var(--lamp-glow);
			border-color: color-mix(in srgb, var(--lamp-glow) 28%, transparent);
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
		font-size: 0.9375rem;
		line-height: 1;
	}

	/* Main Content */
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 4rem;
	}

	/* Crisis Banner */
	.crisis-banner {
		background: linear-gradient(135deg, var(--error) 0%, var(--error-700) 100%);
		color: var(--text-on-dark);
		padding: 1rem 1.5rem;
		border-radius: 1rem;
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
		margin-bottom: 3.5rem;
		scroll-margin-top: 80px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--stone-edge);
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
		background: color-mix(in srgb, var(--primary-subtle) 56%, transparent);
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 18%, transparent);
	}

	.section-title-group h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.8125rem;
		color: var(--ink-dim);
		margin: 0.125rem 0 0;
	}

	/* Benefits Grid */
	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.benefit-card {
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		border-radius: 1rem;
		padding: 1.25rem;
		box-shadow: var(--shadow-sm);
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			border-color: color-mix(in srgb, var(--lamp-glow) 28%, transparent);
			box-shadow: var(--shadow-lg);
		}

		h3 {
			font-size: 0.95rem;
			font-weight: 600;
			color: var(--ink-bright);
			margin: 0 0 0.5rem;
		}

		p {
			font-size: 0.8rem;
			color: var(--ink-mid);
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
		color: var(--ink-bright);
		margin: 0 0 0.25rem;
	}

	.category-desc {
		font-size: 0.8rem;
		color: var(--ink-dim);
		margin: 0 0 1rem;
	}

	/* Blog Grid */
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.blog-card {
		@extend .image-card !optional;
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: 1rem;
		background: var(--surface-card-strong);
		transition: all 0.25s ease;
		border: 1px solid var(--accent-border);
		box-shadow: var(--shadow-sm);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				135deg,
				color-mix(in srgb, var(--primary-subtle) 42%, transparent) 0%,
				transparent 50%
			);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-3px);
			border-color: color-mix(in srgb, var(--lamp-glow) 28%, transparent);
			box-shadow:
				var(--shadow-lg),
				0 0 0 1px color-mix(in srgb, var(--lamp-glow) 14%, transparent);

			&::before {
				opacity: 1;
			}

			.card-content h4 {
				color: var(--lamp-glow);
			}
		}
	}

	.card-image {
		@extend .image-card-media !optional;
		transition-duration: 0.35s;
	}

	.card-overlay {
		@extend .image-card-overlay !optional;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 36%, transparent) 0%,
				transparent 42%
			),
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--stone-warm) 96%, var(--night-deep)) 0%,
				color-mix(in srgb, var(--stone-warm) 88%, var(--night-deep)) 100%
			);
	}

	.card-content {
		@extend .image-card-content !optional;
		padding: 1rem;

		h4 {
			font-size: 0.9375rem;
			font-weight: 600;
			line-height: 1.4;
			margin: 0;
			color: var(--ink-bright);
			transition: color 0.2s ease;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		p {
			font-size: 0.75rem;
			line-height: 1.5;
			color: var(--ink-mid);
			margin: 0.375rem 0 0;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.read-link {
			@extend .image-card-read-more !optional;
			font-size: 0.6875rem;
			font-weight: 600;
			margin-top: 0.375rem;
		}
	}

	/* Type Blocks */
	.type-block {
		background: var(--surface-card);
		border: 1px solid var(--accent-border);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1rem;
		scroll-margin-top: 80px;
		box-shadow: var(--shadow-sm);
	}

	.type-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;

		h3 {
			font-size: 1.1rem;
			font-weight: 600;
			color: var(--ink-bright);
			margin: 0;
		}
	}

	.type-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: linear-gradient(135deg, var(--lamp-glow) 0%, var(--lamp-glow) 100%);
		color: var(--text-on-primary);
		border-radius: 0.625rem;
		font-weight: 700;
		font-size: 1rem;
		box-shadow: var(--glow-sm);
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
			color: var(--ink-bright);
			margin: 0 0 0.75rem;
		}

		ul {
			list-style: disc;
			padding-left: 1.25rem;
			margin: 0;
		}

		li {
			font-size: 0.85rem;
			color: var(--ink-mid);
			margin-bottom: 0.5rem;
			line-height: 1.4;
		}
	}

	/* CTA Section */
	.cta-section {
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		border-radius: 1rem;
		padding: 2.5rem 2rem;
		text-align: center;
		color: var(--ink-bright);
		border: 1px solid var(--accent-border);
		position: relative;
		overflow: hidden;
		box-shadow: var(--shadow-sm);

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: 50%;
			transform: translateX(-50%);
			width: 400px;
			height: 200px;
			background: radial-gradient(
				ellipse,
				color-mix(in srgb, var(--accent-soft) 52%, transparent) 0%,
				transparent 70%
			);
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
			color: var(--ink-bright);
		}

		p {
			font-size: 0.9375rem;
			color: var(--ink-mid);
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

	/* Responsive */
	@media (max-width: 900px) {
		.benefits-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 901px) {
		.main-content {
			max-width: 1264px;
			padding: 1.75rem 2rem 4.5rem;
		}

		.content-section {
			margin-bottom: 3.75rem;
		}

		.blog-grid {
			gap: 1.25rem;
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
			border-radius: 0.625rem;
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
			border-radius: 1rem;
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

		.cta-buttons :global(.btn) {
			width: 100%;
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
