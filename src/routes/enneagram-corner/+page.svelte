<!-- src/routes/enneagram-corner/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';

	export let data: PageData;

	const blogSections = [
		{
			id: 'understanding',
			title: '🧬 Core Psychology: Master the System',
			subtitle: 'The operating system behind all human behavior',
			type: 'overview',
			linkTitle: 'Core Psychology'
		},
		{
			id: 'nine-types',
			title: '🎭 The 9 Types: Deep Psychological Profiles',
			subtitle: 'Which childhood wound shaped your entire life?',
			type: 'nine-types',
			linkTitle: 'All 9 Types'
		},
		{
			id: 'personal-development',
			title: '🚀 Personality Maxing: Transform Your Wiring',
			subtitle: 'Stop generic self-help. Use type-specific strategies that actually work',
			type: 'development',
			linkTitle: 'Personality Maxing'
		},
		{
			id: 'relationships',
			title: '💔 Relationship Patterns: Break the Cycle',
			subtitle: 'Why you sabotage love the same way every time',
			type: 'relationships',
			linkTitle: 'Relationship Dynamics'
		},
		{
			id: 'mental-health',
			title: '🧠 Mental Health: Type-Specific Healing',
			subtitle: 'Understand your unique vulnerabilities and build resilience that actually works',
			type: 'mental-health',
			linkTitle: 'Mental Health Hub'
		},
		{
			id: 'workplace',
			title: '💼 Career Optimization: Work With Your Type',
			subtitle: 'Stop fighting your nature. Build a career that fits',
			type: 'workplace',
			linkTitle: 'Career Strategy'
		},
		{
			id: 'resources',
			title: '🔬 Resources: Tools That Actually Work',
			subtitle: "We tested everything so you don't have to",
			type: 'resources',
			linkTitle: 'Verified Resources'
		},
		{
			id: 'situations',
			title: '🎯 Real-World Behaviors: Types in Action',
			subtitle: "From first dates to crisis mode — predict anyone's behavior",
			type: 'situational',
			linkTitle: 'Situational Analysis'
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
			"@type": "CollectionPage",
			"mainEntity": {
				"@type": "ItemList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Understanding the Enneagram",
						"description": "Explore the basics and fundamentals of the Enneagram system",
						"url": "https://9takes.com/enneagram-corner#understanding"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "The Nine Enneagram Types",
						"description": "Detailed information about each of the nine Enneagram personality types",
						"url": "https://9takes.com/enneagram-corner#nine-types"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Using the Enneagram for Personal Development",
						"description": "Learn how to apply Enneagram insights for personal growth and self-improvement",
						"url": "https://9takes.com/enneagram-corner#personal-development"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Enneagram in Relationships",
						"description": "Understand how Enneagram types interact in various relationships",
						"url": "https://9takes.com/enneagram-corner#relationships"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Enneagram and Mental Health",
						"description": "Type-specific mental health resources, therapy guides, and healing strategies tailored to each Enneagram type",
						"url": "https://9takes.com/enneagram-corner#mental-health"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Enneagram in the Workplace",
						"description": "Discover how Enneagram knowledge can improve workplace dynamics and productivity",
						"url": "https://9takes.com/enneagram-corner#workplace"
					},
					{
						"@type": "ListItem",
						"position": 7,
						"name": "Enneagram Resources",
						"description": "Curated collection of Enneagram books, tools, and other resources",
						"url": "https://9takes.com/enneagram-corner#resources"
					},
					{
						"@type": "ListItem",
						"position": 8,
						"name": "Enneagram Situational Topics",
						"description": "Explore how Enneagram types respond in various life situations",
						"url": "https://9takes.com/enneagram-corner#situations"
					}
				]
			},
			"name": "Enneagram Corner: Your Guide to Personal Growth and Understanding",
			"description": "Dive into the Enneagram with this 9takes guide. Explore the nine types, personal development, relationships, workplace dynamics, and more.",
			"url": "https://9takes.com/enneagram-corner",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "https://9takes.com"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Enneagram Corner",
						"item": "https://9takes.com/enneagram-corner"
					}
				]
			}
		}
	</script>
</svelte:head>
<!-- here -->
<BlogPageHead
	data={{
		title: 'The Enneagram: Complete Psychological Operating Manual | 9takes',
		description:
			'Stop living on autopilot. Decode your psychological wiring, break self-sabotage patterns, and master human behavior. From childhood wounds to adult transformation.'
	}}
	slug={'enneagram-corner'}
/>

<main>
	<h1>Your Mind Has Been Running the Same Program Since Age 5</h1>

	<div class="authority-section">
		<p class="intro-text">
			<strong
				>Every decision you've made. Every relationship that failed. Every success you achieved.</strong
			> They all follow a pattern you didn't choose — a psychological operating system installed in childhood
			that's been running your life ever since.
		</p>
		<p class="intro-text">
			The Enneagram doesn't just describe your personality. It reveals the exact mechanisms driving
			your behavior, the childhood wound that created them, and most importantly — <strong
				>how to finally take control.</strong
			>
		</p>
		<div class="authority-badges">
			<div class="badge-item">✓ 100+ Deep Psychology Guides</div>
			<div class="badge-item">✓ Type-Specific Strategies</div>
			<div class="badge-item">✓ No Generic Advice</div>
			<div class="badge-item">✓ Actual Transformation Tools</div>
		</div>
	</div>

	<nav aria-label="Table of Contents">
		<h2>Choose Your Transformation Path</h2>
		<ul>
			{#each blogSections as section}
				<li>
					<a href="#{section.id}">
						<span class="nav-title">{section.title}</span>
						{#if section.subtitle}
							<span class="nav-subtitle">{section.subtitle}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	{#each blogSections as section}
		<section aria-labelledby={section.id}>
			<h2 id={section.id}>{section.title}</h2>
			{#if section.subtitle}
				<p class="section-subtitle">{section.subtitle}</p>
			{/if}
			<div class="blog-grid-container" class:nine-types={section.type === 'nine-types'}>
				{#each data.enneagramBlogs
					.filter((blog) => blog.type[0] === section.type)
					.slice(0, section.type === 'nine-types' ? 9 : 3) as blog (blog.slug)}
					<article class="grid-item">
						<a
							href="/enneagram-corner/{blog.slug}"
							class="blog-link"
							data-tag={`h-blog-${formatBlogSlug(blog.title)}`}
						>
							<div
								class="grid-item-content"
								style={blog.pic ? `background-image: url(/blogs/s-${blog.pic}.webp);` : ''}
							>
								<div class="text-overlay">
									<h3
										style="padding: 2rem 0 0rem;"
										style:--tag={`h-blog-${blog.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
									>
										{blog.title}
									</h3>
									<p style="margin-top: .3rem;">{blog.description}</p>
								</div>
							</div>
						</a>
					</article>
				{/each}
				{#if section.type !== 'nine-types'}
					<div class="grid-item view-all">
						<a
							href="/enneagram-corner/{section.type === 'mental-health'
								? 'mental-health'
								: `subtopic/${section.type}`}"
							class="blog-link"
						>
							<div class="grid-item-content">
								<div class="text-overlay">
									<h3>
										Unlock All {section.linkTitle}
										<ArrowRightIcon
											iconStyle={'margin-left: .5rem'}
											height={'1.5rem'}
											fill={'var(--accent)'}
										/>
									</h3>
								</div>
							</div>
						</a>
					</div>
				{/if}
			</div>
		</section>
	{/each}
</main>

<div class="resources-footer">
	<h2>Why 9takes Is Different</h2>
	<div class="difference-grid">
		<div class="difference-item">
			<h3>🧠 Psychological Depth</h3>
			<p>
				We don't just list traits. We reveal the childhood wounds, defense mechanisms, and
				unconscious patterns driving each type.
			</p>
		</div>
		<div class="difference-item">
			<h3>🎯 Precision Tools</h3>
			<p>
				No generic "be more confident" advice. Every strategy is tailored to your exact
				psychological wiring.
			</p>
		</div>
		<div class="difference-item">
			<h3>🔬 Evidence-Based</h3>
			<p>
				Built on decades of research from Riso, Hudson, Palmer, and Chestnut. Psychology, not
				personality astrology.
			</p>
		</div>
		<div class="difference-item">
			<h3>💪 Transformation Focus</h3>
			<p>We're not here to put you in a box. We're here to show you how to break out of it.</p>
		</div>
	</div>
	<div class="cta-section">
		<h3>Ready to Decode Your Operating System?</h3>
		<p>
			Start with our comprehensive type assessments or dive straight into your type's deep
			psychological profile.
		</p>
		<div class="cta-buttons">
			<a href="/enneagram-corner/subtopic/nine-types" class="cta-primary">Explore All 9 Types</a>
			<a href="/enneagram-corner/subtopic/overview" class="cta-secondary">Learn the System</a>
		</div>
	</div>
</div>

<style lang="scss">
	.authority-section {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 16px;
		padding: 3rem;
		margin: 2rem 0;
		color: white;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

		.intro-text {
			font-size: 1.2rem;
			line-height: 1.8;
			margin-bottom: 1.5rem;

			strong {
				color: #ffd700;
				font-weight: 700;
			}
		}

		.authority-badges {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 1rem;
			margin-top: 2rem;

			.badge-item {
				background: rgba(255, 255, 255, 0.1);
				backdrop-filter: blur(10px);
				padding: 1rem;
				border-radius: 8px;
				text-align: center;
				border: 1px solid rgba(255, 255, 255, 0.2);
				font-weight: 600;
			}
		}
	}

	.resources-footer {
		background: linear-gradient(to bottom, #1a1a2e, #0f0f1e);
		padding: 4rem;
		margin-top: 4rem;
		border-radius: 20px;
		color: white;

		h2 {
			color: white;
			font-size: 2.5rem;
			margin-bottom: 2rem;
			text-align: center;
		}

		.difference-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 2rem;
			margin: 3rem 0;

			.difference-item {
				background: rgba(255, 255, 255, 0.05);
				padding: 2rem;
				border-radius: 12px;
				border: 1px solid rgba(255, 255, 255, 0.1);
				transition:
					transform 0.3s ease,
					background 0.3s ease;

				&:hover {
					transform: translateY(-5px);
					background: rgba(255, 255, 255, 0.08);
				}

				h3 {
					color: #ffd700;
					font-size: 1.3rem;
					margin-bottom: 1rem;
				}

				p {
					line-height: 1.6;
					opacity: 0.9;
					font-size: 1rem;
				}
			}
		}

		.cta-section {
			text-align: center;
			padding: 3rem;
			background: rgba(102, 126, 234, 0.1);
			border-radius: 16px;
			margin-top: 3rem;

			h3 {
				font-size: 2rem;
				margin-bottom: 1rem;
				color: #ffd700;
			}

			p {
				font-size: 1.1rem;
				margin-bottom: 2rem;
				opacity: 0.9;
			}

			.cta-buttons {
				display: flex;
				justify-content: center;
				gap: 1rem;
				flex-wrap: wrap;

				a {
					padding: 1rem 2rem;
					border-radius: 8px;
					text-decoration: none;
					font-weight: 600;
					transition: all 0.3s ease;

					&.cta-primary {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						color: white;

						&:hover {
							transform: scale(1.05);
							box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
						}
					}

					&.cta-secondary {
						background: transparent;
						color: #ffd700;
						border: 2px solid #ffd700;

						&:hover {
							background: #ffd700;
							color: #1a1a2e;
						}
					}
				}
			}
		}
	}

	nav {
		margin-bottom: 3rem;

		h2 {
			font-size: 2rem;
			margin-bottom: 2rem;
			text-align: center;
			color: var(--primary);
		}

		ul {
			list-style-type: none;
			padding: 0;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1rem;
		}

		li {
			a {
				display: block;
				color: var(--text-color);
				text-decoration: none;
				padding: 1.5rem;
				border-radius: 12px;
				background-color: var(--card-bg-color);
				border: 2px solid transparent;
				transition: all 0.3s ease;

				.nav-title {
					display: block;
					font-weight: 600;
					font-size: 1.1rem;
					margin-bottom: 0.5rem;
				}

				.nav-subtitle {
					display: block;
					font-size: 0.9rem;
					opacity: 0.7;
					line-height: 1.4;
				}

				&:hover,
				&:focus {
					border-color: var(--primary);
					transform: translateY(-3px);
					box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
				}
			}
		}
	}

	section {
		margin-bottom: 4rem;

		h2 {
			font-size: 2rem;
			margin-bottom: 0.5rem;
		}

		.section-subtitle {
			font-size: 1.1rem;
			opacity: 0.8;
			margin-bottom: 1.5rem;
			color: var(--text-muted);
		}
	}

	.blog-grid-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;

		&.nine-types {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.grid-item {
		aspect-ratio: 1 / 1;
		padding: 0;
		overflow: hidden;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		}
	}

	.blog-link {
		display: block;
		text-decoration: none;
		color: inherit;
		height: 100%;
	}

	.grid-item-content {
		height: 100%;
		background-size: cover;
		background-position: center;
		position: relative;
	}

	.text-overlay {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.6);
		color: var(--accent);
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	h3 {
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
		line-height: 1.3;
	}

	p {
		font-size: 0.8rem;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.view-all {
		margin-top: 0.5rem;
		padding: 0;
		border-radius: var(--base-border-radius);
		.grid-item-content {
			background-color: var(--primary-light);
		}

		.text-overlay {
			background-color: rgba(0, 0, 0, 0.3);
			justify-content: center;
			align-items: center;
			text-align: center;
		}

		h3 {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 1024px) {
		.blog-grid-container {
			grid-template-columns: repeat(4, 1fr);

			&.nine-types {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		h3 {
			font-size: 1.2rem;
		}

		p {
			font-size: 0.9rem;
			-webkit-line-clamp: 3;
		}
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		section h2 {
			font-size: 1.5rem;
		}

		.blog-grid-container,
		.blog-grid-container.nine-types {
			grid-template-columns: repeat(2, 1fr);
		}

		h3 {
			font-size: 1rem;
		}

		p {
			font-size: 0.8rem;
			-webkit-line-clamp: 2;
		}
	}

	@media (max-width: 480px) {
		.blog-grid-container,
		.blog-grid-container.nine-types {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
