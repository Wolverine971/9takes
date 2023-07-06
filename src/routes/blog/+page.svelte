<script lang="ts">
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import BlogTiles from '$lib/components/molecules/BlogTiles.svelte';
	import type { PageData } from './$types';

	import ObjectsColumnOutlineIcon from '$lib/components/icons/objectsColumnOutlineIcon.svelte';
	import SiteMapIcon from '$lib/components/icons/siteMapIcon.svelte';

	export let data: PageData;

	let structuredView = false;
</script>

<BlogPageHead
	data={{ title: '9takes Blog', description: 'List of blogs about the Enneagram and 9takes' }}
	slug={'/blog'}
/>

<svelte:head>
	<link rel="canonical" href="https://9takes.com/blog" />
</svelte:head>

<div class="btn-container-right">
	<button
		class="view-btn"
		style=""
		on:click={() => {
			structuredView = false;
		}}
	>
		<ObjectsColumnOutlineIcon
			iconStyle={'padding: 0.25rem;'}
			height={'1.5rem'}
			fill={!structuredView ? '#5407d9' : ''}
		/>
	</button>

	<button
		class="view-btn"
		style=""
		on:click={() => {
			structuredView = true;
		}}
	>
		<SiteMapIcon
			iconStyle={'padding: 0.25rem;'}
			height={'1.5rem'}
			fill={structuredView ? '#5407d9' : ''}
		/>
	</button>
</div>

<main class="flex-columns">
	{#if structuredView}
		<section>
			<h2>Enneagram explained</h2>
			<div>
				<h3 id="understanding-the-enneagram-an-introduction">Understanding the Enneagram</h3>
				<ul>
					<!-- <li>History and origins of the Enneagram</li> -->
					<li><a href="/blog/enneagram/enneagram-lineage"> Enneagram lineage </a></li>
					<li><a href="/blog/enneagram/enneagram-tldr"> Enneagram TLDR </a></li>
					<li>
						<a href="/blog/enneagram/enneagram-concepts">
							Concepts and principles of the Enneagram
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-influences">
							Enneagram influences: Differing traditions and schools of thought
						</a>
					</li>
				</ul>
				<h3 id="the-nine-enneagram-types">
					<!-- <a href="#the-nine-enneagram-types">The Nine Enneagram Types</a> -->
					The Nine Enneagram Types
				</h3>
				<ul>
					<li><a href="/blog/enneagram/enneagram-type-1"> Type 1: The Perfectionist </a></li>
					<li><a href="/blog/enneagram/enneagram-type-2"> Type 2: The Helper </a></li>
					<li><a href="/blog/enneagram/enneagram-type-3"> Type 3: The Achiever </a></li>
					<li><a href="/blog/enneagram/enneagram-type-4"> Type 4: The Individualist </a></li>
					<li><a href="/blog/enneagram/enneagram-type-5"> Type 5: The Investigator </a></li>
					<li><a href="/blog/enneagram/enneagram-type-6"> Type 6: The Loyalist </a></li>
					<li><a href="/blog/enneagram/enneagram-type-7"> Type 7: The Enthusiast </a></li>
					<li><a href="/blog/enneagram/enneagram-type-8"> Type 8: The Challenger </a></li>
					<li><a href="/blog/enneagram/enneagram-type-9"> Type 9: The Peacemaker </a></li>
				</ul>
				<h3 id="using-the-enneagram-for-personal-development">
					<!-- <a href="#using-the-enneagram-for-personal-development"
			>Using the Enneagram for Personal Development</a
			> -->
					Using the Enneagram for Personal Development
				</h3>
				<ul>
					<li>
						<a href="/blog/enneagram/enneagram-personality-test">
							How to determine your Enneagram type
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-strengths-and-weaknesses">
							Understanding your strengths and weaknesses
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-self-development"
							>How the Enneagram can be used for personal growth and self-improvement
						</a>
					</li>

					<li>
						<a href="/blog/enneagram/enneagram-personal-growth">
							Strategies for personal growth and self-improvement based on your Enneagram type
						</a>
					</li>
				</ul>
				<h3 id="enneagram-in-relationships">
					<!-- <a href="#enneagram-in-relationships">Enneagram in Relationships</a> -->
					Enneagram in Relationships
				</h3>
				<ul>
					<li>
						<a href="/blog/enneagram/enneagram-types-in-relationships">
							Understanding Enneagram types in relationships
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-communication-overview">
							How to communicate and interact effectively with different Enneagram types
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-communication-tips">
							Enneagram communication tips
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-communication-styles">
							Enneagram communication styles
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-communication-in-relationships">
							Enneagram communication in relationships
						</a>
					</li>
				</ul>
				<h3 id="enneagram-in-the-workplace">
					<!-- <a href="#enneagram-in-the-workplace">Enneagram in the Workplace</a> -->
					Enneagram in the Workplace
				</h3>
				<ul>
					<li>
						<a href="/blog/enneagram/enneagram-workplace-team-building">
							How the Enneagram can be used for team building and leadership development
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-types-working-in-teams">
							Understanding how different Enneagram types work together in teams
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-team-dynamics">
							Using the Enneagram to improve team dynamics and productivity
						</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-team-diversity">
							Harnessing the Power of the Enneagram for Balanced and Diverse Teams
						</a>
					</li>
				</ul>
				<h3 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Resources</a> -->
					Enneagram Resources
				</h3>
				<ul>
					<li>
						<a href="/blog/enneagram/enneagram-faqs"> Enneagram FAQs </a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-books-websites-podcasts">
							Enneagram Books, websites and podcasts
						</a>
					</li>
					<li style="text-decoration: line-through;">Enneagram tests and assessments</li>
					<li style="text-decoration: line-through;">Enneagram coaches and trainers</li>
				</ul>
				<h3 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Situational Topics</a> -->
					Enneagram Situational Topics
				</h3>
				<ul>
					<li>
						<a href="/blog/enneagram/enneagram-types-at-party">Enneagram types at a party</a>
					</li>
					<li>
						<a href="/blog/enneagram/enneagram-types-being-ghosted"
							>Impact of ghosting on mental health: An Enneagram perspective
						</a>
					</li>

					<li>
						<a href="/blog/enneagram/enneagram-types-in-stress"
							>Navigating Stress: How Each Enneagram Type Responds
						</a>
					</li>
				</ul>
				<h3 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Situational Topics</a> -->
					Enneagram Analysis of Famous People
				</h3>
				<ul>
					<li>
						<a href="/blog/famous-enneagram-types">Celebrities, Musicians, and Politicians</a>
					</li>
				</ul>
			</div>
		</section>
		<section>
			<h2>Ideas behind 9takes</h2>
			<div class="column">
				<!-- <h3 style="margin:10px">Why 9takes</h3> -->
				<div>
					<ul>
						<!-- <li>History and origins of the Enneagram</li> -->
						<li><a href="/blog/community/introducing-9takes">Introducing 9takes</a></li>
						<li>
							<a href="/blog/community/inspiration-for-9takes"
								>What was the inspiration for 9takes?</a
							>
						</li>
						<!-- <li>
						<a href="/blog/community/three-sided-die">The Impossible Three Sided Die</a>
					</li> -->
						<li>
							<a href="/blog/community/consensus-on-human-nature">The Consensus on Human Nature</a>
						</li>
					</ul>
					<!-- <p>Coming soon</p> -->
				</div>
			</div>
		</section>
	{:else}
		<div>
			<BlogTiles blogs={data} />
		</div>
	{/if}
</main>

<style lang="scss">
	.btn-container-right {
		display: flex;
		justify-content: flex-end;
	}
	.view-btn {
		margin: 1rem 0 1rem 1rem;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 3rem;
		width: 3rem;
		// margin-left: auto;
		border: var(--classic-border);
		border-radius: 5px;
	}
	.view-btn:hover {
		background-color: lightgrey;
	}
	section {
		flex-basis: calc(50% - 20px);
		margin-bottom: 20px;
		padding: 10px;
		background-color: #f2f2f2;
		border: var(--classic-border);
		box-sizing: border-box;
		border-radius: 0.25rem;
	}
	/* Footer styles */
	footer {
		background-color: #333;
		color: #fff;
		padding: 20px;
		text-align: center;
	}
	/* Media queries */
	@media (max-width: 768px) {
		h2 {
			font-size: 2rem !important;
		}
		.flex-columns {
			flex-wrap: wrap-reverse;
		}
		header h1 {
			font-size: 24px;
		}
		nav li {
			margin: 5px;
		}
		.flex-columns section {
			flex-basis: calc(100% - 20px);
		}
	}
	@media (max-width: 480px) {
		header h1 {
			font-size: 18px;
		}
		.flex-columns section {
			flex-basis: 100%;
		}
	}
</style>
