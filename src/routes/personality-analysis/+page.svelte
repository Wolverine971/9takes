<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	import { onMount } from 'svelte';
	export let data: PageData;

	const categories = [
		'musicians',
		'creators',
		'movie stars',
		'politicians',
		'historical figures',
		'technologists'
	];
	$: innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

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
						"name": "Enneagram Type 1s",
						"description": "Analysis of famous people identified as Enneagram Type 1",
						"url": "https://9takes.com/personality-analysis/type/1"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Enneagram Type 2s",
						"description": "Analysis of famous people identified as Enneagram Type 2",
						"url": "https://9takes.com/personality-analysis/type/2"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "Enneagram Type 3s",
						"description": "Analysis of famous people identified as Enneagram Type 3",
						"url": "https://9takes.com/personality-analysis/type/3"
					},
					{
						"@type": "ListItem",
						"position": 4,
						"name": "Enneagram Type 4s",
						"description": "Analysis of famous people identified as Enneagram Type 4",
						"url": "https://9takes.com/personality-analysis/type/4"
					},
					{
						"@type": "ListItem",
						"position": 5,
						"name": "Enneagram Type 5s",
						"description": "Analysis of famous people identified as Enneagram Type 5",
						"url": "https://9takes.com/personality-analysis/type/5"
					},
					{
						"@type": "ListItem",
						"position": 6,
						"name": "Enneagram Type 6s",
						"description": "Analysis of famous people identified as Enneagram Type 6",
						"url": "https://9takes.com/personality-analysis/type/6"
					},
					{
						"@type": "ListItem",
						"position": 7,
						"name": "Enneagram Type 7s",
						"description": "Analysis of famous people identified as Enneagram Type 7",
						"url": "https://9takes.com/personality-analysis/type/7"
					},
					{
						"@type": "ListItem",
						"position": 8,
						"name": "Enneagram Type 8s",
						"description": "Analysis of famous people identified as Enneagram Type 8",
						"url": "https://9takes.com/personality-analysis/type/8"
					},
					{
						"@type": "ListItem",
						"position": 9,
						"name": "Enneagram Type 9s",
						"description": "Analysis of famous people identified as Enneagram Type 9",
						"url": "https://9takes.com/personality-analysis/type/9"
					}
				]
			},
			"name": "Person Analysis / Character Studies",
			"description": "Explore in-depth Enneagram-based personality analyses of influential figures across various domains including musicians, creators, movie stars, politicians, historical figures, and technologists.",
			"url": "https://9takes.com/personality-analysis",
			"author": {
				"@type": "Organization",
				"name": "9takes",
				"url": "https://9takes.com"
			},
			"additionalProperty": [
				{
					"@type": "PropertyValue",
					"name": "Categories",
					"value": [
						"musicians",
						"creators",
						"movie stars",
						"politicians",
						"historical figures",
						"technologists"
					]
				}
			]
		}
	</script>
</svelte:head>

<BlogPageHead
	data={{
		title: '9takes Analysis of Famous People | Character Studies',
		description:
			'Explore in-depth Enneagram-based personality analyses of influential figures across various domains. Gain unique insights into human behavior and potential.'
	}}
	slug={'personality-analysis'}
/>

<h1>Person Analysis / Character Studies</h1>

<section class="introduction">
	<p>Ever wonder what makes Elon Musk a visionary or Beyoncé a cultural icon?</p>
	<p>
		You're not alone. Here we dissect the personalities of influential figures across various
		domains:
	</p>
	<ul>
		{#each categories as category}
			<li>{category}</li>
		{/each}
	</ul>
	<p>
		We go beyond surface-level chatter, grounding our insights in psychological theories and
		real-life examples. Understanding the nuances of these personalities offers a unique lens into
		human behavior and our own potential. Intrigued? Your exploration into the complex tapestry of
		human personalities starts here.
	</p>
</section>

<section class="enneagram-types">
	{#each Array.from({ length: 9 }, (_, i) => i + 1) as number}
		<div class="enneagram-type">
			<h2 id="type-{number}">Enneagram Type {number}s</h2>
			<div class="people-grid-container">
				{#each data.people
					.filter((p) => p.enneagram === number)
					.slice(0, innerWidth > 960 ? 4 : 5) as person}
					<a
						href="/personality-analysis/{person.slug}"
						class="grid-item"
						aria-label="View analysis of {person.slug.split('-').join(' ')}"
					>
						{#if person.enneagram}
							<img
								srcset="{`/types/${person.enneagram}s/s-${person.slug}.webp`} 218w"
								loading="lazy"
								class="grid-img"
								src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
								alt={person.slug.split('-').join(' ')}
								width="218"
								height="218"
							/>
						{/if}
						<div class="person-name">
							<span>{person.slug.split('-').join(' ')}</span>
						</div>
					</a>
				{/each}
				<a
					href="/personality-analysis/type/{number}"
					class="grid-item view-all"
					aria-label="View all Type {number}s"
				>
					<div class="view-all-content">
						<span>All {number}s</span>
						<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#833bff'} />
					</div>
				</a>
			</div>
		</div>
	{/each}
</section>

{#if !data?.session?.user}
	<section class="join">
		<EmailSignup />
	</section>
{/if}

<style lang="scss">
	h1 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	.introduction {
		margin-bottom: 3rem;

		p {
			font-size: 1.1rem;
			line-height: 1.6;
			margin-bottom: 1rem;
		}

		ul {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			list-style-type: none;
			padding: 0;
			margin-bottom: 1rem;

			li {
				background-color: var(--color-theme-purple-light);
				padding: 0.5rem 1rem;
				border-radius: var(--base-border-radius);
				font-size: 1rem;
			}
		}
	}

	.enneagram-type {
		margin-bottom: 3rem;

		h2 {
			text-align: center;
			font-size: 2rem;
			margin-bottom: 1.5rem;
		}
	}

	.people-grid-container {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1rem;
	}

	.grid-item {
		position: relative;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border-radius: var(--base-border-radius);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
		}
	}

	.grid-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.person-name {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.7);
		color: var(--accent);
		padding: 0.5rem;
		font-size: 0.9rem;
		text-align: center;
	}

	.view-all {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-theme-purple-light);
		font-weight: bold;
	}

	.view-all-content {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 1rem;
	}

	.join {
		margin-top: 3rem;
	}

	@media (max-width: 1024px) {
		.people-grid-container {
			grid-template-columns: repeat(5, 1fr);
		}

		.view-all {
			grid-column: span 1;
		}
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		.introduction p,
		.introduction li {
			font-size: 1rem;
		}

		.enneagram-type h2 {
			font-size: 1.5rem;
			margin-bottom: 1rem;
		}

		.people-grid-container {
			grid-template-columns: repeat(5, 1fr);
			gap: 0.75rem;
		}

		.person-name {
			font-size: 0.8rem;
			padding: 0.3rem;
		}

		.view-all-content {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.person-analysis {
			padding: 1rem 0.5rem;
		}

		h1 {
			font-size: 1.75rem;
			margin-bottom: 1.5rem;
		}

		.introduction {
			margin-bottom: 2rem;

			p {
				font-size: 0.9rem;
				line-height: 1.4;
				margin-bottom: 0.75rem;
			}

			ul {
				gap: 0.3rem;

				li {
					padding: 0.3rem 0.6rem;
					font-size: 0.8rem;
				}
			}
		}

		.enneagram-type {
			margin-bottom: 2rem;

			h2 {
				font-size: 1.25rem;
				margin-bottom: 0.75rem;
			}
		}

		.people-grid-container {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.5rem;
		}

		.person-name {
			font-size: 0.7rem;
			padding: 0.2rem;
		}

		.view-all-content {
			font-size: 0.8rem;
		}
	}
</style>
