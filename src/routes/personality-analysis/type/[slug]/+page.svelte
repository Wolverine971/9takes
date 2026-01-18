<!-- src/routes/personality-analysis/type/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import EnneagramTypeIntro from '$lib/components/blog/EnneagramTypeIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import EnneagramTypeBottom from '$lib/components/blog/EnneagramTypeBottom.svelte';

	export let data: PageData;

	const enneagramTypes: Record<string, { name: string; tagline: string }> = {
		'1': { name: 'The Perfectionist', tagline: 'Principled, purposeful, self-controlled' },
		'2': { name: 'The Helper', tagline: 'Generous, demonstrative, people-pleasing' },
		'3': { name: 'The Achiever', tagline: 'Adaptable, excelling, driven' },
		'4': { name: 'The Individualist', tagline: 'Expressive, dramatic, self-absorbed' },
		'5': { name: 'The Investigator', tagline: 'Perceptive, innovative, secretive' },
		'6': { name: 'The Loyalist', tagline: 'Engaging, responsible, anxious' },
		'7': { name: 'The Enthusiast', tagline: 'Spontaneous, versatile, scattered' },
		'8': { name: 'The Challenger', tagline: 'Self-confident, decisive, confrontational' },
		'9': { name: 'The Peacemaker', tagline: 'Receptive, reassuring, complacent' }
	};

	$: typeInfo = enneagramTypes[data.slug] || { name: '', tagline: '' };
</script>

<BlogPageHead
	data={{
		title: `Enneagram Type ${data.slug}: ${typeInfo.name} - 9takes Analysis of Famous People`,
		description: `Explore characteristics and famous examples of Enneagram Type ${data.slug} (${typeInfo.name}). Discover how this personality type manifests in various aspects of life.`
	}}
	slug={`personality-analysis/type/${data.slug}`}
/>

<div class="page-wrapper">
	<header class="hero">
		<div class="type-badge">
			<span class="type-num">{data.slug}</span>
		</div>
		<h1>Type {data.slug}: {typeInfo.name}</h1>
		<p class="tagline">{typeInfo.tagline}</p>
	</header>

	<article class="enneagram-type-page">
		<EnneagramTypeIntro type={data.slug} />

		<section class="famous-people">
			<div class="section-header">
				<h2>Famous Type {data.slug}s</h2>
				<span class="people-count">{data.people.length} personalities</span>
			</div>
			<div class="people-grid-container">
				{#each data.people as person}
					<a href="/personality-analysis/{person.slug}" class="grid-item">
						{#if person.enneagram}
							<img
								srcset="{`/types/${person.enneagram}s/s-${person.slug}.webp`} 218w"
								loading="lazy"
								class="grid-img"
								src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
								alt={`${person.slug.split('-').join(' ')} - Enneagram Type ${data.slug}`}
								width="218"
								height="218"
							/>
						{/if}
						<div class="person-name">
							<h3 style:--tag={`h-blog-${person.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}>
								{person.slug.split('-').join(' ')}
							</h3>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<EnneagramTypeBottom type={data.slug} />

		<footer>
			<p class="more-info">More information coming soon about Enneagram Type {data.slug}!</p>
			{#if !data?.user}
				<div class="email-signup">
					<EmailSignup />
				</div>
			{/if}
		</footer>
	</article>
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme - Type Page */
	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
	}

	/* Hero Section */
	.hero {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 2rem;
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
		background: radial-gradient(ellipse, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
		pointer-events: none;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border-radius: 1rem;
		margin-bottom: 1rem;
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.4);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: -2px;
			border-radius: 1.125rem;
			background: linear-gradient(135deg, rgba(167, 139, 250, 0.4) 0%, transparent 50%);
			z-index: -1;
		}
	}

	.type-num {
		font-size: 2rem;
		font-weight: 700;
		color: white;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.hero h1 {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
		position: relative;
		background: linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.tagline {
		font-size: 1rem;
		color: #64748b;
		margin: 0;
		font-weight: 500;
	}

	/* Main Content */
	.enneagram-type-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}

	/* Section Header */
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(100, 116, 139, 0.15);
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #f1f5f9;
		margin: 0;
	}

	.people-count {
		font-size: 0.875rem;
		color: #64748b;
		font-weight: 500;
		padding: 0.375rem 0.75rem;
		background: rgba(124, 58, 237, 0.1);
		border-radius: 2rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
	}

	.famous-people {
		margin-bottom: 3rem;
	}

	.people-grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 1rem;
	}

	.grid-item {
		position: relative;
		border-radius: 0.75rem;
		overflow: hidden;
		background: #16161e;
		border: 1px solid rgba(100, 116, 139, 0.15);
		transition: all 0.25s ease;
		text-decoration: none;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
			opacity: 0;
			transition: opacity 0.25s ease;
			z-index: 1;
		}

		&:hover {
			transform: translateY(-4px);
			border-color: rgba(124, 58, 237, 0.4);
			box-shadow:
				0 12px 28px rgba(0, 0, 0, 0.35),
				0 0 0 1px rgba(124, 58, 237, 0.1);

			&::before {
				opacity: 1;
			}

			.grid-img {
				transform: scale(1.05);
			}

			.person-name {
				background: linear-gradient(
					to top,
					rgba(124, 58, 237, 0.95) 0%,
					rgba(109, 40, 217, 0.8) 100%
				);

				h3 {
					color: white;
				}
			}
		}
	}

	.grid-img {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.person-name {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.6) 100%);
		padding: 0.75rem 0.5rem;
		text-align: center;
		transition: background 0.25s ease;
		z-index: 2;

		h3 {
			color: #e2e8f0;
			font-size: 0.8125rem;
			font-weight: 600;
			margin: 0;
			text-transform: capitalize;
			transition: color 0.25s ease;
			line-height: 1.3;
		}
	}

	footer {
		text-align: center;
		margin-top: 3rem;
		padding: 2.5rem 2rem;
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border-radius: 1rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
		color: #f1f5f9;
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

	.more-info {
		font-style: italic;
		margin-bottom: 1.5rem;
		color: #94a3b8;
		font-size: 0.9375rem;
		position: relative;
	}

	.email-signup {
		max-width: 500px;
		margin: 0 auto;
		position: relative;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.hero {
			padding: 1.5rem 1rem 1.5rem;
		}

		.type-badge {
			width: 3.5rem;
			height: 3.5rem;
		}

		.type-num {
			font-size: 1.75rem;
		}

		.hero h1 {
			font-size: 1.5rem;
		}

		.tagline {
			font-size: 0.875rem;
		}

		.enneagram-type-page {
			padding: 0 1rem 3rem;
		}

		h2 {
			font-size: 1.25rem;
		}

		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
			gap: 0.75rem;
		}

		footer {
			padding: 2rem 1.5rem;
			border-radius: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.hero {
			padding: 1.25rem 1rem 1.25rem;
		}

		.type-badge {
			width: 3rem;
			height: 3rem;
			border-radius: 0.75rem;
		}

		.type-num {
			font-size: 1.5rem;
		}

		.hero h1 {
			font-size: 1.25rem;
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
			gap: 0.5rem;
		}

		.grid-item {
			border-radius: 0.5rem;
		}

		.person-name {
			padding: 0.5rem 0.375rem;

			h3 {
				font-size: 0.6875rem;
			}
		}

		footer {
			padding: 1.5rem 1.25rem;
			margin-top: 2rem;
		}

		.more-info {
			font-size: 0.8125rem;
		}
	}
</style>
