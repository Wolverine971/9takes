<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import Layout from '$lib/components/blog/layout.svelte';
	// import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	// import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	// import Card from '$lib/components/atoms/card.svelte';

	export let data: PageData;

	const politicians = data.people.filter((person) => {
		return person.type?.includes('politician');
	});
	const celebrities = data.people.filter((person) => {
		return person.type?.includes('celebrity');
	});
	const historicals = data.people.filter((person) => {
		return person.type?.includes('historical');
	});
	const musicians = data.people.filter((person) => {
		return person.type?.includes('musician');
	});
	const techies = data.people.filter((person) => {
		return person.type?.includes('techie');
	});
	const creators = data.people.filter((person) => {
		return person.type?.includes('creator');
	});
	const lifestyleInfluencer = data.people.filter((person) => {
		return person.type?.includes('lifestyleInfluencer');
	});
	const movieStar = data.people.filter((person) => {
		return person.type?.includes('movieStar');
	});
</script>

<BlogPageHead
	data={{
		title: '9takes Analysis of Famous People',
		description: 'List famous people who have their enneagram type analyzed'
	}}
	slug={'/blog/famous-enneagram-types'}
/>
<svelte:head>
	<link rel="canonical" href="https://9takes.com/blog/famous-enneagram-types" />
</svelte:head>

<h1 style="text-align: center;">Person Analysis/ Character Studies</h1>

<p>
	Ever ponder the traits that make Elon Musk a visionary or Beyoncé a cultural icon? You're not
	alone. This blog dissects the personalities of influential figures across various domains—tech,
	politics, entertainment, and more. We go beyond surface-level chatter, grounding our insights in
	psychological theories and real-life examples. Why does this matter? Because understanding the
	nuances of these personalities can offer a unique lens into human behavior and our own potential.
	Intrigued? Your exploration into the complex tapestry of human personalities starts here.
</p>
<div class="blog-list tile-display">
	<h3 class="position-center">Celebrities</h3>
	<div class="people-grid-container">
		{#each celebrities as person}
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
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Musicians/ Artists</h3>

	<div class="people-grid-container">
		{#each musicians as person}
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
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Creators</h3>
	<div class="people-grid-container">
		{#each creators as person}
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
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Politicians</h3>
	<div class="people-grid-container">
		{#each politicians as person}
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
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Historical Figures</h3>
	<div class="people-grid-container">
		{#each historicals as person}
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
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>
	<h3 class="position-center">Movie Stars</h3>
	<div class="people-grid-container">
		{#each movieStar as person}
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
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<!-- <h3 class="position-center">Techies</h3>
	<ul>
		{#each techies as person}
			<li>
				<a href={`/blog/famous-enneagram-types/${person.slug}`}>
					{person.slug.split('-').join(' ')}
				</a>
			</li>
		{/each}
	</ul> -->
	<h3 class="position-center">Techies</h3>
	<div class="people-grid-container">
		{#each techies as person}
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
				<div class="card fit-card txt-white border-0 ">
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

		.preview {
			text-overflow: clip;
			white-space: nowrap;
			overflow-x: clip;
			overflow: hidden;
		}
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
