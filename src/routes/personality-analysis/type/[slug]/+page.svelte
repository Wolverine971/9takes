<!-- src/routes/personality-analysis/type/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import EnneagramTypeIntro from '$lib/components/blog/EnneagramTypeIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import EnneagramTypeBottom from '$lib/components/blog/EnneagramTypeBottom.svelte';

	export let data: PageData;

	const enneagramTypes = {
		'1': 'The Perfectionist',
		'2': 'The Helper',
		'3': 'The Achiever',
		'4': 'The Individualist',
		'5': 'The Investigator',
		'6': 'The Loyalist',
		'7': 'The Enthusiast',
		'8': 'The Challenger',
		'9': 'The Peacemaker'
	};

	$: typeTitle = enneagramTypes[data.slug] || '';
</script>

<BlogPageHead
	data={{
		title: `Enneagram Type ${data.slug}: ${typeTitle} - 9takes Analysis of Famous People`,
		description: `Explore characteristics and famous examples of Enneagram Type ${data.slug} (${typeTitle}). Discover how this personality type manifests in various aspects of life.`
	}}
	slug={`personality-analysis/type/${data.slug}`}
/>

<article class="enneagram-type-page">
	<EnneagramTypeIntro type={data.slug} />

	<section class="famous-people">
		<h2>Famous Enneagram Type {data.slug}s</h2>
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
		<p class="more-info">🚧 More information coming soon about Enneagram Type {data.slug}!</p>
		{#if !data?.user}
			<div class="email-signup">
				<EmailSignup />
			</div>
		{/if}
	</footer>
</article>

<style lang="scss">
	/* Style Guide Compliant Styles */
	.enneagram-type-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	h2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #2d3436;
		margin-top: 2rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.famous-people {
		margin-bottom: 4rem;
	}

	.people-grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1.5rem;
	}

	.grid-item {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
			border-color: rgba(108, 92, 231, 0.2);

			.person-name {
				background: linear-gradient(
					to top,
					rgba(108, 92, 231, 0.95) 0%,
					rgba(108, 92, 231, 0.8) 100%
				);
			}
		}
	}

	.grid-img {
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.person-name {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%);
		padding: 0.75rem;
		text-align: center;
		transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		h3 {
			color: white;
			font-size: 0.9rem;
			font-weight: 600;
			margin: 0;
			text-transform: capitalize;
		}
	}

	footer {
		text-align: center;
		margin-top: 4rem;
		padding: 3rem;
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
		border-radius: 20px;
		color: white;
	}

	.more-info {
		font-style: italic;
		margin-bottom: 2rem;
		color: rgba(255, 255, 255, 0.95);
		font-size: 0.9rem;
	}

	.email-signup {
		max-width: 500px;
		margin: 0 auto;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		h2 {
			font-size: 1.5rem;
		}

		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 1rem;
		}

		footer {
			padding: 2rem 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		}

		.person-name h3 {
			font-size: 0.8rem;
		}
	}
</style>
