<script lang="ts">
	import type { PageData } from './$types';
	import PageHead from '$lib/components/blog/PageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleMeta from '$lib/components/blog/ArticleMeta.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
</script>

<PageHead data={{ title: '9takes Blog', description: 'List of blogs' }} slug={'/'} />

<h1 style="text-align: center;">9takes Blogs</h1>
<div class=" blog-list">
	<div class="row">
		<div class="column">
			<h2 style="margin:10px">Enneagram Overview</h2>
			<div>
				<h2 id="understanding-the-enneagram-an-introduction">
					<!-- <a href="#understanding-the-enneagram-an-introduction"
			>Understanding the Enneagram: An Introduction</a
			> -->
					Understanding the Enneagram: An Introduction
				</h2>
				<ul>
					<!-- <li>History and origins of the Enneagram</li> -->
					<li><a href="/blog/enneagram-lineage"> Enneagram Lineage &rarr;</a></li>
					<li><a href="/blog/tldr-enneagram"> Enneagram TLDR &rarr;</a></li>
					<li style="text-decoration: line-through;">
						Key concepts and principles of the Enneagram
					</li>
					<li style="text-decoration: line-through;">
						How the Enneagram can be used for personal growth and self-improvement
					</li>
				</ul>
				<h2 id="the-nine-enneagram-types">
					<!-- <a href="#the-nine-enneagram-types">The Nine Enneagram Types</a> -->
					The Nine Enneagram Types
				</h2>
				<ul>
					<li><a href="/blog/1"> Type 1: The Perfectionist &rarr; </a></li>
					<li><a href="/blog/2"> Type 2: The Helper &rarr; </a></li>
					<li><a href="/blog/3"> Type 3: The Achiever &rarr; </a></li>
					<li><a href="/blog/4"> Type 4: The Individualist &rarr; </a></li>
					<li><a href="/blog/5"> Type 5: The Investigator &rarr; </a></li>
					<li><a href="/blog/6"> Type 6: The Loyalist &rarr; </a></li>
					<li><a href="/blog/7"> Type 7: The Enthusiast &rarr; </a></li>
					<li><a href="/blog/8"> Type 8: The Challenger &rarr; </a></li>
					<li><a href="/blog/9"> Type 9: The Peacemaker &rarr; </a></li>
				</ul>
				<h2 id="using-the-enneagram-for-personal-development">
					<!-- <a href="#using-the-enneagram-for-personal-development"
			>Using the Enneagram for Personal Development</a
			> -->
					Using the Enneagram for Personal Development
				</h2>
				<ul>
					<li style="text-decoration: line-through;">How to determine your Enneagram type</li>
					<li style="text-decoration: line-through;">
						Understanding your strengths and weaknesses as an Enneagram type
					</li>
					<li style="text-decoration: line-through;">
						Strategies for personal growth and self-improvement based on your Enneagram type
					</li>
				</ul>
				<h2 id="enneagram-in-relationships">
					<!-- <a href="#enneagram-in-relationships">Enneagram in Relationships</a> -->
					Enneagram in Relationships
				</h2>
				<ul>
					<li style="text-decoration: line-through;">
						Understanding how your Enneagram type affects your relationships
					</li>
					<li style="text-decoration: line-through;">
						How to communicate and interact effectively with different Enneagram types
					</li>
					<li style="text-decoration: line-through;">
						Using the Enneagram to improve communication and intimacy in relationships
					</li>
				</ul>
				<h2 id="enneagram-in-the-workplace">
					<!-- <a href="#enneagram-in-the-workplace">Enneagram in the Workplace</a> -->
					Enneagram in the Workplace
				</h2>
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
				<h2 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Resources</a> -->
					Enneagram Resources
				</h2>
				<ul>
					<li><a href="/blog/faq">Enneagram FAQ &rarr;</a></li>
					<li style="text-decoration: line-through;">
						Books and websites for learning more about the Enneagram
					</li>
					<li style="text-decoration: line-through;">Enneagram tests and assessments</li>
					<li style="text-decoration: line-through;">Enneagram coaches and trainers</li>
				</ul>

				<h2 id="enneagram-resources">
					<!-- <a href="#enneagram-resources">Enneagram Situational Topics</a> -->
					Enneagram Situational Topics
				</h2>
				<ul>
					<li><a href="/blog/enneagram-types-at-party">Enneagram Types at a Party &rarr;</a></li>
					<li>
						<a href="/blog/ghosting-the-types"
							>Impact of Ghosting on Mental Health: An Enneagram Perspective &rarr;</a
						>
					</li>
				</ul>
			</div>
		</div>

		<div class="column">
			<h2 style="margin:10px">Why 9takes</h2>
			<div>
				<p>Coming soon</p>
			</div>
		</div>
	</div>
</div>
<!-- <div class="blog-list">
	<div class="row">
		<div class="column">
			{#each data?.posts.slice(0, Math.ceil(data?.posts.length / 2)) as { slug, title, author, description, date }}
				<div class="article-preview">
					<Card>
						<a href={`/blog/${slug}`} class="big-a">
							<h3 class="preview" {title}>
								{title}
							</h3>
							<p class="preview" title={description}>
								{description}

								<span>Read More &rarr;</span>
							</p>
							<p class="preview">
								<span class="author">{author}</span>
								<span class="date">{new Date(date).toDateString()}</span>
							</p>
						</a>
					</Card>
				</div>
			{/each}
		</div>
		<div class="column">
			{#each data?.posts.slice(Math.ceil(data?.posts.length / 2)) as { slug, title, author, description, date }}
				<div class="article-preview">
					<Card>
						<a href={`/blog/${slug}`} class="big-a">
							<h3 class="preview" {title}>
								{title}
							</h3>
							<p class="preview" title={description}>
								{description}

								<span>Read More &rarr;</span>
							</p>
							<p class="preview">
								<span class="author">{author}</span>
								<span class="date">{new Date(date).toDateString()}</span>
							</p>
						</a>
					</Card>
				</div>
			{/each}
		</div>
	</div>
</div> -->

<slot />

<style lang="scss">
	.section-main {
		display: flex;
		justify-content: center;
		align-items: center;
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
		align-items: inherit;
		margin: 1rem;

		// .row {
		// 	display: flex;
		// 	justify-content: space-around;
		// }
		.big-a:hover {
			text-decoration: none;
		}
		.article-preview {
			max-width: none;
			height: clamp(1rem, 145px, 12rem);
			width: clamp(1rem, 345px, 32rem);
		}
		.preview {
			text-overflow: clip;
			white-space: nowrap;
			overflow-x: clip;
			overflow: hidden;
		}
		.row {
			display: flex;
			flex-direction: row;
			justify-content: center;
			flex-wrap: wrap;
			width: 100%;
			padding: 0 10%;
		}

		.column {
			display: flex;
			flex-direction: column;
			flex-basis: 100%;
			flex: 1;
			align-items: center;
		}

		@media all and (max-width: 576px) {
			.row {
				display: flex;
				flex-direction: column;
				width: 100%;
				padding: 0 10%;
			}

			.column {
				display: flex;
				flex-direction: column;
				flex-basis: 100%;
				flex: 1;
				align-items: center;
			}
		}
	}
</style>
