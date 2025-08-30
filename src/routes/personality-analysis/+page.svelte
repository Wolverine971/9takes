<!-- src/routes/personality-analysis/+page.svelte -->
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

	onMount(() => {
		
	});
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

<div class="personality-analysis-page">


<div class="content-wrapper">
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
		<p>
			In order to understand what makes you tick it is helpful to understand what makes other people
			tick.
		</p>
		<p>Here we dissect the personalities of influential figures across various domains.</p>
		<ul>
			{#each categories as category}
				<li>{category}</li>
			{/each}
		</ul>
		<p>
			Going beyond surface-level observations we ground our insights in psychological theories and
			real-life examples. When you start to understand the nuances of these personalities you
			develop sharp perspective on human behavior and our own potential.
		</p>
	</section>

	<section class="enneagram-types">
		{#each Array.from({ length: 9 }, (_, i) => i + 1) as number}
			<div class="enneagram-type">
				<h2 id="type-{number}">Enneagram Type {number}s</h2>
				<div class="people-grid-container">
					{#each data.people
						.filter((p) => parseInt(p.enneagram) === number)
						.slice(0, 5) as person}
						<a
							href="/personality-analysis/{person.slug}"
							class="grid-item"
							aria-label="View analysis of {person.slug.split('-').join(' ')}"
							style:--tag={`h-blog-${person.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
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
							<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'white'} />
						</div>
					</a>
				</div>
			</div>
		{/each}
	</section>

	{#if !data?.user}
		<section class="join">
			<EmailSignup />
		</section>
	{/if}
</div>
</div>

<style lang="scss">
	// Page wrapper to isolate styles
	.personality-analysis-page {
		// Reset global styles that might interfere
		article {
			margin: 0;
			padding: 0;
			border-radius: 0;
		}
		
		a {
			&::after {
				display: none;
			}
		}
	}


	.content-wrapper {
		position: relative;
		z-index: 1;
		background: rgba(255, 255, 255, 0.98);
		min-height: 100vh;
		padding: 2rem 1.5rem;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
		max-width: 1400px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		font-size: 2.5rem;
		margin: 3rem auto 2rem;
		max-width: 900px;
		color: #2d3436;
		line-height: 1.3;
		font-weight: 700;
	}

	.introduction {
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
		border-radius: 20px;
		padding: 3rem;
		margin: 2rem auto 3rem;
		max-width: 1200px;
		color: white;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

		p {
			font-size: 1.1rem;
			line-height: 1.6;
			margin-bottom: 1rem;
			opacity: 0.95;
		}

		ul {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1rem;
			list-style-type: none;
			padding: 0;
			margin: 2rem 0;

			li {
				background: rgba(255, 255, 255, 0.1);
				backdrop-filter: blur(10px);
				padding: 0.75rem 1rem;
				border-radius: 12px;
				text-align: center;
				border: 1px solid rgba(255, 255, 255, 0.2);
				font-weight: 500;
				transition: all 0.3s ease;
				
				&:hover {
					background: rgba(255, 255, 255, 0.15);
					transform: translateY(-2px);
				}
			}
		}
	}

	.enneagram-type {
		margin-bottom: 4rem;
		padding: 0 1.5rem;

		h2 {
			font-size: 1.875rem;
			font-weight: 700;
			margin-bottom: 2rem;
			color: #2d3436;
			letter-spacing: -0.02em;
		}
	}

	.people-grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 1.5rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.grid-item {
		position: relative;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border-radius: 12px;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		border: 1px solid rgba(0, 0, 0, 0.06);
		text-decoration: none !important;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
			border-color: rgba(108, 92, 231, 0.2);
			
			.person-name {
				background: linear-gradient(
					to top,
					rgba(0, 0, 0, 0.95) 0%,
					rgba(0, 0, 0, 0.8) 100%
				);
			}
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
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.9) 0%,
			rgba(0, 0, 0, 0.7) 100%
		);
		color: white;
		padding: 0.75rem;
		font-size: 0.9rem;
		text-align: center;
		font-weight: 500;
		transition: all 0.3s ease;
		
		span {
			text-transform: capitalize;
		}
	}

	.view-all {
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-weight: 600;
		
		&:hover {
			background: linear-gradient(135deg, #3d4447 0%, #2a2a3e 100%);
			border-color: rgba(255, 255, 255, 0.15);
			
			.view-all-content {
				color: #a29bfe;
			}
		}
	}

	.view-all-content {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 1.1rem;
		color: white;
		transition: all 0.3s ease;
	}

	.join {
		margin-top: 3rem;
	}

	@media (max-width: 1024px) {
		.people-grid-container {
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(2, 1fr);
			gap: 1rem;
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
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(3, 1fr);
			gap: 0.75rem;
		}

		.person-name {
			font-size: 0.8rem;
			padding: 0.5rem 0.3rem;
		}

		.view-all-content {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 1.75rem;
			margin-bottom: 1.5rem;
		}

		.introduction {
			margin-bottom: 2rem;
			padding: 2rem 1.5rem;

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
			padding: 0 0.75rem;

			h2 {
				font-size: 1.25rem;
				margin-bottom: 0.75rem;
			}
		}

		.people-grid-container {
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(3, 1fr);
			gap: 0.5rem;
		}

		.grid-item {
			border-radius: 8px;
		}

		.person-name {
			font-size: 0.7rem;
			padding: 0.4rem 0.2rem;
			line-height: 1.2;
		}

		.view-all-content {
			font-size: 0.8rem;
			
			span {
				display: block;
			}
		}
	}
</style>
