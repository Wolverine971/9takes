<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	export let data: PageData;
</script>

<BlogPageHead
	data={{
		title: '9takes Analysis of Famous People',
		description: 'List famous people who have their enneagram type analyzed'
	}}
	slug={'blog/famous-enneagram-types'}
/>

<h1 style="text-align: center;">Person Analysis/ Character Studies</h1>

<p>Ever wonder what makes Elon Musk a visionary or Beyoncé a cultural icon?</p>

<p>
	You're not alone. Here we dissects the personalities of influential figures across various
	domains.
</p>
<ul>
	<li>musicians</li>
	<li>creators</li>
	<li>movie stars</li>
	<li>politicians</li>
	<li>historical figures</li>
	<li>technologists</li>
</ul>
politics, entertainment, and more.

<p>
	We go beyond surface-level chatter, grounding our insights in psychological theories and real-life
	examples. Why does this matter? Because understanding the nuances of these personalities can offer
	a unique lens into human behavior and our own potential. Intrigued? Your exploration into the
	complex tapestry of human personalities starts here.
</p>
<div class="blog-list tile-display">
	{#each Array.from(Array(10).keys()) as number}
		{#if number !== 0}
			<h3 class="position-center">Famous Enneagram type {number}</h3>
			<div class="people-grid-container">
				{#each data.people.filter((p) => p.enneagram === number) as person}
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
				<a href="/blog/famous-enneagram-types/type/{number}" class="grid-item">
					<div class="fit-card black-white">
						<h3 style="">
							<span>All {number}s </span>
							<br />
							<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
						</h3>
					</div>
				</a>
			</div>
		{/if}
	{/each}
</div>
<br />
<hr />
<br />
{#if !data?.session?.user}
	<div class="join">
		<EmailSignup />
	</div>
{/if}

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
		grid-template-columns: 1fr 1fr 1fr 0.5fr;
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
		&:hover {
			text-decoration: none;
			filter: sepia(100%) hue-rotate(160deg);
			border: 1px solid var(--color-theme-purple) !important;
		}
		
	}

	@media (max-width: 550px) {
		h3 {
			font-size: 1rem;
		}
		p {
			font-size: 0.7rem;
		}
		.people-grid-container {
			grid-template-columns: 21vw 21vw 21vw 15vw;
			// gap: 0;
		}
	}
</style>
