<!-- src/routes/enneagram-corner/mental-health/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	const hubDescription = `Explore the intersection of Enneagram personality types and mental health. Our comprehensive guides help you understand how each type experiences anxiety, depression, trauma, and other mental health challenges, with tailored strategies for healing and growth.`;

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
</script>

<svelte:head>
	<title>Enneagram and Mental Health Hub | 9takes</title>
	<meta name="description" content={hubDescription} />
	<meta property="og:title" content="Enneagram and Mental Health Hub | 9takes" />
	<meta property="og:description" content={hubDescription} />
	<meta property="og:url" content="https://9takes.com/enneagram-corner/mental-health" />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://9takes.com/enneagram-corner/mental-health" />
</svelte:head>

<div class="container">
	<nav class="breadcrumb">
		<a href="/enneagram-corner">Enneagram Corner</a>
		<span class="separator">/</span>
		<span class="current">Mental Health</span>
	</nav>

	<header class="hub-header">
		<h1>Enneagram and Mental Health</h1>
		<p class="lead">{hubDescription}</p>

		<div class="crisis-banner">
			<p><strong>If you're in crisis, please reach out:</strong></p>
			<ul>
				<li>National Suicide Prevention Lifeline: <strong>988</strong></li>
				<li>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></li>
				<li>Emergency Services: <strong>911</strong></li>
			</ul>
		</div>
	</header>

	<section class="why-section">
		<h2>Why Personality Type Matters in Mental Health</h2>
		<div class="reasons-grid">
			<div class="reason-card">
				<h3>Personalized Understanding</h3>
				<p>
					Each Enneagram type has unique mental health vulnerabilities and strengths, helping you
					understand your specific patterns.
				</p>
			</div>
			<div class="reason-card">
				<h3>Targeted Strategies</h3>
				<p>
					What works for one type may not work for another. Find coping strategies tailored to your
					personality.
				</p>
			</div>
			<div class="reason-card">
				<h3>Earlier Recognition</h3>
				<p>
					Understanding your type's warning signs helps you recognize mental health challenges
					before they escalate.
				</p>
			</div>
			<div class="reason-card">
				<h3>Better Treatment Outcomes</h3>
				<p>
					Type-aware therapy approaches lead to more effective treatment and sustainable recovery.
				</p>
			</div>
		</div>
	</section>

	<section class="navigation-cards">
		<h2>Quick Navigation by Your Type</h2>
		<div class="type-grid">
			{#each Array(9) as _, i}
				<a href="#{i + 1}" class="type-card">
					<div class="type-number">{i + 1}</div>
					<div class="type-name">Type {i + 1}</div>
				</a>
			{/each}
		</div>
	</section>

	{#each categories as category}
		<section class="category-section">
			<h2>{category.title}</h2>
			<p class="category-description">{category.description}</p>
			<div class="blog-grid">
				{#each category.blogs as blog}
					<article class="blog-card">
						<a href="/enneagram-corner/mental-health/{blog.slug}">
							<h3>{blog.title}</h3>
							<p>{blog.description}</p>
							<span class="read-more">Read Guide →</span>
						</a>
					</article>
				{/each}
			</div>
		</section>
	{/each}

	<section class="type-specific-section">
		<h2>Mental Health Resources by Enneagram Type</h2>
		<p>Find all mental health resources specific to your type in one place.</p>

		{#each Array(9) as _, i}
			{@const typeNum = i + 1}
			{@const typeBlogs = data.mentalHealthBlogs.filter(
				(blog) => blog.loc && !blog.loc.includes(`type-${typeNum}`) // This would need adjustment based on how type-specific content is marked
			)}
			<div id={typeNum.toString()} class="type-section">
				<h3>Type {typeNum} Mental Health Resources</h3>
				<div class="type-resources">
					<div class="vulnerability-summary">
						<h4>Common Vulnerabilities</h4>
						<ul>
							{#if typeNum === 1}
								<li>Anxiety disorders</li>
								<li>Obsessive-compulsive tendencies</li>
								<li>Perfectionism-related depression</li>
							{:else if typeNum === 2}
								<li>Codependency</li>
								<li>Boundary issues</li>
								<li>Caregiver burnout</li>
							{:else if typeNum === 3}
								<li>Workaholism and burnout</li>
								<li>Identity-based depression</li>
								<li>Stress-related health issues</li>
							{:else if typeNum === 4}
								<li>Major depression</li>
								<li>Emotional dysregulation</li>
								<li>Identity disturbances</li>
							{:else if typeNum === 5}
								<li>Social anxiety</li>
								<li>Avoidant patterns</li>
								<li>Dissociation</li>
							{:else if typeNum === 6}
								<li>Generalized anxiety disorder</li>
								<li>Phobias</li>
								<li>Hypervigilance</li>
							{:else if typeNum === 7}
								<li>ADHD-like symptoms</li>
								<li>Addiction vulnerabilities</li>
								<li>Masked depression</li>
							{:else if typeNum === 8}
								<li>Anger management issues</li>
								<li>Vulnerability avoidance</li>
								<li>Stress-related illness</li>
							{:else if typeNum === 9}
								<li>Clinical depression</li>
								<li>Dissociative tendencies</li>
								<li>Chronic fatigue</li>
							{/if}
						</ul>
					</div>
					<div class="strength-summary">
						<h4>Healing Strengths</h4>
						<ul>
							{#if typeNum === 1}
								<li>Strong commitment to recovery</li>
								<li>Systematic approach to healing</li>
								<li>High integrity in treatment</li>
							{:else if typeNum === 2}
								<li>Natural support network building</li>
								<li>Emotional intelligence</li>
								<li>Helping others aids own healing</li>
							{:else if typeNum === 3}
								<li>Goal-oriented recovery</li>
								<li>Resilience and adaptability</li>
								<li>Success-driven healing</li>
							{:else if typeNum === 4}
								<li>Deep self-awareness</li>
								<li>Creative expression for healing</li>
								<li>Authenticity in recovery</li>
							{:else if typeNum === 5}
								<li>Research-based approach</li>
								<li>Self-sufficiency in healing</li>
								<li>Intellectual understanding aids recovery</li>
							{:else if typeNum === 6}
								<li>Loyalty to support systems</li>
								<li>Thorough treatment planning</li>
								<li>Community-oriented recovery</li>
							{:else if typeNum === 7}
								<li>Optimistic recovery outlook</li>
								<li>Multiple healing modalities</li>
								<li>Enthusiasm for growth</li>
							{:else if typeNum === 8}
								<li>Strong determination</li>
								<li>Leadership in recovery</li>
								<li>Protective of healing space</li>
							{:else if typeNum === 9}
								<li>Holistic healing approach</li>
								<li>Natural mediator in groups</li>
								<li>Steady, sustainable recovery</li>
							{/if}
						</ul>
					</div>
				</div>
			</div>
		{/each}
	</section>

	<section class="cta-section">
		<h2>Start Your Mental Health Journey</h2>
		<p>
			Understanding your Enneagram type is the first step toward personalized mental health care.
		</p>
		<div class="cta-buttons">
			<a href="/enneagram-corner/mental-health/enneagram-anxiety-complete-guide" class="btn btn-primary">
				Read Our Anxiety Guide
			</a>
			<a href="/enneagram-test" class="btn btn-secondary"> Discover Your Type </a>
		</div>
	</section>
</div>

<style lang="scss">
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.breadcrumb {
		margin-bottom: 2rem;
		font-size: 0.9rem;
		color: var(--text-secondary);

		a {
			color: var(--color-primary);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}

		.separator {
			margin: 0 0.5rem;
		}

		.current {
			color: var(--text-primary);
			font-weight: 500;
		}
	}

	.hub-header {
		text-align: center;
		margin-bottom: 3rem;

		h1 {
			font-size: 2.5rem;
			margin-bottom: 1rem;
			color: var(--text-primary);
		}

		.lead {
			font-size: 1.25rem;
			color: var(--text-secondary);
			max-width: 800px;
			margin: 0 auto 2rem;
			line-height: 1.6;
		}
	}

	.crisis-banner {
		background-color: #fee;
		border: 2px solid #f66;
		padding: 1.5rem;
		margin: 2rem auto;
		border-radius: 8px;
		max-width: 600px;

		p {
			margin: 0 0 0.5rem;
			color: #d00;
			font-weight: bold;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				margin: 0.5rem 0;
				color: #d00;
			}
		}
	}

	.why-section {
		margin-bottom: 4rem;

		h2 {
			text-align: center;
			margin-bottom: 2rem;
			font-size: 2rem;
		}

		.reasons-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 2rem;

			.reason-card {
				padding: 1.5rem;
				background: var(--color-bg-secondary);
				border-radius: 8px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

				h3 {
					margin-bottom: 0.5rem;
					color: var(--color-primary);
				}

				p {
					margin: 0;
					color: var(--text-secondary);
					line-height: 1.5;
				}
			}
		}
	}

	.navigation-cards {
		margin-bottom: 4rem;

		h2 {
			text-align: center;
			margin-bottom: 2rem;
		}

		.type-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
			gap: 1rem;
			max-width: 600px;
			margin: 0 auto;

			.type-card {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 1rem;
				background: var(--color-bg-secondary);
				border-radius: 8px;
				text-decoration: none;
				transition: all 0.3s ease;

				&:hover {
					transform: translateY(-4px);
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
				}

				.type-number {
					font-size: 2rem;
					font-weight: bold;
					color: var(--color-primary);
					margin-bottom: 0.25rem;
				}

				.type-name {
					font-size: 0.875rem;
					color: var(--text-secondary);
				}
			}
		}
	}

	.category-section {
		margin-bottom: 4rem;

		h2 {
			margin-bottom: 0.5rem;
			color: var(--text-primary);
		}

		.category-description {
			margin-bottom: 1.5rem;
			color: var(--text-secondary);
		}

		.blog-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1.5rem;

			.blog-card {
				background: var(--color-bg-secondary);
				border-radius: 8px;
				padding: 1.5rem;
				transition: all 0.3s ease;

				&:hover {
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
					transform: translateY(-2px);
				}

				a {
					text-decoration: none;
					color: inherit;
					display: block;

					h3 {
						margin-bottom: 0.5rem;
						color: var(--text-primary);
						font-size: 1.25rem;
					}

					p {
						color: var(--text-secondary);
						line-height: 1.5;
						margin-bottom: 0.5rem;
					}

					.read-more {
						color: var(--color-primary);
						font-weight: 500;
					}
				}
			}
		}
	}

	.type-specific-section {
		margin-bottom: 4rem;

		> h2 {
			text-align: center;
			margin-bottom: 1rem;
		}

		> p {
			text-align: center;
			color: var(--text-secondary);
			margin-bottom: 3rem;
		}

		.type-section {
			margin-bottom: 3rem;
			padding: 2rem;
			background: var(--color-bg-secondary);
			border-radius: 8px;

			h3 {
				margin-bottom: 1.5rem;
				color: var(--color-primary);
			}

			.type-resources {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
				gap: 2rem;

				.vulnerability-summary,
				.strength-summary {
					h4 {
						margin-bottom: 1rem;
						font-size: 1.1rem;
					}

					ul {
						margin: 0;
						padding-left: 1.5rem;

						li {
							margin-bottom: 0.5rem;
							color: var(--text-secondary);
						}
					}
				}
			}
		}
	}

	.cta-section {
		text-align: center;
		padding: 3rem;
		background: var(--color-bg-secondary);
		border-radius: 12px;

		h2 {
			margin-bottom: 1rem;
		}

		p {
			margin-bottom: 2rem;
			color: var(--text-secondary);
		}

		.cta-buttons {
			display: flex;
			gap: 1rem;
			justify-content: center;
			flex-wrap: wrap;

			.btn {
				padding: 0.75rem 2rem;
				border-radius: 8px;
				text-decoration: none;
				font-weight: 500;
				transition: all 0.3s ease;

				&.btn-primary {
					background: var(--color-primary);
					color: white;

					&:hover {
						opacity: 0.9;
						transform: translateY(-2px);
					}
				}

				&.btn-secondary {
					background: transparent;
					color: var(--color-primary);
					border: 2px solid var(--color-primary);

					&:hover {
						background: var(--color-primary);
						color: white;
					}
				}
			}
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.hub-header h1 {
			font-size: 2rem;
		}

		.hub-header .lead {
			font-size: 1.1rem;
		}

		.blog-grid {
			grid-template-columns: 1fr !important;
		}
	}
</style>
