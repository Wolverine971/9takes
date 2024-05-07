<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import EnneagramTypeIntro from '$lib/components/blog/EnneagramTypeIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: PageData;
</script>

<BlogPageHead
	data={{
		title: `9takes Analysis of Famous Enneagram Type ${data.slug}s`,
		description: 'List famous people who have their enneagram type analyzed'
	}}
	slug={'blog/famous-enneagram-types/type/' + data.slug}
/>

<EnneagramTypeIntro type={data.slug} />

<div class="blog-list tile-display">
	<h3 class="position-center">Famous Enneagram Type {data?.slug}s</h3>
	<div class="people-grid-container">
		{#each data.people as person}
			<a href="/blog/famous-enneagram-types/{person.slug}" class="grid-item">
				{#if person.enneagram}
					<img
						srcset="{`/types/${person.enneagram}s/s-${person.slug}.webp`} 218w"
						loading="lazy"
						class="grid-img"
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="fit-card txt-white">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<br />
	<hr />
	<br />
	<p class="position-center">🚧 More to come</p>
	{#if !data?.session?.user}
		<div class="join position-center">
			<EmailSignup />
		</div>
	{/if}
</div>

<style lang="scss">
	h3 {
		margin-top: 1rem;
		text-decoration: underline;
	}
	.position-center {
		text-align: center;
		margin: 1rem auto;
	}

	.section-content {
		border-right: solid;
		margin: 10px;
		padding: 10px;
	}

	.section-meta {
		margin: 10px;
		padding: 10px;
		transform: rotate(90deg);
	}
	.blog-list {
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	p {
		font-size: 1rem;
	}
	a::after {
		display: none !important;
	}
	a:hover {
		text-decoration: none;
		filter: sepia(100%) hue-rotate(160deg);
		border: 1px solid var(--color-theme-purple) !important;
	}

	.inline-it {
		display: inline-block;
	}

	.grid-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 5px;
	}

	.people-grid-container {
		width: 100%;
		display: grid;
		/* grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); */
		grid-template-columns: 1fr 1fr 1fr;
		column-count: 3;
		column-gap: 1.25rem;
		grid-gap: 0.5rem;
		/* padding: 20px; */
		/* column-count: 3;
		column-gap: 0.5rem;
		orphans: 1; */
	}

	.people-grid-container .grid-item {
		overflow: hidden;
		word-break: normal;
		background-color: rgba(255, 255, 255, 0.5);
		text-align: center;
		border: var(--classic-border);
		border-radius: 5px;
		position: relative;
		max-height: 220px;
	}

	@media (max-width: 550px) {
		h3 {
			font-size: 1rem;
		}
		p {
			font-size: 0.7rem;
		}
		.people-grid-container {
			grid-template-columns: 30vw 30vw 30vw;
		}
	}
</style>
