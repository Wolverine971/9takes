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
						<h3>{person.slug.split('-').join(' ')}</h3>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<EnneagramTypeBottom type={data.slug} />

	<footer>
		<p class="more-info">🚧 More information coming soon about Enneagram Type {data.slug}!</p>
		{#if !data?.session?.user}
			<div class="email-signup">
				<EmailSignup />
			</div>
		{/if}
	</footer>
</article>

<style lang="scss">
	.enneagram-type-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h2 {
		font-size: 2rem;
		color: var(--text-color);
		margin-top: 2rem;
		margin-bottom: 1rem;
		text-align: center;
	}

	.famous-people {
		margin-bottom: 3rem;
	}

	.people-grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1.25rem;
	}

	.grid-item {
		position: relative;
		border-radius: var(--base-border-radius);
		overflow: hidden;
		transition: transform 0.3s ease, box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		}
	}

	.grid-img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	.person-name {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 0.5rem;
		text-align: center;

		h3 {
			color: var(--accent);
			font-size: 1rem;
			margin: 0;
		}
	}

	footer {
		text-align: center;
		margin-top: 3rem;
	}

	.more-info {
		font-style: italic;
		margin-bottom: 1rem;
	}

	.email-signup {
		max-width: 500px;
		margin: 0 auto;
	}

	@media (max-width: 768px) {
		h2 {
			font-size: 1.5rem;
		}

		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		}
	}

	@media (max-width: 480px) {
		.people-grid-container {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}

		.person-name h3 {
			font-size: 0.8rem;
		}
	}
</style>
