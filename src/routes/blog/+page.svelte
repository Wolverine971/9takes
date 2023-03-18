<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleMeta from '$lib/components/blog/ArticleMeta.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import Card from '$lib/components/atoms/card.svelte';
	import Jumbotron from '$lib/components/atoms/jumbotron.svelte';
	// export let data: PageData;
</script>

<BlogPageHead data={{ title: '9takes Blog', description: 'List of blogs' }} slug={'/'} />

<body>
	<!-- <Jumbotron
		image={'background2.png'}
		showIcon={false}
		text={'9takes Blogs'}
		subtext={''}
		aspectRatio={'16/5'}
	/> -->
	<main>
		<section>
			<h2>Enneagram</h2>
			<div>
				<h3 id="understanding-the-enneagram-an-introduction">
					<!-- <a href="#understanding-the-enneagram-an-introduction"
			>Understanding the Enneagram: An Introduction</a
			> -->
					Understanding the Enneagram: An Introduction
				</h3>
				<ul>
					<!-- <li>History and origins of the Enneagram</li> -->
					<li><a href="/blog/enneagram-lineage"> Enneagram Lineage </a></li>
					<li><a href="/blog/tldr-enneagram"> Enneagram TLDR </a></li>
					<li>
						<a href="/blog/enneagram-concepts"> Concepts and principles of the Enneagram </a>
					</li>
					<li style="text-decoration: line-through;">
						How the Enneagram can be used for personal growth and self-improvement
					</li>
				</ul>
				<h3 id="the-nine-enneagram-types">
					<!-- <a href="#the-nine-enneagram-types">The Nine Enneagram Types</a> -->
					The Nine Enneagram Types
				</h3>
				<ul>
					<li><a href="/blog/1"> Type 1: The Perfectionist </a></li>
					<li><a href="/blog/2"> Type 2: The Helper </a></li>
					<li><a href="/blog/3"> Type 3: The Achiever </a></li>
					<li><a href="/blog/4"> Type 4: The Individualist </a></li>
					<li><a href="/blog/5"> Type 5: The Investigator </a></li>
					<li><a href="/blog/6"> Type 6: The Loyalist </a></li>
					<li><a href="/blog/7"> Type 7: The Enthusiast </a></li>
					<li><a href="/blog/8"> Type 8: The Challenger </a></li>
					<li><a href="/blog/9"> Type 9: The Peacemaker </a></li>
				</ul>
				<h3 id="using-the-enneagram-for-personal-development">
					<!-- <a href="#using-the-enneagram-for-personal-development"
			>Using the Enneagram for Personal Development</a
			> -->
					Using the Enneagram for Personal Development
				</h3>
				<ul>
					<li>
						<a href="/blog/enneagram-personality-test"> How to determine your Enneagram type</a>
					</li>
					<li style="text-decoration: line-through;">
						Understanding your strengths and weaknesses as an Enneagram type
					</li>
					<li style="text-decoration: line-through;">
						Strategies for personal growth and self-improvement based on your Enneagram type
					</li>
				</ul>
				<h3 id="enneagram-in-relationships">
					<!-- <a href="#enneagram-in-relationships">Enneagram in Relationships</a> -->
					Enneagram in Relationships
				</h3>
				<ul>
					<li>
						<a href="/blog/enneagram-types-in-relationships">
							Understanding Enneagram types in relationships
						</a>
					</li>
					<li style="text-decoration: line-through;">
						How to communicate and interact effectively with different Enneagram types
					</li>
					<li style="text-decoration: line-through;">
						Using the Enneagram to improve communication and intimacy in relationships
					</li>
				</ul>
				<h3 id="enneagram-in-the-workplace">
					<!-- <a href="#enneagram-in-the-workplace">Enneagram in the Workplace</a> -->
					Enneagram in the Workplace
				</h3>
				<ul>
					<li style="text-decoration: line-through;">
						How the Enneagram can be used for team building and leadership development
					</li>
					<li style="text-decoration: line-through;">
						Understanding how different Enneagram types work together in teams
					</li>
					<li style="text-decoration: line-through;">
						Using the Enneagram to improve team dynamics and productivity
					</li>
				</ul>
				<h3 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Resources</a> -->
					Enneagram Resources
				</h3>
				<ul>
					<li><a href="/blog/faq">Enneagram FAQ </a></li>
					<li style="text-decoration: line-through;">
						Books and websites for learning more about the Enneagram
					</li>
					<li style="text-decoration: line-through;">Enneagram tests and assessments</li>
					<li style="text-decoration: line-through;">Enneagram coaches and trainers</li>
				</ul>

				<h3 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Situational Topics</a> -->
					Enneagram Situational Topics
				</h3>
				<ul>
					<li><a href="/blog/enneagram-types-at-party">Enneagram Types at a Party</a></li>
					<li>
						<a href="/blog/ghosting-the-types"
							>Impact of Ghosting on Mental Health: An Enneagram Perspective
						</a>
					</li>
				</ul>

				<h3 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Situational Topics</a> -->
					Enneagram Analysis of Famous People
				</h3>
				<ul>
					<li><a href="/blog/people">Celebrities, Musicians, and Politicians</a></li>
				</ul>
			</div>
		</section>
		<section>
			<h2>9takes</h2>
			<div class="column">
				<h3 style="margin:10px">Why 9takes</h3>
				<div>
					<p>Coming soon</p>
				</div>
			</div>
		</section>
	</main>
</body>

<style>
	body {
		/* font-family: 'Motiva Sans', Sans-serif; */
		/* font-family: Arial, sans-serif; */
		/* margin: 0;
		padding: 0; */
	}
	h1,
	h2 {
		margin-top: 0;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	a {
		color: #333;
		text-decoration: none;
	}
	/* Header styles */
	header {
		background-color: #333;
		background-image: url('/background.png');
		color: #fff;
		padding: 20px;
	}
	/* Navigation styles */
	nav {
		background-color: #f2f2f2;
		border-bottom: 1px solid #5407d9;
		padding: 10px;
	}
	nav ul {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}
	nav li {
		margin: 10px;
	}
	/* Main content styles */
	main {
		margin: 20px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	section {
		flex-basis: calc(50% - 20px);
		margin-bottom: 20px;
		padding: 10px;
		background-color: #f2f2f2;
		border: 1px solid #5407d9;
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
		header h1 {
			font-size: 24px;
		}
		nav li {
			margin: 5px;
		}
		main section {
			flex-basis: calc(100% - 20px);
		}
	}
	@media (max-width: 480px) {
		header h1 {
			font-size: 18px;
		}
		main section {
			flex-basis: 100%;
		}
	}
</style>
